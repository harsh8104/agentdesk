import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  BotIcon,
  BrainCircuitIcon,
  MicIcon,
  BarChart3Icon,
  ShieldCheckIcon,
  ZapIcon,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen text-white">
      {/* Hero Section */}
      <section className="relative px-6 py-28 md:py-40 lg:px-8 overflow-hidden">
        {/* Gradient Background */}
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, #0f0b1e 0%, #1a1145 25%, #2d1b69 50%, #1e1252 75%, #0f0b1e 100%)",
          }}
        />
        {/* Glow Orbs */}
        <div
          className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full -z-10 blur-[120px] opacity-30"
          style={{ background: "radial-gradient(circle, #7c3aed, transparent)" }}
        />
        <div
          className="absolute bottom-10 right-1/4 w-[400px] h-[400px] rounded-full -z-10 blur-[100px] opacity-20"
          style={{ background: "radial-gradient(circle, #6366f1, transparent)" }}
        />

        <div className="mx-auto max-w-3xl text-center space-y-8 relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-violet-200">
            <ZapIcon className="h-4 w-4 text-violet-400" />
            <span>Introducing AI-Powered Meetings</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-balance leading-[1.1]">
            Unlock the Full Potential of Your{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
              Meetings
            </span>
          </h1>

          <p className="text-lg leading-8 text-gray-300/90 text-balance max-w-2xl mx-auto">
            AgentDesk automatically records, transcribes, and summarizes your
            meetings with intelligent agents. Never miss a detail and boost your
            team&apos;s productivity.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="h-12 px-8 text-base bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border-0 shadow-lg shadow-violet-500/25 transition-all duration-300 hover:shadow-violet-500/40 hover:scale-105 text-white"
              >
                Get Started for Free
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 text-base border-white/15 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white hover:text-white transition-all duration-300"
              >
                Learn More
              </Button>
            </Link>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="mt-20 flow-root sm:mt-28 max-w-5xl mx-auto">
          <div className="rounded-xl bg-white/5 p-2 ring-1 ring-white/10 backdrop-blur-sm lg:rounded-2xl lg:p-4 shadow-2xl shadow-violet-500/10">
            <video
              className="rounded-lg w-full"
              src="/Animation.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="relative py-24 sm:py-32"
        style={{
          background:
            "linear-gradient(180deg, #0f0b1e 0%, #130f24 50%, #0f0b1e 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-violet-400">
              Everything you need
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-white">
              Supercharge your productivity
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-400">
              Our platform integrates seamlessly with your workflow to provide
              actionable insights.
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-8 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: "AI Meeting Agents",
                  description:
                    "Create custom AI agents with tailored instructions that join your meetings and respond intelligently.",
                  icon: BotIcon,
                },
                {
                  name: "Real-time Transcription",
                  description:
                    "Get accurate, real-time transcripts with speaker identification and closed captions.",
                  icon: MicIcon,
                },
                {
                  name: "Smart Summaries",
                  description:
                    "AI-generated meeting summaries with key takeaways, organized notes, and action items.",
                  icon: BrainCircuitIcon,
                },
                {
                  name: "Meeting Analytics",
                  description:
                    "Visualize meeting trends, track agent usage, and get detailed analytics dashboards.",
                  icon: BarChart3Icon,
                },
                {
                  name: "Post-Meeting Chat",
                  description:
                    "Chat with your AI agent after the meeting to revisit key points and get follow-up answers.",
                  icon: ZapIcon,
                },
                {
                  name: "Secure & Private",
                  description:
                    "Enterprise-grade security with encrypted recordings, transcripts, and authenticated access.",
                  icon: ShieldCheckIcon,
                },
              ].map((feature) => (
                <div
                  key={feature.name}
                  className="group flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/[0.06] hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5"
                >
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-white">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600/20 to-indigo-600/20 ring-1 ring-violet-500/20 group-hover:ring-violet-500/40 transition-all duration-300">
                      <feature.icon
                        className="h-5 w-5 text-violet-400"
                        aria-hidden="true"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section
        className="relative isolate px-6 py-24 sm:py-32 lg:px-8"
        style={{ background: "#0f0b1e" }}
      >

        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
            Ready to transform your meetings?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300/80">
            Join thousands of teams who trust AgentDesk to streamline their
            communication and boost efficiency.
          </p>

        </div>
      </section>
    </div>
  );
}
