# Meet AI - Use Case Diagram

This document outlines the core use cases and actors for the **Meet AI** platform.

## Actors

- **Guest**: An unauthenticated user visiting the landing page.
- **User (Free)**: An authenticated user on the free tier (has limits on agents, presentations, and meetings).
- **User (Premium)**: An authenticated user with an active Polar subscription (higher or unlimited quotas).
- **AI Agent**: The virtual participant in the meeting, powered by OpenAI. It interacts in real-time and has context of uploaded slides.
- **System (Inngest / Webhooks)**: The background worker system responsible for triggered tasks (reminders, summarization).

## Use Case Diagram

```mermaid
flowchart LR
    %% ACTORS
    Guest(("Guest"))
    User(("User\n(Free/Premium)"))
    AI(("AI Agent"))
    System(("System\n(Inngest)"))

    %% AUTHENTICATION
    subgraph Auth [Authentication]
        UC_Auth(["Sign Up / Sign In"])
        UC_OAuth(["OAuth Login"])
    end

    %% DASHBOARD & ANALYTICS
    subgraph Dashboard [Dashboard & Analytics]
        UC_Dashboard(["View Dashboard Stats"])
        UC_Analytics(["View Analytics Charts"])
    end

    %% RESOURCE MANAGEMENT
    subgraph Resources [Resource Management]
        UC_Agent(["Create & Manage Custom Agents"])
        UC_Presentation(["Upload & Parse Presentations"])
        UC_Subscription(["Manage Subscription"])
    end

    %% MEETING MANAGEMENT
    subgraph MeetingManagement [Meeting Management]
        UC_Schedule(["Schedule Meeting"])
        UC_Attach(["Attach Agent & PPT"])
        UC_CancelMeeting(["Cancel Meeting"])
    end

    %% LIVE VIDEO CALL
    subgraph LiveCall [Live Video Call]
        UC_Join(["Join Call / Lobby"])
        UC_Interact(["Interact via Voice/Chat"])
        UC_Slides(["View Live Presentation Slides"])
        UC_AIRespond(["Provide Real-time AI Responses"])
    end

    %% POST-MEETING PROCESSING
    subgraph SystemJobs [Post-Meeting Processing]
        UC_Transcript(["Generate Transcript"])
        UC_Summary(["Generate AI Summary"])
        UC_Reminder(["Send Reminder Email"])
        UC_SummaryEmail(["Send Summary Email"])
    end

    %% POST-MEETING EXPERIENCE
    subgraph PostMeeting [Post-Meeting Experience]
        UC_ViewSummary(["View Meeting Summary"])
        UC_SearchTranscript(["Search Transcript"])
        UC_WatchVideo(["Watch Video Recording"])
        UC_FollowUp(["Follow-up Chat with AI"])
    end

    %% GUEST RELATIONSHIPS
    Guest --> UC_Auth
    Guest --> UC_OAuth

    %% USER RELATIONSHIPS
    User --> UC_Dashboard
    User --> UC_Analytics
    User --> UC_Agent
    User --> UC_Presentation
    User --> UC_Subscription
    User --> UC_Schedule
    User --> UC_Attach
    User --> UC_Join
    User --> UC_Interact
    User --> UC_Slides
    User --> UC_CancelMeeting
    User --> UC_ViewSummary
    User --> UC_SearchTranscript
    User --> UC_WatchVideo
    User --> UC_FollowUp

    %% INCLUDES / EXTENDS (Simulated as directed edges)
    UC_Schedule -.->|<< extends >>| UC_Attach
    UC_Join -.->|<< includes >>| UC_Interact

    %% AI AGENT RELATIONSHIPS
    AI --> UC_Interact
    AI --> UC_AIRespond
    UC_AIRespond -.->|<< uses context >>| UC_Slides

    %% SYSTEM RELATIONSHIPS
    System --> UC_Transcript
    System --> UC_Summary
    System --> UC_Reminder
    System --> UC_SummaryEmail

    %% SYSTEM TRIGGERS (Simulated as directed edges)
    UC_Schedule -.->|triggers| UC_Reminder
    UC_Join -.->|triggers| UC_Transcript
    UC_Transcript -.->|triggers| UC_Summary
    UC_Summary -.->|triggers| UC_SummaryEmail

    %% STYLING
    classDef actor fill:#f9f9f9,stroke:#333,stroke-width:2px;
    class Guest,User,AI,System actor;
```

## Description of Key Workflows

### 1. Pre-Meeting (Preparation)
Users start by logging in, creating personalized AI agents with specific instructions, and uploading PowerPoint (`.pptx`) presentations. These resources are counted against their active subscription plan limits. The user then schedules a meeting, selecting their preferred AI agent and optionally attaching a presentation.

### 2. Live Meeting (Execution)
The user enters the Stream-powered video lobby and joins the call. The AI Agent automatically joins as a participant. If a presentation was attached, the user can navigate through the slides via a side-by-side view. The user and AI agent communicate via voice and chat. When the user asks a question, the AI uses the current slide's context (if available) or its general knowledge to respond intelligently.

### 3. Post-Meeting (Processing & Review)
When the call ends, the System processes the meeting. It extracts the conversation transcript, attributes speakers, and uses GPT-4o-mini to generate a detailed summary containing an overview, notes, and specific slide references. The system then emails this summary to the user. Later, the user can review the summary, search the full transcript, watch the recording, and chat with the AI for any follow-up questions.
