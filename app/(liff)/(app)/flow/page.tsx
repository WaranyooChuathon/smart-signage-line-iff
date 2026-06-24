import { FlowView } from "@/components/liff/flow-view";
import { LiffHeader } from "@/components/liff/header";
import { getSource, getToday } from "@/lib/data";
import { logPageView } from "@/lib/data/page-views";
import { lastHalfHour, thaiDate } from "@/lib/liff/format";
import { requireStore } from "@/lib/liff/require-store";

export default async function FlowPage() {
  const store = await requireStore();
  await logPageView(store.id, "flow");

  const date = getToday();
  const [flow, visits] = await Promise.all([
    getSource().getFlow(store.id, date),
    getSource().getStoreVisits(store.id, date),
  ]);

  return (
    <>
      <LiffHeader store={store} dateLabel={thaiDate(date)} timeLabel={`อัปเดตล่าสุด ${lastHalfHour()} น.`} />
      <FlowView flow={flow} storeVisits={visits.storeVisits} />
    </>
  );
}
