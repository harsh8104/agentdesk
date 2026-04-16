# AgentDesk — Tech Stack Summary

## Core Framework & Language

| Technology | Type | License | Free Tier | Paid Pricing | Used For |
|---|---|---|---|---|---|
| **Next.js 15** | Open Source | MIT | ✅ Completely Free | Vercel hosting: $20/mo Pro | App framework (SSR, routing, API routes) |
| **React 19** | Open Source | MIT | ✅ Completely Free | — | UI rendering |
| **TypeScript** | Open Source | Apache 2.0 | ✅ Completely Free | — | Type safety across full stack |

## Styling & UI

| Technology | Type | License | Free Tier | Paid Pricing | Used For |
|---|---|---|---|---|---|
| **Tailwind CSS v4** | Open Source | MIT | ✅ Completely Free | — | Utility-first CSS styling |
| **shadcn/ui** | Open Source | MIT | ✅ Completely Free | — | Pre-built UI components (buttons, dialogs, tables) |
| **Lucide Icons** | Open Source | ISC | ✅ Completely Free | — | Icon library |
| **react-icons** | Open Source | MIT | ✅ Completely Free | — | Social icons (GitHub, Google) |

## Data & API Layer

| Technology | Type | License | Free Tier | Paid Pricing | Used For |
|---|---|---|---|---|---|
| **tRPC v11** | Open Source | MIT | ✅ Completely Free | — | Type-safe API layer (server ↔ client) |
| **Drizzle ORM** | Open Source | Apache 2.0 | ✅ Completely Free | — | Database queries & schema management |
| **TanStack React Query** | Open Source | MIT | ✅ Completely Free | — | Client-side caching, loading states, mutations |
| **Zod** | Open Source | MIT | ✅ Completely Free | — | Input validation (forms + API) |

## Database

| Technology | Type | License | Free Tier | Paid Pricing | Used For |
|---|---|---|---|---|---|
| **Neon (PostgreSQL)** | Cloud Service (Freemium) | Proprietary | ✅ 0.5 GB storage, 100 CU-hours/mo | Launch: $0.106/CU-hour + $0.35/GB-month | Serverless PostgreSQL database |

## Authentication

| Technology | Type | License | Free Tier | Paid Pricing | Used For |
|---|---|---|---|---|---|
| **Better Auth** | Open Source | MIT | ✅ Completely Free | — | Auth system (email/password, OAuth, sessions) |

## Video & Real-Time Communication

| Technology | Type | License | Free Tier | Paid Pricing | Used For |
|---|---|---|---|---|---|
| **Stream Video SDK** | Cloud Service (Freemium) | Proprietary | ✅ $100/mo free credits (~333k audio min) | HD Video: $1.50/1k min, Transcription: $8/1k min, Recording: $1.50/1k min | Video calls, transcription, recording |
| **Stream Chat SDK** | Cloud Service (Freemium) | Proprietary | ✅ Included in free credits | Pay-as-you-go after free credits | Post-call AI chat messaging |

## AI / Machine Learning

| Technology | Type | License | Free Tier | Paid Pricing | Used For |
|---|---|---|---|---|---|
| **OpenAI Realtime API** | Cloud Service (Paid) | Proprietary | ❌ No free tier | Audio input: $10/1M tokens, Audio output: $20/1M tokens (~$0.16–0.33/min) | Live AI agent voice during calls |
| **OpenAI GPT-4o-mini** | Cloud Service (Paid) | Proprietary | ❌ No free tier (but very cheap) | Input: $0.15/1M tokens, Output: $0.60/1M tokens | Meeting summarization + post-call chat |

## Background Jobs

| Technology | Type | License | Free Tier | Paid Pricing | Used For |
|---|---|---|---|---|---|
| **Inngest** | Cloud Service (Freemium) | Open Source (server) | ✅ 50k executions/mo, 7-day sleep | Pay-as-you-go after free tier | Durable background jobs (summary pipeline, email reminders) |

