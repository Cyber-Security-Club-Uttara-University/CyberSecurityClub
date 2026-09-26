"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ROLES, type Role } from "@/lib/roles";
import ImageField from "@/components/admin/ImageField";

export type ManagedUser = {
  id: number;
  username: string;
  email: string | null;
  name: string | null;
  role: Role;
  avatar: string | null;
  createdAt: string | Date;
};

type Draft = {
  id?: number;
  username: string;
  email: string;
  name: string;
  role: Role;
  avatar: string;
  password: string;
};

const EMPTY: Draft = {
  username: "",
  email: "",
  name: "",
  role: "Office Secretary",
  avatar: "",
  password: "",
};

function initials(user: ManagedUser) {
  const source = (user.name || user.username).trim();
  const parts = source.split(/\s+/).filter(Boolean);
  return (parts.length > 1 ? parts[0][0] + parts[1][0] : source.slice(0, 2)).toUpperCase();
}

const ROLE_COLORS: Record<string, string> = {
  President: "bg-amber-100 text-amber-800",
  "Vice President": "bg-indigo-100 text-indigo-800",
  "General Secretary": "bg-sky-100 text-sky-800",
  "Organizing Secretary": "bg-emerald-100 text-emerald-800",
  "Office Secretary": "bg-neutral-100 text-neutral-700",
};

export default function UsersManager({
  initial,
  currentId,
}: {
  initial: ManagedUser[];
  currentId: number;
}) {
  const router = useRouter();
  const [users, setUsers] = useState<ManagedUser[]>(initial);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
  }

  async function save() {
    if (!draft) return;
    if (!draft.username.trim()) {
      setMsg({ kind: "err", text: "Username is required." });
      return;
    }
    if (!draft.id && draft.password.length < 6) {
      setMsg({ kind: "err", text: "Password must be at least 6 characters." });
      return;
    }

    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: draft.id ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error || `Failed (${res.status})` });
      } else {
        const saved: ManagedUser = data.user;
        setUsers((list) => {
          if (draft.id) return list.map((u) => (u.id === saved.id ? saved : u));
          return [...list, saved];
        });
        setMsg({
          kind: "ok",
          text: draft.id
            ? `Updated ${saved.username}${data.changes?.length ? ` (${data.changes.join(", ")})` : ""}.`
            : `Added ${saved.username} as ${saved.role}.`,
        });
        setDraft(null);
        router.refresh();
      }
    } catch {
      setMsg({ kind: "err", text: "Network error." });
    }
    setSaving(false);
  }

  async function remove(user: ManagedUser) {
    if (!confirm(`Remove "${user.username}"? This cannot be undone.`)) return;
    setMsg(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error || `Failed (${res.status})` });
      } else {
        setUsers((list) => list.filter((u) => u.id !== user.id));
        setMsg({ kind: "ok", text: `Removed ${user.username}.` });
        router.refresh();
      }
    } catch {
      setMsg({ kind: "err", text: "Network error." });
    }
  }

  return (
    <div className="max-w-[1100px]">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-black mb-1">Users</h1>
          <p className="text-sm text-[#525252]">
            Only the President can add, edit or remove accounts. Everyone else can only sign in.
          </p>
        </div>
        <button
          onClick={() => {
            setDraft({ ...EMPTY });
            setMsg(null);
          }}
          className="px-4 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] transition-colors"
        >
          + Add user
        </button>
      </div>

      {msg && (
        <div
          className={`mb-4 px-4 py-3 rounded-xl text-sm border ${
            msg.kind === "ok"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      {draft && (
        <div className="mb-6 bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
          <h2 className="font-bold text-black mb-4">{draft.id ? "Edit user" : "Add user"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="block text-sm font-semibold text-black mb-1.5">Name</span>
              <input
                value={draft.name}
                onChange={(e) => set("name", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/15 text-black text-sm focus:outline-none focus:border-[#0000ff]"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-black mb-1.5">Role</span>
              <select
                value={draft.role}
                onChange={(e) => set("role", e.target.value as Role)}
                className="w-full px-3 py-2 rounded-lg border border-black/15 text-black text-sm bg-white focus:outline-none focus:border-[#0000ff]"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-black mb-1.5">Username</span>
              <input
                value={draft.username}
                onChange={(e) => set("username", e.target.value)}
                autoComplete="off"
                className="w-full px-3 py-2 rounded-lg border border-black/15 text-black text-sm focus:outline-none focus:border-[#0000ff]"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-black mb-1.5">Email</span>
              <input
                type="email"
                value={draft.email}
                onChange={(e) => set("email", e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-black/15 text-black text-sm focus:outline-none focus:border-[#0000ff]"
              />
            </label>
            <label className="block">
              <span className="block text-sm font-semibold text-black mb-1.5">
                Password {draft.id && "(leave blank to keep current)"}
              </span>
              <input
                type="password"
                value={draft.password}
                onChange={(e) => set("password", e.target.value)}
                autoComplete="new-password"
                className="w-full px-3 py-2 rounded-lg border border-black/15 text-black text-sm focus:outline-none focus:border-[#0000ff]"
              />
            </label>
            <div className="sm:col-span-2">
              <ImageField
                value={draft.avatar}
                onChange={(v) => set("avatar", v)}
                label="Profile photo"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-5">
            <button
              onClick={save}
              disabled={saving}
              className="px-5 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] disabled:opacity-60"
            >
              {saving ? "Saving…" : draft.id ? "Save changes" : "Create user"}
            </button>
            <button
              onClick={() => setDraft(null)}
              className="px-5 py-2 rounded-lg bg-black/5 text-black text-sm font-semibold hover:bg-black/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.08)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-[#525252] text-xs uppercase tracking-wide">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Username</th>
              <th className="py-3 px-4">Email</th>
              <th className="py-3 px-4">Role</th>
              <th className="py-3 px-4">Added</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                <td className="py-3 px-4">
                  <span className="flex items-center gap-3">
                    <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-[#0000ff]/10 border border-black/10 flex items-center justify-center">
                      {u.avatar ? (
                        <Image
                          src={u.avatar}
                          alt=""
                          fill
                          sizes="36px"
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-[11px] font-extrabold text-[#0000ff]">
                          {initials(u)}
                        </span>
                      )}
                    </span>
                    <span className="font-semibold text-black">
                      {u.name || u.username}
                      {u.id === currentId && (
                        <span className="ml-2 text-[11px] text-[#525252]">(you)</span>
                      )}
                    </span>
                  </span>
                </td>
                <td className="py-3 px-4 text-black">{u.username}</td>
                <td className="py-3 px-4 text-[#525252]">{u.email || "—"}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-[11px] font-bold ${
                      ROLE_COLORS[u.role] ?? "bg-neutral-100 text-neutral-700"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-[#525252]">
                  {new Date(u.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3 px-4">
                  <span className="flex justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setDraft({
                          id: u.id,
                          username: u.username,
                          email: u.email ?? "",
                          name: u.name ?? "",
                          role: u.role,
                          avatar: u.avatar ?? "",
                          password: "",
                        });
                        setMsg(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#0000ff]/10 text-[#0000ff] text-xs font-semibold hover:bg-[#0000ff]/20"
                    >
                      Edit
                    </button>
                    {u.id !== currentId && (
                      <button
                        onClick={() => remove(u)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                      >
                        Remove
                      </button>
                    )}
                  </span>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-[#525252]">
                  No accounts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
