# GatorResource

**Describe what you need. Find SF State support. Know your next step.**

GatorResource is an independent, student-built prototype that helps San Francisco State University students find campus support from a plain-language description. Gemini reads what the student wrote, picks up to three matching resources from a small directory of official SFSU offices, and explains each match. Every link, office hour, location, and contact detail comes from the directory, not from the model.

> Not an official SFSU service and not an emergency-response tool. The directory is small and does not cover every campus service. Students should confirm details with program staff.

## Features

- **Plain-language search.** Describe one or several needs (for example food plus a part-time job) and get up to three matches, each with an AI explanation, a constraint note, and a next step from the official source. An empty result is valid.
- **Browse without AI.** All 23 resources can be browsed and filtered by category with no model request.
- **Verified office info.** Each resource shows office hours, location, phone, email, an official link, and the date the source was reviewed.
- **Honest about unknowns.** Program hours, appointment availability, and eligibility are treated as separate facts. If a page did not state something, the card says it is unknown.
- **Appointment requests.** Students sign in with an SFSU email, choose a preferred date, time of day, and format, and get a pre-filled email draft to the office plus a calendar reminder. This is a *request*, not a confirmed booking (see Limits).
- **Student sign-in.** Browsing and search are open to everyone. Only appointment requests need an `@sfsu.edu` address.
- **Save next steps.** Download the matched next steps as a text file.

## The directory (23 resources)

Basic Needs Center, Housing Resources & Navigation, University Housing Office, Career & Leadership Development, Counseling & Psychological Services, Gator Student Health Center, Disability Programs & Resource Center, Tutoring & Academic Support Center, Undergraduate Advising Center, Educational Opportunity Program, J. Paul Leonard Library, Office of Student Financial Aid, Office of the Registrar, IT Service Desk, Parking & Transportation Services, Dean of Students, Veterans Services Office, Division of International Education, Campus Recreation (Mashouf Wellness Center), University Police Department, Office for Civil Rights & Title IX, Office of Student Conduct, and Graduate Studies & Career Development.

Records live in `data/resources.json` with the source URL and review date (2026-10-02). Add a resource only after reading its official page.

## How it works

```
Student → Next.js page → POST /api/match → Gemini on Vertex AI (structured JSON)
                                      ↓
                    validate IDs and shape → resolve links, hours, next steps
                                      ↓                from data/resources.json
                               result cards
```

- The model may return only resource IDs from the directory (enforced in the response schema and validated again on the server). Unknown IDs, malformed output, and extra fields are rejected, and duplicates are removed.
- AI text is labeled separately from verified directory information. The student's text is treated as untrusted input.
- Nothing is stored. Search text and results live only in the page's temporary state and are not written to a database or logs.

## Tech stack

Next.js (App Router) · React · TypeScript · Gemini on Vertex AI (Application Default Credentials) · Google Cloud Run · local JSON data. No database.

## Project layout

```
app/
  page.tsx            Home (server): reads the session, renders the portal
  portal.tsx          Search, results, and directory UI
  login/              SFSU email sign-in (server action + form)
  book/[id]/          Appointment request page and form (sign-in required)
  api/match/route.ts  Search endpoint
  logo.tsx, icons.tsx Logo and line icons
  globals.css         Styles
lib/
  matching.ts         Gemini request, schema, and validation
  vertex.ts           Vertex AI endpoint and ADC headers
  resources.ts        Typed access to the directory
  session.ts          Signed session cookie and @sfsu.edu check
data/resources.json   Verified resource directory
tests/                Mocked tests
scripts/              Environment and live Gemini checks
Dockerfile            Cloud Run container (listens on PORT)
```

## Run locally

Requires Node.js 22.7 or newer and the Google Cloud CLI.

1. Copy `.env.example` to `.env.local` and fill it in:

   ```env
   GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
   GOOGLE_CLOUD_LOCATION=global
   GEMINI_MODEL=gemini-3.8-flash
   SESSION_SECRET=any-long-random-string
   ```

   The model ID is configuration; confirm your project has access to it. `SESSION_SECRET` signs the login cookie. If it is missing, a random one is used and everyone is signed out on each restart.

