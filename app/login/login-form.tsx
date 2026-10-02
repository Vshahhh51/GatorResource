"use client";

import { useActionState } from "react";
import { login } from "./actions";

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, { error: "" });
  return <form action={action} className="login-form" noValidate>
    <input type="hidden" name="next" value={next} />
    <label htmlFor="email">SFSU email</label>
    <input id="email" name="email" type="email" inputMode="email" autoComplete="email" placeholder="you@sfsu.edu" required aria-describedby={state.error ? "login-error" : undefined} aria-invalid={state.error ? true : undefined}/>
    {state.error && <p id="login-error" className="error" role="alert">{state.error}</p>}
    <button className="primary-button" type="submit" disabled={pending}>{pending ? "Signing in…" : "Continue"}</button>
  </form>;
}
