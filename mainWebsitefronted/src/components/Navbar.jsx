import React, { useState } from 'react';
import { Phone, MessageCircle, User, LogOut, Menu, X, Sparkles, Award } from 'lucide-react';

export default function Navbar({
  user,
  onOpenLogin,
  onLogout,
  onOpenRankX,
  onOpenRSAT,
  onOpenDashboard,
  activeTab,
  setActiveTab
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Top High-Priority Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-navyCard to-brand-navy text-white text-xs sm:text-sm py-2 px-4 border-b border-brand-yellow/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="bg-brand-yellow text-brand-navy font-extrabold px-2.5 py-0.5 rounded-full text-[11px] uppercase tracking-wider animate-pulse flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3 inline" /> New Batch
            </span>
            <span className="text-slate-200">
              <strong className="text-brand-yellow">24 June 2026</strong> — NEET Dropper Batch starting soon. Limited to 30 seats per batch!
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={onOpenRankX}
              className="text-brand-yellow hover:text-white underline font-semibold transition"
            >
              RankX Offline Scholarship Form
            </button>
            <span className="text-slate-500 hidden md:inline">|</span>
            <a
              href="tel:+919131435511"
              className="hidden md:flex items-center gap-1 text-slate-300 hover:text-white transition"
            >
              <Phone className="w-3 h-3 text-brand-yellow" /> Helpline: 9131435511
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Navigation */}
      <header className="sticky top-0 z-50 glass-panel border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <a
            href="#top"
            onClick={(e) => { e.preventDefault(); setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 group"
          >
            <img
              src="/assets/web/logo-header.png"
              alt="Rankers Path — Safalta Ka Sankalp"
              className="h-10 sm:h-12 w-auto object-contain transition group-hover:scale-[1.02]"
            />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-700">
            <a href="#about" onClick={() => setActiveTab('home')} className="hover:text-brand-yellowDark transition">About</a>
            <a href="#courses" onClick={() => setActiveTab('home')} className="hover:text-brand-yellowDark transition">Courses</a>
            <a href="#why-us" onClick={() => setActiveTab('home')} className="hover:text-brand-yellowDark transition">Why Us</a>
            <a href="#gallery" onClick={() => setActiveTab('home')} className="hover:text-brand-yellowDark transition">Gallery</a>
            <a href="#contact" onClick={() => setActiveTab('home')} className="hover:text-brand-yellowDark transition">Contact</a>
            
            <button
              onClick={onOpenRankX}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-yellow/15 text-brand-navy border border-brand-yellow/40 hover:bg-brand-yellow hover:text-brand-navy font-bold transition shadow-sm"
            >
              <Award className="w-4 h-4 text-brand-yellowDark" /> RankX 2026
            </button>
            <button
              onClick={onOpenRSAT}
              className="text-slate-700 hover:text-brand-yellowDark transition font-semibold"
            >
              RSAT Online
            </button>
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919131435511?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20Rankers%20Path."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-[#25D366] hover:bg-[#20ba59] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>

            {/* Student Account Button */}
            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenDashboard}
                  className="flex items-center gap-2 bg-brand-navy text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-brand-navyLight transition"
                >
                  <User className="w-4 h-4 text-brand-yellow" />
                  <span>{user.fullName?.split(' ')[0] || 'Dashboard'}</span>
                </button>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-500 transition rounded-lg hover:bg-slate-100"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-2 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy px-4 py-2 rounded-xl font-extrabold text-sm shadow-md transition transform hover:-translate-y-0.5"
              >
                <User className="w-4 h-4" />
                <span>Student Login</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-xl">
            <a
              href="#about"
              onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); }}
              className="block py-2 text-base font-semibold text-slate-800"
            >
              About Institute
            </a>
            <a
              href="#courses"
              onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); }}
              className="block py-2 text-base font-semibold text-slate-800"
            >
              Courses Offered
            </a>
            <a
              href="#why-us"
              onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); }}
              className="block py-2 text-base font-semibold text-slate-800"
            >
              Why Rankers Path
            </a>
            <a
              href="#gallery"
              onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); }}
              className="block py-2 text-base font-semibold text-slate-800"
            >
              Photo Gallery
            </a>
            <a
              href="#contact"
              onClick={() => { setMobileMenuOpen(false); setActiveTab('home'); }}
              className="block py-2 text-base font-semibold text-slate-800"
            >
              Contact &amp; Location
            </a>

            <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenRankX(); }}
                className="w-full py-2.5 px-3 bg-brand-yellow text-brand-navy rounded-xl font-bold text-sm text-center shadow"
              >
                RankX Offline Exam
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenRSAT(); }}
                className="w-full py-2.5 px-3 bg-brand-navy text-white rounded-xl font-bold text-sm text-center shadow"
              >
                RSAT Online CBT
              </button>
            </div>

            <div className="pt-2">
              {user ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenDashboard(); }}
                    className="flex-1 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm"
                  >
                    Open Student Dashboard ({user.fullName})
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); onLogout(); }}
                    className="px-4 py-2.5 bg-red-100 text-red-600 rounded-xl font-bold text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenLogin(); }}
                  className="w-full py-3 bg-brand-navy text-brand-yellow font-extrabold rounded-xl text-center"
                >
                  Student Login / Register (OTP)
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
