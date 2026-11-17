import { Component } from 'react';
import Button from './Button';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    if (import.meta.env.DEV) console.error('Route error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="route-error" role="alert">
          <div className="route-error-inner">
            <span className="eyebrow">Something slipped</span>
            <h1>This page hit a rough patch.</h1>
            <p>Try reloading, or head back to the homepage and continue browsing the fleet.</p>
            <div className="route-error-actions">
              <Button variant="red" onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}>
                Try again
              </Button>
              <Button as="a" href="/" variant="ghost">Return home</Button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
