"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { DailyMetric } from "@/lib/mock";
import { fmtNum } from "@/lib/liff/format";
import { CountUp } from "./count-up";

const ICONS: Record<string, ReactNode> = {
  district: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M3 21h18M9 8h1M9 12h1M9 16h1M14 8h1M14 12h1M14 16h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
    </svg>
  ),
  area: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
      <circle cx="12" cy="10" r="3" />
      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z" />
    </svg>
  ),
  storeVisits: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  capture: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
      <line x1="19" y1="5" x2="5" y2="19" />
      <circle cx="6.5" cy="6.5" r="2.5" />
      <circle cx="17.5" cy="17.5" r="2.5" />
    </svg>
  ),
};

const sectionLabel = "mb-2.5 px-0.5 text-[11px] font-semibold uppercase tracking-wider font-mono-num";
const cardCls = "relative overflow-hidden rounded-[var(--r)] border bg-[var(--surface)] shadow-[var(--shadow)]";

export function DashboardView({ daily }: { daily: DailyMetric }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  const max = daily.district || 1;
  const captureRate = daily.area === 0 ? 0 : daily.storeVisits / daily.area;

  const funnel = [
    { key: "district", label: "District", sub: "ผู้คนในเขต", value: daily.district, color: "var(--district)", light: "var(--district-light)" },
    { key: "area", label: "Area", sub: "พื้นที่ใกล้ร้าน", value: daily.area, color: "var(--area)", light: "var(--area-light)" },
    { key: "storeVisits", label: "Store Visits", sub: "คนเข้าร้าน", value: daily.storeVisits, color: "var(--front)", light: "var(--front-light)" },
  ];

  return (
    <div className="flex flex-col gap-5 px-5 pt-5 pb-10">
      {/* Hero */}
      <section className="liff-reveal">
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          ผู้เยี่ยมชมทั้งเขต
        </div>
        <div className={`${cardCls} flex flex-col items-center px-6 py-8 text-center`} style={{ borderColor: "var(--border)" }}>
          <div className="text-[11px] font-semibold uppercase tracking-wider font-mono-num" style={{ color: "var(--text-3)" }}>
            Districts Total
          </div>
          <div className="mt-1 text-sm font-medium" style={{ color: "var(--text-2)" }}>
            จำนวนผู้เยี่ยมชมทั้งเขต
          </div>
          <CountUp value={daily.district} className="font-mono-num text-[64px] font-bold leading-none tracking-tighter" />
        </div>
      </section>

      {/* Stat grid: funnel 3 + capture rate */}
      <section>
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          สถิติตามจุด
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {funnel.map((s) => {
            const pct = Math.round((s.value / max) * 100);
            return (
              <div key={s.key} className={`${cardCls} p-4`} style={{ borderColor: "var(--border)" }}>
                <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: s.light, color: s.color }}>
                  {ICONS[s.key]}
                </div>
                <div className="text-[12px] font-medium" style={{ color: "var(--text-2)" }}>{s.label}</div>
                <CountUp value={s.value} className="font-mono-num text-[28px] font-bold tracking-tight" />
                <div className="mt-1.5 h-1 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                  <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: mounted ? `${pct}%` : 0, background: s.color }} />
                </div>
                <div className="mt-1.5 text-[11px]" style={{ color: "var(--text-3)" }}>{s.sub}</div>
              </div>
            );
          })}

          {/* Capture rate */}
          <div className={`${cardCls} p-4`} style={{ borderColor: "var(--border)" }}>
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--instore-light)", color: "var(--instore)" }}>
              {ICONS.capture}
            </div>
            <div className="text-[12px] font-medium" style={{ color: "var(--text-2)" }}>Capture Rate</div>
            <div className="font-mono-num text-[28px] font-bold tracking-tight" style={{ color: "var(--instore)" }}>
              {(captureRate * 100).toFixed(1)}%
            </div>
            <div className="mt-1.5 h-1 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
              <div className="h-full rounded-full transition-[width] duration-700 ease-out" style={{ width: mounted ? `${Math.round(captureRate * 100)}%` : 0, background: "var(--instore)" }} />
            </div>
            <div className="mt-1.5 text-[11px]" style={{ color: "var(--text-3)" }}>เข้าร้าน ÷ พื้นที่</div>
          </div>
        </div>
      </section>

      {/* Comparison bar chart (counts) */}
      <section>
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          กราฟเปรียบเทียบ
        </div>
        <div className={`${cardCls} p-5`} style={{ borderColor: "var(--border)" }}>
          <div className="text-[14px] font-semibold">ผู้เยี่ยมชม</div>
          <div className="text-[12px]" style={{ color: "var(--text-3)" }}>แยกตามจุดวัด</div>
          <div className="mt-4 flex h-[180px] items-end justify-around gap-3">
            {funnel.map((s) => {
              const pct = Math.max((s.value / max) * 100, 2);
              return (
                <div key={s.key} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <div className="font-mono-num text-[12px] font-bold" style={{ color: s.color }}>{fmtNum(s.value)}</div>
                  <div className="w-full max-w-[52px] rounded-t-md transition-[height] duration-700 ease-out" style={{ height: mounted ? `${pct}%` : 0, background: s.color }} />
                  <div className="text-[10px]" style={{ color: "var(--text-3)" }}>{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
