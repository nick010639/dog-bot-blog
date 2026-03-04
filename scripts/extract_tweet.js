const fs = require('fs');
const html = fs.readFileSync('gosail_tweet.html', 'utf8');
const regex = /dir="auto"[^>]*>([^<]{20,500})<\/div>/g;
const matches = html.match(regex) || [];
const filtered = matches.filter(m => {
  const exclude = ['value":', "feature':", "color:", "css-", "font"];
  return !exclude.some(s => m.includes(s)) && m.length > 50;
});
filtered.slice(0, 20).forEach(m => console.log(m.trim()));
