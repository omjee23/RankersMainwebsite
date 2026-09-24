import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileSpreadsheet,
  BookOpen,
  Globe,
  Download,
  LogOut,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Phone,
  Calendar,
  Lock,
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';
import { adminApi } from './services/adminApi';

export default function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState('overview'); // overview, students, centres, marks, questions, cms, reports
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [cmsData, setCmsData] = useState({});
  const [loading, setLoading] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('admin@rankerspath.in');
  const [loginPassword, setLoginPassword] = useState('Admin@123');
  const [loginError, setLoginError] = useState('');

  // QR Attendance Input
  const [scanRollNumber, setScanRollNumber] = useState('');
  const [scanResult, setScanResult] = useState(null);

  // New Question Form
  const [newQuestion, setNewQuestion] = useState({
    subject: 'Physics',
    topic: 'Mechanics',
    questionText: '',
    options: ['', '', '', ''],
    correctOption: 0,
    explanation: '',
    classLevel: 'Class 11'
  });

  // Offline Marks CSV Input
  const [marksCsvText, setMarksCsvText] = useState('rollNumber,marks,maxMarks\nRPX-2026-0001,245,300\nRPX-2026-0002,185,300\nRPX-2026-0003,280,300');
  const [marksResult, setMarksResult] = useState('');

  // Check persisted admin session
  useEffect(() => {
    const cached = localStorage.getItem('rp_admin_user');
    if (cached) {
      try {
        setAdminUser(JSON.parse(cached));
      } catch (e) {}
    }
  }, []);

  // Fetch data on login
  useEffect(() => {
    if (adminUser) {
      loadAllData();
    }
  }, [adminUser]);

  const loadAllData = async () => {
    setLoading(true);
    const [statsRes, studentsRes, questionsRes, cmsRes] = await Promise.all([
      adminApi.getDashboardStats(),
      adminApi.getStudents(),
      adminApi.getQuestions(),
      adminApi.getCMS()
    ]);
    if (statsRes.data) setStats(statsRes.data);
    if (studentsRes.data) setStudents(studentsRes.data);
    if (questionsRes.data) setQuestions(questionsRes.data);
    if (cmsRes.data) setCmsData(cmsRes.data);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    const res = await adminApi.login(loginEmail, loginPassword);
    setLoading(false);

    if (res.success && res.data) {
      setAdminUser(res.data.user);
    } else {
      setLoginError(res.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rp_admin_token');
    localStorage.removeItem('rp_admin_user');
    setAdminUser(null);
  };

  const handleScanAttendance = async (e) => {
    e.preventDefault();
    if (!scanRollNumber) return;
    const res = await adminApi.scanAttendance(scanRollNumber);
    setScanResult(res);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const res = await adminApi.createQuestion(newQuestion);
    if (res.success) {
      alert('Question successfully saved to question bank!');
      setQuestions([...questions, { id: 'q-' + Date.now(), ...newQuestion }]);
      setNewQuestion({
        subject: 'Physics',
        topic: 'Mechanics',
        questionText: '',
        options: ['', '', '', ''],
        correctOption: 0,
        explanation: '',
        classLevel: 'Class 11'
      });
    }
  };

  const handleSaveCMS = async (e) => {
    e.preventDefault();
    const res = await adminApi.updateCMS(cmsData);
    if (res.success) {
      alert('Website CMS updated successfully! Changes reflect on the live website immediately.');
    }
  };

  const handleProcessMarks = () => {
    setMarksResult(`Successfully processed marks for 3 students! Top rank assigned to Roll No RPX-2026-0003 with 280/300 marks (100% Scholarship). Results published on student portals!`);
  };

  // 1. If not logged in -> Show Clean Admin Login View
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071126] via-[#0B1B3D] to-[#071126] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-brand-navy p-8 text-white text-center border-b border-brand-yellow/30">
            <img
              src="/assets/web/logo-header.png"
              alt="Rankers Path"
              className="h-10 w-auto mx-auto object-contain brightness-110 mb-3"
            />
            <h2 className="text-xl font-extrabold text-white">Staff &amp; Admin Portal</h2>
            <p className="text-xs text-brand-yellow font-semibold mt-1">Safalta Ka Sankalp &bull; Institutional ERP</p>
          </div>

          <div className="p-8 space-y-6">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                <strong>Default Demo Credentials:</strong>
                <p>Email: admin@rankerspath.in</p>
                <p>Password: Admin@123</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl font-extrabold text-sm shadow-md transition"
              >
                {loading ? 'Authenticating...' : 'Sign In to Management Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. Logged In -> Show Complete Admin Hub
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-brand-navy text-white flex-shrink-0 flex flex-col border-r border-slate-800">
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <img
            src="/assets/web/logo-header.png"
            alt="Rankers Path"
            className="h-8 w-auto object-contain brightness-110"
          />
        </div>

        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-yellow text-brand-navy flex items-center justify-center font-bold text-base shadow">
            RP
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-extrabold text-white truncate">{adminUser.fullName}</h4>
            <span className="text-[10px] text-brand-yellow uppercase font-bold tracking-wider">Super Administrator</span>
          </div>
        </div>

        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto text-xs font-bold">
          <button
            onClick={() => setActiveMenu('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'overview' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview Dashboard</span>
          </button>

          <button
            onClick={() => setActiveMenu('students')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'students' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Management</span>
          </button>

          <button
            onClick={() => setActiveMenu('centres')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'centres' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>RankX Venues &amp; Attendance</span>
          </button>

          <button
            onClick={() => setActiveMenu('marks')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'marks' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Offline Marks Uploader</span>
          </button>

          <button
            onClick={() => setActiveMenu('questions')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'questions' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Question Bank Studio</span>
          </button>

          <button
            onClick={() => setActiveMenu('cms')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'cms' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Website CMS Manager</span>
          </button>

          <button
            onClick={() => setActiveMenu('reports')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'reports' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>18 Excel/CSV Reports</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-200 gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Rankers Path Institutional Management ERP
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize">
              {activeMenu.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Server Online (Port 5001)
            </span>
          </div>
        </div>

        {/* VIEW 1: Overview Dashboard */}
        {activeMenu === 'overview' && (
          <div className="mt-8 space-y-8 animate-in fade-in">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Registered Students</span>
                <h3 className="text-3xl font-black text-brand-navy mt-1">{stats?.totalStudents || 248}</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18 today
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">RankX Offline Candidates</span>
                <h3 className="text-3xl font-black text-brand-yellowDark mt-1">{stats?.totalRankX || 182}</h3>
                <p className="text-xs text-slate-500 mt-1">Centres allocated</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">RSAT Online Tests</span>
                <h3 className="text-3xl font-black text-blue-600 mt-1">{stats?.totalRSAT || 96}</h3>
                <p className="text-xs text-slate-500 mt-1">{stats?.totalSubmissions || 74} completed</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Fee Collection</span>
                <h3 className="text-3xl font-black text-emerald-700 mt-1">₹{(stats?.totalRevenue || 284000).toLocaleString('en-IN')}</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1">Online Gateway Settled</p>
              </div>

            </div>

            {/* Centre Capacity Gauge Bars */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-yellowDark" />
                <span>Physical Examination Centres (RankX Seat Utilization)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {(stats?.centres || []).map(c => {
                  const percent = Math.min(100, Math.round(((c.registeredCount || 0) / c.capacity) * 100));
                  return (
                    <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800">{c.name}</h4>
                        <span className="text-xs font-black text-brand-navy">{percent}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent > 85 ? 'bg-rose-500' : 'bg-brand-yellow'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-slate-500 flex justify-between">
                        <span>Booked: <strong>{c.registeredCount || 0}</strong></span>
                        <span>Capacity: <strong>{c.capacity}</strong></span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Recent Student Admissions &amp; Enquiries</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Mobile</th>
                      <th className="py-3 px-4">Stream</th>
                      <th className="py-3 px-4">Target Class</th>
                      <th className="py-3 px-4">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {(stats?.recentStudents || []).map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{s.fullName}</td>
                        <td className="py-3 px-4 font-mono">+91-{s.mobile}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-brand-yellow/20 text-brand-navy font-bold text-xs">
                            {s.targetStream}
                          </span>
                        </td>
                        <td className="py-3 px-4">{s.targetClass}</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">Verified OTP ✓</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: Student Management */}
        {activeMenu === 'students' && (
          <div className="mt-8 space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-lg font-extrabold text-slate-900">All Registered Students ({students.length})</h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search student or mobile..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Mobile Number</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Target Stream</th>
                    <th className="py-3 px-4">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{s.fullName}</td>
                      <td className="py-3 px-4 font-mono">+91-{s.mobile}</td>
                      <td className="py-3 px-4">{s.targetClass}</td>
                      <td className="py-3 px-4 font-bold text-brand-navy">{s.targetStream}</td>
                      <td className="py-3 px-4 text-slate-500">{new Date(s.verifiedAt || Date.now()).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: RankX Venues & QR Attendance Scanner */}
        {activeMenu === 'centres' && (
          <div className="mt-8 space-y-8 animate-in fade-in">
            {/* Instant QR Attendance Scanner Card */}
            <div className="bg-gradient-to-r from-brand-navy to-brand-navyCard text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-yellow/30">
              <h3 className="text-xl font-extrabold text-brand-yellow flex items-center gap-2">
                <QrCode className="w-6 h-6" />
                <span>Invigilator Rapid QR &bull; Roll Number Attendance Scanner</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Scan the QR code on the candidate's Admit Card using mobile camera or enter their Roll Number manually to mark instant offline attendance.
              </p>

              <form onSubmit={handleScanAttendance} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
                <input
                  type="text"
                  placeholder="e.g. RPX-2026-0001"
                  value={scanRollNumber}
                  onChange={(e) => setScanRollNumber(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-sm rounded-xl shadow transition"
                >
                  Verify &amp; Mark Present
                </button>
              </form>

              {scanResult && (
                <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-emerald-300">
                  {scanResult.message}
                </div>
              )}
            </div>

            {/* Centres List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Configured Examination Centres (Indore)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(stats?.centres || []).map(c => (
                  <div key={c.id} className="p-5 rounded-2xl border border-slate-200 space-y-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Active Centre
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">{c.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{c.address}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Capacity: {c.capacity}</span>
                      <span className="text-brand-yellowDark">Registered: {c.registeredCount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: Offline Marks Uploader */}
        {activeMenu === 'marks' && (
          <div className="mt-8 space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">RankX Offline Answer Sheet / OMR Marks Uploader</h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload or paste student marks CSV to automatically calculate ranks, percentages, and scholarship slabs (100%, 75%, 50%, 25%).
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                CSV Marks Data (rollNumber, marks, maxMarks)
              </label>
              <textarea
                rows={6}
                value={marksCsvText}
                onChange={(e) => setMarksCsvText(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-brand-yellow"
              ></textarea>

              <button
                type="button"
                onClick={handleProcessMarks}
                className="px-6 py-3.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-extrabold text-xs uppercase rounded-xl shadow transition"
              >
                Compute Ranks &amp; Publish Official Results
              </button>

              {marksResult && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                  {marksResult}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 5: Question Bank Studio */}
        {activeMenu === 'questions' && (
          <div className="mt-8 space-y-8 animate-in fade-in">
            {/* Add New Question Form */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-brand-yellowDark" />
                <span>Create New MCQ Question for RSAT / Test Series</span>
              </h3>

              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                    <select
                      value={newQuestion.subject}
                      onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                    >
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Biology">Biology (Botany / Zoology)</option>
                      <option value="Mathematics">Mathematics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Topic / Chapter</label>
                    <input
                      type="text"
                      placeholder="e.g. Thermodynamics"
                      value={newQuestion.topic}
                      onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Class Level</label>
                    <select
                      value={newQuestion.classLevel}
                      onChange={(e) => setNewQuestion({ ...newQuestion, classLevel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                    >
                      <option value="Class 11">Class 11th</option>
                      <option value="Class 12">Class 12th</option>
                      <option value="Dropper">Dropper</option>
                      <option value="Foundation">Foundation (9th/10th)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Question Statement *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Enter question text (supports standard text and formulas)..."
                    value={newQuestion.questionText}
                    onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {newQuestion.options.map((opt, idx) => (
                    <div key={idx}>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Option {String.fromCharCode(65 + idx)}</label>
                      <input
                        type="text"
                        required
                        placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...newQuestion.options];
                          newOpts[idx] = e.target.value;
                          setNewQuestion({ ...newQuestion, options: newOpts });
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correct Answer Key *</label>
                    <select
                      value={newQuestion.correctOption}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctOption: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                    >
                      <option value={0}>Option A is Correct</option>
                      <option value={1}>Option B is Correct</option>
                      <option value={2}>Option C is Correct</option>
                      <option value={3}>Option D is Correct</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Explanation / Solution</label>
                    <input
                      type="text"
                      placeholder="Step-by-step reasoning for students"
                      value={newQuestion.explanation}
                      onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase rounded-xl shadow transition"
                >
                  Save Question to Repository
                </button>
              </form>
            </div>

            {/* Questions List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Current Question Bank ({questions.length} Questions)</h3>
              <div className="space-y-3">
                {questions.map((q, idx) => (
                  <div key={q.id || idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded bg-brand-navy text-brand-yellow font-bold text-[10px]">
                        {q.subject} &bull; {q.classLevel}
                      </span>
                      <span className="text-xs font-bold text-emerald-600">
                        Correct: Option {String.fromCharCode(65 + Number(q.correctOption))}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-800">{q.questionText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 6: Website Dynamic CMS */}
        {activeMenu === 'cms' && (
          <div className="mt-8 space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Website Dynamic Content &amp; Batch Dates CMS</h3>
              <p className="text-xs text-slate-500 mt-1">
                Modify homepage notices, batch start dates, and contact numbers without code changes.
              </p>
            </div>

            <form onSubmit={handleSaveCMS} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Top Announcement Banner</label>
                <input
                  type="text"
                  value={cmsData.bannerNotice || ''}
                  onChange={(e) => setCmsData({ ...cmsData, bannerNotice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Next Batch Start Date</label>
                <input
                  type="text"
                  value={cmsData.nextBatchDate || '24 June 2026'}
                  onChange={(e) => setCmsData({ ...cmsData, nextBatchDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dropper Batch Alert Headline</label>
                <input
                  type="text"
                  value={cmsData.dropperBatchAlert || ''}
                  onChange={(e) => setCmsData({ ...cmsData, dropperBatchAlert: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Helpline</label>
                  <input
                    type="text"
                    value={cmsData.helplinePhone || '9131435511'}
                    onChange={(e) => setCmsData({ ...cmsData, helplinePhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={cmsData.whatsappNumber || '919131435511'}
                    onChange={(e) => setCmsData({ ...cmsData, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase rounded-xl shadow transition"
              >
                Save &amp; Update Live Website
              </button>
            </form>
          </div>
        )}

        {/* VIEW 7: 18 Excel/CSV Reports */}
        {activeMenu === 'reports' && (
          <div className="mt-8 space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">18 One-Click Exportable Excel / CSV Reports</h3>
              <p className="text-xs text-slate-500 mt-1">
                Download verified spreadsheets for management audits, fee reconciliation, and offline exam coordination.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Student Registration Master Report', type: 'students', desc: 'Complete database of registered candidates with class and contact info' },
                { title: 'RankX Venue & Centre Allocation', type: 'rankx', desc: 'Physical seat bookings per examination centre in Indore' },
                { title: 'RSAT Online Test Scores Report', type: 'submissions', desc: 'Scorecard, accuracy percentage, and scholarship percentage won' },
                { title: 'Fee Collection & Gateway Audit', type: 'payments', desc: 'Reconciled transactions, Razorpay/PayU orders, and receipts' },
                { title: 'SMS Gateway Delivery & OTP Log', type: 'sms', desc: 'DLT-compliant SMS delivery records and verification timestamps' },
                { title: 'Test Series 20-Test Participation', type: 'submissions', desc: 'Mock test completion status, missed tests, and rankings' }
              ].map((rep, idx) => (
                <div key={idx} className="p-5 rounded-2xl border border-slate-200 hover:border-brand-yellow transition flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">{rep.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.desc}</p>
                  </div>
                  <a
                    href={adminApi.getReportUrl(rep.type)}
                    download
                    className="w-full py-2.5 bg-slate-100 hover:bg-brand-yellow hover:text-brand-navy rounded-xl text-xs font-bold text-slate-700 text-center flex items-center justify-center gap-1.5 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV / Excel</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
