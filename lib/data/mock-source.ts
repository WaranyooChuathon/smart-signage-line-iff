import { generateDaySnapshot } from "@/lib/mock";
import type { SignageDataSource, StoreVisitsStat } from "./source";

// Derives every view from a single deterministic snapshot per (store, date).
export const mockSource: SignageDataSource = {
  async getDailySummary(storeId, date) {
    return generateDaySnapshot(storeId, date).daily;
  },

  async getAreaReadings(storeId, date) {
    return generateDaySnapshot(storeId, date).areaReadings;
  },

  async getStoreVisits(storeId, date): Promise<StoreVisitsStat> {
    const { area, storeVisits } = generateDaySnapshot(storeId, date).daily;
    return { area, storeVisits, captureRate: area === 0 ? 0 : storeVisits / area };
  },

  async getFlow(storeId, date) {
    return generateDaySnapshot(storeId, date).flow;
  },

  async getContent(storeId, date) {
    return generateDaySnapshot(storeId, date).content;
  },
};
