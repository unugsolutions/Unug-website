import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, ExternalLink } from "lucide-react"
import Sidebar from "../components/dashboard/Sidebar"
import TopNavbar from "../components/dashboard/TopNavbar"
import PageHeader from "../components/dashboard/PageHeader"

const SIDEBAR_COLLAPSED_KEY = "unug:sidebar:collapsed"

// Per-dashboard-page metadata used to populate the topbar title, page header,
// and header action buttons (e.g. "Add Service").
const pageConfigs = [
  {
    path: "/dashboard",
    title: "Dashboard",
    breadcrumbCurrent: "Dashboard",
    description: "Overview of your website's performance and recent activity.",
    action: { label: "View Website", icon: ExternalLink, to: "/", variant: "secondary" },
    hideHeader: true,
  },
  {
    path: "/dashboard/services",
    title: "Services",
    breadcrumbCurrent: "Services",
    description: "Manage all website services here.",
    action: { label: "Add Service", icon: Plus },
    hideHeader: true,
  },
  {
    path: "/dashboard/portfolio",
    title: "Portfolio",
    breadcrumbCurrent: "Portfolio",
    description: "Manage your projects and showcase your best work here.",
    action: { label: "Add Project", icon: Plus },
    hideHeader: true,
  },
  {
    path: "/dashboard/testimonials",
    title: "Testimonials",
    breadcrumbCurrent: "Testimonials",
    description: "Manage client testimonials and reviews shown on the website here.",
    action: { label: "Add Testimonial", icon: Plus },
    hideHeader: true,
  },
  {
    path: "/dashboard/messages",
    title: "Contact Messages",
    breadcrumbCurrent: "Contact Messages",
    description: "Manage customer inquiries from your website.",
    hideHeader: true,
  },
  {
    path: "/dashboard/quotes",
    title: "Demo Requests",
    breadcrumbCurrent: "Demo Requests",
    description: "Manage demo requests and inquiries from your website.",
    hideHeader: true,
  },
  {
    path: "/dashboard/team",
    title: "Team Members",
    breadcrumbCurrent: "Team",
    description: "Manage your company's leadership and staff.",
    hideHeader: true,
  },
  {
    path: "/dashboard/trusted-companies",
    title: "Trusted Companies",
    breadcrumbCurrent: "Trusted Companies",
    description: "Manage the companies and logos shown on your website to build trust.",
    action: { label: "Add Company", icon: Plus },
    hideHeader: true,
  },
  {
    path: "/dashboard/settings",
    title: "Website Settings",
    breadcrumbCurrent: "Website Settings",
    description: "Manage your website content, branding, SEO, and global configuration.",
    hideHeader: true,
  },
  {
    path: "/dashboard/profile",
    title: "Profile",
    breadcrumbCurrent: "Profile",
    description: "View and manage your account details and preferences here.",
    hideHeader: true,
  },
]

// Authenticated admin shell: sidebar + top navbar + routed page content.
export default function DashboardLayout() {
  const location = useLocation()
  // Sidebar collapsed state is persisted to localStorage across reloads.
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(SIDEBAR_COLLAPSED_KEY) === "true"
  )
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close the mobile sidebar drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Resolve the config for the current route, falling back to the dashboard home.
  const config =
    pageConfigs.find((p) => location.pathname === p.path) ??
    pageConfigs[0]

  // Persist the new collapsed state each time the sidebar is toggled.
  const toggleCollapse = () => {
    setCollapsed((c) => {
      localStorage.setItem(SIDEBAR_COLLAPSED_KEY, String(!c))
      return !c
    })
  }

  const isHome = config.path === "/dashboard"
  // On sub-pages the breadcrumb links back to the dashboard home.
  const breadcrumbItems = isHome ? [] : [{ label: "Dashboard", to: "/dashboard" }]

  return (
    <div className="min-h-screen bg-[#F7F9FC] text-[#1F2937]">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Main content area shifts right to make room for the fixed sidebar */}
      <div
        className={`lg:transition-[padding-left] lg:duration-300 lg:ease-in-out ${
          collapsed ? "lg:pl-20" : "lg:pl-[280px]"
        }`}
      >
        <TopNavbar title={config.title} onOpenMobile={() => setMobileOpen(true)} />

        <main className="p-4 sm:p-6 lg:p-8 2xl:p-10">
          <div className="max-w-[1920px] mx-auto">
            {!config.hideHeader && (
              <PageHeader
                title={config.title}
                breadcrumbItems={breadcrumbItems}
                breadcrumbCurrent={config.breadcrumbCurrent}
                description={config.description}
                action={config.action}
              />
            )}

            {/* Animate page transitions between dashboard routes */}
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  )
}
