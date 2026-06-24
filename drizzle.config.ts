import { defineConfig } from "drizzle-kit";

// `generate` works offline (no credentials needed).
// `migrate` / `push` / `studio` hit Cloudflare D1 over HTTP — set the
// CLOUDFLARE_* vars in .env.local first (see .env.example). Wired in P4.
export default defineConfig({
  dialect: "sqlite",
  driver: "d1-http",
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
    databaseId: process.env.CLOUDFLARE_DATABASE_ID!,
    token: process.env.CLOUDFLARE_D1_TOKEN!,
  },
});
