"use client";

import { CountUp } from "./count-up";

const cardCls =
  "relative overflow-hidden rounded-[var(--r)] border bg-[var(--surface)] shadow-[var(--shadow)]";
const sectionLabel =
  "mb-2.5 px-0.5 text-[11px] font-semibold uppercase tracking-wider font-mono-num";

export function AreaView({
  areaCount,
  district,
  hourLabel,
  temp,
  humidity,
  pressure,
}: {
  areaCount: number;
  district: number;
  hourLabel: string;
  temp: number;
  humidity: number;
  pressure: number;
}) {
  const sensors = [
    {
      name: "Temperature",
      desc: "อุณหภูมิ",
      value: `${temp.toFixed(1)}°`,
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M14 14.76V3.5a2.5 2.5 0 00-5 0v11.26a4.5 4.5 0 105 0z" />
        </svg>
      ),
    },
    {
      name: "Humidity",
      desc: "ความชื้น",
      value: `${humidity}%`,
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z" />
        </svg>
      ),
    },
    {
      name: "Pressure",
      desc: "ความดันอากาศ",
      value: `${pressure} hPa`,
      icon: (
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M12 2v20M2 12h20" />
          <circle cx="12" cy="12" r="6" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5 px-5 pt-5 pb-10">
      {/* Hero */}
      <section className="liff-reveal">
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          Area Visitors
        </div>
        <div className={`${cardCls} flex flex-col items-center px-6 py-9 text-center`} style={{ borderColor: "var(--border)" }}>
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl" style={{ background: "var(--area-light)", color: "var(--area)" }}>
            <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="10" r="3" />
              <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z" />
            </svg>
          </div>
          <div className="text-[11px] font-semibold uppercase tracking-wider font-mono-num" style={{ color: "var(--text-3)" }}>
            Area
          </div>
          <div className="mt-1 text-sm font-medium" style={{ color: "var(--text-2)" }}>
            จำนวนคนในพื้นที่ตอนนี้
          </div>
          <CountUp
            value={areaCount}
            className="font-mono-num text-[72px] font-bold leading-none tracking-tighter"
          />
          <div className="mt-2 text-base font-medium" style={{ color: "var(--text-3)" }}>
            คน
          </div>
        </div>
      </section>

      {/* Info cards */}
      <section>
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          รายละเอียด
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className={`${cardCls} p-4`} style={{ borderColor: "var(--border)" }}>
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--district-light)", color: "var(--district)" }}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M3 21h18M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />
              </svg>
            </div>
            <div className="text-[12px] font-medium" style={{ color: "var(--text-2)" }}>District</div>
            <CountUp value={district} className="font-mono-num text-[28px] font-bold tracking-tight" />
            <div className="mt-1 text-[11px]" style={{ color: "var(--text-3)" }}>ผู้คนทั้งเขต</div>
          </div>
          <div className={`${cardCls} p-4`} style={{ borderColor: "var(--border)" }}>
            <div className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "var(--area-light)", color: "var(--area)" }}>
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <div className="text-[12px] font-medium" style={{ color: "var(--text-2)" }}>รอบข้อมูล</div>
            <div className="font-mono-num text-[18px] font-bold tracking-tight">{hourLabel}</div>
            <div className="mt-1 text-[11px]" style={{ color: "var(--text-3)" }}>อัปเดตล่าสุด</div>
          </div>
        </div>
      </section>

      {/* Sensor details */}
      <section>
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          ข้อมูลเซ็นเซอร์
        </div>
        <div className={`${cardCls} divide-y`} style={{ borderColor: "var(--border)" }}>
          {sensors.map((s) => (
            <div key={s.name} className="flex items-center justify-between px-4 py-3.5" style={{ borderColor: "var(--border)" }}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ background: "var(--area-light)", color: "var(--area)" }}>
                  {s.icon}
                </div>
                <div>
                  <div className="text-[13px] font-semibold">{s.name}</div>
                  <div className="text-[11px]" style={{ color: "var(--text-3)" }}>{s.desc}</div>
                </div>
              </div>
              <div className="font-mono-num text-[18px] font-bold tracking-tight" style={{ color: "var(--text)" }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
