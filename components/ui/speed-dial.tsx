"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export interface SpeedDialItem {
  href: string;
  label: string;
  icon: ReactNode;
}

// Floating action button that blooms its items along a quarter-circle arc
// (up → left) from the bottom-right. Reused by LIFF and Admin shells.
export function SpeedDial({
  items,
  accent = "#f59e0b",
  className = "bottom-6 right-5",
  mainLabel = "เมนูลัด",
  anchor = "fixed",
}: {
  items: SpeedDialItem[];
  accent?: string;
  /** position utilities for the container (default bottom-right) */
  className?: string;
  mainLabel?: string;
  /** "fixed" = viewport (admin) · "absolute" = nearest positioned ancestor (LIFF device frame) */
  anchor?: "fixed" | "absolute";
}) {
  const [open, setOpen] = useState(false);

  // close when navigating to another route — React's recommended
  // "adjust state during render" pattern (no effect needed).
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    if (open) setOpen(false);
  }

  // close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const n = items.length;
  const radius = 140;
  const startDeg = 90; // straight up
  const endDeg = 186; // past straight-left
  const offset = (i: number) => {
    const t = n <= 1 ? 138 : startDeg + ((endDeg - startDeg) * i) / (n - 1);
    const rad = (t * Math.PI) / 180;
    return { x: Math.round(radius * Math.cos(rad)), y: Math.round(-radius * Math.sin(rad)) };
  };

  return (
    <>
      {/* backdrop — click outside to close */}
      <button
        type="button"
        aria-hidden={!open}
        tabIndex={-1}
        onClick={() => setOpen(false)}
        className={`${anchor} inset-0 z-40 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        style={{ background: "rgba(0,0,0,.05)" }}
      />

      <div className={`${anchor} z-50 ${className}`}>
        {items.map((item, i) => {
          const { x, y } = offset(i);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              title={item.label}
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="absolute bottom-1.5 right-1.5 flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-white shadow-md transition-all duration-300 ease-out motion-reduce:transition-none"
              style={{
                transform: open ? `translate(${x}px, ${y}px)` : "translate(0,0)",
                opacity: open ? 1 : 0,
                pointerEvents: open ? "auto" : "none",
                transitionDelay: `${open ? i * 30 : 0}ms`,
                color: accent,
              }}
            >
              <span className="flex h-5 w-5 items-center justify-center">{item.icon}</span>
            </Link>
          );
        })}

        <button
          type="button"
          aria-expanded={open}
          aria-label={mainLabel}
          onClick={() => setOpen((v) => !v)}
          className="relative flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg transition-transform duration-300 active:scale-95 motion-reduce:transition-none"
          style={{ background: accent }}
        >
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            className="transition-transform duration-300 motion-reduce:transition-none"
            style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
    </>
  );
}
