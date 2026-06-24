import { createStoreAction } from "@/app/admin/(panel)/stores/actions";
import { CATEGORY_LABELS, STORE_CATEGORIES } from "@/lib/mock";

const input =
  "rounded-lg border border-black/10 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-zinc-300";

export function CreateStoreForm() {
  return (
    <form
      action={createStoreAction}
      className="rounded-2xl border border-black/10 bg-white p-5 shadow-sm"
    >
      <h2 className="mb-3 text-sm font-semibold">เพิ่มร้านค้าใหม่</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <input name="name" placeholder="ชื่อร้าน" required className={input} />
        <input name="phone" placeholder="เบอร์โทร" required className={input} />
        <input name="email" type="email" placeholder="อีเมล (ไม่บังคับ)" className={input} />
        <select name="category" className={input} defaultValue="retail">
          {STORE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
        <input name="lat" type="number" step="any" placeholder="ละติจูด (ไม่บังคับ)" className={input} />
        <input name="lng" type="number" step="any" placeholder="ลองจิจูด (ไม่บังคับ)" className={input} />
      </div>
      <button
        type="submit"
        className="mt-3 rounded-full bg-zinc-900 px-5 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
      >
        + เพิ่มร้าน (สร้างรหัสอัตโนมัติ)
      </button>
    </form>
  );
}
