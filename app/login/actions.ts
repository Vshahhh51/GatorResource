"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createSession, normalizeSfsuEmail, SESSION_COOKIE, SESSION_SECONDS } from "../../lib/session.ts";

function safeNext(value: unknown) {
  return typeof value === "string" && /^\/([^/\\]|$)/.test(value) ? value : "/";
}

export async function login(_previous: { error: string }, formData: FormData) {
  const email = normalizeSfsuEmail(formData.get("email"));
  if (!email) return { error: "Please use your SFSU email address ending in @sfsu.edu." };
  (await cookies()).set(SESSION_COOKIE, createSession(email), {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: SESSION_SECONDS
  });
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/login");
}
