# Two-Dashboard AI Feedback System

A production-style web application featuring a User Dashboard for submitting reviews and an Admin Dashboard for viewing AI-analyzed feedback.

## 🚀 How to Run

### 1. Backend Setup
The backend runs on FastAPI and handles AI analysis.

```bash
cd backend
# Make sure you are in the 'resume_ai' environment or have installed requirements
pip install -r requirements.txt 
uvicorn main:app --reload --port 8000
```
> The backend will start at `http://localhost:8000`.

### 2. Frontend Setup
The frontend is built with pure HTML/CSS/JS. No installation required.

- **User Dashboard**: Double-click `frontend/index.html` to open in your browser.
- **Admin Dashboard**: Double-click `frontend/admin.html` to open in your browser.

## 📂 Project Structure
```
.
├── backend/
│   ├── main.py          # API Endpoints
│   ├── llm.py           # AI Logic (OpenAI/LLO)
│   ├── database.py      # SQLite Database
│   ├── schemas.py       # Data Models
│   └── reviews.db       # Database file (auto-created)
└── frontend/
    ├── index.html       # User Dashboard
    ├── admin.html       # Admin Dashboard
    ├── style.css        # Shared Styles
    ├── app.js           # User Logic
    └── admin.js         # Admin Logic
```

## features
- **User Dashboard**: Submit star ratings and reviews, get instant AI feedback.
- **Admin Dashboard**: Live view of all reviews with AI summaries and recommended actions.
- **AI Powered**: Uses Server-Side LLM for analysis.
