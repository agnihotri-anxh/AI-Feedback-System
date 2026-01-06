import requests
import json

url = "http://127.0.0.1:8000/submit-review"
payload = {
    "rating": 5,
    "review": "This is a test review to check if the submission works."
}
headers = {
    "Content-Type": "application/json"
}

try:
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:", response.json())
except Exception as e:
    print(f"Error: {e}")
