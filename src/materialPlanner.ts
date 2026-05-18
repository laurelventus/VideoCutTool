import type {
  AssetKind,
  AspectRatio,
  PlannerOptions,
  ScenePlan,
  VideoType,
  VisualStyle,
} from "./types";

interface VisualProfile {
  key: string;
  label: string;
  triggers: string[];
  intent: string;
  imageZh: string[];
  imageEn: string[];
  videoZh: string[];
  videoEn: string[];
  assets: AssetKind[];
  promptScene: string;
}

interface VisualKeyword {
  zh: string;
  en: string;
  triggers: string[];
}

export const videoTypeLabels: Record<VideoType, string> = {
  talking_head: "口播",
  knowledge: "知识科普",
  product: "产品介绍",
  commercial: "商业广告",
  story: "情绪短片",
};

export const aspectRatioLabels: Record<AspectRatio, string> = {
  "9:16": "竖屏 9:16",
  "16:9": "横屏 16:9",
  "1:1": "方屏 1:1",
};

export const styleLabels: Record<VisualStyle, string> = {
  documentary: "真实纪实",
  clean_commercial: "商业干净",
  tech_product: "科技产品",
  education: "教育白板",
  cinematic: "电影感",
  social_energy: "社媒活力",
};

const stylePrompt: Record<VisualStyle, string> = {
  documentary: "realistic documentary lighting, natural colors, authentic everyday details",
  clean_commercial: "clean commercial photography, bright controlled lighting, polished composition",
  tech_product: "modern tech product style, crisp interface details, cool neutral lighting",
  education: "clear educational visual style, simple composition, readable concept hierarchy",
  cinematic: "cinematic lighting, shallow depth of field, emotionally focused framing",
  social_energy: "energetic social media style, fast-paced composition, vivid but balanced colors",
};

const ratioPrompt: Record<AspectRatio, string> = {
  "9:16": "vertical 9:16 composition for short video",
  "16:9": "horizontal 16:9 composition",
  "1:1": "square 1:1 composition",
};

const videoContext: Record<VideoType, string> = {
  talking_head: "for a talking-head short video with strong B-roll support",
  knowledge: "for an educational explainer video with clear visual metaphors",
  product: "for a product introduction video focused on features and user value",
  commercial: "for a polished commercial video with persuasive visual rhythm",
  story: "for an emotional short film with expressive atmosphere",
};

