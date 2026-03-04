---
name: wechat-reader
description: Extracts content from WeChat Official Account (公众号) articles into Markdown. Use when the user wants to read or clip a WeChat article.
---

# WeChat Reader Skill

This skill allows Dogbot to read WeChat articles (`mp.weixin.qq.com` links) quickly and reliably.

It extracts the title, author, and main content, converting it into a clean Markdown file with YAML frontmatter, suitable for Obsidian ingestion or RAG/Memory contexts.

## Usage

When the user asks to read, summarize, or clip a WeChat article, run this command:

```bash
node skills/wechat-reader/scripts/index.js "https://mp.weixin.qq.com/s/..." "output-file.md"
```

*   **URL**: The WeChat article link.
*   **Output Path**: Optional. Defaults to `wechat-output.md`. You can specify a path to save it directly into the user's Obsidian Vault (if mapped) or the `memory/` folder.

## Implementation Detail
This skill uses a disguised `curl` request rather than a headless browser because WeChat's WAF (Web Application Firewall) blocks headless browser IPs from accessing article content. The content is natively present in the static HTML payload (`#js_content`), making heavy browser automation unnecessary and unstable.

## Dependencies

*   NPM packages: `cheerio` (HTML parsing) and `turndown` (Markdown conversion).
