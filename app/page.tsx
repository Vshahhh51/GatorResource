"use client";

import { useRef, useState } from "react";
import { resources, byId, type Resource } from "@/lib/resources";
import type { Match, MatchResult } from "@/lib/matching";

const examples = [
  { label: "Food + a part-time job", text: "I’m struggling to afford groceries and looking for a part-time job. I have classes during the day." },
  { label: "A little academic support", text: "I’m falling behind in math and need help planning my classes. I can only meet online." },
  { label: "Housing feels uncertain", text: "I’m worried about paying rent next month and could use help finding housing support." }
];
const categories = ["All resources", ...new Set(resources.map(r => r.category))];

function ResourceCard({ resource, match, index }: { resource: Resource; match?: Match; index?: number }) {
  return <article className="resource-card">
    <div className="card-top"><span className="category">{resource.category}</span>{index !== undefined && <span className="card-number">0{index + 1}</span>}</div>
    <h3>{resource.name}</h3>
    <p>{resource.description}</p>
    {match && <div className="ai-reason"><span className="eyebrow">✧ AI match explanation</span><p>{match.reason}</p><p className="constraint">{match.constraintNote}</p></div>}
    <div className="next-step"><span className="eyebrow">Your next step · from the official source</span><p>{resource.nextStep}</p></div>
    <details><summary>Availability & eligibility</summary><p>{resource.availability}</p><p>{resource.eligibility}</p></details>
    <a className="resource-link" href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">Visit official website <span aria-hidden="true">↗</span></a>
    <small>Source reviewed {resource.reviewedAt}</small>
  </article>;
}

export default function Home() {
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
    <header className="header"><a className="brand" href="/" aria-label="GatorResource home"><span className="brand-icon" aria-hidden="true">g.</span>Gator<span>Resource</span></a><nav aria-label="Main navigation"><a href="#directory">Explore resources <span aria-hidden="true">↗</span></a><span className="prototype">Student-built prototype</span></nav></header>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy"><div className="hero-tag"><span/> FOR THE SF STATE COMMUNITY</div><h1 id="hero-title">You don’t have to<br/>figure it out <em>alone.</em></h1><p>Life at college is a lot. Tell us what’s on your mind,<br className="desktop-break"/> and find campus support for your next step.</p><div className="hero-foot"><span className="tiny-star">✳</span> A little guidance. A place to start.</div></div>
        <div className="hero-art" aria-hidden="true"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-center">g<span>↗</span></div><div className="float-tag tag-one">✦ Your wellbeing</div><div className="float-tag tag-two">⌂ Your essentials</div><div className="float-tag tag-three">↗ Your future</div><span className="art-star">✳</span></div>
      </section>
      <section className="search-panel" aria-labelledby="search-title">
        <div className="section-intro"><div><span className="eyebrow">LET’S START WITH YOU</span><h2 id="search-title">What could you use a hand with?</h2></div><span className="gemini-badge">✧ Powered by Gemini</span></div>
        <form onSubmit={search}>
          <label className="sr-only" htmlFor="description">Describe your needs</label>
          <textarea ref={input} id="description" maxLength={2000} value={description} onChange={e => replaceDescription(e.target.value)} placeholder="Maybe it’s groceries, finding a job, a tough class, or a few things at once…" aria-describedby="privacy-note"/>
          <div className="example-row"><span>Try an example</span>{examples.map(example => <button type="button" className="example" key={example.label} onClick={() => { replaceDescription(example.text); input.current?.focus(); }}>{example.label}<span aria-hidden="true"> ↗</span></button>)}</div>
          <div className="search-actions"><p id="privacy-note">Your description is sent to Google Gemini. Please leave out names, student IDs, and private records. Searches stay in temporary session memory; Google’s data policies still apply.</p><div className="action-buttons">{(description || result || error) && <button className="clear-button" type="button" onClick={() => { replaceDescription(""); input.current?.focus(); }}>Clear</button>}<button className="primary-button" type="submit" disabled={loading}>{loading ? "Finding support…" : "Find my resources"}<span aria-hidden="true"> {loading ? "◌" : "→"}</span></button></div></div>
        </form>
        <div aria-live="polite" aria-atomic="true">{loading && <p className="status">Considering your needs and constraints…</p>}{error && <p className="error" role="alert">{error}</p>}</div>
      </section>
      {result && <section className="results" aria-labelledby="results-title" aria-live="polite"><div className="section-intro"><div><span className="eyebrow">A PLACE TO START</span><h2 id="results-title">{result.matches.length ? "Support that may fit your needs" : "No close matches in this directory"}</h2></div>{result.matches.length > 0 && <button className="secondary-button" onClick={download}>Save next steps ↓</button>}</div><p className="section-description">{result.matches.length ? "AI explanations can be mistaken. Confirm availability and eligibility with program staff." : "This small directory doesn’t cover every SFSU service. Browse below or try describing a different need."}</p><div className="resource-grid">{result.matches.map((match, index) => <ResourceCard key={match.resourceId} resource={byId.get(match.resourceId)!} match={match} index={index}/>)}</div>{result.uncoveredNeeds.length > 0 && <div className="uncovered"><h3>Needs we couldn’t fully cover</h3><span className="eyebrow">AI assessment</span><ul>{result.uncoveredNeeds.map((need, index) => <li key={index}>{need}</li>)}</ul></div>}</section>}
      <section id="directory" className="directory" aria-labelledby="directory-title"><div className="section-intro"><div><span className="eyebrow">FIND YOUR OWN WAY</span><h2 id="directory-title">Good places to turn.</h2><p className="section-description">Explore {resources.length} campus resources. No AI search needed.</p></div><span className="source-badge"><span/> Official SFSU sources</span></div><div className="filters" role="group" aria-label="Filter resources by category">{categories.map(item => <button key={item} aria-pressed={category === item} className={category === item ? "filter active" : "filter"} onClick={() => setCategory(item)}>{item}</button>)}</div><div className="resource-grid">{resources.filter(r => category === "All resources" || r.category === category).map(resource => <ResourceCard key={resource.id} resource={resource}/>)}</div></section>
      <aside className="care-note"><span aria-hidden="true">✳</span><div><h3>You’re more than your to-do list.</h3><p>Asking for support is a step forward. These resources are a starting point; campus staff can help you explore what comes next.</p></div></aside>
    </main>
    <footer><a className="brand" href="/">Gator<span>Resource</span></a><p>Made with care for SF State students.<br/>Independent prototype · Not an official SFSU service or emergency-response tool.</p><a href="#main">Back to top ↑</a></footer>
  </>;
}
