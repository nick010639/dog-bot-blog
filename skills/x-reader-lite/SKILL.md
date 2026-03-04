---
name: x-reader-lite
description: Reads X (Twitter) URL content using Playwright browser. No API token required.
---

# X Reader Lite (基于 Playwright)

Uses the underlying `playwright-bot-bypass` capability to render X URLs and extract text content.

## Usage

```bash
npx -y mcp run x-reader-lite "url=https://x.com/username/status/123"
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `url` | String | The X URL to read (Tweet or Article) |

## Implementation Details

1.  **Browser Initialization**: Initializes a headless browser (using `xvfb` for stability).
2.  **Anti-Bot Detection**: Uses stealth template to avoid basic detection.
3.  **Content Extraction**:
   - Navigates to the URL.
   - Waits for content to load.
   - Extracts text from `<article>` tags or tweet body.
   - Returns formatted Markdown.

## Tooling

This skill calls `node skills/playwright-bot-bypass/tools/browser-control.js navigate <url>` internally.
