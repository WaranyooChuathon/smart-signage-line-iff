"use client";

import Link from "next/link";
import { useActionState, useRef } from "react";
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

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const fillDemo = () => {
    if (emailRef.current) emailRef.current.value = demoEmail;
    if (passwordRef.current) passwordRef.current.value = demoPassword;
    emailRef.current?.focus();
  };

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
            ref={emailRef}
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
            ref={passwordRef}
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

      {/* Demo credentials — prominent */}
      <div className="mt-4 rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="rounded-full bg-amber-400 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-amber-900">
            Demo
          </span>
          <span className="text-sm font-semibold text-amber-800">บัญชีสำหรับทดลอง</span>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-zinc-500">อีเมล</dt>
            <dd className="font-mono-num font-bold text-zinc-900 select-all">{demoEmail}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="text-zinc-500">รหัสผ่าน</dt>
            <dd className="font-mono-num font-bold text-zinc-900 select-all">{demoPassword}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={fillDemo}
          className="mt-3 w-full rounded-full border border-amber-400 bg-white py-2 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100"
        >
          กรอกบัญชี demo ให้อัตโนมัติ
        </button>
      </div>

      <div className="mt-4 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          กลับหน้าจอหลัก
        </Link>
      </div>
    </div>
  );
}
