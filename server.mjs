import express from "express";
import compression from "compression";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BUILD_DIR = path.join(__dirname, "dist");
const INDEX_HTML = path.join(BUILD_DIR, "index.html");
const PORT = Number(process.env.PORT || 4173);
const API_UPSTREAM = (process.env.CURSORHELP_API_UPSTREAM || "http://localhost:3000").replace(
  /\/$/,
  ""
);

const STATIC_EXTENSIONS =
  /\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|map|json|webmanifest|txt)$/i;

function isStaticAsset(reqPath) {
  if (reqPath.startsWith("/assets/")) return true;
  if (STATIC_EXTENSIONS.test(reqPath)) return true;
  if (reqPath === "/favicon.ico" || reqPath === "/favicon.svg" || reqPath === "/icons.svg")
    return true;
  return false;
}

function sendIndexHtml(res) {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send(fs.readFileSync(INDEX_HTML));
}

async function proxySitemap(req, res) {
  try {
    const upstream = await fetch(`${API_UPSTREAM}/api/v1/sitemap.xml`, {
      headers: { Accept: "application/xml, text/xml, */*" },
    });
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/xml");
    const body = await upstream.text();
    res.send(body);
  } catch (err) {
    console.error("[Cursor Help] sitemap proxy failed:", err);
    res.status(502).send("Sitemap unavailable");
  }
}

const app = express();
app.disable("x-powered-by");
app.use(compression());

app.get("/sitemap.xml", proxySitemap);
app.head("/sitemap.xml", proxySitemap);

app.use((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).end();
    return;
  }

  const reqPath = req.path || "/";

  if (isStaticAsset(reqPath)) {
    return express.static(BUILD_DIR, { index: false })(req, res, () => {
      res.status(404).end();
    });
  }

  if (req.method === "HEAD") {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.status(200).end();
    return;
  }

  sendIndexHtml(res);
});

if (!fs.existsSync(INDEX_HTML)) {
  console.error(`[Cursor Help] Missing ${INDEX_HTML}. Run npm run build first.`);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`[Cursor Help] Serving dist/ on port ${PORT}`);
});
