"use client";

import { useRef, useState } from "react";
import { resources, byId, type Resource } from "@/lib/resources";
import type { Match, MatchResult } from "@/lib/matching";
import { Icon, categoryIcon } from "./icons";
import { Logo } from "./logo";
import { logout } from "./login/actions";

const examples = [
  { label: "Food + a part-time job", text: "I’m struggling to afford groceries and looking for a part-time job. I have classes during the day." },
  { label: "A little academic support", text: "I’m falling behind in math and need help planning my classes. I can only meet online." },
  { label: "Housing feels uncertain", text: "I’m worried about paying rent next month and could use help finding housing support." }
];
const categories = ["All resources", ...new Set(resources.map(r => r.category))];

function ResourceCard({ resource, match, index }: { resource: Resource; match?: Match; index?: number }) {
  return <article className="resource-card">
    <div className="card-top"><span className="card-icon"><Icon name={categoryIcon[resource.category]} size={20}/></span><span className="category">{resource.category}</span>{index !== undefined && <span className="card-number" aria-label={`Match ${index + 1}`}>{index + 1}</span>}</div>
    <h3>{resource.name}</h3>
    <p className="card-desc">{resource.description}</p>
    {match && <div className="ai-reason"><span className="label">AI explanation</span><p>{match.reason}</p>{match.constraintNote && <p className="constraint">{match.constraintNote}</p>}</div>}
    <div className="next-step"><span className="label">Next step · official source</span><p>{resource.nextStep}</p></div>
    <dl className="contact">
      <div><dt><Icon name="clock" size={14}/> Office hours</dt><dd>{resource.contact.officeHours}</dd></div>
      <div><dt><Icon name="pin" size={14}/> Location</dt><dd>{resource.contact.location}</dd></div>
      <div><dt><Icon name="phone" size={14}/> Phone</dt><dd><a href={"tel:" + resource.contact.phone.replace(/[^d+]/g, "").slice(0, 10)}>{resource.contact.phone}</a></dd></div>
      <div><dt><Icon name="mail" size={14}/> Email</dt><dd><a href={"mailto:" + resource.contact.email}>{resource.contact.email}</a></dd></div>
    </dl>
    <details><summary>Program availability &amp; eligibility</summary><p>{resource.availability}</p><p>{resource.eligibility}</p></details>
    <div className="card-foot">
      <a className="book-link" href={"/book/" + resource.id}>Request appointment</a>
      <a className="resource-link" href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">Official page <span aria-hidden="true">↗</span></a>
      <small>Checked {resource.reviewedAt}</small>
    </div>
  </article>;
}

