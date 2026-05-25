import { ScheduleDashboard } from "@/components/schedule-dashboard"
import { fetchSchedulesFromSheet } from "@/lib/fetch-schedules"
import { getDefaultSelectedDate, getScheduleMonthLabel } from "@/lib/schedule-utils"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "골든래빗 일정",
  description: "Google Sheets 연동 골든래빗 일정 대시보드",
}

export const revalidate = 60

export default async function Page() {
  const { events, fetchedAt } = await fetchSchedulesFromSheet()
  const defaultDate = getDefaultSelectedDate(events)
  const monthLabel = getScheduleMonthLabel(defaultDate)

  return (
    <ScheduleDashboard
      initialEvents={events}
      initialFetchedAt={fetchedAt}
      defaultDate={defaultDate}
      monthLabel={monthLabel}
    />
  )
}
