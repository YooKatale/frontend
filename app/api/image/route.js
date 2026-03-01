/**
 * Image proxy that serves images as WebP for smaller size and faster loading.
 * GET /api/image?url=<encoded-url>
 * - Fetches the image from the given URL (or reads from /public for same-origin paths)
 * - Converts to WebP and returns with long cache headers.
 */

import { NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

const ALLOWED_ORIGINS = [
  "https://yookatale-server.onrender.com",
  "https://yookatale-server-app.onrender.com",
  "https://yookatale.s3.eu-north-1.amazonaws.com",
  "https://www.yookatale.app",
  "https://yookatale.app",
  "https://images.unsplash.com",
  "https://flagcdn.com",
  "https://img.icons8.com",
  "http://localhost",
  "http://127.0.0.1",
];

function isAllowedUrl(url) {
  try {
    if (!url || typeof url !== "string") return false;
    const u = new URL(url, "http://localhost");
    if (u.protocol === "data:") return false;
    const origin = u.origin;
    return ALLOWED_ORIGINS.some((o) => origin === o || origin.startsWith(o + ":"));
  } catch {
    return false;
  }
}

/** Safe path for reading from public: must start with / and not escape public */
function getPublicPath(urlPath) {
  const normalized = path.normalize(urlPath).replace(/\\/g, "/");
  if (!normalized.startsWith("/") || normalized.includes("..")) return null;
  if (!/^\/assets\//.test(normalized)) return null;
  return path.join(process.cwd(), "public", normalized);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    const decodedUrl = decodeURIComponent(url);
    let buffer;

    // Same-origin path (e.g. /assets/images/...) — read from filesystem
    if (decodedUrl.startsWith("/") && !decodedUrl.startsWith("//")) {
      const filePath = getPublicPath(decodedUrl);
      if (!filePath) {
        return NextResponse.json({ error: "Invalid path" }, { status: 400 });
      }
      try {
        buffer = await fs.readFile(filePath);
      } catch (err) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
    } else {
      if (!isAllowedUrl(decodedUrl)) {
        return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
      }
      const res = await fetch(decodedUrl, {
        headers: { Accept: "image/*" },
        next: { revalidate: 86400 },
      });
      if (!res.ok) {
        return NextResponse.json({ error: "Upstream image failed" }, { status: 502 });
      }
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.startsWith("image/")) {
        return NextResponse.json({ error: "Not an image" }, { status: 400 });
      }
      buffer = Buffer.from(await res.arrayBuffer());
    }

    // Already WebP and small? Optional: skip conversion to save CPU (we'll always convert for consistency and size)
    const webp = await sharp(buffer)
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    return new NextResponse(webp, {
      status: 200,
      headers: {
        "Content-Type": "image/webp",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (err) {
    console.error("[api/image]", err);
    return NextResponse.json({ error: "Image processing failed" }, { status: 500 });
  }
}
