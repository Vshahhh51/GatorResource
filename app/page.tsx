import { cookies } from "next/headers";
import { readSession, SESSION_COOKIE } from "../lib/session.ts";
import Portal from "./portal";

export const dynamic = "force-dynamic";

export default async function Home() {
  const email = readSession((await cookies()).get(SESSION_COOKIE)?.value);
  return <Portal email={email} />;
}
