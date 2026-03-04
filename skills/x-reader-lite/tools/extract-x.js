const fs = require('fs');

// Helper function to decode HTML entities (e.g., &amp; -> &)
const decodeHtmlEntities = (str) => {
  return str.replace(/&amp;/g, '&')
           .replace(/&#x(\d{1,3});/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)))
           .replace(/&#(\d+);/g, (match) => String.fromCharCode(match));
};

// Helper function to clean CSS and scripts
const cleanHtml = (html) => {
  // Remove script tags
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove style tags
  clean = clean.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  return clean;
};

// Main extraction logic
async function extractXContent(filePath) {
  try {
    const rawHtml = fs.readFileSync(filePath, 'utf8');

    // 1. Clean the HTML to prevent noise from scripts/styles
    const cleanedHtml = cleanHtml(rawHtml);

    // 2. Extract Article Content (Specific to X Article structure)
    // Heuristic: Look for <article role="article"> or the main content container
    const articleMatch = cleanedHtml.match(/<article[^>]*role="article"[^>]*>([\s\S]*?)<\/article>/is);
    
    // Fallback: If no <article>, look for the first <h1> and following <p> or <div>
    let textContent = '';
    if (articleMatch && articleMatch[1]) {
      textContent = articleMatch[1];
    } else {
      // Fallback heuristic for Tweets/Threads (simplified)
      const bodyMatch = cleanedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/is);
      if (bodyMatch && bodyMatch[1]) {
         // Try to remove common UI noise (e.g., footer, nav, sidebar)
         let body = bodyMatch[1];
         body = body.replace(/<nav[^>]*>.*?<\/nav>/gis, '');
         body = body.replace(/<footer[^>]*>.*?<\/footer>/gis, '');
         body = body.replace(/<aside[^>]*>.*?<\/aside>/gis, '');
         body = body.replace(/<div[^>]*class="[^"]*?<\/div>/gis, '');
         
         textContent = body;
      }
    }

    // 3. Decode HTML entities
    if (textContent) {
      textContent = decodeHtmlEntities(textContent);
    }

    // 4. Output result
    console.log(JSON.stringify({
      status: 'success',
      text: textContent,
      note: 'Extracted text content from X URL.'
    }));

  } catch (error) {
    console.error(JSON.stringify({
      status: 'error',
      message: error.message
    }));
  }
}

// Get file path from command line argument
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: node extract-x.js <path-to-html-file>');
  process.exit(1);
}

extractXContent(args[0]);