const profiles: VisualProfile[] = [
  {
    key: "pain",
    label: "痛点",
    triggers: ["问题", "错误", "焦虑", "困难", "卡住", "不会", "不知道", "失败", "麻烦", "痛点"],
    intent: "表现用户遇到阻碍、困惑或压力的瞬间",
    imageZh: ["困惑表情", "凌乱工作台", "错误提示", "新手创作者"],
    imageEn: ["confused creator", "messy workspace", "error notification", "beginner content creator"],
    videoZh: ["剪辑时间线混乱", "创作者思考", "电脑前困惑", "工作流卡住"],
    videoEn: ["messy editing timeline", "creator thinking at desk", "confused person at computer", "workflow problem"],
    assets: ["video", "image", "ai_image"],
    promptScene: "a creator at a desk facing a confusing creative workflow",
  },
  {
    key: "process",
    label: "方法",
    triggers: ["方法", "步骤", "流程", "技巧", "拆解", "建议", "如何", "第一", "第二", "最后"],
    intent: "把抽象方法转化成清晰、可跟随的操作流程",
    imageZh: ["流程图", "分镜板", "笔记清单", "操作步骤"],
    imageEn: ["workflow board", "storyboard planning", "checklist notes", "step by step process"],
    videoZh: ["手写计划", "整理分镜", "操作界面", "清单打勾"],
    videoEn: ["planning storyboard", "writing checklist", "organizing workflow", "checking task list"],
    assets: ["screen_recording", "illustration", "video", "ai_image"],
    promptScene: "a clear planning desk with storyboard cards and a structured checklist",
  },
  {
    key: "growth",
    label: "增长",
    triggers: ["增长", "提升", "效率", "效果", "转化", "数据", "结果", "收益", "播放", "完播"],
    intent: "用数据、趋势或结果画面表达变化和提升",
    imageZh: ["数据增长", "趋势图", "仪表盘", "结果对比"],
    imageEn: ["growth dashboard", "rising analytics chart", "performance metrics", "before after results"],
    videoZh: ["数据看板变化", "曲线上升", "团队复盘", "结果展示"],
    videoEn: ["analytics dashboard changing", "rising chart animation", "team reviewing metrics", "performance result"],
    assets: ["screen_recording", "video", "image", "ai_image"],
    promptScene: "a modern analytics dashboard showing improving performance metrics",
  },
  {
    key: "contrast",
    label: "对比",
    triggers: ["不是", "而是", "对比", "区别", "反差", "前后", "以前", "现在"],
    intent: "制造前后差异或两种选择之间的视觉对照",
    imageZh: ["左右对比", "前后变化", "选择分岔", "反差画面"],
    imageEn: ["side by side comparison", "before and after contrast", "split screen choice", "visual contrast"],
    videoZh: ["分屏对比", "前后变化", "错误与正确", "选择路径"],
    videoEn: ["split screen comparison", "before after transformation", "wrong versus right", "two paths decision"],
    assets: ["video", "image", "illustration", "ai_image"],
    promptScene: "a clean split-screen composition comparing a chaotic approach and a clear approach",
  },
  {
    key: "tool",
    label: "工具",
    triggers: ["工具", "软件", "平台", "系统", "自动", "AI", "模型", "素材", "剪辑", "生成"],
    intent: "突出工具、软件界面或自动化工作流带来的效率感",
    imageZh: ["软件界面", "AI 工具", "素材库", "剪辑工作台"],
    imageEn: ["software interface", "AI tool dashboard", "media library", "video editing workspace"],
    videoZh: ["操作软件界面", "浏览素材库", "AI 生成过程", "剪辑工作流"],
    videoEn: ["using software interface", "browsing media library", "AI generation process", "editing workflow"],
    assets: ["screen_recording", "video", "image", "ai_image"],
    promptScene: "a modern creator workstation with an AI media tool interface on screen",
  },
  {
    key: "audience",
    label: "用户",
    triggers: ["用户", "客户", "观众", "普通人", "创作者", "新手", "团队", "品牌"],
    intent: "表现目标用户、使用场景和人物状态",
    imageZh: ["目标用户", "创作者工作", "团队协作", "观众观看视频"],
    imageEn: ["target audience", "creator working", "team collaboration", "viewer watching video"],
    videoZh: ["用户使用产品", "创作者拍摄", "团队讨论", "观众刷短视频"],
    videoEn: ["user using product", "creator filming content", "team discussing ideas", "viewer scrolling short videos"],
    assets: ["video", "image", "ai_image"],
    promptScene: "real people using a creative video workflow in a practical workspace",
  },
];

const defaultProfile: VisualProfile = {
  key: "context",
  label: "场景",
  triggers: [],
  intent: "为文案建立具体、可拍摄的生活或工作场景",
  imageZh: ["创作场景", "工作台", "视觉隐喻", "短视频素材"],
  imageEn: ["creative workspace", "visual metaphor", "short video b-roll", "content creation scene"],
  videoZh: ["创作者工作", "城市生活", "桌面操作", "镜头素材"],
  videoEn: ["creator working", "urban lifestyle b-roll", "desk operation", "cinematic b-roll"],
  assets: ["video", "image", "ai_image"],
  promptScene: "a practical visual metaphor for a creator workflow",
};

