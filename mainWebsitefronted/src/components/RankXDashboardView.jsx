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
  CreditCard,
  Printer,
  QrCode,
  Lock,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { api } from '../services/api';

const RANKEX_SUBJECTS = [
  { name: 'Physics', questions: 10, marks: 40, icon: '⚡', color: 'from-amber-500 to-yellow-500' },
  { name: 'Chemistry', questions: 10, marks: 40, icon: '🧪', color: 'from-emerald-500 to-teal-500' },
  { name: 'Mathematics / Biology', questions: 10, marks: 40, icon: '📐', color: 'from-blue-500 to-cyan-500' },
  { name: 'Mental Ability & Aptitude', questions: 10, marks: 40, icon: '🧠', color: 'from-purple-500 to-indigo-500' }
];

const DEFAULT_RANKEX_MATERIALS = [
  {
    id: 'mat-rankx-001',
    title: 'RANKEX 2027 Official All-India Diagnostic Question Paper (PCM / PCB + Aptitude)',
    category: 'PYQ',
    subject: 'General',
    fileSize: '3.8 MB',
    downloadCount: 5120,
    description: 'Official 40-question sample test matching the exact 160-mark RANKEX exam pattern and Kota marking scheme (+4, -1).'
  },
  {
    id: 'mat-rankx-002',
    title: 'RANKEX Kota Master Formula & Shortcut Handbook 2027',
    category: 'PDF',
    subject: 'Physics',
    fileSize: '5.6 MB',
    downloadCount: 4890,
    description: 'Comprehensive formula cheat sheet covering high-weightage topics in Physics, Physical Chemistry & Calculus/Mechanics.'
  },
  {
    id: 'mat-rankx-003',
    title: 'Mental Ability & Logical Reasoning High-Yield Guide for Talent Exams',
    category: 'NOTES',
    subject: 'Aptitude',
    fileSize: '3.1 MB',
    downloadCount: 3950,
    description: 'Verbal, non-verbal reasoning and series completion questions designed to secure full 40/40 marks in the Aptitude section.'
  },
  {
    id: 'mat-rankx-004',
    title: 'RANKEX 90% Scholarship Qualifying Mock Test Paper 02 (With Step-by-Step Solutions)',
    category: 'PDF',
    subject: 'Chemistry',
    fileSize: '4.5 MB',
    downloadCount: 3410,
    description: 'Designed by senior faculty to test concept clarity and speed for Super-30 batch direct admission.'
  }
];

const TIME_SLOT_OPTIONS = [
  'Flexible 60-Mins Online CBT Window',
  '10:00 AM – 11:30 AM (Morning Batch)',
  '02:00 PM – 03:30 PM (Afternoon Batch)',
  '06:00 PM – 07:30 PM (Evening Batch)'
];

