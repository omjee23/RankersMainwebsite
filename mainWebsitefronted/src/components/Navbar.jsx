import React, { useState } from 'react';
import { Phone, MessageCircle, User, LogOut, Menu, X, Home, MapPin, Award, CheckCircle2 } from 'lucide-react';

export default function Navbar({
  user,
  onOpenLogin,
  onLogout,
  onOpenRankX,
  onOpenRSAT,
  onOpenDashboard,
  onOpenTeam,
  activeTab,
  setActiveTab
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* 1. TOP UTILITY BAR (Exact Allen Style: Dark Bar with Direct Portals & Action Buttons) */}
      <div className="bg-[#111827] text-white text-[11px] sm:text-xs py-1.5 px-4 font-semibold tracking-wide border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left: Quick Utility Links */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto py-0.5 text-slate-300 no-scrollbar">
            <a
              href="#top"
              onClick={(e) => { e.preventDefault(); setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:text-brand-yellow flex items-center gap-1 whitespace-nowrap text-white"
            >
              <Home className="w-3 h-3 text-brand-yellow" />
              <span>HOME</span>
            </a>
            <span className="text-slate-600">|</span>

            <a href="#centres" onClick={() => setActiveTab('home')} className="hover:text-brand-yellow flex items-center gap-1 whitespace-nowrap">
              <MapPin className="w-3 h-3 text-brand-yellow" />
              <span>CENTERS</span>
            </a>
            <span className="text-slate-600 hidden sm:inline">|</span>

            <a href="#results" onClick={() => setActiveTab('home')} className="hover:text-brand-yellow whitespace-nowrap hidden sm:inline">
              RESULTS
            </a>
            <span className="text-slate-600 hidden md:inline">|</span>

            <a href="#gallery" onClick={() => setActiveTab('home')} className="hover:text-brand-yellow whitespace-nowrap hidden md:inline">
              GALLERY
            </a>
            <span className="text-slate-600 hidden md:inline">|</span>

            <button onClick={onOpenTeam} className="hover:text-brand-yellow whitespace-nowrap hidden md:inline font-bold">
              TEAM
            </button>
            <span className="text-slate-600">|</span>

            <button
              onClick={() => {
                if (user) onOpenDashboard();
                else onOpenLogin();
              }}
              className="hover:text-brand-yellow text-brand-yellow font-bold whitespace-nowrap uppercase tracking-wider"
            >
              STUDENT ZONE
            </button>
          </div>

          {/* Right: Helpline, Apply Online & Login Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a
              href="tel:+919131435511"
              className="hidden lg:flex items-center gap-1 text-slate-300 hover:text-white text-[11px]"
            >
              <Phone className="w-3 h-3 text-brand-yellow" />
              <span>9131435511</span>
            </a>

            <a
              href="#contact"
              onClick={() => setActiveTab('home')}
              className="hover:text-brand-yellow hidden sm:inline text-slate-300 text-[11px] uppercase tracking-wider"
            >
              ENQUIRY
            </a>

            {/* Red APPLY ONLINE button matching screenshot */}
            <button
              onClick={onOpenRankX}
              className="bg-[#DC2626] hover:bg-[#b91c1c] text-white px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-wider whitespace-nowrap shadow transition transform hover:scale-[1.02]"
            >
              APPLY ONLINE
            </button>

            {/* Green LOGIN button matching screenshot */}
            {user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenDashboard}
                  className="bg-[#16A34A] hover:bg-[#15803d] text-white px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-wider whitespace-nowrap shadow flex items-center gap-1"
                >
                  <User className="w-3 h-3" />
                  <span>{user.fullName ? user.fullName.split(' ')[0] : 'PORTAL'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1 text-slate-400 hover:text-red-400 transition"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="bg-[#16A34A] hover:bg-[#15803d] text-white px-2.5 sm:px-3 py-1 rounded text-[10px] sm:text-[11px] font-black uppercase tracking-wider whitespace-nowrap shadow transition transform hover:scale-[1.02]"
              >
                LOGIN
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER NAVBAR (Pure White Background with Clean Navy Uppercase Menu Links) */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Indore Tagline */}
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 group"
          >
            <img
              src="/assets/web/logo-header.png"
              alt="Rankers Path Indore — Safalta Ka Sankalp"
              className="h-10 sm:h-12 w-auto object-contain transition group-hover:scale-[1.02]"
            />
            <div className="hidden sm:block border-l border-slate-300 pl-3">
              <span className="block text-xs font-black text-brand-navy leading-none uppercase tracking-wider">
                Indore, MP
              </span>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Safalta Ka Sankalp
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links (Exact Allen Nav Structure) */}
          <nav className="hidden xl:flex items-center gap-6 2xl:gap-7 text-xs 2xl:text-[13px] font-black text-slate-800 uppercase tracking-wide">
            <a
              href="#courses-fee"
              onClick={() => setActiveTab('home')}
              className="hover:text-brand-yellowDark transition hover:border-b-2 hover:border-brand-yellow pb-1"
            >
              COURSES &amp; FEE
            </a>

            <a
              href="#test-series"
              onClick={() => setActiveTab('home')}
              className="hover:text-brand-yellowDark transition hover:border-b-2 hover:border-brand-yellow pb-1"
            >
              DISTANCE LEARNING
            </a>

            <button
              onClick={onOpenRSAT}
              className="hover:text-brand-yellowDark transition hover:border-b-2 hover:border-brand-yellow pb-1 font-black"
            >
              ONLINE TEST SERIES
            </button>

            <a
              href="#contact"
              onClick={() => setActiveTab('home')}
              className="hover:text-brand-yellowDark transition hover:border-b-2 hover:border-brand-yellow pb-1"
            >
              ADMISSION
            </a>

            <button
              onClick={onOpenRankX}
              className="hover:text-brand-yellowDark transition hover:border-b-2 hover:border-brand-yellow pb-1"
            >
              FEE DEPOSIT
            </button>

            <button
              onClick={onOpenRankX}
              className="px-3 py-1 rounded bg-brand-yellow text-brand-navy hover:bg-[#e6a500] font-black text-xs uppercase tracking-wider transition shadow-sm"
            >
              ASAT / RANKX
            </button>

            <button
              onClick={onOpenTeam}
              className="hover:text-brand-yellowDark transition hover:border-b-2 hover:border-brand-yellow pb-1 font-black"
            >
              FACULTY TEAM
            </button>

            <a
              href="#contact"
              onClick={() => setActiveTab('home')}
              className="hover:text-brand-yellowDark transition hover:border-b-2 hover:border-brand-yellow pb-1"
            >
              CONTACT
            </a>
          </nav>

          {/* WhatsApp Direct & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919131435511?text=Hi%2C%20I%20want%20to%20know%20about%20Rankers%20Path%20Indore."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 bg-[#25D366] hover:bg-[#20ba59] text-white px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm transition"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fadeIn">
            <a
              href="#courses-fee"
              onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); }}
              className="block py-2 text-sm font-bold text-slate-800 border-b border-slate-100 uppercase"
            >
              COURSES &amp; FEE
            </a>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRSAT(); }}
              className="block w-full text-left py-2 text-sm font-bold text-slate-800 border-b border-slate-100 uppercase"
            >
              ONLINE TEST SERIES (CBT)
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRankX(); }}
              className="block w-full text-left py-2 text-sm font-bold text-brand-yellowDark border-b border-slate-100 uppercase"
            >
              ASAT / RANKX SCHOLARSHIP
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenTeam(); }}
              className="block w-full text-left py-2 text-sm font-bold text-slate-800 border-b border-slate-100 uppercase"
            >
              FACULTY &amp; MENTORS (TEAM)
            </button>
            <a
              href="#centres"
              onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); }}
              className="block py-2 text-sm font-bold text-slate-800 border-b border-slate-100 uppercase"
            >
              INDORE CENTRES
            </a>
            <a
              href="#contact"
              onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); }}
              className="block py-2 text-sm font-bold text-slate-800 border-b border-slate-100 uppercase"
            >
              CONTACT &amp; ADMISSION
            </a>

            <div className="pt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenRankX(); }}
                className="w-full py-2.5 px-3 bg-[#DC2626] text-white rounded-lg font-black text-xs uppercase tracking-wider text-center shadow"
              >
                APPLY ONLINE
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (user) onOpenDashboard();
                  else onOpenLogin();
                }}
                className="w-full py-2.5 px-3 bg-[#16A34A] text-white rounded-lg font-black text-xs uppercase tracking-wider text-center shadow"
              >
                {user ? 'DASHBOARD' : 'LOGIN'}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
