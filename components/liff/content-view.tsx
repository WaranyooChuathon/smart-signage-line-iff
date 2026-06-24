"use client";

import type { ContentSnapshot } from "@/lib/mock";
import { fmtNum } from "@/lib/liff/format";
import { CountUp } from "./count-up";

const cardCls =
  "relative overflow-hidden rounded-[var(--r)] border bg-[var(--surface)] shadow-[var(--shadow)]";
const sectionLabel =
  "mb-2.5 px-0.5 text-[11px] font-semibold uppercase tracking-wider font-mono-num";

const AGE_META: Record<string, { label: string; color: string }> = {
  adult: { label: "ผู้ใหญ่", color: "#7c8cf8" },
  "female-specific": { label: "กลุ่มหญิง", color: "#ef6b6b" },
  elderly: { label: "ผู้สูงอายุ", color: "#f59e0b" },
  child: { label: "เด็ก", color: "#22b07d" },
};

export function ContentView({ content }: { content: ContentSnapshot }) {
  const total = content.totalPlays || 1;
  const gender = content.breakdown.filter((b) => b.dimension === "gender");
  const age = content.breakdown.filter((b) => b.dimension === "age");
  const male = gender.find((g) => g.key === "male")?.value ?? 0;
  const female = gender.find((g) => g.key === "female")?.value ?? 0;
  const topPlays = Math.max(...content.ads.map((a) => a.plays), 1);

  // donut segments (circumference normalised to 100); offset = cumulative
  // sum of preceding segments, computed without mutation during render.
  const segments = age.map((a, i) => {
    const pct = (a.value / total) * 100;
    const offset = age
      .slice(0, i)
      .reduce((sum, b) => sum + (b.value / total) * 100, 0);
    return { ...AGE_META[a.key], pct, offset };
  });

  return (
    <div className="flex flex-col gap-5 px-5 pt-5 pb-10">
      {/* Hero — total plays */}
      <section className="liff-reveal">
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          Ads Display
        </div>
        <div className={`${cardCls} flex flex-col items-center px-6 py-9 text-center`} style={{ borderColor: "var(--border)" }}>
          <div className="text-[11px] font-semibold uppercase tracking-wider font-mono-num" style={{ color: "var(--text-3)" }}>
            Total Plays
          </div>
          <div className="mt-1 text-sm font-medium" style={{ color: "var(--text-2)" }}>
            จำนวนการเล่นโฆษณาทั้งหมด
          </div>
          <CountUp value={content.totalPlays} className="font-mono-num text-[64px] font-bold leading-none tracking-tighter" />
          <div className="mt-2 text-base font-medium" style={{ color: "var(--text-3)" }}>ครั้ง</div>
        </div>
      </section>

      {/* Ad ranking — which ad plays most */}
      <section>
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          โฆษณาที่เล่นบ่อยที่สุด
        </div>
        <div className={`${cardCls} flex flex-col gap-3 p-4`} style={{ borderColor: "var(--border)" }}>
          {content.ads.map((ad, i) => (
            <div key={ad.adName}>
              <div className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2">
                  <span
                    className="flex h-5 w-5 items-center justify-center rounded-full font-mono-num text-[10px] font-bold"
                    style={{
                      background: i === 0 ? "var(--front-dark)" : "var(--surface-alt)",
                      color: i === 0 ? "#fff" : "var(--text-3)",
                    }}
                  >
                    {i + 1}
                  </span>
                  <span style={{ color: "var(--text)" }}>{ad.adName}</span>
                </span>
                <span className="font-mono-num font-bold" style={{ color: "var(--front-dark)" }}>
                  {fmtNum(ad.plays)}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
                <div className="h-full rounded-full" style={{ width: `${(ad.plays / topPlays) * 100}%`, background: "var(--front)" }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Gender split */}
      <section>
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          แยกตามเพศ
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <GenderCard label="ชาย" value={male} pct={(male / total) * 100} color="#3b82f6" light="#eff6ff" />
          <GenderCard label="หญิง" value={female} pct={(female / total) * 100} color="#ef6b6b" light="#fdeaea" />
        </div>
      </section>

      {/* Age donut */}
      <section>
        <div className={sectionLabel} style={{ color: "var(--text-3)" }}>
          สัดส่วนกลุ่มอายุ
        </div>
        <div className={`${cardCls} flex flex-col items-center p-5`} style={{ borderColor: "var(--border)" }}>
          <div className="relative h-40 w-40">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              {segments.map((s) => (
                <circle
                  key={s.label}
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke={s.color}
                  strokeWidth="3.5"
                  strokeDasharray={`${s.pct} ${100 - s.pct}`}
                  strokeDashoffset={-s.offset}
                />
              ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="font-mono-num text-[24px] font-bold leading-none">{fmtNum(content.totalPlays)}</div>
              <div className="text-[11px]" style={{ color: "var(--text-3)" }}>ครั้งทั้งหมด</div>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            {segments.map((s) => (
              <span key={s.label} className="flex items-center gap-1.5 text-[11px] font-medium" style={{ color: "var(--text-2)" }}>
                <span className="h-2 w-2 rounded-[3px]" style={{ background: s.color }} />
                {s.label} {Math.round(s.pct)}%
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function GenderCard({
  label,
  value,
  pct,
  color,
  light,
}: {
  label: string;
  value: number;
  pct: number;
  color: string;
  light: string;
}) {
  return (
    <div className={`${cardCls} p-4`} style={{ borderColor: "var(--border)" }}>
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: light }}>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      </div>
      <div className="text-[12px] font-medium" style={{ color: "var(--text-2)" }}>{label}</div>
      <CountUp value={value} className="font-mono-num text-[26px] font-bold tracking-tight" />
      <div className="text-[12px] font-bold" style={{ color }}>{pct.toFixed(1)}%</div>
      <div className="mt-1.5 h-1 overflow-hidden rounded-full" style={{ background: "var(--surface-alt)" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
