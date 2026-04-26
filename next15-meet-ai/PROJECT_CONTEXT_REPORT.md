# Meet AI — Complete Project Context Report

This report is a single handover document for the entire project. It combines the project brief, tech stack summary, codebase schema, user flowchart, and testing coverage so another person can understand the product without opening every source file first.

---

## 1. Product overview

Meet AI is an AI-powered meeting intelligence SaaS built with Next.js 15 and React 19. It lets users create custom AI agents, schedule live meetings, attach PowerPoint presentations, conduct real-time video calls, and automatically generate meeting summaries and searchable transcripts after the call ends.

The product is more than a normal video-call app. It combines:
- live video and chat,
- AI voice interaction,
- presentation-aware context,
- post-call summarization,
- dashboard analytics,
- subscription billing,
- and background automation.

It is designed like a modern SaaS platform with a freemium model.

---

## 2. Business purpose and value

The main product goal is to help users run smarter meetings.

Instead of just hosting a call, the platform:
- acts as an AI assistant during the meeting,
- keeps the AI grounded in custom instructions,
- can use uploaded slide decks as context,
- generates summaries after the meeting,
- and makes the result searchable and reusable.

This makes the app useful for sales calls, product meetings, demos, coaching sessions, and any workflow where transcript intelligence matters.

---

## 3. User flow from visit to post-call review

The user flow in the codebase is:

1. User visits the app.
2. The app checks whether the user is logged in.
3. If not logged in, the user is taken to Sign In / Sign Up.
4. If logged in, the user lands on the Dashboard.
5. The dashboard offers navigation to Agents, Meetings, Presentations, and Analytics.
6. The user creates an AI agent with a name and instructions.
7. The user uploads a `.pptx` file if a presentation is needed.
8. Slides are extracted and stored.
9. The user creates a meeting with an agent and optional presentation.
10. The user chooses whether the meeting happens now or later.
11. If later, a reminder email is sent before start time.
12. The user enters the lobby and previews camera/mic.
13. The user joins the call.
14. The AI agent speaks and responds in real time.
15. If a presentation is attached, the screen shows both video and slide viewer.
16. The user leaves the call.
17. The meeting is processed in background jobs.
18. The completed meeting becomes available for summary, transcript search, recording playback, and follow-up chat.

This is the core product journey.

---

## 4. User flowchart summary

The user flowchart in the repo shows the same journey in a more visual form.

### Key flow stages
- User Visits App
- Logged In?
- Sign In / Sign Up
- Dashboard
- Agents
- Presentations
- Meetings
- Analytics Dashboard
- Create Agent
- Upload `.pptx`
- Create Meeting
- Lobby
- Join Call
- Active Call
- Leave Call
- Processing
- Completed Meeting
- View AI Summary
- Search Transcript
- Watch Recording
- Chat with AI Agent

### Call-specific behavior
- If no presentation is attached, the user gets a video-only call view.
- If a presentation is attached, the user gets a side-by-side video and slide viewer experience.
- After the call, the meeting stays in processing for about 1–2 minutes before final summary data is ready.

---

## 5. Core technology stack

### Framework and language
- Next.js 15
- React 19
- TypeScript

### UI and styling
- Tailwind CSS v4
- shadcn/ui
- Radix UI primitives
- Lucide icons
- react-icons
- Sonner for toasts

### State, forms, and utilities
- tRPC v11
- TanStack React Query
- Drizzle ORM
- Zod
- react-hook-form
- nuqs
- date-fns

### Database and auth
- Neon PostgreSQL
- Better Auth

### Real-time and AI services
- Stream Video SDK
- Stream Chat SDK
- OpenAI Realtime API
- OpenAI GPT-4o-mini

### Background jobs and integrations
- Inngest
- Resend
- Polar
- ngrok for local webhook development

### Presentation and transcript handling
- pptx-text-parser
- jsonl-parse-stringify
- react-highlight-words
- react-markdown

### Analytics and UI helpers
- Recharts
- cmdk
- react-day-picker
- nanoid
- DiceBear

---

## 6. Tech stack summary with purpose

### Core framework and language
| Technology | Used For |
|---|---|
| Next.js 15 | App framework, SSR, routing, API routes |
| React 19 | UI rendering |
| TypeScript | Type safety across the stack |

### Styling and UI
| Technology | Used For |
|---|---|
| Tailwind CSS v4 | Utility-first styling |
| shadcn/ui | Prebuilt UI components |
| Radix UI | Accessible UI primitives |
| Lucide Icons | Icon set |
| Sonner | Toast notifications |

