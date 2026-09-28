import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

/**
 * Serves runtime uploads from disk.
 *
 * Next serves `public/` out of a snapshot taken when the server boots (and
 * `output: "standalone"` serves the copy inside `.next/standalone/public`),
 * so an image uploaded after start-up would 404. Reading the file here keeps
 * profile pictures live in every run mode — `next start`, the standalone
 * server, and the Docker image.
 */
const CONTENT_TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

const SAFE_NAME = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export async function GET(
  _request: NextRequest,
  ctx: { params: Promise<{ name: string }> }
) {
  const { name } = await ctx.params;

  if (!SAFE_NAME.test(name) || name.includes("..")) {
    return new NextResponse(null, { status: 404 });
  }

  const file = path.join(process.cwd(), "public", "uploads", name);
  const type = CONTENT_TYPES[path.extname(name).toLowerCase()];
  if (!type) return new NextResponse(null, { status: 404 });

  let buffer: Buffer;
  try {
    buffer = await readFile(file);
  } catch {
    return new NextResponse(null, { status: 404 });
  }

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": type,
      "Content-Length": String(buffer.length),
      "X-Content-Type-Options": "nosniff",
      ...(type === "application/pdf"
        ? {
            // Never let a PDF drive the page it is embedded in.
            "Content-Security-Policy": "sandbox",
            "Content-Disposition": `inline; filename="${name}"`,
          }
        : {}),
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
