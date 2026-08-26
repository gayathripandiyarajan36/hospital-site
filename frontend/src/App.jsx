import React, { useRef, useState, useEffect, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import PublicHome from './pages/PublicHome';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

// Error Boundary to prevent white screen of death
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-800 border border-slate-700 p-8 rounded-3xl text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
              !
            </div>
            <h2 className="text-2xl font-black text-white">Something went wrong</h2>
            <p className="text-sm text-slate-400">
              {this.state.error?.message || "An unexpected error occurred while rendering the page."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-6 py-3 rounded-xl transition cursor-pointer text-sm"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function AppContent() {
  const [activeSection, setActiveSection] = useState('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const bookingRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Monitor auth state on route changes
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    setIsAdminLoggedIn(!!token);
  }, [location]);

  const handleBookClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      bookingRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    navigate('/admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setIsAdminLoggedIn(false);
    navigate('/');
  };

  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-900 text-slate-100">
      {!isAdminPage && location.pathname !== '/admin/login' && (
        <Navbar 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
          onBookClick={handleBookClick}
          isAdminPage={false}
          onLogout={handleLogout}
        />
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<PublicHome bookingRef={bookingRef} />} />
          <Route path="/admin/login" element={<AdminLogin onLoginSuccess={handleLoginSuccess} />} />
          <Route 
            path="/admin" 
            element={
              isAdminLoggedIn ? (
                <AdminDashboard onLogout={handleLogout} />
              ) : (
                <Navigate to="/admin/login" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
}
