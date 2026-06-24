import { DashboardView } from "@/components/liff/dashboard-view";
import { getSource, getYesterday } from "@/lib/data";
import { logPageView } from "@/lib/data/page-views";
import { requireStore } from "@/lib/liff/require-store";

export default async function DashboardPage() {
  const store = await requireStore();
  await logPageView(store.id, "dashboard");

  const daily = await getSource().getDailySummary(store.id, getYesterday());

  return <DashboardView daily={daily} />;
}
