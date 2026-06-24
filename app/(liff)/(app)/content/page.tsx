import { ContentView } from "@/components/liff/content-view";
import { LiffHeader } from "@/components/liff/header";
import { getSource, getToday } from "@/lib/data";
import { logPageView } from "@/lib/data/page-views";
import { lastHalfHour, thaiDate } from "@/lib/liff/format";
import { requireStore } from "@/lib/liff/require-store";

export default async function ContentPage() {
  const store = await requireStore();
  await logPageView(store.id, "content");

  const date = getToday();
  const content = await getSource().getContent(store.id, date);

  return (
    <>
      <LiffHeader store={store} dateLabel={thaiDate(date)} timeLabel={`อัปเดตล่าสุด ${lastHalfHour()} น.`} />
      <ContentView content={content} />
    </>
  );
}
