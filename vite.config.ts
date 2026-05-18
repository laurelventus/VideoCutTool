import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { pexelsApiPlugin } from "./server/pexelsProxy";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const pexelsApiKey = env.PEXELS_API_KEY || process.env.PEXELS_API_KEY || "";

  return {
    plugins: [react(), pexelsApiPlugin(pexelsApiKey)],
  };
});
