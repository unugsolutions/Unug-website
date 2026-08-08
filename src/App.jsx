// Root component that wires up routing, auth, toast notifications, and error/offline guards.
import { Toaster } from "react-hot-toast"
import { BrowserRouter } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import AppRoutes from "./routes/AppRoutes"
import ErrorBoundary from "./components/ErrorBoundary"
import OfflineGate from "./components/OfflineGate"

// Renders the app shell: router → error boundary → auth provider → toasts + offline gate → routes.
function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AuthProvider>
          {/* Global toast notifications styled to match the site's brand colors */}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "12px",
                background: "#0B1E3D",
                color: "#fff",
                fontSize: "14px",
              },
              success: { iconTheme: { primary: "#FF8C00", secondary: "#0B1E3D" } },
            }}
          />
          {/* Blocks access to the app when the network is unavailable */}
          <OfflineGate>
            <AppRoutes />
          </OfflineGate>
        </AuthProvider>
      </ErrorBoundary>
    </BrowserRouter>
  )
}

export default App
