/**
 * Copy manage-core-frontend company site → standalone React (Vite) project.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "..", "manage-core-frontend", "src", "pages", "company", "site");
const FRONTEND_PUBLIC = path.join(ROOT, "..", "manage-core-frontend", "public", "images");

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyDir(from, to, transform) {
  if (!fs.existsSync(from)) return;
  ensureDir(to);
  for (const ent of fs.readdirSync(from, { withFileTypes: true })) {
    const src = path.join(from, ent.name);
    const dest = path.join(to, ent.name);
    if (ent.isDirectory()) copyDir(src, dest, transform);
    else {
      let content = fs.readFileSync(src, "utf8");
      if (transform) content = transform(content, src);
      if (content == null) continue;
      fs.writeFileSync(dest, content);
    }
  }
}

function copyFile(from, to, transform) {
  if (!fs.existsSync(from)) return;
  ensureDir(path.dirname(to));
  let content = fs.readFileSync(from, "utf8");
  if (transform) content = transform(content, from);
  fs.writeFileSync(to, content);
}

function toReact(content) {
  return content
    .replace(/from "\.\.\/SiteTheme"/g, 'from "@/components/SiteTheme"')
    .replace(/from "\.\.\/siteData"/g, 'from "@/data/siteData"')
    .replace(/from "\.\.\/servicesData"/g, 'from "@/data/servicesData"')
    .replace(/from "\.\.\/productsData"/g, 'from "@/data/productsData"')
    .replace(/from "\.\.\/industriesData"/g, 'from "@/data/industriesData"')
    .replace(/from "\.\.\/aboutData"/g, 'from "@/data/aboutData"')
    .replace(/from "\.\.\/resourceData"/g, 'from "@/data/resourceData"')
    .replace(/from "\.\.\/comparisonData"/g, 'from "@/data/comparisonData"')
    .replace(/from "\.\.\/pricingData"/g, 'from "@/data/pricingData"')
    .replace(/from "\.\.\/components\//g, 'from "@/components/')
    .replace(/from "\.\/components\//g, 'from "@/components/')
    .replace(/from "\.\/pages\//g, 'from "@/pages/')
    .replace(/from "\.\.\/\.\.\/\.\.\/\.\.\/assets\/images\/logo1\.png"/g, '"/images/logo1.png"')
    .replace(/import logoMark from "[^"]+logo1\.png";/g, 'const logoMark = "/images/logo1.png";')
    .replace(/import logo from "[^"]+logo1\.png";/g, 'const logo = "/images/logo1.png";')
    .replace(/import "\.\/site\.css";/g, 'import "@/styles/site.css";')
    .replace(/import "\.\/preloader\.css";/g, 'import "@/styles/preloader.css";')
    .replace(/import "\.\/skeleton\.css";/g, 'import "@/styles/skeleton.css";')
    .replace(/import "\.\/fonts-bridge\.css";/g, 'import "@/styles/fonts-bridge.css";');
}

// --- public images ---
const pubRoot = path.join(ROOT, "public", "images");
if (fs.existsSync(FRONTEND_PUBLIC)) {
  copyDir(FRONTEND_PUBLIC, pubRoot);
  console.log("Copied public/images from frontend");
} else if (fs.existsSync(path.join(ROOT, "public", "images"))) {
  console.log("Using existing public/images");
}

// --- pages ---
copyDir(path.join(SRC, "pages"), path.join(ROOT, "src", "pages"), toReact);

// --- components ---
copyDir(path.join(SRC, "components"), path.join(ROOT, "src", "components"), toReact);

// --- data (root-level *.js in site folder) ---
ensureDir(path.join(ROOT, "src", "data"));
for (const ent of fs.readdirSync(SRC, { withFileTypes: true })) {
  if (ent.isFile() && ent.name.endsWith(".js") && ent.name !== "marketingPaths.js") {
    copyFile(path.join(SRC, ent.name), path.join(ROOT, "src", "data", ent.name));
  }
}

// --- SiteTheme ---
copyFile(path.join(SRC, "SiteTheme.jsx"), path.join(ROOT, "src", "components", "SiteTheme.jsx"), toReact);

// --- styles ---
copyFile(path.join(SRC, "site.css"), path.join(ROOT, "src", "styles", "site.css"));
copyFile(path.join(SRC, "fonts-bridge.css"), path.join(ROOT, "src", "styles", "fonts-bridge.css"));
copyFile(path.join(SRC, "components", "preloader.css"), path.join(ROOT, "src", "styles", "preloader.css"));
copyFile(path.join(SRC, "components", "skeleton.css"), path.join(ROOT, "src", "styles", "skeleton.css"));

// --- Footer (keep react paths) ---
copyFile(
  path.join(SRC, "components", "Footer.jsx"),
  path.join(ROOT, "src", "components", "Footer.jsx"),
  (c) => {
    c = toReact(c);
    c = c.replace(/import logoMark from "[^"]+";/, 'const logoMark = "/images/logo1.png";');
    return c;
  }
);

console.log("Sync from manage-core-frontend complete.");
