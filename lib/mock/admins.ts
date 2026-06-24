// Demo admin for mock mode (company-safe, intentionally public credentials).
// In real mode admins live in the D1 `admin_users` table with hashed passwords.
export const DEMO_ADMIN = {
  id: "demo-admin",
  email: "admin@demo.local",
  name: "ผู้ดูแลระบบ (Demo)",
  password: "demo1234",
  role: "admin",
} as const;
