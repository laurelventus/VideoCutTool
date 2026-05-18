import type { AssetCandidate, AspectRatio, ScenePlan } from "./types";

interface SearchOptions {
  aspectRatio: AspectRatio;
  perPage?: number;
}

interface SearchPayload {
  scene: ScenePlan;
  options: SearchOptions;
}

interface SearchResponse {
  assets: AssetCandidate[];
}

export async function searchPexelsAssets(
  scene: ScenePlan,
  options: SearchOptions,
): Promise<AssetCandidate[]> {
  const response = await fetch("/api/pexels/assets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      scene,
      options,
    } satisfies SearchPayload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.message ?? `素材搜索失败：${response.status}`);
  }

  const data = (await response.json()) as SearchResponse;
  return data.assets;
}
