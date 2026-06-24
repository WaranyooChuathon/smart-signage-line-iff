import { ContentView } from "@/components/liff/content-view";
import { getSource, getYesterday } from "@/lib/data";
import { logPageView } from "@/lib/data/page-views";
import { requireStore } from "@/lib/liff/require-store";

export default async function ContentPage() {
  const store = await requireStore();
  await logPageView(store.id, "content");

  const content = await getSource().getContent(store.id, getYesterday());

  return <ContentView content={content} />;
}
