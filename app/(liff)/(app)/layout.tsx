import { LiffHeader } from "@/components/liff/header";
import { TabBar } from "@/components/liff/tab-bar";
import { requireStore } from "@/lib/liff/require-store";

// Authenticated LIFF shell: redirects to /verify when no store context,
// then frames every dashboard page with the header + bottom tab bar.
export default async function LiffAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const store = await requireStore();
  return (
    <>
      <LiffHeader store={store} />
      <main className="flex-1">{children}</main>
      <TabBar />
    </>
  );
}
