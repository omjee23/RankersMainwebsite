import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  Calendar,
  Bell,
  CheckCircle2,
  Download,
  FileText,
  Zap,
  Target,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  Sparkles,
  ExternalLink,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  X,
  Share2,
  Home,
  LogOut,
  Lock
} from 'lucide-react';
import { api } from '../services/api';

const SCHOLARSHIP_SLABS = [
  {
    range: '90% and Above',
    percentage: '100% Tuition Fee Waiver',
    amountSaved: 'Save up to ₹1,05,000',
    batch: 'Direct entry into Super-30 Elite Batch',
    color: 'from-amber-500 to-yellow-400',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300'
  },
  {
    range: '80% to 89%',
    percentage: '75% Tuition Fee Waiver',
    amountSaved: 'Save up to ₹78,750',
    batch: 'Rankers Premier Leader Batch',
    color: 'from-emerald-500 to-teal-400',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300'
  },
  {
    range: '70% to 79%',
    percentage: '50% Tuition Fee Waiver',
    amountSaved: 'Save up to ₹52,500',
    batch: 'Rankers Achiever Batch',
    color: 'from-blue-500 to-cyan-400',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300'
  },
  {
    range: '60% to 69%',
    percentage: '35% Tuition Fee Waiver',
    amountSaved: 'Save up to ₹36,750',
    batch: 'Rankers Target Batch',
    color: 'from-purple-500 to-indigo-400',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-300'
  },
  {
    range: '50% to 59%',
    percentage: '20% Tuition Fee Waiver',
    amountSaved: 'Save up to ₹21,000',
    batch: 'Foundation / Standard Batch',
    color: 'from-slate-600 to-slate-400',
    badgeBg: 'bg-slate-100 text-slate-900 border-slate-300'
  }
];

const DEFAULT_RSAT_MATERIALS = [
  {
    id: 'mat-rsat-001',
    title: 'RSAT 2026 Official Diagnostic Mock Question Paper 01 (PCM / PCB with Solutions)',
    category: 'PYQ',
    subject: 'General',
    fileSize: '3.4 MB',
    downloadCount: 4280,
    description: 'Official 30-question diagnostic sample test matching exact RSAT exam pattern and marking scheme (+4, -1).'
  },
  {
    id: 'mat-rsat-002',
    title: 'RSAT High-Yield Fast Track Formula & Short Notes Handbook 2026',
    category: 'PDF',
    subject: 'Physics',
    fileSize: '5.1 MB',
    downloadCount: 3890,
    description: 'Pocket formula cheat sheet covering all high-weightage formulas in Physics, Chemistry & Biology/Maths for quick pre-exam revision.'
  },
  {
    id: 'mat-rsat-003',
    title: 'RSAT 100% Scholarship Qualifying Model Test Paper 02 (With Answer Key)',
    category: 'NOTES',
    subject: 'Chemistry',
    fileSize: '4.2 MB',
    downloadCount: 2950,
    description: 'Specially designed by Senior Kota Mentors to help students score 90%+ and secure a 100% tuition fee scholarship waiver.'
  },
  {
    id: 'mat-rsat-004',
    title: 'RSAT Biology NCERT Fast-Reckoner Diagrams & Flowcharts Handbook',
    category: 'IMAGE',
    subject: 'Biology',
    fileSize: '3.8 MB',
    downloadCount: 2140,
    description: 'High-yield memory retention sheets for Genetics, Plant Physiology, and Human Physiology.'
  }
];

