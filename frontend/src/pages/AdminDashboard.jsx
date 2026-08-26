import React, { useState, useEffect, useMemo } from 'react';
import {
  Trash2, Search, RefreshCw, AlertCircle, Clock, Phone, Mail,
  HeartPulse, LogOut, LayoutDashboard, Calendar, Users,
  Eye, Bell,
  Settings, Menu, X, Stethoscope,
  CheckCircle2, XCircle, AlertTriangle, BarChart3,
  FileText, Zap
} from 'lucide-react';

const API_URL = '/api';

const STATUS_CONFIG = {
  Pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-400', icon: Clock, label: 'Pending' },
  Confirmed: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-400', icon: CheckCircle2, label: 'Confirmed' },
  Cancelled: { color: 'bg-red-50 text-red-700 border-red-200', dot: 'bg-red-400', icon: XCircle, label: 'Cancelled' },
};

export default function AdminDashboard({ onLogout }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [viewDetail, setViewDetail] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  const greeting = useMemo(() => {
    const h = currentTime.getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  }, [currentTime]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    const token = localStorage.getItem('adminToken');
    if (!token) { onLogout(); return; }

    try {
      const response = await fetch(`${API_URL}/admin/appointments`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        onLogout();
        return;
      }
      const data = await response.json();
      if (response.ok) setAppointments(data);
      else setError(data.message || 'Failed to fetch appointments.');
    } catch {
      setError('Cannot connect to backend server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const handleDeleteClick = (id) => { setDeletingId(id); setDeleteConfirm(true); };

  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    const token = localStorage.getItem('adminToken');
    try {
      const response = await fetch(`${API_URL}/admin/appointments/${deletingId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        onLogout();
        return;
      }
      const data = await response.json();
      if (response.ok) {
        setAppointments(prev => prev.filter(a => a.id !== deletingId));
        setViewDetail(null);
      } else alert(data.message || 'Failed to delete.');
    } catch {
      alert('Error connecting to backend.');
    } finally {
      setDeletingId(null);
      setDeleteConfirm(false);
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => {
      const matchSearch = !searchTerm ||
        a.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.patient_phone.includes(searchTerm) ||
        a.patient_email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchTab = activeTab === 'all' ||
        (activeTab === 'pending' && a.status === 'Pending') ||
        (activeTab === 'confirmed' && a.status === 'Confirmed') ||
        (activeTab === 'cancelled' && a.status === 'Cancelled');

      return matchSearch && matchTab;
    });
  }, [appointments, searchTerm, activeTab]);

  const stats = useMemo(() => ({
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'Pending').length,
    confirmed: appointments.filter(a => a.status === 'Confirmed').length,
    cancelled: appointments.filter(a => a.status === 'Cancelled').length,
    uniquePatients: new Set(appointments.map(a => a.patient_email.toLowerCase())).size,
    todayCount: appointments.filter(a => a.appointment_date === new Date().toISOString().split('T')[0]).length,
  }), [appointments]);

  const sidebarLinks = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: Calendar, label: 'Appointments', active: true, badge: stats.pending },
    { icon: Users, label: 'Patients', active: false },
    { icon: Stethoscope, label: 'Doctors', active: false },
    { icon: BarChart3, label: 'Analytics', active: false },
    { icon: FileText, label: 'Reports', active: false },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="p-2.5 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl shadow-lg shadow-emerald-500/30">
              <HeartPulse className="h-5 w-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse"></div>
          </div>
          <div className={`${!sidebarOpen ? 'hidden' : ''}`}>
            <span className="text-base font-extrabold tracking-tight text-white block leading-tight">CarePlus</span>
            <span className="text-[9px] font-bold text-emerald-400/80 uppercase tracking-[0.2em]">Admin Panel</span>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        <span className={`text-[9px] font-black text-slate-600 uppercase tracking-[0.2em] px-3 mb-2 block mt-3 ${!sidebarOpen ? 'hidden' : ''}`}>
          Navigation
        </span>
        {sidebarLinks.map((link, i) => {
          const Icon = link.icon;
          return (
            <button key={i} disabled={!link.active}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all text-sm ${
                link.active
                  ? i === 0
                    ? 'bg-white/[0.08] text-white'
                    : 'text-slate-400 hover:bg-white/[0.05] hover:text-white cursor-pointer'
                  : 'text-slate-600 cursor-not-allowed opacity-40'
              }`}>
              <Icon className="w-[18px] h-[18px] shrink-0" />
              {sidebarOpen && <span className="flex-1 text-left">{link.label}</span>}
              {sidebarOpen && link.badge > 0 && (
                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{link.badge}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Help card */}
      {sidebarOpen && (
        <div className="mx-3 mb-3 p-4 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/10">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">Quick Tip</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">Use search or filters to quickly find patient appointments.</p>
        </div>
      )}

      {/* User */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-emerald-500/20 shrink-0">
            {localStorage.getItem('adminUser')?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate capitalize">{localStorage.getItem('adminUser') || 'Admin'}</p>
              <p className="text-[10px] text-slate-500 font-medium">Super Administrator</p>
            </div>
          )}
        </div>
        <button onClick={onLogout}
          className="flex items-center gap-3 w-full hover:bg-red-500/10 text-slate-500 hover:text-red-400 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer text-xs mt-1">
          <LogOut className="w-[16px] h-[16px] shrink-0" />
          {sidebarOpen && 'Sign Out'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f0f2f5] font-sans antialiased overflow-hidden">

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-slate-950 transition-all duration-300 z-30 ${sidebarOpen ? 'w-[260px]' : 'w-[72px]'}`}>
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebar && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fade-in" onClick={() => setMobileSidebar(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-[280px] bg-slate-950 z-50 lg:hidden shadow-2xl animate-slide-in-left">
            <button onClick={() => setMobileSidebar(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 cursor-pointer z-10">
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">

        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200/80 px-4 lg:px-8 h-16 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button onClick={() => {
              if (window.innerWidth >= 1024) setSidebarOpen(!sidebarOpen);
              else setMobileSidebar(true);
            }} className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-all cursor-pointer">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-bold text-slate-800">{greeting}, Administrator</h2>
              <p className="text-[11px] text-slate-400 font-medium">
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-all cursor-pointer">
              <Bell className="w-5 h-5" />
              {stats.pending > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>
            <button className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-700 transition-all cursor-pointer">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="max-w-[1400px] mx-auto space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Appointments</h1>
                <p className="text-sm text-slate-500 mt-0.5 font-medium">Manage and track all patient appointments</p>
              </div>
              <button onClick={fetchAppointments}
                className="group bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md text-slate-600 px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all cursor-pointer">
                <RefreshCw className={`w-4 h-4 text-emerald-600 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Bookings', value: stats.total, icon: Calendar, color: 'from-emerald-500 to-green-600', bgColor: 'bg-emerald-500', change: 'All time' },
                { label: 'Pending', value: stats.pending, icon: Clock, color: 'from-amber-400 to-orange-500', bgColor: 'bg-amber-500', change: 'Awaiting review' },
                { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle2, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-500', change: 'Scheduled' },
                { label: 'Patients', value: stats.uniquePatients, icon: Users, color: 'from-violet-500 to-purple-600', bgColor: 'bg-violet-500', change: 'Unique' },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg hover:shadow-slate-200/60 transition-all duration-500 group relative overflow-hidden">
                  {/* Decorative gradient corner */}
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.07] rounded-bl-[3rem] transition-all group-hover:w-28 group-hover:h-28`}></div>
                  <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center text-white shadow-lg mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{stat.label}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">{stat.change}</p>
                </div>
              ))}
            </div>

            {/* Search & Filter Row */}
            <div className="bg-white rounded-2xl border border-slate-100 p-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                {/* Search */}
                <div className="flex-1 flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:bg-white transition-all border border-transparent focus-within:border-emerald-200">
                  <Search className="w-4.5 h-4.5 text-slate-400" />
                  <input type="text" placeholder="Search patients, doctors, email or phone..."
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full focus:outline-none text-slate-800 placeholder-slate-400 text-sm font-medium bg-transparent" />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                  {[
                    { key: 'all', label: 'All', count: stats.total },
                    { key: 'pending', label: 'Pending', count: stats.pending },
                    { key: 'confirmed', label: 'Confirmed', count: stats.confirmed },
                    { key: 'cancelled', label: 'Cancelled', count: stats.cancelled },
                  ].map(tab => (
                    <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        activeTab === tab.key
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}>
                      {tab.label}
                      {tab.count > 0 && (
                        <span className={`ml-1.5 text-[10px] ${
                          activeTab === tab.key ? 'text-emerald-600' : 'text-slate-400'
                        }`}>{tab.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm font-bold flex-1">{error}</p>
                <button onClick={() => setError('')} className="text-red-400 hover:text-red-600 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="bg-white rounded-2xl border border-slate-100 py-24 flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-emerald-200 rounded-full"></div>
                  <div className="absolute inset-0 w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm font-bold text-slate-400">Loading appointments...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-100 py-24 text-center">
                <div className="bg-slate-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-lg font-bold text-slate-500">No appointments found</p>
                <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter criteria</p>
              </div>
            ) : (
              <>
                {/* Cards View — Mobile */}
                <div className="lg:hidden space-y-3">
                  {filteredAppointments.map((appt) => {
                    const status = STATUS_CONFIG[appt.status] || STATUS_CONFIG.Pending;
                    return (
                      <div key={appt.id} className="bg-white rounded-2xl border border-slate-100 p-4 hover:shadow-md transition-all">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
                              {appt.patient_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-slate-800 text-sm">{appt.patient_name}</p>
                              <p className="text-[11px] text-slate-400">{appt.patient_email}</p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${status.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                            {status.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-3">
                          <span className="flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5" />{appt.doctor_name}</span>
                          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{appt.appointment_date}</span>
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{appt.appointment_time}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                          <button onClick={() => setViewDetail(appt)}
                            className="flex-1 text-center py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer">
                            View Details
                          </button>
                          <button onClick={() => handleDeleteClick(appt.id)}
                            className="px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-50 rounded-lg transition-all cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Table View — Desktop */}
                <div className="hidden lg:block bg-white rounded-2xl border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Patient</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Contact</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Doctor</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Schedule</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {filteredAppointments.map((appt) => {
                          const status = STATUS_CONFIG[appt.status] || STATUS_CONFIG.Pending;
                          return (
                            <tr key={appt.id} className="hover:bg-slate-50/50 transition-colors group">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center font-black text-sm shrink-0">
                                    {appt.patient_name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-bold text-slate-800 text-sm">{appt.patient_name}</p>
                                    {appt.notes && <p className="text-[11px] text-slate-400 truncate max-w-[180px]" title={appt.notes}>{appt.notes}</p>}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-1">
                                  <span className="flex items-center gap-1.5 text-slate-500 text-xs"><Mail className="w-3.5 h-3.5 shrink-0" /><span className="truncate max-w-[160px]">{appt.patient_email}</span></span>
                                  <span className="flex items-center gap-1.5 text-slate-500 text-xs"><Phone className="w-3.5 h-3.5 shrink-0" />{appt.patient_phone}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="inline-flex items-center gap-1.5 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg">
                                  <Stethoscope className="w-3 h-3" />
                                  {appt.doctor_name}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <p className="font-bold text-slate-800 text-sm">{appt.appointment_date}</p>
                                <p className="text-[11px] text-emerald-600 font-bold mt-0.5">{appt.appointment_time}</p>
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full border ${status.color}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`}></span>
                                  {status.label}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => setViewDetail(appt)}
                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all cursor-pointer" title="View">
                                    <Eye className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteClick(appt.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer" title="Delete">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Table Footer */}
                  <div className="px-6 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-500 font-medium">
                      Showing <span className="font-bold text-slate-700">{filteredAppointments.length}</span> of <span className="font-bold text-slate-700">{appointments.length}</span> appointments
                    </p>
                    <p className="text-[10px] text-slate-400 font-medium">Last updated: {currentTime.toLocaleTimeString()}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* ═══ VIEW DETAIL MODAL ═══ */}
      {viewDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in" onClick={() => setViewDetail(null)}>
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center font-black text-lg">
                  {viewDetail.patient_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">{viewDetail.patient_name}</h3>
                  <p className="text-xs text-slate-400">Appointment #{viewDetail.id}</p>
                </div>
              </div>
              <button onClick={() => setViewDetail(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              {/* Status */}
              {(() => {
                const status = STATUS_CONFIG[viewDetail.status] || STATUS_CONFIG.Pending;
                const StatusIcon = status.icon;
                return (
                  <div className={`flex items-center gap-3 p-3 rounded-xl border ${status.color}`}>
                    <StatusIcon className="w-5 h-5" />
                    <span className="text-sm font-bold">{status.label}</span>
                  </div>
                );
              })()}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Mail, label: 'Email', value: viewDetail.patient_email },
                  { icon: Phone, label: 'Phone', value: viewDetail.patient_phone },
                  { icon: Stethoscope, label: 'Doctor', value: viewDetail.doctor_name },
                  { icon: Calendar, label: 'Date', value: viewDetail.appointment_date },
                  { icon: Clock, label: 'Time', value: viewDetail.appointment_time },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <div className="p-1.5 bg-slate-100 rounded-lg text-slate-500 shrink-0 mt-0.5">
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Notes */}
              {viewDetail.notes && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Notes</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{viewDetail.notes}</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 pt-4 border-t border-slate-100 flex gap-3">
              <button onClick={() => setViewDetail(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-all cursor-pointer text-sm">
                Close
              </button>
              <button onClick={() => { setDeletingId(viewDetail.id); setDeleteConfirm(true); }}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-3 rounded-xl font-bold transition-all cursor-pointer text-sm flex items-center justify-center gap-2">
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ DELETE CONFIRM MODAL ═══ */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-[60] animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 shadow-2xl animate-scale-in text-center">
            <div className="bg-red-100 text-red-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-2">Delete Appointment?</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed">This action cannot be undone. The appointment record will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => { setDeleteConfirm(false); setDeletingId(null); }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 rounded-xl font-bold transition-all cursor-pointer text-sm">
                Cancel
              </button>
              <button onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-bold shadow-lg shadow-red-500/25 transition-all cursor-pointer text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
