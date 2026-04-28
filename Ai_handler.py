import os
import json
import re
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

FALLBACK_RESPONSE = {
    "request_type": "other",
    "people": None,
    "priority": "medium",
}

VALID_TYPES = {"food", "medical", "rescue", "utilities", "other"}
VALID_PRIORITIES = {"low", "medium", "high"}


def process_request(user_text: str) -> dict:
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a structured data extractor. "
                        "You ALWAYS respond with ONLY a raw JSON object — no markdown, "
                        "no explanation, no code fences, no extra text whatsoever. "
                        "Just the JSON object and nothing else."
                        "Even if the request is unclear, infer the most likely category."
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Extract data from this emergency request: \"{user_text}\"\n\n"
                        "Return a JSON object with exactly these fields:\n"
                        "- request_type: one of 'food', 'medical', 'rescue', 'utilities', 'other'\n"
                        "- people: integer count of people mentioned, or null\n"
                        "- priority: one of 'low', 'medium', 'high'\n\n"
                        "Examples:\n"
                        "'We need food for 50 people' → {\"request_type\": \"food\", \"people\": 50, \"priority\": \"high\"}\n"
                        "'Someone is injured' → {\"request_type\": \"medical\", \"people\": 1, \"priority\": \"high\"}\n"
                        "'People are trapped' → {\"request_type\": \"rescue\", \"people\": null, \"priority\": \"high\"}\n"
                        "'No electricity and water for 30 people' → {\"request_type\": \"utilities\", \"people\": 30, \"priority\": \"high\"}\n"
                    ),
                },
            ],
            temperature=0,  # deterministic output
        )

        raw_text = response.choices[0].message.content.strip()

        # Debug — remove this line after confirming it works
        print(f"[AI RAW RESPONSE]: {raw_text}")

        parsed = extract_json(raw_text)
        return sanitize(parsed)

    except Exception as e:
        print(f"[AI ERROR] {e}")
        return FALLBACK_RESPONSE.copy()


def extract_json(text: str) -> dict:
    """
    Robustly extract JSON from model output regardless of
    whether it has markdown fences, extra text, etc.
    """
    # 1. Try parsing directly (clean response)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # 2. Try extracting content inside ```json ... ``` or ``` ... ```
    fence_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, re.DOTALL)
    if fence_match:
        try:
            return json.loads(fence_match.group(1))
        except json.JSONDecodeError:
            pass

    # 3. Try finding any {...} block in the text
    brace_match = re.search(r"\{.*?\}", text, re.DOTALL)
    if brace_match:
        try:
            return json.loads(brace_match.group())
        except json.JSONDecodeError:
            pass

    # All extraction attempts failed
    print(f"[PARSE ERROR] Could not extract JSON from: {text}")
    return FALLBACK_RESPONSE.copy()


def sanitize(data: dict) -> dict:
    request_type = str(data.get("request_type", "other")).lower().strip()
    if request_type not in VALID_TYPES:
        request_type = "other"

    priority = str(data.get("priority", "medium")).lower().strip()
    if priority not in VALID_PRIORITIES:
        priority = "medium"

    raw_people = data.get("people")
    try:
        people = int(raw_people) if raw_people is not None else None
    except (ValueError, TypeError):
        people = None

    return {
        "request_type": request_type,
        "people": people,
        "priority": priority,
    }