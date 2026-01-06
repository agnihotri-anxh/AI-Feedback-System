from pydantic import BaseModel, Field
from datetime import datetime
from typing import List


class ReviewCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    review: str = Field(..., min_length=1)


class ReviewResponse(BaseModel):
    id: int
    rating: int
    review_text: str
    user_reply: str
    summary: str
    recommended_action: str
    created_at: datetime

    class Config:
        from_attributes = True


class SubmitReviewResponse(BaseModel):
    status: str
    user_reply: str


class AdminReviewsResponse(BaseModel):
    reviews: List[ReviewResponse]
