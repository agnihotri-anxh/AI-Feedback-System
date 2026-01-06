from openai import OpenAI
import dotenv
import os
import json
import re

from pathlib import Path

# Load .env from parent directory
env_path = Path(__file__).parent.parent / '.env'
dotenv.load_dotenv(env_path)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY") 

print(f"DEBUG: Loading .env... API Key present: {bool(os.getenv('OPENROUTER_API_KEY'))}")
if os.getenv('OPENROUTER_API_KEY'):
    print(f"DEBUG: Key starts with: {os.getenv('OPENROUTER_API_KEY')[:5]}...")

client_or = OpenAI(
    api_key=os.getenv("OPENROUTER_API_KEY"),
    base_url="https://openrouter.ai/api/v1"
)

def call_llm(prompt):
    print("DEBUG: Calling LLM...")
    try:
        response = client_or.chat.completions.create(
            model="meta-llama/llama-3.1-8b-instruct",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )
        print("DEBUG: LLM Success")
        return response.choices[0].message.content
    except Exception as e:
        print(f"DEBUG: LLM FAILED: {e}")
        raise e


def analyze_review(review_text: str):
    prompt = f"""
You are an AI assistant helping a business analyze customer feedback.

Given a customer review, do the following:
1. Write a short, polite, and professional response to the customer.
2. Summarize the review in one short sentence for internal admin use.
3. Suggest one clear recommended action for the business.

Return ONLY valid JSON in the exact format below.
Do NOT include markdown, backticks, or extra text.

{{
  "user_reply": "<short reply to the customer>",
  "summary": "<short internal summary>",
  "recommended_action": "<suggested business action>"
}}

Customer review:
\"\"\"{review_text}\"\"\"
"""
    response_text = call_llm(prompt)

    clean_text = re.sub(r'```json\s*', '', response_text)
    clean_text = re.sub(r'```\s*', '', clean_text)
    clean_text = clean_text.strip()
    
    try:
        data = json.loads(clean_text)
        return data
    except json.JSONDecodeError:
        return {
            "user_reply": "Thank you for your feedback! We appreciate you taking the time to share your thoughts.",
            "summary": "User submitted a review (Automatic summary due to parsing error).",
            "recommended_action": "Review manually."
        }
