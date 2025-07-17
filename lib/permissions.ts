export type UserRole = "User" | "Manager" | "Admin" | "God"

export function canClockInOut(role: UserRole): boolean {
  return ["User", "Manager", "Admin", "God"].includes(role)
}

export function canViewTeamStatus(role: UserRole): boolean {
  return ["Manager", "Admin", "God"].includes(role)
}

export function hasManagerPermissions(role: UserRole): boolean {
  return ["Manager", "Admin", "God"].includes(role)
}

export function hasAdminPermissions(role: UserRole): boolean {
  return ["Admin", "God"].includes(role)
}
