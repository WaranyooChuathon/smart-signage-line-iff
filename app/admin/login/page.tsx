import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/login-form";
import { getCurrentAdmin } from "@/lib/auth/require-admin";
import { DEMO_ADMIN } from "@/lib/mock/admins";

export default async function AdminLoginPage() {
  // already signed in → skip the login form (e.g. pressing browser Back)
  if (await getCurrentAdmin()) redirect("/admin/stores");

  return (
    <div className="relative flex flex-1 items-center justify-center px-6 py-12">
      <Link
        href="/"
        className="absolute left-5 top-5 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white px-3.5 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-black/5"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        กลับหน้าหลัก
      </Link>

      <AdminLoginForm demoEmail={DEMO_ADMIN.email} demoPassword={DEMO_ADMIN.password} />
    </div>
  );
}
