import { eq, inArray } from "drizzle-orm";
import JSONL from "jsonl-parse-stringify";
import { format } from "date-fns";
import { createAgent, openai, TextMessage } from "@inngest/agent-kit";

import { db } from "@/db";
import { agents, meetings, presentationSlides, user } from "@/db/schema";
import { inngest } from "@/inngest/client";
import { resend } from "@/lib/resend";

import { StreamTranscriptItem } from "@/modules/meetings/types";

function createSummarizer(slideContext?: string) {
  const slideSection = slideContext
    ? `

### Slide References
The meeting used a presentation. Map discussion topics to the relevant slide numbers with timestamps.
For each significant topic, note which slide (by number) was being discussed and at what time range.

Example:
#### Slide 1 — Introduction
- [00:00 – 01:30] Speaker introduced the topic covered on Slide 1
- Key points discussed from this slide

#### Slide 3 — Feature Overview
- [03:00 – 05:15] Detailed walkthrough of content on Slide 3

Here is the slide content for reference:
${slideContext}`
    : "";

  return createAgent({
    name: "summarizer",
    system: `
    You are an expert summarizer. You write readable, concise, simple content. You are given a transcript of a meeting and you need to summarize it.

Use the following markdown structure for every output:

### Overview
Provide a detailed, engaging summary of the session's content. Focus on major features, user workflows, and any key takeaways. Write in a narrative style, using full sentences. Highlight unique or powerful aspects of the product, platform, or discussion.

### Notes
Break down key content into thematic sections with timestamp ranges. Each section should summarize key points, actions, or demos in bullet format.

Example:
#### Section Name
- Main point or demo shown here
- Another key insight or interaction
- Follow-up tool or explanation provided

#### Next Section
- Feature X automatically does Y
- Mention of integration with Z
${slideSection}
  `.trim(),
    model: openai({ model: "gpt-4o-mini", apiKey: process.env.OPENAI_API_KEY }),
  });
}

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings/processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const response = await step.run("fetch-transcript", async () => {
      return fetch(event.data.transcriptUrl).then((res) => res.text());
    });

    const transcript = await step.run("parse-transcript", async () => {
      return JSONL.parse<StreamTranscriptItem>(response);
    });

    const transcriptWithSpeakers = await step.run("add-speakers", async () => {
      const speakerIds = [
        ...new Set(transcript.map((item) => item.speaker_id)),
      ];

      const userSpeakers = await db
        .select()
        .from(user)
        .where(inArray(user.id, speakerIds))
        .then((users) =>
          users.map((user) => ({
            ...user,
          }))
        );

      const agentSpeakers = await db
        .select()
        .from(agents)
        .where(inArray(agents.id, speakerIds))
        .then((agents) =>
          agents.map((agent) => ({
            ...agent,
          }))
        );

      const speakers = [...userSpeakers, ...agentSpeakers];

      return transcript.map((item) => {
        const speaker = speakers.find(
          (speaker) => speaker.id === item.speaker_id
        );

        if (!speaker) {
          return {
            ...item,
            user: {
              name: "Unknown",
            },
          };
        }

        return {
          ...item,
          user: {
            name: speaker.name,
          },
        };
      });
    });

    // Fetch slide content if the meeting has a linked presentation
    const slideContext = await step.run("fetch-slide-context", async () => {
      const [existingMeeting] = await db
        .select()
        .from(meetings)
        .where(eq(meetings.id, event.data.meetingId));

      if (!existingMeeting?.presentationId) return null;

      const slides = await db
        .select()
        .from(presentationSlides)
        .where(eq(presentationSlides.presentationId, existingMeeting.presentationId))
        .orderBy(presentationSlides.slideNumber);

      if (slides.length === 0) return null;

      return slides
        .map((s) => `Slide ${s.slideNumber}: ${s.textContent}`)
        .join("\n");
    });

    const summarizer = createSummarizer(slideContext ?? undefined);

    const { output } = await summarizer.run(
      "Summarize the following transcript: " +
        JSON.stringify(transcriptWithSpeakers)
    );

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary: (output[0] as TextMessage).content as string,
          status: "completed",
        })
        .where(eq(meetings.id, event.data.meetingId))
    })
  },
);

