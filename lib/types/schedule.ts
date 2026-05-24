// 일정 이벤트 타입 정의
export type ScheduleEvent = {
  id: string
  date: string
  dayOfWeek: string
  time: string
  isAllDay: boolean
  title: string
  department: string
  detail?: string
  note?: string
}

export type ScheduleView = "month" | "week" | "list" | "dept"

export type ScheduleFilters = {
  selectedDate: string
  view: ScheduleView
  searchQuery: string
  departments: string[]
}
