import type {
  AreaReading,
  ContentSnapshot,
  DailyMetric,
  FlowSnapshot,
} from "@/lib/mock";

export interface StoreVisitsStat {
  area: number;
  storeVisits: number;
  /** capture rate = store visits ÷ area, 0–1 */
  captureRate: number;
}

// Every page reads through this interface. Mock and D1 both implement it,
// returning identical shapes so pages never know which source they hit.
export interface SignageDataSource {
  getDailySummary(storeId: string, date: string): Promise<DailyMetric>;
  getAreaReadings(storeId: string, date: string): Promise<AreaReading[]>;
  getStoreVisits(storeId: string, date: string): Promise<StoreVisitsStat>;
  getFlow(storeId: string, date: string): Promise<FlowSnapshot>;
  getContent(storeId: string, date: string): Promise<ContentSnapshot>;
}
