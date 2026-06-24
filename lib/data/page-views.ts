import "server-only";
import { count } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { liffPageViews, LIFF_PAGES } from "@/lib/db/schema";
import { makeRng } from "@/lib/mock";
import { getDataSource } from "./index";

export type LiffPage = (typeof LIFF_PAGES)[number];

export const PAGE_LABELS: Record<LiffPage, string> = {
  dashboard: "Dashboard (สรุป)",
  area: "Area Count",
  "store-visits": "Store Visits",
  flow: "Flow",
  content: "Content Count",
  verify: "ยืนยันตัวตน",
};

export interface PageViewStat {
  page: LiffPage;
  label: string;
  views: number;
}

// Records a LIFF page visit. No-op in mock mode (analytics shows generated
// stats); inserts a row in real mode.
export async function logPageView(
  storeId: string,
  page: LiffPage,
  lineUserId?: string,
): Promise<void> {
  if (getDataSource() === "mock") return;
  const db = getDb();
  await db.insert(liffPageViews).values({ storeId, page, lineUserId });
}

export async function getPageViewStats(): Promise<PageViewStat[]> {
  if (getDataSource() === "mock") {
    // Deterministic per-page totals; dashboard busiest, verify lowest.
    const weights: Record<LiffPage, number> = {
      dashboard: 1,
      area: 0.72,
      "store-visits": 0.64,
      flow: 0.48,
      content: 0.55,
      verify: 0.3,
    };
    const rng = makeRng("pageviews-demo");
    const base = rng.int(900, 1300);
    return LIFF_PAGES.map((page) => ({
      page,
      label: PAGE_LABELS[page],
      views: Math.round(base * weights[page] * rng.float(0.9, 1.1)),
    })).sort((a, b) => b.views - a.views);
  }

  const db = getDb();
  const rows = await db
    .select({ page: liffPageViews.page, views: count() })
    .from(liffPageViews)
    .groupBy(liffPageViews.page);
  const map = new Map(rows.map((r) => [r.page, Number(r.views)]));
  return LIFF_PAGES.map((page) => ({
    page,
    label: PAGE_LABELS[page],
    views: map.get(page) ?? 0,
  })).sort((a, b) => b.views - a.views);
}
