// Complete demo data for Coot Club Task Hub
export interface DemoTask {
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

export interface DemoUser {
  id: string
  name: string
  initials: string
  role: string
  department: string
  avatar_color: string
  email: string
}

export interface DemoSOP {
  id: string
  title: string
  department: string
  last_updated: string
  tags: string[]
  file_size: string
  uploaded_by: string
}

export interface DemoReminder {
  id: string
  title: string
  description: string
  time: string
  recurring: string
  active: boolean
  created_by: string
}

export const demoUsers: Record<string, DemoUser> = {
  bjorn: {
    id: "bjorn",
    name: "Bjorn",
    initials: "BJ",
    role: "Maintenance Technician",
    department: "Operations",
    avatar_color: "bg-blue-500",
    email: "bjorn@cootclub.com",
  },
  marisa: {
    id: "marisa",
    name: "Marisa Vici",
    initials: "MV",
    role: "Operations Manager",
    department: "Operations",
    avatar_color: "bg-coot-teal",
    email: "marisa@cootclub.com",
  },
  chris: {
    id: "chris",
    name: "Chris Greathead",
    initials: "CG",
    role: "General Manager",
    department: "Management",
    avatar_color: "bg-coot-navy",
    email: "chris@cootclub.com",
  },
  duppie: {
    id: "duppie",
    name: "Duppie",
    initials: "DP",
    role: "Service Technician",
    department: "Technical",
    avatar_color: "bg-purple-500",
    email: "duppie@cootclub.com",
  },
  phatheka: {
    id: "phatheka",
    name: "Phatheka Ziqhu",
    initials: "PZ",
    role: "Housekeeping Supervisor",
    department: "Housekeeping",
    avatar_color: "bg-green-500",
    email: "phatheka@cootclub.com",
  },
  lathi: {
    id: "lathi",
    name: "Lathi",
    initials: "LT",
    role: "Reception Manager",
    department: "Front Office",
    avatar_color: "bg-pink-500",
    email: "lathi@cootclub.com",
  },
  reuben: {
    id: "reuben",
    name: "Reuben",
    initials: "RB",
    role: "Activities Coordinator",
    department: "Recreation",
    avatar_color: "bg-orange-500",
    email: "reuben@cootclub.com",
  },
  yanna: {
    id: "yanna",
    name: "Yanna",
    initials: "YN",
    role: "Activities Assistant",
    department: "Recreation",
    avatar_color: "bg-yellow-500",
    email: "yanna@cootclub.com",
  },
  manete: {
    id: "manete",
    name: "Manete",
    initials: "MN",
    role: "Construction Supervisor",
    department: "Construction",
    avatar_color: "bg-red-500",
    email: "manete@cootclub.com",
  },
}

export const demoTasks: DemoTask[] = [
  {
    id: "1",
    title: "Hang Art in Office & Install all Key Boxes where needed",
    description: "Install artwork in the main office and set up key storage boxes in designated areas",
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
    description: "Organize and label all room keys and spare keys for easy identification",
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
    description: "Complete inventory of all linens, separate damaged items, and report to operations",
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
    description: "Purchase replacement linens based on inventory assessment",
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
    description: "Label all new and existing linens with proper identification marks",
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
    description: "Clean and sanitize all safety equipment for quad bike activities",
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
    description: "Install remaining roofing materials to finish the quad bike storage area",
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
    description: "Inspect and test all water, power, and distribution box systems",
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
    description: "Verify electrical connections and functionality of all laundry equipment",
    status: "pending",
    priority: "high",
    due_date: "2024-05-21",
    assigned_to: ["bjorn", "marisa"],
    owner: "marisa",
    created_at: "2024-05-19T16:00:00Z",
    updated_at: "2024-05-19T16:00:00Z",
  },
]

export const demoSOPs: DemoSOP[] = [
  {
    id: "1",
    title: "Housekeeping Daily Checklist",
    department: "Housekeeping",
    last_updated: "2024-05-15",
    tags: ["daily", "cleaning", "checklist"],
    file_size: "2.4 MB",
    uploaded_by: "marisa",
  },
  {
    id: "2",
    title: "Guest Check-in Procedure",
    department: "Front Office",
    last_updated: "2024-05-10",
    tags: ["reception", "guest", "checkin"],
    file_size: "1.8 MB",
    uploaded_by: "chris",
  },
  {
    id: "3",
    title: "Equipment Maintenance Schedule",
    department: "Maintenance",
    last_updated: "2024-05-20",
    tags: ["maintenance", "equipment", "schedule"],
    file_size: "3.2 MB",
    uploaded_by: "marisa",
  },
  {
    id: "4",
    title: "Safety Protocols for Activities",
    department: "Recreation",
    last_updated: "2024-05-18",
    tags: ["safety", "activities", "protocols"],
    file_size: "4.1 MB",
    uploaded_by: "chris",
  },
]

export const demoReminders: DemoReminder[] = [
  {
    id: "1",
    title: "Clock in at 8:00",
    description: "Daily clock in reminder",
    time: "08:00",
    recurring: "daily",
    active: true,
    created_by: "marisa",
  },
  {
    id: "2",
    title: "Daily meeting at 9:00",
    description: "Team standup meeting",
    time: "09:00",
    recurring: "weekdays",
    active: true,
    created_by: "chris",
  },
  {
    id: "3",
    title: "Linen inventory check",
    description: "Weekly linen count and assessment",
    time: "14:00",
    recurring: "weekly",
    active: true,
    created_by: "phatheka",
  },
]

export const demoAnalytics = {
  completion_rate: 44,
  total_tasks: 9,
  completed_tasks: 4,
  pending_tasks: 5,
  overdue_tasks: 5,
  active_users: 9,
  productivity_score: 78,
  weekly_completion: [65, 72, 58, 44, 67, 71, 44], // Last 7 days
  department_performance: {
    Operations: 85,
    Housekeeping: 92,
    Recreation: 78,
    Maintenance: 65,
    Construction: 45,
  },
}
