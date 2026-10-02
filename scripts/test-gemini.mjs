import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
import { adcHeaders, vertexConfig } from "../lib/vertex.ts";
import { matchResources } from "../lib/matching.ts";

nextEnv.loadEnvConfig(fileURLToPath(new URL("../", import.meta.url)), true);
let stage = "configuration";
try {
  const config = vertexConfig();
  console.log("Vertex AI test: ADC, global endpoint, model", config.model);
  stage = "ADC authentication";
  const headers = await adcHeaders(config.url);
  headers.set("Content-Type", "application/json");
  console.log("ADC authentication succeeded (credentials hidden).");
  stage = "Vertex AI request";
  const response = await fetch(config.url, {
    method: "POST", headers, signal: AbortSignal.timeout(30000),
    body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: "Reply with exactly: Gemini connection works" }] }] })
  });
  console.log("HTTP status:", response.status);
  const body = await response.json();
  if (!response.ok) {
    const hints = {
      400: "Request rejected. Check model and project configuration.",
      401: "ADC rejected. Run gcloud auth application-default login again.",
      403: "Check Vertex AI API enablement, billing, Vertex AI User permissions, and the ADC quota project.",
      404: "Check model availability for this project at the global endpoint.",
      429: "Project quota/rate limit reached. Check Vertex AI quotas and billing.",
      503: "Vertex AI is temporarily unavailable. Try later."
    };
    console.error("FAIL:", hints[response.status] || "Vertex AI returned an error.");
    process.exitCode = 1;
  } else {
    if (!body?.candidates?.[0]?.content?.parts?.some(p => !p.thought && p.text)) throw new Error("No text returned");
    console.log("PASS: Basic Gemini request returned text.");
    stage = "app structured matching";
    const result = await matchResources("I need groceries and help finding a part-time job.");
    console.log("PASS: Structured response validated. Match IDs:", result.matches.map(m => m.resourceId).join(", ") || "(no matches)");
  }
} catch (error) {
  process.exitCode = 1;
  console.error("FAIL at stage:", stage);
  const known = new Set(["EACCES", "EPERM", "ENOTFOUND", "ECONNREFUSED", "ETIMEDOUT", "ERR_MODULE_NOT_FOUND", "TimeoutError", "quota", "configuration", "credentials", "invalid_response", "timeout", "unavailable"]);
  const code = error?.cause?.code || error?.code || error?.name;
  if (known.has(code)) console.error("Diagnostic code:", code);
  if (stage === "configuration") console.error("Set GOOGLE_CLOUD_PROJECT, GOOGLE_CLOUD_LOCATION=global, and GEMINI_MODEL=gemini-3.8-flash in .env.local.");
  if (stage === "ADC authentication") console.error("Run npm install, then gcloud auth application-default login. Set the ADC quota project to your credited project. On Cloud Run, use a service account with Vertex AI permissions.");
  console.error("For EACCES/EPERM, run from your own terminal and check network restrictions. Credentials and raw errors are intentionally hidden.");
}
