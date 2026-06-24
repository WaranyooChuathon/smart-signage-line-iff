import { makeRng, type Rng } from "./rng";
import {
  AGE_KEYS,
  FLOW_CATEGORIES,
  GENDER_KEYS,
  type DaySnapshot,
  type FlowCategory,
} from "./types";

// Typical foot-traffic shape across 24 hours (index 0 = 00:00).
// Low overnight, lunch peak ~13:00, evening peak ~18:00.
const HOUR_WEIGHTS = [
  0.06, 0.05, 0.04, 0.04, 0.05, 0.08, 0.15, 0.3, 0.45, 0.6, 0.75, 0.85, 0.95,
  1.0, 0.82, 0.74, 0.7, 0.85, 1.0, 0.95, 0.78, 0.58, 0.36, 0.2,
];

// Generic, brand-free ad creatives (company-safe).
const AD_NAMES = [
  "โปรเครื่องดื่มฤดูร้อน",
  "สมาชิกใหม่รับส่วนลด",
  "เมนูแนะนำประจำสัปดาห์",
  "แคมเปญสะสมแต้ม",
  "สินค้ามาใหม่",
];

/** Split `total` across `weights`, returning integers that sum to exactly `total`. */
function distribute(total: number, weights: number[]): number[] {
  const sum = weights.reduce((a, b) => a + b, 0);
  const raw = weights.map((w) => (total * w) / sum);
  const floored = raw.map(Math.floor);
  let remainder = total - floored.reduce((a, b) => a + b, 0);
  // hand out the remainder to the largest fractional parts
  const order = raw
    .map((v, i) => ({ i, frac: v - Math.floor(v) }))
    .sort((a, b) => b.frac - a.frac);
  for (let k = 0; k < order.length && remainder > 0; k++, remainder--) {
    floored[order[k].i]++;
  }
  return floored;
}

/** Stable per-store size multiplier so different stores feel different. */
function sizeFactor(storeId: string): number {
  return makeRng(`size:${storeId}`).float(0.6, 1.4);
}

function genAreaReadings(rng: Rng, date: string, areaTotal: number) {
  const peak = Math.round(areaTotal * rng.float(0.1, 0.18));
  const tempBase = rng.float(29, 33);
  const humidityBase = rng.float(62, 72);
  const pressureBase = rng.float(1010, 1014);
  return HOUR_WEIGHTS.map((w, hour) => {
    const noise = rng.float(0.85, 1.15);
    const hh = String(hour).padStart(2, "0");
    return {
      hour,
      ts: new Date(`${date}T${hh}:00:00+07:00`),
      areaCount: Math.max(0, Math.round(peak * w * noise)),
      temp: +(tempBase + 2 * w - 1 + rng.float(-0.4, 0.4)).toFixed(1),
      humidity: Math.round(humidityBase - 12 * w + rng.float(-3, 3)),
      pressure: Math.round(pressureBase + rng.float(-2, 2)),
    };
  });
}

function genFlow(rng: Rng, areaTotal: number) {
  const inbound = Math.round(areaTotal * rng.float(1.1, 1.4));
  const outbound = Math.round(areaTotal * rng.float(1.0, 1.3));
  const internal = Math.round(areaTotal * rng.float(0.3, 0.5));

  const inWeights = [0.34, 0.26, 0.2, 0.13, 0.07].map((w) => w * rng.float(0.9, 1.1));
  const outWeights = [0.3, 0.28, 0.22, 0.13, 0.07].map((w) => w * rng.float(0.9, 1.1));
  const inVals = distribute(inbound, inWeights);
  const outVals = distribute(outbound, outWeights);

  const categories: FlowCategory[] = [];
  FLOW_CATEGORIES.forEach((category, i) => {
    categories.push({ direction: "inbound", category, value: inVals[i] });
    categories.push({ direction: "outbound", category, value: outVals[i] });
  });
  return { inbound, internal, outbound, categories };
}

function genContent(rng: Rng, areaTotal: number, storeVisits: number) {
  const totalPlays = Math.round(((areaTotal + storeVisits) / 2) * rng.float(2.6, 3.6));

  const maleRatio = rng.float(0.4, 0.46);
  const male = Math.round(totalPlays * maleRatio);
  const female = totalPlays - male;

  const ageWeights = [
    rng.float(0.4, 0.45), // adult
    rng.float(0.22, 0.27), // female-specific
    rng.float(0.15, 0.2), // elderly
    rng.float(0.12, 0.17), // child
  ];
  const ageVals = distribute(totalPlays, ageWeights);

  const breakdown = [
    ...GENDER_KEYS.map((key, i) => ({
      dimension: "gender" as const,
      key,
      value: i === 0 ? male : female,
    })),
    ...AGE_KEYS.map((key, i) => ({
      dimension: "age" as const,
      key,
      value: ageVals[i],
    })),
  ];

  const adWeights = AD_NAMES.map(() => rng.float(0.5, 1.5)).sort((a, b) => b - a);
  const adVals = distribute(totalPlays, adWeights);
  const ads = AD_NAMES.map((adName, i) => ({ adName, plays: adVals[i] })).sort(
    (a, b) => b.plays - a.plays,
  );

  return { totalPlays, breakdown, ads };
}

/**
 * Deterministic realistic snapshot for one store on one day.
 * Same (storeId, date) always returns the same data.
 */
export function generateDaySnapshot(storeId: string, date: string): DaySnapshot {
  const rng = makeRng(`${storeId}:${date}`);
  const factor = sizeFactor(storeId);

  const district = Math.round(rng.int(800, 2200) * factor);
  const area = Math.round(district * rng.float(0.22, 0.34));
  // capture rate: share of nearby (Area) people who actually enter the store
  const storeVisits = Math.round(area * rng.float(0.32, 0.46));

  return {
    storeId,
    date,
    daily: { district, area, storeVisits },
    areaReadings: genAreaReadings(rng, date, area),
    flow: genFlow(rng, area),
    content: genContent(rng, area, storeVisits),
  };
}
