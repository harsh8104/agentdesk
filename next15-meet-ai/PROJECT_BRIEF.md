# Meet AI (AgentDesk) — User Flow Summary

Meet AI is an **AI-powered meeting intelligence platform** built with Next.js 15, React 19, tRPC, Drizzle ORM, and Neon PostgreSQL.
Users sign up via **Email/Password, GitHub, or Google OAuth** using Better Auth and land on the **Dashboard** — an analytics hub showing meeting stats, trends, and recent activity with interactive Recharts visualizations.

From the dashboard, users create **custom AI Agents** by giving them a name and specific instructions — these agents act as real-time conversational partners during video calls.
Users then **schedule meetings** by selecting an agent, setting an optional time, and optionally attaching a **PowerPoint presentation** — when uploaded, the `.pptx` file is parsed slide-by-slide using `pptx-text-parser`, extracting the text content from each slide and storing them individually in the database with their slide numbers.
If a meeting is scheduled, **Inngest** triggers a durable background job that sends a beautifully designed **HTML reminder email** via Resend 15 minutes before start.

When it's time, the user enters the **video call lobby** (powered by Stream Video SDK), previews their camera/mic, and joins.
If a presentation was attached, the user can **see a live slide preview during the call**, allowing them to follow along and reference specific slides while speaking with the AI agent.
The **AI agent joins as a live participant**, interacting in real-time using OpenAI's Realtime API, while Stream Chat enables in-call messaging. The agent is **slide-aware** — when the user asks a question, the AI first checks whether the answer exists within the uploaded presentation slides; if relevant slide content is found, it answers directly from the slides, and if not, the agent responds using its own general knowledge. This makes the AI a smart presentation assistant that stays grounded in the user's content while still being helpful beyond it.
Once the call ends, a **Stream webhook** fires, triggering Inngest's **meeting processing pipeline**: it fetches the JSONL transcript, identifies speakers (users & agents), pulls the full slide context if a presentation was attached, and runs **GPT-4o-mini** to generate a structured markdown summary — including an Overview, Notes, and **Slide References** that map discussion topics back to specific slide numbers with timestamps.

The meeting then moves to **Completed** status, where users can review the AI-generated summary (rendered via react-markdown), search through the full transcript with highlighted keywords, and access the video recording.
All resources are gated by a **freemium model** (3 meetings, 1 agent, 1 presentation for free) managed through **Polar** subscription billing with checkout and a self-service customer portal.
The entire app features a polished dark-themed UI with 54+ shadcn/ui components, responsive layouts, data tables with pagination/search/filters, and URL-synced state via nuqs.
