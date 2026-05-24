"use client"

import { KanbanIcon } from "@phosphor-icons/react"

import { ScheduleEventCard } from "@/components/schedule-event-card"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  formatShortDate,
  getDepartmentColor,
  groupByDepartment,
} from "@/lib/schedule-utils"
import type { ScheduleEvent } from "@/lib/types/schedule"
import { cn } from "@/lib/utils"

type DepartmentBoardProps = {
  events: ScheduleEvent[]
  onSelectDate: (date: string) => void
}

const MUTED_DEPARTMENTS = new Set(["-", "전 부서"])

// 부서별 보드 뷰
export function DepartmentBoard({ events, onSelectDate }: DepartmentBoardProps) {
  const grouped = groupByDepartment(events)
  const departments = Object.keys(grouped).sort()

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
        <KanbanIcon className="size-10 opacity-40" />
        <p className="text-sm">조건에 맞는 일정이 없습니다.</p>
      </div>
    )
  }

  return (
    <ScrollArea className="w-full">
      <div className="flex gap-4 pb-4">
        {departments.map((dept) => {
          const deptEvents = grouped[dept] ?? []
          const muted = MUTED_DEPARTMENTS.has(dept)

          return (
            <div
              key={dept}
              className={cn(
                "w-72 shrink-0 rounded-xl border bg-muted/20",
                muted && "opacity-80"
              )}
            >
              <div
                className={cn(
                  "rounded-t-xl border-b px-3 py-2.5",
                  getDepartmentColor(dept)
                )}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{dept}</h3>
                  <span className="text-xs opacity-70">{deptEvents.length}건</span>
                </div>
              </div>

              <div className="space-y-2 p-2">
                {deptEvents.map((event) => (
                  <div key={event.id} className="space-y-1">
                    <button
                      type="button"
                      onClick={() => onSelectDate(event.date)}
                      className="text-xs text-muted-foreground hover:text-foreground"
                    >
                      {formatShortDate(event.date)} ·{" "}
                      {event.isAllDay ? "종일" : event.time}
                    </button>
                    <ScheduleEventCard
                      event={event}
                      variant="full"
                      onClick={() => onSelectDate(event.date)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </ScrollArea>
  )
}
