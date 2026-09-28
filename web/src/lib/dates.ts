const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];

const FULL_MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

function isDigits(s: string) {
  return /^\d+$/.test(s);
}

function monthIndex(token: string) {
  const t = token.toLowerCase();
  const short = MONTHS.indexOf(t);
  if (short >= 0) return short;
  return FULL_MONTHS.indexOf(t);
}

/** Parses the date formats used across the site. Returns null for anything else (e.g. "TBA"). */
export function parseDate(value: unknown): Date | null {
  const raw = String(value ?? "").trim();
  if (!raw) return null;

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    const year = Number(iso[1]);
    const month = Number(iso[2]);
    const day = Number(iso[3]);
    if (month < 1 || month > 12 || day < 1 || day > 31) return null;
    const d = new Date(Date.UTC(year, month - 1, day));
    if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
      return null;
    }
    return d;
  }

  const parts = raw
    .replace(/[,]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ");
  if (parts.length !== 3) return null;

  let day: number;
  let month: number;
  let year: number;

  if (isDigits(parts[0]) && !isDigits(parts[1])) {
    day = Number(parts[0]);
    month = monthIndex(parts[1]);
    year = Number(parts[2]);
  } else if (!isDigits(parts[0]) && isDigits(parts[1])) {
    month = monthIndex(parts[0]);
    day = Number(parts[1]);
    year = Number(parts[2]);
  } else {
    return null;
  }

  if (month < 0 || !isDigits(parts[parts.length - 1]) || year < 1000 || year > 9999) return null;

  const d = new Date(Date.UTC(year, month, day));
  if (d.getUTCFullYear() !== year || d.getUTCMonth() !== month || d.getUTCDate() !== day) {
    return null;
  }
  return d;
}

/** "2025-11-01" for <input type="date">, or "" when the value is not a date. */
export function toDateInput(value: unknown): string {
  const d = parseDate(value);
  if (!d) return "";
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${d.getUTCFullYear()}-${m}-${day}`;
}

/** Friendly site display: "1 Nov 2025". Non-dates are passed through untouched. */
export function formatDate(value: unknown): string {
  const d = parseDate(value);
  if (!d) return String(value ?? "");
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()].replace(/^\w/, (c) => c.toUpperCase())} ${d.getUTCFullYear()}`;
}

/** Turns the value from <input type="date"> back into the stored site format. */
export function fromDateInput(iso: string): string {
  return formatDate(iso);
}
