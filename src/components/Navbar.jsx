import React, { useState, useEffect } from 'react';
import { Menu, X, HeartPulse } from 'lucide-react';

export default function Navbar({ activeSection, setActiveSection, onBookClick, isAdminPage, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Services', id: 'services' },
    { name: 'Doctors', id: 'doctors' },
    { name: 'Contact', id: 'contact' }
  ];

  const handleNavClick = (id) => {
    setIsOpen(false);
    if (isAdminPage) {
      window.location.href = `/#${id}`;
    } else {
      setActiveSection(id);
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.03] border-b border-slate-200/50'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-[72px] items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer group" onClick={() => handleNavClick('home')}>
            <div className={`p-2 rounded-xl transition-all duration-300 ${
              scrolled ? 'bg-emerald-50' : 'bg-white/10'
            }`}>
              <HeartPulse className={`h-6 w-6 transition-colors duration-300 ${
                scrolled ? 'text-emerald-600' : 'text-emerald-400'
              }`} />
            </div>
            <span className={`ml-3 font-extrabold text-lg tracking-tight transition-colors duration-300 ${
              scrolled ? 'text-slate-900' : 'text-white'
            }`}>
              CarePlus <span className="text-emerald-500">Hospital</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          {!isAdminPage ? (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                    activeSection === link.id
                      ? scrolled
                        ? 'text-emerald-600 bg-emerald-50'
                        : 'text-white bg-white/15'
                      : scrolled
                        ? 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50/60'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <div className={`w-px h-6 mx-2 ${scrolled ? 'bg-slate-200' : 'bg-white/20'}`}></div>
              <button
                onClick={onBookClick}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 magnetic-hover cursor-pointer"
              >
                Book Appointment
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-4">
              <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                scrolled ? 'bg-slate-100 text-slate-600' : 'bg-white/10 text-white/80'
              }`}>
                Admin Portal
              </div>
              <button
                onClick={onLogout}
                className="bg-red-500/10 text-red-600 border border-red-200 px-5 py-2 rounded-full text-sm font-bold hover:bg-red-500 hover:text-white transition-all cursor-pointer"
              >
                Log Out
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                scrolled
                  ? 'text-slate-700 hover:bg-slate-100'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 shadow-xl animate-fade-in-down">
          <div className="px-4 pt-4 pb-6 space-y-1">
            {!isAdminPage ? (
              <>
                {navLinks.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                      activeSection === link.id
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-emerald-600'
                    }`}
                  >
                    {link.name}
                  </button>
                ))}
                <div className="pt-3">
                  <button
                    onClick={() => { setIsOpen(false); onBookClick(); }}
                    className="w-full bg-emerald-500 text-white px-4 py-3.5 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 cursor-pointer"
                  >
                    Book Appointment
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-slate-500 text-xs font-bold uppercase tracking-wider">Admin Portal</div>
                <button
                  onClick={() => { setIsOpen(false); onLogout(); }}
                  className="w-full bg-red-500/10 text-red-600 px-4 py-3 rounded-xl text-sm font-bold hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
