// Mock data for development and UI testing
export interface MockTask {
  id: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high" | "urgent"
  due_date: string | null
  assigned_to: string[]
  owner: string
  created_at: string
  updated_at: string
  completed_at?: string
}

export interface MockUser {
  id: string
  name: string
  initials: string
  role: string
  department: string
  avatar_color: string
}

export const mockUsers: Record<string, MockUser> = {
  bjorn: {
    id: "bjorn",
    name: "Bjorn",
    initials: "BJ",
    role: "Maintenance",
    department: "Operations",
    avatar_color: "bg-blue-500",
  },
  marisa: {
    id: "marisa",
    name: "Marisa Vici",
    initials: "MV",
    role: "Operations Manager",
    department: "Operations",
    avatar_color: "bg-coot-teal",
  },
  chris: {
    id: "chris",
    name: "Chris Greathead",
    initials: "CG",
    role: "General Manager",
    department: "Management",
    avatar_color: "bg-coot-navy",
  },
  duppie: {
    id: "duppie",
    name: "Duppie",
    initials: "DP",
    role: "Service Tech",
    department: "Technical",
    avatar_color: "bg-purple-500",
  },
  phatheka: {
    id: "phatheka",
    name: "Phatheka Ziqhu",
    initials: "PZ",
    role: "Housekeeping",
    department: "Housekeeping",
    avatar_color: "bg-green-500",
  },
  lathi: {
    id: "lathi",
    name: "Lathi",
    initials: "LT",
    role: "Reception",
    department: "Front Office",
    avatar_color: "bg-pink-500",
  },
  reuben: {
    id: "reuben",
    name: "Reuben",
    initials: "RB",
    role: "Activities",
    department: "Recreation",
    avatar_color: "bg-orange-500",
  },
  yanna: {
    id: "yanna",
    name: "Yanna",
    initials: "YN",
    role: "Activities",
    department: "Recreation",
    avatar_color: "bg-yellow-500",
  },
  manete: {
    id: "manete",
    name: "Manete",
    initials: "MN",
    role: "Construction",
    department: "Construction",
    avatar_color: "bg-red-500",
  },
}

export const mockTasks: MockTask[] = [
  {
    id: "1",
    title: "Hang Art in Office & Install all Key Boxes where needed",
    status: "pending",
    priority: "medium",
    due_date: "2024-05-23",
    assigned_to: ["bjorn", "marisa"],
    owner: "marisa",
    created_at: "2024-05-20T08:00:00Z",
    updated_at: "2024-05-20T08:00:00Z",
  },
  {
    id: "2",
    title: "Room keys & spare keys tagged, clearly marked and sorted out",
    status: "completed",
    priority: "high",
    due_date: "2024-05-25",
    assigned_to: ["lathi"],
    owner: "marisa",
    created_at: "2024-05-20T09:00:00Z",
    updated_at: "2024-05-27T14:30:00Z",
    completed_at: "2024-05-27T14:30:00Z",
  },
  {
    id: "3",
    title: "Linen Count of proper linen, split soiled and torn, deliver to Marisa",
    status: "completed",
    priority: "medium",
    due_date: "2024-05-23",
    assigned_to: ["phatheka"],
    owner: "marisa",
    created_at: "2024-05-21T10:00:00Z",
    updated_at: "2024-05-23T16:00:00Z",
    completed_at: "2024-05-23T16:00:00Z",
  },
  {
    id: "4",
    title: "Order New Linen",
    status: "pending",
    priority: "high",
    due_date: "2024-05-24",
    assigned_to: ["marisa"],
    owner: "marisa",
    created_at: "2024-05-22T11:00:00Z",
    updated_at: "2024-05-22T11:00:00Z",
  },
  {
    id: "5",
    title: "Mark all linen",
    status: "completed",
    priority: "medium",
    due_date: "2024-05-28",
    assigned_to: ["phatheka"],
    owner: "marisa",
    created_at: "2024-05-25T12:00:00Z",
    updated_at: "2024-05-30T17:00:00Z",
    completed_at: "2024-05-30T17:00:00Z",
  },
  {
    id: "6",
    title: "Wash Goggles and Helmets for Quads",
    status: "completed",
    priority: "low",
    due_date: "2024-05-26",
    assigned_to: ["yanna", "reuben"],
    owner: "marisa",
    created_at: "2024-05-24T13:00:00Z",
    updated_at: "2024-05-27T15:30:00Z",
    completed_at: "2024-05-27T15:30:00Z",
  },
  {
    id: "7",
    title: "Roof sheets to complete Quad Port",
    status: "pending",
    priority: "urgent",
    due_date: "2024-06-30",
    assigned_to: ["manete", "chris"],
    owner: "chris",
    created_at: "2024-05-26T14:00:00Z",
    updated_at: "2024-05-26T14:00:00Z",
  },
  {
    id: "8",
    title: "Duppie to run through water/power/DB Boxes with Bjorn",
    status: "pending",
    priority: "medium",
    due_date: "2024-06-13",
    assigned_to: ["duppie", "bjorn"],
    owner: "marisa",
    created_at: "2024-05-28T15:00:00Z",
    updated_at: "2024-05-28T15:00:00Z",
  },
  {
    id: "9",
    title: "Ensure all washing machines/dryers are on correct plugs & working",
    status: "pending",
    priority: "high",
    due_date: "2024-05-21",
    assigned_to: ["bjorn", "marisa"],
    owner: "marisa",
    created_at: "2024-05-19T16:00:00Z",
    updated_at: "2024-05-19T16:00:00Z",
  },
]

export const mockReminders = [
  {
    id: "1",
    title: "Clock in at 8:00",
    description: "Daily clock in reminder",
    time: "08:00",
    recurring: "daily",
    active: true,
  },
  {
    id: "2",
    title: "Daily meeting at 9:00",
    description: "Team standup meeting",
    time: "09:00",
    recurring: "weekdays",
    active: true,
  },
]

export const mockSOPs = [
  {
    id: "1",
    title: "Housekeeping Daily Checklist",
    department: "Housekeeping",
    last_updated: "2024-05-15",
    tags: ["daily", "cleaning", "checklist"],
  },
  {
    id: "2",
    title: "Guest Check-in Procedure",
    department: "Front Office",
    last_updated: "2024-05-10",
    tags: ["reception", "guest", "checkin"],
  },
  {
    id: "3",
    title: "Equipment Maintenance Schedule",
    department: "Maintenance",
    last_updated: "2024-05-20",
    tags: ["maintenance", "equipment", "schedule"],
  },
]

export const mockCalendarEvents = [
  {
    id: "1",
    title: "Team Meeting",
    date: "2024-06-15",
    time: "09:00",
    type: "meeting",
    attendees: ["marisa", "chris", "bjorn"],
  },
  {
    id: "2",
    title: "Linen Delivery",
    date: "2024-06-18",
    time: "14:00",
    type: "delivery",
    attendees: ["marisa", "phatheka"],
  },
]
