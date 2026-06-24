import { ACTION_LABELS, listAuditLogs } from "@/lib/data/audit";
import { thaiDateTime } from "@/lib/liff/format";

const ACTION_TONE: Record<string, string> = {
  "store.delete": "bg-red-50 text-red-600",
  "store.create": "bg-emerald-50 text-emerald-600",
  login: "bg-blue-50 text-blue-600",
  logout: "bg-zinc-100 text-zinc-500",
};

export default async function AdminAuditPage() {
  const logs = await listAuditLogs();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-semibold">Audit Log</h1>
        <p className="mt-0.5 text-sm text-zinc-500">บันทึกการกระทำสำคัญของผู้ดูแลระบบ</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/10 text-left text-xs text-zinc-500">
              <th className="px-4 py-3 font-medium">เวลา</th>
              <th className="px-4 py-3 font-medium">การกระทำ</th>
              <th className="px-4 py-3 font-medium">เป้าหมาย</th>
              <th className="px-4 py-3 font-medium">ผู้กระทำ</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-zinc-400">
                  ยังไม่มีบันทึก — การกระทำของผู้ดูแลจะแสดงที่นี่
                </td>
              </tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} className="border-b border-black/5 last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-zinc-500">
                  {thaiDateTime(log.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      ACTION_TONE[log.action] ?? "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {ACTION_LABELS[log.action] ?? log.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-700">{log.target ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-500">{log.actorName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
