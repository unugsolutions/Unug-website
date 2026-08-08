import { Link } from "react-router-dom"
import { Home, Compass } from "lucide-react"

// 404 page — shown when no route matches, with a link back home.
export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#0057D9]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-md animate-fade-in">
        <p className="text-[120px] leading-none font-heading font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-[#0B1E3D] to-[#0057D9] select-none">
          404
        </p>
        <div className="inline-flex items-center gap-2 bg-white text-[#0057D9] text-sm font-semibold px-4 py-1.5 rounded-full border border-[#0057D9]/10 shadow-sm mb-5">
          <Compass className="w-4 h-4" />
          Page Not Found
        </div>
        <p className="text-gray-500 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-[#0057D9] text-white hover:bg-[#004ab8] shadow-lg shadow-[#0057D9]/25 transition-all duration-200 active:scale-[0.98]"
        >
          <Home className="w-4 h-4" />
          Return Home
        </Link>
      </div>
    </div>
  )
}
