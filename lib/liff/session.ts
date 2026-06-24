import { cookies } from "next/headers";

const STORE_COOKIE = "liff_store";

// Demo-grade store context: the verified store id is kept in an httpOnly
// cookie. Data is all mock/fake, so this is intentionally lightweight.
export async function setStoreSession(storeId: string): Promise<void> {
  const jar = await cookies();
  jar.set(STORE_COOKIE, storeId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getStoreSession(): Promise<string | null> {
  const jar = await cookies();
  return jar.get(STORE_COOKIE)?.value ?? null;
}

export async function clearStoreSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(STORE_COOKIE);
}
