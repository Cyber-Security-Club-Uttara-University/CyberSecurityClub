"use client";

import { useRef, useState } from "react";

const ALLOWED = ["image/jpeg", "image/png"];

function isAllowedType(type: string) {
  return ALLOWED.includes(type.toLowerCase());
}

/** Small fixed frame that always fits the whole image (no cropping). */
export function ImageThumb({ src, alt = "" }: { src: string; alt?: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        title={src}
        className="h-10 w-10 shrink-0 rounded border border-black/15 bg-[repeating-conic-gradient(#eef1f6_0%_25%,#ffffff_0%_50%)] flex items-center justify-center text-[10px] font-bold text-red-500"
      >
        ?
      </span>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      key={src}
      src={src}
      alt={alt}
      title={src}
      className="h-10 w-10 shrink-0 rounded border border-black/15 bg-[repeating-conic-gradient(#eef1f6_0%_25%,#ffffff_0%_50%)] object-contain p-0.5"
      onError={() => setFailed(true)}
      onLoad={() => setFailed(false)}
    />
  );
}


export default function ImageField({
  value,
  onChange,
  label = "Image",
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  const src = String(value ?? "").trim();
  const broken = Boolean(src) && failedSrc === src;

  async function upload(file: File | undefined | null) {
    setError(null);
    if (!file) return;

    if (!isAllowedType(file.type)) {
      setError("Only JPEG and PNG images are allowed.");
      return;
    }
    if (file.size === 0) {
      setError("File is empty.");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("File is too large (max 8 MB).");
      return;
    }

    setBusy(true);
    try {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || `Upload failed (${res.status})`);
      } else {
        onChange(data.url);
      }
    } catch {
      setError("Network error while uploading.");
    }
    setBusy(false);
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          placeholder="/images/... or /uploads/..."
          onChange={(e) => {
            setError(null);
            onChange(e.target.value);
          }}
          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-black/15 bg-white text-black text-sm focus:outline-none focus:border-[#0000ff]"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="shrink-0 px-3 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] disabled:opacity-60"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 px-3 py-2 rounded-lg bg-black/5 text-black text-sm font-semibold hover:bg-black/10"
          >
            Clear
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => {
          upload(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {/* Small frame that always shows the whole image */}
      <div className="mt-2 flex items-start gap-3">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            upload(e.dataTransfer.files?.[0]);
          }}
          className={`relative shrink-0 h-40 w-40 rounded-lg border-2 border-dashed overflow-hidden flex items-center justify-center ${
            dragging
              ? "border-[#0000ff] bg-[#0000ff]/5"
              : broken
                ? "border-red-300 bg-red-50"
                : "border-black/15 bg-[repeating-conic-gradient(#eef1f6_0%_25%,#ffffff_0%_50%)]"
          }`}
        >
          {src && !broken ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={src}
              src={src}
              alt=""
              className="h-full w-full object-contain p-1.5"
              onLoad={() => setFailedSrc(null)}
              onError={() => setFailedSrc(src)}
            />
          ) : (
            <div className="px-3 text-center text-[11px] leading-4 text-[#525252]">
              {broken ? (
                <>
                  <span className="font-bold text-red-600">Image not found</span>
                  <br />
                  <span className="break-all">{src}</span>
                </>
              ) : (
                <>
                  <span className="font-semibold">Drop a JPEG or PNG</span>
                  <br />
                  <span className="text-[#9aa1bd]">or click Upload</span>
                </>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wide text-[#525252]">{label}</p>
          <p className="mt-1 text-xs text-black break-all">
            {src || "No image selected"}
          </p>
          <p className="mt-2 text-[11px] leading-4 text-[#525252]">
            JPEG or PNG only, up to 8&nbsp;MB. Preview fits the whole image inside the frame.
          </p>
          {error && (
            <p className="mt-2 text-xs font-semibold text-red-600">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
