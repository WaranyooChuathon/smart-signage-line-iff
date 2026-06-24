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

/** Current hour of day in Bangkok (0–23). */
export function currentBangkokHour(): number {
  return new Date(Date.now() + 7 * 3600_000).getUTCHours();
}

/** "22 มิ.ย. 2569 14:05" (server local time). */
export function thaiDateTime(input: string | Date): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${thaiDate(d)} ${hh}:${mm}`;
}
