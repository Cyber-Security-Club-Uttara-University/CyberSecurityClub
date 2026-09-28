"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Field } from "@/content/sections";
import ImageField, { ImageThumb } from "@/components/admin/ImageField";
import DateInput from "@/components/admin/DateInput";
import PdfViewer from "@/components/admin/PdfViewer";

type Row = Record<string, unknown> & { id?: number };

type Config = {
  table: string;
  label: string;
  description: string;
  fields: Field[];
  columns: string[];
  readOnly?: boolean;
  viewable?: boolean;
};

type ExtraAnswer = { key?: string; label?: string; type?: string; value?: string };

function emptyRow(fields: Field[]): Row {
  const r: Row = {};
  for (const f of fields) r[f.key] = f.kind === "number" ? 0 : f.kind === "boolean" ? false : "";
  return r;
}

function formatDate(value: unknown) {
  const date = value instanceof Date ? value : new Date(String(value));
  return Number.isNaN(date.getTime()) ? String(value ?? "") : date.toLocaleString();
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
  if (field.kind === "date")
    return <DateInput value={String(value ?? "")} onChange={onChange} placeholder={field.placeholder} />;
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
  const [detail, setDetail] = useState<Row | null>(null);
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
                  const isFile =
                    config.fields.some((f) => f.key === c && f.kind === "file") &&
                    Boolean(String(row[c] ?? "").trim());
                  return (
                    <td key={c} className="py-2.5 px-4 text-black max-w-[260px] truncate">
                      {isFile ? (
                        <button
                          onClick={() => setDetail(row)}
                          className="px-2.5 py-1 rounded bg-[#0000ff]/10 text-[#0000ff] font-semibold hover:bg-[#0000ff]/20"
                        >
                          View PDF
                        </button>
                      ) : isImg ? (
                        <span className="flex items-center gap-2">
                          <ImageThumb src={String(row[c])} />
                          <span className="truncate">{String(row[c])}</span>
                        </span>
                      ) : typeof row[c] === "boolean" ? (
                        row[c] ? "yes" : "no"
                      ) : c === "createdAt" ? (
                        formatDate(row[c])
                      ) : (
                        String(row[c] ?? "")
                      )}
                    </td>
                  );
                })}
                <td className="py-2.5 px-4">
                  <div className="flex items-center justify-end gap-1.5">
                    {config.viewable && (
                      <button
                        onClick={() => setDetail(row)}
                        className="px-2.5 py-1 rounded bg-black/5 text-black font-semibold hover:bg-black/10"
                      >
                        View
                      </button>
                    )}
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

      {detail && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 p-4 sm:p-8"
          onClick={() => setDetail(null)}
        >
          <div
            className="mx-auto w-full max-w-3xl rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h2 className="text-lg font-extrabold text-black">{config.label} # {String(detail.id ?? "")}</h2>
                {detail.ticketId ? (
                  <p className="text-xs text-[#525252] mt-0.5">
                    Application ID: <span className="font-bold text-black">{String(detail.ticketId)}</span>
                    {detail.createdAt ? <> · {formatDate(detail.createdAt)}</> : null}
                  </p>
                ) : null}
              </div>
              <button
                onClick={() => setDetail(null)}
                className="px-3 py-1.5 rounded-lg bg-black/5 text-black text-sm font-semibold hover:bg-black/10"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
              {config.fields.map((f) => (
                <div key={f.key} className={f.kind === "file" || f.kind === "textarea" ? "sm:col-span-2" : ""}>
                  <div className="text-[11px] font-bold uppercase tracking-wide text-[#525252] mb-1">
                    {f.label}
                  </div>
                  <DetailValue field={f} value={detail[f.key]} />
                </div>
              ))}
              {Array.isArray(detail.extra) && (detail.extra as ExtraAnswer[]).length > 0 && (
                <div className="sm:col-span-2">
                  <div className="text-[11px] font-bold uppercase tracking-wide text-[#525252] mb-1">
                    Additional answers
                  </div>
                  <div className="space-y-3 rounded-lg bg-black/[0.03] p-3">
                    {(detail.extra as ExtraAnswer[]).map((a, i) => (
                      <div key={a.key ?? i}>
                        <div className="text-xs font-bold text-black">{a.label || a.key}</div>
                        {a.type === "link" && a.value ? (
                          <a
                            href={a.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#0000ff] hover:underline break-all"
                          >
                            {a.value}
                          </a>
                        ) : (
                          <p className="text-sm text-black whitespace-pre-wrap">{a.value}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailValue({ field, value }: { field: Field; value: unknown }) {
  const text = String(value ?? "").trim();
  if (field.kind === "file") {
    if (!text) return <span className="text-sm text-[#525252]">Not uploaded</span>;
    return <PdfViewer src={text} title={field.label} />;
  }
  if (!text) return <span className="text-sm text-[#525252]">—</span>;
  if (field.kind === "url")
    return (
      <a
        href={text}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-[#0000ff] hover:underline break-all"
      >
        {text}
      </a>
    );
  if (field.kind === "textarea")
    return <p className="text-sm text-black whitespace-pre-wrap">{text}</p>;
  if (field.key === "createdAt") return <span className="text-sm text-black">{formatDate(value)}</span>;
  return <span className="text-sm text-black break-words">{text}</span>;
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
