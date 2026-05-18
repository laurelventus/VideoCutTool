import {
  Check,
  CheckCircle2,
  Clipboard,
  Copy,
  Download,
  ExternalLink,
  FileJson,
  FileText,
  Image,
  Link,
  Play,
  RefreshCcw,
  Search,
  Sparkles,
  Video,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  aspectRatioLabels,
  createMaterialPlan,
  styleLabels,
  toMarkdown,
  videoTypeLabels,
} from "./materialPlanner";
import { searchPexelsAssets } from "./pexelsClient";
import type { AspectRatio, AssetCandidate, PlannerOptions, ScenePlan, VideoType, VisualStyle } from "./types";

const sampleScript =
  "普通人做短视频，最容易犯的错误不是不会剪辑，而是不知道每一句话该配什么画面。画面选错了，观众会觉得内容很散。真正高效的方法，是先把文案拆成分镜，再为每个分镜找到对应的图片、视频或 AI 素材。";

const assetTypeLabels: Record<string, string> = {
  video: "视频",
  image: "图片",
  illustration: "插画",
  icon: "图标",
  screen_recording: "录屏",
  ai_image: "AI 图",
  ai_video: "AI 视频",
};

type KeywordField =
  | "imageSearchKeywords.zh"
  | "imageSearchKeywords.en"
  | "videoSearchKeywords.zh"
  | "videoSearchKeywords.en";