### API and data
| Technology | Used For |
|---|---|
| tRPC v11 | Type-safe API layer |
| Drizzle ORM | Database queries and schema |
| TanStack React Query | Client caching and mutations |
| Zod | Input validation |

### Services
| Technology | Used For |
|---|---|
| Neon PostgreSQL | Serverless database |
| Better Auth | Authentication |
| Stream Video | Real-time video, transcription, recording |
| Stream Chat | In-call messaging |
| OpenAI Realtime API | Live AI voice agent |
| GPT-4o-mini | Summaries and post-call AI messaging |
| Inngest | Background jobs |
| Resend | Reminder and summary emails |
| Polar | Billing and subscriptions |

---

## 7. Business model and limits

The app uses a freemium model.

Free tier limits from the codebase:
- 3 meetings
- 1 agent
- 1 presentation

These limits are enforced server-side with premium guards.

Polar is used for subscription billing and upgrade flow.

---

## 8. Folder and architecture layout

Important folders:

- src/app — Next.js routes, layouts, and API routes
- src/components — shared UI components
- src/db — database schema and DB instance
- src/hooks — reusable hooks
- src/inngest — job client and background functions
- src/lib — service wrappers and utilities
- src/modules — feature modules
- src/trpc — tRPC context, routers, and query client

The codebase is modular, meaning most business features live in their own folder rather than being mixed globally.

---

## 9. Database schema and entity model

The schema is defined in `src/db/schema.ts` using Drizzle ORM.

### Tables
- user
- session
- account
- verification
- agents
- presentations
- presentation_slides
- meetings

### Enum
- meeting_status: upcoming, active, completed, processing, cancelled

### Table details

#### user
- id
- name
- email
- emailVerified
- image
- createdAt
- updatedAt

#### session
- id
- expiresAt
- token
- createdAt
- updatedAt
- ipAddress
- userAgent
- userId

#### account
- id
- accountId
- providerId
- userId
- accessToken
- refreshToken
- idToken
- accessTokenExpiresAt
- refreshTokenExpiresAt
- scope
- password
- createdAt
- updatedAt

#### verification
- id
- identifier
- value
- expiresAt
- createdAt
- updatedAt

#### agents
- id
- name
- userId
- instructions
- createdAt
- updatedAt

#### presentations
- id
- name
- userId
- totalSlides
- createdAt
- updatedAt

#### presentation_slides
- id
- presentationId
- slideNumber
- textContent
- imageUrl
- createdAt

#### meetings
- id
- name
- userId
- agentId
- presentationId
- status
- scheduledAt
- startedAt
- endedAt
- transcriptUrl
- recordingUrl
- summary
- createdAt
- updatedAt

---

## 10. Relationships

The schema relationships are:
- user → sessions
- user → accounts
- user → agents
- user → meetings
- user → presentations
- agents → meetings
- presentations → meetings
- presentations → presentation_slides

This gives the application a clear ownership model and keeps meeting records tied to the correct user, agent, and optional presentation.

---

## 11. Core constants and business rules

The codebase defines these free-tier constants:
- MAX_FREE_MEETINGS = 3
- MAX_FREE_AGENTS = 1
- MAX_FREE_PRESENTATIONS = 1

The app also uses default pagination constants:
- DEFAULT_PAGE = 1
- DEFAULT_PAGE_SIZE = 10
- MAX_PAGE_SIZE = 100
- MIN_PAGE_SIZE = 1

These values show up in list queries across modules.

---

## 12. tRPC architecture

The app router includes:
- agents
- dashboard
- meetings
- premium
- presentations

### Middleware behavior
- `protectedProcedure` requires an authenticated Better Auth session.
- `premiumProcedure(entity)` checks subscription status and blocks usage when the free-tier limit has been reached.

This is how the app protects private routes and premium business logic.

### Router responsibilities
- agentsRouter — CRUD and listing for agents
- meetingsRouter — CRUD, token generation, transcript handling, and meeting listing
- presentationsRouter — listing, fetching, deleting presentations
- premiumRouter — subscription and free usage logic
- dashboardRouter — analytics and summary stats for the dashboard

---

## 13. Module details from the schema and router files

### Agents module

Responsibilities:
- create agent
- update agent
- delete agent
- fetch single agent with meetingCount
- list agents with pagination and search

