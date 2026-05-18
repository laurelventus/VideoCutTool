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

const stopWords = [
  "这个",
  "一个",
  "我们",
  "你会",
  "可以",
  "如果",
  "因为",
  "所以",
  "但是",
  "没有",
  "不是",
  "就是",
  "时候",
  "需要",
  "自己",
];

export function createMaterialPlan(script: string, options: PlannerOptions): ScenePlan[] {
  return splitScript(script).map((segment, index) => {
    const profile = pickProfile(segment);
    const keyTerms = extractKeyTerms(segment);
    const title = buildTitle(segment, profile, index);
    const duration = clamp(Math.round(segment.length / 9), 3, 7);
    const zhKeywords = unique([...keyTerms, ...profile.imageZh]).slice(0, 5);
    const videoZhKeywords = unique([...keyTerms, ...profile.videoZh]).slice(0, 5);
    const imageEnKeywords = unique([...profile.imageEn, ...translateKeyTerms(keyTerms)]).slice(0, 5);
    const videoEnKeywords = unique([...profile.videoEn, ...translateKeyTerms(keyTerms)]).slice(0, 5);

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
      aiImagePrompt: buildImagePrompt(segment, profile, options, keyTerms),
      aiVideoPrompt: buildVideoPrompt(segment, profile, options, keyTerms),
      negativePrompt: "low quality, blurry, distorted hands, unreadable text, watermark, logo, overexposed, duplicate faces",
      confirmed: false,
      assetCandidates: [],
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
    ...formatAssetsForMarkdown(scene),
    "",
  ]);

  return [...header, ...body].join("\n");
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

  const parts = rawParts.length > 1 ? rawParts : normalized.split(/[，,]/).map((part) => part.trim()).filter(Boolean);
  const scenes: string[] = [];
  let buffer = "";

  parts.forEach((part) => {
    const candidate = buffer ? `${buffer}${part}` : part;
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
      scenes[scenes.length - 1] = `${scenes[scenes.length - 1]}${buffer}`;
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

function extractKeyTerms(segment: string): string[] {
  const matches = segment.match(/[\u4e00-\u9fa5A-Za-z0-9]{2,8}/g) ?? [];
  return unique(
    matches
      .map((term) => term.replace(/[，。！？!?；;、]/g, ""))
      .filter((term) => term.length >= 2)
      .filter((term) => !stopWords.some((stopWord) => term.includes(stopWord)))
      .slice(0, 6),
  );
}

function buildTitle(segment: string, profile: VisualProfile, index: number): string {
  const clean = segment.replace(/[，。！？!?；;、]/g, "").trim();
  const summary = clean.length > 12 ? `${clean.slice(0, 12)}...` : clean;
  return `${profile.label} ${index + 1}：${summary}`;
}

function buildImagePrompt(
  segment: string,
  profile: VisualProfile,
  options: PlannerOptions,
  keyTerms: string[],
): string {
  const terms = keyTerms.length > 0 ? `related to ${keyTerms.join(", ")}` : "related to the script segment";
  return [
    profile.promptScene,
    terms,
    videoContext[options.videoType],
    stylePrompt[options.visualStyle],
    ratioPrompt[options.aspectRatio],
    "clear subject, practical B-roll material, no readable text",
    `script meaning: ${segment}`,
  ].join(", ");
}

function buildVideoPrompt(
  segment: string,
  profile: VisualProfile,
  options: PlannerOptions,
  keyTerms: string[],
): string {
  const motion = pickMotion(profile.key);
  const terms = keyTerms.length > 0 ? `visual cues: ${keyTerms.join(", ")}` : "visual cues from the script";
  return [
    `${motion} of ${profile.promptScene}`,
    terms,
    videoContext[options.videoType],
    stylePrompt[options.visualStyle],
    ratioPrompt[options.aspectRatio],
    "smooth motion, realistic pacing, usable as short video B-roll, no visible brand logos",
    `script meaning: ${segment}`,
  ].join(", ");
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

function translateKeyTerms(terms: string[]): string[] {
  const dictionary: Record<string, string> = {
    文案: "script writing",
    提示词: "prompt engineering",
    图片: "image material",
    视频: "video footage",
    素材: "media assets",
    剪辑: "video editing",
    短视频: "short video",
    创作者: "content creator",
    用户: "user",
    产品: "product",
    工具: "tool",
    数据: "data analytics",
    效率: "productivity",
    方法: "method",
    流程: "workflow",
    结果: "result",
  };

  return terms.map((term) => dictionary[term] ?? term).filter(Boolean);
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
