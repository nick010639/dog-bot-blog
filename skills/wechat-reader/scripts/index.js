const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const TurndownService = require('turndown');
const { execSync } = require('child_process');

const url = process.argv[2];
const outPath = process.argv[3] || 'wechat-output.md';

if (!url) {
    console.error('Usage: node index.js <url> [outPath]');
    process.exit(1);
}

try {
    console.log(`Fetching ${url}...`);
    // Use curl with a standard user-agent to bypass basic blocks, avoiding headless browser detection
    const curlCmd = `curl -s -A 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36' "${url}"`;
    const html = execSync(curlCmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    
    const $ = cheerio.load(html);
    
    const title = $('#activity-name').text().trim() || $('meta[property="og:title"]').attr('content') || 'Untitled WeChat Article';
    const author = $('#js_name').text().trim() || $('#js_author_name').text().trim() || 'Unknown Author';
    
    // Clean up WeChat lazy loaded images before getting inner HTML
    // WeChat uses data-src for original images and src for lazy placeholder
    $('#js_content img').each(function() {
        const dataSrc = $(this).attr('data-src');
        if (dataSrc) {
            $(this).attr('src', dataSrc);
        }
    });

    const contentHtml = $('#js_content').html();
    
    if (!contentHtml) {
        throw new Error('Could not find #js_content in the WeChat article. It might be blocked or require JS rendering.');
    }
    
    const turndownService = new TurndownService({ headingStyle: 'atx' });
    const markdownContent = turndownService.turndown(contentHtml);
    
    const finalMd = `---\ntitle: "${title.replace(/"/g, '\\"')}"\nauthor: "${author.replace(/"/g, '\\"')}"\nsource: "${url}"\ndate: ${new Date().toISOString().split('T')[0]}\n---\n\n# ${title}\n\n${markdownContent}`;
    
    fs.writeFileSync(path.resolve(process.cwd(), outPath), finalMd);
    console.log(`Success! Article saved to ${path.resolve(process.cwd(), outPath)}`);
} catch (e) {
    console.error(`Error processing WeChat URL:`, e.message);
    process.exit(1);
}