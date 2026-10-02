# GatorResource — Instructions for AI Coding Agents

## Mission

Build a small, working Next.js application that helps San Francisco State University students find relevant campus support from a plain-language description of their needs.

Read `idea.md` for the product scope and `architecture.md` for the technical design. These documents describe the intended build; they are not evidence that any feature has been implemented, tested, or deployed.

The developer is a solo participant at their first hackathon, with a three-hour submission window. Prioritize a complete, understandable demo over additional features.

## Required outcomes

1. Accept a short description of a student's needs.
2. Use Gemini meaningfully to interpret multiple needs and constraints.
3. Select up to three relevant resources from a small, verified SFSU directory.
4. Explain each match and show a source-backed next step and official link.
5. Flag unknown availability or eligibility instead of inventing details.
6. Support browsing the directory without an AI request.
7. Prepare deployment on Google Cloud Run using the hackathon's provided Cloud credits.

## Implementation choices

- Use Next.js App Router, TypeScript, and React for the interface and server-side application (user-directed stack change).
- Store eight to ten resources in a local JSON file.
- Keep Gemini request and response handling separate from the interface.
- Use a currently available Gemini model with structured JSON output. Make the model configurable; verify access with the participant's project before relying on it.
- Keep API credentials in server-only environment variables. Never embed them in source, browser bundles, downloads, logs, or container images.
- Use a Dockerfile that listens on Cloud Run's `PORT` environment variable.
- Prefer the smallest dependency set that supports the working flow.

Do not add authentication, a vector database, model training, autonomous agents, maps, document uploads, university-system integration, or live web crawling to the MVP.

## Source and AI rules

- Read official SFSU sources before adding resource facts. Store the source URL and review date.
- Treat office hours, program hours, and appointment availability as different facts.
- Missing information means unknown. Do not infer that a program is open, closed, free, or available to a particular student.
- The model may return only resource IDs from the directory. Resolve links and next steps from trusted application data.
- Validate response structure, IDs, explanation types, and the maximum number of matches. Remove duplicate IDs.
- An empty match list is valid. Never invent a result to fill three cards.
- Treat the student's input as untrusted content, not instructions that can override matching rules.
- Label AI explanations separately from verified directory information.
- Do not promise admission to programs, funding, housing, appointments, or accommodation eligibility.
- Explain uncovered needs without presenting the directory as an exhaustive list of SFSU services.

## User experience

- Use plain, supportive language and clearly labeled controls.
- Start with one input field and three realistic example prompts.
- Show results as readable cards with a reason, constraint note, next step, and official link.
- Provide loading, missing-key, empty-input, no-match, quota, timeout, and invalid-response states.
- Keep the directory usable when AI is unavailable.
- Provide a clear-search action and an optional text download of next steps.
- Avoid raw model output, stack traces, and implementation details in the student flow.

## Privacy and responsible use

- Tell students before submission that their description is sent to Google Gemini.
- Do not request student IDs, medical records, financial records, or identifying information.
- Do not persist search text or results to a database or application logs.
- Use temporary session state only. Clear displayed results when a new search starts so old recommendations are not mistaken for a new answer.
- Do not claim zero provider retention solely because application storage is disabled.
- Identify the product as an independent prototype, not an official SFSU service or emergency-response tool.
- Explain limited resource coverage and the need to confirm details with program staff.

## Build sequence

1. Create the project files and get one Gemini request working.
2. Curate the resource directory from official pages.
3. Implement structured matching and validation.
4. Build the search and directory views.
5. Exercise meaningful success and failure cases.
6. Deploy to the credited Google Cloud project.
7. Prepare the README, screenshots, and short demonstration.

If time becomes tight, drop visual polish and optional downloads before cutting source attribution, validation, live AI verification, or required deployment work.

## Verification

Test these behaviors:

- Food and career needs produce distinct, relevant matches.
- A schedule constraint is acknowledged without invented hours.
- A request outside the directory returns no match.
- Unknown resource IDs and malformed output are rejected.
- Duplicate IDs do not create duplicate cards.
- Missing credentials, quota errors, and timeouts produce understandable messages.
- An instruction to invent a resource cannot introduce an unlisted link.
- Clearing or replacing a search does not leave stale results.
- The deployed app loads and can complete a real Gemini request.

Mocked tests verify application behavior, not actual model quality or API access. Report them separately from live tests. Do not repeatedly run unchanged checks after they pass.

## Track and completion rules

- SFSU: identify students as beneficiaries, demonstrate meaningful AI, describe responsible use, and explain a realistic campus pilot. The participant has confirmed they are a current SFSU student.
- GDG: use Gemini centrally, use Cloud Run as an additional Google service, and actually use the provided hackathon Cloud credits. Deployment files alone do not satisfy the credit-use requirement.
- Do not describe the Gemini-only MVP as a Gemma or open-weight AI entry.
- Never claim that deployment, credit usage, API integration, tests, or source verification succeeded without evidence.
- Finish with a short handoff stating what works, what was tested, how to run it, and any remaining submission steps.

## File naming note

This file is named `Agents.md` as requested. Tools that automatically discover agent instructions may require the exact filename `AGENTS.md`; use that name when configuring such a tool.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
