"use client";

/**
 * Sandboxed PDF viewer used by the admin detail panel.
 *
 * The PDF is served with `Content-Security-Policy: sandbox` (plus `nosniff`
 * and an inline disposition), so the document opens in an opaque origin with
 * scripting disabled — an uploaded resume cannot reach the admin session.
 * Note: an `sandbox` attribute on the iframe itself makes Chrome/Edge refuse
 * to render PDFs at all, so the isolation comes from the response header.
 */
export default function PdfViewer({ src, title = "PDF" }: { src: string; title?: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-wide text-[#525252]">
          {title} · safe mode
        </span>
        <span className="flex gap-2">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded bg-[#0000ff]/10 text-[#0000ff] text-xs font-semibold hover:bg-[#0000ff]/20"
          >
            Open in new tab
          </a>
          <a
            href={src}
            download
            className="px-2.5 py-1 rounded bg-black/5 text-black text-xs font-semibold hover:bg-black/10"
          >
            Download
          </a>
        </span>
      </div>
      <iframe
        src={src}
        title={title}
        referrerPolicy="no-referrer"
        className="h-[65vh] w-full rounded-lg border border-black/15 bg-white"
      />
      <p className="text-[11px] text-[#525252] mt-1.5">
        Rendered by the browser&apos;s built-in PDF viewer. The server sends a sandbox
        policy for this file, so it runs in an isolated origin with scripts disabled.
      </p>
    </div>
  );
}
