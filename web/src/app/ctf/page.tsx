import type { Metadata } from "next";
import CTFContent, { type EventDef } from "./CTFContent";
import { getSectionData, getSettings } from "@/lib/content";

export const metadata: Metadata = {
  title: "CTF",
  description: "Join Capture the Flag competitions hosted by Cyber Security Club Uttara University.",
};

type EventRow = { tab?: string; title?: string; date?: string; note?: string };
type StandingRow = {
  event?: string;
  place?: number;
  team?: string;
  score?: number;
  integrity?: number;
  placeholder?: boolean;
};

const DEFAULT_PORTAL = "http://ctf-cybersecurity-club-uttara.duckdns.org/scoreboard";

export default async function CTFPage() {
  const [eventRows, standingRows, settings] = await Promise.all([
    getSectionData("ctf-events"),
    getSectionData("ctf-standings"),
    getSettings(),
  ]).then(([e, s, st]) => [
    e as unknown as EventRow[],
    s as unknown as StandingRow[],
    st,
  ] as const);

  const events: EventDef[] = eventRows.map((e) => ({
    id: String(e.tab ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    tab: String(e.tab ?? ""),
    title: String(e.title ?? e.tab ?? ""),
    date: String(e.date ?? ""),
    note: e.note ? String(e.note) : undefined,
    rows: standingRows
      .filter((s) => s.event === e.tab)
      .map((s, i) => ({
        place: Number(s.place ?? i + 1),
        team: String(s.team ?? ""),
        score: Number(s.score ?? 0),
        integrity: Number(s.integrity ?? 0),
        placeholder: Boolean(s.placeholder),
      })),
  }));

  const portalUrl = settings.ctfPortalUrl || DEFAULT_PORTAL;

  return <CTFContent events={events} portalUrl={portalUrl} />;
}
