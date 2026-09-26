"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Section } from "@/content/sections";
import ImageField, { ImageThumb } from "@/components/admin/ImageField";

type Row = Record<string, string | number | boolean | undefined>;

function emptyRow(section: Section): Row {
  const row: Row = {};
  for (const f of section.fields) {
    row[f.key] = f.kind === "number" ? 0 : f.kind === "boolean" ? false : "";
  }
  return row;
}

function FieldInput({
  field,
  value,
  onChange,
}: {
  field: Section["fields"][number];
  value: string | number | boolean | undefined;
  onChange: (v: string | number | boolean) => void;
}) {
  const base =
    "w-full px-3 py-2 rounded-lg border border-black/15 bg-white text-black text-sm focus:outline-none focus:border-[#0000ff]";

  switch (field.kind) {
    case "textarea":
      return (
        <textarea
          rows={3}
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        />
      );
    case "boolean":
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
    case "number":
      return (
        <input
          type="number"
          value={value === "" || value === undefined ? "" : Number(value)}
          onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
          className={base}
        />
      );
    case "select":
      return (
        <select
          value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value)}
          className={base}
        >
          <option value="">—</option>
          {field.options?.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
      );
    case "image":
      return <ImageField value={String(value ?? "")} onChange={onChange} label={field.label} />;
    case "url":
    case "text":
    default:
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
}

