# GatorResource

**Describe what you need. Find campus support. Know your next step.**

## The problem

A student may know they need groceries, academic help, or a job without knowing which SFSU office to contact. Resource information is spread across pages organized by program and office names. A student facing multiple problems must connect those services themselves, then separately find where the office is, when it is open, and how to reach it.

This is the project's problem hypothesis. Validate it through brief student conversations when possible; do not present assumed demand or time savings as measured results.

## Who it helps

The primary users are SFSU students who need help locating support, particularly students unfamiliar with campus services or balancing several needs at once. Commuters may also need to know whether an office's hours, location, or contact format fit their availability.

Campus support staff could benefit from clearer initial referrals and better-prepared appointment requests, although that benefit needs validation with staff before a pilot.

## The proposed solution

GatorResource is a simple web application where a student describes their situation in everyday language. Gemini interprets the request and matches it to a small, verified directory of SFSU resources. Students can also browse the directory without any AI.

Each resource shows:

- What it is and why it may help (AI explanations are labeled separately from verified information).
- A clear next step supported by the official source.
- Office hours, location, phone, and email, read from the official page.
- An official source link and the date it was reviewed.
- Known availability and eligibility information, with unknowns stated plainly.
- Any student constraints that still need confirmation.

The app returns up to three matches for a search. If the directory cannot help, it says so.

### Appointment requests

To make the next step easier, a student can request an appointment from the same site. Browsing and search are open to everyone; requesting an appointment asks the student to sign in with an `@sfsu.edu` email. The student picks a weekday, a time of day, and a format, and the app prepares an email draft to the office's verified address and a calendar reminder. The student sends the email from their own account.

This is a request, not a confirmed booking. The app cannot see office calendars or connect to university scheduling systems, and it never promises an appointment. The current sign-in checks the email domain only and does not prove the person owns the inbox, so it should not be presented as secure identity verification.

## Example experience

Student input:

> I'm struggling to afford groceries and need a part-time job. I'm only on campus on Tuesdays.

The intended response is a food-support resource and career support, with explanations connecting each to the student's needs, plus each office's hours, location, and contact details. If Tuesday service hours are not verified, the app tells the student to confirm them. It does not promise food, a job, an appointment, or benefit eligibility.

The student can open the official pages, request an appointment, and save a short list of next steps.

## Why AI matters

The student should not need to know terms such as "Basic Needs Center" or "Career & Leadership Development" to find relevant help. Gemini connects informal descriptions to service descriptions, recognizes multiple needs, and identifies constraints that affect the usefulness of a referral.

The central output is a source-linked action list. The model operates within a curated directory, returns only resource IDs, and is not expected to answer arbitrary questions about the university.

## Scope of the current build

1. A description field and three example prompts.
2. A directory of 19 resources verified against official SFSU pages, with office hours, location, phone, email, source link, and review date.
3. Gemini matching with structured output and resource-ID validation.
4. Up to three result cards with AI explanations, official links, and next steps.
5. A browsable, filterable directory that works without AI.
6. Clear handling of no match, unknown details, and API errors.
7. A light `@sfsu.edu` sign-in that gates appointment requests only, and a request flow that produces an email draft and calendar reminder.
8. A calm, student-friendly design (three colors, rounded shapes, a new logo) that works on phones.
9. Cloud Run deployment using hackathon credits, with live Gemini verification (still to be completed and evidenced).

Add a text download and visual polish only after the core flow works.

Still excluded: password accounts, chat history, maps, document uploads, live scraping, model training, and integrations with university systems (including real booking). Real email-ownership verification is a pilot step, not part of this build.

## Track fit

### SFSU: Build for SFSU

- **Problem:** Students can struggle to locate the right campus support and then to reach it.
- **Beneficiaries:** SFSU students seeking resources, office details, and next steps.
- **Meaningful AI:** Interprets needs, identifies relevant services, and explains constraints.
- **Demonstration:** A working application with real official resource links and contact details.
- **Responsible use:** Limited data collection, transparent AI labels, source attribution with review dates, no automated eligibility decisions, and no promise of appointments.
- **Realistic continuation:** A campus office maintains the directory, adds verified sign-in, and reviews referral quality with students.
- **Eligibility:** The solo participant has confirmed they are a current SFSU student.

### GDG: Build with AI for Social Good

- **Community problem:** Access to information about food, housing, health, academic, and other student support.
- **Gemini's role:** Core interpretation and matching, beyond a generic chatbot.
- **Additional Google service:** Cloud Run hosts the working application; Vertex AI serves Gemini.
- **Cloud credits:** Actually deploy and use eligible Google Cloud services under the provided hackathon credits, and retain evidence.
- **Demonstration:** Show a live request, official source links, uncertainty handling, the appointment request flow, and the deployed application.

Final eligibility and judging are determined by the organizers. Do not assume that preparing deployment files alone meets the Cloud-use requirement. This MVP does not target the Gemma or open-weight AI tracks.

## Build status and what remains

Built and checked with mocked tests: the directory, validation, search and browse views, sign-in, appointment request flow, and the visual design. Not yet verified: live Gemini access from the credited project, Cloud Run deployment, and credit usage. These must be completed and documented before submission.

## Two-minute demonstration

1. Explain the problem: students know their needs but may not know the relevant office or how to reach it.
2. Enter a request involving food and career support.
3. Show how the recommendations address each need, with hours, location, and contact details, and open an official source.
4. Show a schedule constraint with missing information, then an unrelated request that returns no match.
5. Sign in with an SFSU email and request an appointment; show the email draft and explain that it is a request.
6. Explain the use of Gemini, Cloud Run, and the provided credits using actual deployment evidence.
7. Describe how a campus office could maintain and expand the directory.

## What success looks like

- A student can move from a plain-language need to a relevant official resource, contact details, and a concrete next step.
- A multi-need request produces distinct useful referrals.
- Every displayed destination and contact detail comes from the verified directory.
- Missing information remains visibly uncertain.
- Unsupported requests do not produce invented campus programs.
- Appointment requests are clearly labeled as requests, and signed-out visitors can still browse freely.
- The application completes a live Gemini request during the demonstration.

Evaluate these with test scenarios and, if time permits, a few student walkthroughs. Report observed outcomes without inventing adoption, accuracy, or impact statistics.

## Risks and next steps

Resource pages, hours, and contacts can change; generated explanations can be wrong; and a small directory may omit useful support (for example, a campus police or additional cultural centers). Keep review dates visible, link to official sources, and ask program staff to confirm eligibility and availability. Explain that descriptions are sent to Google and discourage sensitive personal details. Because search is open, a public deployment can consume Gemini quota, so set limits and monitor billing.

The email-domain sign-in is only a convenience gate. Before a broader launch, add real verification (Google Sign-In restricted to `sfsu.edu` or an emailed code) and explore official scheduling integrations with offices that want them.

After the event, interview students and campus staff, establish ownership of the directory, expand coverage based on actual unmet needs, and conduct privacy and accessibility reviews.
