import {
  linkLineAction,
  regenCodeAction,
  updateStoreAction,
} from "@/app/admin/(panel)/stores/actions";
import type { Store } from "@/lib/data/stores";
import { CATEGORY_LABELS, STORE_CATEGORIES } from "@/lib/mock";
import { DeleteStoreButton } from "./delete-button";

const input =
  "rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300";

export function StoreCard({ store }: { store: Store }) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold">{store.name}</h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              store.status === "active"
                ? "bg-emerald-50 text-emerald-600"
                : "bg-zinc-100 text-zinc-500"
            }`}
          >
            {store.status === "active" ? "ใช้งาน" : "ปิด"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-2.5 py-1 text-xs">
            <span className="text-amber-600">รหัส</span>
            <span className="font-mono-num font-bold tracking-wider">{store.accessCode}</span>
          </span>
          <form action={regenCodeAction}>
            <input type="hidden" name="id" value={store.id} />
            <button type="submit" className="rounded-lg border border-black/10 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors hover:bg-black/5">
              สุ่มรหัสใหม่
            </button>
          </form>
          <DeleteStoreButton id={store.id} name={store.name} />
        </div>
      </div>

      {/* Edit form */}
      <form action={updateStoreAction} className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <input type="hidden" name="id" value={store.id} />
        <input name="name" defaultValue={store.name} placeholder="ชื่อร้าน" className={input} />
        <input name="phone" defaultValue={store.phone} placeholder="เบอร์โทร" className={input} />
        <input name="email" defaultValue={store.email ?? ""} placeholder="อีเมล" className={input} />
        <select name="category" defaultValue={store.category} className={input}>
          {STORE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <select name="status" defaultValue={store.status} className={input}>
          <option value="active">ใช้งาน</option>
          <option value="inactive">ปิด</option>
        </select>
        <input name="lat" type="number" step="any" defaultValue={store.lat ?? ""} placeholder="lat" className={input} />
        <input name="lng" type="number" step="any" defaultValue={store.lng ?? ""} placeholder="lng" className={input} />
        <button type="submit" className="rounded-full bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90">
          บันทึก
        </button>
      </form>

      {/* Line ID link */}
      <form action={linkLineAction} className="mt-2 flex items-center gap-2">
        <input type="hidden" name="id" value={store.id} />
        <input
          name="lineId"
          defaultValue={store.lineId ?? ""}
          placeholder="LINE ID (เว้นว่างเพื่อยกเลิกการลิงก์)"
          className={`${input} flex-1`}
        />
        <button type="submit" className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-black/5">
          ลิงก์ LINE
        </button>
      </form>
    </div>
  );
}