export function App() {
  const [script, setScript] = useState(sampleScript);
  const [options, setOptions] = useState<PlannerOptions>({
    videoType: "knowledge",
    aspectRatio: "9:16",
    visualStyle: "clean_commercial",
  });
  const [scenes, setScenes] = useState<ScenePlan[]>(() => createMaterialPlan(sampleScript, {
    videoType: "knowledge",
    aspectRatio: "9:16",
    visualStyle: "clean_commercial",
  }));
  const [activeSceneId, setActiveSceneId] = useState("scene_001");
  const [notice, setNotice] = useState("已生成示例方案");
  const [assetError, setAssetError] = useState("");
  const [isSearchingAssets, setIsSearchingAssets] = useState(false);
  const [isSearchingAllAssets, setIsSearchingAllAssets] = useState(false);

  const activeScene = useMemo(
    () => scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0],
    [activeSceneId, scenes],
  );

  const confirmedCount = scenes.filter((scene) => scene.confirmed).length;
  const selectedAssetCount = scenes.filter((scene) => Boolean(scene.selectedAssetId)).length;

  function updateOption<Key extends keyof PlannerOptions>(key: Key, value: PlannerOptions[Key]) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  function generatePlan() {
    const plan = createMaterialPlan(script, options);

    if (plan.length === 0) {
      setNotice("请先输入文案");
      return;
    }

    setScenes(plan);
    setActiveSceneId(plan[0].id);
    setNotice(`已生成 ${plan.length} 个分镜`);
  }

  function updateScene(sceneId: string, patch: Partial<ScenePlan>) {
    setScenes((current) =>
      current.map((scene) => (scene.id === sceneId ? { ...scene, ...patch } : scene)),
    );
  }

  function updateKeyword(sceneId: string, field: KeywordField, value: string) {
    setScenes((current) =>
      current.map((scene) => {
        if (scene.id !== sceneId) {
          return scene;
        }

        const values = value
          .split(/[,，]/)
          .map((item) => item.trim())
          .filter(Boolean);

        if (field === "imageSearchKeywords.zh") {
          return { ...scene, imageSearchKeywords: { ...scene.imageSearchKeywords, zh: values } };
        }
        if (field === "imageSearchKeywords.en") {
          return { ...scene, imageSearchKeywords: { ...scene.imageSearchKeywords, en: values } };
        }
        if (field === "videoSearchKeywords.zh") {
          return { ...scene, videoSearchKeywords: { ...scene.videoSearchKeywords, zh: values } };
        }
        return { ...scene, videoSearchKeywords: { ...scene.videoSearchKeywords, en: values } };
      }),
    );
  }

  async function copyText(value: string, message = "已复制") {
    await navigator.clipboard.writeText(value);
    setNotice(message);
  }

  function exportMarkdown() {
    downloadFile("ai-material-plan.md", toMarkdown(scenes, options), "text/markdown;charset=utf-8");
    setNotice("已导出 Markdown");
  }

  function exportJson() {
    downloadFile(
      "ai-material-plan.json",
      JSON.stringify({ options, scenes }, null, 2),
      "application/json;charset=utf-8",
    );
    setNotice("已导出 JSON");
  }

  function exportLicenseCsv() {
    const selectedAssets = scenes.flatMap((scene) => {
      const selectedAsset = scene.assetCandidates.find((asset) => asset.id === scene.selectedAssetId);
      return selectedAsset ? [{ scene, asset: selectedAsset }] : [];
    });

    if (selectedAssets.length === 0) {
      setNotice("请先选择素材");
      return;
    }

    const rows = [
      ["scene_order", "scene_title", "asset_type", "source", "title", "author", "license", "source_url", "download_url"],
      ...selectedAssets.map(({ scene, asset }) => [
        String(scene.order),
        scene.title,
        asset.type,
        asset.source,
        asset.title,
        asset.author,
        asset.license,
        asset.sourceUrl,
        asset.downloadUrl,
      ]),
    ];

    downloadFile("asset-license-manifest.csv", toCsv(rows), "text/csv;charset=utf-8");
    setNotice("已导出授权清单");
  }

  async function searchAssetsForActiveScene() {
    if (!activeScene) {
      return;
    }

    setIsSearchingAssets(true);
    setAssetError("");

    try {
      const assets = await searchPexelsAssets(activeScene, {
        aspectRatio: options.aspectRatio,
        perPage: 6,
      });
      updateScene(activeScene.id, {
        assetCandidates: assets,
        selectedAssetId: assets[0]?.id,
      });
      setNotice(`已找到 ${assets.length} 个素材候选`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "素材搜索失败";
      setAssetError(message);
      setNotice(message);
    } finally {
      setIsSearchingAssets(false);
    }
  }

  async function searchAssetsForAllScenes() {
    setIsSearchingAllAssets(true);
    setAssetError("");

    let totalAssets = 0;
    let successScenes = 0;
    let firstError = "";

    for (const scene of scenes) {
      try {
        const assets = await searchPexelsAssets(scene, {
          aspectRatio: options.aspectRatio,
          perPage: 4,
        });

        totalAssets += assets.length;
        successScenes += 1;
        updateScene(scene.id, {
          assetCandidates: assets,
          selectedAssetId: assets[0]?.id,
        });
      } catch (error) {
        firstError = firstError || (error instanceof Error ? error.message : "素材搜索失败");
      }
    }

    setIsSearchingAllAssets(false);

    if (successScenes === 0 && firstError) {
      setAssetError(firstError);
      setNotice(firstError);
      return;
    }

    setNotice(`已为 ${successScenes} 个分镜找到 ${totalAssets} 个素材`);
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">VideoCutTool</p>
          <h1>AI 素材助手</h1>
        </div>
        <div className="status-strip" aria-label="生成状态">
          <span>{scenes.length} 分镜</span>
          <span>{confirmedCount} 已确认</span>
          <span>{selectedAssetCount} 已选素材</span>
          <span>{notice}</span>
        </div>
      </header>

      <section className="workspace">
        <aside className="control-panel" aria-label="输入与生成设置">
          <div className="panel-section">
            <label htmlFor="script">文案</label>
            <textarea
              id="script"
              value={script}
              onChange={(event) => setScript(event.target.value)}
              spellCheck={false}
            />
          </div>

          <div className="field-grid">
            <label>
              视频类型
              <select
                value={options.videoType}
                onChange={(event) => updateOption("videoType", event.target.value as VideoType)}
              >
                {Object.entries(videoTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              画幅
              <select
                value={options.aspectRatio}
                onChange={(event) => updateOption("aspectRatio", event.target.value as AspectRatio)}
              >
                {Object.entries(aspectRatioLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              风格
              <select
                value={options.visualStyle}
                onChange={(event) => updateOption("visualStyle", event.target.value as VisualStyle)}
              >
                {Object.entries(styleLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="api-status" role="note">
            <span>Pexels Key 从本地 .env 读取</span>
          </div>

          <div className="button-row">
            <button className="primary-button" onClick={generatePlan}>
              <Sparkles size={18} />
              生成
            </button>
            <button
              className="icon-button"
              title="恢复示例"
              aria-label="恢复示例"
              onClick={() => {
                setScript(sampleScript);
                setNotice("已恢复示例");
              }}
            >
              <RefreshCcw size={18} />
            </button>
          </div>

          <button
            className="wide-tool-button"
            onClick={searchAssetsForAllScenes}
            disabled={isSearchingAllAssets || scenes.length === 0}
          >
            <Search size={17} />
            {isSearchingAllAssets ? "批量搜索中" : "搜索全部素材"}
          </button>

          <div className="export-row">
            <button onClick={exportMarkdown}>
              <FileText size={17} />
              Markdown
            </button>
            <button onClick={exportJson}>
              <FileJson size={17} />
              JSON
            </button>
          </div>
          <button className="wide-tool-button secondary" onClick={exportLicenseCsv}>
            <Download size={17} />
            授权清单
          </button>
        </aside>

        <section className="scene-list" aria-label="分镜列表">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              className={`scene-card ${scene.id === activeScene?.id ? "is-active" : ""}`}
              onClick={() => setActiveSceneId(scene.id)}
            >
              <span className="scene-index">{String(scene.order).padStart(2, "0")}</span>
              <span className="scene-card-body">
                <strong>{scene.title}</strong>
                <span>{scene.sourceText}</span>
              </span>
              {scene.confirmed ? <Check className="scene-check" size={18} /> : null}
            </button>
          ))}
        </section>

        {activeScene ? (
          <section className="editor-panel" aria-label="分镜编辑">
            <div className="editor-header">
              <div>
                <p className="eyebrow">Scene {String(activeScene.order).padStart(2, "0")}</p>
                <input
                  value={activeScene.title}
                  onChange={(event) => updateScene(activeScene.id, { title: event.target.value })}
                  aria-label="分镜标题"
                />
              </div>
              <label className="confirm-toggle">
                <input
                  type="checkbox"
                  checked={activeScene.confirmed}
                  onChange={(event) => updateScene(activeScene.id, { confirmed: event.target.checked })}
                />
                已确认
              </label>
            </div>

            <div className="source-block">
              <Clipboard size={18} />
              <p>{activeScene.sourceText}</p>
            </div>

            <div className="editor-grid">
              <FieldArea
                label="画面意图"
                value={activeScene.visualIntent}
                onChange={(value) => updateScene(activeScene.id, { visualIntent: value })}
              />
              <label className="duration-field">
                建议时长
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={activeScene.suggestedDuration}
                  onChange={(event) =>
                    updateScene(activeScene.id, { suggestedDuration: Number(event.target.value) })
                  }
                />
              </label>
            </div>

            <div className="asset-tags">
              {activeScene.assetTypes.map((type) => (
                <span key={type}>{assetTypeLabels[type] ?? type}</span>
              ))}
            </div>

            <section className="asset-panel" aria-label="真实素材候选">
              <div className="asset-panel-header">
                <div>
                  <p className="eyebrow">Pexels</p>
                  <h2>素材候选</h2>
                </div>
                <button onClick={searchAssetsForActiveScene} disabled={isSearchingAssets}>
                  <Search size={17} />
                  {isSearchingAssets ? "搜索中" : "搜索"}
                </button>
              </div>
              {assetError ? <p className="inline-error">{assetError}</p> : null}
              {activeScene.assetCandidates.length > 0 ? (
                <div className="asset-grid">
                  {activeScene.assetCandidates.map((asset) => (
                    <AssetCard
                      key={asset.id}
                      asset={asset}
                      selected={asset.id === activeScene.selectedAssetId}
                      onSelect={() => {
                        updateScene(activeScene.id, { selectedAssetId: asset.id });
                        setNotice("已选择素材");
                      }}
                      onCopy={() => copyText(asset.sourceUrl, "已复制素材来源链接")}
                    />
                  ))}
                </div>
              ) : (
                <div className="asset-empty">
                  <Image size={19} />
                  <span>暂无素材候选</span>
                </div>
              )}
            </section>

            <div className="keyword-grid">
              <FieldArea
                label="图片搜索词 / 中文"
                value={activeScene.imageSearchKeywords.zh.join("，")}
                onChange={(value) => updateKeyword(activeScene.id, "imageSearchKeywords.zh", value)}
                rows={3}
              />
              <FieldArea
                label="图片搜索词 / 英文"
                value={activeScene.imageSearchKeywords.en.join(", ")}
                onChange={(value) => updateKeyword(activeScene.id, "imageSearchKeywords.en", value)}
                rows={3}
              />
              <FieldArea
                label="视频搜索词 / 中文"
                value={activeScene.videoSearchKeywords.zh.join("，")}
                onChange={(value) => updateKeyword(activeScene.id, "videoSearchKeywords.zh", value)}
                rows={3}
              />
              <FieldArea
                label="视频搜索词 / 英文"
                value={activeScene.videoSearchKeywords.en.join(", ")}
                onChange={(value) => updateKeyword(activeScene.id, "videoSearchKeywords.en", value)}
                rows={3}
              />
            </div>

            <PromptArea
              label="AI 图片提示词"
              value={activeScene.aiImagePrompt}
              onChange={(value) => updateScene(activeScene.id, { aiImagePrompt: value })}
              onCopy={() => copyText(activeScene.aiImagePrompt, "已复制 AI 图片提示词")}
            />
            <PromptArea
              label="AI 视频提示词"
              value={activeScene.aiVideoPrompt}
              onChange={(value) => updateScene(activeScene.id, { aiVideoPrompt: value })}
              onCopy={() => copyText(activeScene.aiVideoPrompt, "已复制 AI 视频提示词")}
            />
            <PromptArea
              label="反向提示词"
              value={activeScene.negativePrompt}
              onChange={(value) => updateScene(activeScene.id, { negativePrompt: value })}
              onCopy={() => copyText(activeScene.negativePrompt, "已复制反向提示词")}
            />

            <div className="footer-actions">
              <button onClick={() => copyText(toMarkdown([activeScene], options), "已复制当前分镜")}>
                <Copy size={17} />
                复制分镜
              </button>
              <button onClick={exportMarkdown}>
                <Download size={17} />
                导出方案
              </button>
            </div>
          </section>
        ) : (
          <section className="editor-panel empty-state">
            <Play size={22} />
            <span>暂无方案</span>
          </section>
        )}
      </section>
    </main>
  );
}

interface FieldAreaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

function FieldArea({ label, value, onChange, rows = 4 }: FieldAreaProps) {
  return (
    <label className="field-area">
      {label}
      <textarea value={value} rows={rows} onChange={(event) => onChange(event.target.value)} spellCheck={false} />
    </label>
  );
}

interface PromptAreaProps extends FieldAreaProps {
  onCopy: () => void;
}

function PromptArea({ label, value, onChange, onCopy }: PromptAreaProps) {
  return (
    <div className="prompt-area">
      <div className="prompt-header">
        <span>{label}</span>
        <button className="icon-button" title="复制" aria-label={`复制${label}`} onClick={onCopy}>
          <Copy size={16} />
        </button>
      </div>
      <textarea value={value} rows={4} onChange={(event) => onChange(event.target.value)} spellCheck={false} />
    </div>
  );
}

interface AssetCardProps {
  asset: AssetCandidate;
  selected: boolean;
  onSelect: () => void;
  onCopy: () => void;
}

function AssetCard({ asset, selected, onSelect, onCopy }: AssetCardProps) {
  return (
    <article className={`asset-card ${selected ? "is-selected" : ""}`}>
      <a className="asset-thumb" href={asset.sourceUrl} target="_blank" rel="noreferrer">
        {asset.type === "video" ? (
          <>
            <video src={asset.previewUrl} poster={asset.thumbnailUrl} muted preload="metadata" />
            <span className="asset-kind">
              <Video size={14} />
              视频
            </span>
          </>
        ) : (
          <>
            <img src={asset.thumbnailUrl} alt={asset.title} loading="lazy" />
            <span className="asset-kind">
              <Image size={14} />
              图片
            </span>
          </>
        )}
      </a>
      <div className="asset-card-body">
        <strong>{asset.title}</strong>
        <span>{asset.author}</span>
        <span>
          {asset.width} x {asset.height}
          {asset.duration ? ` · ${asset.duration}s` : ""}
        </span>
      </div>
      <div className="asset-actions">
        <button className={selected ? "selected-action" : ""} onClick={onSelect}>
          <CheckCircle2 size={15} />
          {selected ? "已选" : "选择"}
        </button>
        <a href={asset.sourceUrl} target="_blank" rel="noreferrer">
          <ExternalLink size={15} />
          来源
        </a>
        <button onClick={onCopy}>
          <Link size={15} />
          链接
        </button>
      </div>
    </article>
  );
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function toCsv(rows: string[][]): string {
  return rows
    .map((row) =>
      row
        .map((cell) => {
          const value = cell.replace(/"/g, '""');
          return /[",\n\r]/.test(value) ? `"${value}"` : value;
        })
        .join(","),
    )
    .join("\n");
}
