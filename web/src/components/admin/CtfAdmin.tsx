"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ImageField, { ImageThumb } from "@/components/admin/ImageField";
import {
  githubAvatarUrl,
  githubUsername,
  overallPoints,
  resolveAvatar,
  streakFor,
  tagStyle,
  type CtfConfig,
  type CtfPlayer,
  type CtfStreakLevel,
} from "@/content/ctf";

/**
 * Key-order independent snapshot. The server normalises players (it may emit
 * the same fields in a different order than the draft), so comparing raw
 * JSON would leave the panel permanently "dirty" after a save.
 */
function stable(value: unknown): string {
  return JSON.stringify(value, (_key, val) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const sorted: Record<string, unknown> = {};
      for (const k of Object.keys(val).sort()) sorted[k] = (val as Record<string, unknown>)[k];
      return sorted;
    }
    return val;
  });
}

type Tab = "api" | "players" | "levels" | "links";
type Msg = { kind: "ok" | "err"; text: string } | null;
type PreviewRow = { pos: number; name: string; score: number };

const EMPTY_DRAFT: CtfPlayer = {
  handle: "",
  name: "",
  email: "",
  avatar: "",
  githubUrl: "",
  score: 0,
  scores: {},
  tag: "",
  event: "",
  source: "manual",
  active: true,
};

const TABS: { id: Tab; label: string }[] = [
  { id: "api", label: "Scoreboard API" },
  { id: "players", label: "Players" },
  { id: "levels", label: "Streak levels" },
  { id: "links", label: "Links" },
];

