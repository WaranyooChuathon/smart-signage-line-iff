import "server-only";
import { drizzle, type DrizzleD1Database } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import * as schema from "./schema";

export type DB = DrizzleD1Database<typeof schema>;

// Drizzle bound to the Cloudflare D1 binding (`DB` in wrangler.jsonc), resolved
// per-request via OpenNext's getCloudflareContext. Only called in real mode.
export function getDb(): DB {
  const { env } = getCloudflareContext();
  return drizzle(env.DB, { schema });
}
