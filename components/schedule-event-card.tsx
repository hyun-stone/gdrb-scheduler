import { cn } from "@/lib/utils"
import { getDepartmentColor } from "@/lib/schedule-utils"
import type { ScheduleEvent } from "@/lib/types/schedule"
import { DepartmentBadge } from "@/components/department-badge"
import { Badge } from "@/components/ui/badge"

type ScheduleEventCardProps = {
  event: ScheduleEvent
  variant?: "compact" | "full"
  className?: string
  onClick?: () => void
}

// 4뷰 공통 일정 카드
export function ScheduleEventCard({
  event,
  variant = "full",
  className,
  onClick,
}: ScheduleEventCardProps) {
  const colorClass = getDepartmentColor(event.department)

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-1.5 rounded px-1.5 py-0.5 text-left text-xs transition-colors hover:opacity-80",
          colorClass,
          event.completed && "opacity-60 line-through",
          className
        )}
      >
        <span className="shrink-0 font-mono opacity-70">
          {event.isAllDay ? "종일" : event.time}
        </span>
        <span className="truncate font-medium">{event.title}</span>
      </button>
    )
  }

  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") onClick()
            }
          : undefined
      }
      className={cn(
        "group relative overflow-hidden rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md",
        onClick && "cursor-pointer",
        event.completed && "opacity-75",
        className
      )}
    >
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-1",
          colorClass.split(" ")[0]?.replace("/15", "")
        )}
      />
      <div className="pl-2">
        <div className="mb-1.5 flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs text-muted-foreground">
            {event.isAllDay ? "종일" : event.time}
          </span>
          <DepartmentBadge department={event.department} />
          {event.completed === true && (
            <Badge variant="secondary" className="text-[10px]">
              완료
            </Badge>
          )}
        </div>
        <h4
          className={cn(
            "text-sm font-medium leading-snug",
            event.completed && "line-through text-muted-foreground"
          )}
        >
          {event.title}
        </h4>
        {event.detail && (
          <p className="mt-1 text-xs text-muted-foreground">{event.detail}</p>
        )}
      </div>
    </div>
  )
}