2. Install and authenticate:

   ```powershell
   npm install
   gcloud auth application-default login
   gcloud auth application-default set-quota-project YOUR_PROJECT_ID
   npm run check:env
   npm run test:gemini
   npm run dev
   ```

3. Open http://localhost:3000.

Enable Vertex AI and billing for your project. The ADC identity needs Vertex AI permissions (typically Vertex AI User) and permission to use the quota project. Keep credential files out of this repository. `npm run test:gemini` makes real requests, uses quota, and does not print credentials. The directory stays usable if Gemini is unavailable.

## Tests

```powershell
npm test
npm run typecheck
npm run build
```

The tests mock Gemini. They cover response validation, multi-need results, duplicate IDs, unknown IDs, malformed output, missing credentials, quota and timeout errors, prompt separation, request validation, and directory integrity (including office hours, location, phone, and email on every resource). They do not show how good the model's answers are or whether your project can reach the model; use `npm run test:gemini` and manual checks for that.

Manual checks:

- Food plus job example: distinct matches, and schedule uncertainty is acknowledged rather than invented.
- A request outside the directory (for example pet boarding): no match.
- Edit or clear the box mid-search: no stale results reappear.
- Try an instruction to invent a resource: no unlisted link appears.
- Check keyboard navigation, mobile layout, official links, and the appointment flow signed in and signed out.

## Deploy to Cloud Run

Enable Cloud Run, Cloud Build, Artifact Registry, and Vertex AI in the project that holds your credits. Give a dedicated runtime service account the Vertex AI User role. Cloud Run supplies ADC from that identity, so no key file goes in the container.

```powershell
gcloud run deploy gator-resource --source . --project YOUR_PROJECT --region us-west1 --allow-unauthenticated --port 8080 --max-instances 1 --service-account YOUR_SERVICE_ACCOUNT_EMAIL --set-env-vars GOOGLE_CLOUD_PROJECT=YOUR_PROJECT,GOOGLE_CLOUD_LOCATION=global,GEMINI_MODEL=gemini-3.8-flash,SESSION_SECRET=YOUR_RANDOM_SECRET
```

Prefer Secret Manager for `SESSION_SECRET` on a shared deployment. The service is public and search is open, so anyone can use your Gemini quota. Check quotas and billing, because maximum instances is not a spending cap. After deploying, open the URL, complete a real search, check Cloud Billing for credit usage, and save screenshots. Deployment files alone do not show credit use or a working live integration.

## Limits and honest notes

- **Sign-in only checks the email domain.** It accepts `name@sfsu.edu` but does not prove the person owns that inbox, so it is not secure identity verification. Real verification would use Google Sign-In restricted to `sfsu.edu` or an emailed one-time code.
- **Appointments are requests.** The app cannot see office calendars or book into university systems. It prepares an email for the student to send from their own account; the office replies with what is available. Some offices use their own scheduling tools, linked from each official page.
- **Privacy.** The student's description is sent to Google Gemini; students are told to leave out names, IDs, and private records. Google's data policies still apply. The app stores nothing except a signed cookie holding the signed-in email, and does not log search text.
- **Office hours are not program hours.** Hours shown are office or facility hours from the official page, not food distribution, pharmacy, class, or appointment hours.
- **Information can change.** Review dates are shown on each card; re-check the official pages before relying on them.

## Verification status

- Mocked tests and typecheck pass in the development environment.
- Live Gemini access, Cloud Run deployment, and Cloud credit usage are **not yet verified**. Complete them with your credited project before submission.
- Contact details were read from official SFSU pages on 2026-10-02, not independently confirmed with the offices.

## Sources

Official pages are cited per resource in `data/resources.json`. Implementation references: [Gemini on Vertex AI](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/quickstart), [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs), [Next.js standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

## Project documents

`IDEA.md` (problem, audience, scope), `ARCHITECTURE.md` (technical design), and `AGENTS.md` (build rules for AI coding agents).
