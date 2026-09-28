import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { canViewLogs } from "@/lib/roles";
import LogsView from "@/components/admin/LogsView";

export const dynamic = "force-dynamic";

export type LogRow = {
  id: number;
  username: string;
  action: string;
  detail: string | null;
  ip: string | null;
  createdAt: string;
};

const CHANGE_ACTIONS = new Set([
  "content-save",
  "content-reset",
  "record-create",
  "record-update",
  "record-delete",
  "user-create",
  "user-update",
  "user-delete",
  "whitelist-add",
  "whitelist-remove",
  "settings-save",
]);

export default async function LogsAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!canViewLogs(user.role)) redirect("/admin");

  const [logs, users] = await Promise.all([
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
    db.admin.findMany({
      select: { id: true, username: true, name: true, role: true, avatar: true },
      orderBy: { username: "asc" },
    }),
  ]);

  const lastChangeByUser: Record<
    string,
    { action: string; detail: string | null; ip: string | null; createdAt: string } | null
  > = {};

  for (const log of logs) {
    if (!CHANGE_ACTIONS.has(log.action)) continue;
    if (lastChangeByUser[log.username]) continue;
    lastChangeByUser[log.username] = {
      action: log.action,
      detail: log.detail,
      ip: log.ip,
      createdAt: log.createdAt.toISOString(),
    };
  }

  const rows: LogRow[] = logs.map((l) => ({
    id: l.id,
    username: l.username,
    action: l.action,
    detail: l.detail,
    ip: l.ip,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <LogsView
      logs={rows}
      users={users.map((u) => ({
        ...u,
        createdAt: "",
      }))}
      lastChangeByUser={lastChangeByUser}
      knownUsernames={users.map((u) => u.username)}
    />
  );
}
