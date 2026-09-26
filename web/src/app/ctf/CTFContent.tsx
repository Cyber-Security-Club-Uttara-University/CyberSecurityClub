"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Row = {
  place: number;
  team: string;
  score: number;
  integrity: number;
  placeholder?: boolean;
};

export type EventDef = {
  id: string;
  tab: string;
  title: string;
  date: string;
  note?: string;
  rows: Row[];
};

const HERO_PATTERN =
  "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='64'%20height='64'%20viewBox='0%200%2064%2064'%3E%3Cpath%20d='M32%2012l16%2020-16%2020-16-20z'%20fill='none'%20stroke='%23ffffff'%20stroke-opacity='0.07'%20stroke-width='2'/%3E%3C/svg%3E\")";

const TIER = [
  { min: 95, label: "Elite", pill: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500" },
  { min: 90, label: "Strong", pill: "bg-blue-100 text-blue-700", bar: "bg-blue-600" },
  { min: 0, label: "Fair", pill: "bg-amber-100 text-amber-700", bar: "bg-amber-500" },
];

function tierOf(score: number) {
  return TIER.find((t) => score >= t.min) ?? TIER[TIER.length - 1];
}

function initials(name: string) {
  const parts = name.trim().split(/[\s_-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

const AVATAR_COLORS = [
  "from-indigo-500 to-violet-600",
  "from-sky-500 to-cyan-500",
  "from-rose-500 to-pink-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-fuchsia-500 to-purple-600",
];

function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function Avatar({
  name,
  size,
  ring = false,
}: {
  name: string;
  size: number;
  ring?: boolean;
}) {
  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarColor(
        name
      )} font-extrabold text-white ${ring ? "ring-4 ring-white/90" : ""}`}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.36) }}
      aria-hidden="true"
    >
      {initials(name)}
      <span className="absolute -right-0.5 -top-0.5 flex h-[38%] w-[38%] items-center justify-center rounded-full border-2 border-white bg-blue-600">
        <svg viewBox="0 0 24 24" className="h-[60%] w-[60%]" fill="none" stroke="white" strokeWidth={4}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </span>
    </span>
  );
}

function PodiumCard({
  row,
  rank,
  first,
}: {
  row: Row;
  rank: number;
  first: boolean;
}) {
  const tier = tierOf(row.integrity);
  return (
    <div
      className={`relative flex w-[190px] flex-col items-center rounded-2xl bg-white px-4 pb-5 pt-7 shadow-[0_18px_40px_rgba(0,0,0,0.35)] ${
        first
          ? "z-10 border-[3px] border-amber-400 pb-6 pt-9 md:-translate-y-6"
          : "border border-white/20 md:translate-y-4"
      }`}
    >
      {first && (
        <svg
          viewBox="0 0 24 24"
          className="absolute -top-9 left-1/2 h-8 w-8 -translate-x-1/2 text-amber-400 drop-shadow"
          fill="currentColor"
        >
          <path d="M5 17l1.5-9L12 13l5.5-5L19 17H5zm0 2h14v2H5v-2z" />
        </svg>
      )}
      {!first && (
        <span className="absolute -top-4 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-white/40 bg-[#1a2350] text-sm font-bold text-white">
          {rank}
        </span>
      )}
      <Avatar name={row.team} size={first ? 84 : 72} ring />
      <div className="mt-3 max-w-full truncate text-[15px] font-bold text-[#0f1533]">
        {row.team}
      </div>
      <div className="mt-0.5 text-sm font-semibold text-[#5a6180]">{row.score}pts</div>
      <span
        className={`mt-3 rounded-full px-3 py-1 text-xs font-bold ${tier.pill}`}
        title={`Integrity ${row.integrity}/100`}
      >
        {tier.label}
      </span>
    </div>
  );
}

export default function CTFContent({
  events,
  portalUrl,
}: {
  events: EventDef[];
  portalUrl: string;
}) {
  const [active, setActive] = useState(events[0]?.id ?? "");
  const [filter, setFilter] = useState("");

  const event = events.find((e) => e.id === active) ?? events[0];

  const rows = useMemo(() => {
    if (!event) return [];
    const q = filter.trim().toLowerCase();
    const sorted = [...event.rows].sort((a, b) => a.place - b.place);
    return q ? sorted.filter((r) => r.team.toLowerCase().includes(q)) : sorted;
  }, [event, filter]);

  const podium = useMemo(() => {
    if (!event) return [];
    return [...event.rows].sort((a, b) => a.place - b.place).slice(0, 3);
  }, [event]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#525252]">
        No CTF events have been added yet.
      </div>
    );
  }

  const second = podium.find((r) => r.place === 2);
  const first = podium.find((r) => r.place === 1);
  const third = podium.find((r) => r.place === 3);

  return (
    <div className="min-h-screen bg-white pb-16">
      {/* Leaderboard hero */}
      <section className="mx-auto mt-6 w-full max-w-[85rem] px-4 sm:px-6">
        <div
          className="relative overflow-hidden rounded-3xl bg-[#101740] px-5 py-10 sm:px-10 sm:py-12"
          style={{ backgroundImage: HERO_PATTERN, backgroundSize: "64px 64px" }}
        >
          {/* top bar: heading + filters / CTF portal */}
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div>
              <h1 className="text-[2.4rem] font-extrabold leading-none text-white max-sm:text-[1.9rem]">
                Our leaderboard
              </h1>
              <p className="mt-3 text-sm text-white/60">
                {event.title} &middot; {event.date}
              </p>
            </div>

            {/* right upper-middle: event selector + CTF portal link */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="sr-only" htmlFor="ctf-event-select">
                Select event
              </label>
              <select
                id="ctf-event-select"
                value={active}
                onChange={(e) => setActive(e.target.value)}
                className="cursor-pointer rounded-lg border border-white/25 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-sm outline-none transition-colors hover:bg-white/20 focus:border-white/60"
              >
                {events.map((e) => (
                  <option key={e.id} value={e.id} className="bg-[#101740] text-white">
                    {e.tab}
                  </option>
                ))}
              </select>

              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-bold text-[#101740] transition-colors hover:bg-amber-300"
              >
                CTF Portal
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-4 w-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* podium */}
          <div className="relative z-10 mt-12 flex items-end justify-center gap-4 sm:gap-7 md:mt-16">
            {second && <PodiumCard row={second} rank={2} first={false} />}
            {first && <PodiumCard row={first} rank={1} first />}
            {third && <PodiumCard row={third} rank={3} first={false} />}
          </div>

          {event.note && (
            <div className="relative z-10 mt-12 rounded-xl border border-amber-300/40 bg-amber-400/10 px-4 py-3 text-[13px] leading-5 text-amber-200">
              {event.note}
            </div>
          )}
        </div>
      </section>

      {/* Filter + table */}
      <section className="mx-auto mt-12 w-full max-w-[70rem] px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-[380px]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9aa1bd]"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4h18l-7 8v6l-4 2v-8L3 4z"
              />
            </svg>
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Filter text"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-black outline-none transition-shadow placeholder:text-[#9aa1bd] focus:border-[#0000ff] focus:ring-2 focus:ring-[#0000ff]/15"
            />
          </div>
          <div className="text-sm text-[#5a6180]">
            <span className="font-semibold text-black">{rows.length}</span> of{" "}
            {event.rows.length} ranked
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-left">
            <thead>
              <tr className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#8a91b0]">
                <th className="w-[90px] pb-3 pl-2">Rank</th>
                <th className="pb-3">Researcher</th>
                <th className="pb-3">Reputation</th>
                <th className="w-[160px] pb-3">Streak</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const tier = tierOf(row.integrity);
                const top = row.place === 1;
                return (
                  <tr
                    key={`${event.id}-${row.place}-${row.team}`}
                    className={`border-b border-slate-100 transition-colors ${
                      top ? "bg-[#eef1fd]" : "hover:bg-slate-50"
                    } ${row.placeholder ? "opacity-60" : ""}`}
                  >
                    <td className="py-4 pl-2 text-[22px] font-extrabold text-[#0f1533] tabular-nums">
                      {row.place}
                    </td>
                    <td className="py-4">
                      <span className="flex items-center gap-3">
                        <Avatar name={row.team} size={36} />
                        <span className="font-semibold text-[#0000ff]">{row.team}</span>
                        {row.placeholder && (
                          <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                            placeholder
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="py-4 text-sm font-semibold text-[#5a6180] tabular-nums">
                      {row.score}pts
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-block rounded-md px-2.5 py-1 text-xs font-bold ${tier.pill}`}
                        title={`Integrity ${row.integrity}/100`}
                      >
                        {tier.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-14 text-center text-sm text-[#5a6180]">
                    No teams match &ldquo;{filter}&rdquo;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* legend */}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-[#5a6180]">
          <span className="font-semibold text-black">Streak</span>
          {TIER.map((t) => (
            <span key={t.label} className="inline-flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${t.bar}`} />
              {t.label}
              <span className="text-[#9aa1bd]">
                {t.min === 0 ? "below 90" : `${t.min}+ integrity`}
              </span>
            </span>
          ))}
          <span className="text-[#9aa1bd]">
            Integrity is a 0&ndash;100 fair-play score. Values are illustrative until a
            fair-play audit is recorded for each event.
          </span>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-lg border border-[#0000ff] px-5 py-2.5 text-sm font-medium text-[#0000ff] transition-colors hover:bg-[#0000ff]/5"
          >
            Past Events
          </Link>
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-[#0000ff] px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#0000cc]"
          >
            Visit Scoreboard
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
