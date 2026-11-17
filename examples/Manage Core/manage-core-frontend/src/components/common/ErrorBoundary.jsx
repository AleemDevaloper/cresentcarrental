import { Component } from 'react'
import ErrorScreen from '../../pages/error/ErrorScreen'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error) {
    console.warn('ErrorBoundary caught:', error.message)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorScreen variant="500" />
    }
    return this.props.children
  }
}
