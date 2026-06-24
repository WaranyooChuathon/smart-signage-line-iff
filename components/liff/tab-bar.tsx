"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

const TABS: { href: string; label: string; icon: ReactNode }[] = [
  {
    href: "/dashboard",
    label: "สรุป",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="9" rx="1" />
        <rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" />
        <rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    href: "/area",
    label: "พื้นที่",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="10" r="3" />
        <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 7 8 11.7z" />
      </svg>
    ),
  },
  {
    href: "/store-visits",
    label: "เข้าร้าน",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    href: "/flow",
    label: "Flow",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="18" r="3" />
        <path d="M6 9v6a3 3 0 003 3h6" />
      </svg>
    ),
  },
  {
    href: "/content",
    label: "โฆษณา",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 11l18-5v12L3 14v-3z" />
        <path d="M11.6 16.8a3 3 0 11-5.8-1.6" />
      </svg>
    ),
  },
];

export function TabBar() {
  const pathname = usePathname();
  return (
    <nav
      className="sticky bottom-0 z-50 mt-auto grid grid-cols-5 border-t backdrop-blur-xl"
      style={{
        borderColor: "var(--border)",
        background: "rgba(244,241,236,.92)",
      }}
    >
      {TABS.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors"
            style={{ color: active ? "var(--front-dark)" : "var(--text-3)" }}
          >
            <span className="h-5 w-5">{t.icon}</span>
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
