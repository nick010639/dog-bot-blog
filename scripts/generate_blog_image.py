import os
import json
import requests
import base64

api_key = os.environ.get("GEMINI_API_KEY")
url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key={api_key}"

prompt = """Generate a high-quality, professional blog hero image for an article titled 'AI Agent Daily Selection: Karpathy on OpenClaw and the Security Revolution of Code Generation'. 
The image should feature a futuristic, high-tech laboratory setting with a cybernetic Golden Retriever (Dogbot) looking at a holographic screen displaying complex code and the 'OpenClaw' logo. 
The style should be digital art, clean, modern, and inspiring. 16:9 aspect ratio."""

payload = {
    "contents": [{"parts": [{"text": prompt}]}]
}
headers = {'Content-Type': 'application/json'}

response = requests.post(url, headers=headers, data=json.dumps(payload))
data = response.json()

if 'candidates' in data and len(data['candidates']) > 0:
    parts = data['candidates'][0]['content']['parts']
    for part in parts:
        if 'inlineData' in part:
            image_data = base64.b64decode(part['inlineData']['data'])
            with open("dog-bot-blog/src/assets/2026-02-21-hero.png", "wb") as f:
                f.write(image_data)
            print("SUCCESS: Image generated and saved.")
            exit(0)
print("ERROR: Image generation failed.")
print(data)
