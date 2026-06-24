import "server-only";
import { eq } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { adminUsers } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/auth/password";
import { DEMO_ADMIN } from "@/lib/mock/admins";
import { getDataSource } from "./index";

export interface Admin {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function verifyAdminCredentials(
  email: string,
  password: string,
): Promise<Admin | null> {
  if (getDataSource() === "mock") {
    if (email === DEMO_ADMIN.email && password === DEMO_ADMIN.password) {
      return { id: DEMO_ADMIN.id, email: DEMO_ADMIN.email, name: DEMO_ADMIN.name, role: DEMO_ADMIN.role };
    }
    return null;
  }
  const db = getDb();
  const [row] = await db
    .select()
    .from(adminUsers)
    .where(eq(adminUsers.email, email))
    .limit(1);
  if (!row) return null;
  const ok = await verifyPassword(password, row.passwordHash);
  return ok ? { id: row.id, email: row.email, name: row.name, role: row.role } : null;
}

export async function getAdminById(id: string): Promise<Admin | null> {
  if (getDataSource() === "mock") {
    return id === DEMO_ADMIN.id
      ? { id: DEMO_ADMIN.id, email: DEMO_ADMIN.email, name: DEMO_ADMIN.name, role: DEMO_ADMIN.role }
      : null;
  }
  const db = getDb();
  const [row] = await db.select().from(adminUsers).where(eq(adminUsers.id, id)).limit(1);
  return row ? { id: row.id, email: row.email, name: row.name, role: row.role } : null;
}
