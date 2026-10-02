import { MatchError, matchResources } from "../../../lib/matching.ts";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}
export async function POST(request: Request) {
  // Reject cross-origin browser submissions without storing student information.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return json({ error: "Please search from the app.", code: "origin" }, 403);
  try {
    if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "Please submit a text description.", code: "invalid_input" }, 400);
    const reader = request.body?.getReader();
    if (!reader) return json({ error: "Enter a description first.", code: "invalid_input" }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 16000) { await reader.cancel(); return json({ error: "Please keep your description under 2,000 characters.", code: "invalid_input" }, 413); }
      chunks.push(value);
    }
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (typeof body?.description !== "string") return json({ error: "Enter a description first.", code: "invalid_input" }, 400);
    return json(await matchResources(body.description));
  } catch (error) {
    if (error instanceof MatchError) return json({ error: error.message, code: error.code }, error.status);
    return json({ error: "We couldn’t read that request. Please try again.", code: "invalid_input" }, 400);
  }
}
