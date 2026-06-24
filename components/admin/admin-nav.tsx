"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/lib/auth/actions";

const LINKS = [
  { href: "/admin/stores", label: "ร้านค้า" },
  { href: "/admin/audit", label: "Audit Log" },
  { href: "/admin/analytics", label: "Analytics" },
];

export function AdminNav({ adminName }: { adminName: string }) {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="text-sm font-bold tracking-tight">Signage Management</span>
          <nav className="flex gap-1">
            {LINKS.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    active ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-black/5"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-zinc-500 sm:inline">{adminName}</span>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="rounded-full border border-black/10 px-3 py-1.5 text-sm font-medium text-zinc-600 transition-colors hover:bg-black/5"
            >
              ออกจากระบบ
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
