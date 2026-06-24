import {
  sqliteTable,
  text,
  integer,
  real,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { STORE_CATEGORIES } from "../mock";

// Helpers ────────────────────────────────────────────────────────────
const id = () =>
  text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID());

const createdAt = () =>
  integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date());

export const LIFF_PAGES = [
  "dashboard",
  "area",
  "store-visits",
  "flow",
  "content",
  "verify",
] as const;

// ── Identity / back-office ───────────────────────────────────────────

export const adminUsers = sqliteTable("admin_users", {
  id: id(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("admin"),
  createdAt: createdAt(),
});

export const stores = sqliteTable(
  "stores",
  {
    id: id(),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone").notNull(),
    lat: real("lat"),
    lng: real("lng"),
    category: text("category", { enum: STORE_CATEGORIES }).notNull(),
    lineId: text("line_id"),
    accessCode: text("access_code").notNull(),
    status: text("status", { enum: ["active", "inactive"] })
      .notNull()
      .default("active"),
    createdAt: createdAt(),
  },
  (t) => [
    // verify flow matches on phone + access_code
    index("stores_phone_idx").on(t.phone),
    uniqueIndex("stores_line_id_idx").on(t.lineId),
  ],
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: id(),
    actorId: text("actor_id").references(() => adminUsers.id),
    action: text("action").notNull(),
    targetType: text("target_type"),
    targetId: text("target_id"),
    meta: text("meta", { mode: "json" }).$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (t) => [index("audit_logs_created_at_idx").on(t.createdAt)],
);

export const liffPageViews = sqliteTable(
  "liff_page_views",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id),
    lineUserId: text("line_user_id"),
    page: text("page", { enum: LIFF_PAGES }).notNull(),
    viewedAt: integer("viewed_at", { mode: "timestamp" })
      .notNull()
      .$defaultFn(() => new Date()),
  },
  (t) => [
    index("liff_page_views_store_idx").on(t.storeId),
    index("liff_page_views_page_idx").on(t.page),
  ],
);

// ── Daily metric snapshots (seeded per store per day) ────────────────

export const dailyMetrics = sqliteTable(
  "daily_metrics",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id),
    date: text("date").notNull(), // YYYY-MM-DD
    district: integer("district").notNull(),
    area: integer("area").notNull(),
    storeVisits: integer("store_visits").notNull(),
  },
  (t) => [uniqueIndex("daily_metrics_store_date_idx").on(t.storeId, t.date)],
);

export const areaReadings = sqliteTable(
  "area_readings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id),
    ts: integer("ts", { mode: "timestamp" }).notNull(), // top of the hour
    areaCount: integer("area_count").notNull(),
    temp: real("temp"),
    humidity: real("humidity"),
    pressure: real("pressure"),
  },
  (t) => [uniqueIndex("area_readings_store_ts_idx").on(t.storeId, t.ts)],
);

export const flowDaily = sqliteTable(
  "flow_daily",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id),
    date: text("date").notNull(),
    inbound: integer("inbound").notNull(),
    internal: integer("internal").notNull(),
    outbound: integer("outbound").notNull(),
  },
  (t) => [uniqueIndex("flow_daily_store_date_idx").on(t.storeId, t.date)],
);

export const flowCategories = sqliteTable(
  "flow_categories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    flowDailyId: integer("flow_daily_id")
      .notNull()
      .references(() => flowDaily.id, { onDelete: "cascade" }),
    direction: text("direction", { enum: ["inbound", "outbound"] }).notNull(),
    category: text("category").notNull(),
    value: integer("value").notNull(),
  },
  (t) => [index("flow_categories_parent_idx").on(t.flowDailyId)],
);

export const contentDaily = sqliteTable(
  "content_daily",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storeId: text("store_id")
      .notNull()
      .references(() => stores.id),
    date: text("date").notNull(),
    totalPlays: integer("total_plays").notNull(),
  },
  (t) => [uniqueIndex("content_daily_store_date_idx").on(t.storeId, t.date)],
);

export const contentBreakdown = sqliteTable(
  "content_breakdown",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    contentDailyId: integer("content_daily_id")
      .notNull()
      .references(() => contentDaily.id, { onDelete: "cascade" }),
    dimension: text("dimension", { enum: ["gender", "age"] }).notNull(),
    key: text("key").notNull(), // male/female | adult/child/elderly/female-specific
    value: integer("value").notNull(),
  },
  (t) => [index("content_breakdown_parent_idx").on(t.contentDailyId)],
);

export const adPlays = sqliteTable(
  "ad_plays",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    contentDailyId: integer("content_daily_id")
      .notNull()
      .references(() => contentDaily.id, { onDelete: "cascade" }),
    adName: text("ad_name").notNull(),
    plays: integer("plays").notNull(),
  },
  (t) => [index("ad_plays_parent_idx").on(t.contentDailyId)],
);
