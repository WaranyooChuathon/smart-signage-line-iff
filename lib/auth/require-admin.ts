import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getAdminById, type Admin } from "@/lib/data/admins";
import { getAdminSession } from "./session";

export const getCurrentAdmin = cache(async (): Promise<Admin | null> => {
  const id = await getAdminSession();
  if (!id) return null;
  return getAdminById(id);
});

export async function requireAdmin(): Promise<Admin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
