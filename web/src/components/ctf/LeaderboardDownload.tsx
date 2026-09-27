"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import LeaderboardShareCard from "./LeaderboardShareCard";
import type { LeaderboardRow } from "@/content/ctf";

const CARD_W = 1200;
const CARD_H = 630;

function slugify(value: string) {
  return (
    value
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[^\w\s-]/g, "")
      .trim()
      .replace(/[\s_]+/g, "-")
      .replace(/-+/g, "-") || "leaderboard"
  );
}

/**
 * Title picker + PNG export for the public leaderboard. Anyone can use it —
 * no admin session required.
 */
export default function LeaderboardDownload({
  rows,
  titleOptions,
  logoUrl,
}: {
  rows: LeaderboardRow[];
  titleOptions: string[];
  logoUrl: string;
}) {
  const [title, setTitle] = useState(titleOptions[0] ?? "Our leaderboard");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  async function download() {
    if (!cardRef.current || busy) return;
    setBusy(true);
    setError("");
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        width: CARD_W,
        height: CARD_H,
        backgroundColor: "#0a0f28",
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = `${slugify(title)}.png`;
      link.href = dataUrl;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("leaderboard image export failed", e);
      setError("Could not render the image. Please try again.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label
          htmlFor="lb-image-title"
          className="block text-[11px] font-bold uppercase tracking-[0.12em] text-[#8a91b0] mb-1.5"
        >
          Image title
        </label>
        <select
          id="lb-image-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="cursor-pointer rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-semibold text-black outline-none transition-colors hover:border-[#0000ff] focus:border-[#0000ff]"
        >
          {titleOptions.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={download}
        disabled={busy || rows.length === 0}
        className="inline-flex items-center gap-2 rounded-lg bg-[#0000ff] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0000cc] disabled:opacity-50"
      >
        {busy ? "Rendering…" : "Download image"}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-4-4m4 4l4-4"
          />
        </svg>
      </button>

      {error && <span className="text-sm font-semibold text-red-600">{error}</span>}

      {/* Rendered off-screen so it never flashes, but stays laid out for export. */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          left: -20000,
          top: 0,
          width: CARD_W,
          height: CARD_H,
          pointerEvents: "none",
          opacity: 1,
        }}
      >
        <div ref={cardRef}>
          <LeaderboardShareCard title={title} rows={rows} logoUrl={logoUrl} />
        </div>
      </div>
    </div>
  );
}
