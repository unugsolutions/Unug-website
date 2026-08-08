import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

// Zod schema backing react-hook-form validation for the login fields.
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
})

/**
 * Login form: validates credentials, signs in via the auth hook, then redirects to the dashboard.
 * @returns {JSX.Element} The login form.
 */
export default function LoginForm() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  // Toggles password visibility between text and password input types.
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (values) => {
    try {
      // Sign in, then replace history so the back button can't return to the login page.
      await signIn(values)
      toast.success("Welcome back!")
      navigate("/dashboard", { replace: true })
    } catch (err) {
      toast.error(err.message || "Unable to sign in. Please try again.")
    }
  }

  const inputBase =
    "w-full pl-11 pr-4 py-3 text-sm text-[#0B1E3D] placeholder-gray-400 bg-white border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0057D9]/20 focus:border-[#0057D9] transition-all"

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[#0B1E3D] mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            className={`${inputBase} ${errors.email ? "border-red-400" : "border-gray-200"}`}
            {...register("email")}
          />
        </div>
        {errors.email && <p className="mt-1.5 text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-semibold text-[#0B1E3D] mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            className={`${inputBase} ${errors.password ? "border-red-400" : "border-gray-200"}`}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-[#0057D9] transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="mt-1.5 text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 rounded border-gray-300 text-[#0057D9] focus:ring-[#0057D9]/20 focus:ring-2"
          />
          Remember me
        </label>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className="text-sm font-medium text-[#0057D9] hover:text-[#0B1E3D] transition-colors"
        >
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-[#0057D9] text-white hover:bg-[#004ab8] shadow-lg shadow-[#0057D9]/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
      >
        {isSubmitting ? (
          // Show a spinner and "Signing in..." while the request is in flight.
          <>
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            Sign In
          </>
        )}
      </button>
    </form>
  )
}
