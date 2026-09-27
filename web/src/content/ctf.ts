/**
 * CTF arena: participants shown on the public leaderboard, the CTFd
 * scoreboard API that feeds their scores, and the admin-configurable
 * streak thresholds that classify them.
 *
 * Everything is stored as generic `ContentBlock` rows so the rest of the CMS
 * (content API, audit log, defaults fallback) works unchanged.
 */

export type CtfSource = "manual" | "ctfd";

export type CtfPlayer = {
  /** Unique handle — this is what the leaderboard shows as the name. */
  handle: string;
  /** Optional display name (used when handle is empty). */
  name: string;
  /** Optional e-mail, handy for matching a CTFd account. */
  email: string;
  /** Admin-uploaded picture, "/uploads/…". Wins over the GitHub avatar. */
  avatar: string;
  /** Admin/portal supplied profile URL, "https://github.com/username". */
  githubUrl: string;
  /** Legacy single score. Only used when `scores` is empty. */
  score: number;
  /** Points per event tab. Overall points = the sum of these. */
  scores: Record<string, number>;
  /** Event this player was registered for. Legacy pin when `scores` is empty. */
  event: string;
  source: CtfSource;
  active: boolean;
  /**
   * Legacy free-text pill. Kept so stored rows survive, but the public
   * leaderboard always derives the streak from overall points instead.
   */
  tag: string;
};

export type CtfConfig = {
  /** Base URL or full `…/api/v1/scoreboard` URL of the CTFd instance. */
  apiUrl: string;
  /** CTFd access token. Admin-only, never sent to the public site. */
  token: string;
};

/** One admin-configurable streak band. `min` is the inclusive point floor. */
export type CtfStreakLevel = { label: string; min: number };

export type StandingRow = {
  team?: string;
  score?: number;
  place?: number;
  placeholder?: boolean;
};

/** One rendered leaderboard row. */
export type LeaderboardRow = {
  place: number;
  team: string;
  score: number;
  avatar?: string;
  /** Computed streak label: Elite / Strong / Rookie / Newbie. */
  tag?: string;
  placeholder?: boolean;
};

export const PLAYERS_BLOCK_KEY = "ctf-players";
export const CONFIG_BLOCK_KEY = "ctf-config";
export const STREAK_LEVELS_BLOCK_KEY = "ctf-streak-levels";

export const EMPTY_CTF_CONFIG: CtfConfig = { apiUrl: "", token: "" };

/** Fixed band order, highest first. Labels are not editable (see §9/§17). */
export const STREAK_LABELS = ["Elite", "Strong", "Rookie", "Newbie"] as const;

export const DEFAULT_STREAK_LEVELS: CtfStreakLevel[] = [
  { label: "Elite", min: 1000 },
  { label: "Strong", min: 700 },
  { label: "Rookie", min: 300 },
  { label: "Newbie", min: 0 },
];

const str = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : String(v).trim());
const num = (v: unknown) => {
  const n = typeof v === "number" ? v : Number.parseInt(str(v), 10);
  return Number.isFinite(n) ? n : 0;
};

/** Only positive, finite counts contribute to a score map. */
function normalizeScoreMap(raw: unknown): Record<string, number> {
  const out: Record<string, number> = {};
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [event, value] of Object.entries(raw as Record<string, unknown>)) {
    const key = str(event);
    if (!key) continue;
    const n = typeof value === "number" ? value : Number(value);
    if (Number.isFinite(n) && n >= 0) out[key] = n;
  }
  return out;
}

/**
 * Accepts a GitHub profile URL in any of the usual shapes and returns the
 * bare username, or null when the URL is not a GitHub profile (§15).
 */
export function githubUsername(raw: unknown): string | null {
  const url = str(raw).replace(/\/+$/, "");
  if (!url) return null;
  if (/\s/.test(url)) return null;
  const match =
    /^(?:https?:\/\/)?(?:www\.)?github\.com\/([A-Za-z0-9](?:[A-Za-z0-9]|-(?=[A-Za-z0-9])){0,38})$/i.exec(
      url
    );
  if (!match) return null;
  const user = match[1];
  if (user.toLowerCase() === "settings" || user.toLowerCase() === "topics") return null;
  return user;
}

/** Avatar URL for a valid GitHub profile, otherwise "". */
export function githubAvatarUrl(raw: unknown): string {
  const user = githubUsername(raw);
  return user ? `https://github.com/${user}.png` : "";
}

/** Custom upload → GitHub avatar → nothing (§14). */
export function resolveAvatar(player: Pick<CtfPlayer, "avatar" | "githubUrl">): string {
  return str(player.avatar) || githubAvatarUrl(player.githubUrl) || "";
}

/** Sum of every per-event score; falls back to the legacy single score. */
export function overallPoints(player: CtfPlayer): number {
  const keys = Object.keys(player.scores);
  if (keys.length === 0) return player.score;
  return keys.reduce((total, key) => total + (player.scores[key] ?? 0), 0);
}

/** Band label for a point total, using the admin-configured thresholds (§8/§9). */
export function streakFor(points: number, levels: CtfStreakLevel[] = DEFAULT_STREAK_LEVELS): string {
  const sorted = [...levels].sort((a, b) => b.min - a.min);
  if (sorted.length === 0) return "Newbie";
  for (const level of sorted) {
    if (points >= level.min) return level.label;
  }
  return sorted[sorted.length - 1].label;
}

