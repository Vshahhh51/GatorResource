# GatorResource

A Next.js campus support finder for SF State students, with Gemini matching and eight source-backed resources. Built from the specification in `AGENTS.md`; the user selected Next.js instead of Streamlit.

## Run locally: Vertex AI with ADC

Requires Node.js 22.7 or newer and Google Cloud CLI for local authentication.

Set these values in `.env.local` (do not overwrite an existing file from the example):

```env
GOOGLE_CLOUD_PROJECT=YOUR_PROJECT_ID
GOOGLE_CLOUD_LOCATION=global
GEMINI_MODEL=gemini-3.8-flash
```

```powershell
npm install
gcloud auth application-default login
gcloud auth application-default set-quota-project YOUR_PROJECT_ID
npm run check:env
npm run test:gemini
npm run dev
```

Open http://localhost:3000. Enable Vertex AI and billing for your project. The ADC identity needs Vertex AI permissions (typically Vertex AI User) and permission to consume services in the quota project. Restart the dev server after configuration changes. GEMINI_API_KEY is no longer used. Keep ADC credential files outside this repository.

The test performs a basic request and then the app's structured matching request. Check both PASS messages. It uses real API quota but does not print credentials. The directory remains usable without ADC.

## Checks

```powershell
npm test
npm run typecheck
npm run build
```

Tests mock Gemini and exercise validation, multi-need result handling, duplicates, missing project/ADC credentials, quota, timeout, prompt separation, malformed output, directory integrity, and request validation. They do not verify live model quality or access.

Manual checks after starting the app:

- Use the food-and-job example: expect distinct relevant matches; confirm that schedule uncertainty is acknowledged.
- Try a need outside the directory, such as pet boarding: expect no match.
- Search, then edit or clear the input while waiting: no old result should reappear.
- Try a missing ADC credentials: directory browsing must remain usable.
- Inspect mobile layout, keyboard navigation, result download, and official links.

## Cloud Run

Run npm install to update the lockfile for google-auth-library. Enable Cloud Run, Cloud Build, Artifact Registry, and Vertex AI in your credited project. Assign a dedicated runtime service account the Vertex AI User role in the model project. Cloud Run gets ADC from that identity; no key secret or local ADC file is needed in the container.

```powershell
gcloud run deploy gator-resource --source . --project YOUR_CREDITED_PROJECT --region us-west1 --allow-unauthenticated --port 8080 --max-instances 1 --service-account YOUR_SERVICE_ACCOUNT_EMAIL --set-env-vars GOOGLE_CLOUD_PROJECT=YOUR_CREDITED_PROJECT,GOOGLE_CLOUD_LOCATION=global,GEMINI_MODEL=gemini-3.8-flash
```

Cloud Run hosting can be regional while the Vertex AI model endpoint is global. This public deployment may incur charges; check your credited billing account and provider quotas. Maximum instances is not a spending cap.

After deployment: open the service URL, complete a real Gemini search, check Cloud Billing credit usage, and capture desktop/mobile screenshots. Deployment files alone do not establish GDG credit use or a successful live integration.

## Demo (60–90 seconds)

1. Explain the student problem: multiple needs, scattered campus websites.
2. Submit the food-and-job example; show Gemini's separate reasons and explicit schedule uncertainty.
3. Open an official next step and show the reviewed source date.
4. Browse a category without another AI request.
5. Explain the small directory, temporary app memory, provider processing, and independent prototype status.

## Sources and design references

Resource citations and review dates live in `data/resources.json`. Reviewed official pages: [Basic Needs](https://basicneeds.sfsu.edu/), [housing navigation](https://basicneeds.sfsu.edu/housing-resources-navigation), [career support](https://career.sfsu.edu/), [CAPS](https://psyservs.sfsu.edu/), [DPRC](https://access.sfsu.edu/), [TASC](https://tutoring.sfsu.edu/), [financial aid](https://financialaid.sfsu.edu/), and [undergraduate advising](https://advising.sfsu.edu/).

Implementation references: [Gemini models](https://ai.google.dev/gemini-api/docs/models), [structured output](https://ai.google.dev/gemini-api/docs/generate-content/structured-output), and [Next.js standalone output](https://nextjs.org/docs/app/api-reference/config/next-config-js/output).

## Verification status

Ten mocked backend tests pass, including the global Vertex endpoint, Bearer authorization, absence of API-key headers, and ADC failures. Installation of the new google-auth-library dependency was blocked by EACCES in this environment. Run npm install to synchronize dependencies and the lockfile, then typecheck/build. Live ADC/model access, deployment, and credit usage remain unverified; GOOGLE_CLOUD_PROJECT is not yet configured locally.

Vertex references: [ADC quickstart](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/quickstart), [Google Auth Library](https://github.com/googleapis/google-auth-library-nodejs).