export default function RankXDashboardView({
  user,
  onLaunchExam,
  onOpenPayment,
  onSwitchToRsatPortal,
  onSwitchToEnrolledPortal,
  onBackToHome,
  onLogout
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'materials', 'syllabus', 'admit-card'
  const [regData, setRegData] = useState(null);
  const [isPaid, setIsPaid] = useState(false);
  const [slotData, setSlotData] = useState(null);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleSlot, setRescheduleSlot] = useState(TIME_SLOT_OPTIONS[0]);
  const [rescheduling, setRescheduling] = useState(false);
  const [paymentWarningModalOpen, setPaymentWarningModalOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifCount, setUnreadNotifCount] = useState(2);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [materials, setMaterials] = useState(DEFAULT_RANKEX_MATERIALS);
  const [materialFilter, setMaterialFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const studentMobile = user?.mobile || '9826222222';
  const studentName = user?.fullName || 'RANKEX Aspirant';
  const studentStream = user?.targetStream || 'IIT-JEE';

  // Load registration and payment status
  useEffect(() => {
    // 1. Check local slot
    const localSlot = localStorage.getItem(`rp_rankx_slot_${studentMobile}`);
    if (localSlot) {
      try {
        const parsed = JSON.parse(localSlot);
        setSlotData(parsed);
        setRescheduleDate(parsed.date || 'Sunday, 18 October 2026');
        setRescheduleSlot(parsed.timeSlot || TIME_SLOT_OPTIONS[0]);
      } catch (e) {}
    } else {
      const defaultSlot = {
        date: 'Sunday, 18 October 2026',
        timeSlot: TIME_SLOT_OPTIONS[0],
        mode: 'ONLINE'
      };
      setSlotData(defaultSlot);
      setRescheduleDate(defaultSlot.date);
      setRescheduleSlot(defaultSlot.timeSlot);
    }

    // 2. Fetch RankX Registration from backend
    api.getMyRankX().then(res => {
      if (res.data) {
        setRegData(res.data);
        const paidStatus = res.data.paymentStatus === 'PAID' || res.data.paymentStatus === 'PAID_OR_WAIVED' || (res.data.feePaid >= 100);
        setIsPaid(paidStatus);
        if (res.data.examDate) {
          setSlotData(prev => ({
            ...prev,
            date: res.data.examDate,
            timeSlot: res.data.examTiming || prev?.timeSlot
          }));
          setRescheduleDate(res.data.examDate);
        }
      }
    });

    // 3. Check fee status via API
    api.checkRankXStatus(studentMobile).then(res => {
      if (res.data?.isPaid) {
        setIsPaid(true);
      }
      if (res.data?.registration) {
        setRegData(res.data.registration);
      }
    });

    // 4. Fetch Notifications
    api.getRankXNotifications(studentMobile).then(res => {
      if (res.data?.notifications) {
        setNotifications(res.data.notifications);
        const unread = res.data.notifications.filter(n => n.unread).length;
        setUnreadNotifCount(unread || 2);
      }
    });
  }, [studentMobile]);

  // Handle Reschedule Slot
  const handleSaveReschedule = async () => {
    setRescheduling(true);
    try {
      const res = await api.scheduleRankXSlot({
        mobile: studentMobile,
        studentId: user?.id,
        scheduledDate: rescheduleDate,
        scheduledTimeSlot: rescheduleSlot,
        examMode: regData?.examMode || 'ONLINE',
        centreId: regData?.centreId || 'centre-vijay-nagar'
      });

      const updatedSlot = {
        date: rescheduleDate,
        timeSlot: rescheduleSlot,
        mode: regData?.examMode || 'ONLINE',
        scheduledAt: new Date().toISOString()
      };
      setSlotData(updatedSlot);
      localStorage.setItem(`rp_rankx_slot_${studentMobile}`, JSON.stringify(updatedSlot));
      setRescheduleModalOpen(false);
      alert(`Your RANKEX test slot has been updated to: ${rescheduleDate} (${rescheduleSlot})`);
    } catch (err) {
      alert('Error updating slot. Saved locally.');
      setRescheduleModalOpen(false);
    } finally {
      setRescheduling(false);
    }
  };

  // Launch Exam with Payment Gatekeeper Check
  const handleAttemptExamClick = () => {
    if (!isPaid) {
      setPaymentWarningModalOpen(true);
      return;
    }
    if (onLaunchExam) {
      onLaunchExam('test-rankex-2027-class11');
    }
  };

  const handleDownloadMaterial = (mat) => {
    const dummyText = `=====================================================
RANKERS PATH INDORE - RANKEX 2027 SCHOLARSHIP PORTAL
Material: ${mat.title}
Subject: ${mat.subject} | Category: ${mat.category}
=====================================================

Thank you for downloading the official RANKEX preparation material.
For any questions, contact our Academic Counselling Cell:
📞 Phone: 9131435511 / 9826123456
📍 Vijay Nagar Main Campus, Indore (MP)`;

    const blob = new Blob([dummyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mat.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const filteredMaterials = materials.filter(m => {
    const matchesFilter = materialFilter === 'ALL' || m.category === materialFilter;
    const matchesSearch = searchQuery === '' ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-20 pb-16 font-sans">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            
            {/* Left: Branding & Candidate Profile */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy font-black text-[11px] uppercase tracking-wider">
                  RANKEX 2027 CANDIDATE PORTAL
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold text-[11px] border border-slate-700">
                  Roll No: <strong className="text-white font-mono">{regData?.rollNumber || 'RPX-2027-AWAITING'}</strong>
                </span>
                {isPaid ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px] border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> ₹100 Fee Paid ✓
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/30 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Fee Pending (₹100)
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                Welcome, {studentName}
              </h1>
              <p className="text-xs text-slate-400">
                Target: <strong className="text-white">{studentStream}</strong> &bull; Class: <strong className="text-white">{regData?.targetClass || user?.targetClass || 'Class 11'}</strong> &bull; Mode: <strong className="text-white">{regData?.examMode || 'Online CBT'}</strong>
              </p>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition relative"
                  title="RANKEX Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadNotifCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-black flex items-center justify-center">
                      {unreadNotifCount}
                    </span>
                  )}
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 text-slate-900 p-4 z-50 animate-in fade-in">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-extrabold uppercase text-slate-700">RANKEX Alerts ({notifications.length})</span>
                      <button onClick={() => setIsNotifOpen(false)} className="text-slate-400 hover:text-slate-700">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto mt-2 space-y-2">
                      {notifications.map(n => (
                        <div key={n.id} className="pt-2 text-left">
                          <p className="text-xs font-extrabold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-600 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 block mt-1">
                            {new Date(n.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Back to Home */}
              <button
                onClick={onBackToHome}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </button>

              {/* Logout RANKEX */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold border border-red-800/60 hover:border-red-600 transition flex items-center gap-1.5 shadow-xs"
                  title="Logout from RANKEX Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-6 overflow-x-auto border-t border-slate-800 pt-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'bg-brand-yellow text-brand-navy shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Exam Overview &amp; Slot</span>
            </button>

            <button
              onClick={() => setActiveTab('syllabus')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'syllabus'
                  ? 'bg-brand-yellow text-brand-navy shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>Exam Pattern (160 Marks)</span>
            </button>

            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'materials'
                  ? 'bg-brand-yellow text-brand-navy shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Study Materials &amp; Mock Tests</span>
            </button>

            <button
              onClick={() => setActiveTab('admit-card')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'admit-card'
                  ? 'bg-brand-yellow text-brand-navy shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Official Admit Card</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* ======================================================== */}
        {/* TAB 1: OVERVIEW & SLOT MANAGEMENT                        */}
        {/* ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Slot Card & Exam Launch Banner */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                
                {/* Left 2 Cols: Slot Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                      RANKEX 2027 Online Examination Window
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-slate-900">
                    Scheduled Test Date: <span className="text-brand-navy underline decoration-brand-yellow decoration-4">{slotData?.date || 'Sunday, 18 October 2026'}</span>
                  </h2>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl font-bold">
                      <Clock className="w-4 h-4 text-slate-500" />
                      <span>{slotData?.timeSlot || TIME_SLOT_OPTIONS[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl font-bold">
                      <Target className="w-4 h-4 text-slate-500" />
                      <span>160 Marks &bull; 40 Questions &bull; 60 Mins</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-xl font-bold">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>All-India Online CBT (Proctored)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    You can attempt the test immediately or keep your scheduled slot. You can also <strong>reschedule your slot anytime</strong> before starting the test.
                  </p>

                  {/* Reschedule Button */}
                  <div className="pt-2">
                    <button
                      onClick={() => setRescheduleModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-extrabold transition flex items-center gap-2 border border-slate-300"
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
                      <span>Reschedule Date / Timing Slot</span>
                    </button>
                  </div>
                </div>

                {/* Right Col: Primary Call To Action */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center space-y-4 shadow-lg">
                  <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center mx-auto">
                    <Zap className="w-6 h-6" />
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-white">
                      Online CBT Exam Hall
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      {isPaid ? 'Your test portal is unlocked! You can start right now.' : '₹100 Registration fee required to start exam.'}
                    </p>
                  </div>

                  <button
                    onClick={handleAttemptExamClick}
                    className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-md transform hover:scale-102 active:scale-98 ${
                      isPaid
                        ? 'bg-brand-yellow hover:bg-[#e6a500] text-brand-navy'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <span>{isPaid ? 'Start CBT Exam Hall 🚀' : 'Pay ₹100 & Enter Hall 💳'}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('materials')}
                    className="text-[11px] font-bold text-slate-400 hover:text-white underline block mx-auto transition"
                  >
                    Want to study first? Browse Mock Papers &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Total Marks</span>
                <p className="text-2xl font-black text-slate-900">160 Marks</p>
                <span className="text-xs text-slate-500 font-medium">40 Objective Questions</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Duration</span>
                <p className="text-2xl font-black text-slate-900">60 Minutes</p>
                <span className="text-xs text-slate-500 font-medium">1 Hour Continuous CBT</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Marking Scheme</span>
                <p className="text-2xl font-black text-emerald-600">+4 / -1</p>
                <span className="text-xs text-slate-500 font-medium">+4 Correct, -1 Negative</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Max Scholarship</span>
                <p className="text-2xl font-black text-amber-500">100% Waiver</p>
                <span className="text-xs text-slate-500 font-medium">Direct Super-30 Admission</span>
              </div>
            </div>

            {/* Four Subject Pills */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-slate-900">
                RANKEX 2027 Section Breakdown
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {RANKEX_SUBJECTS.map((sub, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{sub.icon}</span>
                      <span className="text-[10px] font-black uppercase bg-white px-2 py-0.5 rounded-full border border-slate-200 text-slate-700">
                        {sub.questions} Qs &bull; {sub.marks} Marks
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{sub.name}</h4>
                    <p className="text-[11px] text-slate-500">Concept application, formula mastery &amp; logical reasoning.</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: SYLLABUS & PATTERN DETAILS                        */}
        {/* ======================================================== */}
        {activeTab === 'syllabus' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                Official Examination Pattern
              </span>
              <h2 className="text-2xl font-black text-slate-900">
                RANKEX 2027 Comprehensive Syllabus &amp; Subject Weightage
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Specially curated by Kota Senior Faculty to assess aptitude, analytical reasoning and foundational concepts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>⚡ Physics (10 Questions &bull; 40 Marks)</span>
                </h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Kinematics, Laws of Motion &amp; Work-Energy-Power</li>
                  <li>Gravitation, Fluid Mechanics &amp; Properties of Matter</li>
                  <li>Thermodynamics, Heat Transfer &amp; Kinetic Theory</li>
                  <li>Electrostatics, Current Electricity &amp; Magnetism basics</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>🧪 Chemistry (10 Questions &bull; 40 Marks)</span>
                </h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Atomic Structure &amp; Periodic Classification</li>
                  <li>Chemical Bonding &amp; Molecular Structure</li>
                  <li>Basic Concepts of Chemistry (Mole Concept &amp; Stoichiometry)</li>
                  <li>General Organic Chemistry (GOC) &amp; Nomenclature</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>📐 Mathematics / Biology (10 Questions &bull; 40 Marks)</span>
                </h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li><strong>For JEE:</strong> Quadratic Equations, Sequences &amp; Series, Trigonometry &amp; Coordinate Geometry.</li>
                  <li><strong>For NEET:</strong> Cell Biology, Genetics &amp; Evolution, Human Physiology &amp; Plant Morphology.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span>🧠 Mental Ability &amp; Aptitude (10 Questions &bull; 40 Marks)</span>
                </h3>
                <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                  <li>Number Series, Letter Coding &amp; Decoding</li>
                  <li>Blood Relations, Direction Sense &amp; Venn Diagrams</li>
                  <li>Data Interpretation &amp; Mathematical Puzzles</li>
                  <li>Pattern recognition &amp; Non-verbal spatial reasoning</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: STUDY MATERIALS & MOCK PAPERS                      */}
        {/* ======================================================== */}
        {activeTab === 'materials' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                    High-Yield Preparation Desk
                  </span>
                  <h2 className="text-2xl font-black text-slate-900">
                    RANKEX 2027 Sample Mock Papers &amp; Handbooks
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  {['ALL', 'PDF', 'PYQ', 'NOTES'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setMaterialFilter(cat)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                        materialFilter === cat
                          ? 'bg-brand-navy text-brand-yellow font-black'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Materials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {filteredMaterials.map(mat => (
                  <div key={mat.id} className="p-5 rounded-2xl border border-slate-200 hover:border-brand-yellow/60 transition bg-slate-50/50 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-yellow/20 text-brand-navy flex items-center justify-center font-bold text-xs flex-shrink-0">
                        <FileText className="w-5 h-5 text-brand-navy" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          {mat.subject} &bull; {mat.category}
                        </span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 mt-1 leading-snug">
                          {mat.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      {mat.description}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-xs text-slate-500">
                      <span>Size: {mat.fileSize} &bull; {mat.downloadCount} Aspirants</span>
                      <button
                        onClick={() => handleDownloadMaterial(mat)}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-yellow text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: OFFICIAL ADMIT CARD                               */}
        {/* ======================================================== */}
        {activeTab === 'admit-card' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-slate-400">Hall Ticket</span>
                <h3 className="text-xl font-black text-slate-900">RANKEX 2027 Official Admit Card</h3>
              </div>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-brand-yellow text-xs font-extrabold flex items-center gap-2 transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print Admit Card</span>
              </button>
            </div>

            <div className="p-6 rounded-2xl border-2 border-slate-900 space-y-6 bg-slate-50/30">
              <div className="flex items-center justify-between border-b border-slate-300 pb-4">
                <div>
                  <h4 className="text-lg font-black text-slate-900">RANKERS PATH INDORE</h4>
                  <p className="text-xs text-slate-600">All-India Talent Search &amp; Scholarship Entrance Examination</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-slate-700">Roll No: {regData?.rollNumber || 'RPX-2027-0042'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Candidate Name</span>
                  <p className="font-extrabold text-slate-900 text-sm">{studentName}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Mobile Number</span>
                  <p className="font-extrabold text-slate-900 text-sm">{studentMobile}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Target Stream &amp; Class</span>
                  <p className="font-extrabold text-slate-900 text-sm">{studentStream} &bull; {regData?.targetClass || 'Class 11'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Examination Date</span>
                  <p className="font-extrabold text-slate-900 text-sm">{slotData?.date || 'Sunday, 18 October 2026'}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Exam Timing Window</span>
                  <p className="font-extrabold text-slate-900 text-sm">{slotData?.timeSlot || TIME_SLOT_OPTIONS[0]}</p>
                </div>
                <div>
                  <span className="text-slate-400 font-bold uppercase text-[10px]">Exam Hall Location</span>
                  <p className="font-extrabold text-slate-900 text-sm">{regData?.centreName || 'Rankers Online CBT Examination Hall'}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Instructions for Candidate:</strong> Please login 15 minutes before the test window. Keep your paper &amp; pen ready for rough calculations. Ensure continuous internet connectivity during the 60-minute duration.
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ======================================================== */}
      {/* MODAL 1: RESCHEDULE SLOT MODAL                           */}
      {/* ======================================================== */}
      {rescheduleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-brand-navy" />
                <h3 className="text-base font-extrabold text-slate-900">Reschedule Test Slot</h3>
              </div>
              <button onClick={() => setRescheduleModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select New Test Date</label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Select Time Window</label>
                <select
                  value={rescheduleSlot}
                  onChange={(e) => setRescheduleSlot(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                >
                  {TIME_SLOT_OPTIONS.map((slot, i) => (
                    <option key={i} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 text-[11px]">
                ℹ️ You can reschedule as many times as needed to ensure you are well-prepared before sitting for the exam.
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setRescheduleModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={rescheduling}
                onClick={handleSaveReschedule}
                className="flex-1 py-2.5 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider transition shadow-sm"
              >
                {rescheduling ? 'Saving...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: PAYMENT REQUIRED GATEKEEPER MODAL               */}
      {/* ======================================================== */}
      {paymentWarningModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-amber-200 animate-in zoom-in-95 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-black text-slate-900">
                ₹100 Registration Fee Required
              </h3>
              <p className="text-xs text-slate-600">
                To unlock and enter the <strong>RANKEX 2027 Online CBT Exam Hall</strong>, please complete the ₹100 registration fee.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-1">
              <p className="font-bold text-slate-800">Why ₹100 Fee?</p>
              <ul className="text-slate-600 text-[11px] list-disc list-inside space-y-0.5">
                <li>100% adjustable against your classroom course fee on admission.</li>
                <li>Generates official verified Admit Card &amp; All-India Rank.</li>
                <li>Qualifies you for up to 100% Tuition Fee Scholarship.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setPaymentWarningModalOpen(false);
                  if (onOpenPayment) onOpenPayment();
                }}
                className="w-full py-3.5 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                <span>Pay ₹100 via Cashfree PG &rarr;</span>
              </button>

              <button
                onClick={() => {
                  setPaymentWarningModalOpen(false);
                  setRescheduleModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl text-slate-600 hover:text-slate-900 font-bold text-xs"
              >
                Reschedule Slot to Study Later
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
