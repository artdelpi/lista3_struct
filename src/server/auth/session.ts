import crypto from "node:crypto";
import { env } from "@/env";
import type { PrismaClient } from "@prisma/client";

const COOKIE_NAME = "betcomp_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

type SessionPayload = {
  uid: number;
  exp: number; // unix seconds
};

export type AppSession =
  | {
      user: {
        id: number;
        email: string;
        nome_usuario: string;
      };
    }
  | null;

function b64urlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function b64urlDecode(s: string): Buffer {
  const pad = 4 - (s.length % 4 || 4);
  const base64 = (s + "=".repeat(pad)).replaceAll("-", "+").replaceAll("_", "/");
  return Buffer.from(base64, "base64");
}

function sign(data: string): string {
  const h = crypto.createHmac("sha256", env.AUTH_SECRET);
  h.update(data);
  return b64urlEncode(h.digest());
}

function timingSafeEq(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return crypto.timingSafeEqual(ab, bb);
}

export function createSessionToken(userId: number): string {
  const payload: SessionPayload = {
    uid: userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payloadPart = b64urlEncode(Buffer.from(JSON.stringify(payload), "utf8"));
  const sig = sign(payloadPart);
  return `${payloadPart}.${sig}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const [payloadPart, sig] = token.split(".");
  if (!payloadPart || !sig) return null;

  const expected = sign(payloadPart);
  if (!timingSafeEq(sig, expected)) return null;

  try {
    const payload = JSON.parse(b64urlDecode(payloadPart).toString("utf8")) as SessionPayload;
    if (typeof payload.uid !== "number" || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getCookie(headers: Headers, name: string): string | null {
  const raw = headers.get("cookie");
  if (!raw) return null;

  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    const idx = p.indexOf("=");
    if (idx === -1) continue;
    const k = p.slice(0, idx);
    const v = p.slice(idx + 1);
    if (k === name) return decodeURIComponent(v);
  }
  return null;
}

export async function getSessionFromHeaders(db: PrismaClient, headers: Headers): Promise<AppSession> {
  const token = getCookie(headers, COOKIE_NAME);
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  const user = await db.usuario.findUnique({
    where: { id: payload.uid },
    select: { id: true, email: true, nome_usuario: true },
  });

  if (!user) return null;

  return { user };
}

export function getSessionCookieName(): string {
  return COOKIE_NAME;
}