export default function RsatDashboardView({
  user,
  onLaunchExam,
  onOpenPayment,
  onSwitchToEnrolledPortal,
  onOpenReschedule,
  onBackToHome,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'materials', 'slabs', 'instructions'
  const [slotData, setSlotData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(2);
  const [materials, setMaterials] = useState(DEFAULT_RSAT_MATERIALS);
  const [materialFilter, setMaterialFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const studentMobile = user?.mobile || '9826123456';
  const studentName = user?.fullName || 'RSAT Aspirant';
  const studentStream = user?.targetStream || 'NEET';

  const [feeStatus, setFeeStatus] = useState({
    isPaid: Boolean(user?.isPaid),
    loading: true,
    activeExamId: 'test-rsat-scholarship',
    rollNumber: user?.rollNumber || null
  });

  // Verify dynamic RSAT payment gatekeeper status & active exam
  useEffect(() => {
    const mobileToCheck = user?.mobile || studentMobile;
    if (mobileToCheck) {
      api.checkRsatStatus(mobileToCheck).then(res => {
        if (res && res.data) {
          const paid = Boolean(res.data.isPaid || localStorage.getItem(`rp_rsat_paid_${mobileToCheck}`));
          setFeeStatus({
            isPaid: paid,
            loading: false,
            activeExamId: res.data.activeExamId || res.data.examId || 'test-rsat-scholarship',
            rollNumber: res.data.registration?.rollNumber || user?.rollNumber || null
          });
        }
      }).catch(() => {
        const paid = Boolean(localStorage.getItem(`rp_rsat_paid_${mobileToCheck}`));
        setFeeStatus(prev => ({ ...prev, isPaid: paid, loading: false }));
      });
    }
  }, [studentMobile, user]);

  const handleLaunchClick = () => {
    if (!feeStatus.isPaid) {
      if (onOpenPayment) {
        onOpenPayment();
      }
      return;
    }
    if (onLaunchExam) {
      onLaunchExam(feeStatus.activeExamId);
    }
  };

  // Load slot data from localStorage or API
  useEffect(() => {
    const savedSlot = localStorage.getItem(`rp_rsat_slot_${studentMobile}`);
    if (savedSlot) {
      try {
        setSlotData(JSON.parse(savedSlot));
      } catch (e) {}
    } else {
      // Default to tomorrow 10:00 AM slot
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultSlot = {
        mode: 'LATER',
        date: tomorrow.toISOString().split('T')[0],
        timeSlot: '10:00 AM – 10:45 AM',
        scheduledAt: new Date().toISOString()
      };
      setSlotData(defaultSlot);
      localStorage.setItem(`rp_rsat_slot_${studentMobile}`, JSON.stringify(defaultSlot));
    }

    // Fetch Notifications
    api.getRsatNotifications(studentMobile).then(res => {
      if (res.data?.notifications) {
        setNotifications(res.data.notifications);
        const unread = res.data.notifications.filter(n => n.unread).length;
        setUnreadNotifCount(unread || 2);
      }
    });

    // Fetch Study Materials from backend (or fallback to defaults)
    api.getStudyMaterials().then(res => {
      if (res.data && res.data.length > 0) {
        const rsatItems = res.data.filter(m => m.id?.includes('rsat') || m.title?.includes('RSAT') || m.stream === 'ALL');
        if (rsatItems.length > 0) {
          setMaterials(rsatItems);
        }
      }
    });
  }, [studentMobile]);

  // Live countdown timer calculation
  useEffect(() => {
    if (!slotData?.date) return;

    const calculateTime = () => {
      // Target time: slot date at 10:00 AM (or extracted from timeSlot string)
      let slotHour = 10;
      let slotMinute = 0;
      if (slotData.timeSlot) {
        const match = slotData.timeSlot.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (match) {
          let h = parseInt(match[1]);
          const m = parseInt(match[2]);
          const ampm = match[3].toUpperCase();
          if (ampm === 'PM' && h < 12) h += 12;
          if (ampm === 'AM' && h === 12) h = 0;
          slotHour = h;
          slotMinute = m;
        }
      }

      const target = new Date(slotData.date);
      target.setHours(slotHour, slotMinute, 0, 0);

      const diff = target.getTime() - new Date().getTime();

      if (diff <= 0) {
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeRemaining({ days, hours, minutes, seconds });
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [slotData]);

  const handleDownloadMaterial = (mat) => {
    api.trackMaterialDownload(mat.id);
    const dummyText = `=====================================================
RANKERS PATH INDORE - RSAT 2026-27 SCHOLARSHIP PORTAL
Material: ${mat.title}
Subject: ${mat.subject} | Category: ${mat.category}
=====================================================

Instructions:
1. This is the official diagnostic preparation material for the RSAT Computer Based Test.
2. Review the chapter formulas and solve sample questions to target 90%+ marks.
3. Students securing 90%+ receive a 100% Tuition Fee waiver on 1-Year & 2-Year classroom batches.

Good Luck with your preparation!
Rankers Path Academic Directorate, Indore.`;

    const blob = new Blob([dummyText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mat.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredMaterials = materials.filter(m => {
    const matchesSubject = materialFilter === 'ALL' || m.subject === materialFilter || m.subject === 'General';
    const matchesSearch = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Back to Home Page & Logout buttons */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-2 text-xs font-black text-slate-700 hover:text-brand-navy bg-white px-4 py-2.5 rounded-xl border border-slate-200 shadow-xs transition hover:border-brand-yellow hover:shadow-sm"
            >
              <Home className="w-4 h-4 text-brand-yellow" />
              <span>&larr; Back to Home Page</span>
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 text-xs font-black text-red-600 hover:text-white bg-red-50 hover:bg-red-600 px-4 py-2.5 rounded-xl border border-red-200 hover:border-red-600 shadow-xs transition"
              title="Logout from RSAT Portal"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout RSAT Portal</span>
            </button>
          )}
        </div>

        {/* ========================================================= */}
        {/* 1. TOP HEADER & NOTIFICATION BELL SYSTEM                  */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative">
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-navy to-brand-navyLight text-brand-yellow flex items-center justify-center font-black text-2xl shadow-md border-2 border-brand-yellow/30">
              <Award className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-yellow/20 text-brand-navy border border-brand-yellow/40 text-xs font-black uppercase tracking-wider">
                  🏆 RSAT 2026 Scholarship Aspirant Portal
                </span>
                {feeStatus.isPaid ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>₹100 Fee Paid &bull; CBT Hall Active</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[11px] font-extrabold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-amber-700" />
                    <span>₹100 Fee Pending &bull; Exam Hall Locked</span>
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Welcome, {studentName}
              </h2>

              <p className="text-xs text-slate-500 font-semibold flex items-center gap-2">
                <span>Roll No: <strong>{feeStatus.rollNumber || user?.rsat?.rollNumber || `RSAT-2026-${studentMobile.slice(-4)}`}</strong></span>
                <span>&bull;</span>
                <span>Target: <strong>{studentStream}</strong> ({user?.targetClass || 'Class 11'})</span>
              </p>
            </div>
          </div>

          {/* Right Action Controls: Notification Bell + Switch to Classroom Portal */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            
            {/* NOTIFICATION BELL DROPDOWN */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  setUnreadNotifCount(0);
                }}
                className="relative p-3 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition shadow-xs flex items-center justify-center"
                title="RSAT Exam Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5 text-brand-navy" />
                {unreadNotifCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notification Popup Dropdown */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-3xl shadow-2xl border-2 border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-brand-navy" />
                      <h4 className="font-black text-sm text-slate-900">RSAT Alerts &amp; Updates</h4>
                    </div>
                    <button
                      onClick={() => setIsNotifOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div key={notif.id} className="py-3 px-2 hover:bg-slate-50 rounded-xl transition space-y-1">
                          <span className="font-extrabold text-xs text-slate-900 block">
                            {notif.title}
                          </span>
                          <p className="text-[11px] text-slate-600 leading-relaxed">
                            {notif.message}
                          </p>
                          <span className="text-[10px] text-slate-400 font-mono block">
                            {new Date(notif.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-400 font-semibold">
                        No new notifications right now.
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-center">
                    <span className="text-[11px] text-brand-navy font-bold">
                      Exam reminders will appear here automatically
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Switch to Regular Enrolled Student Portal */}
            <button
              onClick={onSwitchToEnrolledPortal}
              className="px-4 py-2.5 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black transition flex items-center gap-1.5 shadow-xs whitespace-nowrap"
              title="Switch to Classroom Batch Portal"
            >
              <span>Classroom Portal</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>

            {/* Logout RSAT */}
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3.5 py-2.5 rounded-2xl border-2 border-red-200 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white text-xs font-black transition flex items-center gap-1.5 shadow-xs whitespace-nowrap"
                title="Logout from RSAT Account"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}

          </div>

        </div>

        {/* Unpaid Gatekeeper Banner */}
        {!feeStatus.isPaid && (
          <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm animate-in fade-in">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black flex-shrink-0 shadow-xs">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900">
                  RSAT CBT Exam Hall is Locked &bull; ₹100 Registration Fee Required
                </h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  You can explore syllabus &amp; Kota formula handbooks below for free. To unlock the Computer-Based Test and qualify for up to 100% scholarship, complete the ₹100 fee.
                </p>
              </div>
            </div>
            <button
              onClick={onOpenPayment}
              className="px-5 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2 whitespace-nowrap self-end sm:self-center transform hover:scale-105 active:scale-95"
            >
              <Zap className="w-4 h-4 fill-brand-navy" />
              <span>Pay ₹100 to Unlock Hall</span>
            </button>
          </div>
        )}

        {/* ========================================================= */}
        {/* 2. NAVIGATION TABS                                        */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs font-black uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-3 rounded-2xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-brand-navy text-brand-yellow shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Slot &amp; Countdown</span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`px-5 py-3 rounded-2xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'materials'
                ? 'bg-brand-navy text-brand-yellow shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>RSAT Prep Material</span>
          </button>

          <button
            onClick={() => setActiveTab('slabs')}
            className={`px-5 py-3 rounded-2xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'slabs'
                ? 'bg-brand-navy text-brand-yellow shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>100% Scholarship Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('instructions')}
            className={`px-5 py-3 rounded-2xl transition whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'instructions'
                ? 'bg-brand-navy text-brand-yellow shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Test Guidelines</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* 3. TAB 1: OVERVIEW & COUNTDOWN TIMER HERO CARD            */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* HERO SLOT & COUNTDOWN CARD */}
            <div className="bg-gradient-to-br from-brand-navy via-[#0d183f] to-brand-navy text-white rounded-3xl p-6 sm:p-10 shadow-xl border-2 border-brand-yellow/30 relative overflow-hidden">
              
              {/* Background Glows */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-brand-yellow/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                
                {/* Left Side: Exam Details */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow text-xs font-black uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-brand-yellow animate-pulse" />
                    <span>RSAT Online Computer Based Test (CBT)</span>
                  </div>

                  <h3 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                    Your Scholarship Exam Slot is <span className="text-brand-yellow">Confirmed</span>
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-xl">
                    Appearing for this test qualifies you for <strong>up to 100% Tuition Fee Scholarship</strong>. You can begin the exam immediately or wait for your scheduled appointment.
                  </p>

                  {/* Scheduled Slot Details Pill */}
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/15 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-yellow text-brand-navy flex items-center justify-center font-black">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-300 uppercase font-bold block">Scheduled Date</span>
                        <span className="text-sm font-black text-white">{slotData?.date || 'Today / Flexible'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-300 uppercase font-bold block">Assigned Time Slot</span>
                        <span className="text-sm font-black text-white">{slotData?.timeSlot || 'Immediate Window'}</span>
                      </div>
                    </div>

                    <button
                      onClick={onOpenReschedule}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-brand-yellow border border-brand-yellow/40 text-xs font-bold transition"
                    >
                      Reschedule Slot
                    </button>
                  </div>

                </div>

                {/* Right Side: Live Countdown & Launch CTA */}
                <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 text-center space-y-5">
                  <span className="text-[11px] font-black uppercase text-brand-yellow tracking-widest block">
                    ⏳ Time Left Until Exam Slot
                  </span>

                  {/* 4 Unit Countdown Boxes */}
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-black/30 rounded-2xl p-2.5 border border-white/10">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                        {String(timeRemaining.days).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Days</span>
                    </div>

                    <div className="bg-black/30 rounded-2xl p-2.5 border border-white/10">
                      <span className="text-2xl sm:text-3xl font-black text-white font-mono block">
                        {String(timeRemaining.hours).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Hours</span>
                    </div>

                    <div className="bg-black/30 rounded-2xl p-2.5 border border-white/10">
                      <span className="text-2xl sm:text-3xl font-black text-brand-yellow font-mono block">
                        {String(timeRemaining.minutes).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Mins</span>
                    </div>

                    <div className="bg-black/30 rounded-2xl p-2.5 border border-white/10">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block">
                        {String(timeRemaining.seconds).padStart(2, '0')}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400">Secs</span>
                    </div>
                  </div>

                  {/* Main Launch Button */}
                  <div className="space-y-2 pt-2">
                    <button
                      type="button"
                      onClick={handleLaunchClick}
                      className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider shadow-2xl transition flex items-center justify-center gap-2 transform hover:scale-[1.03] active:scale-[0.97] ${
                        feeStatus.isPaid
                          ? 'bg-gradient-to-r from-brand-yellow via-[#ffcd1a] to-brand-yellow hover:from-[#e6a500] hover:to-[#e6a500] text-brand-navy'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      {feeStatus.isPaid ? (
                        <>
                          <Zap className="w-5 h-5 fill-brand-navy" />
                          <span>Launch RSAT CBT Exam Hall</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 text-white" />
                          <span>Pay ₹100 to Unlock CBT Exam Hall</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-slate-300 font-medium">
                      {feeStatus.isPaid
                        ? 'Exam fee verified. You can start now or anytime before your scheduled slot.'
                        : 'Gatekeeper active: ₹100 registration fee required before launching test hall.'}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* QUICK PREPARATION ROW */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-slate-900">100% Scholarship Rule</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Securing 90%+ in this 45-minute diagnostic test grants you a complete 100% Tuition Fee waiver on all 2026 batches.
                </p>
                <button
                  onClick={() => setActiveTab('slabs')}
                  className="text-xs font-black text-brand-navy hover:underline flex items-center gap-1"
                >
                  <span>View All Slabs Matrix</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-900 flex items-center justify-center font-black">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-slate-900">Diagnostic Sample Papers</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Download free RSAT sample papers and formula handbook curated by Senior Kota educators to boost your score.
                </p>
                <button
                  onClick={() => setActiveTab('materials')}
                  className="text-xs font-black text-brand-navy hover:underline flex items-center gap-1"
                >
                  <span>Open Prep Material</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 flex items-center justify-center font-black">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-black text-base text-slate-900">Anti-Cheating CBT Engine</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Auto-save on every question, window blur detection, and instant AI scorecard calculation upon exam submission.
                </p>
                <button
                  onClick={() => setActiveTab('instructions')}
                  className="text-xs font-black text-brand-navy hover:underline flex items-center gap-1"
                >
                  <span>Read Exam Instructions</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* 4. TAB 2: RSAT STUDY MATERIALS HUB                        */}
        {/* ========================================================= */}
        {activeTab === 'materials' && (
          <div className="space-y-6 animate-in fade-in">
            
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              
              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto no-scrollbar">
                {['ALL', 'Physics', 'Chemistry', 'Biology', 'Mathematics'].map(subj => (
                  <button
                    key={subj}
                    onClick={() => setMaterialFilter(subj)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      materialFilter === subj
                        ? 'bg-brand-navy text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {subj}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search RSAT sample papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

            </div>

            {/* Materials Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMaterials.map(mat => (
                <div
                  key={mat.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs hover:border-brand-yellow/80 hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow/20 text-brand-navy font-black text-[10px] uppercase tracking-wider">
                        {mat.category || 'PDF'}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {mat.fileSize || '3.5 MB'} &bull; {mat.downloadCount || 1000}+ Downloads
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                      {mat.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {mat.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                      Free for RSAT Aspirants
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDownloadMaterial(mat)}
                      className="px-4 py-2 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center gap-1.5 shadow-xs"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* 5. TAB 3: 100% SCHOLARSHIP SLABS MATRIX                  */}
        {/* ========================================================= */}
        {activeTab === 'slabs' && (
          <div className="space-y-6 animate-in fade-in">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-900 bg-brand-yellow/30 px-2.5 py-0.5 rounded">
                Official Scholarship Policy
              </span>
              <h3 className="text-2xl font-black text-slate-900">
                RSAT 2026-27 Merit Scholarship Matrix
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
                Scholarships are applicable directly against classroom coaching tuition fees at Rankers Path Indore Campus (Vijay Nagar).
              </p>
            </div>

            {/* Slabs Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SCHOLARSHIP_SLABS.map(slab => (
                <div
                  key={slab.range}
                  className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-xs flex flex-col justify-between space-y-4 hover:border-brand-navy transition"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${slab.badgeBg}`}>
                        Score: {slab.range}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xl font-black text-slate-900">
                        {slab.percentage}
                      </h4>
                      <span className="text-xs font-bold text-emerald-600">
                        {slab.amountSaved}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 font-medium">
                      Recommended: <strong>{slab.batch}</strong>
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                    <span>Applicable for 1 &amp; 2 Year Batches</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ========================================================= */}
        {/* 6. TAB 4: TEST GUIDELINES & ANTI-CHEATING RULES           */}
        {/* ========================================================= */}
        {activeTab === 'instructions' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6 animate-in fade-in">
            <div>
              <span className="text-[10px] font-black uppercase text-brand-navy bg-brand-yellow/30 px-2.5 py-0.5 rounded">
                Instructions for RSAT CBT
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                Candidate Examination Protocol
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 font-semibold leading-relaxed">
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-brand-navy" />
                  <span>Exam Duration &amp; Marking Scheme</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Total Test Duration: <strong>45 Minutes</strong>.</li>
                  <li>Total Questions: <strong>30 Multiple Choice Questions (MCQ)</strong>.</li>
                  <li>Correct Answer: <strong>+4 Marks</strong>.</li>
                  <li>Incorrect Answer: <strong>-1 Mark (Negative Marking)</strong>.</li>
                  <li>Unattempted Question: <strong>0 Marks</strong>.</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Proctoring &amp; Auto-Submit Rules</span>
                </h4>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  <li>Do not switch browser tabs or minimize the test window.</li>
                  <li>Each answer is saved automatically to the cloud in real-time.</li>
                  <li>When the 45-minute timer hits 00:00, the test will submit automatically.</li>
                  <li>Your scorecard and scholarship certificate will be issued immediately upon submission.</li>
                </ul>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                Need technical assistance? Call Helpline: <strong>9131435511</strong>
              </span>

              <button
                type="button"
                onClick={onLaunchExam}
                className="px-6 py-3.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center gap-2"
              >
                <span>Launch Exam Hall Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
