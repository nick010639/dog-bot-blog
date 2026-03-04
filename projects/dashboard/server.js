const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PORT = 3000;

const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/index.html') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
    } else if (req.url === '/api/stats') {
        try {
            // Fetch some real stats from the workspace
            const memoryFiles = execSync('ls memory/*.md | wc -l').toString().trim();
            const lastBriefing = execSync('ls -t memory/202* | head -n 1').toString().trim();
            const gitStatus = execSync('git status --short || echo "not a repo"').toString().trim();
            const diskUsage = execSync('df -h . | tail -n 1 | awk \'{print $5}\'').toString().trim();
            const uptime = execSync('uptime -p').toString().trim();

            const stats = {
                memoryCount: memoryFiles,
                lastUpdate: lastBriefing,
                gitStatus: gitStatus || 'Clean',
                diskUsage: diskUsage,
                uptime: uptime,
                timestamp: new Date().toLocaleString()
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(stats));
        } catch (e) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message }));
        }
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`Dogbot Dashboard running at http://localhost:${PORT}`);
});
