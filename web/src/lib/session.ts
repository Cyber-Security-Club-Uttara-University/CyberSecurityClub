import type { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromCookie } from "@/lib/auth";
import { normalizeRole, type Role } from "@/lib/roles";

export type CurrentUser = {
  id: number;
  username: string;
  email: string | null;
  name: string | null;
  role: Role;
  avatar: string | null;
  createdAt: Date;
};

/**
 * Reads the signed session cookie and reloads the account from the database so
 * role changes take effect immediately, without forcing a re-login.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const session = await getAdminFromCookie();
  if (!session) return null;

  const account = await db.admin.findUnique({ where: { username: session.username } });
  if (!account) return null;

  return {
    id: account.id,
    username: account.username,
    email: account.email,
    name: account.name,
    role: normalizeRole(account.role),
    avatar: account.avatar,
    createdAt: account.createdAt,
  };
}

/** Best-effort client IP for the audit log. */
export function clientIp(request?: NextRequest): string | null {
  if (!request) return null;
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real.trim();
  // Next populates `ip` when the platform supplies it (e.g. behind a proxy).
  const ip = (request as { ip?: string }).ip;
  if (ip) return ip;
  return null;
}
