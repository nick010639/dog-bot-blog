# Transcript Tools Reference

## 概览
本参考文档包含了用于视频转录和文本提取的各种工具和脚本的详细说明。

## 核心依赖
*   **yt-dlp**：用于提取 YouTube 视频的元数据。
*   **whisper**：用于高精度的音频转录（需 GPU 环境）。

## 工具脚本说明

### `scripts/download_subs.py`
负责下载并解析字幕文件。

### `scripts/x_video_worker.py`
核心 Worker 脚本，协调整下载和转录任务。

---

## API 参考
*   **yt-dlp --dump-json**：导出视频元数据。
*   **yt-dlp --write-auto-subs**：自动生成字幕。
