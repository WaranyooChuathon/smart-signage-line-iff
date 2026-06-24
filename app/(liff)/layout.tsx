// LIFF theme container — beige canvas, mobile width, column layout so the
// header sticks to the top and the tab bar to the bottom.
export default function LiffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="liff-theme mx-auto flex min-h-[100dvh] w-full max-w-[480px] flex-1 flex-col">
      {children}
    </div>
  );
}
