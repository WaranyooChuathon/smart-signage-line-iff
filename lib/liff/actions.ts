"use server";

import { redirect } from "next/navigation";
import { getDemoStore, getStoreByPhoneCode } from "@/lib/data/stores";
import { setStoreSession, clearStoreSession } from "./session";

export interface VerifyState {
  error?: string;
}

export async function verifyStore(
  _prev: VerifyState,
  formData: FormData,
): Promise<VerifyState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const code = String(formData.get("code") ?? "")
    .trim()
    .toUpperCase();

  if (!phone || !code) {
    return { error: "กรุณากรอกเบอร์โทรและรหัสเข้าใช้งาน" };
  }

  const store = await getStoreByPhoneCode(phone, code);
  if (!store) {
    return { error: "เบอร์โทรหรือรหัสไม่ถูกต้อง" };
  }

  await setStoreSession(store.id);
  redirect("/dashboard");
}

export async function enterDemo(): Promise<void> {
  await setStoreSession(getDemoStore().id);
  redirect("/dashboard");
}

export async function exitStore(): Promise<void> {
  await clearStoreSession();
  redirect("/verify");
}
