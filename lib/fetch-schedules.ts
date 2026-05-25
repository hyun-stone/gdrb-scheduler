import {
  SCHEDULE_REVALIDATE_SECONDS,
  SHEETS_CSV_URL,
} from "@/lib/sheets-config"
import { parseSheetCsv } from "@/lib/parse-sheet-csv"
import type { ScheduleEvent } from "@/lib/types/schedule"

export type ScheduleFetchResult = {
  events: ScheduleEvent[]
  fetchedAt: string
}

// Google Sheets CSV fetch (서버/API 공용)
export async function fetchSchedulesFromSheet(options?: {
  noCache?: boolean
}): Promise<ScheduleFetchResult> {
  const response = await fetch(SHEETS_CSV_URL, {
    ...(options?.noCache
      ? { cache: "no-store" as const }
      : { next: { revalidate: SCHEDULE_REVALIDATE_SECONDS } }),
  })

  if (!response.ok) {
    throw new Error(`시트 데이터를 불러오지 못했습니다. (${response.status})`)
  }

  const csv = await response.text()
  const events = parseSheetCsv(csv)

  return {
    events,
    fetchedAt: new Date().toISOString(),
  }
}
