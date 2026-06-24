"use server";

import { redirect } from "next/navigation";
import { verifyAdminCredentials } from "@/lib/data/admins";
import { logAudit } from "@/lib/data/audit";
import { getCurrentAdmin } from "./require-admin";
import { clearAdminSession, setAdminSession } from "./session";

export interface LoginState {
  error?: string;
}

export async function loginAdmin(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่าน" };
  }

  const admin = await verifyAdminCredentials(email, password);
  if (!admin) {
    return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
  }

  await setAdminSession(admin.id);
  await logAudit(admin.id, "login");
  redirect("/admin/stores");
}

export async function logoutAdmin(): Promise<void> {
  const admin = await getCurrentAdmin();
  if (admin) await logAudit(admin.id, "logout");
  await clearAdminSession();
  redirect("/admin/login");
}
