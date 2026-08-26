import React, { useState, useEffect } from 'react';
import { HeartPulse, Lock, User, AlertCircle, ArrowRight, Shield, Eye, EyeOff } from 'lucide-react';
import heroBg from '../assets/images/hero_bg.jpg';

const API_URL = '/api';

export default function AdminLogin({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) onLoginSuccess();
  }, [onLoginSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', data.username);
        onLoginSuccess();
      } else {
        setError(data.message || 'Invalid username or password.');
      }
    } catch (err) {
      setError('Failed to connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-white font-sans antialiased overflow-hidden">

      {/* Left — Branding & Image */}
      <div className="relative hidden lg:flex flex-1 items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900/80 to-emerald-950/30"></div>
        </div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-15"></div>
        {/* Glow orb */}
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px]"></div>

        <div className="relative z-10 w-full max-w-xl px-12 animate-slide-in-left">
          <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 px-5 py-3 rounded-2xl backdrop-blur-md mb-8">
            <HeartPulse className="h-7 w-7 text-emerald-400" />
            <span className="text-lg font-bold tracking-wider text-emerald-50">CarePlus</span>
          </div>
          <h1 className="text-5xl font-black tracking-tight leading-tight mb-6">
            Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-300">Command Center</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed max-w-md">
            Manage hospital operations, oversee appointments, and coordinate medical staff from a unified dashboard.
          </p>

          {/* Feature cards */}
          <div className="grid grid-cols-2 gap-4 mt-10">
            {[
              { icon: Shield, label: 'Secure Access', desc: '256-bit encryption' },
              { icon: User, label: 'Staff Management', desc: 'Role-based access' },
            ].map((f, i) => (
              <div key={i} className="bg-white/[0.04] border border-white/[0.06] backdrop-blur-sm p-4 rounded-2xl">
                <f.icon className="w-5 h-5 text-emerald-400 mb-2" />
                <p className="text-sm font-bold text-white">{f.label}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_60%,transparent_100%)] opacity-30 pointer-events-none"></div>

        <div className="w-full max-w-md relative z-10 animate-scale-in">
          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-slate-900 px-5 py-3 rounded-2xl">
              <HeartPulse className="h-7 w-7 text-emerald-400" />
              <span className="text-lg font-bold text-white tracking-wider">CarePlus</span>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[2rem] shadow-2xl shadow-slate-200/60 border border-slate-100">
            <div className="text-center mb-10">
              <div className="inline-flex bg-slate-900 p-4 rounded-2xl text-emerald-400 mb-6 shadow-lg shadow-emerald-500/10 hover-lift">
                <Lock className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 mt-2 font-medium">Sign in to your admin dashboard</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-2xl flex items-start gap-3 mb-6 animate-fade-in-up">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">Username</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    type="text" required value={username} onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-all font-medium input-glow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2.5">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 focus:outline-none focus:border-emerald-500 focus:bg-white text-slate-900 placeholder-slate-400 transition-all font-medium input-glow"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer">
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading}
                className="group w-full bg-slate-900 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl hover:shadow-emerald-500/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer magnetic-hover mt-8">
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Authenticating...
                  </>
                ) : (
                  <>
                    Enter Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center mt-8">
              <a href="/" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-400 hover:text-emerald-600 transition-colors">
                ← Back to Public Site
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
