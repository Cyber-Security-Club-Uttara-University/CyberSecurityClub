import { tagStyle, type LeaderboardRow } from "@/content/ctf";

/** Kept in sync with the on-page hero so the export matches the site. */
const PATTERN =
  "url(\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='72'%20height='72'%20viewBox='0%200%2064%2064'%3E%3Cpath%20d='M32%2012l16%2020-16%2020-16-20z'%20fill='none'%20stroke='%23ffffff'%20stroke-opacity='0.06'%20stroke-width='2'%20/%3E%3C/svg%3E\")";

const W = 1200;
const H = 630;

const FONT =
  '"Segoe UI", system-ui, -apple-system, "Helvetica Neue", Arial, sans-serif';

function initials(name: string) {
  const parts = name.trim().split(/[\s_-]+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function Card({ row, rank }: { row: LeaderboardRow; rank: number }) {
  const first = rank === 1;
  const style = tagStyle(row.tag || "");
  const badge: React.CSSProperties = first
    ? {
        background: "#facc15",
        border: "3px solid #fde68a",
        color: "#422006",
        boxShadow: "0 6px 16px rgba(250,204,21,.45)",
      }
    : {
        background: "#151d4a",
        border: "3px solid rgba(255,255,255,.35)",
        color: "#ffffff",
      };

  return (
    <div
      style={{
        position: "relative",
        width: first ? 254 : 232,
        marginTop: first ? -46 : 0,
        borderRadius: 20,
        background: "#ffffff",
        border: first ? "3px solid #facc15" : "1px solid rgba(255,255,255,.35)",
        boxShadow: first
          ? "0 26px 50px rgba(0,0,0,.55)"
          : "0 18px 36px rgba(0,0,0,.42)",
        padding: first ? "34px 20px 26px" : "28px 18px 22px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -26,
          left: "50%",
          transform: "translateX(-50%)",
          width: 52,
          height: 52,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          fontSize: 22,
          fontWeight: 800,
          fontFamily: FONT,
          ...badge,
        }}
      >
        {rank}
      </div>

      <div
        style={{
          width: first ? 96 : 86,
          height: first ? 96 : 86,
          borderRadius: "50%",
          background: "#0f1424",
          display: "grid",
          placeItems: "center",
          overflow: "hidden",
          border: "3px solid #e8eaf6",
        }}
      >
        {row.avatar ? (
          /* eslint-disable-next-line @next/next/no-img-element -- exported verbatim by html-to-image; next/image's srcset would not survive the canvas round-trip */
          <img
            src={row.avatar}
            alt=""
            width={first ? 96 : 86}
            height={first ? 96 : 86}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span
            style={{
              color: "#ffffff",
              fontSize: first ? 32 : 28,
              fontWeight: 800,
              fontFamily: FONT,
              letterSpacing: "0.02em",
            }}
          >
            {initials(row.team)}
          </span>
        )}
      </div>

      <div
        style={{
          marginTop: 14,
          maxWidth: "100%",
          fontSize: 17,
          fontWeight: 700,
          color: "#111634",
          fontFamily: FONT,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {row.team}
      </div>

      <div
        style={{
          marginTop: 4,
          fontSize: 14,
          fontWeight: 600,
          color: "#6b7280",
          fontFamily: FONT,
        }}
      >
        {row.score}pts
      </div>

      <div
        style={{
          marginTop: 12,
          borderRadius: 999,
          padding: "5px 16px",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: FONT,
          background: style.bg,
          color: style.fg,
        }}
      >
        {row.tag}
      </div>
    </div>
  );
}

/**
 * The downloadable leaderboard image: chosen title top-left, nothing top-right,
 * the top three players in the middle and the club logo bottom-right.
 * Uses inline styles only, so it exports identically to how it previews.
 */
export default function LeaderboardShareCard({
  title,
  rows,
  logoUrl,
}: {
  title: string;
  rows: LeaderboardRow[];
  logoUrl: string;
}) {
  const ordered = [...rows].sort((a, b) => a.place - b.place).slice(0, 3);
  const first = ordered.find((r) => r.place === 1) ?? ordered[0];
  const second = ordered.find((r) => r.place === 2);
  const third = ordered.find((r) => r.place === 3);

  const podium: { row: LeaderboardRow; rank: number }[] = [];
  if (second) podium.push({ row: second, rank: 2 });
  if (first) podium.push({ row: first, rank: 1 });
  if (third) podium.push({ row: third, rank: 3 });

  return (
    <div
      id="leaderboard-share-card"
      style={{
        width: W,
        height: H,
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        fontFamily: FONT,
        background: "linear-gradient(160deg, #0d1538 0%, #0a0f28 55%, #101a45 100%)",
        backgroundImage: `${PATTERN}, linear-gradient(160deg, #0d1538 0%, #0a0f28 55%, #101a45 100%)`,
        backgroundSize: "72px 72px, cover",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 56,
          top: 44,
          right: 56,
          fontSize: 52,
          fontWeight: 800,
          lineHeight: 1.1,
          color: "#ffffff",
          letterSpacing: "-0.01em",
        }}
      >
        {title || "Our leaderboard"}
      </div>

      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 176,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 34,
        }}
      >
        {podium.map(({ row, rank }) => (
          <Card key={`${rank}-${row.team}`} row={row} rank={rank} />
        ))}
      </div>

      {/* eslint-disable-next-line @next/next/no-img-element -- same reason as the avatar above */}
      <img
        src={logoUrl}
        alt=""
        width={220}
        height={66}
        style={{
          position: "absolute",
          right: 48,
          bottom: 40,
          height: 66,
          width: "auto",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
