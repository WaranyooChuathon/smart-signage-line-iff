import Link from "next/link";
import { LiffSpeedDial } from "@/components/liff/liff-speed-dial";

// LIFF is a mobile app (opened inside LINE). On phones it fills the screen;
// on tablet/desktop it is shown as a centered phone frame on a decorative
// backdrop (with a side panel on large screens) so big screens don't look empty.
export default function LiffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:flex md:min-h-[100dvh] md:items-center md:justify-center md:gap-10 md:bg-gradient-to-br md:from-zinc-200 md:via-zinc-100 md:to-amber-50 md:p-8">
      {/* desktop side panel */}
      <aside className="hidden w-full max-w-sm lg:block">
        <div className="rounded-full border border-amber-300 bg-amber-50 px-4 py-1 text-xs font-medium text-amber-700 inline-block">
          Portfolio Demo · mock data
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-900">
          Smart Signage
          <br />
          <span className="text-zinc-500">Line-LIFF Dashboard</span>
        </h1>
        <p className="mt-3 text-zinc-600">
          แดชบอร์ดสถิติ Smart Signage ที่ออกแบบสำหรับมือถือ เปิดผ่าน LINE LIFF —
          แสดงในกรอบมือถือทางขวาเพื่อให้ตรงกับการใช้งานจริง
        </p>
        <ul className="mt-4 space-y-1.5 text-sm text-zinc-600">
          <li>• สรุปรายวัน · คนในพื้นที่ · คนเข้าร้าน</li>
          <li>• Flow การเดินทาง · สถิติโฆษณา</li>
          <li>• ปุ่มลัด (FAB) นำทางทุกหน้า</li>
        </ul>
        <Link
          href="/admin/login"
          className="mt-5 inline-flex h-10 items-center rounded-full border border-black/10 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-black/5"
        >
          ไปยังระบบ Management →
        </Link>
      </aside>

      {/* device */}
      <div className="liff-theme relative mx-auto flex w-full max-w-[480px] flex-col overflow-hidden h-[100dvh] md:h-[840px] md:max-h-[92vh] md:w-[400px] md:rounded-[44px] md:border-[12px] md:border-zinc-900 md:shadow-2xl">
        <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
        <LiffSpeedDial />
      </div>
    </div>
  );
}
