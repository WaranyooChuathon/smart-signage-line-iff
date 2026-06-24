import { FlowView } from "@/components/liff/flow-view";
import { getSource, getToday } from "@/lib/data";
import { logPageView } from "@/lib/data/page-views";
import { requireStore } from "@/lib/liff/require-store";

export default async function FlowPage() {
  const store = await requireStore();
  await logPageView(store.id, "flow");

  const date = getToday();
  const [flow, visits] = await Promise.all([
    getSource().getFlow(store.id, date),
    getSource().getStoreVisits(store.id, date),
  ]);

  return <FlowView flow={flow} storeVisits={visits.storeVisits} />;
}
