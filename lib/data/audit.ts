import "server-only";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { adminUsers, auditLogs, stores } from "@/lib/db/schema";
import { getDataSource } from "./index";

export const ACTION_LABELS: Record<string, string> = {
  login: "เข้าสู่ระบบ",
  logout: "ออกจากระบบ",
  "store.create": "สร้างร้าน",
  "store.update": "แก้ไขร้าน",
  "store.delete": "ลบร้าน",
  "store.regen_code": "สุ่มรหัสใหม่",
  "store.link_line": "ลิงก์ LINE",
};

export interface AuditEntry {
  id: string;
  actorName: string;
  action: string;
  target?: string | null;
  createdAt: Date;
}

// In-memory audit trail for mock mode (no DB). Kept on globalThis so it
// survives across requests within a dev process — actions you perform in the
// demo show up immediately. The deployed demo runs real mode (D1).
const g = globalThis as unknown as { __mockAudit?: AuditEntry[] };
g.__mockAudit ??= [];

export async function logAudit(
  actorId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  meta?: Record<string, unknown>,
): Promise<void> {
  if (getDataSource() === "mock") {
    g.__mockAudit!.unshift({
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      actorName: "ผู้ดูแลระบบ (Demo)",
      action,
      target: (meta?.name as string) ?? targetId ?? null,
      createdAt: new Date(),
    });
    return;
  }
  const db = getDb();
  await db.insert(auditLogs).values({ actorId, action, targetType, targetId, meta });
}

// Static seed sample so the mock audit page never looks empty on first load.
const MOCK_SAMPLE: { action: string; target?: string; minutesAgo: number }[] = [
  { action: "login", minutesAgo: 8 },
  { action: "store.create", target: "Sunset Plaza", minutesAgo: 26 },
  { action: "store.link_line", target: "Central Court", minutesAgo: 52 },
  { action: "store.update", target: "Garden Walk", minutesAgo: 95 },
  { action: "store.regen_code", target: "Riverside Commons", minutesAgo: 140 },
  { action: "store.update", target: "Central Court", minutesAgo: 220 },
  { action: "login", minutesAgo: 300 },
  { action: "store.create", target: "Garden Walk", minutesAgo: 1500 },
  { action: "store.delete", target: "Old Kiosk", minutesAgo: 1620 },
  { action: "login", minutesAgo: 2890 },
];

export async function listAuditLogs(limit = 50): Promise<AuditEntry[]> {
  if (getDataSource() === "mock") {
    const now = Date.now();
    const sample: AuditEntry[] = MOCK_SAMPLE.map((e, i) => ({
      id: `mock-audit-${i}`,
      actorName: "ผู้ดูแลระบบ (Demo)",
      action: e.action,
      target: e.target ?? null,
      createdAt: new Date(now - e.minutesAgo * 60_000),
    }));
    // this session's real actions first, then the static sample
    return [...g.__mockAudit!, ...sample].slice(0, limit);
  }

  const db = getDb();
  const rows = await db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      createdAt: auditLogs.createdAt,
      actorId: auditLogs.actorId,
      actorName: adminUsers.name,
      targetId: auditLogs.targetId,
      storeName: stores.name,
      meta: auditLogs.meta,
    })
    .from(auditLogs)
    .leftJoin(adminUsers, eq(auditLogs.actorId, adminUsers.id))
    .leftJoin(stores, eq(auditLogs.targetId, stores.id))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    actorName: r.actorName ?? r.actorId ?? "system",
    action: r.action,
    target:
      r.storeName ??
      ((r.meta as { name?: string } | null)?.name ?? r.targetId ?? null),
    createdAt: r.createdAt,
  }));
}
