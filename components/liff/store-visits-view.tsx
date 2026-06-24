"use client";

import { CountUp } from "./count-up";

const cardCls =
  "relative overflow-hidden rounded-[var(--r)] border bg-[var(--surface)] shadow-[var(--shadow)]";
const sectionLabel =
  "mb-2.5 px-0.5 text-[11px] font-semibold uppercase tracking-wider font-mono-num";

export function StoreVisitsView({
  area,
  storeVisits,
  captureRate,
}: {
  area: number;
  storeVisits: number;
  captureRate: number;
}) {
  const rate = `${(captureRate * 100).toFixed(1)}%`;

  return (
    <div className="flex flex-col gap-5 px-5 pt-5 pb-10">
      {/* Hero — store visits count */}
      <section className="liff-reveal">
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          Store Visits
        </div>
        <div className={`${cardCls} flex flex-col items-center px-6 py-10 text-center`} style={{ borderColor: "var(--border)" }}>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "var(--front-light)", color: "var(--front-dark)" }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-wider font-mono-num" style={{ color: "var(--text-3)" }}>
            Store Visits
          </div>
          <div className="mt-1 text-sm font-medium" style={{ color: "var(--text-2)" }}>
            จำนวนคนที่เข้าร้าน
          </div>
          <CountUp
            value={storeVisits}
            className="font-mono-num text-[80px] font-bold leading-none tracking-tighter"
            durationMs={1200}
          />
          <div className="mt-3 text-base font-medium" style={{ color: "var(--text-3)" }}>
            คน
          </div>
        </div>
      </section>

      {/* Capture rate: Area → Store Visits */}
      <section>
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          Capture Rate
        </div>
        <div className={`${cardCls} flex items-center gap-2 p-4`} style={{ borderColor: "var(--border)" }}>
          <div className="flex-1 rounded-xl border px-2 py-3 text-center" style={{ background: "var(--area-light)", borderColor: "var(--area-mid)" }}>
            <div className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: "var(--area)" }}>
              Area
            </div>
            <CountUp value={area} className="font-mono-num text-[22px] font-bold tracking-tight" />
          </div>

          <div className="flex shrink-0 flex-col items-center gap-0.5" style={{ color: "var(--text-3)" }}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
            <span className="font-mono-num text-[9px] font-bold" style={{ color: "var(--text-2)" }}>{rate}</span>
          </div>

          <div className="flex-1 rounded-xl border px-2 py-3 text-center" style={{ background: "var(--front-light)", borderColor: "var(--front-mid)" }}>
            <div className="text-[9px] font-semibold uppercase tracking-wide" style={{ color: "var(--front-dark)" }}>
              Store Visits
            </div>
            <CountUp value={storeVisits} className="font-mono-num text-[22px] font-bold tracking-tight" />
          </div>
        </div>
        <p className="mt-2 px-1 text-[12px]" style={{ color: "var(--text-3)" }}>
          อัตราการเข้าร้านจากคนในพื้นที่ <b style={{ color: "var(--text-2)" }}>{rate}</b>
        </p>
      </section>
    </div>
  );
}
