import os
import json
import base64
import argparse
import sys

def generate_image(prompt, output_path):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("ERROR: GEMINI_API_KEY not found in environment.")
        sys.exit(1)

    # Use curl via os.system as a fallback since requests might not be installed
    # Constructing the JSON payload
    payload = {
        "contents": [{
            "parts": [{
                "text": prompt
            }]
        }]
    }
    
    payload_json = json.dumps(payload)
    
    # We use temporary files to handle the large JSON response
    tmp_response = "tmp_image_response.json"
    
    curl_cmd = f'curl -s -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-pro-image-preview:generateContent?key={api_key}" ' \
               f'-H "Content-Type: application/json" ' \
               f'-d \'{payload_json}\' > {tmp_response}'
    
    os.system(curl_cmd)
    
    try:
        with open(tmp_response, "r") as f:
            data = json.load(f)
        
        if 'candidates' in data and len(data['candidates']) > 0:
            parts = data['candidates'][0]['content']['parts']
            for part in parts:
                if 'inlineData' in part:
                    image_data = base64.b64decode(part['inlineData']['data'])
                    with open(output_path, "wb") as f:
                        f.write(image_data)
                    print(f"SUCCESS: Image saved to {output_path}")
                    os.remove(tmp_response)
                    return True
        
        print("ERROR: Failed to extract image data from response.")
        print(json.dumps(data, indent=2))
        return False
    except Exception as e:
        print(f"ERROR: {str(e)}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Dogbot Image Generator")
    parser.add_argument("--prompt", required=True, help="The image description")
    parser.add_argument("--output", required=True, help="Path to save the generated image")
    
    args = parser.parse_args()
    generate_image(args.prompt, args.output)
