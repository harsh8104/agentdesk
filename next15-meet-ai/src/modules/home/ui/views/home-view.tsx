"use client";

import {
  VideoIcon,
  BotIcon,
  CheckCircleIcon,
  ClockIcon,
  TrendingUpIcon,
  CalendarIcon,
  UsersIcon,
} from "lucide-react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useTRPC } from "@/trpc/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_COLORS: Record<string, string> = {
  upcoming: "var(--chart-1)",
  active: "var(--chart-2)",
  completed: "var(--chart-3)",
  processing: "var(--chart-4)",
  cancelled: "var(--chart-5)",
};

const STATUS_LABELS: Record<string, string> = {
  upcoming: "Upcoming",
  active: "Active",
  completed: "Completed",
  processing: "Processing",
  cancelled: "Cancelled",
};

function formatMonth(dateStr: string) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export const HomeView = () => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.dashboard.getStats.queryOptions());

  const statusChartConfig = Object.fromEntries(
    Object.entries(STATUS_LABELS).map(([key, label]) => [
      key,
      { label, color: STATUS_COLORS[key] },
    ])
  );

  const monthChartConfig = {
    count: { label: "Meetings", color: "var(--chart-2)" },
  };

  const agentChartConfig = {
    count: { label: "Meetings", color: "var(--chart-1)" },
  };

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of your meetings and agents
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Meetings
            </CardTitle>
            <VideoIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all statuses
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-chart-1 to-chart-2" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <BotIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.totalAgents}</div>
            <p className="text-xs text-muted-foreground mt-1">
              AI agents created
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-chart-2 to-chart-3" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircleIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.completedMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Meetings finished
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-chart-3 to-chart-4" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <ClockIcon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.upcomingMeetings}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Scheduled meetings
            </p>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-chart-4 to-chart-5" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-chart-1/10">
                <TrendingUpIcon className="size-4 text-chart-1" />
              </div>
              Meeting Status
            </CardTitle>
            <CardDescription>
              Distribution across all statuses
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.meetingsByStatus.length > 0 ? (
              <ChartContainer config={statusChartConfig} className="h-[280px] w-full">
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={data.meetingsByStatus}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    strokeWidth={2}
                    stroke="var(--background)"
                  >
                    {data.meetingsByStatus.map((entry) => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
                <VideoIcon className="size-10 mb-3 opacity-30" />
                <p className="text-sm">No meetings yet</p>
              </div>
            )}
            {data.meetingsByStatus.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {data.meetingsByStatus.map((entry) => (
                  <div
                    key={entry.status}
                    className="flex items-center gap-2 text-sm"
                  >
                    <div
                      className="size-3 rounded-full"
                      style={{ backgroundColor: STATUS_COLORS[entry.status] }}
                    />
                    <span className="text-muted-foreground">
                      {STATUS_LABELS[entry.status]}
                    </span>
                    <span className="font-semibold">{entry.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-chart-2/10">
                <CalendarIcon className="size-4 text-chart-2" />
              </div>
              Meetings Over Time
            </CardTitle>
            <CardDescription>Last 6 months activity</CardDescription>
          </CardHeader>
          <CardContent>
            {data.meetingsByMonth.length > 0 ? (
              <ChartContainer config={monthChartConfig} className="h-[280px] w-full">
                <AreaChart data={data.meetingsByMonth}>
                  <defs>
                    <linearGradient id="meetingsGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="month"
                    tickFormatter={formatMonth}
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={formatMonth}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="var(--chart-2)"
                    strokeWidth={2}
                    fill="url(#meetingsGradient)"
                  />
                </AreaChart>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
                <CalendarIcon className="size-10 mb-3 opacity-30" />
                <p className="text-sm">No data for the last 6 months</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-chart-1/10">
                <UsersIcon className="size-4 text-chart-1" />
              </div>
              Meetings by Agent
            </CardTitle>
            <CardDescription>Top 5 agents by meeting count</CardDescription>
          </CardHeader>
          <CardContent>
            {data.meetingsByAgent.length > 0 ? (
              <ChartContainer config={agentChartConfig} className="h-[280px] w-full">
                <BarChart
                  data={data.meetingsByAgent}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <YAxis
                    dataKey="agentName"
                    type="category"
                    tick={{ fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="count"
                    fill="var(--chart-1)"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={32}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
                <BotIcon className="size-10 mb-3 opacity-30" />
                <p className="text-sm">No agent meetings yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-chart-4/10">
                <ClockIcon className="size-4 text-chart-4" />
              </div>
              Recent Meetings
            </CardTitle>
            <CardDescription>Your latest meetings</CardDescription>
          </CardHeader>
          <CardContent>
            {data.recentMeetings.length > 0 ? (
              <div className="space-y-4">
                {data.recentMeetings.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {meeting.name}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        with {meeting.agentName} &middot;{" "}
                        {new Date(meeting.scheduledAt || meeting.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <Badge
                      variant={
                        meeting.status === "completed"
                          ? "default"
                          : meeting.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                      className="ml-3 shrink-0 text-xs capitalize"
                    >
                      {meeting.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[280px] text-muted-foreground">
                <VideoIcon className="size-10 mb-3 opacity-30" />
                <p className="text-sm">No meetings yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const HomeViewLoading = () => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40 mb-1" />
              <Skeleton className="h-4 w-56" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[280px] w-full rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const HomeViewError = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <Card className="max-w-md w-full text-center p-8">
        <CardContent>
          <p className="text-destructive font-medium mb-2">
            Failed to load dashboard
          </p>
          <p className="text-sm text-muted-foreground">
            Please try refreshing the page.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
