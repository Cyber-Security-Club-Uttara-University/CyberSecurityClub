"use client";

import { useMemo, useState } from "react";
import type { LogRow } from "@/app/admin/(panel)/logs/page";

type UserRow = { id: number; username: string; name: string | null; role: string; avatar: string | null };

type LastChange = {
  action: string;
  detail: string | null;
  ip: string | null;
  createdAt: string;
};

const ACTION_LABELS: Record<string, string> = {
  login: "Signed in",
  logout: "Signed out",
  "login-failed": "Failed sign-in",
  "login-blocked": "Blocked (not whitelisted)",
  "content-save": "Saved section",
  "content-reset": "Reset section",
  "record-create": "Created record",
  "record-update": "Updated record",
  "record-delete": "Deleted record",
  "user-create": "Added user",
  "user-update": "Updated user",
  "user-delete": "Removed user",
  "whitelist-add": "Whitelist add",
  "whitelist-remove": "Whitelist remove",
  "settings-save": "Saved settings",
};

function fmt(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function badge(action: string) {
  if (action.includes("failed") || action.includes("blocked"))
    return "bg-red-100 text-red-700";
  if (action.includes("delete") || action.includes("remove") || action.includes("reset"))
    return "bg-amber-100 text-amber-800";
  if (action === "login") return "bg-emerald-100 text-emerald-800";
  return "bg-[#0000ff]/10 text-[#0000ff]";
}

export default function LogsView({
  logs,
  users,
  lastChangeByUser,
  knownUsernames,
}: {
  logs: LogRow[];
  users: UserRow[];
  lastChangeByUser: Record<string, LastChange | null>;
  knownUsernames: string[];
}) {
  const [query, setQuery] = useState("");
  const [userFilter, setUserFilter] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return logs.filter((l) => {
      if (userFilter && l.username !== userFilter) return false;
      if (!q) return true;
      return (
        l.username.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        (l.detail ?? "").toLowerCase().includes(q) ||
        (l.ip ?? "").toLowerCase().includes(q)
      );
    });
  }, [logs, query, userFilter]);

  const names = (u: string) => {
    const found = users.find((x) => x.username === u);
    return found?.name || u;
  };

  const usernames = Array.from(new Set([...knownUsernames, ...logs.map((l) => l.username)]));

  return (
    <div className="max-w-[1100px]">
      <h1 className="text-2xl font-extrabold text-black mb-1">Access Logs</h1>
      <p className="text-sm text-[#525252] mb-6">
        Sign-ins, changes and the acting IP address — newest first.
      </p>

      {/* Last change per user */}
      <div className="bg-white rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.08)] overflow-x-auto mb-6">
        <div className="px-5 py-4 border-b border-black/10">
          <h2 className="font-bold text-black">Last change by user</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-[#525252] text-xs uppercase tracking-wide">
              <th className="py-3 px-5">User</th>
              <th className="py-3 px-5">Role</th>
              <th className="py-3 px-5">Last change</th>
              <th className="py-3 px-5">When</th>
              <th className="py-3 px-5">IP</th>
            </tr>
          </thead>
          <tbody>
            {usernames.map((u) => {
              const change = lastChangeByUser[u] ?? null;
              const profile = users.find((x) => x.username === u);
              return (
                <tr key={u} className="border-b border-black/5">
                  <td className="py-3 px-5 font-semibold text-black">{names(u)}</td>
                  <td className="py-3 px-5 text-[#525252]">{profile?.role ?? "—"}</td>
                  <td className="py-3 px-5 text-black">
                    {change ? (
                      <>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${badge(change.action)}`}>
                          {ACTION_LABELS[change.action] ?? change.action}
                        </span>
                        {change.detail ? (
                          <span className="ml-2 text-[#525252]">{change.detail}</span>
                        ) : null}
                      </>
                    ) : (
                      <span className="text-[#525252]">No changes yet</span>
                    )}
                  </td>
                  <td className="py-3 px-5 text-[#525252]">
                    {change ? fmt(change.createdAt) : "—"}
                  </td>
                  <td className="py-3 px-5 text-[#525252] tabular-nums">{change?.ip ?? "—"}</td>
                </tr>
              );
            })}
            {usernames.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#525252]">
                  No accounts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Full log */}
      <div className="bg-white rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.08)] overflow-hidden">
        <div className="px-5 py-4 border-b border-black/10 flex flex-wrap gap-3 items-center justify-between">
          <h2 className="font-bold text-black">Activity ({filtered.length})</h2>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search user, action, IP…"
              className="px-3 py-1.5 rounded-lg border border-black/15 text-sm text-black focus:outline-none focus:border-[#0000ff] w-[220px]"
            />
            <select
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-black/15 bg-white text-sm text-black focus:outline-none focus:border-[#0000ff]"
            >
              <option value="">All users</option>
              {usernames.map((u) => (
                <option key={u} value={u}>
                  {names(u)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto max-h-[560px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-black/10 text-left text-[#525252] text-xs uppercase tracking-wide">
                <th className="py-3 px-5">User</th>
                <th className="py-3 px-5">Action</th>
                <th className="py-3 px-5">Detail</th>
                <th className="py-3 px-5">IP</th>
                <th className="py-3 px-5">Time</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((l) => (
                <tr key={l.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                  <td className="py-3 px-5 font-semibold text-black whitespace-nowrap">
                    {names(l.username)}
                  </td>
                  <td className="py-3 px-5 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${badge(l.action)}`}>
                      {ACTION_LABELS[l.action] ?? l.action}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-[#525252]">{l.detail || "—"}</td>
                  <td className="py-3 px-5 text-[#525252] tabular-nums whitespace-nowrap">
                    {l.ip || "—"}
                  </td>
                  <td className="py-3 px-5 text-[#525252] whitespace-nowrap">{fmt(l.createdAt)}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#525252]">
                    Nothing matches.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
