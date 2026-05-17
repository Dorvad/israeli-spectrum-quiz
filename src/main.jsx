import React from 'react';
import { createRoot } from 'react-dom/client';
import App from '@/App.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: '100vh', background: '#070812', color: '#e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'system-ui, sans-serif', direction: 'rtl' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>שגיאה בטעינת האפליקציה</h1>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>אירעה שגיאה בלתי צפויה. אנא רענן את הדף.</p>
          <button onClick={() => window.location.reload()} style={{ background: '#67e8f9', color: '#020617', border: 'none', borderRadius: '9999px', padding: '0.75rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            רענון דף
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
