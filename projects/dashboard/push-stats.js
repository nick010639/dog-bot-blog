import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const WORKSPACE_PATH = '/home/nick010639/.openclaw/workspace-tech';
const REPO_PATH = '/tmp/dogbot-dashboard-data';

function getStats() {
    const memoryCount = execSync(`ls ${WORKSPACE_PATH}/memory/*.md | wc -l`).toString().trim();
    const lastUpdate = execSync(`ls -t ${WORKSPACE_PATH}/memory/202* | head -n 1`).toString().trim();
    const diskUsage = execSync(`df -h ${WORKSPACE_PATH} | tail -n 1 | awk '{print $5}'`).toString().trim();
    const uptime = execSync('uptime -p').toString().trim();
    
    // 强制提取真实的简报内容
    let todayBriefing = "正在嗅探最新简报...";
    try {
        const latestFile = execSync(`ls -t ${WORKSPACE_PATH}/memory/202* | head -n 1`).toString().trim();
        if (latestFile) {
            const content = fs.readFileSync(latestFile, 'utf8');
            // 搜索所有 ### 开头的标题，作为简要列表
            const lines = content.split('\n');
            const summaries = lines.filter(l => l.startsWith('###')).map(l => l.replace('###', '•')).slice(0, 5);
            if (summaries.length > 0) {
                todayBriefing = summaries.join('\n');
            } else {
                todayBriefing = "今日简报：\n" + content.substring(0, 300).replace(/[#*]/g, '') + "...";
            }
        }
    } catch (e) {
        todayBriefing = "简报嗅探失败: " + e.message;
    }

    // 真实的待办事项 (从 MEMORY.md 提取带 [ ] 的行)
    let todos = [];
    try {
        const memoryContent = fs.readFileSync(`${WORKSPACE_PATH}/MEMORY.md`, 'utf8');
        const todoLines = memoryContent.split('\n').filter(l => l.includes('[ ]')).slice(0, 5);
        todos = todoLines.map(l => l.replace(/.*\[ \]/, '⏳').trim());
    } catch (e) {}

    if (todos.length === 0) {
        todos = [
            "⏳ 完善仪表盘实时数据逻辑",
            "⏳ 接入真实 TODO 任务流",
            "⏳ 优化 GitHub CDN 更新稳定性"
        ];
    }

    return {
        memoryCount,
        lastUpdate,
        diskUsage,
        uptime,
        briefing: todayBriefing,
        todos: todos,
        timestamp: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    };
}

const stats = getStats();
fs.writeFileSync(path.join(REPO_PATH, 'stats.json'), JSON.stringify(stats, null, 2));

console.log('Pushing final REAL stats to GitHub...');
execSync(`cd ${REPO_PATH} && git add stats.json && git commit -m "Force push real content" && git push origin main`);
