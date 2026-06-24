import { DEMO_STORES, type DemoStore } from "./stores";
import type { StoreCategory } from "./types";

export interface MockStore extends DemoStore {
  lineId: string | null;
  status: "active" | "inactive";
}

export interface StoreInput {
  name: string;
  email?: string;
  phone: string;
  category: StoreCategory;
  lat?: number;
  lng?: number;
}

// In-memory store registry for mock mode. Kept on globalThis so every route
// bundle in a single dev process shares one instance (admin CRUD is then
// visible to the LIFF verify flow). The deployed demo runs in real mode (D1),
// where this is not used.
const g = globalThis as unknown as { __mockStoreRepo?: MockStore[] };
g.__mockStoreRepo ??= DEMO_STORES.map((s) => ({ ...s, lineId: null, status: "active" }));

function repoRef(): MockStore[] {
  return g.__mockStoreRepo!;
}

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function genAccessCode(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
}

export function listMockStores(): MockStore[] {
  return repoRef();
}

export function getMockStore(id: string): MockStore | null {
  return repoRef().find((s) => s.id === id) ?? null;
}

export function findMockStore(phone: string, code: string): MockStore | null {
  return (
    repoRef().find(
      (s) => s.phone === phone && s.accessCode === code && s.status === "active",
    ) ?? null
  );
}

export function createMockStore(input: StoreInput): MockStore {
  const store: MockStore = {
    id: `store-${crypto.randomUUID().slice(0, 8)}`,
    name: input.name,
    subtitle: "",
    email: input.email ?? "",
    phone: input.phone,
    accessCode: genAccessCode(),
    category: input.category,
    lat: input.lat ?? 0,
    lng: input.lng ?? 0,
    lineId: null,
    status: "active",
  };
  g.__mockStoreRepo = [store, ...repoRef()];
  return store;
}

export function updateMockStore(
  id: string,
  patch: Partial<MockStore>,
): MockStore | null {
  g.__mockStoreRepo = repoRef().map((s) => (s.id === id ? { ...s, ...patch } : s));
  return getMockStore(id);
}

export function deleteMockStore(id: string): void {
  g.__mockStoreRepo = repoRef().filter((s) => s.id !== id);
}
