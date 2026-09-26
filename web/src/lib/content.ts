import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/lib/db";
import { DEFAULTS, SETTINGS_DEFAULTS } from "@/content/defaults";

export type Row = Record<string, unknown>;

/**
 * Returns the stored JSON array for a section, or the built-in defaults.
 * `connection()` opts the calling page out of static prerendering so that
 * every admin edit is reflected on the very next request.
 */
export const getSectionData = cache(async (key: string): Promise<Row[]> => {
  await connection();
  const fallback = (DEFAULTS[key] ?? []) as Row[];
  try {
    const block = await db.contentBlock.findUnique({ where: { key } });
    if (block && Array.isArray(block.data)) {
      const rows = block.data as Row[];
      if (rows.length > 0) return rows;
    }
  } catch {
    // fall through to defaults
  }
  return fallback;
});

export const getSettings = cache(async (): Promise<Record<string, string>> => {
  await connection();
  try {
    const block = await db.contentBlock.findUnique({ where: { key: "site-settings" } });
    if (block && block.data && typeof block.data === "object") {
      return { ...SETTINGS_DEFAULTS, ...(block.data as Record<string, string>) };
    }
  } catch {
    // fall through to defaults
  }
  return SETTINGS_DEFAULTS;
});

/** Published announcements, newest first. */
export type Announcement = {
  id: number;
  title: string;
  content: string;
  image?: string | null;
  link?: string | null;
  published?: boolean;
};

export const getAnnouncements = cache(async (): Promise<Announcement[]> => {
  await connection();
  try {
    const rows = await db.announcement.findMany({
      orderBy: { id: "desc" },
      take: 5,
    });
    return rows.filter((a) => a.published !== false);
  } catch {
    return [];
  }
});
