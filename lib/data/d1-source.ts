import { and, eq, gte, lte } from "drizzle-orm";
import * as schema from "@/lib/db/schema";
import { getDb } from "@/lib/db/client";
import {
  generateDaySnapshot,
  type AreaReading,
  type ContentSnapshot,
  type FlowSnapshot,
} from "@/lib/mock";
import type { SignageDataSource, StoreVisitsStat } from "./source";

// When D1 has no row for a (store, date) — e.g. the daily seed hasn't run for
// "today" yet, or a newly created store — fall back to the deterministic
// generator so pages always render instead of 500ing. Seeded D1 data wins.

function dayRange(date: string): [Date, Date] {
  return [
    new Date(`${date}T00:00:00+07:00`),
    new Date(`${date}T23:59:59+07:00`),
  ];
}

export const d1Source: SignageDataSource = {
  async getDailySummary(storeId, date) {
    const db = getDb();
    const [row] = await db
      .select()
      .from(schema.dailyMetrics)
      .where(
        and(
          eq(schema.dailyMetrics.storeId, storeId),
          eq(schema.dailyMetrics.date, date),
        ),
      )
      .limit(1);
    if (!row) return generateDaySnapshot(storeId, date).daily;
    return {
      district: row.district,
      area: row.area,
      storeVisits: row.storeVisits,
    };
  },

  async getAreaReadings(storeId, date): Promise<AreaReading[]> {
    const db = getDb();
    const [start, end] = dayRange(date);
    const rows = await db
      .select()
      .from(schema.areaReadings)
      .where(
        and(
          eq(schema.areaReadings.storeId, storeId),
          gte(schema.areaReadings.ts, start),
          lte(schema.areaReadings.ts, end),
        ),
      );
    if (rows.length === 0) return generateDaySnapshot(storeId, date).areaReadings;
    return rows.map((r) => ({
      hour: (r.ts.getUTCHours() + 7) % 24,
      ts: r.ts,
      areaCount: r.areaCount,
      temp: r.temp ?? 0,
      humidity: r.humidity ?? 0,
      pressure: r.pressure ?? 0,
    }));
  },

  async getStoreVisits(storeId, date): Promise<StoreVisitsStat> {
    const { area, storeVisits } = await this.getDailySummary(storeId, date);
    return { area, storeVisits, captureRate: area === 0 ? 0 : storeVisits / area };
  },

  async getFlow(storeId, date): Promise<FlowSnapshot> {
    const db = getDb();
    const [parent] = await db
      .select()
      .from(schema.flowDaily)
      .where(
        and(
          eq(schema.flowDaily.storeId, storeId),
          eq(schema.flowDaily.date, date),
        ),
      )
      .limit(1);
    if (!parent) return generateDaySnapshot(storeId, date).flow;
    const cats = await db
      .select()
      .from(schema.flowCategories)
      .where(eq(schema.flowCategories.flowDailyId, parent.id));
    return {
      inbound: parent.inbound,
      internal: parent.internal,
      outbound: parent.outbound,
      categories: cats.map((c) => ({
        direction: c.direction,
        category: c.category,
        value: c.value,
      })),
    };
  },

  async getContent(storeId, date): Promise<ContentSnapshot> {
    const db = getDb();
    const [parent] = await db
      .select()
      .from(schema.contentDaily)
      .where(
        and(
          eq(schema.contentDaily.storeId, storeId),
          eq(schema.contentDaily.date, date),
        ),
      )
      .limit(1);
    if (!parent) return generateDaySnapshot(storeId, date).content;
    const [breakdown, ads] = await Promise.all([
      db
        .select()
        .from(schema.contentBreakdown)
        .where(eq(schema.contentBreakdown.contentDailyId, parent.id)),
      db
        .select()
        .from(schema.adPlays)
        .where(eq(schema.adPlays.contentDailyId, parent.id)),
    ]);
    return {
      totalPlays: parent.totalPlays,
      breakdown: breakdown.map((b) => ({
        dimension: b.dimension,
        key: b.key,
        value: b.value,
      })),
      ads: ads
        .map((a) => ({ adName: a.adName, plays: a.plays }))
        .sort((x, y) => y.plays - x.plays),
    };
  },
};
