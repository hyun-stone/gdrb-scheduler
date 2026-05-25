"use client"

import {
  CalendarIcon,
  ListBulletsIcon,
  KanbanIcon,
  ClockIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatWeekRange, getScheduleMonthLabel } from "@/lib/schedule-utils"
import type { ScheduleView } from "@/lib/types/schedule"

type ViewToolbarProps = {
  view: ScheduleView
  selectedDate: string
  onViewChange: (view: ScheduleView) => void
  onPrev: () => void
  onNext: () => void
}

const VIEW_OPTIONS: { value: ScheduleView; label: string; icon: React.ElementType }[] = [
  { value: "month", label: "월간", icon: CalendarIcon },
  { value: "week", label: "주간", icon: ClockIcon },
  { value: "list", label: "리스트", icon: ListBulletsIcon },
  { value: "dept", label: "부서", icon: KanbanIcon },
]

// 날짜 네비게이션 + 뷰 탭
export function ViewToolbar({
  view,
  selectedDate,
  onViewChange,
  onPrev,
  onNext,
}: ViewToolbarProps) {
  const navLabel =
    view === "month"
      ? getScheduleMonthLabel(selectedDate)
      : view === "week"
        ? formatWeekRange(selectedDate)
        : selectedDate

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-1">
        <Button variant="outline" size="icon-sm" onClick={onPrev}>
          <CaretLeftIcon className="size-4" />
        </Button>
        <span className="min-w-[140px] text-center text-sm font-medium">
          {navLabel}
        </span>
        <Button variant="outline" size="icon-sm" onClick={onNext}>
          <CaretRightIcon className="size-4" />
        </Button>
      </div>

      <Tabs
        value={view}
        onValueChange={(v) => onViewChange(v as ScheduleView)}
      >
        <TabsList className="w-full sm:w-auto">
          {VIEW_OPTIONS.map(({ value, label, icon: Icon }) => (
            <TabsTrigger key={value} value={value} className="gap-1.5">
              <Icon className="size-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
