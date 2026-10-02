import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";
nextEnv.loadEnvConfig(fileURLToPath(new URL("../", import.meta.url)), true);
const project = process.env.GOOGLE_CLOUD_PROJECT?.trim();
const location = process.env.GOOGLE_CLOUD_LOCATION?.trim() || "global";
if (!project || location !== "global") {
  console.error("Set GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_LOCATION=global in .env.local.");
  process.exitCode = 1;
} else {
  console.log("Vertex AI project configured; location: global. Run npm run test:gemini to verify ADC and model access.");
}
