"use client";

import { useActionState } from "react";
import { loginAdmin, type LoginState } from "@/lib/auth/actions";

export function AdminLoginForm({
  demoEmail,
  demoPassword,
}: {
  demoEmail: string;
  demoPassword: string;
}) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAdmin,
    {},
  );

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Signage Management</h1>
        <p className="mt-1 text-sm text-zinc-500">เข้าสู่ระบบเพื่อจัดการร้านค้าและดูสถิติ</p>
      </div>

      <form action={formAction} className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-600">อีเมล</span>
          <input
            name="email"
            type="email"
            autoComplete="username"
            placeholder="you@example.com"
            className="rounded-lg border border-black/10 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-zinc-600">รหัสผ่าน</span>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="rounded-lg border border-black/10 px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-zinc-300"
          />
        </label>

        {state.error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-full bg-zinc-900 py-2.5 text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
        </button>
      </form>

      <div className="mt-4 rounded-xl border border-dashed border-amber-300 bg-amber-50 p-3 text-sm text-zinc-600">
        <span className="font-semibold text-amber-700">บัญชี Demo:</span> {demoEmail}{" "}
        / {demoPassword}
      </div>
    </div>
  );
}
