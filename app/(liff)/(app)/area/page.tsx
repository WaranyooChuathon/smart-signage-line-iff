import { AreaView } from "@/components/liff/area-view";
import { LiffHeader } from "@/components/liff/header";
import { getSource, getToday } from "@/lib/data";
import { logPageView } from "@/lib/data/page-views";
import { lastCompletedHour, lastHourWindow, thaiDate } from "@/lib/liff/format";
import { requireStore } from "@/lib/liff/require-store";

export default async function AreaPage() {
  const store = await requireStore();
  await logPageView(store.id, "area");

  const date = getToday();
  const [readings, daily] = await Promise.all([
    getSource().getAreaReadings(store.id, date),
    getSource().getDailySummary(store.id, date),
  ]);

  // show the most recently completed hour (e.g. at 11:49 → the 10:00–11:00 reading)
  const dataHour = lastCompletedHour();
  const reading =
    readings.find((r) => r.hour === dataHour) ?? readings[readings.length - 1];
  const hourWindow = lastHourWindow();

  return (
    <>
      <LiffHeader store={store} dateLabel={thaiDate(date)} timeLabel={`ช่วง ${hourWindow} น.`} />
      <AreaView
        areaCount={reading.areaCount}
        district={daily.district}
        hourLabel={hourWindow}
        temp={reading.temp}
        humidity={reading.humidity}
        pressure={reading.pressure}
      />
    </>
  );
}
