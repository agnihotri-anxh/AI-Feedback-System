from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import sys
import os

# Add current directory to sys.path so we can import sibling files
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import init_db, get_db, Review
from schemas import ReviewCreate, SubmitReviewResponse, ReviewResponse, AdminReviewsResponse
from llm import analyze_review

app = FastAPI(title="AI Feedback System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db()

@app.get("/")
def home():
    return {"message": "Backend running"}

@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/reviews", response_model=AdminReviewsResponse)
def get_reviews(db: Session = Depends(get_db)):
    reviews = db.query(Review).order_by(Review.created_at.desc()).all()
    return {"reviews": reviews}


@app.post("/submit-review", response_model=SubmitReviewResponse)
def submit_review(payload: ReviewCreate, db: Session = Depends(get_db)):
    try:
        print(f"DEBUG: Received review: {payload.review}")
        review_text = payload.review.strip()

        if not review_text:
            raise HTTPException(status_code=400, detail="Review cannot be empty.")

        if len(review_text) > 3000:
            review_text = review_text[:3000]

        ai_result = analyze_review(review_text)

        db_review = Review(
            rating=payload.rating,
            review_text=review_text,
            user_reply=ai_result["user_reply"],
            summary=ai_result["summary"],
            recommended_action=ai_result["recommended_action"]
        )

        db.add(db_review)
        db.commit()
        db.refresh(db_review)

        return {
            "status": "success",
            "user_reply": ai_result["user_reply"]
        }
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))