import { Component } from "react";
import "../styles/components/error-boundary.css";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("[ErrorBoundary]", error, errorInfo);
    }

    handleRetry = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <div className="error-boundary-container">
                <div className="error-boundary-card">
                    <div className="error-boundary-icon">&#9888;</div>
                    <h2 className="error-boundary-title">حدث خطأ غير متوقع</h2>
                    <p className="error-boundary-message">Something went wrong</p>
                    <p className="error-boundary-detail">
                        {this.state.error?.message || "Unknown error"}
                    </p>
                    <button className="error-boundary-button" onClick={this.handleRetry}>
                        إعادة المحاولة / Retry
                    </button>
                </div>
            </div>
        );
    }
}

export default ErrorBoundary;
