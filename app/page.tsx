import { ScheduleDashboard } from "@/components/schedule-dashboard"
import schedules from "@/data/schedules.json"
import { DEMO_TODAY } from "@/lib/schedule-utils"
import type { ScheduleEvent } from "@/lib/types/schedule"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "골든래빗 12월 일정",
  description: "2025년 12월 골든래빗 회사 일정 대시보드",
}

export default function Page() {
  const events = schedules as ScheduleEvent[]

  return <ScheduleDashboard events={events} defaultDate={DEMO_TODAY} />
}