## Payments & Subscriptions

| Technology | Type | License | Free Tier | Paid Pricing | Used For |
|---|---|---|---|---|---|
| **Polar** | Cloud Service (Freemium) | Open Source (SDK) | ✅ No monthly fee | 4% + $0.40 per transaction | Subscription billing, checkout, customer portal |

## Email

| Technology | Type | License | Free Tier | Paid Pricing | Used For |
|---|---|---|---|---|---|
| **Resend** | Cloud Service (Freemium) | Proprietary | ✅ 3,000 emails/mo (100/day) | Pro: $20/mo for 50k emails | Meeting reminder emails (HTML templates) |

## Utilities & Libraries

| Technology | Type | License | Free Tier | Used For |
|---|---|---|---|---|
| **nanoid** | Open Source | MIT | ✅ Free | Generating unique IDs for DB records |
| **DiceBear** | Open Source | MIT | ✅ Free | Auto-generating avatars (robot for agents, initials for users) |
| **date-fns** | Open Source | MIT | ✅ Free | Date/time formatting (timestamps, scheduling) |
| **nuqs** | Open Source | MIT | ✅ Free | URL-based state management (filters, pagination) |
| **react-hook-form** | Open Source | MIT | ✅ Free | Form handling with validation |
| **pptx-text-parser** | Open Source | MIT | ✅ Free | Extracting text from PowerPoint files |
| **jsonl-parse-stringify** | Open Source | MIT | ✅ Free | Parsing Stream's JSONL transcript files |
| **react-highlight-words** | Open Source | MIT | ✅ Free | Highlighting search matches in transcript |
| **Recharts** | Open Source | MIT | ✅ Free | Dashboard analytics charts |
| **react-markdown** | Open Source | MIT | ✅ Free | Rendering meeting summary (markdown → HTML) |
| **Sonner** | Open Source | MIT | ✅ Free | Toast notifications |
| **cmdk** | Open Source | MIT | ✅ Free | Command palette / searchable select dropdowns |
| **react-day-picker** | Open Source | MIT | ✅ Free | Calendar date picker for scheduling |

## Dev Tools

| Technology | Type | License | Free Tier | Used For |
|---|---|---|---|---|
| **ngrok** | Cloud Service (Freemium) | Proprietary | ✅ Free (1 tunnel) | Exposing localhost for webhooks in development |
| **ESLint** | Open Source | MIT | ✅ Free | Code linting |

---

## Cost Summary

### Completely Free (Open Source)
> Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, tRPC, Drizzle ORM, Better Auth, TanStack Query, Zod, React Hook Form, all utilities — **$0**

### Free Tier Available (Enough for Development & Small Scale)
| Service | What you get free |
|---|---|
| **Neon** | 0.5 GB storage, 100 compute hours/mo |
| **Stream** | $100/mo in credits (~5.5 hrs HD video) |
| **Inngest** | 50,000 executions/mo |
| **Resend** | 3,000 emails/mo |
| **Polar** | No monthly fee (pay per transaction only) |
| **ngrok** | 1 free tunnel |

### Pay-As-You-Go (No Free Tier)
| Service | Estimated Cost |
|---|---|
| **OpenAI Realtime API** | ~$0.16–0.33 per minute of AI voice conversation |
| **OpenAI GPT-4o-mini** | ~$0.001–0.01 per summary (very cheap) |

### Estimated Monthly Cost at Small Scale (50 meetings/month)
| Item | Estimate |
|---|---|
| Open source tools | $0 |
| Neon (free tier) | $0 |
| Stream (within free credits) | $0 |
| Inngest (within free tier) | $0 |
| Resend (within free tier) | $0 |
| Polar (no monthly fee) | $0 + 4% per subscription |
| OpenAI Realtime (50 × 10 min calls) | ~$80–165 |
| OpenAI GPT-4o-mini (50 summaries) | ~$0.50 |
| **Total** | **~$80–165/mo** (almost entirely OpenAI Realtime) |
