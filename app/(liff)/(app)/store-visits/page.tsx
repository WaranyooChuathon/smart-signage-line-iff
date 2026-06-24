import { StoreVisitsView } from "@/components/liff/store-visits-view";
import { getSource, getToday } from "@/lib/data";
import { logPageView } from "@/lib/data/page-views";
import { requireStore } from "@/lib/liff/require-store";

export default async function StoreVisitsPage() {
  const store = await requireStore();
  await logPageView(store.id, "store-visits");

  const visits = await getSource().getStoreVisits(store.id, getToday());

  return (
    <StoreVisitsView
      area={visits.area}
      storeVisits={visits.storeVisits}
      captureRate={visits.captureRate}
    />
  );
}
