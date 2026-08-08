import { WifiOff, RefreshCw } from "lucide-react"

// Offline page — shown when the device loses connectivity; offers a retry via page reload.
export default function Offline() {
  return (
    <div className="min-h-screen bg-[#F7F9FC] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#0057D9]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-md animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-white flex items-center justify-center mx-auto mb-6 shadow-sm border border-gray-100">
          <WifiOff className="w-9 h-9 text-[#0057D9]" />
        </div>
        <h1 className="text-3xl font-heading font-bold text-[#0B1E3D] mb-3">You're Offline</h1>
        <p className="text-gray-500 mb-8">
          It looks like you've lost your internet connection. Check your network and try again — we'll be here when
          you're back.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl bg-[#0057D9] text-white hover:bg-[#004ab8] shadow-lg shadow-[#0057D9]/25 transition-all duration-200 active:scale-[0.98]"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    </div>
  )
}
