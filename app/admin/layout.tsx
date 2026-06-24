// Outer admin container — neutral canvas. The (panel) group adds the
// authenticated chrome (nav + guard); /admin/login renders bare and centered.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col bg-zinc-50">{children}</div>;
}
