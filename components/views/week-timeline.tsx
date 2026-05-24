"use client"

import { useState } from "react"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"

import { ScheduleEventCard } from "@/components/schedule-event-card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  getEventHeight,
  getEventTopOffset,
  getEventsForDate,
  getEventsForWeek,
  getTimelineHeight,
  getWeekDays,
  isToday,
  TIMELINE_END_HOUR,
  TIMELINE_SLOT_MINUTES,
  TIMELINE_START_HOUR,
} from "@/lib/schedule-utils"
import type { ScheduleEvent } from "@/lib/types/schedule"
import { cn } from "@/lib/utils"

type WeekTimelineProps = {
  events: ScheduleEvent[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

type TimelineMode = "week" | "day"

// 주간·일간 타임라인 뷰
export function WeekTimeline({
  events,
  selectedDate,
  onSelectDate,
}: WeekTimelineProps) {
  const [mode, setMode] = useState<TimelineMode>("week")

  const weekDays =
    mode === "week" ? getWeekDays(selectedDate) : [selectedDate]

  const displayEvents =
    mode === "week"
      ? getEventsForWeek(events, selectedDate)
      : getEventsForDate(events, selectedDate)

  const timeSlots = Array.from(
    {
      length:
        ((TIMELINE_END_HOUR - TIMELINE_START_HOUR) * 60) /
        TIMELINE_SLOT_MINUTES,
    },
    (_, i) => {
      const totalMinutes =
        TIMELINE_START_HOUR * 60 + i * TIMELINE_SLOT_MINUTES
      const h = Math.floor(totalMinutes / 60)
      const m = totalMinutes % 60
      return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`
    }
  )

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Button
          variant={mode === "week" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("week")}
        >
          주간
        </Button>
        <Button
          variant={mode === "day" ? "default" : "outline"}
          size="sm"
          onClick={() => setMode("day")}
        >
          일간
        </Button>
      </div>

      <ScrollArea className="w-full">
        <div className="min-w-[640px]">
          {/* 종일 행 */}
          <div
            className="grid border-b bg-muted/20"
            style={{
              gridTemplateColumns: `56px repeat(${weekDays.length}, 1fr)`,
            }}
          >
            <div className="border-r p-2 text-xs text-muted-foreground">
              종일
            </div>
            {weekDays.map((dateStr) => {
              const allDay = getEventsForDate(displayEvents, dateStr).filter(
                (e) => e.isAllDay
              )
              const today = isToday(dateStr)
              return (
                <button
                  key={`allday-${dateStr}`}
                  type="button"
                  onClick={() => onSelectDate(dateStr)}
                  className={cn(
                    "min-h-[48px] border-r p-1 text-left last:border-r-0",
                    today && "bg-primary/5"
                  )}
                >
                  <div className="space-y-0.5">
                    {allDay.map((event) => (
                      <ScheduleEventCard
                        key={event.id}
                        event={event}
                        variant="compact"
                        className="border border-dashed"
                      />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>

          {/* 헤더: 요일 */}
          <div
            className="grid border-b"
            style={{
              gridTemplateColumns: `56px repeat(${weekDays.length}, 1fr)`,
            }}
          >
            <div className="border-r" />
            {weekDays.map((dateStr) => {
              const d = parseISO(dateStr)
              const today = isToday(dateStr)
              return (
                <button
                  key={`header-${dateStr}`}
                  type="button"
                  onClick={() => onSelectDate(dateStr)}
                  className={cn(
                    "border-r p-2 text-center last:border-r-0",
                    today && "bg-primary/10"
                  )}
                >
                  <div className="text-xs text-muted-foreground">
                    {format(d, "EEE", { locale: ko })}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-medium",
                      today && "text-primary"
                    )}
                  >
                    {format(d, "M/d")}
                  </div>
                </button>
              )
            })}
          </div>

          {/* 타임 그리드 */}
          <div className="flex">
            <div className="w-14 shrink-0 border-r">
              {timeSlots.map((slot) => (
                <div
                  key={slot}
                  className="h-12 border-b pr-1 text-right text-[10px] text-muted-foreground"
                >
                  {slot.endsWith(":00") ? slot : ""}
                </div>
              ))}
            </div>

            <div
              className="grid flex-1"
              style={{
                gridTemplateColumns: `repeat(${weekDays.length}, 1fr)`,
              }}
            >
              {weekDays.map((dateStr) => {
                const dayEvents = getEventsForDate(displayEvents, dateStr).filter(
                  (e) => !e.isAllDay
                )
                const today = isToday(dateStr)

                return (
                  <div
                    key={`grid-${dateStr}`}
                    className={cn(
                      "relative border-r last:border-r-0",
                      today && "bg-primary/5"
                    )}
                    style={{ height: getTimelineHeight() }}
                  >
                    {timeSlots.map((slot) => (
                      <div
                        key={slot}
                        className="absolute w-full border-b border-dashed border-border/50"
                        style={{
                          top: getEventTopOffset(slot),
                          height: 48,
                        }}
                      />
                    ))}

                    {dayEvents.map((event) => (
                      <div
                        key={event.id}
                        className="absolute right-0.5 left-0.5 z-10"
                        style={{
                          top: getEventTopOffset(event.time),
                          height: getEventHeight(),
                        }}
                      >
                        <ScheduleEventCard
                          event={event}
                          variant="compact"
                          className="h-full"
                        />
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}
