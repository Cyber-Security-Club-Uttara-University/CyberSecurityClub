import { githubUsername, type CtfConfig } from "@/content/ctf";

export type ScoreboardEntry = {
  pos: number;
  name: string;
  score: number;
  accountId: number | null;
  /** Only set when the portal actually publishes a GitHub profile URL. */
  githubUrl?: string;
};

export type ScoreboardResult =
  | { ok: true; rows: ScoreboardEntry[]; url: string }
  | { ok: false; error: string; status: number };

const TIMEOUT_MS = 12_000;

/** Accepts a bare host, an instance URL or a full `/api/v1/scoreboard` URL. */
export function resolveScoreboardUrl(raw: string): string {
  const url = raw.trim().replace(/\/+$/, "");
  if (!url) return "";
  if (/\/api\/v\d+\/scoreboard/.test(url)) return url;
  if (/\/api\/v\d+$/.test(url)) return url + "/scoreboard";
  return url + "/api/v1/scoreboard";
}

const pick = (row: Record<string, unknown>, keys: string[]): unknown => {
  for (const k of keys) if (row[k] !== undefined && row[k] !== null) return row[k];
  return undefined;
};

/** Normalises the CTFd v1/v2/v3 scoreboard payloads into one shape. */
export function normalizeScoreboard(payload: unknown): ScoreboardEntry[] {
  const root = payload as { data?: unknown } | unknown[];
  const raw = Array.isArray(root) ? root : Array.isArray(root?.data) ? root.data : [];
  const rows: ScoreboardEntry[] = [];

  for (const item of raw as unknown[]) {
    if (!item || typeof item !== "object") continue;
    const r = item as Record<string, unknown>;
    const name = String(
      pick(r, ["name", "team_name", "member", "team", "username", "user"]) ?? ""
    ).trim();
    if (!name) continue;
    const score = Number(pick(r, ["score", "points", "value"]) ?? 0);
    const pos = Number(pick(r, ["pos", "position", "rank", "place"]) ?? 0);
    const id = pick(r, ["account_id", "team_id", "member_id", "id"]);
    const rawGithub = pick(r, ["github_url", "githubUrl", "github", "social_github"]);
    const githubUser = githubUsername(rawGithub);
    rows.push({
      pos: Number.isFinite(pos) && pos > 0 ? pos : rows.length + 1,
      name,
      score: Number.isFinite(score) ? score : 0,
      accountId: id === undefined || id === null ? null : Number(id),
      ...(githubUser ? { githubUrl: `https://github.com/${githubUser}` } : {}),
    });
  }

  if (rows.some((r) => r.pos !== rows.indexOf(r) + 1)) {
    rows.sort((a, b) => b.score - a.score);
    rows.forEach((r, i) => (r.pos = i + 1));
  }
  return rows;
}

/**
 * Reads the CTFd scoreboard. CTFd accepts the token in a few header styles
 * depending on version, so the first form that produces valid JSON wins.
 */
export async function fetchScoreboard(cfg: CtfConfig): Promise<ScoreboardResult> {
  const url = resolveScoreboardUrl(cfg.apiUrl);
  if (!url) return { ok: false, error: "No CTFd scoreboard URL configured.", status: 400 };

  const token = cfg.token.trim();
  const attempts = token
    ? [`Token ${token}`, token, `Bearer ${token}`]
    : [undefined as string | undefined];

  let lastError = "Request failed.";
  let lastStatus = 0;

  for (const auth of attempts) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const headers: Record<string, string> = { Accept: "application/json" };
      if (auth) headers.Authorization = auth;

      const res = await fetch(url, { headers, signal: controller.signal, cache: "no-store" });
      lastStatus = res.status;

      if (res.status === 401 || res.status === 403) {
        lastError =
          res.status === 401
            ? "CTFd rejected the token (401). Check the access token."
            : "CTFd denied access (403). The token needs the scoreboard scope.";
        continue;
      }
      if (!res.ok) {
        lastError = `CTFd responded with ${res.status} ${res.statusText}.`;
        continue;
      }

      const text = await res.text();
      let json: unknown;
      try {
        json = JSON.parse(text);
      } catch {
        lastError = "The URL did not return JSON — is it really a CTFd scoreboard?";
        lastStatus = 502;
        continue;
      }

      const rows = normalizeScoreboard(json);
      if (rows.length === 0) {
        lastError = "Connected, but the scoreboard is empty.";
        lastStatus = 404;
        continue;
      }
      return { ok: true, rows, url };
    } catch (err) {
      lastError =
        err instanceof Error && err.name === "AbortError"
          ? "CTFd timed out after 12s."
          : "Could not reach that host.";
      lastStatus = 504;
    } finally {
      clearTimeout(timer);
    }
  }

  return { ok: false, error: lastError, status: lastStatus || 502 };
}
