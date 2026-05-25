"use client"

import { useEffect, useRef } from "react"
import { CalendarBlankIcon } from "@phosphor-icons/react"

import { ScheduleEventCard } from "@/components/schedule-event-card"
import { DepartmentBadge } from "@/components/department-badge"
import { Separator } from "@/components/ui/separator"
import {
  formatDisplayDate,
  groupByDate,
  isToday,
  sortEvents,
} from "@/lib/schedule-utils"
import type { ScheduleEvent } from "@/lib/types/schedule"
import { cn } from "@/lib/utils"

type ListAgendaProps = {
  events: ScheduleEvent[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

// 리스트·아젠다 뷰
export function ListAgenda({ events, selectedDate, onSelectDate }: ListAgendaProps) {
  const todayRef = useRef<HTMLDivElement>(null)
  const grouped = groupByDate(events)
  const dates = Object.keys(grouped).sort()

  useEffect(() => {
    if (todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }, [])

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
        <CalendarBlankIcon className="size-10 opacity-40" />
        <p className="text-sm">조건에 맞는 일정이 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {dates.map((date) => {
        const dayEvents = grouped[date] ?? []
        const today = isToday(date)

        return (
          <section
            key={date}
            ref={today ? todayRef : undefined}
          >
            <button
              type="button"
              onClick={() => onSelectDate(date)}
              className={cn(
                "sticky top-0 z-10 mb-3 flex w-full items-center gap-2 rounded-lg border bg-background/95 px-3 py-2 backdrop-blur-sm text-left transition-colors hover:bg-muted/50",
                today && "border-primary/50 ring-1 ring-primary/20"
              )}
            >
              <span className="text-sm font-semibold">
                {formatDisplayDate(date)}
              </span>
              {today && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  오늘
                </span>
              )}
              <span className="ml-auto text-xs text-muted-foreground">
                {dayEvents.length}건
              </span>
            </button>

            <div className="space-y-2 pl-1">
              {sortEvents(dayEvents).map((event) => (
                <div
                  key={event.id}
                  className="flex gap-3 rounded-lg border bg-card p-3"
                >
                  <div className="w-14 shrink-0 pt-0.5 font-mono text-xs text-muted-foreground">
                    {event.isAllDay ? "종일" : event.time}
                  </div>
                  <Separator orientation="vertical" className="h-auto" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-medium">{event.title}</h4>
                      <DepartmentBadge department={event.department} />
                    </div>
                    {event.detail && (
                      <p className="text-xs text-muted-foreground">
                        {event.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
