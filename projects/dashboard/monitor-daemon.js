const { spawn, execSync } = require('child_process');
const http = require('http');

const API_PORT = 3001;

// 1. Start the API Server
function startApi() {
    console.log('Starting API Server...');
    const api = http.createServer((req, res) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, bypass-tunnel-reminder');
        
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        try {
            const memoryFiles = execSync('ls memory/*.md | wc -l').toString().trim();
            const lastBriefing = execSync('ls -t memory/202* | head -n 1').toString().trim();
            const diskUsage = execSync('df -h . | tail -n 1 | awk \'{print $5}\'').toString().trim();
            const uptime = execSync('uptime -p').toString().trim();

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                memoryCount: memoryFiles,
                lastUpdate: lastBriefing,
                diskUsage: diskUsage,
                uptime: uptime,
                timestamp: new Date().toLocaleString()
            }));
        } catch (e) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message }));
        }
    });

    api.listen(API_PORT, '0.0.0.0', () => {
        console.log(`API Server listening on ${API_PORT}`);
    });
}

// 2. Start Localtunnel and auto-restart if it dies
function startTunnel() {
    console.log('Starting Tunnel...');
    const lt = spawn('npx', ['-y', 'localtunnel', '--port', '3001', '--subdomain', 'dogbot-zack-final-v4']);

    lt.stdout.on('data', (data) => {
        console.log(`Tunnel Output: ${data}`);
    });

    lt.stderr.on('data', (data) => {
        console.error(`Tunnel Error: ${data}`);
    });

    lt.on('close', (code) => {
        console.log(`Tunnel closed with code ${code}, restarting in 5s...`);
        setTimeout(startTunnel, 5000);
    });
}

startApi();
startTunnel();
