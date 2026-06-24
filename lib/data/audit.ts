import "server-only";
import { desc } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { auditLogs } from "@/lib/db/schema";
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

// Records an admin action. In mock mode there is no DB so this is a no-op
// (the audit page shows a generated sample). In real mode it inserts.
export async function logAudit(
  actorId: string,
  action: string,
  targetType?: string,
  targetId?: string,
  meta?: Record<string, unknown>,
): Promise<void> {
  if (getDataSource() === "mock") return;
  const db = getDb();
  await db.insert(auditLogs).values({ actorId, action, targetType, targetId, meta });
}

// Deterministic-ish recent sample for mock mode.
const MOCK_SEQUENCE: { action: string; target?: string; minutesAgo: number }[] = [
  { action: "login", minutesAgo: 2 },
  { action: "store.create", target: "Sunset Plaza", minutesAgo: 18 },
  { action: "store.link_line", target: "Central Court", minutesAgo: 42 },
  { action: "store.update", target: "Garden Walk", minutesAgo: 95 },
  { action: "store.regen_code", target: "Riverside Commons", minutesAgo: 140 },
  { action: "store.update", target: "Central Court", minutesAgo: 220 },
  { action: "login", minutesAgo: 300 },
  { action: "store.create", target: "Garden Walk", minutesAgo: 1500 },
  { action: "store.delete", target: "Old Kiosk", minutesAgo: 1620 },
  { action: "store.create", target: "Central Court", minutesAgo: 2880 },
  { action: "login", minutesAgo: 2890 },
];

export async function listAuditLogs(limit = 50): Promise<AuditEntry[]> {
  if (getDataSource() === "mock") {
    const now = Date.now();
    return MOCK_SEQUENCE.slice(0, limit).map((e, i) => ({
      id: `mock-audit-${i}`,
      actorName: "ผู้ดูแลระบบ (Demo)",
      action: e.action,
      target: e.target ?? null,
      createdAt: new Date(now - e.minutesAgo * 60_000),
    }));
  }
  const db = getDb();
  const rows = await db
    .select()
    .from(auditLogs)
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit);
  return rows.map((r) => ({
    id: r.id,
    actorName: r.actorId ?? "system",
    action: r.action,
    target: r.targetId,
    createdAt: r.createdAt,
  }));
}
