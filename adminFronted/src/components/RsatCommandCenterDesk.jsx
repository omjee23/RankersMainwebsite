import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  UserCheck,
  Users,
  X,
  Zap,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

export default function RsatCommandCenterDesk() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    selectedMonth: 'ALL',
    availableMonths: [],
    funnel: {
      signedUp: 0,
      scheduled: 0,
      attempted: 0,
      passed: 0,
      enrolled: 0
    },
    candidates: [],
    rsatPapers: [],
    enrolledStudents: []
  });

  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [streamFilter, setStreamFilter] = useState('ALL');

  // Paper Designer Modals
  const [createPaperModalOpen, setCreatePaperModalOpen] = useState(false);
  const [oldPapersModalOpen, setOldPapersModalOpen] = useState(false);
  const [savingPaper, setSavingPaper] = useState(false);

  const [newPaperForm, setNewPaperForm] = useState({
    title: '',
    stream: 'ALL',
    targetClass: 'Class 11',
    durationMinutes: 45,
    totalMarks: 120,
    totalQuestions: 30,
    makeActive: true
  });

  const fetchData = async (month = selectedMonth) => {
    setLoading(true);
    try {
      const res = await adminApi.getRSATCommandCenter({ month });
      if (res && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Failed to load RSAT command center data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(selectedMonth);
  }, [selectedMonth]);

  const activePaper = useMemo(() => {
    return (data.rsatPapers || []).find(p => p.active) || (data.rsatPapers || [])[0];
  }, [data.rsatPapers]);

  // Handle Paper Creation
  const handleCreatePaper = async (e) => {
    e.preventDefault();
    if (!newPaperForm.title.trim()) {
      alert('Please enter paper title.');
      return;
    }

    setSavingPaper(true);
    try {
      const res = await adminApi.createRSATPaper(newPaperForm);
      if (res && res.success) {
        alert('New RSAT Paper created successfully!');
        setCreatePaperModalOpen(false);
        fetchData();
      } else {
        alert(res?.message || 'Failed to create RSAT paper');
      }
    } catch (err) {
      alert('Error creating paper: ' + err.message);
    } finally {
      setSavingPaper(false);
    }
  };

  // Handle Set Active Paper
  const handleSetActivePaper = async (id, title) => {
    try {
      const res = await adminApi.setActiveRSATPaper(id);
      if (res && res.success) {
        alert(`RSAT Paper "${title}" is now ACTIVE on the website!`);
        fetchData();
      } else {
        alert(res?.message || 'Failed to set active paper');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // Filtered candidate rows
  const filteredCandidates = useMemo(() => {
    return (data.candidates || []).filter(c => {
      if (stageFilter !== 'ALL' && c.funnelStatus !== stageFilter) return false;
      if (streamFilter !== 'ALL' && c.stream !== streamFilter) return false;
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const mName = c.studentName?.toLowerCase().includes(q);
        const mRoll = c.rollNumber?.toLowerCase().includes(q);
        const mMobile = c.mobile?.includes(q);
        const mEmail = c.email?.toLowerCase().includes(q);
        if (!mName && !mRoll && !mMobile && !mEmail) return false;
      }
      return true;
    });
  }, [data.candidates, stageFilter, streamFilter, searchTerm]);

  // Download Master CSV Report
  const handleDownloadCSV = () => {
    const rows = [
      [
        'Roll_Number',
        'Candidate_Name',
        'Mobile_Number',
        'Email_Address',
        'Target_Stream',
        'Target_Class',
        'Funnel_Stage',
        'Fee_Payment_Status',
        'Fee_Paid_INR',
        'Cashfree_TXN_ID',
        'Scheduled_Date',
        'Scheduled_Time_Slot',
        'Exam_Attempted',
        'Exam_Score',
        'Accuracy_Percent',
        'Scholarship_Awarded',
        'Enrolled_Status',
        'Enrolled_Batch',
        'Registration_Date'
      ]
    ];

    filteredCandidates.forEach(c => {
      rows.push([
        c.rollNumber || '',
        `"${(c.studentName || '').replace(/"/g, '""')}"`,
        c.mobile || '',
        c.email || '',
        c.stream || '',
        c.targetClass || '',
        c.funnelStatus || '',
        c.paymentStatus || '',
        c.feePaid || 100,
        c.transactionId || '',
        c.scheduledSlot?.date || 'Immediate',
        `"${(c.scheduledSlot?.timeSlot || '').replace(/"/g, '""')}"`,
        c.examResult ? 'YES' : 'NO',
        c.examResult ? `${c.examResult.score}/${c.examResult.totalMarks}` : 'N/A',
        c.examResult ? `${c.examResult.accuracy}%` : 'N/A',
        c.examResult ? `${c.examResult.scholarshipPercent}%` : 'N/A',
        c.enrolledInfo ? 'ENROLLED' : 'PENDING',
        `"${(c.enrolledInfo?.batchName || '').replace(/"/g, '""')}"`,
        c.registeredAt || ''
      ]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RSAT_Master_Funnel_Report_${selectedMonth}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-10">
      
      {/* 1. TOP EXECUTIVE HEADER CARD */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-navyCard to-brand-navy text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-yellow/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-brand-yellow/15 to-transparent pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow text-xs font-black uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>RSAT Command Centre &bull; All-in-One Desk</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              RSAT Scholarship &amp; Examination Operations
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Unified command for RSAT question paper patterns, month-wise candidate funnels, scholarship awards, and enrolled student conversions.
            </p>
            
            {/* Active Live Paper Indicator */}
            {activePaper && (
              <div className="mt-3.5 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-brand-yellow font-black">Live Active Paper:</span>
                <span className="text-white truncate max-w-xs">{activePaper.title}</span>
                <span className="text-[10px] text-slate-300">({activePaper.totalQuestions} Qs &bull; {activePaper.durationMinutes} Mins)</span>
              </div>
            )}
          </div>

          {/* Action Button Suite */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => fetchData()}
              disabled={loading}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 text-white transition disabled:opacity-50"
              title="Refresh RSAT Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setCreatePaperModalOpen(true)}
              className="px-4 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New RSAT Paper</span>
            </button>

            <button
              type="button"
              onClick={() => setOldPapersModalOpen(true)}
              className="px-4 py-3 bg-white/15 hover:bg-white/25 text-white rounded-2xl font-black text-xs uppercase tracking-wider border border-white/20 transition flex items-center gap-2"
            >
              <Layers className="w-4 h-4" />
              <span>See Old Papers ({data.rsatPapers?.length || 0})</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCSV}
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel/CSV</span>
            </button>
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="mt-6 pt-5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Calendar className="w-4 h-4 text-brand-yellow" />
            <span>Select Funnel Timeline / Month:</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedMonth('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedMonth === 'ALL'
                  ? 'bg-brand-yellow text-brand-navy font-black shadow-sm'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              All Time
            </button>
            {(data.availableMonths || []).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedMonth === m
                    ? 'bg-brand-yellow text-brand-navy font-black shadow-sm'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. 5-STAGE COMPLETE FUNNEL METRICS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Stage 1: Signed Up */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">1. Signed Up</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600"><Users className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-slate-900">{data.funnel?.signedUp || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Students Registered</p>
        </div>

        {/* Stage 2: Scheduled */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">2. Scheduled Slot</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600"><Clock className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-indigo-950">{data.funnel?.scheduled || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Immediate / Later Slot</p>
        </div>

        {/* Stage 3: Exam Attempted */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">3. Exam Attempted</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600"><Zap className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-amber-950">{data.funnel?.attempted || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Completed CBT Test</p>
        </div>

        {/* Stage 4: Passed / Scholarship */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs relative overflow-hidden group hover:shadow-md transition">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">4. Scholarship Awarded</span>
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600"><Award className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-purple-950">{data.funnel?.passed || 0}</p>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">25% – 100% Waiver</p>
        </div>

        {/* Stage 5: Enrolled in Institute */}
        <div className="bg-white rounded-2xl p-4 border-2 border-emerald-500/40 bg-emerald-50/20 shadow-xs relative overflow-hidden group hover:shadow-md transition col-span-2 md:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">5. Converted / Enrolled</span>
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700"><GraduationCap className="w-4 h-4" /></span>
          </div>
          <p className="text-2xl font-black text-emerald-700">{data.funnel?.enrolled || 0}</p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">Admissions via RSAT</p>
        </div>
      </div>

      {/* 3. ENROLLED STUDENTS SOURCED VIA RSAT BANNER */}
      {data.enrolledStudents && data.enrolledStudents.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white rounded-2xl p-5 border border-emerald-200 shadow-xs">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-600 text-white rounded-xl shadow-xs"><GraduationCap className="w-4 h-4" /></span>
              <div>
                <h4 className="font-black text-sm text-emerald-950">
                  Enrolled Students Attributed to RSAT ({data.enrolledStudents.length} Students)
                </h4>
                <p className="text-[11px] text-slate-600">Students who appeared in RSAT and confirmed their regular classroom admission.</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-black text-xs">
              Direct Source: RSAT
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.enrolledStudents.map(e => (
              <div key={e.id} className="p-3.5 rounded-xl bg-white border border-emerald-200 shadow-2xs flex items-center justify-between gap-2">
                <div>
                  <h5 className="font-extrabold text-xs text-slate-900">{e.studentName}</h5>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {e.studentId || e.applicationNo}</p>
                  <p className="text-[10px] text-emerald-700 font-bold">{e.batchName}</p>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-100 text-emerald-800">
                    {e.scholarshipApplied}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">{e.stream}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. CANDIDATES SEARCH & FILTER BAR */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Funnel Stage Filter */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All Candidates' },
            { id: '1_SIGNED_UP_ONLY', label: '1. Signed Up' },
            { id: '2_FEE_PAID_PENDING_SCHEDULE', label: '2. Fee Paid' },
            { id: '3_SCHEDULED_AWAITING_EXAM', label: '3. Scheduled' },
            { id: '4_EXAM_COMPLETED', label: '4. Attempted' },
            { id: '5_ENROLLED_IN_INSTITUTE', label: '5. Enrolled' }
          ].map(stage => (
            <button
              key={stage.id}
              type="button"
              onClick={() => setStageFilter(stage.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                stageFilter === stage.id
                  ? 'bg-brand-navy text-brand-yellow font-black shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {stage.label}
            </button>
          ))}
        </div>

        {/* Stream & Search */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Streams</option>
            <option value="NEET">NEET</option>
            <option value="JEE">IIT-JEE</option>
            <option value="FOUNDATION">Foundation</option>
          </select>

          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search candidate, roll, mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* 5. CANDIDATE MASTER TABLE */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-navy" />
            <h3 className="font-black text-sm text-slate-900">
              RSAT Candidate Master Registry ({filteredCandidates.length} Candidates)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            Month: <strong className="text-slate-700">{selectedMonth}</strong>
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-navy mb-2" />
            <p className="font-bold text-sm text-slate-600">Loading RSAT candidate records...</p>
          </div>
        ) : filteredCandidates.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <p className="font-extrabold text-base text-slate-800">No RSAT candidates found</p>
            <p className="text-xs text-slate-500 mt-1">Try resetting the month or funnel stage filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] font-extrabold text-slate-500 uppercase border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Candidate &amp; Roll No</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Stream &amp; Class</th>
                  <th className="py-3 px-4">Funnel Stage</th>
                  <th className="py-3 px-4">Fee Status</th>
                  <th className="py-3 px-4">Slot / Timing</th>
                  <th className="py-3 px-4">Exam Score &amp; Award</th>
                  <th className="py-3 px-4">Admission Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    {/* Candidate */}
                    <td className="py-3.5 px-4">
                      <div className="font-extrabold text-slate-900">{c.studentName}</div>
                      <div className="text-[10px] font-mono text-brand-navy font-bold">{c.rollNumber}</div>
                    </td>

                    {/* Contact */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div>{c.mobile}</div>
                      <div className="text-[10px] text-slate-400 font-sans">{c.email || '—'}</div>
                    </td>

                    {/* Stream & Class */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                        c.stream === 'NEET' ? 'bg-emerald-100 text-emerald-800' :
                        c.stream === 'JEE' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {c.stream}
                      </span>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">{c.targetClass}</div>
                    </td>

                    {/* Funnel Stage */}
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        c.funnelStatus === '5_ENROLLED_IN_INSTITUTE' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        c.funnelStatus === '4_SCHOLARSHIP_AWARDED' ? 'bg-purple-100 text-purple-800' :
                        c.funnelStatus === '4_EXAM_COMPLETED' ? 'bg-amber-100 text-amber-800' :
                        c.funnelStatus === '3_SCHEDULED_AWAITING_EXAM' ? 'bg-blue-100 text-blue-800' :
                        c.funnelStatus === '2_FEE_PAID_PENDING_SCHEDULE' ? 'bg-teal-100 text-teal-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {c.funnelStatus.replace(/^\d_/, '').replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Fee Status */}
                    <td className="py-3.5 px-4 font-bold">
                      {c.paymentStatus === 'PAID' ? (
                        <div className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>₹{c.feePaid} Paid</span>
                        </div>
                      ) : (
                        <span className="text-amber-600">Pending</span>
                      )}
                      {c.transactionId && <div className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{c.transactionId}</div>}
                    </td>

                    {/* Slot */}
                    <td className="py-3.5 px-4">
                      {c.scheduledSlot ? (
                        <div>
                          <div className="font-bold text-slate-800">{c.scheduledSlot.date || 'Today'}</div>
                          <div className="text-[10px] text-slate-500">{c.scheduledSlot.timeSlot}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not set</span>
                      )}
                    </td>

                    {/* Exam Score & Scholarship */}
                    <td className="py-3.5 px-4">
                      {c.examResult ? (
                        <div>
                          <div className="font-black text-slate-900">{c.examResult.score}/{c.examResult.totalMarks} Marks</div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-purple-100 text-purple-800 mt-0.5 inline-block">
                            🏆 {c.examResult.scholarshipPercent}% Waiver
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Awaiting Exam</span>
                      )}
                    </td>

                    {/* Enrolled Status */}
                    <td className="py-3.5 px-4">
                      {c.enrolledInfo ? (
                        <div className="text-emerald-700 font-bold">
                          <div className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Enrolled!</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-normal">{c.enrolledInfo.batchName}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">Not Enrolled</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: CREATE NEW RSAT PAPER PATTERN                    */}
      {/* ========================================================= */}
      {createPaperModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-brand-yellow/20 text-brand-navy"><Plus className="w-5 h-5" /></span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">Create New RSAT Exam Paper</h3>
                  <p className="text-[11px] text-slate-500">Design a new scholarship exam pattern for students</p>
                </div>
              </div>
              <button onClick={() => setCreatePaperModalOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePaper} className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-900 font-bold">Paper Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RSAT 2026-27 Scholarship Paper - Batch B"
                  value={newPaperForm.title}
                  onChange={(e) => setNewPaperForm({ ...newPaperForm, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Target Stream</label>
                  <select
                    value={newPaperForm.stream}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, stream: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-yellow font-bold text-slate-800"
                  >
                    <option value="ALL">All Streams (Common)</option>
                    <option value="NEET">NEET-UG Focused</option>
                    <option value="JEE">IIT-JEE Focused</option>
                    <option value="FOUNDATION">Foundation (9th &amp; 10th)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Target Class</label>
                  <select
                    value={newPaperForm.targetClass}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, targetClass: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-yellow font-bold text-slate-800"
                  >
                    <option value="Class 11">Class 11th</option>
                    <option value="Class 12">Class 12th</option>
                    <option value="Dropper">Dropper / Repeater</option>
                    <option value="Class 9/10">Foundation (Class 9/10)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Duration (Mins)</label>
                  <input
                    type="number"
                    value={newPaperForm.durationMinutes}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, durationMinutes: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Total Marks</label>
                  <input
                    type="number"
                    value={newPaperForm.totalMarks}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, totalMarks: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Questions</label>
                  <input
                    type="number"
                    value={newPaperForm.totalQuestions}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, totalQuestions: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="block text-xs font-bold text-slate-900">Make Active Live Paper</span>
                  <span className="text-[10px] text-slate-500">Students taking the exam right now will receive this paper</span>
                </div>
                <input
                  type="checkbox"
                  checked={newPaperForm.makeActive}
                  onChange={(e) => setNewPaperForm({ ...newPaperForm, makeActive: e.target.checked })}
                  className="w-4 h-4 text-brand-navy rounded"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCreatePaperModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPaper}
                  className="px-5 py-2 rounded-xl bg-brand-navy hover:bg-[#081533] text-brand-yellow font-black shadow-md transition disabled:opacity-50"
                >
                  {savingPaper ? 'Creating...' : 'Save & Publish Paper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: SEE OLD PAPERS & ACTIVE SELECTION                */}
      {/* ========================================================= */}
      {oldPapersModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-100 text-blue-800"><Layers className="w-5 h-5" /></span>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">RSAT Exam Paper Archive</h3>
                  <p className="text-[11px] text-slate-500">View past designed papers and toggle which paper is live on website</p>
                </div>
              </div>
              <button onClick={() => setOldPapersModalOpen(false)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {(data.rsatPapers || []).map((paper) => (
                <div
                  key={paper.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                    paper.active
                      ? 'border-brand-navy bg-brand-yellow/10 ring-2 ring-brand-yellow shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-black text-sm text-slate-900">{paper.title}</h4>
                      {paper.active ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Live Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          Archive
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-1">
                      <span>Stream: <strong>{paper.stream}</strong></span>
                      <span>&bull;</span>
                      <span>Questions: <strong>{paper.totalQuestions}</strong></span>
                      <span>&bull;</span>
                      <span>Duration: <strong>{paper.durationMinutes} Mins</strong></span>
                      <span>&bull;</span>
                      <span>Marks: <strong>{paper.totalMarks}</strong></span>
                    </div>
                  </div>

                  <div>
                    {paper.active ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-black">
                        Active Paper ✓
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleSetActivePaper(paper.id, paper.title)}
                        className="px-3.5 py-1.5 rounded-xl bg-brand-navy hover:bg-[#081533] text-brand-yellow text-xs font-bold shadow-xs transition"
                      >
                        Set as Active Paper
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setOldPapersModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