Validation:
- name is required
- instructions is required
- id is required for updates

### Meetings module

Responsibilities:
- create meetings with optional presentation and schedule time
- update meetings
- remove meetings
- fetch a meeting with joined agent and duration
- list meetings with filters
- generate video token
- generate chat token
- get transcript data

Important behaviors:
- create meeting is premium-gated
- scheduled meetings can trigger reminder jobs
- transcript lookup uses JSONL parsing
- speaker names are resolved from user and agent tables

### Presentations module

Responsibilities:
- list presentations
- fetch one presentation and its slides
- remove presentation

Important behavior:
- slide ordering is preserved

### Premium module

Responsibilities:
- return current subscription product
- list available products
- return free usage stats

### Dashboard module

Responsibilities:
- return overall stats
- return status buckets
- return monthly trends
- return top agents
- return recent meetings

---

## 14. Presentation upload and PPT parsing behavior

Presentation uploads are handled through a separate REST route rather than tRPC.

The PPTX workflow is:
- upload the `.pptx` file,
- parse it using `pptx-text-parser`,
- extract slide-by-slide text,
- store slides in the database,
- use those slides later during meetings and summary generation.

This is important because presentation text can later be injected into meeting instructions and summary generation.

---

## 15. Real-time meeting behavior

The live call system uses Stream Video and OpenAI Realtime API.

During a call:
- the user joins the lobby,
- the user previews camera and microphone,
- the user joins the active call,
- the AI agent joins as a live participant,
- and the conversation happens in real time.

If a presentation exists:
- the app shows a slide viewer side by side with the video,
- and the AI can answer from slide content first before falling back to general knowledge.

This is a key product differentiator.

---

## 16. Post-call pipeline

When a call ends, the Stream webhook triggers the processing pipeline.

Typical post-call sequence:
1. webhook receives call session event
2. meeting status changes
3. transcript or recording data is stored
4. Inngest job starts
5. transcript is fetched and parsed
6. speakers are resolved
7. GPT-4o-mini generates the summary
8. summary and related data are stored
9. completed meeting is shown to the user

This turns the call from a one-time event into a reusable knowledge artifact.

---

## 17. Background jobs from the schema doc

The Inngest functions in the architecture reference are:

- `createSummarizer` — generates meeting summary text using OpenAI and meeting context
- `meetings/completed` — processes a finished meeting, updates transcript/summary/recording, sends summary email
- `meetings/reminder` — sends an email reminder 15 minutes before the scheduled meeting

These jobs support asynchronous business processing and user notifications.

---

## 18. External service integration summary

Services used in the product:

| Service | Purpose |
|---|---|
| Neon | PostgreSQL database |
| Better Auth | Sign in, sign up, sessions |
| Polar | Subscription billing and quotas |
| Stream Video | Video calls, transcription, recording |
| Stream Chat | Messaging |
| OpenAI | Realtime AI and summarization |
| Inngest | Background orchestration |
| Resend | Reminder and summary emails |

---

## 19. Dashboard behavior

The dashboard is the analytics hub of the app.

It shows:
- total meetings
- total agents
- meeting status breakdowns
- meetings by month
- meetings by agent
- recent meetings

The dashboard is meant to help users understand usage and recent activity at a glance.

---

## 20. Authentication and security model

The app uses Better Auth and protected procedures to ensure:
- unauthenticated users cannot access private features,
- authenticated users can access normal app features,
- premium limits are enforced for free users,
- and access control is handled in the server layer rather than only on the client.

This prevents users from bypassing usage restrictions through UI-only checks.

---

## 21. Development setup

Common project commands:
- `npm install --legacy-peer-deps`
- `npm run dev`
- `npm run dev:webhook`
- `npx inngest-cli@latest dev`
- `npm run db:push`
- `npm run db:studio`
- `npm run build`
- `npm run start`

The repo is meant to be run with a local Next.js dev server plus webhook/tunnel tooling during development.

---

## 22. Testing setup

The project uses **Vitest**, not Jest.

### Testing stack
- Vitest
- jsdom environment
- Testing Library support
- V8 coverage provider

### Coverage output
- text report
- HTML report
- coverage folder output

### Why the tests are module-based
The codebase is modular, so the test suite follows the same structure. That makes it easier to understand what is being covered and to extend later.

The suite is intentionally focused on major business cases rather than exhaustive edge cases.

---

## 23. Test execution results

Latest verified run:
- 6 test files
- 45 tests
- 45 passed
- 0 failed

