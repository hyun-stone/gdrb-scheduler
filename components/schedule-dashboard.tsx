"use client"

import { Suspense } from "react"
import { format, parseISO } from "date-fns"
import { ko } from "date-fns/locale"
import { ArrowClockwiseIcon, RabbitIcon } from "@phosphor-icons/react"

import { ScheduleFilters } from "@/components/schedule-filters"
import { UpcomingEvents } from "@/components/upcoming-events"
import { ViewToolbar } from "@/components/view-toolbar"
import { DepartmentBoard } from "@/components/views/department-board"
import { ListAgenda } from "@/components/views/list-agenda"
import { MonthCalendar } from "@/components/views/month-calendar"
import { WeekTimeline } from "@/components/views/week-timeline"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useScheduleFilters } from "@/hooks/use-schedule-filters"
import { useScheduleSync } from "@/hooks/use-schedule-sync"
import { getScheduleMonthLabel } from "@/lib/schedule-utils"
import type { ScheduleEvent } from "@/lib/types/schedule"

type ScheduleDashboardProps = {
  initialEvents: ScheduleEvent[]
  initialFetchedAt: string
  defaultDate: string
  monthLabel: string
}

function ScheduleDashboardContent({
  initialEvents,
  initialFetchedAt,
  defaultDate,
  monthLabel,
}: ScheduleDashboardProps) {
  const { events, fetchedAt, isRefreshing, error, refresh } = useScheduleSync(
    initialEvents,
    initialFetchedAt
  )

  const {
    selectedDate,
    view,
    searchQuery,
    departments,
    filteredEvents,
    setSelectedDate,
    setView,
    setSearchQuery,
    setDepartments,
    toggleDepartment,
    goToPrevWeek,
    goToNextWeek,
    goToPrevDay,
    goToNextDay,
  } = useScheduleFilters(events)

  const handlePrev = () => {
    if (view === "month") {
      goToPrevWeek()
    } else {
      goToPrevDay()
    }
  }

  const handleNext = () => {
    if (view === "month") {
      goToNextWeek()
    } else {
      goToNextDay()
    }
  }

  const handleViewListForDate = (date: string) => {
    setSelectedDate(date)
    setView("list")
  }

  const displayDate = format(parseISO(selectedDate), "yyyy년 M월 d일 EEEE", {
    locale: ko,
  })

  const syncedLabel = fetchedAt
    ? format(new Date(fetchedAt), "HH:mm:ss")
    : "-"

  return (
    <div className="min-h-svh bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <RabbitIcon className="size-5 text-primary" weight="duotone" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                골든래빗 {monthLabel} 일정
              </h1>
              <p className="text-xs text-muted-foreground">{displayDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ScheduleFilters
              events={events}
              searchQuery={searchQuery}
              departments={departments}
              onSearchChange={setSearchQuery}
              onToggleDepartment={toggleDepartment}
              onClearDepartments={() => setDepartments([])}
              compact
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => refresh()}
              disabled={isRefreshing}
            >
              <ArrowClockwiseIcon
                className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
              <span className="hidden sm:inline">새로고침</span>
            </Button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6">
        {/* Sidebar — 데스크톱 */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <ScheduleFilters
            events={events}
            searchQuery={searchQuery}
            departments={departments}
            onSearchChange={setSearchQuery}
            onToggleDepartment={toggleDepartment}
            onClearDepartments={() => setDepartments([])}
          />
          <Separator className="my-4" />
          <UpcomingEvents
            events={filteredEvents}
            selectedDate={defaultDate}
            onSelectDate={setSelectedDate}
          />
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1 space-y-4">
          <ViewToolbar
            view={view}
            selectedDate={selectedDate}
            onViewChange={setView}
            onPrev={handlePrev}
            onNext={handleNext}
          />

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="rounded-xl border bg-card p-4">
            {view === "month" && (
              <MonthCalendar
                events={filteredEvents}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                onViewListForDate={handleViewListForDate}
              />
            )}
            {view === "week" && (
              <WeekTimeline
                events={filteredEvents}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            )}
            {view === "list" && (
              <ListAgenda
                events={filteredEvents}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
              />
            )}
            {view === "dept" && (
              <DepartmentBoard
                events={filteredEvents}
                onSelectDate={setSelectedDate}
              />
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            총 {filteredEvents.length}건 표시
            {filteredEvents.length !== events.length &&
              ` (전체 ${events.length}건)`}
            {" · "}
            마지막 동기화 {syncedLabel}
            {isRefreshing && " (갱신 중...)"}
          </p>
        </main>
      </div>
    </div>
  )
}

export function ScheduleDashboard(props: ScheduleDashboardProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-svh items-center justify-center text-sm text-muted-foreground">
          일정을 불러오는 중...
        </div>
      }
    >
      <ScheduleDashboardContent {...props} />
    </Suspense>
  )
}
