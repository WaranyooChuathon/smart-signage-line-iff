import Link from "next/link";

// ⚙️ Replace these with your real links before publishing.
const GITHUB_URL = "https://github.com/your-username/smart-signage-liff";
const RESUME_URL = "https://your-portfolio.example";

const TECH = ["Next.js 16", "React 19", "Cloudflare D1", "Drizzle", "TypeScript", "Tailwind v4"];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-7 bg-zinc-50 px-6 py-16 text-center text-zinc-900">
      <div className="rounded-full border border-amber-300 bg-amber-50 px-4 py-1 text-xs font-medium text-amber-700">
        Portfolio Demo · ข้อมูลจำลองทั้งหมด (mock data) · ไม่มีข้อมูลบริษัทจริง
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Smart Signage Line-LIFF</h1>
        <p className="mx-auto max-w-md text-zinc-600">
          แพลตฟอร์มสถิติ Smart Signage — Dashboard บนมือถือผ่าน LINE LIFF
          และระบบหลังบ้านสำหรับจัดการร้านค้า
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <Link
          href="/dashboard"
          className="flex h-12 items-center justify-center rounded-full bg-foreground px-6 text-background transition-colors hover:opacity-90"
        >
          เปิด Dashboard LIFF (มือถือ)
        </Link>
        <Link
          href="/admin/login"
          className="flex h-12 items-center justify-center rounded-full border border-black/10 px-6 transition-colors hover:bg-black/4"
        >
          เข้าระบบ Management
        </Link>
      </div>

      <p className="text-xs text-zinc-500">
        บัญชี demo: <b>admin@demo.local</b> / <b>demo1234</b> · LIFF กดปุ่ม “เข้าชมด้วยร้านตัวอย่าง” ได้เลย
      </p>

      <div className="flex flex-wrap justify-center gap-2">
        {TECH.map((t) => (
          <span
            key={t}
            className="rounded-full border border-black/10 bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-600"
          >
            {t}
          </span>
        ))}
      </div>

      <footer className="flex gap-5 text-sm font-medium text-zinc-500">
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900">
          GitHub ↗
        </a>
        <a href={RESUME_URL} target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900">
          Portfolio / Resume ↗
        </a>
      </footer>
    </main>
  );
}
