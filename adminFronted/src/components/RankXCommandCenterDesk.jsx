import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  GraduationCap,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Sparkles,
  TrendingUp,
  X,
  Zap,
  Check,
  AlertCircle,
  Eye,
  CreditCard,
  QrCode
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

export default function RankXCommandCenterDesk() {
  const [data, setData] = useState({
    selectedMonth: 'ALL',
    availableMonths: ['2026-10', '2026-09'],
    funnel: {
      signedUp: 0,
      paidOrScheduled: 0,
      attempted: 0,
      passed: 0,
      enrolled: 0
    },
    candidates: [],
    rankxPapers: [],
    enrolledStudents: []
  });

  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('ALL');

  // Modals
  const [createPaperModalOpen, setCreatePaperModalOpen] = useState(false);
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [savingPaper, setSavingPaper] = useState(false);

  // New Paper Form State
  const [newPaperForm, setNewPaperForm] = useState({
    title: 'RANKEX 2027 All-India Talent Search Exam Pattern 02',
    stream: 'ALL',
    targetClass: 'Class 11',
    durationMinutes: 60,
    totalMarks: 160,
    totalQuestions: 40,
    makeActive: true
  });

  // Load Data
  const loadCommandCenterData = async (monthToFetch = selectedMonth) => {
    setLoading(true);
    try {
      const res = await adminApi.getRankXCommandCenter({ month: monthToFetch });
      if (res.success && res.data) {
        setData(res.data);
      }
    } catch (err) {
      console.error('Error fetching RankX command center data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommandCenterData(selectedMonth);
  }, [selectedMonth]);

  // Active Paper (Current Live Paper for Students)
  const activePaper = useMemo(() => {
    return (data.rankxPapers || []).find(p => p.active) || (data.rankxPapers || [])[0];
  }, [data.rankxPapers]);

  // Filtered Candidates
  const filteredCandidates = useMemo(() => {
    return (data.candidates || []).filter(c => {
      const matchesSearch =
        searchQuery === '' ||
        c.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.mobile?.includes(searchQuery) ||
        c.rollNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStage =
        stageFilter === 'ALL' ||
        (stageFilter === 'ENROLLED' && c.isEnrolled) ||
        (stageFilter === 'PASSED' && c.hasPassed) ||
        (stageFilter === 'ATTEMPTED' && c.hasAttempted) ||
        (stageFilter === 'PAID' && c.paymentStatus === 'PAID') ||
        (stageFilter === 'PENDING' && c.paymentStatus !== 'PAID');

      return matchesSearch && matchesStage;
    });
  }, [data.candidates, searchQuery, stageFilter]);

  // Handle Set Active Paper
  const handleSetActivePaper = async (id, title) => {
    try {
      const res = await adminApi.setActiveRankXPaper(id);
      if (res.success) {
        alert(`RANKEX Paper "${title}" is now ACTIVE on the website!`);
        await loadCommandCenterData(selectedMonth);
      } else {
        alert(res?.message || 'Failed to set active paper');
      }
    } catch (err) {
      alert('Error updating active paper');
    }
  };

  // Handle Create Paper Submit
  const handleCreatePaperSubmit = async (e) => {
    e.preventDefault();
    setSavingPaper(true);
    try {
      const res = await adminApi.createRankXPaper(newPaperForm);
      if (res.success) {
        alert(`New RANKEX Paper "${newPaperForm.title}" created successfully!`);
        setCreatePaperModalOpen(false);
        await loadCommandCenterData(selectedMonth);
      } else {
        alert(res?.message || 'Error creating paper');
      }
    } catch (err) {
      alert('Network error while creating paper');
    } finally {
      setSavingPaper(false);
    }
  };

  // 1-Click Master CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Roll Number',
      'Candidate Name',
      'Mobile',
      'Email',
      'Target Class',
      'Stream',
      'School Name',
      'Exam Mode',
      'Exam Centre',
      'Scheduled Date',
      'Scheduled Timing',
      'Reschedule Count',
      'Fee Paid (INR)',
      'Payment Status',
      'CBT Score',
      'Total Marks',
      'Accuracy %',
      'Scholarship %',
      'Institute Enrolled'
    ];

    const rows = filteredCandidates.map(c => [
      `"${c.rollNumber || ''}"`,
      `"${c.studentName || ''}"`,
      `"${c.mobile || ''}"`,
      `"${c.email || ''}"`,
      `"${c.targetClass || ''}"`,
      `"${c.stream || ''}"`,
      `"${c.schoolName || ''}"`,
      `"${c.examMode || 'ONLINE'}"`,
      `"${c.centreName || ''}"`,
      `"${c.examDate || ''}"`,
      `"${c.examTiming || ''}"`,
      `"${c.rescheduleCount || 0}"`,
      `"${c.feePaid || 0}"`,
      `"${c.paymentStatus || 'PENDING'}"`,
      `"${c.score !== null ? c.score : 'N/A'}"`,
      `"${c.totalMarks || 160}"`,
      `"${c.accuracy !== null ? `${c.accuracy}%` : 'N/A'}"`,
      `"${c.scholarshipPercent ? `${c.scholarshipPercent}%` : '0%'}"`,
      `"${c.isEnrolled ? `YES (${c.enrolledInfo?.admissionNo || 'Admitted'})` : 'NO'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `RANKEX_Master_Report_${selectedMonth}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-12">
      {/* ======================================================== */}
      {/* 1. EXECUTIVE HEADER & ACTIONS                            */}
      {/* ======================================================== */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-brand-yellow text-brand-navy font-black text-xs uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-brand-navy" />
                RANKEX 2027 Command Centre
              </span>
              <span className="text-xs text-slate-400 font-bold">
                160 Marks &bull; 40 Qs &bull; Kota Marking (+4, -1)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">
              RANKEX Talent Search &amp; Scholarship Desk
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Unified command center to design RANKEX papers, track student acquisition funnel, monitor slot rescheduling, verify ₹100 payments, and attribute converted institute admissions.
            </p>

            {/* Active Live Paper Indicator */}
            {activePaper && (
              <div className="pt-2 flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-brand-yellow font-black">Live Active Paper:</span>
                <span className="text-white truncate max-w-xs">{activePaper.title}</span>
                <span className="text-[10px] text-slate-300">({activePaper.totalQuestions} Qs &bull; {activePaper.durationMinutes} Mins)</span>
              </div>
            )}
          </div>

          {/* Action Button Suite */}
          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
            {/* Create New Paper Button */}
            <button
              onClick={() => setCreatePaperModalOpen(true)}
              className="px-4 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Create New RANKEX Paper</span>
            </button>

            {/* See Old Papers Button */}
            <button
              onClick={() => setArchiveModalOpen(true)}
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold text-xs uppercase tracking-wider border border-slate-700 transition flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-brand-yellow" />
              <span>See Old Papers ({data.rankxPapers?.length || 0})</span>
            </button>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-xs uppercase tracking-wider shadow-md transition flex items-center gap-2"
              title="Download Master 19-Column Excel Report"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel (CSV)</span>
            </button>

            {/* Refresh Button */}
            <button
              onClick={() => loadCommandCenterData(selectedMonth)}
              className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-2xl border border-slate-700 transition"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-yellow' : ''}`} />
            </button>
          </div>
        </div>

        {/* Month Filter Selector Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5 mr-1">
              <Calendar className="w-3.5 h-3.5" />
              Timeline Filter:
            </span>

            <button
              onClick={() => setSelectedMonth('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                selectedMonth === 'ALL'
                  ? 'bg-brand-yellow text-brand-navy shadow'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              All Time
            </button>

            {data.availableMonths.map(m => (
              <button
                key={m}
                onClick={() => setSelectedMonth(m)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition ${
                  selectedMonth === m
                    ? 'bg-brand-yellow text-brand-navy shadow'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400">
            Showing stats for: <strong className="text-white">{selectedMonth === 'ALL' ? 'All Records to Date' : `Month: ${selectedMonth}`}</strong>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. 5-STAGE FUNNEL KPI CARDS                              */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Stage 1: Signed Up */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Stage 1</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900">{data.funnel.signedUp}</p>
            <p className="text-xs font-bold text-slate-600 mt-0.5">Signed Up / Registered</p>
          </div>
          <span className="text-[10px] text-slate-400 block">Total RANKEX candidates</span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
        </div>

        {/* Stage 2: Paid or Scheduled */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Stage 2</span>
            <CreditCard className="w-4 h-4 text-amber-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-amber-600">{data.funnel.paidOrScheduled}</p>
            <p className="text-xs font-bold text-slate-600 mt-0.5">Fee Paid / Scheduled</p>
          </div>
          <span className="text-[10px] text-slate-400 block">Admit Card Generated</span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
        </div>

        {/* Stage 3: Exam Attempted */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Stage 3</span>
            <Zap className="w-4 h-4 text-purple-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-purple-600">{data.funnel.attempted}</p>
            <p className="text-xs font-bold text-slate-600 mt-0.5">Exam Attempted</p>
          </div>
          <span className="text-[10px] text-slate-400 block">CBT submissions evaluated</span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
        </div>

        {/* Stage 4: Passed / Awarded */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Stage 4</span>
            <Award className="w-4 h-4 text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-emerald-600">{data.funnel.passed}</p>
            <p className="text-xs font-bold text-slate-600 mt-0.5">Passed / Scholarship</p>
          </div>
          <span className="text-[10px] text-slate-400 block">Qualifying 25%–100% waiver</span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-emerald-500" />
        </div>

        {/* Stage 5: Enrolled in Institute */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Stage 5</span>
            <GraduationCap className="w-4 h-4 text-rose-500" />
          </div>
          <div>
            <p className="text-2xl font-black text-rose-600">{data.funnel.enrolled}</p>
            <p className="text-xs font-bold text-slate-600 mt-0.5">Enrolled in Institute</p>
          </div>
          <span className="text-[10px] text-slate-400 block">Admissions linked to RANKEX</span>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. ENROLLED ADMISSIONS ATTRIBUTION CARD                  */}
      {/* ======================================================== */}
      {data.enrolledStudents && data.enrolledStudents.length > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-3xl p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="text-sm font-extrabold text-emerald-950 uppercase tracking-wide">
                  Enrolled Students Originating via RANKEX ({data.enrolledStudents.length})
                </h3>
              </div>
              <p className="text-xs text-emerald-700 mt-0.5">
                These students registered for RANKEX and subsequently converted to full classroom admission at Rankers Path.
              </p>
            </div>
            <span className="text-xs font-black bg-emerald-600 text-white px-3 py-1 rounded-full">
              High Conversion Funnel
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.enrolledStudents.map(student => (
              <div key={student.id} className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{student.studentName}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-900 font-extrabold px-2 py-0.5 rounded-full">
                    {student.scholarshipApplied}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <p>Admission No: <strong className="font-mono text-slate-800">{student.applicationNo}</strong></p>
                  <p>Mobile: <strong className="text-slate-800">{student.mobile}</strong> &bull; Class: <strong className="text-slate-800">{student.targetClass}</strong></p>
                  <p>Batch: <strong className="text-slate-800">{student.batchName}</strong></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. MASTER CANDIDATE REGISTRY TABLE                       */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Table Filter & Search Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">
              RANKEX Candidate Registry &amp; Examination Records
            </h2>
            <p className="text-xs text-slate-500">
              Displaying {filteredCandidates.length} of {data.candidates.length} registered candidates
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search name, mobile, roll no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-brand-yellow focus:outline-none"
              />
            </div>

            {/* Stage Filter */}
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-brand-yellow focus:outline-none"
            >
              <option value="ALL">All Funnel Stages</option>
              <option value="PAID">₹100 Paid Only</option>
              <option value="PENDING">Payment Pending</option>
              <option value="ATTEMPTED">Exam Attempted</option>
              <option value="PASSED">Scholarship Awarded</option>
              <option value="ENROLLED">Enrolled in Institute</option>
            </select>
          </div>
        </div>

        {/* Master Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 text-slate-500 uppercase text-[10px] font-black tracking-wider border-b border-slate-200">
                <th className="p-3.5">Roll No &amp; Name</th>
                <th className="p-3.5">Mobile &amp; Email</th>
                <th className="p-3.5">Class &amp; Stream</th>
                <th className="p-3.5">Mode &amp; Centre</th>
                <th className="p-3.5">Scheduled Slot &amp; Reschedules</th>
                <th className="p-3.5">Fee Status</th>
                <th className="p-3.5">CBT Score &amp; Accuracy</th>
                <th className="p-3.5">Scholarship %</th>
                <th className="p-3.5">Stage / Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan="9" className="p-8 text-center text-slate-400 font-bold">
                    No RANKEX candidates match the current search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map(candidate => (
                  <tr key={candidate.id} className="hover:bg-slate-50/70 transition">
                    {/* Roll No & Name */}
                    <td className="p-3.5">
                      <span className="font-mono font-bold text-slate-500 text-[11px] block">{candidate.rollNumber}</span>
                      <strong className="text-slate-900 font-extrabold">{candidate.studentName}</strong>
                    </td>

                    {/* Mobile & Email */}
                    <td className="p-3.5">
                      <span className="font-mono text-slate-900 font-bold block">{candidate.mobile}</span>
                      <span className="text-[11px] text-slate-400">{candidate.email || '—'}</span>
                    </td>

                    {/* Class & Stream */}
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 font-bold text-slate-700 text-[10px] mr-1">
                        {candidate.stream}
                      </span>
                      <span className="text-slate-600 font-semibold">{candidate.targetClass}</span>
                    </td>

                    {/* Mode & Centre */}
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        candidate.examMode === 'ONLINE' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'
                      }`}>
                        {candidate.examMode || 'ONLINE'}
                      </span>
                      <p className="text-[11px] text-slate-500 truncate max-w-[120px] mt-0.5">{candidate.centreName}</p>
                    </td>

                    {/* Scheduled Slot */}
                    <td className="p-3.5">
                      <span className="text-slate-900 font-bold block">{candidate.examDate}</span>
                      <span className="text-[11px] text-slate-500 block">{candidate.examTiming}</span>
                      {candidate.rescheduleCount > 0 && (
                        <span className="text-[9px] bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded font-bold">
                          Rescheduled ({candidate.rescheduleCount}x)
                        </span>
                      )}
                    </td>

                    {/* Fee Status */}
                    <td className="p-3.5">
                      {candidate.paymentStatus === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px]">
                          <CheckCircle2 className="w-3 h-3" /> ₹100 PAID
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                          <AlertCircle className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </td>

                    {/* CBT Score */}
                    <td className="p-3.5">
                      {candidate.score !== null ? (
                        <div>
                          <strong className="text-slate-900 font-mono text-sm">{candidate.score}</strong>
                          <span className="text-slate-400 font-mono text-[11px]">/{candidate.totalMarks || 160}</span>
                          {candidate.accuracy !== null && (
                            <span className="block text-[10px] text-emerald-700 font-bold">Acc: {candidate.accuracy}%</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium italic">Not Attempted</span>
                      )}
                    </td>

                    {/* Scholarship % */}
                    <td className="p-3.5">
                      {candidate.scholarshipPercent ? (
                        <span className="px-2.5 py-1 rounded-full bg-brand-yellow/30 text-brand-navy font-black text-[11px]">
                          {candidate.scholarshipPercent}% Waiver
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">0%</span>
                      )}
                    </td>

                    {/* Stage / Status */}
                    <td className="p-3.5">
                      {candidate.isEnrolled ? (
                        <span className="px-2.5 py-1 rounded-full bg-rose-100 text-rose-800 font-black text-[10px] flex items-center gap-1 w-max">
                          <GraduationCap className="w-3 h-3" /> ENROLLED ({candidate.enrolledInfo?.admissionNo})
                        </span>
                      ) : candidate.hasPassed ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] w-max block">
                          SCHOLARSHIP WON
                        </span>
                      ) : candidate.hasAttempted ? (
                        <span className="px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 font-bold text-[10px] w-max block">
                          EXAM GIVEN
                        </span>
                      ) : candidate.paymentStatus === 'PAID' ? (
                        <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] w-max block">
                          ADMIT CARD READY
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium text-[10px] w-max block">
                          SIGNED UP
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MODAL 1: CREATE NEW RANKEX PAPER                         */}
      {/* ======================================================== */}
      {createPaperModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-brand-yellow/20 text-brand-navy flex items-center justify-center font-bold">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Design New RANKEX Exam Paper</h3>
                  <p className="text-xs text-slate-500">Create a new test pattern blueprint for RANKEX candidates.</p>
                </div>
              </div>
              <button
                onClick={() => setCreatePaperModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePaperSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Paper Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RANKEX 2027 All-India Scholarship Test (Phase 2)"
                  value={newPaperForm.title}
                  onChange={(e) => setNewPaperForm({ ...newPaperForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-bold focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Target Stream *</label>
                  <select
                    value={newPaperForm.stream}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, stream: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                  >
                    <option value="ALL">ALL Streams (Common Aptitude)</option>
                    <option value="IIT_JEE">IIT-JEE (Maths, Physics, Chem)</option>
                    <option value="NEET">NEET-UG (Biology, Physics, Chem)</option>
                    <option value="FOUNDATION">Foundation (9th &amp; 10th)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Target Class *</label>
                  <select
                    value={newPaperForm.targetClass}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, targetClass: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                  >
                    <option value="Class 11">Class 11th Moving</option>
                    <option value="Class 12">Class 12th Moving</option>
                    <option value="Dropper">Dropper / Target Repeater</option>
                    <option value="Class 9">Class 9th</option>
                    <option value="Class 10">Class 10th</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Questions</label>
                  <input
                    type="number"
                    min="10"
                    max="180"
                    value={newPaperForm.totalQuestions}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, totalQuestions: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Marks</label>
                  <input
                    type="number"
                    min="40"
                    max="720"
                    value={newPaperForm.totalMarks}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, totalMarks: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="15"
                    max="180"
                    value={newPaperForm.durationMinutes}
                    onChange={(e) => setNewPaperForm({ ...newPaperForm, durationMinutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold"
                  />
                </div>
              </div>

              {/* Make Active Toggle */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="block text-xs font-bold text-slate-900">Make Active Live Paper</span>
                  <span className="text-[11px] text-slate-500">Students giving the test will instantly receive this paper pattern.</span>
                </div>
                <input
                  type="checkbox"
                  className="w-4 h-4 text-brand-navy rounded focus:ring-brand-yellow"
                  checked={newPaperForm.makeActive}
                  onChange={(e) => setNewPaperForm({ ...newPaperForm, makeActive: e.target.checked })}
                />
              </div>

              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCreatePaperModalOpen(false)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPaper}
                  className="flex-1 py-3 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black uppercase tracking-wider shadow-sm"
                >
                  {savingPaper ? 'Creating Paper...' : 'Create & Save Paper'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: SEE OLD PAPERS & ACTIVE SELECTION                */}
      {/* ======================================================== */}
      {archiveModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <Layers className="w-6 h-6 text-brand-navy" />
                <div>
                  <h3 className="text-lg font-black text-slate-900">All Designed RANKEX Papers</h3>
                  <p className="text-xs text-slate-500">Review past papers and switch which paper is currently active on the website.</p>
                </div>
              </div>
              <button onClick={() => setArchiveModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto space-y-3 pt-2">
              {(data.rankxPapers || []).map(paper => (
                <div
                  key={paper.id}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    paper.active
                      ? 'bg-amber-50/60 border-brand-yellow shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{paper.title}</h4>
                      {paper.active ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black uppercase flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Live Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[9px] font-bold uppercase">
                          Archived
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      ID: <span className="font-mono">{paper.id}</span> &bull; {paper.totalQuestions} Questions &bull; {paper.totalMarks} Marks &bull; {paper.durationMinutes} Minutes
                    </p>
                    <span className="text-[10px] text-slate-400 block">
                      Target: {paper.stream} &bull; Created: {new Date(paper.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div>
                    {paper.active ? (
                      <span className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-black text-xs">
                        Active Paper ✓
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetActivePaper(paper.id, paper.title)}
                        className="px-3.5 py-2 rounded-xl bg-brand-navy hover:bg-slate-800 text-brand-yellow font-black text-xs transition"
                      >
                        Set as Active Paper
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setArchiveModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
              >
                Close Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
