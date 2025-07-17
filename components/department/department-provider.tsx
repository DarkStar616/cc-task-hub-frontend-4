"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export type Department =
  | "All Departments"
  | "Maintenance"
  | "Housekeeping"
  | "Front-of-House"
  | "Activities"
  | "Operations"
  | "Grounds"

interface DepartmentContextType {
  department: Department
  setDepartment: (department: Department) => void
}

const DepartmentContext = createContext<DepartmentContextType | undefined>(undefined)

interface DepartmentProviderProps {
  children: ReactNode
}

export function DepartmentProvider({ children }: DepartmentProviderProps) {
  const [department, setDepartmentState] = useState<Department>("All Departments")

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("coot-club-department")
    if (saved && isValidDepartment(saved)) {
      setDepartmentState(saved as Department)
    }
  }, [])

  const setDepartment = (newDepartment: Department) => {
    setDepartmentState(newDepartment)
    localStorage.setItem("coot-club-department", newDepartment)
  }

  return <DepartmentContext.Provider value={{ department, setDepartment }}>{children}</DepartmentContext.Provider>
}

export function useDepartment() {
  const context = useContext(DepartmentContext)
  if (context === undefined) {
    throw new Error("useDepartment must be used within a DepartmentProvider")
  }
  return context
}

function isValidDepartment(value: string): boolean {
  const validDepartments: Department[] = [
    "All Departments",
    "Maintenance",
    "Housekeeping",
    "Front-of-House",
    "Activities",
    "Operations",
    "Grounds",
  ]
  return validDepartments.includes(value as Department)
}

export const DEPARTMENTS: Department[] = [
  "All Departments",
  "Maintenance",
  "Housekeeping",
  "Front-of-House",
  "Activities",
  "Operations",
  "Grounds",
]