export function normalizePlayer(raw: unknown): CtfPlayer {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const source = str(r.source) === "ctfd" ? "ctfd" : "manual";
  const event = str(r.event);
  const score = num(r.score);
  let scores = normalizeScoreMap(r.scores);

  // Older rows only carried one score — attribute it to its event so the
  // per-event editor starts out populated instead of empty.
  if (Object.keys(scores).length === 0 && score > 0 && event) {
    scores = { [event]: score };
  }

  return {
    handle: str(r.handle ?? r.team ?? r.name),
    name: str(r.name),
    email: str(r.email),
    avatar: str(r.avatar),
    githubUrl: str(r.githubUrl),
    score,
    scores,
    event,
    source: source as CtfSource,
    active: r.active === undefined ? true : Boolean(r.active),
    tag: str(r.tag),
  };
}

export function normalizePlayers(raw: unknown): CtfPlayer[] {
  if (!Array.isArray(raw)) return [];
  const out: CtfPlayer[] = [];
  const seen = new Set<string>();
  for (const item of raw) {
    const p = normalizePlayer(item);
    if (!p.handle) continue;
    const key = p.handle.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

export function normalizeConfig(raw: unknown): CtfConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return { apiUrl: str(r.apiUrl), token: str(r.token) };
}

/** Keeps exactly four bands, labels fixed, sorted by descending minimum. */
export function normalizeStreakLevels(raw: unknown): CtfStreakLevel[] {
  const list = Array.isArray(raw) ? raw : [];
  const byLabel = new Map<string, Record<string, unknown>>();
  for (const item of list) {
    if (item && typeof item === "object") {
      const entry = item as Record<string, unknown>;
      const label = str(entry.label).toLowerCase();
      if (label) byLabel.set(label, entry);
    }
  }
  const levels = STREAK_LABELS.map((label, i) => {
    const entry = byLabel.get(label.toLowerCase()) ?? {};
    const fallback = DEFAULT_STREAK_LEVELS[i];
    const min = entry.min === undefined ? fallback.min : Math.max(0, num(entry.min));
    return { label, min };
  });
  return levels.sort((a, b) => b.min - a.min);
}

export function tagStyle(tag: string): { bg: string; fg: string } {
  const t = tag.toLowerCase();
  if (t.includes("elite")) return { bg: "#fee2e2", fg: "#b91c1c" };
  if (t.includes("strong")) return { bg: "#ffedd5", fg: "#c2410c" };
  if (t.includes("rookie")) return { bg: "#fef3c7", fg: "#a16207" };
  if (t.includes("newbie")) return { bg: "#dbeafe", fg: "#1d4ed8" };
  return { bg: "#eef1fd", fg: "#3730a3" };
}

function finalize(rows: LeaderboardRow[], levels: CtfStreakLevel[]): LeaderboardRow[] {
  rows.sort((a, b) => b.score - a.score || a.place - b.place || a.team.localeCompare(b.team));
  return rows.map((row, i) => ({
    ...row,
    place: i + 1,
    tag: streakFor(row.score, levels),
  }));
}

/**
 * The overall leaderboard: every active participant ranked by the sum of
 * their per-event points (§10). Standings are per-event, so merging them
 * here would double-count.
 */
export function buildOverallBoard(
  players: CtfPlayer[],
  levels: CtfStreakLevel[] = DEFAULT_STREAK_LEVELS
): LeaderboardRow[] {
  const rows: LeaderboardRow[] = players
    .filter((p) => p.active && p.handle)
    .map((p) => ({
      place: 0,
      team: p.handle,
      score: overallPoints(p),
      avatar: resolveAvatar(p) || undefined,
      placeholder: false,
    }));
  return finalize(rows, levels);
}

/**
 * One event's board: participants holding points for that tab, plus any
 * manual/placeholder standings rows that have no roster entry. Players that
 * predate the per-event score map keep falling back to their pinned event.
 */
export function buildEventBoard(
  players: CtfPlayer[],
  standings: StandingRow[],
  tab: string,
  levels: CtfStreakLevel[] = DEFAULT_STREAK_LEVELS
): LeaderboardRow[] {
  const standingKeys = new Set(
    standings.map((s) => str(s.team).toLowerCase()).filter(Boolean)
  );

  const rows: LeaderboardRow[] = [];
  const taken = new Set<string>();

  for (const p of players) {
    if (!p.active || !p.handle) continue;
    const hasEventScore = Object.prototype.hasOwnProperty.call(p.scores, tab);
    const legacyOnly = Object.keys(p.scores).length === 0;
    const belongs =
      hasEventScore ||
      (legacyOnly && (p.event === tab || p.event === "" || standingKeys.has(p.handle.toLowerCase())));
    if (!belongs) continue;

    const key = p.handle.toLowerCase();
    taken.add(key);
    rows.push({
      place: 0,
      team: p.handle,
      score: hasEventScore ? (p.scores[tab] ?? 0) : p.score,
      avatar: resolveAvatar(p) || undefined,
      placeholder: false,
    });
  }

  for (const s of standings) {
    const team = str(s.team);
    const key = team.toLowerCase();
    if (!key || taken.has(key)) continue;
    if (s.placeholder && rows.length > 0) continue;
    taken.add(key);
    rows.push({
      place: Number.isFinite(Number(s.place)) ? Number(s.place) : 0,
      team,
      score: num(s.score),
      placeholder: Boolean(s.placeholder),
    });
  }

  return finalize(rows, levels);
}
