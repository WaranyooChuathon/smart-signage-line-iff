import "server-only";

// PBKDF2-SHA256 password hashing via Web Crypto (works in Node 20+ and the
// Cloudflare Workers runtime). Format: pbkdf2$<iterations>$<saltB64>$<hashB64>.
const ITERATIONS = 100_000;
const enc = new TextEncoder();

function b64(buf: ArrayBuffer): string {
  return Buffer.from(buf).toString("base64");
}

async function derive(password: string, salt: Uint8Array): Promise<ArrayBuffer> {
  const key = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]);
  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: ITERATIONS, hash: "SHA-256" },
    key,
    256,
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt);
  return `pbkdf2$${ITERATIONS}$${b64(salt.buffer)}$${b64(hash)}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, , saltB64, hashB64] = stored.split("$");
  if (scheme !== "pbkdf2" || !saltB64 || !hashB64) return false;
  const salt = new Uint8Array(Buffer.from(saltB64, "base64"));
  const hash = b64(await derive(password, salt));
  return hash === hashB64;
}
