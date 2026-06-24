import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config — no R2 incremental cache for the demo. Bindings (D1) work
// through getCloudflareContext() once declared in wrangler.jsonc.
export default defineCloudflareConfig({});
