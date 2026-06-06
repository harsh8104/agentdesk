import asyncio
import os
import sys
from dotenv import load_dotenv
from vision_agents.core import Agent, User
from vision_agents.plugins import getstream, openai

# Load environment variables
load_dotenv()

async def main():
    if len(sys.argv) < 5:
        print("Usage: python agent.py <meeting_id> <instructions> <agent_name> <agent_id>")
        sys.exit(1)

    meeting_id = sys.argv[1]
    instructions = sys.argv[2]
    agent_name = sys.argv[3]
    agent_id = sys.argv[4]

    # Map Stream variables for vision-agents Edge transport
    if not os.environ.get("STREAM_API_KEY"):
        os.environ["STREAM_API_KEY"] = os.environ.get("NEXT_PUBLIC_STREAM_VIDEO_API_KEY", "")
    if not os.environ.get("STREAM_API_SECRET"):
        os.environ["STREAM_API_SECRET"] = os.environ.get("STREAM_VIDEO_SECRET_KEY", "")

    print(f"[Python Agent] STREAM_API_KEY: {os.environ.get('STREAM_API_KEY')}")
    print(f"[Python Agent] STREAM_API_SECRET is set: {bool(os.environ.get('STREAM_API_SECRET'))}")
    print(f"[Python Agent] OPENAI_API_KEY is set: {bool(os.environ.get('OPENAI_API_KEY'))}")

    # Initialize the voice agent with OpenAI Realtime LLM
    agent = Agent(
        edge=getstream.Edge(),
        agent_user=User(name=agent_name, id=agent_id),
        instructions=instructions,
        llm=openai.Realtime(voice="alloy")
    )

    # Connect to the call and run until it ends
    call = await agent.create_call("default", meeting_id)
    print(f"[Python Agent] Joining call {meeting_id} as '{agent_name}'...", flush=True)
    async with agent.join(call):
        await agent.finish()
    print(f"[Python Agent] Call {meeting_id} ended.", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
