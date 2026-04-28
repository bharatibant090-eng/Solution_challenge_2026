from flask import Flask, request, jsonify
from flask_cors import CORS                  # ← add this
from datetime import datetime
from Ai_handler import process_request
from Utils import assign_volunteer

app = Flask(__name__)
CORS(app)                                    # ← add this

# rest of your code stays the same...

# In-memory storage
requests_store = []


@app.route("/submit-request", methods=["POST"])
def submit_request():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field in request body"}), 400

    user_text = data["text"].strip()
    if not user_text:
        return jsonify({"error": "'text' field cannot be empty"}), 400

    # AI processing
    ai_result = process_request(user_text)

    # Volunteer assignment
    volunteer = assign_volunteer(ai_result["request_type"])

    # Build response
    response = {
        "request_type": ai_result["request_type"],
        "people": ai_result.get("people"),
        "priority": ai_result["priority"],
        "assigned_volunteer": volunteer,
        "timestamp": datetime.utcnow().isoformat() + "Z",
        "original_text": user_text,
    }

    # Store in memory
    requests_store.append(response)

    return jsonify(response), 200


@app.route("/get-requests", methods=["GET"])
def get_requests():
    return jsonify({
        "total": len(requests_store),
        "requests": requests_store
    }), 200


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "AI Request Management System"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)