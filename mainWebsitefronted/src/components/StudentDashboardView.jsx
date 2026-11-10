import React, { useState, useEffect } from 'react';
import {
  User,
  Award,
  BookOpen,
  Clock,
  FileText,
  Download,
  CheckCircle2,
  ChevronRight,
  Zap,
  Target,
  Layers,
  Play,
  CheckCircle,
  Radio,
  Video,
  Film,
  FolderOpen,
  Search,
  ExternalLink,
  Calendar,
  Sparkles,
  Share2,
  FileSpreadsheet,
  AlertCircle,
  Home,
  Lock,
  Tv,
  CalendarCheck2,
  Fingerprint,
  Building,
  XCircle,
  LogOut
} from 'lucide-react';
import { api } from '../services/api';
import JitsiLiveModal from './JitsiLiveModal';

const MATERIAL_CATEGORIES = [
  { key: 'ALL', label: 'All Documents' },
  { key: 'PDF', label: 'PDF Handbooks' },
  { key: 'NOTES', label: 'Class Notes' },
  { key: 'PYQ', label: 'PYQ Banks' },
  { key: 'SHEET', label: 'DPP Sheets' },
  { key: 'IMAGE', label: 'Charts / Maps' },
  { key: 'FORM', label: 'Official Forms' }
];

