import { lazy, Suspense } from "react"
import { Routes, Route, Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import SeoManager from "../components/SeoManager"
import ScrollToTop from "../components/ScrollToTop"
import Maintenance from "../components/Maintenance"
import ProtectedRoute from "../components/auth/ProtectedRoute"
import DashboardLayout from "../layouts/DashboardLayout"
import ServerError from "../pages/ServerError"
import Offline from "../pages/Offline"
import Home from "../pages/Home"
import { usePublicWebsiteSettings } from "../hooks/useWebsiteSettings"

// Lazy-loaded public pages (split into separate chunks and fetched on demand)
const Services = lazy(() => import("../pages/Services"))
const Solutions = lazy(() => import("../pages/Solutions"))
const About = lazy(() => import("../pages/About"))
const Team = lazy(() => import("../pages/Team"))
const Contact = lazy(() => import("../pages/Contact"))
const RequestDemo = lazy(() => import("../pages/RequestDemo"))
const PortfolioDetails = lazy(() => import("../pages/PortfolioDetails"))
const PublicTestimonials = lazy(() => import("../pages/PublicTestimonials"))
const Login = lazy(() => import("../pages/Login"))
const NotFound = lazy(() => import("../pages/NotFound"))

// Lazy-loaded dashboard (authenticated) pages
const DashboardHome = lazy(() => import("../pages/dashboard/DashboardHome"))
const DashboardServices = lazy(() => import("../pages/dashboard/Services"))
const DashboardPortfolio = lazy(() => import("../pages/dashboard/Portfolio"))
const DashboardTestimonials = lazy(() => import("../pages/dashboard/Testimonials"))
const DashboardMessages = lazy(() => import("../pages/dashboard/Messages"))
const DashboardQuotes = lazy(() => import("../pages/dashboard/Quotes"))
const DashboardTeam = lazy(() => import("../pages/dashboard/Team"))
const DashboardTrustedCompanies = lazy(() => import("../pages/dashboard/TrustedCompanies"))
const DashboardSettings = lazy(() => import("../pages/dashboard/Settings"))
const DashboardProfile = lazy(() => import("../pages/dashboard/Profile"))

// Wrapper layout for all public pages: renders navbar/footer and shows a maintenance
// notice instead of content while the site is in maintenance mode.
function PublicLayout() {
  const { settings } = usePublicWebsiteSettings()

  if (settings?.maintenance_mode) {
    return <Maintenance />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

// Central route table: SEO/scroll managers + a Suspense wrapper for lazy pages.
export default function AppRoutes() {
  return (
    <>
      <SeoManager />
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          {/* Public site routes share the PublicLayout shell (navbar + footer) */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/about" element={<About />} />
            <Route path="/team" element={<Team />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/request-a-demo" element={<RequestDemo />} />
            <Route path="/testimonials" element={<PublicTestimonials />} />
            <Route path="/portfolio/:slug" element={<PortfolioDetails />} />
            <Route path="/project/:slug" element={<PortfolioDetails />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/offline" element={<Offline />} />
          <Route path="/500" element={<ServerError />} />

          {/* Dashboard routes are guarded by ProtectedRoute (auth required) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="services" element={<DashboardServices />} />
            <Route path="portfolio" element={<DashboardPortfolio />} />
            <Route path="testimonials" element={<DashboardTestimonials />} />
            <Route path="messages" element={<DashboardMessages />} />
            <Route path="quotes" element={<DashboardQuotes />} />
            <Route path="team" element={<DashboardTeam />} />
            <Route path="trusted-companies" element={<DashboardTrustedCompanies />} />
            <Route path="settings" element={<DashboardSettings />} />
            <Route path="profile" element={<DashboardProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
