"use client";

import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import type { Announcement } from "@/lib/content";

const STORAGE_KEY = "csc-dismissed-announcements";
const CHANGE_EVENT = "csc-announcements-change";

let cachedRaw: string | null = null;
let cachedIds: number[] = [];

function readDismissed(): number[] {
  if (typeof window === "undefined") return [];
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedIds = raw ? (JSON.parse(raw) as number[]) : [];
      if (!Array.isArray(cachedIds)) cachedIds = [];
    } catch {
      cachedIds = [];
    }
  }
  return cachedIds;
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function dismiss(id: number) {
  try {
    const current = readDismissed();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...current, id]));
  } catch {
    // storage unavailable (private mode) — still hide for this session
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function isHiddenOnAdmin(pathname: string) {
  return pathname.startsWith("/admin") || pathname.startsWith("/cybercon/admin");
}

export default function AnnouncementBanner({ items }: { items: Announcement[] }) {
  const pathname = usePathname();
  const dismissed = useSyncExternalStore(subscribe, readDismissed, () => cachedIds);

  if (!items.length || isHiddenOnAdmin(pathname)) return null;

  const visible = items.filter((a) => !dismissed.includes(a.id)).slice(0, 3);
  if (!visible.length) return null;

  return (
    <div className="w-full">
      {visible.map((a, i) => {
        const body = (
          <div className="flex w-full items-center gap-3 px-4 sm:px-6 py-2.5">
            {a.image ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={a.image}
                alt=""
                className="h-9 w-9 shrink-0 rounded-md object-cover border border-white/30"
              />
            ) : (
              <span className="shrink-0 rounded-md bg-white/20 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                News
              </span>
            )}
            <div className="min-w-0 flex-1 text-white">
              <span className="font-bold">{a.title}</span>
              {a.content && <span className="ml-2 text-white/85">{a.content}</span>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(a.id)}
              aria-label={`Dismiss ${a.title}`}
              className="shrink-0 rounded p-1 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        );

        const classes = `flex w-full border-b ${
          i === 0 ? "border-[#0000ff]/30" : "border-white/10"
        } bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)]`;

        return a.link ? (
          <Link key={a.id} href={a.link} className={classes}>
            {body}
          </Link>
        ) : (
          <div key={a.id} className={classes}>
            {body}
          </div>
        );
      })}
    </div>
  );
}
