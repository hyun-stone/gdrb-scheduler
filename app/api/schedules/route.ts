import { NextResponse } from "next/server"

import { fetchSchedulesFromSheet } from "@/lib/fetch-schedules"
import { SCHEDULE_REVALIDATE_SECONDS } from "@/lib/sheets-config"

// 클라이언트 폴링용 일정 API
export async function GET() {
  try {
    const data = await fetchSchedulesFromSheet({ noCache: true })

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": `s-maxage=${SCHEDULE_REVALIDATE_SECONDS}, stale-while-revalidate`,
      },
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "일정을 불러오지 못했습니다."

    return NextResponse.json({ error: message }, { status: 502 })
  }
}

export const revalidate = 60
