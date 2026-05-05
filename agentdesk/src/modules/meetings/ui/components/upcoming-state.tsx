import Link from "next/link"
import { VideoIcon } from "lucide-react"

import { Button } from "@/components/ui/button"


interface Props {
  meetingId: string;
}

export const UpcomingState = ({
  meetingId,
}: Props) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <video
          src="/Communicate to solve problem.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-48 h-48 rounded-full object-cover"
        />
        <div className="flex flex-col gap-y-6 max-w-md mx-auto text-center mt-4">
          <h6 className="text-lg font-medium">Not started yet</h6>
          <p className="text-sm text-muted-foreground">Once you start this meeting, a summary will appear here</p>
        </div>
      </div>
      <div className="flex flex-col-reverse lg:flex-row lg:justify-center items-center gap-2 w-full">
        <Button asChild className="w-full lg:w-auto">
          <Link href={`/call/${meetingId}`}>
            <VideoIcon />
            Start meeting
          </Link>
        </Button>
      </div>
    </div>
  )
}