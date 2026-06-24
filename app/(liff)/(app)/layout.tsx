import { TabBar } from "@/components/liff/tab-bar";
import { requireStore } from "@/lib/liff/require-store";

// Authenticated LIFF shell: redirects to /verify when no store context.
// Each page renders its own <LiffHeader> so date/time labels match that
// page's data window (yesterday summary / hourly / 30-min).
export default async function LiffAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireStore();
  return (
    <>
      <main className="flex flex-1 flex-col">{children}</main>
      <TabBar />
    </>
  );
}