const visualKeywordBank: VisualKeyword[] = [
  {
    zh: "短视频创作者",
    en: "short video creator",
    triggers: ["短视频", "创作者", "自媒体", "普通人"],
  },
  {
    zh: "视频剪辑",
    en: "video editing",
    triggers: ["剪辑", "剪视频", "剪片", "时间线"],
  },
  {
    zh: "画面选择",
    en: "choosing video clips",
    triggers: ["配什么画面", "画面选错", "画面", "配图"],
  },
  {
    zh: "常见错误",
    en: "common mistake",
    triggers: ["错误", "犯错", "错了", "误区"],
  },
  {
    zh: "内容散乱",
    en: "scattered content",
    triggers: ["很散", "散乱", "混乱", "杂乱"],
  },
  {
    zh: "分镜规划",
    en: "storyboard planning",
    triggers: ["分镜", "拆分", "拆成分镜", "镜头"],
  },
  {
    zh: "素材库",
    en: "media library",
    triggers: ["素材库", "素材", "图片", "视频"],
  },
  {
    zh: "AI 生成素材",
    en: "AI generated media",
    triggers: ["AI", "生成", "提示词"],
  },
  {
    zh: "工作流程",
    en: "creative workflow",
    triggers: ["流程", "方法", "步骤", "工作流"],
  },
  {
    zh: "工作效率",
    en: "productivity workflow",
    triggers: ["效率", "高效", "快速", "省时间"],
  },
  {
    zh: "观众观看",
    en: "viewer watching short video",
    triggers: ["观众", "观看", "刷视频", "用户观看"],
  },
  {
    zh: "电脑工作台",
    en: "creator desk setup",
    triggers: ["电脑", "工作台", "桌面", "办公桌"],
  },
  {
    zh: "手机拍摄",
    en: "phone filming",
    triggers: ["手机", "拍摄", "录制", "镜头前"],
  },
  {
    zh: "数据看板",
    en: "analytics dashboard",
    triggers: ["数据", "播放", "完播", "转化", "增长"],
  },
  {
    zh: "产品界面",
    en: "product interface",
    triggers: ["产品", "工具", "软件", "平台", "系统"],
  },
  {
    zh: "团队协作",
    en: "team collaboration",
    triggers: ["团队", "协作", "讨论", "复盘"],
  },
];

export function createMaterialPlan(script: string, options: PlannerOptions): ScenePlan[] {
  return splitScript(script).map((segment, index) => {
    const profile = pickProfile(segment);
    const visualTerms = extractVisualKeywords(segment);
    const title = buildTitle(segment, profile, index);
    const duration = clamp(Math.round(segment.length / 9), 3, 7);
    const zhVisualKeywords = visualTerms.map((term) => term.zh);
    const enVisualKeywords = visualTerms.map((term) => term.en);
    const zhKeywords = unique([...zhVisualKeywords, ...profile.imageZh]).slice(0, 5);
    const videoZhKeywords = unique([...zhVisualKeywords, ...profile.videoZh]).slice(0, 5);
    const imageEnKeywords = unique([...profile.imageEn, ...enVisualKeywords]).slice(0, 5);
    const videoEnKeywords = unique([...profile.videoEn, ...enVisualKeywords]).slice(0, 5);

    return {
      id: `scene_${String(index + 1).padStart(3, "0")}`,
      order: index + 1,
      sourceText: segment,
      title,
      visualIntent: `${profile.intent}，适配${videoTypeLabels[options.videoType]}内容。`,
      suggestedDuration: duration,
      assetTypes: ensureAiVideo(profile.assets),
      imageSearchKeywords: {
        zh: zhKeywords,
        en: imageEnKeywords,
      },
      videoSearchKeywords: {
        zh: videoZhKeywords,
        en: videoEnKeywords,
      },
      aiImagePrompt: buildImagePrompt(profile, options, visualTerms),
      aiVideoPrompt: buildVideoPrompt(profile, options, visualTerms),
      negativePrompt: "low quality, blurry, distorted hands, unreadable text, watermark, logo, overexposed, duplicate faces",
      confirmed: false,
      assetCandidates: [],
      selectedAssetId: undefined,
    };
  });
}

