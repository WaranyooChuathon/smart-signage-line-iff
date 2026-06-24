"use client";

import { useActionState } from "react";
import { enterDemo, verifyStore, type VerifyState } from "@/lib/liff/actions";

export function VerifyForm({
  demoPhone,
  demoCode,
  demoName,
}: {
  demoPhone: string;
  demoCode: string;
  demoName: string;
}) {
  const [state, formAction, pending] = useActionState<VerifyState, FormData>(
    verifyStore,
    {},
  );

  return (
    <div className="flex min-h-[100dvh] flex-col justify-center gap-6 px-6 py-10">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">ยืนยันร้านค้า</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          กรอกเบอร์โทรร้านและรหัสที่ได้รับจากผู้ดูแลระบบ
        </p>
      </div>

      <form action={formAction} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>
            เบอร์โทรร้าน
          </span>
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="off"
            placeholder="08xxxxxxxx"
            className="rounded-xl border bg-white px-4 py-3 text-base outline-none focus:ring-2"
            style={{ borderColor: "var(--border)" }}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-xs font-semibold" style={{ color: "var(--text-2)" }}>
            รหัสเข้าใช้งาน
          </span>
          <input
            name="code"
            type="text"
            autoComplete="off"
            placeholder="เช่น DEMO01"
            className="rounded-xl border bg-white px-4 py-3 text-base uppercase outline-none focus:ring-2"
            style={{ borderColor: "var(--border)" }}
          />
        </label>

        {state.error && (
          <p
            className="rounded-lg px-3 py-2 text-sm"
            style={{ background: "var(--instore-light)", color: "var(--instore)" }}
          >
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-1 rounded-full py-3 text-base font-semibold text-white transition-opacity disabled:opacity-60"
          style={{ background: "var(--front-dark)" }}
        >
          {pending ? "กำลังตรวจสอบ…" : "เข้าสู่ Dashboard"}
        </button>
      </form>

      <div
        className="rounded-xl border border-dashed p-4 text-sm"
        style={{ borderColor: "var(--front-mid)", background: "var(--front-light)" }}
      >
        <p className="font-semibold" style={{ color: "var(--front-dark)" }}>
          โหมด Demo
        </p>
        <p className="mt-1" style={{ color: "var(--text-2)" }}>
          ตัวอย่าง: <b>{demoName}</b> · เบอร์ <b>{demoPhone}</b> · รหัส{" "}
          <b>{demoCode}</b>
        </p>
        <form action={enterDemo}>
          <button
            type="submit"
            className="mt-3 w-full rounded-full border py-2.5 text-sm font-semibold transition-colors"
            style={{ borderColor: "var(--front-dark)", color: "var(--front-dark)" }}
          >
            เข้าชมด้วยร้านตัวอย่าง →
          </button>
        </form>
      </div>
    </div>
  );
}
