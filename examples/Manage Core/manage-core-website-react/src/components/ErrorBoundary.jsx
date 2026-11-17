import React from "react";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleGoHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <main className="mc-error-state" role="alert" aria-labelledby="mc-error-title">
          <div className="mc-error-card">
            <div className="mc-error-icon" aria-hidden="true"><FiAlertTriangle /></div>
            <span className="mc-error-code">500 · TEMPORARY ERROR</span>
            <h1 id="mc-error-title">This page needs a refresh</h1>
            <p>
              An unexpected error occurred while loading this page. You can try again or return to the homepage.
            </p>
            <div className="mc-error-actions">
              <button
                type="button"
                onClick={this.handleRetry}
                className="mc-error-btn mc-error-btn-secondary"
              >
                <FiRefreshCw /> Try again
              </button>
              <a
                href="/"
                onClick={(event) => {
                  event.preventDefault();
                  this.handleGoHome();
                }}
                className="mc-error-btn mc-error-btn-primary"
              >
                <FiHome /> Go to homepage
              </a>
            </div>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
