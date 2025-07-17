"use client"

import { useDepartment, DEPARTMENTS } from "./department-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DepartmentSwitcherProps {
  collapsed: boolean
}

export function DepartmentSwitcher({ collapsed }: DepartmentSwitcherProps) {
  const { department, setDepartment } = useDepartment()

  if (collapsed) {
    return (
      <div className="p-3 flex justify-center">
        <div
          className="w-8 h-8 rounded-lg bg-coot-teal/10 flex items-center justify-center"
          title={`Department: ${department}`}
        >
          <Building2 className="w-4 h-4 text-coot-teal" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Department</label>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger
            className={cn(
              "w-full h-9 text-sm",
              "border-gray-200 focus:border-coot-teal focus:ring-coot-teal/20",
              "bg-white hover:bg-gray-50",
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept} className="text-sm">
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