export function toMarkdown(scenes: ScenePlan[], options: PlannerOptions): string {
  const header = [
    "# AI 素材方案",
    "",
    `- 视频类型：${videoTypeLabels[options.videoType]}`,
    `- 画幅：${aspectRatioLabels[options.aspectRatio]}`,
    `- 视觉风格：${styleLabels[options.visualStyle]}`,
    "",
  ];

  const body = scenes.flatMap((scene) => [
    `## ${scene.order}. ${scene.title}`,
    "",
    `原文：${scene.sourceText}`,
    "",
    `画面意图：${scene.visualIntent}`,
    "",
    `建议时长：${scene.suggestedDuration}s`,
    "",
    `素材类型：${scene.assetTypes.join(", ")}`,
    "",
    `图片搜索词（中文）：${scene.imageSearchKeywords.zh.join("，")}`,
    "",
    `图片搜索词（英文）：${scene.imageSearchKeywords.en.join(", ")}`,
    "",
    `视频搜索词（中文）：${scene.videoSearchKeywords.zh.join("，")}`,
    "",
    `视频搜索词（英文）：${scene.videoSearchKeywords.en.join(", ")}`,
    "",
    `AI 图片提示词：${scene.aiImagePrompt}`,
    "",
    `AI 视频提示词：${scene.aiVideoPrompt}`,
    "",
    `反向提示词：${scene.negativePrompt}`,
    "",
    ...formatSelectedAssetForMarkdown(scene),
    "",
    ...formatAssetsForMarkdown(scene),
    "",
  ]);

  return [...header, ...body].join("\n");
}

function formatSelectedAssetForMarkdown(scene: ScenePlan): string[] {
  if (!scene.selectedAssetId) {
    return [];
  }

  const asset = scene.assetCandidates.find((candidate) => candidate.id === scene.selectedAssetId);
  if (!asset) {
    return [];
  }

  return [
    `已选素材：${asset.type}｜${asset.title}｜${asset.author}｜${asset.license}`,
    "",
    `素材来源：${asset.sourceUrl}`,
  ];
}

function formatAssetsForMarkdown(scene: ScenePlan): string[] {
  if (scene.assetCandidates.length === 0) {
    return [];
  }

  return [
    "素材候选：",
    "",
    ...scene.assetCandidates.map((asset) => {
      const size = `${asset.width}x${asset.height}${asset.duration ? `, ${asset.duration}s` : ""}`;
      return `- ${asset.type}｜${asset.title}｜${asset.author}｜${size}｜${asset.license}｜${asset.sourceUrl}`;
    }),
  ];
}

