import { getPageViewStats } from "@/lib/data/page-views";
import { fmtNum } from "@/lib/liff/format";

export default async function AdminAnalyticsPage() {
  const stats = await getPageViewStats();
  const total = stats.reduce((s, x) => s + x.views, 0);
  const max = Math.max(...stats.map((s) => s.views), 1);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Analytics</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          ยอดเข้าชมแต่ละหน้าใน LIFF · รวม {fmtNum(total)} ครั้ง
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
        {stats.map((s) => (
          <div key={s.page}>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-zinc-700">{s.label}</span>
              <span className="font-mono-num font-bold">{fmtNum(s.views)}</span>
            </div>
            <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-zinc-100">
              <div
                className="h-full rounded-full bg-zinc-900"
                style={{ width: `${(s.views / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