export default function SectionEditor({
  section,
  initial,
  exists,
}: {
  section: Section;
  initial: Row[];
  exists: boolean;
}) {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>(initial);
  const [draft, setDraft] = useState<Row | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);

  function touch(next: Row[]) {
    setItems(next);
    setDirty(true);
    setMsg(null);
  }

  function startAdd() {
    setEditIndex(null);
    setDraft(emptyRow(section));
    setMsg(null);
  }

  function startEdit(i: number) {
    setEditIndex(i);
    setDraft({ ...items[i] });
    setMsg(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancel() {
    setDraft(null);
    setEditIndex(null);
  }

  function commitRow() {
    if (!draft) return;

    let row: Row = { ...draft };

    // Auto-generate the slug from the title when it was left blank.
    for (const f of section.fields) {
      if (f.key !== "slug") continue;
      if (!String(row.slug ?? "").trim()) {
        const title = String(row.title ?? "");
        const nextSlug = title
          .toLowerCase()
          .normalize("NFKD")
          .replace(/[^\w\s-]/g, "")
          .trim()
          .replace(/[\s_]+/g, "-")
          .replace(/-+/g, "-");
        if (nextSlug) row = { ...row, slug: nextSlug };
      }
    }

    for (const f of section.fields) {
      if (f.required && !String(row[f.key] ?? "").trim()) {
        setMsg({ kind: "err", text: `${f.label} is required.` });
        return;
      }
    }
    const next = [...items];
    if (editIndex === null) {
      // Newest item goes to the top so it is shown first on the site.
      if (section.prependNew) next.unshift(row);
      else next.push(row);
    } else {
      next[editIndex] = row;
    }
    touch(next);
    setDraft(null);
    setEditIndex(null);
  }

  function removeRow(i: number) {
    if (!confirm(`Delete "${String(items[i][section.columns[0]] ?? "row")}"?`)) return;
    touch(items.filter((_, idx) => idx !== i));
    if (editIndex === i) cancel();
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    touch(next);
    if (editIndex === i) setEditIndex(j);
    else if (editIndex === j) setEditIndex(i);
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/admin/content/${section.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: items }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setMsg({ kind: "err", text: body.error || `Save failed (${res.status})` });
        setSaving(false);
        return;
      }
      setDirty(false);
      setMsg({ kind: "ok", text: `Saved ${items.length} item(s).` });
      router.refresh();
    } catch {
      setMsg({ kind: "err", text: "Network error" });
    }
    setSaving(false);
  }

  async function reset() {
    if (!confirm("Delete this section from the database and fall back to built-in defaults?"))
      return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${section.id}`, { method: "DELETE" });
      if (res.ok) {
        setItems(initial);
        setDirty(false);
        setMsg({ kind: "ok", text: "Reset to built-in defaults." });
        router.refresh();
      } else {
        setMsg({ kind: "err", text: `Reset failed (${res.status})` });
      }
    } catch {
      setMsg({ kind: "err", text: "Network error" });
    }
    setSaving(false);
  }

  return (
    <div className="max-w-[1100px]">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div>
          <h1 className="text-2xl font-extrabold text-black">{section.label}</h1>
          <p className="text-sm text-[#525252] mt-1 max-w-2xl">{section.description}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`px-2 py-1 rounded-md text-xs font-bold ${
              exists ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
            }`}
          >
            {exists ? "saved in DB" : "using defaults"}
          </span>
        </div>
      </div>

      <div className="text-sm text-[#525252] mb-4">
        {items.length} item(s)
        {dirty && <span className="ml-2 font-bold text-amber-600">unsaved changes</span>}
      </div>

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

      <div className="flex flex-wrap gap-2 mb-5">
        <button
          onClick={startAdd}
          className="px-4 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] transition-colors"
        >
          + Add {section.itemLabel}
        </button>
        <button
          onClick={save}
          disabled={saving}
          className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
        {exists && (
          <button
            onClick={reset}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-white border border-black/15 text-black text-sm font-semibold hover:bg-black/5 transition-colors disabled:opacity-60"
          >
            Reset to defaults
          </button>
        )}
      </div>

      {draft && (
        <div className="mb-6 bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] border border-[#0000ff]/30">
          <div className="font-bold text-black mb-4">
            {editIndex === null ? `New ${section.itemLabel}` : `Edit ${section.itemLabel}`}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {section.fields.map((f) => (
              <div key={f.key} className={f.kind === "textarea" ? "sm:col-span-2" : ""}>
                <label className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1.5">
                  {f.label}
                  {f.required && <span className="text-red-500"> *</span>}
                </label>
                <FieldInput
                  field={f}
                  value={draft[f.key]}
                  onChange={(v) => setDraft({ ...draft, [f.key]: v })}
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-5">
            <button
              onClick={commitRow}
              className="px-4 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] transition-colors"
            >
              {editIndex === null ? "Add" : "Apply"}
            </button>
            <button
              onClick={cancel}
              className="px-4 py-2 rounded-lg bg-black/5 text-black text-sm font-semibold hover:bg-black/10 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-[0px_4px_16px_rgba(0,0,0,0.08)] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[linear-gradient(135deg,#1a1a2e_0%,#16213e_50%,#0f3460_100%)] text-white text-left">
              <th className="py-2.5 px-4 font-semibold w-[52px]">#</th>
              {section.columns.map((c) => (
                <th key={c} className="py-2.5 px-4 font-semibold">
                  {c}
                </th>
              ))}
              <th className="py-2.5 px-4 font-semibold text-right w-[190px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td
                  colSpan={section.columns.length + 2}
                  className="py-8 text-center text-[#525252]"
                >
                  No items yet.
                </td>
              </tr>
            )}
            {items.map((row, i) => (
              <tr key={i} className="border-b border-black/5 hover:bg-black/[0.02]">
                <td className="py-2.5 px-4 text-[#525252] tabular-nums">{i + 1}</td>
                {section.columns.map((c) => {
                  const isImg =
                    section.fields.some((f) => f.key === c && f.kind === "image") &&
                    Boolean(String(row[c] ?? "").trim());
                  return (
                    <td key={c} className="py-2.5 px-4 text-black max-w-[280px] truncate">
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
                    <button
                      onClick={() => move(i, -1)}
                      title="Move up"
                      className="px-2 py-1 rounded border border-black/10 text-black/60 hover:bg-black/5"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => move(i, 1)}
                      title="Move down"
                      className="px-2 py-1 rounded border border-black/10 text-black/60 hover:bg-black/5"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => startEdit(i)}
                      className="px-2.5 py-1 rounded bg-[#0000ff]/10 text-[#0000ff] font-semibold hover:bg-[#0000ff]/20"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeRow(i)}
                      className="px-2.5 py-1 rounded bg-red-50 text-red-600 font-semibold hover:bg-red-100"
                    >
                      Delete
                    </button>
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