export const meetingReminder = inngest.createFunction(
  { id: "meetings/reminder" },
  { event: "meetings/reminder" },
  async ({ event, step }) => {
    const { meetingId, userId, scheduledAt } = event.data;

    // Wait until 15 minutes before the scheduled time
    const reminderTime = new Date(new Date(scheduledAt).getTime() - 15 * 60 * 1000);
    const now = new Date();

    if (reminderTime > now) {
      await step.sleepUntil("wait-for-reminder-time", reminderTime);
    }

    // Fetch meeting and user details
    const emailData = await step.run("fetch-email-data", async () => {
      const [existingMeeting] = await db
        .select()
        .from(meetings)
        .where(eq(meetings.id, meetingId));

      if (!existingMeeting || existingMeeting.status !== "upcoming") {
        return null;
      }

      const [existingUser] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId));

      if (!existingUser) {
        return null;
      }

      // Fetch the AI agent name
      const [existingAgent] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, existingMeeting.agentId));

      // Check if a presentation is attached
      let presentationName: string | null = null;
      if (existingMeeting.presentationId) {
        const { presentations } = await import("@/db/schema");
        const [pres] = await db
          .select()
          .from(presentations)
          .where(eq(presentations.id, existingMeeting.presentationId));
        presentationName = pres?.name ?? null;
      }

      return {
        email: existingUser.email,
        userName: existingUser.name,
        meetingName: existingMeeting.name,
        meetingId: existingMeeting.id,
        scheduledAt: existingMeeting.scheduledAt,
        agentName: existingAgent?.name ?? "AI Agent",
        presentationName,
      };
    });

    if (!emailData) return;

    await step.run("send-reminder-email", async () => {
      const meetingUrl = `${process.env.NEXT_PUBLIC_APP_URL}/call/${emailData.meetingId}`;
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://agentdesk.ai";

      // Calculate actual remaining time dynamically
      const msRemaining = new Date(emailData.scheduledAt!).getTime() - Date.now();
      const rawMinutes = Math.max(0, Math.round(msRemaining / 60000));
      const displayMinutes = Math.min(rawMinutes, 15);
      const timeLabel = displayMinutes <= 1 ? "less than a minute" : `${displayMinutes} minutes`;

      const formattedDate = format(
        new Date(emailData.scheduledAt!),
        "EEEE, MMMM d, yyyy"
      );
      const formattedTime = format(
        new Date(emailData.scheduledAt!),
        "hh:mm a"
      );

      // Inline SVG icons (base64-safe for email)
      const svgIcon = (path: string, color = "#94a3b8") =>
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block;vertical-align:middle;margin-right:6px;">${path}</svg>`;

      const icons = {
        clipboard: svgIcon('<path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>'),
        bot: svgIcon('<path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><circle cx="9" cy="14" r="1"/><circle cx="15" cy="14" r="1"/>', "#a5b4fc"),
        calendar: svgIcon('<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>'),
        clock: svgIcon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'),
        paperclip: svgIcon('<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>'),
        lightbulb: svgIcon('<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>', "#a5b4fc"),
        rocket: svgIcon('<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>', "#ffffff"),
        arrowRight: svgIcon('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>', "#ffffff"),
      };

      const presentationRow = emailData.presentationName
        ? `<tr>
            <td style="padding: 10px 16px; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #1e293b;">${icons.paperclip} Presentation</td>
            <td style="padding: 10px 16px; color: #e2e8f0; font-size: 14px; border-bottom: 1px solid #1e293b; font-weight: 500;">${emailData.presentationName}</td>
          </tr>`
        : "";

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "AgentDesk <onboarding@resend.dev>",
        to: emailData.email,
        subject: `"${emailData.meetingName}" starts in ${timeLabel} — AgentDesk`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    @keyframes gradientShift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .email-wrapper {
      animation: fadeInUp 0.6s ease-out;
    }
    .pulse-dot {
      animation: pulse 2s ease-in-out infinite;
    }
    .detail-row {
      animation: slideIn 0.4s ease-out;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
  <div class="email-wrapper" style="max-width: 600px; margin: 0 auto; padding: 24px;">
    
    <!-- Header with Logo -->
    <div style="text-align: center; padding: 32px 0 24px;">
      <img src="https://res.cloudinary.com/drdveprgs/image/upload/v1772458355/agentdesk-logo_zsxnsl.jpg" alt="AgentDesk" width="56" height="56" style="border-radius: 12px; margin-bottom: 12px;" />
      <h1 style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px;">AgentDesk</h1>
      <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">AI-Powered Meeting Intelligence</p>
    </div>

    <!-- Main Card -->
    <div style="background: linear-gradient(145deg, #1e293b, #0f172a); border: 1px solid #334155; border-radius: 16px; overflow: hidden;">
      
      <!-- Gradient Accent Bar -->
      <div style="height: 4px; background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa, #6366f1); background-size: 200% 200%; animation: gradientShift 3s ease infinite;"></div>
      
      <!-- Alert Banner -->
      <div style="background: rgba(99, 102, 241, 0.1); border-bottom: 1px solid #1e293b; padding: 16px 24px; text-align: center;">
        <span class="pulse-dot" style="display: inline-block; width: 8px; height: 8px; background: #22c55e; border-radius: 50%; margin-right: 8px; vertical-align: middle;"></span>
        <span style="color: #a5b4fc; font-size: 14px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">Starting in ${timeLabel}</span>
      </div>

      <!-- Content -->
      <div style="padding: 28px 24px;">
        <p style="color: #94a3b8; font-size: 15px; margin: 0 0 4px;">Hello,</p>
        <h2 style="color: #f1f5f9; font-size: 20px; font-weight: 600; margin: 0 0 20px;">${emailData.userName}</h2>
        
        <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
          Your AI-powered meeting is about to begin. Your AI agent <strong style="color: #a5b4fc;">${emailData.agentName}</strong> is ready and waiting to assist you. Make sure you're prepared — here are your meeting details:
        </p>

        <!-- Meeting Details Table -->
        <div class="detail-row" style="background: #0f172a; border: 1px solid #1e293b; border-radius: 12px; overflow: hidden; margin-bottom: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 16px; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #1e293b;">${icons.clipboard} Meeting</td>
              <td style="padding: 10px 16px; color: #e2e8f0; font-size: 14px; border-bottom: 1px solid #1e293b; font-weight: 600;">${emailData.meetingName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #1e293b;">${icons.bot} AI Agent</td>
              <td style="padding: 10px 16px; color: #a5b4fc; font-size: 14px; border-bottom: 1px solid #1e293b; font-weight: 500;">${emailData.agentName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; color: #94a3b8; font-size: 14px; border-bottom: 1px solid #1e293b;">${icons.calendar} Date</td>
              <td style="padding: 10px 16px; color: #e2e8f0; font-size: 14px; border-bottom: 1px solid #1e293b; font-weight: 500;">${formattedDate}</td>
            </tr>
            <tr>
              <td style="padding: 10px 16px; color: #94a3b8; font-size: 14px;${emailData.presentationName ? " border-bottom: 1px solid #1e293b;" : ""}">${icons.clock} Time</td>
              <td style="padding: 10px 16px; color: #e2e8f0; font-size: 14px;${emailData.presentationName ? " border-bottom: 1px solid #1e293b;" : ""} font-weight: 500;">${formattedTime}</td>
            </tr>
            ${presentationRow}
          </table>
        </div>

        <!-- CTA Button -->
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${meetingUrl}" 
             style="display: inline-block; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 14px 36px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px; letter-spacing: 0.3px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4); transition: all 0.2s;">
            ${icons.arrowRight} Join Meeting Now
          </a>
        </div>

        <!-- Tips Section -->
        <div style="background: rgba(99, 102, 241, 0.05); border: 1px solid #1e293b; border-radius: 10px; padding: 16px 20px;">
          <p style="color: #a5b4fc; font-size: 13px; font-weight: 600; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">${icons.lightbulb} Quick Tips</p>
          <ul style="margin: 0; padding: 0 0 0 16px; color: #64748b; font-size: 13px; line-height: 2;">
            <li>Check your microphone and camera before joining</li>
            <li>Your AI agent will auto-transcribe and summarize the meeting</li>
            <li>Ask your AI agent questions during the call for real-time help</li>
            ${emailData.presentationName ? "<li>Your presentation slides will be available during the call</li>" : ""}
          </ul>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 24px 0 16px;">
      <p style="color: #475569; font-size: 12px; margin: 0 0 8px;">
        Powered by <strong style="color: #6366f1;">AgentDesk</strong> — AI-Powered Meeting Intelligence
      </p>
      <p style="color: #334155; font-size: 11px; margin: 0;">
        &copy; ${new Date().getFullYear()} AgentDesk. All rights reserved.
      </p>
      <p style="color: #334155; font-size: 11px; margin: 8px 0 0;">
        <a href="${appUrl}" style="color: #6366f1; text-decoration: none;">Visit Dashboard</a>
      </p>
    </div>
  </div>
</body>
</html>
        `,
      });
    });
  },
);

