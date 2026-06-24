import { cache } from "react";
import { redirect } from "next/navigation";
import { getStoreById, type Store } from "@/lib/data/stores";
import { getStoreSession } from "./session";

// cache() dedupes the lookup within a single request, so the LIFF layout and
// the page can both call requireStore() without hitting the source twice.
export const getCurrentStore = cache(async (): Promise<Store | null> => {
  const id = await getStoreSession();
  if (!id) return null;
  return getStoreById(id);
});

export async function requireStore(): Promise<Store> {
  const store = await getCurrentStore();
  if (!store) redirect("/verify");
  return store;
}
