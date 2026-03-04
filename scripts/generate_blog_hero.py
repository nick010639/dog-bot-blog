import os
import time
from io import BytesIO
from google import genai
from google.genai import types
from PIL import Image

def generate_hero():
    api_key = os.environ.get("GEMINI_API_KEY")
    client = genai.Client(api_key=api_key)
    # v1alpha 用于预览模型
    client_alpha = genai.Client(api_key=api_key, http_options={'api_version': 'v1alpha'})
    
    prompt = "A high-end, cinematic studio shot of a digital retriever dog (Dogbot) sitting in a futuristic glass-walled laboratory. Holographic AI Agent network diagrams float in the air. Soft blue and gold neon accents. 8k, photorealistic."
    output_path = "dog-bot-blog/src/assets/dogbot-lab-final.png"

    # --- 尝试 1: Gemini 3 Pro Image (Preview) ---
    print("🚀 Trying Model: Gemini 3 Pro Image (Preview)...")
    try:
        res = client_alpha.models.generate_content(
            model='gemini-3-pro-image-preview',
            contents=prompt,
            config=types.GenerateContentConfig(response_modalities=['IMAGE'])
        )
        for part in res.candidates[0].content.parts:
            if part.inline_data:
                Image.open(BytesIO(part.inline_data.data)).save(output_path)
                print("✅ Success with Gemini 3!")
                return True
    except Exception as e:
        print(f"😴 Gemini 3 unavailable (503/404). Switching to Backup...")

    # --- 尝试 2: Imagen 4 Ultra (Stable Backup) ---
    print("🚀 Trying Backup: Imagen 4 Ultra...")
    try:
        res = client.models.generate_images(
            model='imagen-4.0-ultra-generate-001',
            prompt=prompt,
            config=types.GenerateImagesConfig(number_of_images=1)
        )
        Image.open(BytesIO(res.generated_images[0].image.image_bytes)).save(output_path)
        print("✅ Success with Imagen 4 Ultra!")
        return True
    except Exception as e:
        print(f"❌ Backup failed: {e}")

    return False

if __name__ == "__main__":
    generate_hero()
