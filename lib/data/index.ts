// Data layer entry — every page/API reads through here (never D1 directly).
// env-toggle: DATA_SOURCE=real -> query D1 / otherwise -> mock generator.
import { mockSource } from "./mock-source";
import { d1Source } from "./d1-source";
import type { SignageDataSource } from "./source";

export type DataSource = "real" | "mock";
export type { SignageDataSource, StoreVisitsStat } from "./source";

export function getDataSource(): DataSource {
  return process.env.DATA_SOURCE === "real" ? "real" : "mock";
}

export const isMock = () => getDataSource() === "mock";

export function getSource(): SignageDataSource {
  return getDataSource() === "real" ? d1Source : mockSource;
}

// ── Date helpers (Asia/Bangkok, UTC+7) ───────────────────────────────
function bangkokDate(d: Date): string {
  return new Date(d.getTime() + 7 * 3600 * 1000).toISOString().slice(0, 10);
}

/** Today in Bangkok, YYYY-MM-DD. */
export const getToday = () => bangkokDate(new Date());

/** Yesterday in Bangkok, YYYY-MM-DD — the default window for the Dashboard. */
export const getYesterday = () => bangkokDate(new Date(Date.now() - 86_400_000));
