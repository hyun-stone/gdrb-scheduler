import { cn } from "@/lib/utils"
import { getDepartmentColor } from "@/lib/schedule-utils"

type DepartmentBadgeProps = {
  department: string
  className?: string
}

// 부서별 색상 Badge
export function DepartmentBadge({ department, className }: DepartmentBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        getDepartmentColor(department),
        className
      )}
    >
      {department}
    </span>
  )
}
