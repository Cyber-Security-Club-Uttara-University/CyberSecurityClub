import { db } from "@/lib/db";

export type AuditInput = {
  username: string;
  action: string;
  detail?: string;
  ip?: string | null;
};

/** Writes an audit entry. Never throws — logging must not break a request. */
export async function logAudit(entry: AuditInput) {
  try {
    await db.auditLog.create({
      data: {
        username: entry.username,
        action: entry.action,
        detail: entry.detail ?? null,
        ip: entry.ip ?? null,
      },
    });
  } catch {
    // ignore — audit failures must not block the actual operation
  }
}
