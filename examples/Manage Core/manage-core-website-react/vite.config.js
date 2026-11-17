import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendPublic = path.resolve(__dirname, "../manage-core-backend/public");

function cleanMarketingAssets() {
  const dirs = ["assets", "images", "og"];
  const files = ["index.html"];
  return {
    name: "clean-marketing-assets",
    buildStart() {
      for (const d of dirs) {
        const p = path.join(backendPublic, d);
        if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
      }
      for (const f of files) {
        const p = path.join(backendPublic, f);
        if (fs.existsSync(p)) fs.unlinkSync(p);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), cleanMarketingAssets()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  server: {
    port: 3001,
    strictPort: true,
  },
  build: {
    outDir: backendPublic,
    emptyOutDir: false,
    sourcemap: false,
    minify: "esbuild",
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react") || id.includes("react-router")) return "vendor";
          if (id.includes("node_modules/react-icons")) return "icons";
          if (id.includes("node_modules/jspdf")) return "pdf";
          if (id.includes("/src/data/servicesData")) return "data-services";
          if (id.includes("/src/data/siteData")) return "data-site";
        },
      },
    },
  },
});