const SUBJECTS_LIST = ['ALL', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];
const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function StudentDashboardView({ user, onOpenRankX, onOpenRSAT, onOpenRsatPortal, onBackToHome, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'materials', 'live', 'recorded'
  const [rankXData, setRankXData] = useState(null);

  // 1. CBT Tests State
  const [batchTests, setBatchTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(false);
  const [streamFilter, setStreamFilter] = useState(user?.targetStream || 'ALL');
  const [cbtSubjectFilter, setCbtSubjectFilter] = useState('ALL');

  // 2. Study Material State
  const [materials, setMaterials] = useState([]);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [materialCategory, setMaterialCategory] = useState('ALL');
  const [materialSubject, setMaterialSubject] = useState('ALL');
  const [materialSearch, setMaterialSearch] = useState('');

  // 3. Live Classes State
  const [liveClasses, setLiveClasses] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [loadingLive, setLoadingLive] = useState(false);
  const [activeJitsiClass, setActiveJitsiClass] = useState(null);
  const [isJitsiOpen, setIsJitsiOpen] = useState(false);

  const userStreamRaw = (user?.targetStream || user?.stream || '').toUpperCase();
  const userClassRaw = (user?.targetClass || user?.classLevel || '').toUpperCase();
  const isFoundation = userStreamRaw.includes('FOUNDATION') || userStreamRaw.includes('PNCF') || userClassRaw.includes('9') || userClassRaw.includes('10');
  const isJee = !isFoundation && (userStreamRaw.includes('JEE') || userStreamRaw.includes('IIT'));
  const studentStream = isFoundation ? 'FOUNDATION' : (isJee ? 'JEE' : 'NEET');
  const studentBatchTier = user?.batchTier || (isFoundation ? 'SUPER_30' : (isJee ? 'DIAMOND' : 'PLATINUM'));
  const isEnrolled = Boolean(user?.isEnrolled || user?.studentId);
  const streamSubjects = isFoundation
    ? ['ALL', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Mental Ability (MAT)']
    : (isJee ? ['ALL', 'Mathematics', 'Physics', 'Chemistry'] : ['ALL', 'Biology', 'Physics', 'Chemistry']);

  // 4. Recorded Lectures State
  const [recordedLectures, setRecordedLectures] = useState([]);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(isFoundation ? 'Physics' : (isJee ? 'Mathematics' : 'Biology'));
  const [activeLecture, setActiveLecture] = useState(null);

  // 5. Biometric Attendance State
  const [attendanceStats, setAttendanceStats] = useState(null);

  useEffect(() => {
    // Fetch RankX admit data
    api.getMyRankX().then(res => {
      if (res.data) setRankXData(res.data);
    });

    // Fetch Batch Tests
    fetchTests(studentStream);

    // Fetch Study Materials
    fetchStudyMaterials();

    // Fetch Live Classes & Timetable
    fetchLiveAndTimetable();

    // Fetch Recorded Lectures
    fetchRecordedLectures();

    // Fetch Biometric Attendance
    api.getStudentAttendance(user?.id || 'student-dev-1').then(res => {
      if (res && res.data) setAttendanceStats(res.data);
    }).catch(err => console.warn('Could not fetch attendance stats:', err));
  }, [user]);

  const fetchTests = async (stream) => {
    setLoadingTests(true);
    const targetStream = stream || studentStream;
    const res = await api.getAvailableExams({
      category: 'STUDENT_TEST_SERIES',
      stream: targetStream
    });
    setLoadingTests(false);
    if (res.data) setBatchTests(res.data);
  };

  const fetchStudyMaterials = async () => {
    setLoadingMaterials(true);
    const res = await api.getStudyMaterials({
      category: materialCategory,
      subject: materialSubject,
      stream: studentStream,
      search: materialSearch
    });
    setLoadingMaterials(false);
    if (res.data) setMaterials(res.data);
  };

  useEffect(() => {
    fetchStudyMaterials();
  }, [materialCategory, materialSubject]);

  const fetchLiveAndTimetable = async () => {
    setLoadingLive(true);
    const [lRes, tRes] = await Promise.all([
      api.getLiveClasses({ stream: studentStream, month: '2026-10' }),
      api.getTimetable({ stream: studentStream })
    ]);
    setLoadingLive(false);
    if (lRes.data) setLiveClasses(lRes.data);
    if (tRes.data) setTimetable(tRes.data);
  };

  const fetchRecordedLectures = async () => {
    setLoadingLectures(true);
    const res = await api.getRecordedLectures({ stream: studentStream });
    setLoadingLectures(false);
    if (res.data) {
      setRecordedLectures(res.data);
      if (res.data.length > 0 && !activeLecture) {
        // default to first lecture of current subject
        const firstMatch = res.data.find(l => l.subject.toLowerCase() === selectedSubject.toLowerCase()) || res.data[0];
        setActiveLecture(firstMatch);
      }
    }
  };

  const handleLaunchJitsi = (cls) => {
    setActiveJitsiClass(cls);
    setIsJitsiOpen(true);
  };

  const handleDownloadMaterial = (m) => {
    api.trackMaterialDownload(m.id);
    window.open(m.fileUrl, '_blank');
  };

  // Filter lectures for selected subject tab
  const filteredLectures = recordedLectures.filter(
    l => l.subject.toLowerCase() === selectedSubject.toLowerCase()
  );

  const activeLiveClassNow = liveClasses.find(c => c.status === 'LIVE');

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6 animate-in fade-in">
      
      {/* Top Navigation & Account Bar */}
      <div className="flex items-center justify-between gap-3">
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
            className="inline-flex items-center gap-2 text-xs font-black text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 px-4 py-2.5 rounded-xl border border-rose-200 hover:border-rose-600 shadow-xs transition"
            title="Logout from Account"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout Account</span>
          </button>
        )}
      </div>

      {/* Student Profile Hero Card */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-navyCard to-brand-navy text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-yellow/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-brand-yellow text-brand-navy flex items-center justify-center font-black text-2xl shadow-inner flex-shrink-0">
            {user?.fullName?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              {user?.studentId && (
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 font-mono font-black text-[10px] tracking-wider shadow-xs">
                  ID: {user.studentId}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy font-black text-[10px] uppercase tracking-wider">
                {user?.isEnrolled || user?.studentId ? 'Enrolled Student' : 'Applicant Portal'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-black text-[10px] uppercase tracking-wider border border-white/20 flex items-center gap-1">
                {studentBatchTier === 'DIAMOND' ? '💎 Diamond Batch (Super 30)' :
                 studentBatchTier === 'PLATINUM' ? '🌟 Platinum Batch (Achievers)' :
                 studentBatchTier === 'SILVER' ? '🥈 Silver Batch (Leaders)' :
                 '🟢 Green Batch (Foundation)'}
              </span>
              <span className="text-xs text-slate-300 font-semibold">+91-{user?.mobile}</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-brand-yellow text-[10px] font-bold">
                Batch: {user?.targetClass || 'Class 12'} Leader {studentStream}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1.5">
              Welcome back, {user?.fullName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Target Stream: <strong className="text-brand-yellow">{studentStream}</strong> &bull; Live Jitsi Classes, Study Material &amp; YouTube LMS Active
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {activeLiveClassNow && (
            <button
              onClick={() => handleLaunchJitsi(activeLiveClassNow)}
              className="px-5 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center gap-2 animate-bounce"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Join Class Now</span>
            </button>
          )}

          {onOpenRsatPortal && (
            <button
              onClick={onOpenRsatPortal}
              className="px-4 py-3 bg-white/10 hover:bg-white/20 text-brand-yellow border border-brand-yellow/40 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
              title="Open RSAT Scholarship Portal"
            >
              <Award className="w-4 h-4 text-brand-yellow" />
              <span>RSAT Portal</span>
            </button>
          )}

          <button
            onClick={() => onOpenRSAT(batchTests[0]?.id || null)}
            className="px-5 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-xl font-extrabold text-sm shadow transition flex items-center gap-2 transform hover:scale-105 active:scale-95"
          >
            <Zap className="w-4 h-4 text-brand-navy" />
            <span>Launch Batch CBT</span>
          </button>
        </div>
      </div>

      {/* Non-Enrolled Notice Banner */}
      {!isEnrolled && (
        <div className="bg-gradient-to-r from-amber-500/15 via-brand-yellow/20 to-amber-500/15 border-2 border-brand-yellow/50 rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-sm animate-in fade-in">
          <div className="w-12 h-12 rounded-2xl bg-brand-yellow text-brand-navy flex items-center justify-center mx-auto shadow">
            <Lock className="w-6 h-6" />
          </div>
          <div className="max-w-xl mx-auto space-y-1.5">
            <h3 className="text-xl font-black text-brand-navy">
              Classroom Academic Calendar &amp; Live Portal (Enrolled Students Only)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Full classroom calendars, Google Classroom ("जीसी") live lecture links, daily chapter tracking, and study materials are exclusively available to confirmed enrolled students of Rankers Path Indore.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {onOpenRsatPortal && (
              <button
                onClick={onOpenRsatPortal}
                className="px-5 py-2.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl font-black text-xs uppercase tracking-wider shadow transition flex items-center gap-2"
              >
                <Award className="w-4 h-4 text-brand-yellow" />
                <span>Go to RSAT / RANKEX Exam Portal</span>
              </button>
            )}
            <button
              onClick={() => {
                localStorage.removeItem('rp_token');
                localStorage.removeItem('rp_user');
                window.location.reload();
              }}
              className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider transition"
            >
              Sign in with Student ID (Rankers@XXXX)
            </button>
          </div>
        </div>
      )}

      {/* 4 Interactive Dashboard Navigation Tabs */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200 shadow-sm flex items-center justify-start overflow-x-auto gap-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-brand-navy text-brand-yellow shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>CBT Mocks &amp; Tests</span>
        </button>

        <button
          onClick={() => setActiveTab('materials')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition whitespace-nowrap ${
            activeTab === 'materials'
              ? 'bg-brand-navy text-brand-yellow shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Study Material Hub</span>
          <span className="px-1.5 py-0.2 rounded-full bg-brand-yellow/20 text-brand-navy text-[10px] font-extrabold">
            {materials.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('live')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition whitespace-nowrap ${
            activeTab === 'live'
              ? 'bg-brand-navy text-brand-yellow shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <CalendarCheck2 className={`w-4 h-4 ${activeLiveClassNow ? 'text-rose-500 animate-pulse' : ''}`} />
          <span>Class Calendar &amp; Timetable</span>
          {activeLiveClassNow && (
            <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black uppercase">
              LIVE
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('recorded')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition whitespace-nowrap ${
            activeTab === 'recorded'
              ? 'bg-brand-navy text-brand-yellow shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Film className="w-4 h-4 text-red-500" />
          <span>Recorded Lectures (YT)</span>
          <span className="px-1.5 py-0.2 rounded-full bg-red-100 text-red-700 text-[10px] font-extrabold">
            LMS
          </span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'bg-brand-navy text-brand-yellow shadow-md'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Fingerprint className="w-4 h-4 text-emerald-400" />
          <span>Biometric Attendance</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-extrabold">
            {attendanceStats ? `${attendanceStats.attendancePercentage}%` : '96%'}
          </span>
        </button>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: OVERVIEW & CBT MOCK TESTS */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Enrolled Batch</span>
                <h4 className="text-xl font-extrabold text-brand-navy mt-1">
                  Target {studentStream} 2026-27
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  NTA &amp; IIT-JEE Pattern Aligned
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-brand-yellowDark flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">CBT Mocks Available</span>
                <h4 className="text-xl font-extrabold text-brand-navy mt-1">
                  {batchTests.length} Scheduled Exams
                </h4>
                <p className="text-xs text-emerald-600 font-bold mt-0.5">
                  Full Syllabus &amp; Part Tests
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase">Offline Test Hall</span>
                <h4 className="text-xl font-extrabold text-brand-navy mt-1">
                  {rankXData ? 'Venue Booked' : 'RANKEX Open'}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {rankXData ? rankXData.centreName : 'Select exam centre'}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
                
                <div className="space-y-4 pb-4 border-b border-slate-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-brand-navy" />
                        <span>Enrolled Student CBT Test Series</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Classroom test series tailored for {studentStream} ({studentBatchTier} Tier) with NTA / TCS iON interface.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                      <button
                        onClick={() => fetchTests('ALL')}
                        className={`px-3 py-1 rounded-lg transition ${
                          streamFilter === 'ALL' ? 'bg-brand-navy text-white shadow' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => fetchTests('NEET')}
                        className={`px-3 py-1 rounded-lg transition ${
                          streamFilter === 'NEET' ? 'bg-emerald-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        NEET
                      </button>
                      <button
                        onClick={() => fetchTests('JEE')}
                        className={`px-3 py-1 rounded-lg transition ${
                          streamFilter === 'JEE' ? 'bg-blue-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        JEE
                      </button>
                    </div>
                  </div>

                  {/* Subject Filter Pills */}
                  <div className="flex items-center gap-2 flex-wrap pt-1">
                    <span className="text-[11px] font-black uppercase text-slate-400">Subject Filter:</span>
                    {['ALL', 'FULL_MOCK', ...(isJee ? ['MATHEMATICS', 'PHYSICS', 'CHEMISTRY'] : ['BIOLOGY', 'PHYSICS', 'CHEMISTRY'])].map(subj => (
                      <button
                        key={subj}
                        onClick={() => setCbtSubjectFilter(subj)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          cbtSubjectFilter === subj
                            ? 'bg-brand-navy text-brand-yellow shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {subj === 'ALL' ? 'All Tests' : subj === 'FULL_MOCK' ? 'Full Mock' : subj}
                      </button>
                    ))}
                  </div>
                </div>

                {loadingTests ? (
                  <div className="p-8 text-center text-slate-400 text-xs font-bold">
                    Loading batch test schedule...
                  </div>
                ) : batchTests.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No mock tests currently scheduled for this filter.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {batchTests
                      .filter(t => {
                        if (cbtSubjectFilter === 'ALL') return true;
                        if (cbtSubjectFilter === 'FULL_MOCK') return t.subject === 'FULL_MOCK' || !t.subject;
                        return t.subject && t.subject.toUpperCase() === cbtSubjectFilter.toUpperCase();
                      })
                      .map((t, idx) => {
                        const isSubmitted = t.submissionStatus === 'SUBMITTED';

                        return (
                          <div
                            key={t.id}
                            className="p-5 rounded-2xl border-2 border-slate-200 hover:border-brand-navy/40 bg-white transition space-y-3"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <span className={`w-10 h-10 rounded-xl font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm ${
                                  t.patternType === 'JEE_ADVANCED' || t.examType === 'JEE_ADVANCED' ? 'bg-indigo-100 text-indigo-800' :
                                  t.patternType === 'NEET_UG' || t.examType === 'NEET' ? 'bg-emerald-100 text-emerald-800' :
                                  t.patternType === 'FOUNDATION_PNCF' || t.examType === 'FOUNDATION' ? 'bg-amber-100 text-amber-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  T{String(idx + 1).padStart(2, '0')}
                                </span>
                                <div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                                      t.patternType === 'JEE_ADVANCED' || t.examType === 'JEE_ADVANCED' ? 'bg-indigo-700 text-white' :
                                      t.patternType === 'NEET_UG' || t.examType === 'NEET' ? 'bg-emerald-600 text-white' :
                                      t.patternType === 'FOUNDATION_PNCF' || t.examType === 'FOUNDATION' ? 'bg-amber-600 text-white' :
                                      'bg-blue-600 text-white'
                                    }`}>
                                      {t.patternType === 'JEE_ADVANCED' || t.examType === 'JEE_ADVANCED' ? '🎯 JEE Advanced' :
                                       t.patternType === 'NEET_UG' || t.examType === 'NEET' ? '🩺 NEET-UG' :
                                       t.patternType === 'FOUNDATION_PNCF' || t.examType === 'FOUNDATION' ? '🌱 Foundation PNCF' :
                                       '🚀 JEE Main'}
                                    </span>

                                    {t.batchTier && t.batchTier !== 'ALL' && (
                                      <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                                        t.batchTier === 'DIAMOND' ? 'bg-cyan-100 text-cyan-800' :
                                        t.batchTier === 'PLATINUM' ? 'bg-indigo-100 text-indigo-800' :
                                        t.batchTier === 'SILVER' ? 'bg-slate-200 text-slate-800' :
                                        'bg-emerald-100 text-emerald-800'
                                      }`}>
                                        {t.batchTier === 'DIAMOND' ? '💎 Diamond' : t.batchTier === 'PLATINUM' ? '🌟 Platinum' : t.batchTier === 'SILVER' ? '🥈 Silver' : '🟢 Green'}
                                      </span>
                                    )}

                                    {t.subject && t.subject !== 'FULL_MOCK' && (
                                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px] uppercase">
                                        {t.subject}
                                      </span>
                                    )}

                                    <span className="text-[11px] font-bold text-slate-500">
                                      {t.durationMinutes} Mins &bull; {t.totalMarks} Marks
                                    </span>
                                  </div>

                                  <h4 className="text-base font-extrabold text-slate-900 mt-1">
                                    {t.title}
                                  </h4>
                                  <p className="text-xs text-slate-500 mt-0.5">
                                    Subjects: <strong>{(t.subjects || []).join(', ')}</strong>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                {isSubmitted ? (
                                  t.isPublished ? (
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                        Score: {t.scoreObtained}/{t.totalMarks} ({t.percentageObtained}%)
                                      </span>
                                      <button
                                        onClick={() => onOpenRSAT(t.id)}
                                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold shadow transition"
                                      >
                                        Review Paper &amp; Solutions
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5 text-amber-600" />
                                      <span>⏳ Result Under Mentor Review</span>
                                    </div>
                                  )
                                ) : (
                                  <button
                                    onClick={() => onOpenRSAT(t.id)}
                                    className="px-4 py-2.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center gap-1.5"
                                  >
                                    <Play className="w-3.5 h-3.5 fill-current" />
                                    <span>Start CBT Hall</span>
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                              <span>{t.description}</span>
                              <span className="font-bold text-brand-navy">Simulate Live</span>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}

                {/* Offline RankX Details */}
                {rankXData && (
                  <div className="mt-8 pt-6 border-t border-slate-200">
                    <div className="p-5 rounded-2xl border-2 border-brand-yellow/50 bg-amber-50/50 space-y-3">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy font-black text-[10px] uppercase">
                            Offline Exam Venue Confirmed
                          </span>
                          <h4 className="text-lg font-extrabold text-brand-navy mt-1">
                            RANKEX 2027 Examination
                          </h4>
                          <p className="text-xs text-slate-600">
                            Roll No: <span className="font-mono font-bold text-slate-900">{rankXData.rollNumber}</span> &bull; Venue: {rankXData.centreName}
                          </p>
                        </div>
                        <button
                          onClick={onOpenRankX}
                          className="px-4 py-2 bg-brand-navy text-white rounded-xl text-xs font-bold shadow hover:bg-brand-navyLight flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5 text-brand-yellow" />
                          <span>Download QR Admit Card</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Invoices & Guidance */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-base font-extrabold text-slate-900">Digital Fee Receipts &amp; Invoices</h4>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">RANKEX Registration</span>
                    <span className="font-bold text-emerald-600">PAID &bull; ₹0 (Waived)</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Transaction ID: RP-2026-REG-01</p>
                  <button
                    onClick={() => alert('Official Tax Invoice & Receipt PDF generated!')}
                    className="w-full mt-2 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Tax Invoice
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-brand-yellow/20 to-amber-100 rounded-3xl p-6 border border-brand-yellow/40 space-y-3">
                <h4 className="text-base font-extrabold text-brand-navy">Academic Mentor Guidance</h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Connect directly with our senior JEE &amp; NEET faculty coordinators at Vijay Nagar campus for test strategy and doubt solving.
                </p>
                <a
                  href="https://wa.me/919131435511?text=Hi%2C%20I%20am%20logged%20in%20to%20student%20dashboard%20and%20need%20academic%20counseling."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 bg-[#25D366] text-white text-center rounded-xl font-bold text-xs shadow hover:bg-[#20ba59] transition"
                >
                  Direct Faculty WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: STUDY MATERIAL HUB */}
      {/* ============================================================== */}
      {activeTab === 'materials' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-navy bg-brand-yellow/30 px-2.5 py-0.5 rounded-full">
                Verified Faculty Curated
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Study Material, PYQ &amp; DPP Hub</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Download official PDF formula handbooks, Kota faculty handwritten notes, 10-year solved PYQs, and daily practice sheets.
              </p>
            </div>

            {/* Keyword Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Search notes, chapters, forms..."
                value={materialSearch}
                onChange={(e) => {
                  setMaterialSearch(e.target.value);
                  fetchStudyMaterials();
                }}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none"
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1">
                {MATERIAL_CATEGORIES.map(cat => (
                  <button
                    key={cat.key}
                    onClick={() => setMaterialCategory(cat.key)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                      materialCategory === cat.key
                        ? 'bg-brand-navy text-brand-yellow shadow'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Subject Selector */}
              <select
                value={materialSubject}
                onChange={(e) => setMaterialSubject(e.target.value)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Subjects ({studentStream})</option>
                {isFoundation ? (
                  <>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology (Science)</option>
                    <option value="Mental Ability (MAT)">Mental Ability (MAT / NTSE)</option>
                  </>
                ) : isJee ? (
                  <>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </>
                ) : (
                  <>
                    <option value="Biology">Biology (Botany &amp; Zoology)</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                  </>
                )}
                <option value="General">General / Official Forms</option>
              </select>
            </div>
          </div>

          {/* Material Cards Grid */}
          {loadingMaterials ? (
            <div className="p-12 text-center text-slate-400 text-xs font-bold bg-white rounded-3xl border border-slate-200">
              Loading curated study materials...
            </div>
          ) : materials.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs bg-white rounded-3xl border border-slate-200">
              No study materials found for this selection. Try selecting "All Documents".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-3xl p-6 border-2 border-slate-200 hover:border-brand-navy/50 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        m.category === 'PDF' ? 'bg-rose-100 text-rose-800' :
                        m.category === 'NOTES' ? 'bg-indigo-100 text-indigo-800' :
                        m.category === 'PYQ' ? 'bg-amber-100 text-amber-800' :
                        m.category === 'SHEET' ? 'bg-emerald-100 text-emerald-800' :
                        m.category === 'IMAGE' ? 'bg-cyan-100 text-cyan-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {m.category === 'PDF' ? 'PDF Handbook' :
                         m.category === 'NOTES' ? 'Handwritten Notes' :
                         m.category === 'PYQ' ? 'PYQ Bank' :
                         m.category === 'SHEET' ? 'DPP Sheet' :
                         m.category === 'IMAGE' ? 'Mindmap / Image' : 'Official Form'}
                      </span>

                      <span className="text-[11px] font-bold text-slate-400 font-mono">
                        {m.fileSize}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-base text-slate-900 leading-snug line-clamp-2">
                      {m.title}
                    </h4>

                    {(m.chapter || m.part) && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {m.chapter && (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200">
                            📖 {m.chapter}
                          </span>
                        )}
                        {m.part && (
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-black">
                            {m.part}{m.partTitle ? `: ${m.partTitle}` : ''}
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {m.description || 'Verified Rankers Path academic resource.'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-brand-navy block">
                        {m.subject} &bull; {m.stream}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {m.downloadCount || 0} Downloads
                      </span>
                    </div>

                    <button
                      onClick={() => handleDownloadMaterial(m)}
                      className="px-4 py-2 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl font-black text-xs uppercase tracking-wider shadow transition flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: LIVE CLASSES & TIMETABLE */}
      {/* ============================================================== */}
      {activeTab === 'live' && (
        <div className="space-y-8 animate-in fade-in">
          
          {/* Active Live Class Card */}
          {activeLiveClassNow ? (
            <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950 border-2 border-rose-500 rounded-3xl p-6 sm:p-8 text-white shadow-2xl space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                    <Radio className="w-6 h-6" />
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider animate-pulse">
                        🔴 HAPPENING RIGHT NOW
                      </span>
                      {activeLiveClassNow.isOpenToAll && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                          Open to All
                        </span>
                      )}
                      {activeLiveClassNow.isDigitalBoardLive !== false && (
                        <span className="px-2.5 py-0.5 rounded-full bg-indigo-600 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1 shadow-xs">
                          <Tv className="w-3 h-3" />
                          <span>Epson 75" 4K Smart Board Live</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                      {activeLiveClassNow.title}
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Subject: <strong className="text-brand-yellow">{activeLiveClassNow.subject}</strong> &bull; Mentor: {activeLiveClassNow.facultyName} &bull; Room: <span className="font-mono text-xs">{activeLiveClassNow.roomName}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleLaunchJitsi(activeLiveClassNow)}
                  className="px-6 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl transition flex items-center gap-2 transform hover:scale-105 active:scale-95 flex-shrink-0"
                >
                  <Video className="w-5 h-5" />
                  <span>Join Live Classroom</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">No Interactive Live Class in Progress Right Now</h4>
                  <p className="text-xs text-slate-500">Check the upcoming schedule below or watch recorded chapter lectures.</p>
                </div>
              </div>
            </div>
          )}

          {/* Scheduled Assessment Tests Section */}
          {liveClasses.some(c => c.hasTest) && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-rose-100 text-rose-700">
                  <Award className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Official Scheduled Tests ({studentStream} Stream)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Unit tests, minor assessments and Sunday mock exams scheduled for your enrolled batch.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveClasses.filter(c => c.hasTest).map(t => (
                  <div
                    key={t.id}
                    className="p-5 rounded-3xl bg-gradient-to-br from-rose-50/70 via-amber-50/40 to-white border-2 border-rose-300 shadow-sm space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[10px] uppercase tracking-wider">
                        {t.testDetails?.testType || 'Official Test'}
                      </span>
                      <span className="text-xs font-mono font-bold text-rose-900">
                        {t.testDetails?.totalMarks || (studentStream === 'NEET' ? 720 : 300)} Marks
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-base text-slate-900">
                        {t.testDetails?.testTitle || t.title}
                      </h4>
                      <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t.dayOfWeek}, {t.date}</span>
                        <span>&bull;</span>
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        <span>{t.testDetails?.testTiming || t.startTime}</span>
                      </p>
                    </div>

                    {t.testDetails?.syllabus && (
                      <div className="p-3 rounded-2xl bg-white/90 border border-rose-200/80 text-xs text-slate-700">
                        <strong className="text-rose-900 block mb-0.5">Test Syllabus:</strong>
                        {t.testDetails.syllabus}
                      </div>
                    )}

                    {t.teacherMessage && (
                      <p className="text-[11px] text-slate-500 italic">
                        Notice: {t.teacherMessage}
                      </p>
                    )}

                    <div className="pt-2 flex items-center justify-between border-t border-rose-200/60">
                      <span className="text-[10px] font-bold text-slate-500">
                        Venue: Vijay Nagar Main Campus / Online CBT
                      </span>
                      {t.testDetails?.questionPaperUrl && (
                        <a
                          href={t.testDetails.questionPaperUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow-xs transition"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Question Paper</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Sessions & Open to All Cards */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-brand-navy" />
              <span>Upcoming Live Batches &amp; Classroom Lectures</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {liveClasses.slice(0, 9).map((cls) => {
                const isLive = cls.status === 'LIVE';
                const isCompleted = cls.status === 'COMPLETED';

                return (
                  <div
                    key={cls.id}
                    className={`rounded-3xl p-6 border-2 transition flex flex-col justify-between space-y-4 ${
                      cls.hasTest ? 'border-rose-300 bg-rose-50/30' :
                      isLive ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 bg-white hover:border-brand-navy/40'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                          cls.hasTest ? 'bg-rose-600 text-white' :
                          isLive ? 'bg-rose-500 text-white animate-pulse' :
                          isCompleted ? 'bg-slate-100 text-slate-700' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {cls.hasTest ? 'TEST DAY' : isLive ? '🔴 LIVE NOW' : isCompleted ? 'Completed' : 'Upcoming'}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                          {cls.classMode || 'HYBRID'}
                        </span>
                      </div>

                      <h4 className="font-extrabold text-base text-slate-900 line-clamp-2">
                        {cls.title}
                      </h4>

                      {cls.chapter && (
                        <p className="text-xs text-brand-navy font-semibold">
                          Chapter: <span className="font-normal text-slate-600">{cls.chapter}</span>
                        </p>
                      )}

                      <p className="text-xs text-slate-500">
                        {cls.subject} &bull; Mentor: <strong className="text-brand-navy">{cls.facultyName}</strong>
                      </p>

                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-600 space-y-1">
                        <p className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cls.dayOfWeek}, {cls.date}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{cls.startTime} - {cls.endTime || 'Ongoing'}</span>
                        </p>
                      </div>

                      {cls.teacherMessage && (
                        <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/60">
                          <strong>Notice:</strong> {cls.teacherMessage}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-[11px] font-bold text-slate-400">
                        {cls.targetBatch}
                      </span>

                      <div className="flex items-center gap-2">
                        {cls.gcUrl && (
                          <a
                            href={cls.gcUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 rounded-xl font-bold text-xs flex items-center gap-1 transition"
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>Classroom GC</span>
                          </a>
                        )}

                        {isLive && (
                          <button
                            onClick={() => handleLaunchJitsi(cls)}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow"
                          >
                            Join Jitsi
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Academic Calendar Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-wrap gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-slate-900">
                    October 2026 Full Academic Calendar ({studentStream} Stream)
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-brand-yellow text-brand-navy text-[10px] font-black uppercase">
                    31 DAYS SCHEDULE
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Everyday chapter tracking, teacher assignments, Google Classroom links &amp; Sunday assessment tests.
                </p>
              </div>

              <span className="text-xs font-bold text-slate-400">
                {liveClasses.length} Scheduled Sessions This Month
              </span>
            </div>

            {/* Calendar Days Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-200 text-center py-2.5 text-xs font-black text-slate-600 uppercase">
                <span className="text-rose-600">Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 bg-white">
                {/* 4 empty cells for October 2026 (Oct 1 is Thursday, idx 4) */}
                <div className="bg-slate-50/40 min-h-[90px]" />
                <div className="bg-slate-50/40 min-h-[90px]" />
                <div className="bg-slate-50/40 min-h-[90px]" />
                <div className="bg-slate-50/40 min-h-[90px]" />

                {Array.from({ length: 31 }).map((_, i) => {
                  const dayNum = i + 1;
                  const dStr = `2026-10-${String(dayNum).padStart(2, '0')}`;
                  const dayMatches = liveClasses.filter(c => c.date === dStr);
                  const isToday = new Date().toISOString().split('T')[0] === dStr;
                  const hasTest = dayMatches.some(c => c.hasTest);

                  return (
                    <div
                      key={dStr}
                      className={`min-h-[105px] p-2 flex flex-col justify-between transition hover:bg-slate-50/80 ${
                        isToday ? 'bg-amber-50/40 ring-1 ring-brand-yellow' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                            hasTest
                              ? 'bg-rose-600 text-white shadow-xs'
                              : isToday
                              ? 'bg-brand-yellow text-brand-navy shadow-xs'
                              : 'text-slate-700'
                          }`}
                        >
                          {dayNum}
                        </span>

                        {hasTest && (
                          <span className="text-[9px] font-black text-rose-600 uppercase">
                            TEST
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 overflow-y-auto max-h-[85px]">
                        {dayMatches.map(m => (
                          <div
                            key={m.id}
                            className={`p-1.5 rounded-lg border text-[10px] leading-tight ${
                              m.hasTest
                                ? 'bg-rose-50 border-rose-200 text-rose-950'
                                : 'bg-slate-50 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-black truncate">{m.subject}</span>
                              <span className="text-[9px] text-slate-500 whitespace-nowrap">{m.startTime}</span>
                            </div>

                            {m.chapter && (
                              <p className="text-[9px] text-slate-600 truncate mt-0.5">
                                {m.chapter.split(' - ')[0]}
                              </p>
                            )}

                            {m.gcUrl && (
                              <a
                                href={m.gcUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 text-[9px] font-black text-emerald-700 hover:underline mt-1"
                              >
                                <Video className="w-2.5 h-2.5" /> GC Link
                              </a>
                            )}
                          </div>
                        ))}

                        {dayMatches.length === 0 && (
                          <span className="text-[9px] text-slate-300 italic block text-center pt-2">
                            Self Study
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Weekly Period Timetable Grid */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">Weekly Batch Lecture Timetable</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Official weekly periods mapped for {studentStream} batch students.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DAYS_OF_WEEK.map((day) => {
                const dayClasses = timetable[day] || [];

                return (
                  <div key={day} className="rounded-2xl border-2 border-slate-200 p-4 space-y-3 bg-slate-50/40">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <h4 className="font-extrabold text-sm text-brand-navy">{day}</h4>
                      <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                        {dayClasses.length} Sessions
                      </span>
                    </div>

                    {dayClasses.length === 0 ? (
                      <p className="text-xs text-slate-400 italic py-4 text-center">Self-study / Revision day</p>
                    ) : (
                      <div className="space-y-2">
                        {dayClasses.map((dc) => (
                          <div key={dc.id} className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {dc.startTime} - {dc.endTime}
                              </span>
                              <span className="text-[9px] font-black text-brand-navy uppercase bg-slate-100 px-1 rounded">
                                {dc.stream}
                              </span>
                            </div>
                            <p className="font-extrabold text-xs text-slate-900 line-clamp-1">{dc.title}</p>
                            <p className="text-[11px] text-slate-500">{dc.subject} &bull; {dc.facultyName}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: RECORDED LECTURES (YOUTUBE POWERED) */}
      {/* ============================================================== */}
      {activeTab === 'recorded' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header & Subject Selector */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full">
                Interactive Video LMS
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">Subject-Wise Recorded Classroom Lectures</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Streaming directly inside your portal in 1080p HD with zero external YouTube ads and attached chapter notes.
              </p>
            </div>

            {/* Subject Selector Tabs */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
              {(isFoundation
                ? ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Mental Ability (MAT)']
                : isJee
                ? ['Physics', 'Chemistry', 'Mathematics']
                : ['Physics', 'Chemistry', 'Biology']
              ).map((subj) => (
                <button
                  key={subj}
                  onClick={() => {
                    setSelectedSubject(subj);
                    const match = recordedLectures.find(l => l.subject.toLowerCase() === subj.toLowerCase());
                    if (match) setActiveLecture(match);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition whitespace-nowrap ${
                    selectedSubject.toLowerCase() === subj.toLowerCase()
                      ? 'bg-brand-navy text-brand-yellow shadow'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Main Video Theater Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 8 Cols: Video Player & Lecture Notes */}
            <div className="lg:col-span-8 space-y-6">
              {activeLecture ? (
                <div className="space-y-4">
                  {/* YouTube Player Container */}
                  <div className="relative aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${activeLecture.videoId}?rel=0&modestbranding=1&enablejsapi=1`}
                      title={activeLecture.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>

                  {/* Lecture Header & Attached Materials */}
                  <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="px-2 py-0.5 rounded bg-brand-yellow/20 text-brand-navy font-bold text-xs uppercase">
                            {activeLecture.subject} &bull; Chapter: {activeLecture.chapter}
                          </span>
                          {activeLecture.part && (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-xs">
                              {activeLecture.part}{activeLecture.partTitle ? `: ${activeLecture.partTitle}` : ''}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 font-mono">
                            Lecture #{activeLecture.lectureNo} &bull; {activeLecture.duration}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                          {activeLecture.title}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Faculty Mentor: <strong className="text-brand-navy">{activeLecture.facultyName}</strong>
                        </p>
                      </div>

                      {/* Download Notes & DPP Buttons */}
                      <div className="flex items-center gap-2 flex-wrap">
                        {activeLecture.notesUrl && (
                          <a
                            href={activeLecture.notesUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Lecture Notes PDF</span>
                          </a>
                        )}

                        {activeLecture.dppUrl && (
                          <a
                            href={activeLecture.dppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center gap-1.5"
                          >
                            <FileSpreadsheet className="w-3.5 h-3.5" />
                            <span>DPP Sheet</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="text-xs text-slate-600 leading-relaxed space-y-2">
                      <p className="font-bold text-slate-800">Lecture Highlights &amp; Syllabus Coverage:</p>
                      <p>{activeLecture.description || 'Comprehensive conceptual derivation and practice problem discussion.'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center text-slate-400 text-xs font-bold bg-white rounded-3xl border border-slate-200">
                  Select a lecture from the playlist to start streaming.
                </div>
              )}
            </div>

            {/* Right 4 Cols: Chapter Playlist */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-black text-sm text-slate-900">
                    {selectedSubject} Playlist ({filteredLectures.length})
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                    HD 1080p
                  </span>
                </div>

                {filteredLectures.length === 0 ? (
                  <p className="text-xs text-slate-400 italic py-6 text-center">
                    No recorded lectures added yet for {selectedSubject}.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                    {filteredLectures.map((lec) => {
                      const isCurrent = activeLecture?.id === lec.id;

                      return (
                        <div
                          key={lec.id}
                          onClick={() => setActiveLecture(lec)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition flex items-center gap-3 ${
                            isCurrent
                              ? 'border-brand-navy bg-brand-yellow/10 shadow-sm'
                              : 'border-slate-100 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="relative w-20 h-14 bg-slate-900 rounded-xl overflow-hidden flex-shrink-0">
                            <img
                              src={`https://img.youtube.com/vi/${lec.videoId}/default.jpg`}
                              alt={lec.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <Play className={`w-4 h-4 fill-current ${isCurrent ? 'text-brand-yellow' : 'text-white'}`} />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="text-[10px] font-bold text-slate-400 line-clamp-1">
                                {lec.chapter} &bull; Lec #{lec.lectureNo}
                              </p>
                              {lec.part && (
                                <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 text-[9px] font-black">
                                  {lec.part}
                                </span>
                              )}
                            </div>
                            <h5 className="font-extrabold text-xs text-slate-900 line-clamp-2 mt-0.5">
                              {lec.title}
                            </h5>
                            {lec.partTitle && (
                              <p className="text-[10px] text-amber-800 font-semibold line-clamp-1">
                                {lec.partTitle}
                              </p>
                            )}
                            <span className="text-[10px] font-semibold text-brand-navy mt-1 block">
                              {lec.duration}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: BIOMETRIC CLASSROOM ATTENDANCE */}
      {/* ============================================================== */}
      {activeTab === 'attendance' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Metric Card */}
          <div className="bg-gradient-to-r from-brand-navy via-[#102A5C] to-brand-navy rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>Vijay Nagar Biometric Terminal Connected</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black">
                  My Classroom Attendance &amp; Punch Record
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                  Daily fingerprint attendance logged at Vijay Nagar Main Campus. Parents receive automated updates when you arrive and leave the centre.
                </p>
              </div>

              <div className="bg-white/10 border border-white/20 rounded-2xl p-5 text-center min-w-[180px]">
                <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">Monthly Attendance</span>
                <span className="text-4xl font-black text-emerald-400 block mt-1">
                  {attendanceStats ? `${attendanceStats.attendancePercentage}%` : '96%'}
                </span>
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full mt-1 inline-block">
                  Eligible for CBT Exams
                </span>
              </div>
            </div>
          </div>

          {/* KPI Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Classes Held</span>
              <h4 className="text-3xl font-black text-brand-navy mt-1">
                {attendanceStats ? attendanceStats.totalDaysHeld : 24} Days
              </h4>
              <p className="text-xs text-slate-500 mt-1">Classroom Shift: 08:00 AM – 01:30 PM</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Present Days</span>
              <h4 className="text-3xl font-black text-emerald-600 mt-1">
                {attendanceStats ? attendanceStats.presentDays : 23} Days
              </h4>
              <p className="text-xs text-emerald-700 font-bold mt-1">Verified on Fingerprint Device</p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
              <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Absent / Leave</span>
              <h4 className="text-3xl font-black text-red-500 mt-1">
                {attendanceStats ? attendanceStats.absentDays : 1} Day
              </h4>
              <p className="text-xs text-slate-500 mt-1">Leave applications via Admin</p>
            </div>
          </div>

          {/* Punch Log History Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-navy" />
                <h4 className="font-black text-brand-navy text-sm">Recent Biometric Punch Logs</h4>
              </div>
              <span className="text-xs text-slate-400">Terminal: SilkBio-101</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">In-Time</th>
                    <th className="py-3 px-4">Out-Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Terminal &amp; Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {(attendanceStats?.recentLogs && attendanceStats.recentLogs.length > 0) ? (
                    attendanceStats.recentLogs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-4 font-mono font-bold text-slate-700">{log.date}</td>
                        <td className="py-3 px-4 font-bold text-emerald-700">{log.inTime || '--'}</td>
                        <td className="py-3 px-4 font-bold text-indigo-700">{log.outTime || 'In Class'}</td>
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>{log.status || 'PRESENT'}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {log.deviceLocation || 'Vijay Nagar Main Campus'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-6 text-center text-slate-400">
                        No biometric punch logs recorded yet for this session.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* Jitsi Live Modal Launcher */}
      <JitsiLiveModal
        isOpen={isJitsiOpen}
        onClose={() => setIsJitsiOpen(false)}
        liveClass={activeJitsiClass}
        user={user}
      />

    </div>
  );
}
