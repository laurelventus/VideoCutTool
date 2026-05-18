export type AssetKind =
  | "video"
  | "image"
  | "illustration"
  | "icon"
  | "screen_recording"
  | "ai_image"
  | "ai_video";

export type AspectRatio = "9:16" | "16:9" | "1:1";

export type VideoType =
  | "talking_head"
  | "knowledge"
  | "product"
  | "commercial"
  | "story";

export type VisualStyle =
  | "documentary"
  | "clean_commercial"
  | "tech_product"
  | "education"
  | "cinematic"
  | "social_energy";

export interface KeywordGroup {
  zh: string[];
  en: string[];
}

export type AssetCandidateType = "photo" | "video";
export type AssetSearchType = "all" | "photo" | "video";
export type AssetSortMode = "relevance" | "resolution" | "duration";

export interface AssetCandidate {
  id: string;
  sceneId: string;
  type: AssetCandidateType;
  source: "Pexels";
  title: string;
  previewUrl: string;
  thumbnailUrl: string;
  downloadUrl: string;
  author: string;
  authorUrl: string;
  license: string;
  sourceUrl: string;
  width: number;
  height: number;
  duration?: number;
  relevanceScore: number;
}

export interface ScenePlan {
  id: string;
  order: number;
  sourceText: string;
  title: string;
  visualIntent: string;
  suggestedDuration: number;
  assetTypes: AssetKind[];
  imageSearchKeywords: KeywordGroup;
  videoSearchKeywords: KeywordGroup;
  aiImagePrompt: string;
  aiVideoPrompt: string;
  negativePrompt: string;
  confirmed: boolean;
  assetCandidates: AssetCandidate[];
  selectedAssetId?: string;
}

export interface PlannerOptions {
  videoType: VideoType;
  aspectRatio: AspectRatio;
  visualStyle: VisualStyle;
}
