import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "gr_session";
export const SESSION_SECONDS = 60 * 60 * 8;
const ALLOWED_DOMAIN = "sfsu.edu";
const fallbackSecret = randomBytes(32).toString("hex");

// Accepts only name@sfsu.edu (no subdomains, no extra @ or odd characters).
export function normalizeSfsuEmail(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const email = input.trim().toLowerCase();
  if (email.length > 254) return null;
  return new RegExp(`^[a-z0-9._%+-]+@${ALLOWED_DOMAIN.replace(".", "\.")}$`).test(email) ? email : null;
}

function sign(payload: string) {
  const secret = process.env.SESSION_SECRET || fallbackSecret;
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

export function createSession(email: string): string {
  const payload = Buffer.from(JSON.stringify({ e: email, x: Date.now() + SESSION_SECONDS * 1000 })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function readSession(token: string | undefined): string | null {
  if (!token) return null;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof x === "number" && x > Date.now() ? normalizeSfsuEmail(e) : null;
  } catch { return null; }
}

export function sessionFromCookieHeader(header: string | null): string | null {
  const match = header?.split(/;\s*/).find(part => part.startsWith(`${SESSION_COOKIE}=`));
  return readSession(match?.slice(SESSION_COOKIE.length + 1));
}
