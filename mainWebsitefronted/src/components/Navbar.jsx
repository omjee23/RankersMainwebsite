import React, { useState } from 'react';
import { Phone, User, LogOut, Menu, X, Home, MapPin, Award, CheckCircle2, ChevronDown, CreditCard } from 'lucide-react';
import RankersPathLogo from './RankersPathLogo';

export default function Navbar({
  user,
  rsatUser,
  rankxUser,
  onOpenLogin,
  onLogout,
  onLogoutRsat,
  onLogoutRankX,
  onOpenRankX,
  onOpenRSAT,
  onOpenDashboard,
  onOpenRsatDashboard,
  onOpenRankXDashboard,
  onOpenAbout,
  onOpenTeam,
  onOpenRefundPolicy,
  onOpenAdmission,
  onOpenCoursePage,
  onOpenCashfreePortal,
  activeTab,
  setActiveTab
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);

  const handleGoHome = (e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHomeSection = (sectionId, e) => {
    if (e) e.preventDefault();
    setMobileMenuOpen(false);
    const scrollTarget = () => {
      const el = document.getElementById(sectionId) ||
        (sectionId === 'courses-fee' ? document.getElementById('courses') : null);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(scrollTarget, 180);
    } else {
      scrollTarget();
    }
  };

  return (
    <>
      {/* MAIN HEADER NAVBAR (Pure White Background with Clean Navy Uppercase Menu Links) */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-sm transition-all">
        <div className="max-w-[1440px] mx-auto px-3 sm:px-5 lg:px-6 h-20 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Brand Logo & Tagline */}
          <a
            href="#top"
            onClick={handleGoHome}
            className="flex items-center gap-3 group flex-shrink-0 cursor-pointer"
            title="RankersPath Indore — Safalta Ka Sankalp (Home)"
          >
            <RankersPathLogo className="h-10 sm:h-12 w-auto object-contain transition group-hover:scale-[1.02]" />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-2 xl:gap-3 2xl:gap-3.5 text-xs font-black text-slate-800 uppercase tracking-wide">
            {/* Primary HOME Navigation Button */}
            <button
              onClick={handleGoHome}
              className={`transition hover:border-b-2 hover:border-brand-yellow pb-1 font-black whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'text-brand-navy border-b-2 border-brand-yellow font-extrabold'
                  : 'text-slate-800 hover:text-brand-yellowDark'
              }`}
              title="Return to Home Page"
            >
              <Home className="w-4 h-4 text-brand-yellow" />
              <span>HOME</span>
            </button>

            {/* Dropdown for COURSES & FEE */}
            <div
              className="relative"
              onMouseEnter={() => setCoursesDropdownOpen(true)}
              onMouseLeave={() => setCoursesDropdownOpen(false)}
            >
              <button
                onClick={(e) => handleNavigateHomeSection('courses-fee', e)}
                className={`hover:text-brand-yellowDark transition hover:border-b-2 hover:border-brand-yellow pb-1 whitespace-nowrap font-black flex items-center gap-1 ${
                  activeTab.startsWith('course-') ? 'text-brand-navy border-b-2 border-brand-yellow' : ''
                }`}
              >
                <span>COURSES &amp; FEE</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {coursesDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setCoursesDropdownOpen(false);
                      if (onOpenCoursePage) onOpenCoursePage('jee-adv');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-brand-navy flex items-center justify-between transition"
                  >
                    <div>
                      <span className="block text-slate-900 font-extrabold">JEE (Main + Advanced)</span>
                      <span className="text-[10px] text-slate-500 font-normal">IIT-JEE 11th, 12th &amp; Droppers</span>
                    </div>
                    <span className="text-[10px] bg-brand-yellow/30 text-brand-navy px-1.5 py-0.5 rounded font-black">IIT</span>
                  </button>

                  <button
                    onClick={() => {
                      setCoursesDropdownOpen(false);
                      if (onOpenCoursePage) onOpenCoursePage('neet-ug');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-brand-navy flex items-center justify-between transition"
                  >
                    <div>
                      <span className="block text-slate-900 font-extrabold">Pre-Medical (NEET-UG)</span>
                      <span className="text-[10px] text-slate-500 font-normal">Medical 11th, 12th &amp; Repeaters</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black">NEET</span>
                  </button>

                  <button
                    onClick={() => {
                      setCoursesDropdownOpen(false);
                      if (onOpenCoursePage) onOpenCoursePage('jee-main');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-brand-navy flex items-center justify-between transition"
                  >
                    <div>
                      <span className="block text-slate-900 font-extrabold">JEE (Main) Focused</span>
                      <span className="text-[10px] text-slate-500 font-normal">Speed &amp; Accuracy for NITs/IIITs</span>
                    </div>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-black">NTA</span>
                  </button>

                  <button
                    onClick={() => {
                      setCoursesDropdownOpen(false);
                      if (onOpenCoursePage) onOpenCoursePage('pncf');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-brand-navy flex items-center justify-between transition"
                  >
                    <div>
                      <span className="block text-slate-900 font-extrabold">Foundation (9th &amp; 10th)</span>
                      <span className="text-[10px] text-slate-500 font-normal">Olympiads, NTSE &amp; Boards</span>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-black">PNCF</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={(e) => {
                      setCoursesDropdownOpen(false);
                      handleNavigateHomeSection('courses-fee', e);
                    }}
                    className="w-full text-left px-4 py-2 text-[11px] font-bold text-slate-600 hover:text-brand-navy hover:bg-slate-50 transition flex items-center justify-between"
                  >
                    <span>View All 5 Courses Overview</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={onOpenAdmission}
              className={`transition hover:border-b-2 hover:border-brand-yellow pb-1 font-black whitespace-nowrap ${
                activeTab === 'admission'
                  ? 'text-brand-yellowDark border-b-2 border-brand-yellow'
                  : 'hover:text-brand-yellowDark'
              }`}
            >
              ADMISSION FORM
            </button>

            {/* SEPARATE RSAT BUTTON WITH LOGOUT */}
            {rsatUser ? (
              <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-emerald-500/40">
                <button
                  onClick={onOpenRSAT}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1.5"
                  title="Open RSAT Dashboard"
                >
                  <Award className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>RSAT: {typeof rsatUser?.fullName === 'string' ? rsatUser.fullName.split(' ')[0] : 'PORTAL'}</span>
                </button>
                <button
                  onClick={onLogoutRsat}
                  className="px-2 py-1.5 bg-emerald-800 hover:bg-red-600 text-emerald-100 hover:text-white border-l border-emerald-700/60 font-bold text-xs transition flex items-center justify-center"
                  title="Logout from RSAT"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenRSAT}
                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition shadow-sm whitespace-nowrap transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                title="RSAT — Scholarship Exam (Online CBT & Offline)"
              >
                <Award className="w-3.5 h-3.5 text-brand-yellow" />
                <span>RSAT</span>
              </button>
            )}

            {/* SEPARATE RANKEX BUTTON WITH LOGOUT */}
            {rankxUser ? (
              <div className="flex items-center shadow-sm rounded-lg overflow-hidden border border-amber-500/50">
                <button
                  onClick={onOpenRankX}
                  className="px-3 py-1.5 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider transition whitespace-nowrap flex items-center gap-1.5"
                  title="Open RANKEX Dashboard"
                >
                  <Award className="w-3.5 h-3.5 text-brand-navy" />
                  <span>RANKEX: {typeof rankxUser?.fullName === 'string' ? rankxUser.fullName.split(' ')[0] : 'PORTAL'}</span>
                </button>
                <button
                  onClick={onLogoutRankX}
                  className="px-2 py-1.5 bg-amber-600 hover:bg-red-600 text-white border-l border-amber-600/70 font-bold text-xs transition flex items-center justify-center"
                  title="Logout from RANKEX"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenRankX}
                className="px-3.5 py-1.5 rounded-lg bg-brand-yellow text-brand-navy hover:bg-[#e6a500] font-black text-xs uppercase tracking-wider transition shadow-sm whitespace-nowrap transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                title="RANKEX — Talent & Excellence Scholarship Exam (Online & Offline)"
              >
                <Award className="w-3.5 h-3.5 text-brand-navy" />
                <span>RANKEX</span>
              </button>
            )}

            {/* Dropdown for ABOUT US (About RankersPath, Faculty Team, Rankers & Reviews) */}
            <div
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`hover:text-brand-yellowDark transition hover:border-b-2 hover:border-brand-yellow pb-1 whitespace-nowrap font-black flex items-center gap-1 ${
                  activeTab === 'about' || activeTab === 'team'
                    ? 'text-brand-navy border-b-2 border-brand-yellow'
                    : 'text-slate-800'
                }`}
              >
                <span>ABOUT US</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {aboutDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  {/* 1. About RankersPath */}
                  <button
                    onClick={() => {
                      setAboutDropdownOpen(false);
                      if (onOpenAbout) onOpenAbout();
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-between ${
                      activeTab === 'about' ? 'text-brand-navy bg-amber-50/60 font-black' : 'text-slate-800 hover:text-brand-navy'
                    }`}
                  >
                    <div>
                      <span className="block text-slate-900 font-extrabold">About RankersPath</span>
                      <span className="text-[10px] text-slate-500 font-normal">Our Legacy, Mission &amp; Methodology</span>
                    </div>
                    <span className="text-[10px] bg-brand-yellow/30 text-brand-navy px-1.5 py-0.5 rounded font-black">STORY</span>
                  </button>

                  {/* 2. Faculty Team */}
                  <button
                    onClick={() => {
                      setAboutDropdownOpen(false);
                      if (onOpenTeam) onOpenTeam();
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-slate-50 transition flex items-center justify-between ${
                      activeTab === 'team' ? 'text-brand-navy bg-amber-50/60 font-black' : 'text-slate-800 hover:text-brand-navy'
                    }`}
                  >
                    <div>
                      <span className="block text-slate-900 font-extrabold">Faculty &amp; Mentors</span>
                      <span className="text-[10px] text-slate-500 font-normal">Kota Star Mentors (25+ Yrs Exp)</span>
                    </div>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-black">TEAM</span>
                  </button>

                  {/* 3. Rankers & Reviews */}
                  <button
                    onClick={(e) => {
                      setAboutDropdownOpen(false);
                      handleNavigateHomeSection('testimonials', e);
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-slate-50 hover:text-brand-navy flex items-center justify-between transition"
                  >
                    <div>
                      <span className="block text-slate-900 font-extrabold">Rankers &amp; Reviews</span>
                      <span className="text-[10px] text-slate-500 font-normal">Student Testimonials &amp; Hall of Fame</span>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-black">REVIEWS</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  {/* 4. Official Online Fee Portal (Cashfree PG) */}
                  <button
                    onClick={() => {
                      setAboutDropdownOpen(false);
                      if (onOpenCashfreePortal) onOpenCashfreePortal('REAL_GATEWAY_TEST');
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-800 hover:bg-emerald-50 hover:text-emerald-900 flex items-center justify-between transition group"
                  >
                    <div>
                      <span className="block text-slate-900 font-extrabold group-hover:text-emerald-800 flex items-center gap-1.5">
                        <span>Fee Portal</span>
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 py-0.2 rounded font-black">CASHFREE PG</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-normal">Pay Fees, RSAT/RANKEX &amp; Test Live PG</span>
                    </div>
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={(e) => handleNavigateHomeSection('contact', e)}
              className="hover:text-brand-yellowDark transition hover:border-b-2 hover:border-brand-yellow pb-1 whitespace-nowrap font-black"
            >
              CONTACT
            </button>

            {/* LOGIN / SIGN IN / STUDENT ACCOUNT BUTTON (SMART SESSION AWARE) */}
            {user ? (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={onOpenDashboard}
                  className="px-3.5 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803d] text-white font-black text-xs uppercase tracking-wider transition shadow-sm whitespace-nowrap flex items-center gap-1.5"
                  title="Enrolled Student Dashboard"
                >
                  <User className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>{typeof user?.fullName === 'string' ? user.fullName.split(' ')[0] : 'STUDENT ZONE'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 transition font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-xs"
                  title="Logout from Classroom Account"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-[11px]">LOGOUT</span>
                </button>
              </div>
            ) : activeTab === 'rsat-dashboard' && rsatUser ? (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={onOpenRsatDashboard}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider transition shadow-sm whitespace-nowrap flex items-center gap-1.5"
                  title="RSAT Dashboard"
                >
                  <Award className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>RSAT: {typeof rsatUser?.fullName === 'string' ? rsatUser.fullName.split(' ')[0] : 'ASPIRANT'}</span>
                </button>
                <button
                  onClick={onLogoutRsat}
                  className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 transition font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-xs"
                  title="Logout from RSAT"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-[11px]">LOGOUT RSAT</span>
                </button>
              </div>
            ) : activeTab === 'rankx-dashboard' && rankxUser ? (
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={onOpenRankXDashboard}
                  className="px-3.5 py-1.5 rounded-lg bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider transition shadow-sm whitespace-nowrap flex items-center gap-1.5"
                  title="RANKEX Dashboard"
                >
                  <Award className="w-3.5 h-3.5 text-brand-navy" />
                  <span>RANKEX: {typeof rankxUser?.fullName === 'string' ? rankxUser.fullName.split(' ')[0] : 'CANDIDATE'}</span>
                </button>
                <button
                  onClick={onLogoutRankX}
                  className="px-2.5 py-1.5 rounded-lg bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border border-red-200 hover:border-red-600 transition font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-xs"
                  title="Logout from RANKEX"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="text-[11px]">LOGOUT RANKEX</span>
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="ml-2 px-4 py-1.5 rounded-lg bg-[#16A34A] hover:bg-[#15803d] text-white font-black text-xs uppercase tracking-wider transition shadow-sm whitespace-nowrap transform hover:scale-105 active:scale-95 flex items-center gap-1.5"
                title="Student Login / Sign In"
              >
                <User className="w-3.5 h-3.5" />
                <span>LOGIN / SIGN IN</span>
              </button>
            )}
          </nav>

          {/* Mobile Menu Button (lg:hidden) with Quick Login / Logout */}
          <div className="lg:hidden flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenDashboard}
                  className="px-2.5 py-1.5 rounded-lg bg-[#16A34A] text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm"
                  title="Student Portal"
                >
                  <User className="w-3 h-3 text-brand-yellow" />
                  <span>{typeof user?.fullName === 'string' ? user.fullName.split(' ')[0] : 'PORTAL'}</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : activeTab === 'rsat-dashboard' && rsatUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenRsatDashboard}
                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm"
                  title="RSAT Portal"
                >
                  <Award className="w-3 h-3 text-brand-yellow" />
                  <span>{typeof rsatUser?.fullName === 'string' ? rsatUser.fullName.split(' ')[0] : 'RSAT'}</span>
                </button>
                <button
                  onClick={onLogoutRsat}
                  className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200"
                  title="Logout RSAT"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : activeTab === 'rankx-dashboard' && rankxUser ? (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={onOpenRankXDashboard}
                  className="px-2.5 py-1.5 rounded-lg bg-brand-yellow text-brand-navy font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm"
                  title="RANKEX Portal"
                >
                  <Award className="w-3 h-3 text-brand-navy" />
                  <span>{typeof rankxUser?.fullName === 'string' ? rankxUser.fullName.split(' ')[0] : 'RANKEX'}</span>
                </button>
                <button
                  onClick={onLogoutRankX}
                  className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200"
                  title="Logout RANKEX"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-2.5 py-1.5 rounded-lg bg-[#16A34A] text-white font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm"
              >
                <User className="w-3 h-3" />
                <span>LOGIN</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-8 space-y-2 shadow-xl animate-fadeIn max-h-[calc(100vh-5rem)] overflow-y-auto overscroll-contain">
            {/* Mobile Home Button */}
            <button
              onClick={handleGoHome}
              className={`w-full text-left py-2.5 px-3 text-sm font-black border-b border-slate-100 uppercase flex items-center gap-2.5 rounded-xl transition ${
                activeTab === 'home'
                  ? 'bg-brand-yellow/20 text-brand-navy'
                  : 'text-slate-800 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4 text-brand-yellow" />
              <span>HOME PAGE</span>
            </button>

            {/* Mobile Courses Section */}
            <div className="border-b border-slate-100 pb-1">
              <button
                onClick={(e) => handleNavigateHomeSection('courses-fee', e)}
                className="block w-full text-left py-2 px-3 text-sm font-black text-slate-900 uppercase hover:bg-slate-50 rounded-lg flex items-center justify-between"
              >
                <span>COURSES &amp; FEE (ALL)</span>
                <span className="text-[10px] text-brand-yellow font-extrabold">&rarr;</span>
              </button>

              <div className="grid grid-cols-2 gap-1.5 px-2 pb-1.5 pt-0.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenCoursePage) onOpenCoursePage('jee-adv');
                  }}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-brand-yellow/20 rounded text-[11px] font-bold text-slate-800 text-left border border-slate-200/60"
                >
                  JEE (Main + Adv)
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenCoursePage) onOpenCoursePage('neet-ug');
                  }}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-emerald-50 rounded text-[11px] font-bold text-slate-800 text-left border border-slate-200/60"
                >
                  Pre-Medical NEET
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenCoursePage) onOpenCoursePage('jee-main');
                  }}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-blue-50 rounded text-[11px] font-bold text-slate-800 text-left border border-slate-200/60"
                >
                  JEE (Main) NTA
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenCoursePage) onOpenCoursePage('pncf');
                  }}
                  className="py-1.5 px-2 bg-slate-50 hover:bg-purple-50 rounded text-[11px] font-bold text-slate-800 text-left border border-slate-200/60"
                >
                  Foundation (9th &amp; 10th)
                </button>
              </div>
            </div>
            {/* RSAT */}
            {rsatUser ? (
              <div className="w-full py-2 px-3 border-b border-slate-100 rounded-lg flex items-center justify-between bg-emerald-50 text-emerald-800">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenRSAT(); }}
                  className="flex items-center gap-2 text-xs font-black uppercase text-left flex-1"
                >
                  <Award className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>RSAT: {typeof rsatUser?.fullName === 'string' ? rsatUser.fullName.split(' ')[0] : 'ASPIRANT'}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogoutRsat(); }}
                  className="px-2 py-1 rounded bg-red-100 hover:bg-red-600 text-red-700 hover:text-white text-[10px] font-black transition flex items-center gap-1"
                  title="Logout RSAT"
                >
                  <LogOut className="w-3 h-3" />
                  <span>LOGOUT</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenRSAT(); }}
                className="w-full text-left py-2.5 px-3 text-sm font-black border-b border-slate-100 uppercase hover:bg-emerald-50 rounded-lg flex items-center justify-between text-emerald-700"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>RSAT SCHOLARSHIP EXAM</span>
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">ONLINE / OFFLINE</span>
              </button>
            )}

            {/* RANKEX */}
            {rankxUser ? (
              <div className="w-full py-2 px-3 border-b border-slate-100 rounded-lg flex items-center justify-between bg-amber-50 text-brand-navy">
                <button
                  onClick={() => { setMobileMenuOpen(false); onOpenRankX(); }}
                  className="flex items-center gap-2 text-xs font-black uppercase text-left flex-1"
                >
                  <Award className="w-4 h-4 text-brand-yellowDark flex-shrink-0" />
                  <span>RANKEX: {typeof rankxUser?.fullName === 'string' ? rankxUser.fullName.split(' ')[0] : 'CANDIDATE'}</span>
                </button>
                <button
                  onClick={() => { setMobileMenuOpen(false); onLogoutRankX(); }}
                  className="px-2 py-1 rounded bg-red-100 hover:bg-red-600 text-red-700 hover:text-white text-[10px] font-black transition flex items-center gap-1"
                  title="Logout RANKEX"
                >
                  <LogOut className="w-3 h-3" />
                  <span>LOGOUT</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenRankX(); }}
                className="w-full text-left py-2.5 px-3 text-sm font-black border-b border-slate-100 uppercase hover:bg-amber-50 rounded-lg flex items-center justify-between text-brand-navy"
              >
                <span className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-brand-yellowDark" />
                  <span>RANKEX 2027 EXAM</span>
                </span>
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full">ONLINE / OFFLINE</span>
              </button>
            )}

            {/* ABOUT US SECTION IN MOBILE MENU */}
            <div className="border-b border-slate-100 pb-1">
              <span className="block px-3 pt-2 pb-1 text-[10px] font-black uppercase tracking-wider text-slate-400">
                ABOUT RANKERS PATH
              </span>
              <button
                onClick={() => { setMobileMenuOpen(false); if (onOpenAbout) onOpenAbout(); }}
                className={`block w-full text-left py-2 px-3 text-sm font-bold rounded-lg transition ${
                  activeTab === 'about' ? 'bg-brand-yellow/20 text-brand-navy font-black' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                ABOUT INSTITUTE &amp; METHODOLOGY
              </button>
              <button
                onClick={() => { setMobileMenuOpen(false); if (onOpenTeam) onOpenTeam(); }}
                className={`block w-full text-left py-2 px-3 text-sm font-bold rounded-lg transition ${
                  activeTab === 'team' ? 'bg-brand-yellow/20 text-brand-navy font-black' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                FACULTY &amp; MENTORS (TEAM)
              </button>
              <button
                onClick={(e) => { setMobileMenuOpen(false); handleNavigateHomeSection('testimonials', e); }}
                className="block w-full text-left py-2 px-3 text-sm font-bold text-slate-800 hover:bg-slate-50 rounded-lg transition"
              >
                RANKERS &amp; REVIEWS (HALL OF FAME)
              </button>
            </div>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmission(); }}
              className={`block w-full text-left py-2 px-3 text-sm font-black border-b border-slate-100 uppercase hover:bg-slate-50 rounded-lg ${
                activeTab === 'admission' ? 'text-brand-yellowDark' : 'text-brand-navy'
              }`}
            >
              OFFICIAL ADMISSION FORM (2026-27)
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); if (onOpenCashfreePortal) onOpenCashfreePortal('REAL_GATEWAY_TEST'); }}
              className="w-full text-left py-2 px-3 text-sm font-black border-b border-slate-100 uppercase hover:bg-emerald-50 text-emerald-800 rounded-lg flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                <span>ONLINE FEE PORTAL</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">CASHFREE PG</span>
            </button>
            <button
              onClick={(e) => handleNavigateHomeSection('centres', e)}
              className="block w-full text-left py-2 px-3 text-sm font-bold text-slate-800 border-b border-slate-100 uppercase hover:bg-slate-50 rounded-lg"
            >
              INDORE CENTRES
            </button>
            <button
              onClick={(e) => handleNavigateHomeSection('contact', e)}
              className="block w-full text-left py-2 px-3 text-sm font-bold text-slate-800 border-b border-slate-100 uppercase hover:bg-slate-50 rounded-lg"
            >
              CONTACT &amp; ADMISSION
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenRefundPolicy(); }}
              className={`block w-full text-left py-2 px-3 text-sm font-bold border-b border-slate-100 uppercase hover:bg-slate-50 rounded-lg ${
                activeTab === 'refund-policy' ? 'text-amber-800 font-black' : 'text-amber-700'
              }`}
            >
              REFUND &amp; TRANSFER POLICY
            </button>

            <div className="pt-3 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenRsatDashboard) onOpenRsatDashboard();
                  else onOpenRSAT();
                }}
                className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-xs uppercase tracking-wider text-center shadow flex items-center justify-center gap-1.5"
              >
                <Award className="w-4 h-4 text-brand-yellow" />
                <span>RSAT 100% SCHOLARSHIP PORTAL</span>
              </button>

              {user ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDashboard();
                    }}
                    className="w-full py-2.5 px-3 bg-[#16A34A] hover:bg-[#15803d] text-white rounded-lg font-black text-xs uppercase tracking-wider text-center shadow flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-brand-yellow" />
                    <span>DASHBOARD</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full py-2.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-black text-xs uppercase tracking-wider text-center shadow flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>LOGOUT</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { setMobileMenuOpen(false); onOpenAdmission(); }}
                    className="w-full py-2.5 px-3 bg-[#DC2626] hover:bg-red-700 text-white rounded-lg font-black text-xs uppercase tracking-wider text-center shadow"
                  >
                    APPLY ADMISSION
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="w-full py-2.5 px-3 bg-brand-navy hover:bg-slate-800 text-white rounded-lg font-black text-xs uppercase tracking-wider text-center shadow flex items-center justify-center gap-1.5"
                  >
                    <User className="w-3.5 h-3.5 text-brand-yellow" />
                    <span>LOGIN / SIGN IN</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
