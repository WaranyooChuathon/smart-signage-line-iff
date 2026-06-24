import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db/client";
import * as schema from "@/lib/db/schema";
import { getToday, getYesterday } from "@/lib/data";
import { hashPassword } from "@/lib/auth/password";
import { DEMO_ADMIN } from "@/lib/mock/admins";
import { DEMO_STORES } from "@/lib/mock";
import { generateDaySnapshot } from "@/lib/mock";

export const dynamic = "force-dynamic";

function authorized(req: Request): boolean {
  const secret = process.env.AUTH_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-seed-secret");
  const query = new URL(req.url).searchParams.get("key");
  return header === secret || query === secret;
}

function dayRange(date: string): [Date, Date] {
  return [new Date(`${date}T00:00:00+07:00`), new Date(`${date}T23:59:59+07:00`)];
}

type DB = ReturnType<typeof getDb>;

async function seedStoreDate(db: DB, storeId: string, date: string) {
  const snap = generateDaySnapshot(storeId, date);

  // daily_metrics
  await db
    .delete(schema.dailyMetrics)
    .where(and(eq(schema.dailyMetrics.storeId, storeId), eq(schema.dailyMetrics.date, date)));
  await db.insert(schema.dailyMetrics).values({
    storeId,
    date,
    district: snap.daily.district,
    area: snap.daily.area,
    storeVisits: snap.daily.storeVisits,
  });

  // area_readings (24 hourly)
  const [start, end] = dayRange(date);
  await db
    .delete(schema.areaReadings)
    .where(
      and(
        eq(schema.areaReadings.storeId, storeId),
        gte(schema.areaReadings.ts, start),
        lte(schema.areaReadings.ts, end),
      ),
    );
  const areaRows = snap.areaReadings.map((r) => ({
    storeId,
    ts: r.ts,
    areaCount: r.areaCount,
    temp: r.temp,
    humidity: r.humidity,
    pressure: r.pressure,
  }));
  // D1 allows max 100 bound params per query; 7 cols → chunk by 12 rows (84).
  for (let i = 0; i < areaRows.length; i += 12) {
    await db.insert(schema.areaReadings).values(areaRows.slice(i, i + 12));
  }

  // flow_daily (+ categories) — clean children explicitly (no reliance on cascade)
  const oldFlow = await db
    .select({ id: schema.flowDaily.id })
    .from(schema.flowDaily)
    .where(and(eq(schema.flowDaily.storeId, storeId), eq(schema.flowDaily.date, date)));
  if (oldFlow.length) {
    const ids = oldFlow.map((f) => f.id);
    await db.delete(schema.flowCategories).where(inArray(schema.flowCategories.flowDailyId, ids));
    await db.delete(schema.flowDaily).where(inArray(schema.flowDaily.id, ids));
  }
  const [flow] = await db
    .insert(schema.flowDaily)
    .values({ storeId, date, inbound: snap.flow.inbound, internal: snap.flow.internal, outbound: snap.flow.outbound })
    .returning();
  await db
    .insert(schema.flowCategories)
    .values(snap.flow.categories.map((c) => ({ flowDailyId: flow.id, direction: c.direction, category: c.category, value: c.value })));

  // content_daily (+ breakdown + ad plays)
  const oldContent = await db
    .select({ id: schema.contentDaily.id })
    .from(schema.contentDaily)
    .where(and(eq(schema.contentDaily.storeId, storeId), eq(schema.contentDaily.date, date)));
  if (oldContent.length) {
    const ids = oldContent.map((c) => c.id);
    await db.delete(schema.contentBreakdown).where(inArray(schema.contentBreakdown.contentDailyId, ids));
    await db.delete(schema.adPlays).where(inArray(schema.adPlays.contentDailyId, ids));
    await db.delete(schema.contentDaily).where(inArray(schema.contentDaily.id, ids));
  }
  const [content] = await db
    .insert(schema.contentDaily)
    .values({ storeId, date, totalPlays: snap.content.totalPlays })
    .returning();
  await db
    .insert(schema.contentBreakdown)
    .values(snap.content.breakdown.map((b) => ({ contentDailyId: content.id, dimension: b.dimension, key: b.key, value: b.value })));
  await db
    .insert(schema.adPlays)
    .values(snap.content.ads.map((a) => ({ contentDailyId: content.id, adName: a.adName, plays: a.plays })));
}

async function runSeed() {
  const db = getDb();

  // 1) demo admin (hashed password)
  await db
    .insert(schema.adminUsers)
    .values({
      id: DEMO_ADMIN.id,
      email: DEMO_ADMIN.email,
      name: DEMO_ADMIN.name,
      role: DEMO_ADMIN.role,
      passwordHash: await hashPassword(DEMO_ADMIN.password),
    })
    .onConflictDoNothing();

  // 2) demo stores
  for (const s of DEMO_STORES) {
    await db
      .insert(schema.stores)
      .values({
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone,
        lat: s.lat,
        lng: s.lng,
        category: s.category,
        accessCode: s.accessCode,
        status: "active",
      })
      .onConflictDoNothing();
  }

  // 3) metrics for every active store — yesterday + today
  const stores = await db
    .select({ id: schema.stores.id })
    .from(schema.stores)
    .where(eq(schema.stores.status, "active"));
  const dates = [getYesterday(), getToday()];
  for (const { id } of stores) {
    for (const date of dates) await seedStoreDate(db, id, date);
  }

  return { stores: stores.length, dates };
}

export async function POST(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  try {
    const result = await runSeed();
    return NextResponse.json({ ok: true, ...result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}

// allow GET with ?key= for easy manual/cron trigger
export const GET = POST;
