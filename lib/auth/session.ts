import "server-only";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "admin_session";
const enc = new TextEncoder();

function getSecret(): string {
  return process.env.AUTH_SECRET || "dev-insecure-secret-change-me";
}

async function hmacKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

// Signed session token: `<adminId>.<HMAC-SHA256(adminId)>`.
async function signToken(adminId: string): Promise<string> {
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(), enc.encode(adminId));
  return `${adminId}.${Buffer.from(sig).toString("base64url")}`;
}

async function verifyToken(token: string): Promise<string | null> {
  const dot = token.lastIndexOf(".");
  if (dot < 0) return null;
  const adminId = token.slice(0, dot);
  const sig = Buffer.from(token.slice(dot + 1), "base64url");
  const ok = await crypto.subtle.verify("HMAC", await hmacKey(), sig, enc.encode(adminId));
  return ok ? adminId : null;
}

export async function setAdminSession(adminId: string): Promise<void> {
  const jar = await cookies();
  jar.set(ADMIN_COOKIE, await signToken(adminId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function getAdminSession(): Promise<string | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  return token ? verifyToken(token) : null;
}

export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(ADMIN_COOKIE);
}
