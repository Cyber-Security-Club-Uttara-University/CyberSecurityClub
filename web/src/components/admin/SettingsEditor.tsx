"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Settings = Record<string, string>;

const FIELDS: { key: string; label: string; kind: "text" | "textarea" }[] = [
  { key: "tagline", label: "Homepage tagline", kind: "text" },
  { key: "aboutText", label: "About page description", kind: "textarea" },
  { key: "sponsorEmail", label: "Sponsor contact email", kind: "text" },
  { key: "contactEmail", label: "General contact email", kind: "text" },
  { key: "ctfPortalUrl", label: "CTF portal / scoreboard URL", kind: "text" },
];

export default function SettingsEditor({
  initial,
  exists,
}: {
  initial: Settings;
  exists: boolean;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Settings>(initial);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  async function save() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/content/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: values }),
      });
      if (!res.ok) setMsg({ kind: "err", text: `Save failed (${res.status})` });
      else {
        setMsg({ kind: "ok", text: "Settings saved." });
        router.refresh();
      }
    } catch {
      setMsg({ kind: "err", text: "Network error" });
    }
    setBusy(false);
  }

  return (
    <div className="max-w-[760px]">
      <h1 className="text-2xl font-extrabold text-black mb-1">Settings</h1>
      <p className="text-sm text-[#525252] mb-5">
        Copy used in more than one place on the public site.
        <span className="ml-2 px-2 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-500">
          {exists ? "saved in DB" : "using defaults"}
        </span>
      </p>

      {msg && (
        <div
          className={`mb-4 px-4 py-2.5 rounded-lg text-sm border ${
            msg.kind === "ok"
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-red-50 border-red-300 text-red-700"
          }`}
        >
          {msg.text}
        </div>
      )}

      <div className="bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key}>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1.5">
              {f.label}
            </label>
            {f.kind === "textarea" ? (
              <textarea
                rows={6}
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-black/15 bg-white text-black text-sm focus:outline-none focus:border-[#0000ff]"
              />
            ) : (
              <input
                type="text"
                value={values[f.key] ?? ""}
                onChange={(e) => setValues({ ...values, [f.key]: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-black/15 bg-white text-black text-sm focus:outline-none focus:border-[#0000ff]"
              />
            )}
          </div>
        ))}
        <button
          onClick={save}
          disabled={busy}
          className="px-4 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] disabled:opacity-60"
        >
          {busy ? "Saving..." : "Save settings"}
        </button>
      </div>
    </div>
  );
}
