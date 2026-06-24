import { AreaView } from "@/components/liff/area-view";
import { getSource, getToday } from "@/lib/data";
import { logPageView } from "@/lib/data/page-views";
import { currentBangkokHour } from "@/lib/liff/format";
import { requireStore } from "@/lib/liff/require-store";

const pad = (n: number) => String(n).padStart(2, "0");

export default async function AreaPage() {
  const store = await requireStore();
  await logPageView(store.id, "area");

  const date = getToday();
  const [readings, daily] = await Promise.all([
    getSource().getAreaReadings(store.id, date),
    getSource().getDailySummary(store.id, date),
  ]);

  // representative = the current Bangkok hour, fallback to the last reading
  const nowHour = currentBangkokHour();
  const reading =
    readings.find((r) => r.hour === nowHour) ?? readings[readings.length - 1];
  const hourLabel = `${pad(reading.hour)}:00 – ${pad((reading.hour + 1) % 24)}:00`;

  return (
    <AreaView
      areaCount={reading.areaCount}
      district={daily.district}
      hourLabel={hourLabel}
      temp={reading.temp}
      humidity={reading.humidity}
      pressure={reading.pressure}
    />
  );
}
