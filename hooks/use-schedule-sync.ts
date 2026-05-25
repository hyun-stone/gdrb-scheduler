"use client"

import { useCallback, useEffect, useState } from "react"

import { SCHEDULE_REVALIDATE_SECONDS } from "@/lib/sheets-config"
import type { ScheduleEvent } from "@/lib/types/schedule"

type SyncState = {
  events: ScheduleEvent[]
  fetchedAt: string | null
  isRefreshing: boolean
  error: string | null
}

// 주기적으로 API에서 시트 데이터 동기화
export function useScheduleSync(initialEvents: ScheduleEvent[], initialFetchedAt: string) {
  const [state, setState] = useState<SyncState>({
    events: initialEvents,
    fetchedAt: initialFetchedAt,
    isRefreshing: false,
    error: null,
  })

  const refresh = useCallback(async (silent = false) => {
    if (!silent) {
      setState((prev) => ({ ...prev, isRefreshing: true, error: null }))
    }

    try {
      const response = await fetch("/api/schedules", { cache: "no-store" })

      if (!response.ok) {
        const body = (await response.json()) as { error?: string }
        throw new Error(body.error ?? "일정 갱신에 실패했습니다.")
      }

      const data = (await response.json()) as {
        events: ScheduleEvent[]
        fetchedAt: string
      }

      setState({
        events: data.events,
        fetchedAt: data.fetchedAt,
        isRefreshing: false,
        error: null,
      })
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isRefreshing: false,
        error: error instanceof Error ? error.message : "일정 갱신에 실패했습니다.",
      }))
    }
  }, [])

  useEffect(() => {
    const intervalMs = SCHEDULE_REVALIDATE_SECONDS * 1000
    const intervalId = window.setInterval(() => refresh(true), intervalMs)

    const onFocus = () => refresh(true)
    window.addEventListener("focus", onFocus)

    return () => {
      window.clearInterval(intervalId)
      window.removeEventListener("focus", onFocus)
    }
  }, [refresh])

  return { ...state, refresh }
}
