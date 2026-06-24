import { CATEGORY_LABELS } from "@/lib/mock";
import type { Store } from "@/lib/data/stores";
import { thaiDate } from "@/lib/liff/format";

export function LiffHeader({
  store,
  dateLabel,
  timeLabel = "ข้อมูลทั้งวัน",
}: {
  store: Store;
  dateLabel?: string;
  timeLabel?: string;
}) {
  const date = dateLabel ?? thaiDate(new Date());
  return (
    <header
      className="sticky top-0 z-50 border-b px-5 pt-3.5 pb-3.5 backdrop-blur-xl"
      style={{
        borderColor: "var(--border)",
        background: "rgba(244,241,236,.88)",
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-linear-to-br from-zinc-900 to-zinc-700 text-[15px] font-extrabold text-white">
            {store.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-[16px] font-bold leading-tight tracking-tight">
              {store.name}
            </h1>
            <span className="text-[11.5px]" style={{ color: "var(--text-3)" }}>
              {store.subtitle || CATEGORY_LABELS[store.category]}
            </span>
          </div>
        </div>
        <div
          className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold"
          style={{
            background: "var(--area-light)",
            borderColor: "var(--area-mid)",
            color: "var(--area)",
          }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--area)", animation: "liff-blink 2s ease-in-out infinite" }}
          />
          Live
        </div>
      </div>
      <div className="mt-2.5 flex gap-3.5 text-[12px]" style={{ color: "var(--text-2)" }}>
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--text-3)" }}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {date}
        </span>
        <span className="flex items-center gap-1.5">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--text-3)" }}>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          {timeLabel}
        </span>
      </div>
    </header>
  );
}