The suite passes successfully with:
- `npm run test`

Coverage can be generated with:
- `npm run test:coverage`

---

## 24. Full testing coverage from TC_001 to TC_045

### Shared / TRPC guards
- TC_001 — protected route without session returns unauthorized
- TC_002 — protected route with session succeeds
- TC_003 — premium guard blocks free user at meeting limit
- TC_004 — premium guard blocks free user at agent limit
- TC_005 — premium guard allows subscribed user even when limits are exceeded

### Agents module
- TC_006 — create agent with valid input succeeds
- TC_007 — create agent with missing required fields fails validation
- TC_008 — update existing agent succeeds
- TC_009 — update missing agent returns not found
- TC_010 — delete existing agent succeeds
- TC_011 — delete missing agent returns not found
- TC_012 — get one existing agent returns data with meetingCount
- TC_013 — get missing agent returns not found
- TC_014 — list agents with pagination returns paginated response
- TC_015 — list agents with search returns filtered response

### Meetings module
- TC_016 — create meeting with valid payload succeeds
- TC_017 — create meeting with missing fields fails validation
- TC_018 — create meeting when agent is missing returns not found
- TC_019 — create scheduled meeting sends reminder event
- TC_020 — update existing meeting succeeds
- TC_021 — update missing meeting returns not found
- TC_022 — delete existing meeting succeeds
- TC_023 — delete missing meeting returns not found
- TC_024 — get one meeting returns joined agent and duration
- TC_025 — get missing meeting returns not found
- TC_026 — list meetings with pagination returns paginated response
- TC_027 — generate chat token succeeds and upserts chat user
- TC_028 — generate video token succeeds
- TC_029 — transcript without URL returns empty array
- TC_030 — transcript fetch failure returns empty array
- TC_031 — transcript with unknown speaker uses fallback user

### Presentations module
- TC_032 — get one presentation returns presentation with ordered slides
- TC_033 — get missing presentation returns not found
- TC_034 — list presentations returns paginated response
- TC_035 — list presentations with search returns filtered response
- TC_036 — delete existing presentation succeeds
- TC_037 — delete missing presentation returns not found

### Premium module
- TC_038 — current subscription for free user returns null
- TC_039 — current subscription for paid user returns product
- TC_040 — get available products returns recurring product list
- TC_041 — get free usage counts returns meeting, agent, and presentation counts
- TC_042 — free usage for paid user returns null

### Dashboard / home module
- TC_043 — dashboard returns totals and status buckets
- TC_044 — dashboard returns monthly analytics
- TC_045 — dashboard returns top agents and recent meetings

---

## 25. Test files in the repo

Implemented tests live in:
- `src/trpc/init.test.ts`
- `src/modules/agents/server/procedures.test.ts`
- `src/modules/meetings/server/procedures.test.ts`
- `src/modules/presentations/server/procedures.test.ts`
- `src/modules/premium/server/procedures.test.ts`
- `src/modules/home/server/procedures.test.ts`

---

## 26. Testing report summary

The test report for the project is:
- module-based,
- Vitest-powered,
- major-flow focused,
- and green in the latest run.

The report files now available in the repo are:
- `TEST_CASE_MATRIX.md`
- `TESTING_REPORT.md`

---

## 27. What a new person should read first

If someone new is joining or reviewing the project, the best order is:
1. Read this report.
2. Read `README.md`.
3. Read `PROJECT_BRIEF.md`.
4. Read `TECH_STACK_SUMMARY.md`.
5. Read `USER_FLOWCHART.md`.
6. Read `CODEBASE_SCHEMA_AND_ARCHITECTURE.md`.
7. Review `src/db/schema.ts`.
8. Review `src/trpc/init.ts`.
9. Review module routers in `src/modules/*/server/procedures.ts`.
10. Review `TEST_CASE_MATRIX.md`.
11. Review `TESTING_REPORT.md`.
12. Run `npm run test`.
13. Run `npm run test:coverage` if coverage output is needed.

---

## 28. Final project summary

Meet AI is a production-style AI meeting platform that combines:
- authentication,
- analytics,
- agent management,
- meeting scheduling,
- live video calls,
- slide-aware context,
- transcript and summary generation,
- billing,
- and asynchronous background processing.

Its architecture is modular, its schema is explicit, its external integrations are clearly separated, and its tests cover the major business flows. That makes it understandable to a new developer and also realistic as a SaaS product.
