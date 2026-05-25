import {
  addDays,
  format,
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from "date-fns"
import { ko } from "date-fns/locale"

import type { ScheduleEvent } from "@/lib/types/schedule"

// 부서별 색상 맵 (4뷰 공통)
export const DEPARTMENT_COLORS: Record<string, string> = {
  "경영 기획팀": "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30",
  "영업 1팀": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  "IT 기술팀": "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30",
  "구매/법무팀": "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  "디자인/개발팀": "bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-500/30",
  나: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30",
  "마케팅팀": "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30",
  "인사 총무팀": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  "재무 회계팀": "bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30",
  "개발팀": "bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30",
  "전 부서": "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
  "영업/마케팅팀": "bg-lime-500/15 text-lime-700 dark:text-lime-300 border-lime-500/30",
  "생산/물류팀": "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
  "생산/재고팀": "bg-fuchsia-500/15 text-fuchsia-700 dark:text-fuchsia-300 border-fuchsia-500/30",
  "해외 사업팀": "bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30",
  "-": "bg-muted text-muted-foreground border-border",
}

export const DEFAULT_DEPT_COLOR =
  "bg-muted text-muted-foreground border-border"

export function getDepartmentColor(department: string): string {
  return DEPARTMENT_COLORS[department] ?? DEFAULT_DEPT_COLOR
}

export function parseTimeToMinutes(time: string): number {
  if (time === "종일") return 0
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + (minutes ?? 0)
}

export function sortEvents(events: ScheduleEvent[]): ScheduleEvent[] {
  return [...events].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)
    if (dateCompare !== 0) return dateCompare
    return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time)
  })
}

export function filterEvents(
  events: ScheduleEvent[],
  searchQuery: string,
  departments: string[]
): ScheduleEvent[] {
  const query = searchQuery.trim().toLowerCase()

  return events.filter((event) => {
    const matchesDept =
      departments.length === 0 || departments.includes(event.department)

    if (!matchesDept) return false
    if (!query) return true

    const haystack = [
      event.title,
      event.department,
      event.detail ?? "",
      event.note ?? "",
    ]
      .join(" ")
      .toLowerCase()

    return haystack.includes(query)
  })
}

export function groupByDate(
  events: ScheduleEvent[]
): Record<string, ScheduleEvent[]> {
  const sorted = sortEvents(events)
  return sorted.reduce<Record<string, ScheduleEvent[]>>((acc, event) => {
    if (!acc[event.date]) acc[event.date] = []
    acc[event.date].push(event)
    return acc
  }, {})
}

export function groupByDepartment(
  events: ScheduleEvent[]
): Record<string, ScheduleEvent[]> {
  const sorted = sortEvents(events)
  return sorted.reduce<Record<string, ScheduleEvent[]>>((acc, event) => {
    if (!acc[event.department]) acc[event.department] = []
    acc[event.department].push(event)
    return acc
  }, {})
}

export function getUniqueDepartments(events: ScheduleEvent[]): string[] {
  return [...new Set(events.map((e) => e.department))].sort()
}

export function getEventsForDate(
  events: ScheduleEvent[],
  dateStr: string
): ScheduleEvent[] {
  return sortEvents(events.filter((e) => e.date === dateStr))
}

export function getEventsForWeek(
  events: ScheduleEvent[],
  dateStr: string
): ScheduleEvent[] {
  const date = parseISO(dateStr)
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })

  return sortEvents(
    events.filter((event) => {
      const eventDate = parseISO(event.date)
      return isWithinInterval(eventDate, { start: weekStart, end: weekEnd })
    })
  )
}

export function getWeekDays(dateStr: string): string[] {
  const date = parseISO(dateStr)
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  return Array.from({ length: 7 }, (_, i) =>
    format(addDays(weekStart, i), "yyyy-MM-dd")
  )
}

export function getUpcomingEvents(
  events: ScheduleEvent[],
  fromDate: string,
  limit = 5
): ScheduleEvent[] {
  const from = parseISO(fromDate)
  return sortEvents(events)
    .filter((event) => {
      const eventDate = parseISO(event.date)
      return eventDate >= from || isSameDay(eventDate, from)
    })
    .slice(0, limit)
}

export function formatDisplayDate(dateStr: string): string {
  return format(parseISO(dateStr), "M월 d일 (EEE)", { locale: ko })
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr), "M/d")
}

export function formatWeekRange(dateStr: string): string {
  const date = parseISO(dateStr)
  const weekStart = startOfWeek(date, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(date, { weekStartsOn: 1 })
  return `${format(weekStart, "M/d")} – ${format(weekEnd, "M/d")}`
}

// 실제 오늘 날짜 기준
export function isToday(dateStr: string): boolean {
  return isSameDay(parseISO(dateStr), new Date())
}

export function getDefaultSelectedDate(events: ScheduleEvent[]): string {
  const today = format(new Date(), "yyyy-MM-dd")
  if (events.some((event) => event.date === today)) return today
  if (events.length === 0) return today
  return sortEvents(events)[0].date
}

export function getScheduleMonthLabel(dateStr: string): string {
  return format(parseISO(dateStr), "yyyy년 M월", { locale: ko })
}

export const TIMELINE_START_HOUR = 8
export const TIMELINE_END_HOUR = 20
export const TIMELINE_SLOT_MINUTES = 30

export function getTimelineHeight(): number {
  const slots =
    ((TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60) / TIMELINE_SLOT_MINUTES
  return slots * 48
}

export function getEventTopOffset(time: string): number {
  const minutes = parseTimeToMinutes(time)
  const startMinutes = TIMELINE_START_HOUR * 60
  const offsetMinutes = minutes - startMinutes
  return (offsetMinutes / TIMELINE_SLOT_MINUTES) * 48
}

export function getEventHeight(): number {
  return 44
}
