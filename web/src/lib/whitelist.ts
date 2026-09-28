import { db } from "@/lib/db";

/**
 * Empty whitelist = open. Non-empty = the username OR the email must match an
 * entry (case-insensitive).
 */
export async function isWhitelisted(username: string, email?: string | null) {
  const entries = await db.whitelistEntry.findMany({ select: { value: true } });
  if (entries.length === 0) return true;

  const allowed = new Set(entries.map((e) => e.value.trim().toLowerCase()));
  const u = username.trim().toLowerCase();
  const e = (email ?? "").trim().toLowerCase();

  return allowed.has(u) || (Boolean(e) && allowed.has(e));
}
