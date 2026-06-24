import { LiffHeader } from "@/components/liff/header";
import { StoreVisitsView } from "@/components/liff/store-visits-view";
import { getSource, getToday } from "@/lib/data";
import { logPageView } from "@/lib/data/page-views";
import { lastHalfHour, thaiDate } from "@/lib/liff/format";
import { requireStore } from "@/lib/liff/require-store";

export default async function StoreVisitsPage() {
  const store = await requireStore();
  await logPageView(store.id, "store-visits");

  const date = getToday();
  const visits = await getSource().getStoreVisits(store.id, date);

  return (
    <>
      <LiffHeader store={store} dateLabel={thaiDate(date)} timeLabel={`อัปเดตล่าสุด ${lastHalfHour()} น.`} />
      <StoreVisitsView
        area={visits.area}
        storeVisits={visits.storeVisits}
        captureRate={visits.captureRate}
      />
    </>
  );
}
