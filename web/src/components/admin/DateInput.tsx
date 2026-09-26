"use client";

import { formatDate, fromDateInput, toDateInput } from "@/lib/dates";

const KEYS_ALLOWED = new Set([
  "Tab",
  "Enter",
  "Escape",
  "Backspace",
  "Delete",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "ArrowDown",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "Shift",
  "Control",
  "Alt",
  "Meta",
  "F5",
  "F12",
]);

/**
 * Calendar-only date field. Typing is blocked so dates are always picked from
 * the native calendar popup instead of being typed in.
 */
export default function DateInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const iso = toDateInput(value);
  const display = value ? formatDate(value) : "";

  return (
    <div>
      <div className="flex items-center gap-2">
        <input
          type="date"
          value={iso}
          placeholder={placeholder}
          onChange={(e) => onChange(fromDateInput(e.target.value))}
          onKeyDown={(e) => {
            if (!KEYS_ALLOWED.has(e.key)) e.preventDefault();
          }}
          className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-black/15 bg-white text-black text-sm focus:outline-none focus:border-[#0000ff]"
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="shrink-0 px-3 py-2 rounded-lg bg-black/5 text-black text-sm font-semibold hover:bg-black/10"
          >
            Clear
          </button>
        )}
      </div>
      <p className="mt-1 text-[11px] text-[#525252]">
        {display ? `Shown on site as: ${display}` : "Pick a date from the calendar."}
      </p>
    </div>
  );
}
