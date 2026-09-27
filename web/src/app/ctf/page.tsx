import type { Metadata } from "next";
import CTFContent, { type EventDef } from "./CTFContent";
import { getSectionData, getSettings } from "@/lib/content";
import {
  DEFAULT_STREAK_LEVELS,
  STREAK_LEVELS_BLOCK_KEY,
  buildEventBoard,
  buildOverallBoard,
  normalizePlayers,
  normalizeStreakLevels,
} from "@/content/ctf";
import { db } from "@/lib/db";

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
  placeholder?: boolean;
};

const DEFAULT_PORTAL = "http://ctf-cybersecurity-club-uttara.duckdns.org/scoreboard";
const OVERALL_TITLE = "Overall Leaderboard";
const OVERALL_DATE = "All published events";

export const LEADERBOARD_LOGO = "/images/csc_white.png";

const isOverall = (row: EventRow) =>
  String(row.tab ?? row.title ?? "").trim().toLowerCase() === "overall";

export default async function CTFPage() {
  const [eventRows, standingRows, playerRows, settings, levelsBlock] = await Promise.all([
    getSectionData("ctf-events"),
    getSectionData("ctf-standings"),
    getSectionData("ctf-players"),
    getSettings(),
    db.contentBlock.findUnique({ where: { key: STREAK_LEVELS_BLOCK_KEY } }),
  ]).then(([e, s, p, st, l]) => [
    e as unknown as EventRow[],
    s as unknown as StandingRow[],
    p as unknown as unknown[],
    st,
    l?.data ?? null,
  ] as const);

  const players = normalizePlayers(playerRows);
  const levels = normalizeStreakLevels(levelsBlock ?? DEFAULT_STREAK_LEVELS);

  // The overall board is computed from every participant's summed points, so
  // it leads the selector regardless of how many events are published (§12).
  const configured = eventRows.filter((e) => String(e.tab ?? "").trim());
  const existingOverall = configured.find(isOverall);
  const overallRow: EventRow =
    existingOverall ?? { tab: "Overall", title: OVERALL_TITLE, date: OVERALL_DATE };
  const otherRows = configured.filter((e) => e !== existingOverall);

  const tabs = [overallRow, ...otherRows];

  const events: EventDef[] = tabs.map((e) => {
    const tab = String(e.tab ?? "");
    const overall = e === overallRow;
    const tabStandings = standingRows.filter((s) => s.event === tab);
    return {
      id: tab.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      tab,
      title: String(e.title ?? e.tab ?? (overall ? OVERALL_TITLE : "")),
      date: String(e.date ?? (overall ? OVERALL_DATE : "")),
      note: e.note ? String(e.note) : undefined,
      overall,
      rows: overall
        ? buildOverallBoard(players, levels)
        : buildEventBoard(players, tabStandings, tab, levels),
    };
  });

  const portalUrl = settings.ctfPortalUrl || DEFAULT_PORTAL;
  const titleOptions = ["CTF Leaderboard", ...events.map((e) => e.title).filter(Boolean)];

  return (
    <CTFContent
      events={events}
      levels={levels}
      portalUrl={portalUrl}
      titleOptions={titleOptions}
      logoUrl={LEADERBOARD_LOGO}
    />
  );
}
