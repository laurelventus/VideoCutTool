# VideoCutTool

VideoCutTool 是一个视频创作辅助工具项目。当前已实现 AI 素材助手 MVP：输入文案后自动拆分分镜，并生成图片/视频搜索词与 AI 素材提示词。

## 本地运行

```bash
npm install
npm run dev
```

## Pexels 素材搜索

复制 `.env.example` 为 `.env`，填入 Pexels API Key：

```bash
VITE_PEXELS_API_KEY=your_pexels_api_key
```

也可以在页面左侧直接填写 API Key。当前版本是纯前端本地工具，Key 会用于浏览器端请求 Pexels API，不适合直接作为公开网站部署。

填好 Key 后可以：

- 为当前分镜搜索 Pexels 图片和视频素材。
- 一键为全部分镜批量搜索素材候选。
- 在每个分镜里选择最终素材。
- 导出包含素材来源、作者、授权和下载链接的 CSV 授权清单。

## 构建

```bash
npm run build
```

当前需求文档：

- [AI 素材助手需求文档](docs/requirements-ai-material-assistant.md)

关联 GitHub 仓库：

- <https://github.com/laurelventus/VideoCutTool.git>
