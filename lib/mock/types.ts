// Shared shapes for a single store's single-day snapshot.
// These mirror the D1 tables so mock and real paths return identical shapes.

export const FLOW_CATEGORIES = [
  "Cafe & Restaurant",
  "Retail",
  "Service",
  "Entertainment",
  "Others",
] as const;

export const GENDER_KEYS = ["male", "female"] as const;
export const AGE_KEYS = ["adult", "female-specific", "elderly", "child"] as const;

export const STORE_CATEGORIES = [
  "cafe",
  "retail",
  "service",
  "entertainment",
  "others",
] as const;

export type StoreCategory = (typeof STORE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<StoreCategory, string> = {
  cafe: "ร้านอาหาร / คาเฟ่",
  retail: "ค้าปลีก",
  service: "บริการ",
  entertainment: "บันเทิง",
  others: "อื่นๆ",
};

export interface DailyMetric {
  district: number;
  area: number;
  storeVisits: number;
}

export interface AreaReading {
  /** hour of day, 0–23 */
  hour: number;
  ts: Date;
  areaCount: number;
  temp: number;
  humidity: number;
  pressure: number;
}

export interface FlowCategory {
  direction: "inbound" | "outbound";
  category: string;
  value: number;
}

export interface FlowSnapshot {
  inbound: number;
  internal: number;
  outbound: number;
  categories: FlowCategory[];
}

export interface ContentBreakdownItem {
  dimension: "gender" | "age";
  key: string;
  value: number;
}

export interface AdPlay {
  adName: string;
  plays: number;
}

export interface ContentSnapshot {
  totalPlays: number;
  breakdown: ContentBreakdownItem[];
  ads: AdPlay[];
}

export interface DaySnapshot {
  storeId: string;
  date: string; // YYYY-MM-DD
  daily: DailyMetric;
  areaReadings: AreaReading[];
  flow: FlowSnapshot;
  content: ContentSnapshot;
}
