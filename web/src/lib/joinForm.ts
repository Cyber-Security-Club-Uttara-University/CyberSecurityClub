import { cache } from "react";
import { connection } from "next/server";
import { db } from "@/lib/db";
import {
  DEFAULT_JOIN_FORM,
  JOIN_FORM_KEY,
  normalizeJoinFormConfig,
  type JoinFormConfig,
} from "@/content/joinForm";

/**
 * Stored Join Us form config (preferred roles + admin-defined fields), or the
 * built-in defaults. Mirrors `getSettings` in `lib/content.ts`.
 */
export const getJoinFormConfig = cache(async (): Promise<JoinFormConfig> => {
  await connection();
  try {
    const block = await db.contentBlock.findUnique({ where: { key: JOIN_FORM_KEY } });
    if (block && block.data && typeof block.data === "object") {
      return normalizeJoinFormConfig(block.data);
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_JOIN_FORM;
});
