import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Website ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-2xl font-black">
              ⚠️
            </div>
            <h2 className="text-xl font-black text-slate-900">Rankers Path — Website Reload Required</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              {this.state.error?.message || 'A temporary browser cache conflict occurred.'}
            </p>
            <button
              onClick={() => {
                try {
                  localStorage.removeItem('rp_student_user');
                } catch (e) {}
                window.location.reload();
              }}
              className="w-full py-3 bg-[#0B1B3D] hover:bg-[#142B5C] text-brand-yellow font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition"
            >
              Clear Cache &amp; Refresh
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
