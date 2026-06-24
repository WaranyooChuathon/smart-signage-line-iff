import { DashboardView } from "@/components/liff/dashboard-view";
import { LiffHeader } from "@/components/liff/header";
import { getSource, getYesterday } from "@/lib/data";
import { logPageView } from "@/lib/data/page-views";
import { thaiDate } from "@/lib/liff/format";
import { requireStore } from "@/lib/liff/require-store";

export default async function DashboardPage() {
  const store = await requireStore();
  await logPageView(store.id, "dashboard");

  const date = getYesterday();
  const daily = await getSource().getDailySummary(store.id, date);

  return (
    <>
      <LiffHeader store={store} dateLabel={thaiDate(date)} timeLabel="สรุปทั้งวัน" />
      <DashboardView daily={daily} />
    </>
  );
}
