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

/** "2026-06-22" | Date → "22 มิ.ย. 2569" (Buddhist era). */
export function thaiDate(input: string | Date): string {
  const d = typeof input === "string" ? new Date(`${input}T00:00:00+07:00`) : input;
  return `${d.getDate()} ${TH_MONTHS[d.getMonth()]} ${d.getFullYear() + 543}`;
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

/** "22 มิ.ย. 2569 14:05" (server local time). */
export function thaiDateTime(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${thaiDate(d)} ${hh}:${mm}`;
}
