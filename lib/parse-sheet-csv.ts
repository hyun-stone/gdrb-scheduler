import type { ScheduleEvent } from "@/lib/types/schedule"

// CSV 한 줄 파싱 (따옴표·쉼표 처리)
function parseCsvLine(line: string): string[] {
  const fields: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"'
        i++
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === "," && !inQuotes) {
      fields.push(current.trim())
      current = ""
      continue
    }

    current += char
  }

  fields.push(current.trim())
  return fields
}

// "2025. 12. 1" → "2025-12-01"
export function normalizeSheetDate(raw: string): string {
  const parts = raw
    .replace(/\./g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length < 3) return raw

  const [year, month, day] = parts
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`
}

function parseCompleted(raw: string): boolean | undefined {
  const value = raw.trim().toUpperCase()
  if (value === "TRUE") return true
  if (value === "FALSE") return false
  return undefined
}

// Google Sheets CSV → ScheduleEvent[]
export function parseSheetCsv(csv: string): ScheduleEvent[] {
  const lines = csv.split(/\r?\n/).filter((line) => line.trim())

  if (lines.length <= 1) return []

  return lines.slice(1).flatMap((line, index) => {
    const cols = parseCsvLine(line)
    const [dateRaw, dayOfWeek, time, title, department, statusRaw, note] = cols

    if (!dateRaw?.trim() || !title?.trim()) return []

    const normalizedDate = normalizeSheetDate(dateRaw)
    const isAllDay = time?.trim() === "종일"

    return [
      {
        id: `evt-${normalizedDate}-${index}`,
        date: normalizedDate,
        dayOfWeek: dayOfWeek?.trim() ?? "",
        time: time?.trim() ?? "",
        isAllDay,
        title: title.trim(),
        department: department?.trim() ?? "-",
        completed: parseCompleted(statusRaw ?? ""),
        detail: note?.trim() || undefined,
      },
    ]
  })
}
