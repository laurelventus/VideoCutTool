import type { IncomingMessage, ServerResponse } from "node:http";
import type { Plugin, PreviewServer, ViteDevServer } from "vite";

const PEXELS_API_BASE = "https://api.pexels.com";
const PEXELS_LICENSE = "Pexels License";

type AspectRatio = "9:16" | "16:9" | "1:1";
type AssetCandidateType = "photo" | "video";
type AssetSearchType = "all" | "photo" | "video";

interface KeywordGroup {
  zh: string[];
  en: string[];
}

interface AssetCandidate {
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

interface ScenePlan {
  id: string;
  title: string;
  imageSearchKeywords: KeywordGroup;
  videoSearchKeywords: KeywordGroup;
}

interface SearchPayload {
  scene: ScenePlan;
  options: {
    aspectRatio: AspectRatio;
    assetType?: AssetSearchType;
    perPage?: number;
  };
}

interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt?: string;
  src: {
    medium: string;
    large: string;
    large2x?: string;
    original: string;
  };
}

interface PexelsPhotoResponse {
  photos: PexelsPhoto[];
}

interface PexelsVideoFile {
  id: number;
  quality: string;
  file_type: string;
  width: number | null;
  height: number | null;
  link: string;
}

interface PexelsVideoPicture {
  id: number;
  picture: string;
  nr: number;
}

interface PexelsVideo {
  id: number;
  width: number;
  height: number;
  url: string;
  image: string;
  duration: number;
  user: {
    id: number;
    name: string;
    url: string;
  };
  video_files: PexelsVideoFile[];
  video_pictures: PexelsVideoPicture[];
}

interface PexelsVideoResponse {
  videos: PexelsVideo[];
}

export function pexelsApiPlugin(apiKey: string): Plugin {
  return {
    name: "local-pexels-api",
    configureServer(server) {
      installPexelsMiddleware(server, apiKey);
    },
    configurePreviewServer(server) {
      installPexelsMiddleware(server, apiKey);
    },
  };
}

function installPexelsMiddleware(server: ViteDevServer | PreviewServer, apiKey: string) {
  server.middlewares.use("/api/pexels/assets", async (request, response) => {
    if (request.method !== "POST") {
      sendJson(response, 405, { message: "Method not allowed" });
      return;
    }

    if (!apiKey) {
      sendJson(response, 400, { message: "请在 .env 中配置 PEXELS_API_KEY" });
      return;
    }

    try {
      const payload = (await readJsonBody(request)) as SearchPayload;
      const assets = await searchPexelsAssets(payload, apiKey);
      sendJson(response, 200, { assets });
    } catch (error) {
      const message = error instanceof Error ? error.message : "素材搜索失败";
      sendJson(response, 500, { message });
    }
  });
}

async function searchPexelsAssets(payload: SearchPayload, apiKey: string): Promise<AssetCandidate[]> {
  const photoQuery = buildQuery(payload.scene.imageSearchKeywords.en, payload.scene.title);
  const videoQuery = buildQuery(payload.scene.videoSearchKeywords.en, payload.scene.title);
  const assetType = payload.options.assetType ?? "all";
  const perPage = clamp(payload.options.perPage ?? 6, 1, 12);
  const tasks: Promise<AssetCandidate[]>[] = [];

  if (assetType === "all" || assetType === "photo") {
    tasks.push(searchPexelsPhotos(payload.scene, photoQuery, payload.options.aspectRatio, perPage, apiKey));
  }

  if (assetType === "all" || assetType === "video") {
    tasks.push(searchPexelsVideos(payload.scene, videoQuery, payload.options.aspectRatio, perPage, apiKey));
  }

  const results = await Promise.allSettled(tasks);

  const assets = results.flatMap((result) => (result.status === "fulfilled" ? result.value : []));

  if (assets.length === 0) {
    const firstError = results.find((result) => result.status === "rejected");
    if (firstError?.status === "rejected") {
      throw new Error(firstError.reason instanceof Error ? firstError.reason.message : "素材搜索失败");
    }
  }

  return assets.sort((left, right) => right.relevanceScore - left.relevanceScore);
}

async function searchPexelsPhotos(
  scene: ScenePlan,
  query: string,
  aspectRatio: AspectRatio,
  perPage: number,
  apiKey: string,
): Promise<AssetCandidate[]> {
  const url = new URL("/v1/search", PEXELS_API_BASE);
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", toPexelsOrientation(aspectRatio));
  url.searchParams.set("per_page", String(perPage));

  const result = await requestPexels<PexelsPhotoResponse>(url, apiKey);

  return result.photos.map((photo) => ({
    id: `pexels_photo_${photo.id}`,
    sceneId: scene.id,
    type: "photo",
    source: "Pexels",
    title: photo.alt || `Photo by ${photo.photographer}`,
    previewUrl: photo.src.large,
    thumbnailUrl: photo.src.medium,
    downloadUrl: photo.src.large2x ?? photo.src.original,
    author: photo.photographer,
    authorUrl: photo.photographer_url,
    license: PEXELS_LICENSE,
    sourceUrl: photo.url,
    width: photo.width,
    height: photo.height,
    relevanceScore: scoreAsset(photo.alt ?? "", query, photo.width, photo.height, aspectRatio),
  }));
}

