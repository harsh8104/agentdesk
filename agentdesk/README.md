# AgentDesk - AI-Powered Meeting Intelligence Platform

![AgentDesk Banner](https://via.placeholder.com/1200x300?text=AgentDesk+-+AI+Powered+Meetings)

> Revolutionize your meetings with AI-powered agents, automatic transcription, intelligent summaries, and smart presentation integration.

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Development Guide](#-development-guide)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**AgentDesk** is a next-generation AI-powered video meeting application designed to enhance collaboration and productivity. It combines real-time video communication with intelligent AI agents that participate in your meetings, automatically record and transcribe conversations, generate comprehensive summaries, and intelligently connect discussion topics to your presentations.

Built with cutting-edge technologies including Next.js 15, React 19, and Stream.io for real-time communication, AgentDesk delivers a seamless experience for modern teams looking to extract maximum value from every meeting.

### Use Cases

- 📹 **Client Demos & Sales Calls**: AI agents record, transcribe, and summarize client interactions
- 📊 **Team Meetings**: Generate instant meeting minutes with action items and key decisions
- 👥 **Interviews & Recruitment**: Automated interview transcription and candidate evaluation
- 🎓 **Training Sessions**: Recorded training with indexed transcripts for future reference
- 📈 **Product Presentations**: Connect sales presentations with meeting discussions automatically

---

## ✨ Key Features

### 🤖 AI-Powered Agents
- **Custom Agent Creation**: Define custom AI agents with specific instructions and personalities
- **Real-time Participation**: AI agents actively participate in meetings, asking questions and taking notes
- **Intelligent Note-Taking**: Automatic capture of key points, action items, and decisions
- **Voice Integration**: Natural language processing with OpenAI and Inngest Agent Kit

### 📹 Real-Time Communication
- **Stream Video Integration**: High-quality video calls with sub-second latency
- **Live Chat**: Real-time text communication during calls
- **Screen Sharing**: Share presentations and screens with participants
- **Multiple Participants**: Support for group meetings with multiple attendees

### 📝 Automatic Meeting Intelligence
- **AI Transcription**: Real-time transcription of all meeting conversations
- **Smart Summaries**: Intelligent AI-generated meeting summaries with key takeaways
- **Action Items Extraction**: Automatic identification of tasks and responsibilities
- **Recording & Playback**: Full meeting recordings with indexed playback

### 🎤 Transcript & Search
- **Full-Text Search**: Search through meeting transcripts with timestamp references
- **Timestamp Navigation**: Jump to specific moments in meeting recordings
- **Exportable Transcripts**: Download transcripts in multiple formats
- **Speaker Identification**: Identify who said what in each meeting

### 📊 Presentation Integration
- **PPT File Upload**: Upload PowerPoint presentations for meeting context
- **Automatic Slide Parsing**: Extract text and images from slides
- **Slide Mapping**: Automatically map discussion topics to relevant slides
- **Visual Reference**: Display current slide during meetings for context

### 💳 Subscription Management
- **Tiered Plans**: Multiple subscription tiers with different feature sets
- **Polar Integration**: Seamless payment processing and billing
- **Usage Tracking**: Monitor meeting minutes, recording hours, and API usage
- **Flexible Billing**: Monthly and annual subscription options

### 🔐 Authentication & Security
- **Better Auth Integration**: Modern, secure authentication system
- **OAuth Support**: Sign in with popular providers (Google, GitHub, etc.)
- **Email Verification**: Secure email verification for new accounts
- **Session Management**: Automatic session handling with security best practices
- **Access Control**: Role-based access control for team members

### 📱 Responsive Design
- **Mobile-First Approach**: Fully responsive UI that works on desktop, tablet, and mobile
- **Dark Mode**: Automatic theme detection and toggle support
- **Touch-Optimized**: Intuitive touch interactions for mobile users
- **Progressive Web App**: Offline support and installable PWA

### ⚙️ Background Processing
- **Asynchronous Jobs**: Inngest-powered background job queue
- **Meeting Processing**: Automatic processing after meeting completion
- **Email Notifications**: Transactional emails via Resend
- **Scheduled Tasks**: Automated maintenance and cleanup tasks

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | Full-stack React framework | 15.3.2 |
| **React** | UI library | 19.0.0 |
| **TypeScript** | Type-safe JavaScript | Latest |
| **Tailwind CSS** | Utility-first CSS framework | v4 |
| **Shadcn/ui** | High-quality React components | Latest |
| **TanStack React Query** | Data fetching & caching | 5.76.1 |
| **TanStack React Table** | Headless table library | 8.21.3 |
| **React Hook Form** | Form state management | 7.56.4 |
| **Zod** | TypeScript-first schema validation | 3.25.7 |

### Backend & API
| Technology | Purpose | Version |
|------------|---------|---------|
| **tRPC** | End-to-end typesafe API | 11.1.2 |
| **Node.js** | Runtime environment | Latest LTS |
| **OpenAI** | AI and language models | 4.103.0 |
| **Inngest Agent Kit** | AI agent framework | 0.8.0 |

### Database
| Technology | Purpose | Version |
|------------|---------|---------|
| **Drizzle ORM** | Type-safe ORM | 0.43.1 |
| **PostgreSQL (Neon)** | Primary database | Latest |
| **Neon Serverless** | Serverless Postgres client | 1.0.0 |

### Real-Time Communication
| Technology | Purpose | Version |
|------------|---------|---------|
| **Stream Video SDK** | Video calling | 1.18.0 |
| **Stream Chat SDK** | Real-time chat | 9.1.1 |
| **Stream Node SDK** | Backend integration | 0.4.24 |

### Authentication & Payments
| Technology | Purpose | Version |
|------------|---------|---------|
| **Better Auth** | Modern auth solution | 1.2.8 |
| **Polar SDK** | Payment processing | 0.32.16 |

### Background Jobs & Email
| Technology | Purpose | Version |
|------------|---------|---------|
| **Inngest** | Background job queue | 3.37.0 |
| **Resend** | Transactional emails | 6.9.3 |

### Development & Testing
| Technology | Purpose | Version |
|------------|---------|---------|
| **Vitest** | Unit testing framework | Latest |
| **ESLint** | Code linting | Latest |
| **Drizzle Kit** | ORM migrations | Latest |

---

## 📁 Project Structure

```
agentdesk/
├── src/
│   ├── app/                          # Next.js app directory
│   │   ├── (auth)/                   # Authentication routes (sign-in, sign-up)
│   │   ├── (dashboard)/              # Dashboard routes
│   │   │   ├── agents/               # Agent management pages
│   │   │   ├── meetings/             # Meeting list & details
│   │   │   ├── presentations/        # Presentation management
│   │   │   └── premium/              # Subscription pages
│   │   ├── (landing)/                # Public landing page
│   │   ├── api/                      # API routes (webhooks, auth)
│   │   ├── call/                     # Video call room page
│   │   ├── layout.tsx                # Root layout
│   │   └── globals.css               # Global styles
│   │
│   ├── components/                   # Reusable React components
│   │   ├── ui/                       # Shadcn/ui components
│   │   ├── command-select.tsx        # Custom select/autocomplete
│   │   ├── data-table.tsx            # Advanced data table
│   │   ├── data-pagination.tsx       # Pagination component
│   │   ├── responsive-dialog.tsx     # Dialog component
│   │   ├── loading-state.tsx         # Loading skeleton
│   │   ├── error-state.tsx           # Error fallback
│   │   └── empty-state.tsx           # Empty state UI
│   │
│   ├── modules/                      # Feature modules
│   │   ├── agents/                   # Agent feature
│   │   │   ├── server/               # Server-side procedures
│   │   │   ├── ui/                   # Agent UI components
│   │   │   ├── hooks/                # Custom hooks
│   │   │   ├── schemas.ts            # Zod schemas
│   │   │   └── types.ts              # TypeScript types
│   │   ├── auth/                     # Authentication module
│   │   ├── call/                     # Video call module
│   │   ├── dashboard/                # Dashboard overview
│   │   ├── home/                     # Home/landing
│   │   ├── meetings/                 # Meeting management
│   │   ├── presentations/            # Presentation handling
│   │   └── premium/                  # Subscription management
│   │
│   ├── trpc/                         # tRPC configuration
│   │   ├── routers/                  # API routers
│   │   │   ├── _app.ts               # Main router
│   │   │   └── [feature].ts          # Feature-specific routers
│   │   ├── init.ts                   # tRPC initialization
│   │   ├── server.tsx                # Server-side client
│   │   ├── client.tsx                # Client-side client
│   │   └── query-client.ts           # React Query setup
│   │
│   ├── db/                           # Database layer
│   │   ├── schema.ts                 # Drizzle schema definitions
│   │   └── index.ts                  # Database client
│   │
│   ├── lib/                          # Utility functions & clients
│   │   ├── auth.ts                   # Authentication utilities
│   │   ├── auth-client.ts            # Client-side auth
│   │   ├── stream-video.ts           # Stream Video setup
│   │   ├── stream-chat.ts            # Stream Chat setup
│   │   ├── openai.ts                 # OpenAI client (if exists)
│   │   ├── polar.ts                  # Polar integration
│   │   ├── resend.ts                 # Email service
│   │   ├── avatar.tsx                # Avatar generation
│   │   └── utils.ts                  # Common utilities
│   │
│   ├── inngest/                      # Background job processing
│   │   ├── functions.ts              # Job definitions
│   │   ├── client.ts                 # Inngest client
│   │   └── index.ts                  # Exports
│   │
│   ├── hooks/                        # Global custom hooks
│   │   ├── use-mobile.ts             # Mobile detection
│   │   └── use-confirm.tsx           # Confirmation dialog
│   │
│   ├── constants.ts                  # Global constants
│   └── test/                         # Test setup
│
├── public/                           # Static assets
├── coverage/                         # Test coverage reports
├── node_modules/                     # Dependencies
├── drizzle.config.ts                 # Drizzle ORM config
├── next.config.ts                    # Next.js config
├── tsconfig.json                     # TypeScript config
├── vitest.config.ts                  # Vitest config
├── tailwind.config.ts                # Tailwind CSS config
├── components.json                   # Shadcn/ui config
├── package.json                      # Dependencies & scripts
├── postcss.config.mjs                # PostCSS config
├── eslint.config.mjs                 # ESLint config
└── README.md                         # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm** or **yarn**: Package manager
- **PostgreSQL Database**: Neon or self-hosted
- **Git**: Version control

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]?sslmode=require

# Authentication (Better Auth)
BETTER_AUTH_SECRET=your_secret_key_here
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Stream.io Video & Chat
NEXT_PUBLIC_STREAM_API_KEY=your_stream_api_key
STREAM_SECRET=your_stream_secret
STREAM_APP_ID=your_stream_app_id

# OpenAI & Inngest
OPENAI_API_KEY=your_openai_api_key
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_DEV_SERVER=http://localhost:8288

# Polar (Payments)
POLAR_API_KEY=your_polar_api_key
POLAR_ORG_ID=your_polar_org_id

# Resend (Email)
RESEND_API_KEY=your_resend_api_key

# ngrok (Development)
NGROK_AUTHTOKEN=your_ngrok_auth_token (for webhooks)
```

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/agentdesk.git
cd agentdesk
```

2. **Install dependencies**

```bash
# Use --legacy-peer-deps for React 19 compatibility
npm install --legacy-peer-deps
```

3. **Setup database**

```bash
# Push schema to database
npm run db:push

# View database in studio (optional)
npm run db:studio
```

4. **Start development servers**

```bash
# Terminal 1: Next.js development server
npm run dev

# Terminal 2: Inngest development server (in new terminal)
npx inngest-cli@latest dev

# Terminal 3: ngrok webhook tunnel (optional, in new terminal)
npm run dev:webhook
```

5. **Access the application**

Open your browser and navigate to `http://localhost:3000`

---

## 🔧 Development Guide

### Available Commands

```bash
# Development
npm run dev              # Start Next.js dev server (http://localhost:3000)
npm run dev:webhook     # Start ngrok tunnel for webhooks

# Building
npm run build            # Build for production
npm start                # Start production server

# Database
npm run db:push         # Push schema changes to database
npm run db:studio       # Open Drizzle Studio (http://localhost:5555)

# Testing
npm test                # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report

# Linting & Code Quality
npm run lint            # Run ESLint
npm run type-check      # Run TypeScript type checking (if configured)
```

### Project Configuration Files

#### `tsconfig.json`
- TypeScript configuration with path aliases (`@/*` → `src/*`)
- Strict mode enabled
- Next.js compatibility

#### `next.config.ts`
- External packages for WebSocket support
- Configured for production optimization

#### `drizzle.config.ts`
- Database connection via `DATABASE_URL`
- Migration tracking
- Type generation

#### `vitest.config.ts`
- Unit testing framework
- Coverage reporting
- React Testing Library integration

#### `components.json`
- Shadcn/ui component configuration
- Component aliases and aliases

### Code Style & Conventions

- **TypeScript**: All code should be strictly typed
- **React**: Functional components with hooks
- **File Naming**: 
  - Components: PascalCase (`MyComponent.tsx`)
  - Utilities: camelCase (`myUtil.ts`)
  - Schemas: `schemas.ts` for Zod definitions
- **Folder Organization**: Feature-based module structure
- **Error Handling**: Try-catch with meaningful error messages
- **Comments**: JSDoc for complex functions

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Web Browser                              │
└─────────────────────────────────────────────────────────────┘
                          │
                    HTTP/WebSocket
                          │
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                          │
│  (React 19, Tailwind, Shadcn/ui, TanStack Query)           │
└─────────────────────────────────────────────────────────────┘
                          │
            ┌─────────────┼─────────────┐
            │             │             │
        tRPC API      Stream.io      Auth Client
            │             │             │
┌───────────────────────────────────────────────────────────────────┐
│                   Next.js Backend                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ tRPC Routers (agents, meetings, presentations, etc)    │    │
│  └─────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ Server Actions & API Routes                             │    │
│  └─────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────┘
            │               │                    │
            │               │                    │
      Stream.io          Inngest           PostgreSQL
   (Video & Chat)   (Background Jobs)    (Neon Database)
            │               │                    │
            └───────────────┼────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
        OpenAI         Polar Invoice      Resend Email
         (AI)          (Payments)         (Marketing)
```

### Data Flow

1. **User Authentication**
   - User signs in via Better Auth
   - Session token stored in httpOnly cookie
   - Protected routes verified on server

2. **Meeting Creation**
   - User creates meeting with agent & presentation
   - Data stored in PostgreSQL
   - Stream.io room token generated

3. **Real-Time Meeting**
   - WebSocket connection to Stream.io
   - Video/chat transmitted in real-time
   - OpenAI processes agent responses

4. **Post-Meeting Processing**
   - Inngest job triggered on meeting end
   - Transcription processed
   - Summary generated with AI
   - Email notification sent

---

## 📡 API Documentation

### tRPC Routers

#### Agents Router (`agents.*`)

```typescript
// List user's agents
agents.list({
  page?: number,
  pageSize?: number
}) => Promise<{ agents, total }>

// Create new agent
agents.create({
  name: string,
  instructions: string
}) => Promise<{ id, name, instructions }>

// Update agent
agents.update({
  id: string,
  name?: string,
  instructions?: string
}) => Promise<Agent>

// Delete agent
agents.delete({ id: string }) => Promise<void>

// Get agent details
agents.getById({ id: string }) => Promise<Agent>
```

#### Meetings Router (`meetings.*`)

```typescript
// List user's meetings
meetings.list({
  page?: number,
  pageSize?: number,
  status?: "upcoming" | "active" | "completed"
}) => Promise<{ meetings, total }>

// Create meeting
meetings.create({
  name: string,
  agentId: string,
  presentationId?: string,
  scheduledAt?: Date
}) => Promise<Meeting>

// Start meeting (generate Stream token)
meetings.start({ id: string }) => Promise<{ token, call }>

// End meeting
meetings.end({ id: string }) => Promise<void>

// Get meeting details
meetings.getById({ id: string }) => Promise<Meeting>

// Search transcripts
meetings.searchTranscript({
  meetingId: string,
  query: string
}) => Promise<{ results }>
```

#### Presentations Router (`presentations.*`)

```typescript
// List user's presentations
presentations.list({
  page?: number,
  pageSize?: number
}) => Promise<{ presentations, total }>

// Upload presentation
presentations.upload({
  file: File,
  name: string
}) => Promise<Presentation>

// Get presentation details
presentations.getById({ id: string }) => Promise<Presentation>

// Delete presentation
presentations.delete({ id: string }) => Promise<void>
```

#### Dashboard Router (`dashboard.*`)

```typescript
// Get dashboard statistics
dashboard.getStats() => Promise<{
  totalMeetings: number,
  totalMeetingTime: number,
  recordedMeetings: number,
  aiAgents: number
}>

// Get recent meetings
dashboard.getRecentMeetings({
  limit?: number
}) => Promise<Meeting[]>
```

#### Premium Router (`premium.*`)

```typescript
// Get subscription status
premium.getSubscription() => Promise<Subscription>

// Get available plans
premium.getPlans() => Promise<Plan[]>

// Create checkout session
premium.createCheckout({ planId: string }) => Promise<{ checkoutUrl }>

// Cancel subscription
premium.cancelSubscription() => Promise<void>
```

---

## 🗄️ Database Schema

### User Management

**users** table
- `id` (Text, Primary Key): Unique user identifier
- `name` (Text): User's full name
- `email` (Text, Unique): User's email address
- `emailVerified` (Boolean): Email verification status
- `image` (Text, Optional): User's profile picture
- `createdAt` (Timestamp): Account creation date
- `updatedAt` (Timestamp): Last update timestamp

**sessions** table
- `id` (Text, Primary Key): Session identifier
- `expiresAt` (Timestamp): Session expiration time
- `token` (Text, Unique): Session token
- `userId` (Text, FK): Reference to user
- `ipAddress` (Text): User's IP address
- `userAgent` (Text): Browser user agent

### Agents & AI

**agents** table
- `id` (Text, Primary Key): Agent identifier
- `name` (Text): Agent name
- `userId` (Text, FK): Owner of the agent
- `instructions` (Text): Agent system prompt & behavior
- `createdAt` (Timestamp): Creation date
- `updatedAt` (Timestamp): Last update

### Meetings

**meetings** table
- `id` (Text, Primary Key): Meeting identifier
- `name` (Text): Meeting title
- `userId` (Text, FK): Meeting organizer
- `agentId` (Text, FK): Assigned AI agent
- `presentationId` (Text, FK, Optional): Associated presentation
- `status` (Enum): "upcoming", "active", "completed", "processing", "cancelled"
- `scheduledAt` (Timestamp, Optional): Scheduled time
- `startedAt` (Timestamp, Optional): Actual start time
- `endedAt` (Timestamp, Optional): Meeting end time
- `transcriptUrl` (Text, Optional): Transcript file location
- `recordingUrl` (Text, Optional): Video recording location
- `summary` (Text, Optional): AI-generated summary
- `createdAt` (Timestamp): Creation timestamp
- `updatedAt` (Timestamp): Last update

### Presentations

**presentations** table
- `id` (Text, Primary Key): Presentation identifier
- `name` (Text): File name
- `userId` (Text, FK): Owner
- `totalSlides` (Integer): Number of slides
- `createdAt` (Timestamp): Upload date
- `updatedAt` (Timestamp): Last update

**presentationSlides** table
- `id` (Text, Primary Key): Slide identifier
- `presentationId` (Text, FK): Parent presentation
- `slideNumber` (Integer): Slide sequence number
- `textContent` (Text): Extracted text
- `imageUrl` (Text, Optional): Slide image/thumbnail
- `createdAt` (Timestamp): Creation date

### Authentication

**accounts** table (OAuth & credentials)
- `id` (Text, Primary Key)
- `userId` (Text, FK)
- `providerId` (Text): OAuth provider name
- `accountId` (Text): External account ID
- `accessToken` (Text, Optional)
- `refreshToken` (Text, Optional)
- `scope` (Text, Optional)

**verification** table (Email verification)
- `id` (Text, Primary Key)
- `identifier` (Text): Email address
- `value` (Text): Verification code
- `expiresAt` (Timestamp): Code expiration

---

## 📸 Screenshots & UI References

### Landing Page
![Landing Page](https://via.placeholder.com/1200x600?text=Landing+Page+-+Hero+Section)
*Welcome screen with feature highlights and CTA buttons*

### Dashboard Overview
![Dashboard]![Dashboard](image-3.png)
*Main dashboard showing recent meetings, statistics, and quick actions*

### Agent Management
![Agents Page]![Create Agent](image.png)
*Create and configure custom AI agents with instructions*

### Meeting Management
![Meeting Page]![Create Agent](image8.png)
*Create and configure custom Meeting with agent that you want to interact.
### Video Call Interface
![Video Call]![VideoCall](image-2.png)
*Real-time video call with agent, chat, and presentation display*

### Meeting Transcript
![Transcript]![Transcript](image-6.png)
*Full transcript with search, timestamps, and speaker identification*

### Meeting Summary
![Summary]![AI-Summary](image-1.png)
*Automatic AI-generated meeting summary with key points and action items*

### Presentation Upload
![Presentations]![PPT Upload](image-5.png)
*Upload and manage PowerPoint presentations for meetings*

### Subscription Plans
![Plans]![Payment](image-4.png)
*Tiered subscription plans with feature comparison*

### Recording
![Plans]![Payment](image-7.png)
*User can watch whole meeting recording once meeting is over.*
### Reminder
![Plans]![Reminder](image-9.png)
*User will recieve one email as a reminder if the meeting is scheduled for the future.*
---

## 🔄 Background Jobs (Inngest)

### Job: Meeting Transcription & Summarization

**Trigger**: Meeting ends  
**Status**: "processing"

**Steps**:
1. Fetch meeting recording from Stream.io
2. Send to OpenAI Whisper for transcription
3. Process transcript through OpenAI GPT
4. Generate structured summary with:
   - Overview section
   - Key notes with timestamps
   - Slide references and mapping
   - Action items
5. Store transcript and summary in database
6. Update meeting status to "completed"
7. Send notification email to user

**Configuration**:
```typescript
export const handleMeetingEnd = inngest.createFunction(
  { id: "handle-meeting-end" },
  { event: "meetings/ended" },
  async ({ event, step }) => {
    // Job implementation
  }
);
```
**End-to-End UserFlow**:
![UserFlow](image-11.png)

**Configuration**:
---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make your changes**
   - Follow code style conventions
   - Add tests for new functionality
   - Update documentation as needed

3. **Test locally**
   ```bash
   npm run test
   npm run lint
   ```

4. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new feature description"
   ```

5. **Push and create Pull Request**
   ```bash
   git push origin feature/my-feature
   ```

### Branch Naming Conventions
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `docs/*` - Documentation
- `refactor/*` - Code refactoring

### Commit Message Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/agentdesk/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/agentdesk/discussions)
- **Email**: support@agentdesk.dev
- **Documentation**: [Full Docs](https://docs.agentdesk.dev)

---

## 🙏 Acknowledgments

- [Stream.io](https://getstream.io/) - Real-time communication infrastructure
- [OpenAI](https://openai.com/) - AI and language models
- [Shadcn/ui](https://ui.shadcn.com/) - Component library
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe ORM
- [Inngest](https://www.inngest.com/) - Background job processing
- All our contributors and users!

---

**Last Updated**: May 2026  
**Version**: 0.1.0  
**Status**: Active Development
