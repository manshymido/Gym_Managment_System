import React, { Component } from 'react';
import { colors, borderRadius, shadows } from '../../design-system/theme';
import Button from './Button';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        backgroundColor: colors.background.default
      };

      const cardStyle = {
        backgroundColor: colors.background.paper,
        borderRadius: borderRadius.lg,
        padding: '3rem',
        maxWidth: '600px',
        width: '100%',
        boxShadow: shadows.lg,
        textAlign: 'center'
      };

      const iconStyle = {
        fontSize: '4rem',
        marginBottom: '1.5rem'
      };

      const titleStyle = {
        fontSize: '1.5rem',
        fontWeight: 700,
        color: colors.text.primary,
        margin: '0 0 1rem 0'
      };

      const messageStyle = {
        fontSize: '1rem',
        color: colors.text.secondary,
        margin: '0 0 2rem 0',
        lineHeight: 1.6
      };

      const errorDetailsStyle = {
        backgroundColor: colors.gray[50],
        borderRadius: borderRadius.md,
        padding: '1rem',
        marginTop: '1.5rem',
        textAlign: 'right',
        fontSize: '0.875rem',
        color: colors.text.secondary,
        fontFamily: 'monospace',
        overflow: 'auto',
        maxHeight: '200px'
      };

      return (
        <div style={containerStyle}>
          <div style={cardStyle}>
            <div style={iconStyle}>⚠️</div>
            <h2 style={titleStyle}>حدث خطأ غير متوقع</h2>
            <p style={messageStyle}>
              نعتذر، حدث خطأ أثناء تحميل الصفحة. يرجى المحاولة مرة أخرى أو الاتصال بالدعم الفني.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <Button
                variant="primary"
                onClick={this.handleReset}
              >
                إعادة المحاولة
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/'}
              >
                العودة للصفحة الرئيسية
              </Button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={errorDetailsStyle}>
                <summary style={{ cursor: 'pointer', marginBottom: '0.5rem' }}>
                  تفاصيل الخطأ (للتطوير فقط)
                </summary>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

