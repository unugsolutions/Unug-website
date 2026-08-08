import { Component } from "react"
import ServerError from "../pages/ServerError"

// Error boundary: catches rendering errors in the tree and shows a friendly fallback instead of crashing.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    // hasError gates the fallback render; message carries the error details to display.
    this.state = { hasError: false, message: "" }
  }

  // React calls this when a descendant throws; flips state so the fallback is rendered.
  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Something went wrong." }
  }

  // Side-channel logging of the error and its component stack for debugging.
  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info?.componentStack)
  }

  // Resets the boundary so the app tree can be retried without a full reload.
  handleReset = () => {
    this.setState({ hasError: false, message: "" })
  }

  render() {
    // While an error is active, show ServerError; otherwise render the wrapped children normally.
    if (this.state.hasError) {
      return <ServerError message={this.state.message} onRetry={this.handleReset} />
    }
    return this.props.children
  }
}
