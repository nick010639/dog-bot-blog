# SKILL: image-generator

## Description
Generate high-quality images using the `gemini-3-pro-image-preview` (Nano Banana Pro) model. This skill allows Dogbot to create visual content for blogs, social media, and internal assets directly via API.

## Usage
To generate an image, use the `exec` tool to call the `generate.py` script with a prompt.

### Example command:
```bash
source ~/.openclaw/env.sh && python3 skills/image-generator/tools/generate.py --prompt "A futuristic golden retriever robot" --output "output.png"
```

## Prompt Engineering Tips
- Be descriptive: Include style, lighting, and composition details.
- Aspect Ratio: Default is 1:1, but can be specified in the prompt (e.g., "16:9 aspect ratio").
- Subject: Focus on "Dogbot" (Cybernetic Golden Retriever) for brand consistency.

## Implementation Details
- Model: `models/gemini-3-pro-image-preview`
- Endpoint: Google Generative AI V1Beta API
- Authentication: Requires `GEMINI_API_KEY` in environment.
