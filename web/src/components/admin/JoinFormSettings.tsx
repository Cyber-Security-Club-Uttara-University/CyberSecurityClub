"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_JOIN_FORM,
  JOIN_FIELD_TYPES,
  JOIN_FIELD_TYPE_LABELS,
  type JoinFieldType,
} from "@/content/joinForm";

type FieldDraft = { id: string; label: string; type: JoinFieldType; required: boolean };

const toDraft = (raw: unknown): FieldDraft[] => {
  const rows = Array.isArray(raw) ? raw : [];
  return rows.map((f, i) => {
    const row = (f && typeof f === "object" ? f : {}) as Record<string, unknown>;
    const type = JOIN_FIELD_TYPES.includes(row.type as JoinFieldType)
      ? (row.type as JoinFieldType)
      : "short";
    return {
      id: String(row.id ?? `field${i + 1}`),
      label: String(row.label ?? ""),
      type,
      required: row.required === true,
    };
  });
};

const newId = () => `f${Date.now().toString(36)}`;

/**
 * Admin editor for the Join Us form: preferred-role options and the extra
 * fields (paragraph / short message / link) appended to the public form.
 */
export default function JoinFormSettings() {
  const [roles, setRoles] = useState<string[]>([]);
  const [fields, setFields] = useState<FieldDraft[]>([]);
  const [roleDraft, setRoleDraft] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/admin/join-form")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => {
        if (!alive) return;
        setRoles(Array.isArray(data.config?.roles) ? data.config.roles : []);
        setFields(toDraft(data.config?.fields));
        setLoaded(true);
      })
      .catch(() => {
        if (!alive) return;
        setMsg({ kind: "err", text: "Could not load the current settings." });
        setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const addRole = () => {
    const value = roleDraft.trim();
    if (!value) return;
    if (roles.includes(value)) {
      setMsg({ kind: "err", text: "That role is already in the list." });
      return;
    }
    setRoles([...roles, value]);
    setRoleDraft("");
    setMsg(null);
  };

  const addField = () => {
    setFields([...fields, { id: newId(), label: "", type: "short", required: false }]);
    setMsg(null);
  };

  const save = async () => {
    const cleanRoles = roles.map((r) => r.trim()).filter(Boolean);
    const cleanFields = fields
      .map((f) => ({ ...f, label: f.label.trim() }))
      .filter((f) => f.label);
    if (cleanFields.length !== fields.length) {
      setMsg({ kind: "err", text: "Every extra field needs a label (or delete the empty row)." });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/join-form", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: { roles: cleanRoles, fields: cleanFields } }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg({ kind: "err", text: data.error || `Failed (${res.status})` });
      } else {
        setRoles(data.config.roles);
        setFields(toDraft(data.config.fields));
        setMsg({ kind: "ok", text: "Saved. The public form updates immediately." });
      }
    } catch {
      setMsg({ kind: "err", text: "Network error" });
    }
    setBusy(false);
  };

  const input =
    "w-full px-3 py-2 rounded-lg border border-black/15 bg-white text-black text-sm focus:outline-none focus:border-[#0000ff]";

  return (
    <div className="max-w-[1100px] bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
      <h2 className="text-lg font-extrabold text-black">Join Us form settings</h2>
      <p className="text-sm text-[#525252] mb-4 max-w-2xl">
        Preferred roles shown in the application form, and any extra questions you want to add
        (paragraph, short message or link).
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

      {!loaded && <div className="text-sm text-[#525252] mb-4">Loading…</div>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section>
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#525252] mb-2">
            Preferred roles
          </h3>
          <div className="space-y-2">
            {roles.map((role, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={role}
                  onChange={(e) =>
                    setRoles(roles.map((r, j) => (j === i ? e.target.value : r)))
                  }
                  className={input}
                  aria-label={`Role ${i + 1}`}
                />
                <button
                  onClick={() => setRoles(roles.filter((_, j) => j !== i))}
                  className="px-3 py-1.5 rounded bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
            {roles.length === 0 && (
              <p className="text-xs text-[#525252]">
                No roles — the dropdown is hidden on the public form.
              </p>
            )}
          </div>
          <div className="flex gap-2 mt-3">
            <input
              value={roleDraft}
              onChange={(e) => setRoleDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addRole();
                }
              }}
              placeholder="e.g. Media Secretary"
              className={input}
            />
            <button
              onClick={addRole}
              className="px-3 py-1.5 rounded bg-[#0000ff] text-white text-xs font-semibold hover:bg-[#0000cc] whitespace-nowrap"
            >
              + Add role
            </button>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold uppercase tracking-wide text-[#525252] mb-2">
            Extra fields
          </h3>
          <div className="space-y-3">
            {fields.map((f, i) => (
              <div key={f.id} className="rounded-lg border border-black/10 p-3">
                <div className="flex gap-2">
                  <input
                    value={f.label}
                    onChange={(e) =>
                      setFields(fields.map((row, j) => (j === i ? { ...row, label: e.target.value } : row)))
                    }
                    placeholder="Field label"
                    className={input}
                  />
                  <select
                    value={f.type}
                    onChange={(e) =>
                      setFields(
                        fields.map((row, j) =>
                          j === i ? { ...row, type: e.target.value as JoinFieldType } : row
                        )
                      )
                    }
                    className={`${input} w-auto cursor-pointer`}
                  >
                    {JOIN_FIELD_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {JOIN_FIELD_TYPE_LABELS[t]}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => setFields(fields.filter((_, j) => j !== i))}
                    className="px-3 py-1.5 rounded bg-red-50 text-red-600 text-xs font-semibold hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
                <label className="mt-2 flex items-center gap-2 text-xs text-black">
                  <input
                    type="checkbox"
                    checked={f.required}
                    onChange={(e) =>
                      setFields(
                        fields.map((row, j) =>
                          j === i ? { ...row, required: e.target.checked } : row
                        )
                      )
                    }
                    className="w-3.5 h-3.5 accent-[#0000ff]"
                  />
                  Required
                </label>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-xs text-[#525252]">No extra fields yet.</p>
            )}
          </div>
          <button
            onClick={addField}
            className="mt-3 px-3 py-1.5 rounded bg-[#0000ff] text-white text-xs font-semibold hover:bg-[#0000cc]"
          >
            + Add field
          </button>
        </section>
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={save}
          disabled={busy || !loaded}
          className="px-5 py-2.5 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] disabled:opacity-60"
        >
          {busy ? "Saving…" : "Save changes"}
        </button>
        <button
          onClick={() => {
            setRoles([...DEFAULT_JOIN_FORM.roles]);
            setFields([]);
            setMsg(null);
          }}
          className="px-4 py-2.5 rounded-lg bg-black/5 text-black text-sm font-semibold hover:bg-black/10"
        >
          Restore defaults
        </button>
      </div>
    </div>
  );
}
