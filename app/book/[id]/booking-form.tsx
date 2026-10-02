"use client";

import { useState } from "react";
import { Icon } from "../../icons";

type Office = { id: string; name: string; officeHours: string; location: string; phone: string; email: string; sourceUrl: string };
const windows = ["Morning", "Midday", "Afternoon", "I’m flexible"];
const modes = ["In person", "Phone", "Video (if offered)"];

function tomorrow() {
  const d = new Date(); d.setDate(d.getDate() + 1);
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
function pretty(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" });
}

export default function BookingForm({ resource, studentEmail }: { resource: Office; studentEmail: string }) {
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(windows[0]);
  const [mode, setMode] = useState(modes[0]);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const subject = `Appointment request: ${resource.name}`;
  const body = [
    `Hello ${resource.name} team,`, "",
    "I’d like to request an appointment.", "",
    `Preferred date: ${date ? pretty(date) : ""}`,
    `Preferred time: ${slot}`,
    `Preferred format: ${mode}`,
    note.trim() ? `What I’d like help with: ${note.trim()}` : "",
    "", "Please let me know what times are available and anything I should prepare.", "",
    `Reply to: ${studentEmail}`, "", "Thank you,", "(your name)"
  ].filter((line, i, all) => line !== "" || all[i - 1] !== "").join("\n");
  const mailto = `mailto:${resource.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!date) return setError("Pick a preferred date.");
    if (date < tomorrow()) return setError("Pick a date from tomorrow onward.");
    const day = new Date(date + "T12:00:00").getDay();
    if (day === 0 || day === 6) return setError("These offices list weekday hours. Please pick a weekday.");
    setError(""); setDone(true);
  }
  function downloadCalendar() {
    const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
    const end = new Date(date + "T12:00:00"); end.setDate(end.getDate() + 1);
    const esc = (text: string) => text.replace(/,/g, "\\,");
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//GatorResource//EN", "BEGIN:VEVENT", `UID:${stamp}-${resource.id}@gatorresource`, `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${date.replace(/-/g, "")}`, `DTEND;VALUE=DATE:${end.toISOString().slice(0, 10).replace(/-/g, "")}`,
      `SUMMARY:Requested: ${esc(resource.name)}`, `LOCATION:${esc(resource.location)}`,
      `DESCRIPTION:Appointment REQUEST - not confirmed. Preferred time: ${slot}. Office hours: ${esc(resource.officeHours)}`, "END:VEVENT", "END:VCALENDAR"];
    const url = URL.createObjectURL(new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a"); a.href = url; a.download = "appointment-request.ics"; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <div className="book-grid">
    {!done ? <form className="book-form" onSubmit={submit} noValidate>
      <label htmlFor="date">Preferred date</label>
      <input id="date" type="date" min={tomorrow()} value={date} onChange={e => setDate(e.target.value)} required />
      <fieldset><legend>Preferred time</legend><div className="choice-row">{windows.map(w => <label key={w} className={slot === w ? "choice on" : "choice"}><input type="radio" name="slot" checked={slot === w} onChange={() => setSlot(w)} />{w}</label>)}</div></fieldset>
      <fieldset><legend>How would you like to meet?</legend><div className="choice-row">{modes.map(m => <label key={m} className={mode === m ? "choice on" : "choice"}><input type="radio" name="mode" checked={mode === m} onChange={() => setMode(m)} />{m}</label>)}</div></fieldset>
      <label htmlFor="note">What would you like help with? <span className="optional">(optional)</span></label>
      <textarea id="note" maxLength={300} value={note} onChange={e => setNote(e.target.value)} placeholder="A sentence or two is plenty. Please leave out student IDs and private records." />
      {error && <p className="error" role="alert">{error}</p>}
      <button className="primary-button" type="submit">Continue</button>
    </form> : <div className="book-form done" aria-live="polite">
      <h2>Almost there</h2>
      <p>Your request isn’t sent yet. Open the email draft, add your name, and send it from your SFSU email. <strong>This is a request, not a confirmed appointment</strong>: the office will reply with what’s available.</p>
      <ul className="summary"><li><b>Preferred date</b>{pretty(date)}</li><li><b>Preferred time</b>{slot}</li><li><b>Format</b>{mode}</li></ul>
      <div className="done-actions">
        <a className="primary-button" href={mailto}>Open email draft</a>
        <button className="outline-button" type="button" onClick={downloadCalendar}>Add reminder to calendar</button>
        <button className="text-button" type="button" onClick={() => setDone(false)}>Edit</button>
      </div>
    </div>}
    <aside className="book-aside">
      <h3>{resource.name}</h3>
      <dl className="contact">
        <div><dt><Icon name="clock" size={14}/> Office hours</dt><dd>{resource.officeHours}</dd></div>
        <div><dt><Icon name="pin" size={14}/> Location</dt><dd>{resource.location}</dd></div>
        <div><dt><Icon name="phone" size={14}/> Phone</dt><dd>{resource.phone}</dd></div>
        <div><dt><Icon name="mail" size={14}/> Email</dt><dd>{resource.email}</dd></div>
      </dl>
      <p className="aside-note">GatorResource is an independent prototype and can’t see office calendars or confirm bookings. Some offices also use their own scheduling system: <a href={resource.sourceUrl} target="_blank" rel="noopener noreferrer">official page ↗</a>.</p>
    </aside>
  </div>;
}