async function searchPexelsVideos(
  scene: ScenePlan,
  query: string,
  aspectRatio: AspectRatio,
  perPage: number,
  apiKey: string,
): Promise<AssetCandidate[]> {
  const url = new URL("/videos/search", PEXELS_API_BASE);
  url.searchParams.set("query", query);
  url.searchParams.set("orientation", toPexelsOrientation(aspectRatio));
  url.searchParams.set("per_page", String(perPage));

  const result = await requestPexels<PexelsVideoResponse>(url, apiKey);

  return result.videos
    .map((video): AssetCandidate | null => {
      const videoFile = pickVideoFile(video.video_files, aspectRatio);
      if (!videoFile) {
        return null;
      }

      return {
        id: `pexels_video_${video.id}`,
        sceneId: scene.id,
        type: "video",
        source: "Pexels",
        title: `Video by ${video.user.name}`,
        previewUrl: videoFile.link,
        thumbnailUrl: video.video_pictures[0]?.picture ?? video.image,
        downloadUrl: videoFile.link,
        author: video.user.name,
        authorUrl: video.user.url,
        license: PEXELS_LICENSE,
        sourceUrl: video.url,
        width: videoFile.width ?? video.width,
        height: videoFile.height ?? video.height,
        duration: video.duration,
        relevanceScore: scoreAsset(video.user.name, query, video.width, video.height, aspectRatio),
      };
    })
    .filter((asset): asset is AssetCandidate => Boolean(asset));
}

async function requestPexels<ResponseShape>(url: URL, apiKey: string): Promise<ResponseShape> {
  const response = await fetch(url, {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Pexels API Key 无效或缺失");
    }
    if (response.status === 429) {
      throw new Error("Pexels 请求频率已达上限");
    }
    throw new Error(`Pexels 请求失败：${response.status}`);
  }

  return response.json() as Promise<ResponseShape>;
}

function buildQuery(keywords: string[], fallback: string): string {
  const query = keywords
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .slice(0, 3)
    .join(" ");

  return (query || fallback).slice(0, 90);
}

function toPexelsOrientation(aspectRatio: AspectRatio): "portrait" | "landscape" | "square" {
  if (aspectRatio === "16:9") {
    return "landscape";
  }
  if (aspectRatio === "1:1") {
    return "square";
  }
  return "portrait";
}

function pickVideoFile(files: PexelsVideoFile[], aspectRatio: AspectRatio): PexelsVideoFile | undefined {
  const orientation = toPexelsOrientation(aspectRatio);

  return files
    .filter((file) => file.file_type === "video/mp4" && file.width && file.height)
    .sort((left, right) => {
      const leftMatch = matchesOrientation(left.width ?? 0, left.height ?? 0, orientation) ? 1 : 0;
      const rightMatch = matchesOrientation(right.width ?? 0, right.height ?? 0, orientation) ? 1 : 0;
      if (leftMatch !== rightMatch) {
        return rightMatch - leftMatch;
      }

      const leftPixels = (left.width ?? 0) * (left.height ?? 0);
      const rightPixels = (right.width ?? 0) * (right.height ?? 0);
      return rightPixels - leftPixels;
    })[0];
}

function matchesOrientation(width: number, height: number, orientation: "portrait" | "landscape" | "square"): boolean {
  if (orientation === "portrait") {
    return height >= width;
  }
  if (orientation === "landscape") {
    return width >= height;
  }
  return Math.abs(width - height) / Math.max(width, height) < 0.12;
}

function scoreAsset(title: string, query: string, width: number, height: number, aspectRatio: AspectRatio): number {
  const normalizedTitle = title.toLowerCase();
  const keywordHits = query
    .toLowerCase()
    .split(/\s+/)
    .filter((keyword) => keyword.length > 3 && normalizedTitle.includes(keyword)).length;
  const orientationBonus = matchesOrientation(width, height, toPexelsOrientation(aspectRatio)) ? 0.16 : 0;

  return Number(Math.min(0.98, 0.68 + keywordHits * 0.04 + orientationBonus).toFixed(2));
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function readJsonBody(request: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {
      try {
        resolve(JSON.parse(body || "{}"));
      } catch (error) {
        reject(error);
      }
    });

    request.on("error", reject);
  });
}

function sendJson(response: ServerResponse, status: number, payload: unknown) {
  response.statusCode = status;
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.end(JSON.stringify(payload));
}