export default function CtfAdmin({
  initialPlayers,
  initialConfig,
  initialLevels,
  eventTabs,
  portalUrl,
}: {
  initialPlayers: CtfPlayer[];
  initialConfig: CtfConfig;
  initialLevels: CtfStreakLevel[];
  eventTabs: string[];
  portalUrl: string;
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("api");
  const [players, setPlayers] = useState<CtfPlayer[]>(initialPlayers);
  const [config, setConfig] = useState<CtfConfig>(initialConfig);
  const [levels, setLevels] = useState<CtfStreakLevel[]>(initialLevels);
  const [msg, setMsg] = useState<Msg>(null);
  const [busy, setBusy] = useState(false);

  const [draft, setDraft] = useState<CtfPlayer | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [preview, setPreview] = useState<PreviewRow[] | null>(null);
  const [syncEvent, setSyncEvent] = useState(eventTabs[0] ?? "Overall");
  const [showToken, setShowToken] = useState(false);

  const playersDirty = stable(players) !== stable(initialPlayers);
  const configDirty = stable(config) !== stable(initialConfig);
  const levelsDirty = stable(levels) !== stable(initialLevels);

  async function put(path: string, method: string, body?: unknown, okText?: string) {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(path, {
        method,
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) setMsg({ kind: "err", text: data.error || `Request failed (${res.status})` });
      else setMsg({ kind: "ok", text: okText || data.message || data.saved?.join(", ") || "Done." });
      return { ok: res.ok, data };
    } catch {
      setMsg({ kind: "err", text: "Network error" });
      return { ok: false, data: {} };
    } finally {
      setBusy(false);
    }
  }

  async function savePlayers(list: CtfPlayer[] = players, okText?: string) {
    const { ok } = await put("/api/admin/ctf", "PUT", { players: list }, okText);
    if (ok) router.refresh();
    return ok;
  }

  async function saveConfig() {
    const { ok } = await put("/api/admin/ctf", "PUT", { config });
    if (ok) router.refresh();
  }

  async function saveLevels() {
    const { ok } = await put("/api/admin/ctf", "PUT", { levels });
    if (ok) router.refresh();
  }

  async function resetLevels() {
    if (!confirm("Restore the default streak thresholds (1000 / 700 / 300 / 0)?")) return;
    const { ok } = await put("/api/admin/ctf?key=streak-levels", "DELETE");
    if (ok) {
      const fresh = await fetch("/api/admin/ctf").then((r) => r.json()).catch(() => null);
      if (Array.isArray(fresh?.levels)) setLevels(fresh.levels);
      router.refresh();
    }
  }

  async function testConnection() {
    if (configDirty) {
      const { ok } = await put("/api/admin/ctf", "PUT", { config });
      if (!ok) return;
    }
    const { ok, data } = await put("/api/admin/ctf/scoreboard", "GET");
    if (ok) {
      setPreview(data.rows ?? []);
      setMsg({ kind: "ok", text: `Connected to ${data.url} — ${data.rows?.length ?? 0} entries.` });
    } else {
      setPreview(null);
    }
  }

  async function syncNow() {
    const { ok, data } = await put("/api/admin/ctf/sync", "POST", { event: syncEvent });
    if (ok) {
      if (Array.isArray(data.players)) setPlayers(data.players);
      setMsg({
        kind: "ok",
        text: `Synced: ${data.updated} updated, ${data.created} added.`,
      });
      router.refresh();
    }
  }

  async function resetRoster() {
    if (!confirm("Delete the saved roster and fall back to the built-in defaults?")) return;
    const { ok, data } = await put("/api/admin/ctf?key=players", "DELETE");
    if (ok) {
      const fresh = await fetch("/api/admin/ctf").then((r) => r.json()).catch(() => null);
      if (Array.isArray(fresh?.players)) setPlayers(fresh.players);
      setMsg({ kind: "ok", text: data.ok ? "Roster reset to defaults." : "Reset." });
      router.refresh();
    }
  }

  async function clearConfig() {
    if (!confirm("Forget the saved CTFd URL and token?")) return;
    const { ok } = await put("/api/admin/ctf?key=config", "DELETE");
    if (ok) {
      setConfig({ apiUrl: "", token: "" });
      setPreview(null);
      router.refresh();
    }
  }

  function commitDraft() {
    if (!draft) return;
    const handle = draft.handle.trim();
    if (!handle) {
      setMsg({ kind: "err", text: "Handle is required." });
      return;
    }
    const clash = players.findIndex(
      (p, i) => i !== editIndex && p.handle.toLowerCase() === handle.toLowerCase()
    );
    if (clash >= 0) {
      setMsg({ kind: "err", text: `"${handle}" is already on the roster.` });
      return;
    }
    const next = [...players];
    const row: CtfPlayer = { ...draft, handle };
    const added = editIndex === null;
    if (added) next.push(row);
    else next[editIndex] = row;
    setPlayers(next);
    setDraft(null);
    setEditIndex(null);
    setMsg(null);
    // Persist straight away so the member (and its picture) is on the public
    // leaderboard immediately — no separate "Save roster" step to forget.
    void savePlayers(
      next,
      added
        ? `"${handle}" added and saved to the roster.`
        : `"${handle}" updated and saved.`
    );
  }

  return (
    <div className="max-w-[1100px]">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-black mb-1">CTF Arena</h1>
          <p className="text-sm text-[#525252]">
            Players, profile pictures and the CTFd scoreboard that feeds the public leaderboard.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/ctf"
            className="px-3 py-2 rounded-lg border border-black/15 text-sm font-semibold text-black hover:bg-black/5 transition-colors"
          >
            View leaderboard
          </Link>
        </div>
      </div>

      <div className="flex gap-1 mb-5 border-b border-black/10">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-colors ${
              tab === t.id
                ? "border-[#0000ff] text-[#0000ff]"
                : "border-transparent text-[#525252] hover:text-black"
            }`}
          >
            {t.label}
            {t.id === "players" && (
              <span className="ml-2 text-xs text-[#525252]">({players.length})</span>
            )}
          </button>
        ))}
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

      {tab === "api" && (
        <div className="bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1.5">
              CTFd scoreboard URL
            </label>
            <input
              type="text"
              value={config.apiUrl}
              onChange={(e) => setConfig({ ...config, apiUrl: e.target.value })}
              placeholder="https://ctf.example.com  (or …/api/v1/scoreboard)"
              className="w-full px-3 py-2 rounded-lg border border-black/15 bg-white text-black text-sm focus:outline-none focus:border-[#0000ff]"
            />
            <p className="text-xs text-[#525252] mt-1.5">
              Base instance URL or the full scoreboard endpoint — both work.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1.5">
              API access token
            </label>
            <div className="flex gap-2">
              <input
                type={showToken ? "text" : "password"}
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value })}
                placeholder="CTFd → Settings → API → Token"
                autoComplete="off"
                className="flex-1 px-3 py-2 rounded-lg border border-black/15 bg-white text-black text-sm focus:outline-none focus:border-[#0000ff]"
              />
              <button
                onClick={() => setShowToken((v) => !v)}
                className="px-3 py-2 rounded-lg border border-black/15 text-xs font-semibold text-[#525252] hover:bg-black/5"
              >
                {showToken ? "Hide" : "Show"}
              </button>
            </div>
            <p className="text-xs text-[#525252] mt-1.5">
              Admin only — never rendered on the public site.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={saveConfig}
              disabled={busy || !configDirty}
              className="px-4 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] disabled:opacity-50"
            >
              {busy ? "Working…" : "Save settings"}
            </button>
            <button
              onClick={clearConfig}
              disabled={busy}
              className="px-4 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Clear settings
            </button>
            <button
              onClick={testConnection}
              disabled={busy}
              className="px-4 py-2 rounded-lg border border-black/15 text-sm font-semibold text-black hover:bg-black/5 disabled:opacity-50"
            >
              Test connection
            </button>
            <button
              onClick={syncNow}
              disabled={busy}
              className="px-4 py-2 rounded-lg border border-[#0000ff] text-[#0000ff] text-sm font-semibold hover:bg-[#0000ff]/10 disabled:opacity-50"
            >
              Sync scores now
            </button>
            <select
              value={syncEvent}
              onChange={(e) => setSyncEvent(e.target.value)}
              className="px-3 py-2 rounded-lg border border-black/15 text-sm bg-white text-black focus:outline-none focus:border-[#0000ff]"
            >
              {(eventTabs.length ? eventTabs : ["Overall"]).map((t) => (
                <option key={t} value={t}>
                  Scores belong to: {t}
                </option>
              ))}
            </select>
          </div>

          {preview && (
            <div className="border border-black/10 rounded-lg overflow-hidden">
              <div className="px-3 py-2 bg-black/[0.03] text-xs font-bold uppercase tracking-wide text-[#525252]">
                CTFd response preview — {preview.length} entries
              </div>
              <div className="max-h-[280px] overflow-auto">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-white">
                    <tr className="text-left text-xs uppercase tracking-wide text-[#525252] border-b border-black/10">
                      <th className="px-3 py-2 w-[70px]">Pos</th>
                      <th className="px-3 py-2">Name</th>
                      <th className="px-3 py-2 w-[110px] text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {preview.slice(0, 50).map((r, i) => (
                      <tr key={`${r.pos}-${i}`} className="border-b border-black/5">
                        <td className="px-3 py-1.5 tabular-nums text-[#525252]">{r.pos}</td>
                        <td className="px-3 py-1.5 font-semibold text-black">{r.name}</td>
                        <td className="px-3 py-1.5 text-right tabular-nums text-black">{r.score}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "players" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-[#525252]">
              Every row here appears on the public leaderboard with its picture.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setDraft({ ...EMPTY_DRAFT });
                  setEditIndex(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc]"
              >
                + Add player
              </button>
            <button
              onClick={() => savePlayers()}
              disabled={busy || !playersDirty}
              className="px-4 py-2 rounded-lg border border-black/15 text-sm font-semibold text-black hover:bg-black/5 disabled:opacity-50"
            >
              {playersDirty ? "Save roster" : "Saved"}
            </button>
            <button
              onClick={resetRoster}
              disabled={busy}
              className="px-4 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Reset roster
            </button>
            </div>
          </div>

          {draft && (
            <div className="bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
              <h2 className="font-bold text-black mb-4">
                {editIndex === null ? "Add player" : "Edit player"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1.5">
                    Handle *
                  </label>
                  <input
                    value={draft.handle}
                    onChange={(e) => setDraft({ ...draft, handle: e.target.value })}
                    placeholder="taki"
                    className="w-full px-3 py-2 rounded-lg border border-black/15 text-sm focus:outline-none focus:border-[#0000ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1.5">
                    Display name
                  </label>
                  <input
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="Optional full name"
                    className="w-full px-3 py-2 rounded-lg border border-black/15 text-sm focus:outline-none focus:border-[#0000ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1.5">
                    E-mail
                  </label>
                  <input
                    value={draft.email}
                    onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                    placeholder="Optional — matches a CTFd account"
                    className="w-full px-3 py-2 rounded-lg border border-black/15 text-sm focus:outline-none focus:border-[#0000ff]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1.5">
                    Event registration
                  </label>
                  <select
                    value={draft.event}
                    onChange={(e) => setDraft({ ...draft, event: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-black/15 bg-white text-sm focus:outline-none focus:border-[#0000ff]"
                  >
                    <option value="">Every event</option>
                    {eventTabs.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1.5">
                    GitHub profile URL
                  </label>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <input
                        value={draft.githubUrl}
                        onChange={(e) => setDraft({ ...draft, githubUrl: e.target.value })}
                        placeholder="https://github.com/username"
                        className="w-full px-3 py-2 rounded-lg border border-black/15 text-sm focus:outline-none focus:border-[#0000ff]"
                      />
                      <p
                        className={`mt-1.5 text-xs ${
                          githubUsername(draft.githubUrl)
                            ? "text-emerald-700"
                            : draft.githubUrl.trim()
                              ? "text-red-600"
                              : "text-[#525252]"
                        }`}
                      >
                        {githubUsername(draft.githubUrl) ? (
                          <>
                            Avatar: {githubAvatarUrl(draft.githubUrl)}
                          </>
                        ) : draft.githubUrl.trim() ? (
                          <>Not a valid GitHub profile URL — expected https://github.com/username.</>
                        ) : (
                          <>Leave blank to use the custom picture or the default avatar.</>
                        )}
                      </p>
                    </div>
                    <ImageThumb src={resolveAvatar(draft)} />
                  </div>
                  <p className="mt-1.5 text-[11px] leading-4 text-[#525252]">
                    Priority: custom picture &rarr; GitHub avatar &rarr; default initials.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wide text-[#525252] mb-1.5">
                    Points by event
                  </label>
                  <div className="space-y-2">
                    {Object.entries(draft.scores).map(([event, pts]) => (
                      <div key={event} className="flex items-center gap-2">
                        <span className="flex-1 min-w-0 truncate rounded-lg border border-black/10 bg-black/[0.03] px-3 py-2 text-sm text-black">
                          {event}
                        </span>
                        <input
                          type="number"
                          value={pts}
                          onChange={(e) =>
                            setDraft({
                              ...draft,
                              scores: {
                                ...draft.scores,
                                [event]: Number(e.target.value) || 0,
                              },
                            })
                          }
                          className="w-32 px-3 py-2 rounded-lg border border-black/15 text-sm focus:outline-none focus:border-[#0000ff]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const next = { ...draft.scores };
                            delete next[event];
                            setDraft({ ...draft, scores: next });
                          }}
                          title={`Remove ${event}`}
                          className="px-3 py-2 rounded-lg border border-black/15 text-sm text-red-600 hover:bg-red-50"
                        >
                          &times;
                        </button>
                      </div>
                    ))}

                    {Object.keys(draft.scores).length === 0 && (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={draft.score}
                          onChange={(e) =>
                            setDraft({ ...draft, score: Number(e.target.value) || 0 })
                          }
                          className="w-40 px-3 py-2 rounded-lg border border-black/15 text-sm focus:outline-none focus:border-[#0000ff]"
                        />
                        <span className="text-xs text-[#525252]">
                          Total points — add events below to break it down.
                        </span>
                      </div>
                    )}

                    <select
                      value=""
                      onChange={(e) => {
                        const chosen = e.target.value;
                        if (!chosen) return;
                        setDraft({ ...draft, scores: { ...draft.scores, [chosen]: 0 } });
                      }}
                      className="px-3 py-2 rounded-lg border border-black/15 bg-white text-sm focus:outline-none focus:border-[#0000ff]"
                    >
                      <option value="">Add points for an event&hellip;</option>
                      {eventTabs
                        .filter((t) => !(t in draft.scores))
                        .map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                    </select>
                  </div>
                  <p className="mt-2 text-xs text-[#525252]">
                    Overall:{" "}
                    <b className="text-black">{overallPoints(draft)} pts</b> &rarr; streak{" "}
                    <b style={{ color: tagStyle(streakFor(overallPoints(draft), levels)).fg }}>
                      {streakFor(overallPoints(draft), levels)}
                    </b>
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <ImageField
                    value={draft.avatar}
                    onChange={(v) => setDraft({ ...draft, avatar: v })}
                    label="Profile picture"
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-black">
                  <input
                    type="checkbox"
                    checked={draft.active}
                    onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                  />
                  Show on the leaderboard
                </label>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={commitDraft}
                  disabled={busy}
                  className="px-4 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] disabled:opacity-50"
                >
                  {editIndex === null ? "Add" : "Update"}
                </button>
                <button
                  onClick={() => {
                    setDraft(null);
                    setEditIndex(null);
                  }}
                  className="px-4 py-2 rounded-lg border border-black/15 text-sm font-semibold text-black hover:bg-black/5"
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
                  <th className="py-2.5 px-4 font-semibold w-[52px]">#</th>
                  <th className="py-2.5 px-4 font-semibold">Player</th>
                  <th className="py-2.5 px-4 font-semibold w-[110px]">Points</th>
                  <th className="py-2.5 px-4 font-semibold w-[120px]">Streak</th>
                  <th className="py-2.5 px-4 font-semibold w-[150px]">Event</th>
                  <th className="py-2.5 px-4 font-semibold w-[90px]">Source</th>
                  <th className="py-2.5 px-4 font-semibold text-right w-[190px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#525252]">
                      No players yet — add one or run a sync.
                    </td>
                  </tr>
                )}
                {players.map((p, i) => {
                  const points = overallPoints(p);
                  const streak = streakFor(points, levels);
                  const style = tagStyle(streak);
                  return (
                    <tr
                      key={`${p.handle}-${i}`}
                      className={`border-b border-black/5 hover:bg-black/[0.02] ${
                        p.active ? "" : "opacity-50"
                      }`}
                    >
                      <td className="py-2.5 px-4 text-[#525252] tabular-nums">{i + 1}</td>
                      <td className="py-2.5 px-4">
                        <span className="flex items-center gap-3">
                          {resolveAvatar(p) ? (
                            <ImageThumb src={resolveAvatar(p)} />
                          ) : (
                            <span className="h-10 w-10 rounded-full bg-slate-100 grid place-items-center text-xs font-bold text-slate-500">
                              {p.handle.slice(0, 2).toUpperCase()}
                            </span>
                          )}
                          <span>
                            <span className="block font-semibold text-black">{p.handle}</span>
                            {p.name && (
                              <span className="block text-xs text-[#525252]">{p.name}</span>
                            )}
                          </span>
                        </span>
                      </td>
                      <td className="py-2.5 px-4 tabular-nums font-semibold text-black">
                        {points}
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className="inline-block rounded-md px-2 py-0.5 text-xs font-bold"
                          style={{ background: style.bg, color: style.fg }}
                        >
                          {streak}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-[#525252]">{p.event || "All events"}</td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                            p.source === "ctfd"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {p.source}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => {
                            setDraft({ ...p });
                            setEditIndex(i);
                          }}
                          className="text-[#0000ff] font-semibold text-xs hover:underline mr-3"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            const gone = players[i]?.handle ?? "this player";
                            if (!confirm(`Remove "${gone}" from the roster?`)) return;
                            const next = players.filter((_, j) => j !== i);
                            setPlayers(next);
                            void savePlayers(next, `"${gone}" removed from the roster.`);
                          }}
                          className="text-red-600 font-semibold text-xs hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "levels" && (
        <div className="bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] space-y-5">
          <div>
            <h2 className="font-bold text-black">CTF streak levels</h2>
            <p className="text-sm text-[#525252] mt-1">
              A streak is a classification of a participant&rsquo;s overall points across every
              event. Change a threshold and the leaderboard reclassifies itself — nobody is
              re-tagged by hand.
            </p>
          </div>

          <div className="space-y-3">
            {levels.map((level, i) => {
              const count = players.filter(
                (p) => p.active && streakFor(overallPoints(p), levels) === level.label
              ).length;
              return (
                <div key={level.label} className="flex flex-wrap items-center gap-3">
                  <span
                    className="w-24 text-sm font-extrabold"
                    style={{ color: tagStyle(level.label).fg }}
                  >
                    {level.label}
                  </span>
                  <label className="text-xs font-bold uppercase tracking-wide text-[#525252]">
                    Minimum points
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={level.min}
                    onChange={(e) => {
                      const next = [...levels];
                      next[i] = { ...level, min: Math.max(0, Number(e.target.value) || 0) };
                      setLevels(next);
                    }}
                    className="w-32 px-3 py-2 rounded-lg border border-black/15 text-sm focus:outline-none focus:border-[#0000ff]"
                  />
                  <span className="text-xs text-[#525252] tabular-nums">
                    {level.min}+ points &middot; {count} player{count === 1 ? "" : "s"}
                  </span>
                </div>
              );
            })}
          </div>

          {levels.some((l, i) => i > 0 && l.min > levels[i - 1].min) && (
            <p className="text-xs font-semibold text-red-600">
              Thresholds should decrease from Elite to Newbie, otherwise a lower band can never
              be reached.
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <button
              onClick={saveLevels}
              disabled={busy || !levelsDirty}
              className="px-4 py-2 rounded-lg bg-[#0000ff] text-white text-sm font-semibold hover:bg-[#0000cc] disabled:opacity-50"
            >
              {levelsDirty ? "Save changes" : "Saved"}
            </button>
            <button
              onClick={resetLevels}
              disabled={busy}
              className="px-4 py-2 rounded-lg border border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              Restore defaults
            </button>
          </div>
        </div>
      )}

      {tab === "links" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <LinkCard
            href="/admin/sections/ctf-events"
            title="CTF Events"
            desc="Tabs shown above the leaderboard (name, date, note)."
          />
          <LinkCard
            href="/admin/sections/ctf-standings"
            title="CTF Standings"
            desc="Manual rows for events that are not synced from CTFd."
          />
          <LinkCard
            href="/ctf"
            title="Public leaderboard"
            desc="What visitors see, including the downloadable image."
          />
          <LinkCard
            href="/admin/settings"
            title="Site settings"
            desc="CTF portal / scoreboard URL used by the CTF page buttons."
          />
          {portalUrl && (
            <a
              href={portalUrl}
              target="_blank"
              rel="noreferrer"
              className="block bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0px_6px_20px_rgba(0,0,0,0.12)] transition-shadow"
            >
              <h3 className="font-bold text-black mb-1">Live scoreboard ↗</h3>
              <p className="text-sm text-[#525252] break-all">{portalUrl}</p>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

function LinkCard({ href, title, desc }: { href: string; title: string; desc: string }) {
  return (
    <Link
      href={href}
      className="block bg-white rounded-xl p-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] hover:shadow-[0px_6px_20px_rgba(0,0,0,0.12)] transition-shadow"
    >
      <h3 className="font-bold text-black mb-1">{title} →</h3>
      <p className="text-sm text-[#525252]">{desc}</p>
    </Link>
  );
}
