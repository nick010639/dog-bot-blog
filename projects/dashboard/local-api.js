const { execSync } = require('child_process');
const http = require('http');

const PORT = 3001;

function getLocalStats() {
    try {
        const memoryFiles = execSync('ls memory/*.md | wc -l').toString().trim();
        const lastBriefing = execSync('ls -t memory/202* | head -n 1').toString().trim();
        const gitStatus = execSync('git status --short || echo "not a repo"').toString().trim();
        const diskUsage = execSync('df -h . | tail -n 1 | awk \'{print $5}\'').toString().trim();
        const uptime = execSync('uptime -p').toString().trim();

        return {
            memoryCount: memoryFiles,
            lastUpdate: lastBriefing,
            gitStatus: gitStatus,
            diskUsage: diskUsage,
            uptime: uptime,
            timestamp: new Date().toLocaleString()
        };
    } catch (e) {
        return { error: e.message };
    }
}

http.createServer((req, res) => {
    // CORS is critical for the browser to fetch from a different domain
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, bypass-tunnel-reminder');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(getLocalStats()));
}).listen(PORT, '0.0.0.0', () => {
    console.log(`Dogbot Data Bridge active on port ${PORT}`);
});
