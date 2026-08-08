// Dashboard home page: aggregates live metrics, quick actions, status cards, and recent
// activity into a single overview screen for the admin.
import {
  BriefcaseBusiness,
  FolderKanban,
  Mail,
  FileText,
  TrendingUp,
  Wallet,
  PlusCircle,
  FolderPlus,
  Inbox,
  Settings,
  MessageSquare,
} from "lucide-react"
import DashboardHeader from "../../components/dashboard/DashboardHeader"
import WelcomeCard from "../../components/dashboard/WelcomeCard"
import StatCard from "../../components/dashboard/StatCard"
import QuickActionCard from "../../components/dashboard/QuickActionCard"
import StatusCard from "../../components/dashboard/StatusCard"
import SystemInfoCard from "../../components/dashboard/SystemInfoCard"
import ActivityList from "../../components/dashboard/ActivityList"
import RecentMessages from "../../components/dashboard/messages/RecentMessages"
import RecentQuotes from "../../components/dashboard/quotes/RecentQuotes"
import { useContactMessages } from "../../hooks/useContactMessages"
import { useQuotes } from "../../hooks/useQuotes"
import { useServices } from "../../hooks/useServices"
import { usePortfolio } from "../../hooks/usePortfolio"

const quickActions = [
  {
    title: "Add New Service",
    description: "Create a new service for your website.",
    icon: PlusCircle,
    color: "bg-[#0057D9]/10 text-[#0057D9]",
    to: "/dashboard/services",
  },
  {
    title: "Add Portfolio Project",
    description: "Showcase a new completed project.",
    icon: FolderPlus,
    color: "bg-violet-500/10 text-violet-600",
    to: "/dashboard/portfolio",
  },
  {
    title: "View Messages",
    description: "Review customer inquiries.",
    icon: Inbox,
    color: "bg-[#FF8C00]/10 text-[#FF8C00]",
    to: "/dashboard/messages",
  },
  {
    title: "Website Settings",
    description: "Manage company information and website settings.",
    icon: Settings,
    color: "bg-emerald-500/10 text-emerald-600",
    to: "/dashboard/settings",
  },
]

const activity = [
  {
    icon: MessageSquare,
    color: "bg-[#0057D9]/10 text-[#0057D9]",
    description: "New contact message received",
    time: "5 min ago",
  },
  {
    icon: FolderKanban,
    color: "bg-violet-500/10 text-violet-600",
    description: "Portfolio project updated",
    time: "1 hr ago",
  },
  {
    icon: Settings,
    color: "bg-[#FF8C00]/10 text-[#FF8C00]",
    description: "Website settings changed",
    time: "3 hrs ago",
  },
  {
    icon: PlusCircle,
    color: "bg-emerald-500/10 text-emerald-600",
    description: "Service added",
    time: "Yesterday",
  },
]

export default function DashboardHome() {
  const { messages, loading, error, refetch } = useContactMessages()
  const {
    quotes,
    loading: quotesLoading,
    error: quotesError,
    refetch: refetchQuotes,
  } = useQuotes()
  const { services, loading: servicesLoading } = useServices()
  const { projects, loading: projectsLoading } = usePortfolio()

  const publishedServices = services.filter((s) => s.status === "published").length
  const publishedProjects = projects.filter((p) => p.status === "published").length
  const unreadCount = messages.filter((m) => !m.is_read).length
  const recentMessages = [...messages]
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 5)

  const closedStatuses = ["approved", "rejected", "completed"]
  const newQuoteCount = quotes.filter((q) => q.status === "new").length
  const openQuoteCount = quotes.filter((q) => !closedStatuses.includes(q.status)).length
  const estimatedRevenue = quotes.reduce(
    (sum, q) => sum + (typeof q.estimated_price === "number" ? q.estimated_price : 0),
    0
  )
  const recentQuotes = [...quotes]
    .sort((a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime())
    .slice(0, 5)

  const stats = [
    {
      title: "Services",
      value: servicesLoading ? "…" : publishedServices,
      icon: BriefcaseBusiness,
      iconClass: "bg-[#0057D9]/10 text-[#0057D9]",
      description: "Active services on your website",
      to: "/dashboard/services",
    },
    {
      title: "Portfolio Projects",
      value: projectsLoading ? "…" : publishedProjects,
      icon: FolderKanban,
      iconClass: "bg-violet-500/10 text-violet-600",
      description: "Projects currently showcased",
      to: "/dashboard/portfolio",
    },
    {
      title: "Unread Messages",
      value: loading ? "…" : unreadCount,
      icon: Mail,
      iconClass: "bg-[#FF8C00]/10 text-[#FF8C00]",
      description: unreadCount === 1 ? "Inquiry awaiting your reply" : "Inquiries awaiting your reply",
      to: "/dashboard/messages",
    },
    {
      title: "Demo Requests",
      value: quotesLoading ? "…" : quotes.length,
      icon: FileText,
      iconClass: "bg-emerald-500/10 text-emerald-600",
      description: quotes.length === 1 ? "Total demo request" : "Total demo requests",
      to: "/dashboard/quotes",
    },
  ]

  const quoteStats = [
    {
      title: "New Demo Requests",
      value: quotesLoading ? "…" : newQuoteCount,
      icon: FileText,
      iconClass: "bg-[#0057D9]/10 text-[#0057D9]",
      description: "Requests awaiting review",
      to: "/dashboard/quotes",
    },
    {
      title: "Open Opportunities",
      value: quotesLoading ? "…" : openQuoteCount,
      icon: TrendingUp,
      iconClass: "bg-emerald-500/10 text-emerald-600",
      description: "Active opportunities in progress",
      to: "/dashboard/quotes",
    },
    {
      title: "Estimated Revenue",
      value: quotesLoading ? "…" : `$${estimatedRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: Wallet,
      iconClass: "bg-[#FF8C00]/10 text-[#FF8C00]",
      description: "Total of approved estimates",
      to: "/dashboard/quotes",
    },
  ]

  return (
    <div className="space-y-6 2xl:space-y-8">
      <DashboardHeader onRefresh={() => {}} />

      <WelcomeCard index={1} />

      <section aria-label="Overview statistics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 2xl:gap-8">
        {stats.map((s, i) => (
          <StatCard key={s.title} {...s} index={i} />
        ))}
      </section>

      <section aria-label="Quick actions">
        <h3 className="text-base font-heading font-semibold text-[#0B1E3D] mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 2xl:gap-8">
          {quickActions.map((q, i) => (
            <QuickActionCard key={q.title} {...q} index={i} />
          ))}
        </div>
      </section>

      <section aria-label="Demo requests overview">
        <h3 className="text-base font-heading font-semibold text-[#0B1E3D] mb-4">Demo Requests Overview</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 2xl:gap-8">
          {quoteStats.map((s, i) => (
            <StatCard key={s.title} {...s} index={i} />
          ))}
        </div>
      </section>

      <section aria-label="Website status and system information" className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 2xl:gap-8">
        <StatusCard index={0} />
        <SystemInfoCard index={1} />
      </section>

      <section aria-label="Recent activity and messages" className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 2xl:gap-8 items-start">
        <ActivityList items={activity} />
        <RecentMessages messages={recentMessages} loading={loading} error={error} onRetry={refetch} />
      </section>

      <RecentQuotes quotes={recentQuotes} loading={quotesLoading} error={quotesError} onRetry={refetchQuotes} />
    </div>
  )
}
