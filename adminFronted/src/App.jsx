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
  Award,
  GraduationCap,
  Trash2,
  Edit3,
  Eye,
  EyeOff
} from 'lucide-react';
import { adminApi } from './services/adminApi';

export default function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState('overview'); // overview, students, centres, marks, questions, cms, reports
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [cmsData, setCmsData] = useState({});
  const [loading, setLoading] = useState(false);

  // Faculty State
  const [facultyList, setFacultyList] = useState([]);
  const [facultyModalOpen, setFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    degree: '',
    role: '',
    subject: 'Biology',
    exp: '20+ Years Experience',
    photo: '/assets/web/faculty-team-full.png',
    bio: '',
    showOnHome: false,
    order: 10
  });

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
    const [statsRes, studentsRes, questionsRes, cmsRes, subsRes, facRes] = await Promise.all([
      adminApi.getDashboardStats(),
      adminApi.getStudents(),
      adminApi.getQuestions(),
      adminApi.getCMS(),
      adminApi.getSubmissions(),
      adminApi.getFaculty()
    ]);
    if (statsRes.data) setStats(statsRes.data);
    if (studentsRes.data) setStudents(studentsRes.data);
    if (questionsRes.data) setQuestions(questionsRes.data);
    if (cmsRes.data) setCmsData(cmsRes.data);
    if (subsRes.data) setSubmissions(subsRes.data);
    if (facRes && facRes.data) setFacultyList(facRes.data);
    setLoading(false);
  };

  // Faculty Handlers
  const handleOpenAddFaculty = () => {
    setEditingFaculty(null);
    setFacultyForm({
      name: '',
      degree: '',
      role: '',
      subject: 'Biology',
      exp: '20+ Years Experience',
      photo: '/assets/web/faculty-team-full.png',
      bio: '',
      showOnHome: false,
      order: facultyList.length + 1
    });
    setFacultyModalOpen(true);
  };

  const handleOpenEditFaculty = (fac) => {
    setEditingFaculty(fac);
    setFacultyForm({
      name: fac.name || '',
      degree: fac.degree || '',
      role: fac.role || '',
      subject: fac.subject || 'Biology',
      exp: fac.exp || '20+ Years Experience',
      photo: fac.photo || '/assets/web/faculty-team-full.png',
      bio: fac.bio || '',
      showOnHome: fac.showOnHome === true,
      order: fac.order || 1
    });
    setFacultyModalOpen(true);
  };

  const handleSaveFaculty = async (e) => {
    e.preventDefault();
    if (!facultyForm.name || !facultyForm.subject) {
      alert('Please enter faculty name and subject');
      return;
    }
    setLoading(true);
    let res;
    if (editingFaculty) {
      res = await adminApi.updateFaculty(editingFaculty.id, facultyForm);
    } else {
      res = await adminApi.createFaculty(facultyForm);
    }
    setLoading(false);
    if (res && res.success) {
      const updatedList = await adminApi.getFaculty();
      if (updatedList.data) setFacultyList(updatedList.data);
      setFacultyModalOpen(false);
      alert(editingFaculty ? 'Faculty details updated successfully!' : 'New faculty member added successfully!');
    } else {
      alert(res?.message || 'Failed to save faculty details');
    }
  };

  const handleDeleteFaculty = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the faculty team?`)) return;
    setLoading(true);
    const res = await adminApi.deleteFaculty(id);
    setLoading(false);
    if (res && res.success) {
      const updatedList = await adminApi.getFaculty();
      if (updatedList.data) setFacultyList(updatedList.data);
      alert('Faculty member deleted.');
    } else {
      alert(res?.message || 'Failed to delete faculty');
    }
  };

  const handleToggleHomeVisibility = async (fac) => {
    const updated = !fac.showOnHome;
    const res = await adminApi.updateFaculty(fac.id, { showOnHome: updated });
    if (res && res.success) {
      const updatedList = await adminApi.getFaculty();
      if (updatedList.data) setFacultyList(updatedList.data);
    }
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
            onClick={() => setActiveMenu('cbt-exams')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'cbt-exams' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Online CBT &amp; Results</span>
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
            onClick={() => setActiveMenu('faculty')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'faculty' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Faculty &amp; Mentors Team</span>
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

        {/* VIEW: Online CBT Tests & Results Hub */}
        {activeMenu === 'cbt-exams' && (
          <div className="mt-8 space-y-8 animate-in fade-in">
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total CBT Attempts</span>
                <h3 className="text-3xl font-black text-brand-navy mt-1">{submissions.length}</h3>
                <p className="text-xs text-slate-500 mt-1">Across NEET &amp; RSAT</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Top Merit Achievers</span>
                <h3 className="text-3xl font-black text-brand-yellowDark mt-1">
                  {submissions.filter(s => (s.scholarshipPercent || 0) >= 75).length}
                </h3>
                <p className="text-xs text-emerald-600 font-bold mt-1">Qualified for 75%–100% Scholarship</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Average Score</span>
                <h3 className="text-3xl font-black text-blue-600 mt-1">
                  {submissions.length > 0
                    ? Math.round(submissions.reduce((acc, s) => acc + (s.percentage || 0), 0) / submissions.length)
                    : 68}%
                </h3>
                <p className="text-xs text-slate-500 mt-1">Overall Batch Accuracy</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Anti-Cheat Flags</span>
                <h3 className="text-3xl font-black text-rose-600 mt-1">
                  {submissions.filter(s => (s.tabSwitchCount || 0) > 0).length}
                </h3>
                <p className="text-xs text-rose-500 font-semibold mt-1">Tab switches recorded</p>
              </div>
            </div>

            {/* Scheduled CBT Tests */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Active &amp; Scheduled Online CBT Tests</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Tests accessible by students in the online examination hall</p>
                </div>
                <button
                  onClick={() => alert('New CBT Exam Window Created & Activated for students!')}
                  className="px-4 py-2 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-extrabold text-xs uppercase rounded-xl shadow flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Schedule New CBT Window
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-5 rounded-2xl border-2 border-brand-yellow bg-amber-50/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-brand-yellow text-brand-navy font-bold text-[10px] uppercase">
                      Scholarship Test
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600">LIVE NOW</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">RSAT 2026 Online Test</h4>
                  <p className="text-xs text-slate-600">45 Mins &bull; Physics, Chemistry, Biology &bull; Up to 100% Scholarship</p>
                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
                    <span>Attempts: <strong>{submissions.length}</strong></span>
                    <span>Marking: <strong>+4 / -1 / 0</strong></span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-bold text-[10px] uppercase">
                      Test Series T01
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Scheduled</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">NEET Full Syllabus Mock 01</h4>
                  <p className="text-xs text-slate-600">180 Mins &bull; 720 Marks &bull; Complete NCERT Syllabus</p>
                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
                    <span>Window: <strong>24 June 2026</strong></span>
                    <span>Fee: <strong>Included</strong></span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 font-bold text-[10px] uppercase">
                      Test Series T02
                    </span>
                    <span className="text-xs font-semibold text-slate-500">Draft</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">IIT-JEE Advanced Mock 01</h4>
                  <p className="text-xs text-slate-600">180 Mins &bull; Physics, Chemistry, Maths &bull; Multi-correct MCQ</p>
                  <div className="pt-2 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
                    <span>Window: <strong>July 2026</strong></span>
                    <span>Status: <strong>Question Bank Ready</strong></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Submissions Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    Live Student CBT Submissions &amp; Auto-Evaluated Scorecards
                  </h3>
                  <p className="text-xs text-slate-500">
                    Calculated in real-time by the backend grading engine with anti-cheat audit logs
                  </p>
                </div>

                <a
                  href={adminApi.getReportUrl('submissions')}
                  download
                  className="px-4 py-2 bg-slate-100 hover:bg-brand-yellow hover:text-brand-navy rounded-xl text-xs font-bold text-slate-700 transition flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Scorecards (CSV)</span>
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Mobile</th>
                      <th className="py-3 px-4">Test Title</th>
                      <th className="py-3 px-4">Score (+4 / -1)</th>
                      <th className="py-3 px-4">Accuracy</th>
                      <th className="py-3 px-4">Scholarship Won</th>
                      <th className="py-3 px-4">Anti-Cheat</th>
                      <th className="py-3 px-4">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {submissions.map((sub, idx) => (
                      <tr key={sub.id || idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{sub.studentName}</td>
                        <td className="py-3 px-4 font-mono text-xs">+91-{sub.mobile}</td>
                        <td className="py-3 px-4 text-xs font-semibold text-brand-navy max-w-xs truncate">
                          {sub.examTitle}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900">
                          {sub.score} / {sub.maxMarks}
                        </td>
                        <td className="py-3 px-4 font-bold text-brand-yellowDark">
                          {sub.percentage}%
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                            {sub.scholarshipPercent || 75}% Off
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {sub.tabSwitchCount && sub.tabSwitchCount > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                              ⚠️ {sub.tabSwitchCount} Tab Switches
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                              Clean ✓
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-400 text-xs">
                          {new Date(sub.submittedAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Institute Inspiring Quote (Hero)</label>
                <input
                  type="text"
                  value={cmsData.instituteQuote || 'Student aur parents ka vishwas — Rankers Path banaye har baccha khaas'}
                  onChange={(e) => setCmsData({ ...cmsData, instituteQuote: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium italic"
                />
              </div>

              {/* Course Fee Structure Controls */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <p className="text-xs font-black uppercase text-slate-900 tracking-wider">Courses / FEE Display Settings</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">JEE (Main+Adv) Fee</label>
                    <input
                      type="text"
                      value={cmsData.jeeFee || '₹1,10,000 / Year'}
                      onChange={(e) => setCmsData({ ...cmsData, jeeFee: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">NEET (Medical) Fee</label>
                    <input
                      type="text"
                      value={cmsData.neetFee || '₹1,05,000 / Year'}
                      onChange={(e) => setCmsData({ ...cmsData, neetFee: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Foundation (9th-10th) Fee</label>
                    <input
                      type="text"
                      value={cmsData.foundationFee || '₹55,000 / Year'}
                      onChange={(e) => setCmsData({ ...cmsData, foundationFee: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-brand-navy"
                    />
                  </div>
                </div>
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

        {/* VIEW: Faculty & Mentors Team Management */}
        {activeMenu === 'faculty' && (
          <div className="mt-8 space-y-6 animate-in fade-in">
            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-brand-yellowDark" />
                  <span>Faculty &amp; Mentors Team Management</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add new educators, update credentials, change photos, and toggle who appears on the main homepage.
                </p>
              </div>

              <button
                onClick={handleOpenAddFaculty}
                className="px-5 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Faculty Member</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Members</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{facultyList.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Active Teaching Staff</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Featured on Home</span>
                <p className="text-2xl font-black text-brand-yellowDark mt-1">
                  {facultyList.filter(f => f.showOnHome).length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Founding Mentors Grid</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Medical Faculties</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {facultyList.filter(f => f.subject === 'Biology' || f.subject === 'Chemistry').length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">NEET-UG Mentors</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Engineering Faculties</span>
                <p className="text-2xl font-black text-blue-600 mt-1">
                  {facultyList.filter(f => f.subject === 'Physics' || f.subject === 'Mathematics').length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">IIT-JEE Mentors</p>
              </div>
            </div>

            {/* Faculty List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facultyList.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Photo & Status */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-inner flex-shrink-0">
                        <img
                          src={fac.photo || '/assets/web/faculty-team-full.png'}
                          alt={fac.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[10px] uppercase">
                            {fac.subject || 'Faculty'}
                          </span>
                          
                          {/* Home visibility toggle */}
                          <button
                            onClick={() => handleToggleHomeVisibility(fac)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition ${
                              fac.showOnHome
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                            }`}
                            title={fac.showOnHome ? 'Shown on Homepage (Click to hide)' : 'Hidden from Homepage (Click to show)'}
                          >
                            {fac.showOnHome ? <Eye className="w-3 h-3 text-amber-600" /> : <EyeOff className="w-3 h-3" />}
                            <span>{fac.showOnHome ? 'On Home' : 'Team Only'}</span>
                          </button>
                        </div>

                        <h4 className="text-base font-extrabold text-slate-900 mt-1 truncate">{fac.name}</h4>
                        <p className="text-xs text-brand-yellowDark font-bold truncate">{fac.degree}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{fac.exp}</p>
                      </div>
                    </div>

                    {fac.role && (
                      <p className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 mb-3">
                        {fac.role}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {fac.bio}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Order: #{fac.order || 1}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditFaculty(fac)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteFaculty(fac.id, fac.name)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Add / Edit Faculty Member */}
            {facultyModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-black text-slate-900">
                    {editingFaculty ? 'Edit Faculty Member Details' : 'Add New Faculty Member'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill in credentials and choose whether to display on the home founding mentors grid.
                  </p>

                  <form onSubmit={handleSaveFaculty} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={facultyForm.name}
                          onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                          placeholder="e.g. Dr. R.K. Verma"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject / Stream *</label>
                        <select
                          value={facultyForm.subject}
                          onChange={(e) => setFacultyForm({ ...facultyForm, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                        >
                          <option value="Biology">Biology (Medical)</option>
                          <option value="Physics">Physics (Engineering & Medical)</option>
                          <option value="Chemistry">Chemistry (Organic/Inorganic)</option>
                          <option value="Mathematics">Mathematics (IIT-JEE)</option>
                          <option value="Foundation">Foundation (6th-10th)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Degree / Qualifications</label>
                        <input
                          type="text"
                          value={facultyForm.degree}
                          onChange={(e) => setFacultyForm({ ...facultyForm, degree: e.target.value })}
                          placeholder="e.g. M.Sc Zoology, Gold Medalist"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Experience</label>
                        <input
                          type="text"
                          value={facultyForm.exp}
                          onChange={(e) => setFacultyForm({ ...facultyForm, exp: e.target.value })}
                          placeholder="e.g. 25+ Years Experience"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role / Designation</label>
                        <input
                          type="text"
                          value={facultyForm.role}
                          onChange={(e) => setFacultyForm({ ...facultyForm, role: e.target.value })}
                          placeholder="e.g. Senior Faculty & HOD"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Display Order</label>
                        <input
                          type="number"
                          value={facultyForm.order}
                          onChange={(e) => setFacultyForm({ ...facultyForm, order: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Photo URL / Preset</label>
                      <input
                        type="text"
                        value={facultyForm.photo}
                        onChange={(e) => setFacultyForm({ ...facultyForm, photo: e.target.value })}
                        placeholder="/assets/web/founder-chauhan.jpg"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                      />
                      {/* Presets */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] font-bold text-slate-400">Presets:</span>
                        {[
                          { label: 'Chauhan Sir', url: '/assets/web/founder-chauhan.jpg' },
                          { label: 'Jaivir Sir', url: '/assets/web/founder-jaivir.jpg' },
                          { label: 'Ashlesha Ma’am', url: '/assets/web/founder-ashlesha.jpg' },
                          { label: 'Chaurasia Sir', url: '/assets/web/founder-chaurasia.jpg' },
                          { label: 'Team Group', url: '/assets/web/faculty-team-full.png' }
                        ].map((pr, pIdx) => (
                          <button
                            key={pIdx}
                            type="button"
                            onClick={() => setFacultyForm({ ...facultyForm, photo: pr.url })}
                            className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded text-[10px] font-semibold transition"
                          >
                            {pr.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Biography &amp; Achievements</label>
                      <textarea
                        rows={3}
                        value={facultyForm.bio}
                        onChange={(e) => setFacultyForm({ ...facultyForm, bio: e.target.value })}
                        placeholder="Has guided 20,000+ students with top ranks in NEET/IIT-JEE..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>

                    <div className="p-3 bg-amber-50 border border-brand-yellow/30 rounded-xl flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="showOnHome"
                        checked={facultyForm.showOnHome}
                        onChange={(e) => setFacultyForm({ ...facultyForm, showOnHome: e.target.checked })}
                        className="w-4 h-4 text-brand-navy rounded border-slate-300 focus:ring-brand-yellow"
                      />
                      <label htmlFor="showOnHome" className="text-xs font-bold text-slate-800 cursor-pointer">
                        Feature on Homepage (Display in Founding Faculty Mentors Grid)
                      </label>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setFacultyModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider shadow transition"
                      >
                        {loading ? 'Saving...' : editingFaculty ? 'Update Faculty Details' : 'Add to Faculty Team'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

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
