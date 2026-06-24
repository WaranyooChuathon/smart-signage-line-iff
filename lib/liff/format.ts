const TH_MONTHS = [
  "ม.ค.",
  "ก.พ.",
  "มี.ค.",
  "เม.ย.",
  "พ.ค.",
  "มิ.ย.",
  "ก.ค.",
  "ส.ค.",
  "ก.ย.",
  "ต.ค.",
  "พ.ย.",
  "ธ.ค.",
];

// Shift an instant by +7h so its UTC fields read as Bangkok wall-clock —
// timezone-safe regardless of the server's TZ (Cloudflare Workers run in UTC).
function toBangkok(input: string | Date): Date {
  const base =
    typeof input === "string" ? new Date(`${input}T00:00:00+07:00`) : input;
  return new Date(base.getTime() + 7 * 3600_000);
}

/** "2026-06-22" | Date → "22 มิ.ย. 2569" (Buddhist era). */
export function thaiDate(input: string | Date): string {
  const d = toBangkok(input);
  return `${d.getUTCDate()} ${TH_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear() + 543}`;
}

/** Thousands separator for big numbers. */
export function fmtNum(n: number): string {
  return n.toLocaleString("en-US");
}

const pad = (n: number) => String(n).padStart(2, "0");

function bangkokParts(): { h: number; m: number } {
  const d = new Date(Date.now() + 7 * 3600_000);
  return { h: d.getUTCHours(), m: d.getUTCMinutes() };
}

/** Current hour of day in Bangkok (0–23). */
export function currentBangkokHour(): number {
  return bangkokParts().h;
}

/** The most recently completed hour (0–23) in Bangkok — e.g. at 11:49 → 10. */
export function lastCompletedHour(): number {
  return (bangkokParts().h - 1 + 24) % 24;
}

/** Window of the last completed hour — e.g. at 11:49 → "10:00 – 11:00". */
export function lastHourWindow(): string {
  const h = bangkokParts().h;
  return `${pad((h - 1 + 24) % 24)}:00 – ${pad(h)}:00`;
}

/** Last 30-minute mark in Bangkok — e.g. at 11:49 → "11:30", at 11:20 → "11:00". */
export function lastHalfHour(): string {
  const { h, m } = bangkokParts();
  return `${pad(h)}:${m < 30 ? "00" : "30"}`;
}

/** "22 มิ.ย. 2569 14:05" (Bangkok time, tz-safe). */
export function thaiDateTime(input: string | Date): string {
  const d = toBangkok(typeof input === "string" ? new Date(input) : input);
  return `${d.getUTCDate()} ${TH_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear() + 543} ${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
}
