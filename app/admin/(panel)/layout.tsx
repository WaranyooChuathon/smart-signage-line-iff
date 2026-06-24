import { AdminNav } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/auth/require-admin";

// Authenticated admin shell: redirects to /admin/login when not signed in.
export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await requireAdmin();
  return (
    <>
      <AdminNav adminName={admin.name} />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-6">{children}</main>
    </>
  );
}
