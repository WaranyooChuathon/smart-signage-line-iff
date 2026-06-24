import Link from "next/link";
import type { ReactNode } from "react";

// ⚙️ Replace with your real links before publishing.
const GITHUB_URL = "https://github.com/your-username/smart-signage-liff";
const RESUME_URL = "https://your-portfolio.example";

const TECH: { name: string; icon: ReactNode }[] = [
  {
    name: "Next.js 16",
    icon: (
      <svg viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="11" fill="#000" />
        <path d="M9 8v8M9 8l7 9V8" stroke="#fff" strokeWidth="1.4" fill="none" />
      </svg>
    ),
  },
  {
    name: "React 19",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#06b6d4" strokeWidth="1.2">
        <circle cx="12" cy="12" r="2" fill="#06b6d4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: "Cloudflare D1",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M17 17H6.5a3.5 3.5 0 01-.4-7 5 5 0 019.6-1.3A3.7 3.7 0 0120 13a3.6 3.6 0 01-3 4z" fill="#f6821f" />
      </svg>
    ),
  },
  {
    name: "Drizzle",
    icon: (
      <svg viewBox="0 0 24 24" stroke="#22c55e" strokeWidth="2.4" strokeLinecap="round">
        <path d="M4 8h9M7 13h9M3 18h9" transform="rotate(-18 12 12)" />
      </svg>
    ),
  },
  {
    name: "Tailwind v4",
    icon: (
      <svg viewBox="0 0 24 24">
        <path d="M12 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.7.2 1.3.7 1.9 1.4 1 1.1 2.1 2.4 4.6 2.4 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.7-.2-1.3-.7-1.9-1.4C15.6 7.3 14.5 6 12 6zM7 12c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.7.2 1.3.7 1.9 1.4 1 1.1 2.1 2.4 4.6 2.4 2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.7-.2-1.3-.7-1.9-1.4C10.6 13.3 9.5 12 7 12z" fill="#38bdf8" />
      </svg>
    ),
  },
  {
    name: "TypeScript",
    icon: (
      <svg viewBox="0 0 24 24">
        <rect width="24" height="24" rx="4" fill="#3178c6" />
        <text x="12" y="17" fontSize="11" fontWeight="800" fill="#fff" textAnchor="middle">TS</text>
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <main
      className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-6 py-12 text-slate-800"
      style={{
        backgroundColor: "#f1f5f9",
        backgroundImage:
          "radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#cbd5e1 1px, transparent 1px)",
        backgroundSize: "26px 26px",
        backgroundPosition: "0 0, 13px 13px",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(180deg, rgba(241,245,249,.25), rgba(241,245,249,.82))" }}
      />

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-12 lg:grid-cols-[1fr_auto]">
        {/* ── Left: content ── */}
        <div className="text-center lg:text-left">
          <span className="font-mono-num inline-flex items-center gap-1.5 rounded-full border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Portfolio Demo · mock data
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
            Smart Signage
            <br />
            <span className="text-slate-400">Line-LIFF Dashboard</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-slate-600 lg:mx-0">
            แพลตฟอร์มสถิติ Smart Signage บนมือถือผ่าน LINE LIFF + ระบบหลังบ้านจัดการร้านค้า —
            กดเล่นได้ทันที ข้อมูลจำลองทั้งหมด
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
            <Link
              href="/dashboard"
              className="flex h-12 items-center justify-center rounded-xl bg-slate-900 px-6 text-base font-semibold text-white transition-opacity hover:opacity-90"
            >
              เปิด Dashboard LIFF
            </Link>
            <Link
              href="/admin/login"
              className="flex h-12 items-center justify-center rounded-xl border border-slate-300 bg-white px-6 text-base font-medium text-slate-800 transition-colors hover:bg-slate-50"
            >
              เข้าระบบ Management
            </Link>
          </div>

          <p className="font-mono-num mt-4 text-[13px] text-slate-500">
            demo: <b className="text-slate-700">admin@demo.local</b> /{" "}
            <b className="text-slate-700">demo1234</b>
          </p>

          <div className="mt-9">
            <div className="font-mono-num text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
              {"// Built with"}
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-2 lg:justify-start">
              {TECH.map((t) => (
                <span
                  key={t.name}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-semibold text-slate-700 opacity-60 grayscale transition hover:-translate-y-0.5 hover:opacity-100 hover:grayscale-0"
                >
                  <span className="h-5 w-5 shrink-0">{t.icon}</span>
                  {t.name}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-7 flex justify-center gap-5 text-sm font-medium text-slate-400 lg:justify-start">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">
              GitHub ↗
            </a>
            <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900">
              Portfolio / Resume ↗
            </a>
          </div>
        </div>

        {/* ── Right: phone mockup ── */}
        <PhoneMock />
      </div>
    </main>
  );
}

function PhoneMock() {
  const stats = [
    { label: "District", value: "1,422", color: "#5b7cf7", bg: "#eef1fe" },
    { label: "Area", value: "424", color: "#22b07d", bg: "#e8f8f1" },
    { label: "Store Visits", value: "187", color: "#d97706", bg: "#fef5e0" },
    { label: "Capture", value: "44.1%", color: "#ef6b6b", bg: "#fdeaea" },
  ];
  return (
    <div className="mx-auto hidden h-[540px] w-[268px] shrink-0 flex-col overflow-hidden rounded-[42px] border-[11px] border-slate-900 shadow-2xl sm:flex" style={{ background: "#f4f1ec" }}>
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3.5" style={{ background: "rgba(244,241,236,.9)", borderBottom: "1px solid rgba(0,0,0,.06)" }}>
        <div className="flex items-center gap-2">
          <div className="flex h-[30px] w-[30px] items-center justify-center rounded-[9px] bg-linear-to-br from-zinc-900 to-zinc-700 text-[13px] font-extrabold text-white">R</div>
          <div>
            <div className="text-[13px] font-bold leading-tight">Riverside Commons</div>
            <div className="text-[9px]" style={{ color: "#a8a29e" }}>ลานกิจกรรมริมน้ำ</div>
          </div>
        </div>
        <span className="rounded-full px-2 py-1 text-[9px] font-semibold" style={{ background: "#e8f8f1", border: "1px solid #c8eedd", color: "#22b07d" }}>Live</span>
      </div>
      {/* body */}
      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <div className="rounded-2xl border border-black/5 bg-white p-4 text-center shadow-sm">
          <div className="font-mono-num text-[9px] tracking-widest" style={{ color: "#a8a29e" }}>DISTRICTS TOTAL</div>
          <div className="font-mono-num text-[40px] font-bold leading-none tracking-tighter" style={{ color: "#1a1a1a" }}>1,422</div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div key={s.label} className="rounded-[14px] border border-black/5 bg-white p-2.5">
              <div className="mb-1.5 h-6 w-6 rounded-lg" style={{ background: s.bg }} />
              <div className="text-[10px]" style={{ color: "#6b6560" }}>{s.label}</div>
              <div className="font-mono-num text-[18px] font-bold" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>
      </div>
      {/* nav */}
      <div className="mt-auto flex justify-around py-2.5" style={{ background: "rgba(244,241,236,.9)", borderTop: "1px solid rgba(0,0,0,.06)" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-[2px]" style={{ background: i === 0 ? "#d97706" : "#d6d3d1" }} />
        ))}
      </div>
    </div>
  );
}
