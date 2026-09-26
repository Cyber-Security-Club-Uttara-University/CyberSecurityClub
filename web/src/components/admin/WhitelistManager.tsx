"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Entry = { id: number; type: string; value: string; createdAt: string | Date };

export default function WhitelistManager({ initial }: { initial: Entry[] }) {
  const router = useRouter();
  const [entries, setEntries] = useState<Entry[]>(initial);
  const [type, setType] = useState<"email" | "username">("email");
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function add() {
    if (!value.trim()) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, value: value.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error || `Failed (${res.status})` });
      } else {
        setEntries((list) => [...list, data.entry]);
        setValue("");
        setMsg({ kind: "ok", text: "Added to whitelist." });
        router.refresh();
      }
    } catch {
      setMsg({ kind: "err", text: "Network error." });
    }
    setBusy(false);
  }

  async function remove(entry: Entry) {
    setMsg(null);
    try {
      const res = await fetch("/api/admin/whitelist", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg({ kind: "err", text: data.error || `Failed (${res.status})` });
      } else {
        setEntries((list) => list.filter((e) => e.id !== entry.id));
        setMsg({ kind: "ok", text: "Removed." });
        router.refresh();
      }
    } catch {
      setMsg({ kind: "err", text: "Network error." });
    }
  }

  return (
    <div className="max-w-[820px]">
      <h1 className="text-2xl font-extrabold text-black mb-1">Whitelist</h1>
      <p className="text-sm text-[#525252] mb-5">
        When this list has entries, <strong>only</strong> matching usernames or emails can sign
        in — and new accounts must match an entry. Leave it empty to allow every account.
      </p>

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

      <div className="bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] mb-6">
        <div className="flex flex-wrap gap-2 items-end">
          <label className="block">
            <span className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1">
              Type
            </span>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "email" | "username")}
              className="px-3 py-2 rounded-lg border border-black/15 bg-white text-black text-sm focus:outline-none focus:border-[#0000ff]"
            >
              <option value="email">Email</option>
              <option value="username">Username</option>
            </select>
          </label>
          <label className="block flex-1 min-w-[220px]">
            <span className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1">
              Value
            </span>
            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={type === "email" ? "secretary@uu.edu.bd" : "office.secretary"}
              className="w-full px-3 py-2 rounded-lg border border-black/15 text-black text-sm focus:outline-none focus:border-[#0000ff]"
            />
          </label>
          <button
            onClick={add}
            disabled={busy || !value.trim()}
            className="px-4 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] disabled:opacity-60"
          >
            {busy ? "Adding…" : "Add"}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.08)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-[#525252] text-xs uppercase tracking-wide">
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Value</th>
              <th className="py-3 px-4">Added</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full bg-[#0000ff]/10 text-[#0000ff] text-[11px] font-bold uppercase">
                    {e.type}
                  </span>
                </td>
                <td className="py-3 px-4 text-black">{e.value}</td>
                <td className="py-3 px-4 text-[#525252]">
                  {new Date(e.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => remove(e)}
                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-[#525252]">
                  Empty — every account can sign in.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
