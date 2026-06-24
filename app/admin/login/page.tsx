import { AdminLoginForm } from "@/components/admin/login-form";
import { DEMO_ADMIN } from "@/lib/mock/admins";

export default function AdminLoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-12">
      <AdminLoginForm demoEmail={DEMO_ADMIN.email} demoPassword={DEMO_ADMIN.password} />
    </div>
  );
}
