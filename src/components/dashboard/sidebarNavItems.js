// Navigation configuration for the dashboard sidebar: route, label, and icon per item.
import {
  LayoutDashboard,
  BriefcaseBusiness,
  FolderKanban,
  MessageSquareQuote,
  Mail,
  FileText,
  Users,
  Handshake,
  Settings,
  UserCircle,
} from "lucide-react"

// Item order here determines the order of links in the sidebar
export const sidebarNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/services", label: "Services", icon: BriefcaseBusiness },
  { to: "/dashboard/portfolio", label: "Portfolio", icon: FolderKanban },
  { to: "/dashboard/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/dashboard/messages", label: "Messages", icon: Mail },
  { to: "/dashboard/quotes", label: "Demo Requests", icon: FileText },
  { to: "/dashboard/team", label: "Team", icon: Users },
  { to: "/dashboard/trusted-companies", label: "Trusted Companies", icon: Handshake },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
  { to: "/dashboard/profile", label: "Profile", icon: UserCircle },
]