export default function Portal({ email }: { email: string | null }) {
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<MatchResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("All resources");
  const requestVersion = useRef(0);
  const controller = useRef<AbortController | null>(null);
  const input = useRef<HTMLTextAreaElement>(null);

  function replaceDescription(text: string) {
    requestVersion.current += 1;
    controller.current?.abort();
    setLoading(false); setResult(null); setError(""); setDescription(text);
  }
  async function search(event: React.FormEvent) {
    event.preventDefault();
    controller.current?.abort();
    const version = ++requestVersion.current;
    setResult(null); setError("");
    if (!description.trim()) { setError("Tell us a little about what you need first."); input.current?.focus(); return; }
    setLoading(true);
    const abort = new AbortController(); controller.current = abort;
    const timeout = window.setTimeout(() => abort.abort(), 30000);
    try {
      const response = await fetch("/api/match", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ description }), signal: abort.signal });
      const data = await response.json();
      if (version !== requestVersion.current) return;
      if (!response.ok) setError(data.error || "Search is unavailable. You can browse the directory below.");
      else setResult(data);
    } catch {
      if (version === requestVersion.current) setError("We couldn’t complete your search. Try again or browse resources below.");
    } finally {
      window.clearTimeout(timeout);
      if (version === requestVersion.current) setLoading(false);
    }
  }
  function download() {
    if (!result) return;
    const text = ["GatorResource · Your next steps", "Independent prototype. Confirm details with program staff.",
      ...result.matches.flatMap(match => { const r = byId.get(match.resourceId)!; return ["", r.name, `AI explanation: ${match.reason}`, `AI constraint note: ${match.constraintNote}`, `Verified next step: ${r.nextStep}`, r.availability, r.eligibility, `Official source: ${r.sourceUrl}`, `Reviewed: ${r.reviewedAt}`]; }),
      ...(result.uncoveredNeeds.length ? ["", "Not covered (AI assessment):", ...result.uncoveredNeeds] : [])].join("\n");
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a"); link.href = url; link.download = "gator-resource-next-steps.txt"; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="header">
      <a className="brand" href="/" aria-label="GatorResource home"><Logo size={34}/></a>
      <nav aria-label="Main navigation"><a className="nav-link" href="#directory">Browse</a>{email ? <><span className="who">{email}</span><form action={logout}><button className="text-button" type="submit">Sign out</button></form></> : <a className="nav-cta" href="/login">Student sign in</a>}</nav>
    </header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <p className="hero-tag">Hey, fellow Gator</p>
        <h1 id="hero-title">What could you use <em>a hand</em> with?</h1>
        <p className="hero-sub">Describe it in your own words. We’ll suggest SF State support and a first step.</p>
        <form className="search-form" onSubmit={search}>
          <label className="sr-only" htmlFor="description">Describe your needs</label>
          <textarea ref={input} id="description" maxLength={2000} value={description} onChange={e => replaceDescription(e.target.value)} placeholder="Groceries, a job, a tough class, or a few things at once…" aria-describedby="privacy-note"/>
          <div className="example-row">{examples.map(example => <button type="button" className="example" key={example.label} onClick={() => { replaceDescription(example.text); input.current?.focus(); }}>{example.label}</button>)}</div>
          <div className="search-actions">
            <div className="action-buttons">
              <button className="primary-button" type="submit" disabled={loading}>{loading ? "Finding support…" : "Find resources"}</button>
              {(description || result || error) && <button className="text-button" type="button" onClick={() => { replaceDescription(""); input.current?.focus(); }}>Clear</button>}
            </div>
            <p id="privacy-note">Your description is sent to Google Gemini. Please leave out names, student IDs, and private records. Searches stay in temporary session memory; Google’s data policies still apply.</p>
          </div>
        </form>
        <div aria-live="polite" aria-atomic="true">{loading && <p className="status"><span className="spinner" aria-hidden="true"/>Considering your needs and constraints…</p>}{error && <p className="error" role="alert">{error}</p>}</div>
      </section>

      {result && <section className="results" aria-labelledby="results-title" aria-live="polite">
        <div className="section-intro"><h2 id="results-title">{result.matches.length ? "Support that may fit" : "No close matches in this directory"}</h2>{result.matches.length > 0 && <button className="outline-button" onClick={download}>Save next steps</button>}</div>
        <p className="section-description">{result.matches.length ? "AI explanations can be mistaken. Confirm availability and eligibility with program staff." : "This small directory doesn’t cover every SFSU service. Browse below or try describing a different need."}</p>
        <div className="resource-grid">{result.matches.map((match, index) => <ResourceCard key={match.resourceId} resource={byId.get(match.resourceId)!} match={match} index={index}/>)}</div>
        {result.uncoveredNeeds.length > 0 && <div className="uncovered"><h3>Not fully covered</h3><span className="label">AI assessment</span><ul>{result.uncoveredNeeds.map((need, index) => <li key={index}>{need}</li>)}</ul></div>}
      </section>}

      <section id="directory" className="directory" aria-labelledby="directory-title">
        <div className="section-intro"><div><h2 id="directory-title">Browse campus support</h2><p className="section-description">{resources.length} resources from official SFSU pages. No AI needed.</p></div></div>
        <div className="filters" role="group" aria-label="Filter resources by category">{categories.map(item => <button key={item} aria-pressed={category === item} className={category === item ? "filter active" : "filter"} onClick={() => setCategory(item)}>{item}</button>)}</div>
        <div className="resource-grid">{resources.filter(r => category === "All resources" || r.category === category).map(resource => <ResourceCard key={resource.id} resource={resource}/>)}</div>
      </section>
    </main>
    <footer><p>Independent student-built prototype · Not an official SFSU service or emergency-response tool. The directory is small and doesn’t cover every campus service. Asking for support is a step forward.</p><a href="#main">Back to top ↑</a></footer>
  </>;
}
