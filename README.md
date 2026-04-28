# 🆘 AI Emergency Request Management System

> An AI-powered platform that classifies emergency requests in real time, assigns priority levels, and routes them to the right volunteer — built for **Solution Challenge 2026**.

![Python](https://img.shields.io/badge/Python-3.11-blue) ![Flask](https://img.shields.io/badge/Flask-3.0.3-lightgrey) ![React](https://img.shields.io/badge/React-18-61dafb) ![Groq](https://img.shields.io/badge/AI-Groq%20LLaMA%203.3-orange) ![License](https://img.shields.io/badge/license-MIT-green)

---

## 📸 Preview

> Submit an emergency request → AI classifies it → Volunteer gets assigned instantly.

---

## ✨ Features

- 🤖 **AI Classification** — Understands natural language using Groq (LLaMA 3.3-70b)
- 🚨 **Auto Priority** — Assigns `low` / `medium` / `high` urgency automatically
- 👤 **Volunteer Routing** — Maps each request type to the right volunteer
- 🌐 **REST API** — Clean Flask endpoints, easy to integrate with any frontend
- ⚛️ **React Frontend** — Live UI to submit and track all requests
- 💾 **In-memory Storage** — No database needed, hackathon-ready
- 🛡️ **Error Handling** — Graceful fallback if AI fails

---

## 🧱 Project Structure

```
Solution_challenge_2026/
│
├── App.py                  # Flask routes & server
├── Ai_handler.py           # Groq AI integration & JSON parsing
├── Utils.py                # Volunteer assignment logic
├── requirements.txt        # Python dependencies
├── .env                    # API keys (never commit this)
├── .env.example            # Template for environment variables
│
└── my-app/                 # React + Vite + Tailwind frontend
    └── src/
        ├── App.jsx         # Main UI component
        └── api.js          # API service layer
```

---

## ⚙️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Backend   | Python 3.11, Flask 3.0            |
| AI Model  | LLaMA 3.3-70b via Groq API        |
| Frontend  | React 18, Vite, Tailwind CSS      |
| Storage   | In-memory list (no DB needed)     |
| CORS      | flask-cors                        |

---

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.11+
- Node.js 20+ (LTS)
- A free Groq API key → https://console.groq.com

---

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Solution_challenge_2026.git
cd Solution_challenge_2026
```

---
### 2. Backend Setup

```bash
# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Create your .env file
copy .env.example .env         # Windows
cp .env.example .env           # macOS / Linux

# Add your Groq API key inside .env
GROQ_API_KEY=your_groq_key_here

# Start the backend
python App.py
```

Backend runs at → `http://localhost:5000`

---

### 3. Frontend Setup

Open a second terminal:

```bash
cd my-app
npm install
npm run dev
```

Frontend runs at → `http://localhost:5173`

---

## 📡 API Reference

### `POST /submit-request`
Submit an emergency request for AI processing.

**Request Body:**
```json
{
  "text": "We need food for 50 people urgently"
}
```

**Response:**
```json
{
  "request_type": "food",
  "people": 50,
  "priority": "high",
  "assigned_volunteer": "Volunteer A",
  "timestamp": "2026-04-28T10:30:00Z",
  "original_text": "We need food for 50 people urgently"
}
```

---

### `GET /get-requests`
Returns all submitted requests stored in memory.

**Response:**
```json
{
  "total": 3,
  "requests": [...]
}
```

---

### `GET /health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "AI Request Management System"
}
```

---

## 🤝 Volunteer Assignment Logic

| Request Type | Assigned Volunteer |
|--------------|--------------------|
| food         | Volunteer A        |
| medical      | Volunteer B        |
| rescue       | Volunteer C        |
| utilities    | Volunteer E        |
| other        | Volunteer D        |

---

## 🧪 Test Cases

### Frontend UI — Type these messages in the text box and hit Submit:

| # | Message to type | Expected Type | Expected Priority |
|---|----------------|---------------|-------------------|
| 1 | `We need food for 50 people urgently` | food | high |
| 2 | `3 people are critically injured and need medical help` | medical | high |
| 3 | `A family of 4 is trapped on the rooftop due to flooding` | rescue | high |
| 4 | `No electricity and water supply for 30 people` | utilities | high |
| 5 | `Someone needs insulin injection immediately` | medical | high |
| 6 | `We need drinking water for 100 flood victims` | food | high |
| 7 | `There is a fire and 10 people are stuck inside` | rescue | high |
| 8 | `We could use some extra blankets when possible` | other | low |
| 9 | `An elderly person needs a wheelchair` | medical | medium |
| 10 | `Power outage in the entire village of 200 people` | utilities | high |

---

### PowerShell / curl — API test commands:

```powershell
# Food
Invoke-RestMethod -Method POST http://localhost:5000/submit-request -Headers @{"Content-Type"="application/json"} -Body '{"text":"We need food for 50 people urgently"}'

# Medical
Invoke-RestMethod -Method POST http://localhost:5000/submit-request -Headers @{"Content-Type"="application/json"} -Body '{"text":"3 people are critically injured and need medical help"}'

# Rescue
Invoke-RestMethod -Method POST http://localhost:5000/submit-request -Headers @{"Content-Type"="application/json"} -Body '{"text":"A family of 4 is trapped on the rooftop due to flooding"}'

# Utilities
Invoke-RestMethod -Method POST http://localhost:5000/submit-request -Headers @{"Content-Type"="application/json"} -Body '{"text":"No electricity and water supply for 30 people"}'

# Error — empty text
Invoke-RestMethod -Method POST http://localhost:5000/submit-request -Headers @{"Content-Type"="application/json"} -Body '{"text":""}'

# Error — missing field
Invoke-RestMethod -Method POST http://localhost:5000/submit-request -Headers @{"Content-Type"="application/json"} -Body '{}'

# Get all requests
Invoke-RestMethod -Method GET http://localhost:5000/get-requests

# Health check
Invoke-RestMethod -Method GET http://localhost:5000/health
```

---

## 🛡️ Error Handling

| Scenario | Response |
|----------|----------|
| Empty `text` field | `400` → `"'text' field cannot be empty"` |
| Missing `text` field | `400` → `"Missing 'text' field in request body"` |
| AI / Groq API failure | Falls back to `{ request_type: "other", people: null, priority: "medium" }` |
| Invalid JSON from AI | Regex extraction tries 3 strategies before falling back |

---

## 🔑 Environment Variables

Create a `.env` file in the project root (never commit this):

```env
GROQ_API_KEY=your_groq_key_here
```

Get a free key at → https://console.groq.com

---

## 📦 Dependencies

### Backend (`requirements.txt`)
```
flask==3.0.3
flask-cors==4.0.0
groq==0.9.0
httpx==0.27.2
python-dotenv==1.0.1
```

### Frontend
```
react, vite, tailwindcss
```

---

## 🚀 How It Works

```
User types request
       ↓
React frontend sends POST /submit-request
       ↓
Flask receives the text
       ↓
Groq (LLaMA 3.3) extracts: type, people, priority
       ↓
Utils assigns a volunteer based on type
       ↓
Response returned + stored in memory
       ↓
Frontend displays the result card
```

---

## 📋 .gitignore (recommended)

Make sure your `.gitignore` includes:

```
venv/
__pycache__/
.env
node_modules/
dist/
```

---

## 👥 Team

Built with ❤️ for Solution Challenge 2026.

---
