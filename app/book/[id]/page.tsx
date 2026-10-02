import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { readSession, SESSION_COOKIE } from "../../../lib/session.ts";
import { byId } from "../../../lib/resources.ts";
import { Logo } from "../../logo";
import BookingForm from "./booking-form";

export const dynamic = "force-dynamic";
export const metadata = { title: "Request an appointment | GatorResource" };

export default async function BookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resource = byId.get(id);
  if (!resource) notFound();
  const email = readSession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!email) redirect(`/login?next=${encodeURIComponent(`/book/${id}`)}`);
  return <>
    <header className="header"><a className="brand" href="/" aria-label="GatorResource home"><Logo size={34}/></a><nav><a className="nav-link" href="/#directory">Back to resources</a></nav></header>
    <main className="book-page">
      <h1>Request an appointment</h1>
      <p className="hero-sub">{resource.name}</p>
      <BookingForm resource={{ id: resource.id, name: resource.name, officeHours: resource.contact.officeHours, location: resource.contact.location, phone: resource.contact.phone, email: resource.contact.email, sourceUrl: resource.sourceUrl }} studentEmail={email} />
    </main>
  </>;
}
