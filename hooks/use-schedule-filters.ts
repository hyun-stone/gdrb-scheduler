"use client"

import { useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { addDays, addWeeks, format, parseISO, subWeeks } from "date-fns"

import type { ScheduleEvent, ScheduleView } from "@/lib/types/schedule"
import { filterEvents } from "@/lib/schedule-utils"

const DEFAULT_DATE = "2025-12-01"
const DEFAULT_VIEW: ScheduleView = "list"

const VALID_VIEWS: ScheduleView[] = ["month", "week", "list", "dept"]

function parseView(value: string | null): ScheduleView {
  if (value && VALID_VIEWS.includes(value as ScheduleView)) {
    return value as ScheduleView
  }
  return DEFAULT_VIEW
}

export function useScheduleFilters(events: ScheduleEvent[]) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const selectedDate = searchParams.get("date") ?? DEFAULT_DATE
  const view = parseView(searchParams.get("view"))
  const searchQuery = searchParams.get("q") ?? ""
  const departments = useMemo(() => {
    const deptParam = searchParams.get("dept")
    return deptParam ? deptParam.split(",").filter(Boolean) : []
  }, [searchParams])

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      router.replace(`?${params.toString()}`, { scroll: false })
    },
    [router, searchParams]
  )

  const setSelectedDate = useCallback(
    (date: string) => updateParams({ date }),
    [updateParams]
  )

  const setView = useCallback(
    (nextView: ScheduleView) => updateParams({ view: nextView }),
    [updateParams]
  )

  const setSearchQuery = useCallback(
    (q: string) => updateParams({ q: q || null }),
    [updateParams]
  )

  const setDepartments = useCallback(
    (depts: string[]) =>
      updateParams({ dept: depts.length > 0 ? depts.join(",") : null }),
    [updateParams]
  )

  const toggleDepartment = useCallback(
    (dept: string) => {
      const next = departments.includes(dept)
        ? departments.filter((d) => d !== dept)
        : [...departments, dept]
      setDepartments(next)
    },
    [departments, setDepartments]
  )

  const goToPrevWeek = useCallback(() => {
    const prev = subWeeks(parseISO(selectedDate), 1)
    setSelectedDate(format(prev, "yyyy-MM-dd"))
  }, [selectedDate, setSelectedDate])

  const goToNextWeek = useCallback(() => {
    const next = addWeeks(parseISO(selectedDate), 1)
    setSelectedDate(format(next, "yyyy-MM-dd"))
  }, [selectedDate, setSelectedDate])

  const goToPrevDay = useCallback(() => {
    const prev = addDays(parseISO(selectedDate), -1)
    setSelectedDate(format(prev, "yyyy-MM-dd"))
  }, [selectedDate, setSelectedDate])

  const goToNextDay = useCallback(() => {
    const next = addDays(parseISO(selectedDate), 1)
    setSelectedDate(format(next, "yyyy-MM-dd"))
  }, [selectedDate, setSelectedDate])

  const filteredEvents = useMemo(
    () => filterEvents(events, searchQuery, departments),
    [events, searchQuery, departments]
  )

  return {
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
  }
}
