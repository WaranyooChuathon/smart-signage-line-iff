"use client";

import { useEffect, useState } from "react";

// Animates 0 → value with an ease-out cubic, matching the prototype's countUp.
export function CountUp({
  value,
  durationMs = 1100,
  className,
}: {
  value: number;
  durationMs?: number;
  className?: string;
}) {
  const [n, setN] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);

  return <span className={className}>{n.toLocaleString("en-US")}</span>;
}
