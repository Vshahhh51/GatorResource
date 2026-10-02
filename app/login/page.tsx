import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, SESSION_COOKIE } from "../../lib/session.ts";
import { Logo } from "../logo";
import LoginForm from "./login-form";

export const metadata = { title: "Sign in | GatorResource" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const target = typeof next === "string" && /^\/([^/\\]|$)/.test(next) ? next : "/";
  if (readSession((await cookies()).get(SESSION_COOKIE)?.value)) redirect(target);
  return <main className="login-page">
    <div className="login-card">
      <div className="brand"><Logo size={40}/></div>
      <h1>Student sign in</h1>
      <p className="hero-sub">Sign in with your SFSU email to request appointments. Browsing and searching resources is open to everyone.</p>
      <LoginForm next={target} />
      <p className="fine-print">Only @sfsu.edu addresses can sign in. This prototype checks the email domain and does not verify a password or inbox, so please don’t treat it as secure identity verification. Independent student-built prototype, not an official SFSU service.</p>
      <a className="back-link" href="/">← Continue without signing in</a>
    </div>
  </main>;
}
