// Deterministic realistic mock generator — seed = `${storeId}:${date}`.
export * from "./types";
export { makeRng, type Rng } from "./rng";
export { generateDaySnapshot } from "./generator";
export { DEMO_STORES, DEFAULT_DEMO_STORE, type DemoStore } from "./stores";
