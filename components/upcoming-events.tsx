"use client"

import { CalendarBlankIcon } from "@phosphor-icons/react"

import { ScheduleEventCard } from "@/components/schedule-event-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDisplayDate, getUpcomingEvents } from "@/lib/schedule-utils"
import type { ScheduleEvent } from "@/lib/types/schedule"

type UpcomingEventsProps = {
  events: ScheduleEvent[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

// 사이드바 다가오는 일정
export function UpcomingEvents({
  events,
  selectedDate,
  onSelectDate,
}: UpcomingEventsProps) {
  const upcoming = getUpcomingEvents(events, selectedDate, 5)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CalendarBlankIcon className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-medium">다가오는 일정</h3>
      </div>
      {upcoming.length === 0 ? (
        <p className="text-xs text-muted-foreground">예정된 일정이 없습니다.</p>
      ) : (
        <ScrollArea className="h-[280px] pr-3">
          <div className="space-y-2">
            {upcoming.map((event) => (
              <div key={event.id}>
                <button
                  type="button"
                  onClick={() => onSelectDate(event.date)}
                  className="mb-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  {formatDisplayDate(event.date)}
                </button>
                <ScheduleEventCard
                  event={event}
                  variant="full"
                  className="text-left"
                  onClick={() => onSelectDate(event.date)}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  )
}
