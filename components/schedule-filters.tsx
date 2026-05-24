"use client"

import { MagnifyingGlassIcon, FunnelIcon } from "@phosphor-icons/react"

import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { getUniqueDepartments } from "@/lib/schedule-utils"
import type { ScheduleEvent } from "@/lib/types/schedule"

type ScheduleFiltersProps = {
  events: ScheduleEvent[]
  searchQuery: string
  departments: string[]
  onSearchChange: (q: string) => void
  onToggleDepartment: (dept: string) => void
  onClearDepartments: () => void
  compact?: boolean
}

// 검색 + 부서 필터 UI
export function ScheduleFilters({
  events,
  searchQuery,
  departments,
  onSearchChange,
  onToggleDepartment,
  onClearDepartments,
  compact = false,
}: ScheduleFiltersProps) {
  const allDepartments = getUniqueDepartments(events)

  const filterContent = (
    <div className="space-y-4">
      <div className="relative">
        <MagnifyingGlassIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="일정, 부서, 상세 검색..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>
      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-muted-foreground">
            부서 필터
          </span>
          {departments.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs"
              onClick={onClearDepartments}
            >
              초기화
            </Button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {allDepartments.map((dept) => {
            const active = departments.includes(dept)
            return (
              <Badge
                key={dept}
                variant={active ? "default" : "outline"}
                className="cursor-pointer select-none"
                onClick={() => onToggleDepartment(dept)}
              >
                {dept}
              </Badge>
            )
          })}
        </div>
      </div>
    </div>
  )

  if (compact) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="lg:hidden">
            <FunnelIcon className="size-4" />
            필터
            {departments.length > 0 && (
              <Badge variant="secondary" className="ml-1 size-5 p-0 text-xs">
                {departments.length}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80">
          <SheetHeader>
            <SheetTitle>일정 필터</SheetTitle>
          </SheetHeader>
          <div className="mt-4">{filterContent}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return filterContent
}
