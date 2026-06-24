"use server";

import { revalidatePath } from "next/cache";
import {
  createStore,
  deleteStore,
  regenerateAccessCode,
  updateStore,
  type StorePatch,
} from "@/lib/data/stores";
import { logAudit } from "@/lib/data/audit";
import { requireAdmin } from "@/lib/auth/require-admin";
import { STORE_CATEGORIES, type StoreCategory } from "@/lib/mock";

function parseCategory(v: FormDataEntryValue | null): StoreCategory {
  const s = String(v ?? "");
  return (STORE_CATEGORIES as readonly string[]).includes(s)
    ? (s as StoreCategory)
    : "others";
}

function num(v: FormDataEntryValue | null): number | undefined {
  const n = parseFloat(String(v ?? ""));
  return Number.isFinite(n) ? n : undefined;
}

export async function createStoreAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const store = await createStore({
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim() || undefined,
    phone: String(formData.get("phone") ?? "").trim(),
    category: parseCategory(formData.get("category")),
    lat: num(formData.get("lat")),
    lng: num(formData.get("lng")),
  });
  await logAudit(admin.id, "store.create", "store", store.id, { name: store.name });
  revalidatePath("/admin/stores");
}

export async function updateStoreAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const patch: StorePatch = {
    name: String(formData.get("name") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    category: parseCategory(formData.get("category")),
    status: formData.get("status") === "inactive" ? "inactive" : "active",
  };
  const lat = num(formData.get("lat"));
  const lng = num(formData.get("lng"));
  if (lat !== undefined) patch.lat = lat;
  if (lng !== undefined) patch.lng = lng;
  await updateStore(id, patch);
  await logAudit(admin.id, "store.update", "store", id);
  revalidatePath("/admin/stores");
}

export async function deleteStoreAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await deleteStore(id);
  await logAudit(admin.id, "store.delete", "store", id);
  revalidatePath("/admin/stores");
}

export async function regenCodeAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  await regenerateAccessCode(id);
  await logAudit(admin.id, "store.regen_code", "store", id);
  revalidatePath("/admin/stores");
}

export async function linkLineAction(formData: FormData): Promise<void> {
  const admin = await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const lineId = String(formData.get("lineId") ?? "").trim() || null;
  await updateStore(id, { lineId });
  await logAudit(admin.id, "store.link_line", "store", id, { lineId });
  revalidatePath("/admin/stores");
}