function splitScript(script: string): string[] {
  const normalized = script
    .replace(/\r/g, "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .trim();

  if (!normalized) {
    return [];
  }

  if (normalized.length <= 32 && !/[。！？!?；;]/.test(normalized)) {
    return [
      `${normalized}的开场画面`,
      `${normalized}的核心场景`,
      `${normalized}的结果或行动画面`,
    ];
  }

  const rawParts = normalized
    .split(/(?<=[。！？!?；;])|\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const shouldSplitByComma = rawParts.length === 1 && !/[。！？!?；;]/.test(normalized);
  const parts = shouldSplitByComma ? normalized.split(/[，,]/).map((part) => part.trim()).filter(Boolean) : rawParts;
  const joiner = shouldSplitByComma ? "，" : "";
  const scenes: string[] = [];
  let buffer = "";

  parts.forEach((part) => {
    const candidate = buffer ? `${buffer}${joiner}${part}` : part;
    const endsSentence = /[。！？!?；;]$/.test(part);

    if (candidate.length < 16 && !endsSentence) {
      buffer = candidate;
      return;
    }
    if (candidate.length > 90) {
      splitLongPart(candidate).forEach((piece) => scenes.push(piece));
      buffer = "";
      return;
    }
    scenes.push(candidate);
    buffer = "";
  });

  if (buffer) {
    if (scenes.length > 0 && buffer.length < 16) {
      scenes[scenes.length - 1] = `${scenes[scenes.length - 1]}${joiner}${buffer}`;
    } else {
      scenes.push(buffer);
    }
  }

  return scenes.slice(0, 20);
}

function splitLongPart(part: string): string[] {
  const chunks = part.split(/[，,、]/).map((item) => item.trim()).filter(Boolean);
  const result: string[] = [];
  let buffer = "";

  chunks.forEach((chunk) => {
    const candidate = buffer ? `${buffer}，${chunk}` : chunk;
    if (candidate.length > 64 && buffer) {
      result.push(buffer);
      buffer = chunk;
    } else {
      buffer = candidate;
    }
  });

  if (buffer) {
    result.push(buffer);
  }

  return result;
}

function pickProfile(segment: string): VisualProfile {
  let bestProfile = defaultProfile;
  let bestScore = 0;

  profiles.forEach((profile) => {
    const score = profile.triggers.reduce((sum, trigger) => {
      return segment.toLowerCase().includes(trigger.toLowerCase()) ? sum + 1 : sum;
    }, 0);

    if (score > bestScore) {
      bestScore = score;
      bestProfile = profile;
    }
  });

  return bestProfile;
}

function extractVisualKeywords(segment: string): VisualKeyword[] {
  const normalized = segment.toLowerCase();
  const matched = visualKeywordBank.filter((keyword) =>
    keyword.triggers.some((trigger) => normalized.includes(trigger.toLowerCase())),
  );

  return matched.slice(0, 5);
}

function buildTitle(segment: string, profile: VisualProfile, index: number): string {
  const clean = segment.replace(/[，。！？!?；;、]/g, "").trim();
  const summary = clean.length > 12 ? `${clean.slice(0, 12)}...` : clean;
  return `${profile.label} ${index + 1}：${summary}`;
}

function buildImagePrompt(
  profile: VisualProfile,
  options: PlannerOptions,
  visualTerms: VisualKeyword[],
): string {
  const terms = buildPromptTheme(visualTerms);
  return [
    profile.promptScene,
    `visual theme: ${terms}`,
    videoContext[options.videoType],
    stylePrompt[options.visualStyle],
    ratioPrompt[options.aspectRatio],
    "clear subject, practical B-roll material, no readable text",
    "suitable for matching a spoken script segment",
  ].join(", ");
}

function buildVideoPrompt(
  profile: VisualProfile,
  options: PlannerOptions,
  visualTerms: VisualKeyword[],
): string {
  const motion = pickMotion(profile.key);
  const terms = buildPromptTheme(visualTerms);
  return [
    `${motion} of ${profile.promptScene}`,
    `visual cues: ${terms}`,
    videoContext[options.videoType],
    stylePrompt[options.visualStyle],
    ratioPrompt[options.aspectRatio],
    "smooth motion, realistic pacing, usable as short video B-roll, no visible brand logos",
    "suitable for matching a spoken script segment",
  ].join(", ");
}

function buildPromptTheme(visualTerms: VisualKeyword[]): string {
  if (visualTerms.length === 0) {
    return "creator workflow, practical visual metaphor";
  }

  return visualTerms.map((term) => term.en).slice(0, 4).join(", ");
}

function pickMotion(profileKey: string): string {
  const motions: Record<string, string> = {
    pain: "Slow push-in shot",
    process: "Overhead tracking shot",
    growth: "Subtle camera slide across a dashboard",
    contrast: "Split-screen transition shot",
    tool: "Close-up screen and hand interaction shot",
    audience: "Natural handheld observational shot",
    context: "Stable cinematic B-roll shot",
  };

  return motions[profileKey] ?? motions.context;
}

function ensureAiVideo(assetTypes: AssetKind[]): AssetKind[] {
  return unique([...assetTypes, "ai_video"]);
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
