import { useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShieldCheck, Globe, LayoutDashboard } from "lucide-react"
import { useAuth } from "../hooks/useAuth"
import LoginForm from "../components/auth/LoginForm"

// Feature bullets shown on the login side panel.
const features = [
  { icon: ShieldCheck, label: "Secure Authentication" },
  { icon: LayoutDashboard, label: "Website Management" },
  { icon: Globe, label: "Powered by Supabase" },
]

/**
 * Admin login page.
 * Renders the login form; authenticated users are immediately redirected
 * to the dashboard.
 */
export default function Login() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  // Redirect authenticated users away from the login page once auth finishes loading.
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true })
    }
  }, [user, loading, navigate])

  return (
    <div className="min-h-screen bg-[#F7F9FC] flex">
      <div className="hidden lg:flex lg:w-1/2 bg-[#0B1E3D] relative overflow-hidden flex-col justify-center px-12 xl:px-20">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#0057D9]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] bg-[#0057D9]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <img src="/mainlogo.svg" alt="UNUG" className="h-10" />
            <span className="text-2xl font-heading font-bold text-white tracking-tight">UNUG</span>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-heading font-bold text-white leading-tight mb-4">
            Welcome Back
          </h1>
          <p className="text-lg text-white/70 mb-10">
            Sign in to manage your website content.
          </p>

          <ul className="space-y-4">
            {features.map((f) => (
              <li key={f.label} className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-[#FF8C00]" />
                </span>
                <span className="text-white/80">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <img src="/mainlogo.svg" alt="UNUG" className="h-9" />
              <span className="text-xl font-heading font-bold text-[#0B1E3D] tracking-tight">UNUG</span>
            </Link>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-[#0B1E3D]/5 border border-gray-100 animate-fade-in">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-heading font-bold text-[#0B1E3D] mb-1.5">Sign In</h2>
              <p className="text-sm text-gray-500">Enter your credentials to continue.</p>
            </div>

            <LoginForm />

            <p className="text-sm text-gray-500 text-center mt-8">
              Don't have an account?{" "}
              <a href="#" onClick={(e) => e.preventDefault()} className="font-medium text-[#0057D9] hover:text-[#0B1E3D] transition-colors">
                Contact us
              </a>
            </p>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            &copy; {new Date().getFullYear()} UNUG Solutions. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
