"use client"

import { useMemo } from "react"
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
} from "date-fns"
import { ko } from "date-fns/locale"

import { ScheduleEventCard } from "@/components/schedule-event-card"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { getEventsForDate, isToday } from "@/lib/schedule-utils"
import type { ScheduleEvent } from "@/lib/types/schedule"
import { cn } from "@/lib/utils"

type MonthCalendarProps = {
  events: ScheduleEvent[]
  selectedDate: string
  onSelectDate: (date: string) => void
  onViewListForDate: (date: string) => void
}

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"]

// 월간 캘린더 뷰
export function MonthCalendar({
  events,
  selectedDate,
  onSelectDate,
  onViewListForDate,
}: MonthCalendarProps) {
  const monthStart = startOfMonth(parseISO(selectedDate))
  const monthEnd = endOfMonth(monthStart)

  const calendarDays = useMemo(() => {
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    const startPad = (monthStart.getDay() + 6) % 7
    const paddedStart = Array.from({ length: startPad }, (_, i) => null)
    return [...paddedStart, ...days]
  }, [selectedDate, monthStart, monthEnd])

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {WEEKDAYS.map((day, i) => (
          <div
            key={day}
            className={cn(
              "py-2 text-center text-xs font-medium text-muted-foreground",
              i >= 5 && "text-destructive/70"
            )}
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) => {
          if (!day) {
            return <div key={`pad-${idx}`} className="min-h-[100px] border-b border-r bg-muted/10" />
          }

          const dateStr = format(day, "yyyy-MM-dd")
          const dayEvents = getEventsForDate(events, dateStr)
          const allDayEvents = dayEvents.filter((e) => e.isAllDay)
          const timedEvents = dayEvents.filter((e) => !e.isAllDay)
          const visible = timedEvents.slice(0, 2)
          const overflow = timedEvents.length - 2
          const selected = isSameDay(day, parseISO(selectedDate))
          const today = isToday(dateStr)
          const isWeekend = day.getDay() === 0 || day.getDay() === 6

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDate(dateStr)}
              className={cn(
                "min-h-[100px] border-b border-r p-1.5 text-left transition-colors hover:bg-muted/40",
                isWeekend && "bg-muted/15",
                selected && "bg-primary/5 ring-1 ring-inset ring-primary/30",
                today && !selected && "bg-primary/5"
              )}
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={cn(
                    "inline-flex size-6 items-center justify-center rounded-full text-xs font-medium",
                    today && "bg-primary text-primary-foreground",
                    isWeekend && !today && "text-destructive/70"
                  )}
                >
                  {format(day, "d")}
                </span>
              </div>

              <div className="space-y-0.5">
                {allDayEvents.map((event) => (
                  <Tooltip key={event.id}>
                    <TooltipTrigger asChild>
                      <div>
                        <ScheduleEventCard
                          event={event}
                          variant="compact"
                          className="border border-dashed"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="font-medium">{event.title}</p>
                      {event.detail && (
                        <p className="text-xs opacity-80">{event.detail}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ))}

                {visible.map((event) => (
                  <Tooltip key={event.id}>
                    <TooltipTrigger asChild>
                      <div>
                        <ScheduleEventCard event={event} variant="compact" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-xs opacity-80">
                        {event.time} · {event.department}
                      </p>
                      {event.detail && (
                        <p className="text-xs opacity-80">{event.detail}</p>
                      )}
                    </TooltipContent>
                  </Tooltip>
                ))}

                {overflow > 0 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      onViewListForDate(dateStr)
                    }}
                    className="w-full rounded px-1.5 py-0.5 text-left text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    +{overflow} more
                  </button>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
