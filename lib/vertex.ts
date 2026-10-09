type Overrides = { project?: string; model?: string; location?: string; apiKey?: string };

// If GEMINI_API_KEY is set, use the Gemini API with that key (e.g. Vercel).
// Otherwise fall back to Vertex AI with Application Default Credentials.
export function vertexConfig(overrides: Overrides = {}) {
  const model = (overrides.model ?? process.env.GEMINI_MODEL ?? "gemini-3.8-flash").trim();
  if (!/^[a-zA-Z0-9._-]+$/.test(model)) throw new Error("Invalid model ID.");
  const apiKey = (overrides.apiKey ?? process.env.GEMINI_API_KEY ?? "").trim();
  if (apiKey && overrides.project === undefined) {
    return { apiKey, project: "", model, location: "", url: `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent` };
  }
  const project = (overrides.project ?? process.env.GOOGLE_CLOUD_PROJECT ?? "").trim();
  const location = (overrides.location ?? process.env.GOOGLE_CLOUD_LOCATION ?? "global").trim();
  if (!project || !/^[a-zA-Z0-9_-]+$/.test(project)) throw new Error("GEMINI_API_KEY or GOOGLE_CLOUD_PROJECT must be configured.");
  if (location !== "global") throw new Error("GOOGLE_CLOUD_LOCATION must be global.");
  return { apiKey: "", project, model, location, url: `https://aiplatform.googleapis.com/v1/projects/${project}/locations/global/publishers/google/models/${model}:generateContent` };
}

export async function adcHeaders(url: string): Promise<Headers> {
  const { GoogleAuth } = await import("google-auth-library");
  const auth = new GoogleAuth({ scopes: ["https://www.googleapis.com/auth/cloud-platform"] });
  return new Headers(await auth.getRequestHeaders(url));
}
