import "server-only";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import * as schema from "@/lib/db/schema";
import { DEFAULT_DEMO_STORE, type StoreCategory } from "@/lib/mock";
import {
  createMockStore,
  deleteMockStore,
  findMockStore,
  genAccessCode,
  getMockStore,
  listMockStores,
  updateMockStore,
  type MockStore,
  type StoreInput,
} from "@/lib/mock/store-repo";
import { getDataSource } from "./index";

export type { StoreInput };

export interface Store {
  id: string;
  name: string;
  subtitle?: string;
  email?: string | null;
  phone: string;
  accessCode: string;
  category: StoreCategory;
  lineId?: string | null;
  status: "active" | "inactive";
  lat?: number | null;
  lng?: number | null;
}

function fromMock(s: MockStore): Store {
  return {
    id: s.id,
    name: s.name,
    subtitle: s.subtitle,
    email: s.email,
    phone: s.phone,
    accessCode: s.accessCode,
    category: s.category,
    lineId: s.lineId,
    status: s.status,
    lat: s.lat,
    lng: s.lng,
  };
}

const isMockMode = () => getDataSource() === "mock";

// ── LIFF-facing lookups ──────────────────────────────────────────────

/** Stable demo store for the one-click bypass (not whatever was created last). */
export function getDemoStore(): Store {
  const repo = listMockStores();
  const demo = repo.find((s) => s.id === DEFAULT_DEMO_STORE.id) ?? repo[0];
  return fromMock(demo);
}

export async function getStoreByPhoneCode(
  phone: string,
  code: string,
): Promise<Store | null> {
  if (isMockMode()) {
    const found = findMockStore(phone, code);
    return found ? fromMock(found) : null;
  }
  const db = getDb();
  const [row] = await db
    .select()
    .from(schema.stores)
    .where(and(eq(schema.stores.phone, phone), eq(schema.stores.accessCode, code)))
    .limit(1);
  return row && row.status === "active" ? (row as Store) : null;
}

export async function getStoreById(id: string): Promise<Store | null> {
  if (isMockMode()) {
    const found = getMockStore(id);
    return found ? fromMock(found) : null;
  }
  const db = getDb();
  const [row] = await db.select().from(schema.stores).where(eq(schema.stores.id, id)).limit(1);
  return row ? (row as Store) : null;
}

// ── Admin CRUD ───────────────────────────────────────────────────────

export async function listStores(): Promise<Store[]> {
  if (isMockMode()) return listMockStores().map(fromMock);
  const db = getDb();
  const rows = await db.select().from(schema.stores).orderBy(desc(schema.stores.createdAt));
  return rows as Store[];
}

export async function createStore(input: StoreInput): Promise<Store> {
  if (isMockMode()) return fromMock(createMockStore(input));
  const db = getDb();
  const [row] = await db
    .insert(schema.stores)
    .values({ ...input, accessCode: genAccessCode() })
    .returning();
  return row as Store;
}

export type StorePatch = Partial<{
  name: string;
  email: string;
  phone: string;
  category: StoreCategory;
  lat: number;
  lng: number;
  status: "active" | "inactive";
  lineId: string | null;
}>;

export async function updateStore(id: string, patch: StorePatch): Promise<Store | null> {
  if (isMockMode()) {
    const updated = updateMockStore(id, patch);
    return updated ? fromMock(updated) : null;
  }
  const db = getDb();
  const [row] = await db.update(schema.stores).set(patch).where(eq(schema.stores.id, id)).returning();
  return row ? (row as Store) : null;
}

export async function deleteStore(id: string): Promise<void> {
  if (isMockMode()) {
    deleteMockStore(id);
    return;
  }
  const db = getDb();
  await db.delete(schema.stores).where(eq(schema.stores.id, id));
}

export async function regenerateAccessCode(id: string): Promise<Store | null> {
  const code = genAccessCode();
  if (isMockMode()) {
    const updated = updateMockStore(id, { accessCode: code });
    return updated ? fromMock(updated) : null;
  }
  const db = getDb();
  const [row] = await db
    .update(schema.stores)
    .set({ accessCode: code })
    .where(eq(schema.stores.id, id))
    .returning();
  return row ? (row as Store) : null;
}
