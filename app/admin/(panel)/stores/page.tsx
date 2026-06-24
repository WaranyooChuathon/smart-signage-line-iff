import { CreateStoreForm } from "@/components/admin/create-store-form";
import { StoreCard } from "@/components/admin/store-card";
import { listStores } from "@/lib/data/stores";

export default async function AdminStoresPage() {
  const stores = await listStores();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-semibold">ร้านค้า</h1>
        <p className="mt-0.5 text-sm text-zinc-500">
          ลงทะเบียนร้าน · สร้าง/สุ่มรหัสเข้าใช้งาน · ลิงก์ LINE ID ({stores.length} ร้าน)
        </p>
      </div>

      <CreateStoreForm />

      <div className="flex flex-col gap-3">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}
