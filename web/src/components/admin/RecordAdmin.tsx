"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Field } from "@/content/sections";
import ImageField, { ImageThumb } from "@/components/admin/ImageField";

type Row = Record<string, unknown> & { id?: number };

type Config = {
  table: string;
  label: string;
  description: string;
  fields: Field[];
  columns: string[];
  readOnly?: boolean;
};

function emptyRow(fields: Field[]): Row {
  const r: Row = {};
  for (const f of fields) r[f.key] = f.kind === "number" ? 0 : f.kind === "boolean" ? false : "";
  return r;
}

function Input({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: string | number | boolean) => void;
}) {
  const base =
    "w-full px-3 py-2 rounded-lg border border-black/15 bg-white text-black text-sm focus:outline-none focus:border-[#0000ff]";

  if (field.kind === "textarea")
    return (
      <textarea
        rows={4}
        value={String(value ?? "")}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={base}
      />
    );
  if (field.kind === "boolean")
    return (
      <label className="flex items-center gap-2 text-sm text-black">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 accent-[#0000ff]"
        />
        {field.label}
      </label>
    );
  if (field.kind === "number")
    return (
      <input
        type="number"
        value={value === "" || value === undefined ? 0 : Number(value)}
        onChange={(e) => onChange(Number(e.target.value))}
        className={base}
      />
    );
  if (field.kind === "select")
    return (
      <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={base}>
        <option value="">—</option>
        {field.options?.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  if (field.kind === "image")
    return <ImageField value={String(value ?? "")} onChange={onChange} label={field.label} />;
  return (
    <input
      type="text"
      value={String(value ?? "")}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={base}
    />
  );
}

export default function RecordAdmin({ config, initial }: { config: Config; initial: Row[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>(initial);
  const [draft, setDraft] = useState<Row | null>(null);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function req(method: string, body?: unknown) {
    const res = await fetch(`/api/admin/records/${config.table}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    return res;
  }

  async function saveDraft() {
    if (!draft) return;
    for (const f of config.fields) {
      if (f.required && !String(draft[f.key] ?? "").trim()) {
        setMsg({ kind: "err", text: `${f.label} is required.` });
        return;
      }
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await req(draft.id ? "PUT" : "POST", draft);
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        setMsg({ kind: "err", text: b.error || `Failed (${res.status})` });
      } else {
        setMsg({ kind: "ok", text: "Saved." });
        setDraft(null);
        router.refresh();
        const list = await fetch(`/api/admin/records/${config.table}`).then((r) => r.json());
        if (Array.isArray(list.rows)) setRows(list.rows);
      }
    } catch {
      setMsg({ kind: "err", text: "Network error" });
    }
    setBusy(false);
  }

  async function remove(id: number) {
    if (!confirm("Delete this record?")) return;
    setBusy(true);
    const res = await req("DELETE", { id });
    if (res.ok) setRows(rows.filter((r) => r.id !== id));
    else setMsg({ kind: "err", text: `Delete failed (${res.status})` });
    setBusy(false);
  }

  async function patch(id: number, data: Row) {
    const res = await req("PUT", { id, ...data });
    if (res.ok) {
      const list = await fetch(`/api/admin/records/${config.table}`).then((r) => r.json());
      if (Array.isArray(list.rows)) setRows(list.rows);
      setMsg({ kind: "ok", text: "Updated." });
    } else {
      setMsg({ kind: "err", text: `Update failed (${res.status})` });
    }
  }

  return (
    <div className="max-w-[1100px]">
      <h1 className="text-2xl font-extrabold text-black mb-1">{config.label}</h1>
      <p className="text-sm text-[#525252] mb-4 max-w-2xl">{config.description}</p>
      <div className="text-sm text-[#525252] mb-4">{rows.length} record(s)</div>

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

      {!config.readOnly && (
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setDraft(emptyRow(config.fields))}
            className="px-4 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] transition-colors"
          >
            + New {config.label.replace(/s$/, "")}
          </button>
        </div>
      )}

      {draft && (
        <div className="mb-6 bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] border border-[#0000ff]/30">
          <div className="font-bold text-black mb-4">{draft.id ? "Edit" : "New"} record</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {config.fields.map((f) => (
              <div key={f.key} className={f.kind === "textarea" ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1.5">
                  {f.label}
                  {f.required && <span className="text-red-500"> *</span>}
                </label>
                <Input
                  field={f}
                  value={draft[f.key]}
                  onChange={(v) => setDraft({ ...draft, [f.key]: v })}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-5">
            <button
              onClick={saveDraft}
              disabled={busy}
              className="px-4 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] disabled:opacity-60"
            >
              Save
            </button>
            <button
              onClick={() => setDraft(null)}
              className="px-4 py-2 rounded-lg bg-black/5 text-black text-sm font-semibold hover:bg-black/10"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.08)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)] text-white text-left">
              <th className="py-2.5 px-4 font-semibold w-[52px]">ID</th>
              {config.columns.map((c) => (
                <th key={c} className="py-2.5 px-4 font-semibold">
                  {c}
                </th>
              ))}
              <th className="py-2.5 px-4 font-semibold text-right w-[170px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={config.columns.length + 2} className="py-8 text-center text-[#525252]">
                  No records yet.
                </td>
              </tr>
            )}
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-black/5 hover:bg-black/[0.02]">
                <td className="py-2.5 px-4 text-[#525252] tabular-nums">{row.id}</td>
                {config.columns.map((c) => {
                  const isImg =
                    config.fields.some((f) => f.key === c && f.kind === "image") &&
                    Boolean(String(row[c] ?? "").trim());
                  return (
                    <td key={c} className="py-2.5 px-4 text-black max-w-[260px] truncate">
                      {isImg ? (
                        <span className="flex items-center gap-2">
                          <ImageThumb src={String(row[c])} />
                          <span className="truncate">{String(row[c])}</span>
                        </span>
                      ) : typeof row[c] === "boolean" ? (
                        row[c] ? "yes" : "no"
                      ) : (
                        String(row[c] ?? "")
                      )}
                    </td>
                  );
                })}
                <td className="py-2.5 px-4">
                  <div className="flex items-center justify-end gap-1.5">
                    {c_toggle(config, row, patch)}
                    {!config.readOnly && (
                      <>
                        <button
                          onClick={() => setDraft({ ...row })}
                          className="px-2.5 py-1 rounded bg-[#0000ff]/10 text-[#0000ff] font-semibold hover:bg-[#0000ff]/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(Number(row.id))}
                          disabled={busy}
                          className="px-2.5 py-1 rounded bg-red-50 text-red-600 font-semibold hover:bg-red-100 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function c_toggle(
  config: Config,
  row: Row,
  patch: (id: number, data: Row) => void
) {
  if (config.table === "contacts" && row.read === false) {
    return (
      <button
        onClick={() => patch(Number(row.id), { read: true } as Row)}
        className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 font-semibold hover:bg-amber-100"
      >
        Mark read
      </button>
    );
  }
  if (config.table === "contacts") {
    return (
      <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold text-xs">
        read
      </span>
    );
  }
  return null;
}
