import React from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Send,
  FileSpreadsheet,
  Printer,
  Search,
  Check,
  Eye,
  Edit3,
  Share2,
  Users,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

export default function CbtExamsDesk({
  submissions = [],
  filteredSubmissions = [],
  testsList = [],
  filteredExams = [],
  examCategoryFilter,
  setExamCategoryFilter,
  examStreamFilter,
  setExamStreamFilter,
  examTierFilter,
  setExamTierFilter,
  submissionCategoryFilter,
  setSubmissionCategoryFilter,
  selectedExamFilter,
  setSelectedExamFilter,
  availableExamOptions = [],
  submissionPublishFilter,
  setSubmissionPublishFilter,
  submissionSearch,
  setSubmissionSearch,
  onOpenTestModal,
  handleDeleteTest,
  handleBulkPublish,
  handleDownloadExcelCsv,
  onOpenDirectorReport,
  onInspectSubmission,
  handleTogglePublishSubmission,
  handleOpenEditSubmission,
  handleDeleteSubmission,
  onOpenDirectorShare,
  onOpenParticipation,
  handleToggleLiveResult
}) {
  return (
    <div className="mt-8 space-y-8 animate-in fade-in">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Total CBT Submissions</span>
          <h3 className="text-3xl font-black text-brand-navy mt-1">{submissions.length}</h3>
          <p className="text-xs text-slate-500 mt-1">Across RSAT, RANKEX &amp; Test Series</p>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase">Published to Student Panel</span>
          <h3 className="text-3xl font-black text-emerald-600 mt-1">
            {submissions.filter(s => s.isPublished !== undefined ? s.isPublished : (s.category === 'RSAT')).length}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Visible on student scorecards</p>
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

      {/* Scheduled CBT Tests Section with Category & Batch Tier Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-yellowDark" />
              <span>Active &amp; Scheduled CBT Exam Windows</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Categorized into RSAT Scholarship, RANKEX 2027, and Enrolled Student Test Series
            </p>
          </div>
          <button
            onClick={onOpenTestModal}
            className="px-4 py-2.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase rounded-xl shadow flex items-center gap-1.5 transition"
          >
            <Plus className="w-4 h-4" /> Schedule New CBT Window
          </button>
        </div>

        {/* Main Exam Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-4">
          <button
            onClick={() => setExamCategoryFilter('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              examCategoryFilter === 'ALL'
                ? 'bg-brand-navy text-brand-yellow shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🌟 All CBT Exams ({testsList.length})
          </button>
          <button
            onClick={() => setExamCategoryFilter('RSAT')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              examCategoryFilter === 'RSAT'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🎓 RSAT Scholarship Tests ({testsList.filter(t => (t.category || t.examType) === 'RSAT').length})
          </button>
          <button
            onClick={() => setExamCategoryFilter('RANKEX')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              examCategoryFilter === 'RANKEX'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🏆 RANKEX 2027 Exams ({testsList.filter(t => (t.category || t.examType) === 'RANKEX').length})
          </button>
          <button
            onClick={() => setExamCategoryFilter('STUDENT_TEST_SERIES')}
            className={`px-4 py-2 rounded-xl text-xs font-black transition ${
              examCategoryFilter === 'STUDENT_TEST_SERIES'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            📚 Student Test Series ({testsList.filter(t => (t.category || 'STUDENT_TEST_SERIES') === 'STUDENT_TEST_SERIES' && t.examType !== 'RSAT' && t.examType !== 'RANKEX').length})
          </button>
        </div>

        {/* Sub-Filters for Student Test Series */}
        {examCategoryFilter === 'STUDENT_TEST_SERIES' && (
          <div className="p-4 bg-slate-50 rounded-2xl flex flex-wrap items-center gap-4 text-xs font-bold text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Stream:</span>
              <button
                onClick={() => setExamStreamFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg ${examStreamFilter === 'ALL' ? 'bg-brand-navy text-white' : 'bg-white text-slate-700'}`}
              >
                All
              </button>
              <button
                onClick={() => setExamStreamFilter('JEE')}
                className={`px-2.5 py-1 rounded-lg ${examStreamFilter === 'JEE' ? 'bg-blue-600 text-white' : 'bg-white text-slate-700'}`}
              >
                IIT-JEE
              </button>
              <button
                onClick={() => setExamStreamFilter('NEET')}
                className={`px-2.5 py-1 rounded-lg ${examStreamFilter === 'NEET' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-700'}`}
              >
                NEET-UG
              </button>
              <button
                onClick={() => setExamStreamFilter('FOUNDATION')}
                className={`px-2.5 py-1 rounded-lg ${examStreamFilter === 'FOUNDATION' ? 'bg-purple-600 text-white' : 'bg-white text-slate-700'}`}
              >
                Foundation PNCF
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400">Batch Tier:</span>
              {['ALL', 'DIAMOND', 'PLATINUM', 'SILVER', 'GREEN'].map(tier => (
                <button
                  key={tier}
                  onClick={() => setExamTierFilter(tier)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    examTierFilter === tier
                      ? tier === 'DIAMOND' ? 'bg-cyan-600 text-white'
                        : tier === 'PLATINUM' ? 'bg-indigo-600 text-white'
                        : tier === 'SILVER' ? 'bg-slate-700 text-white'
                        : tier === 'GREEN' ? 'bg-emerald-600 text-white'
                        : 'bg-brand-navy text-white'
                      : 'bg-white text-slate-700 border border-slate-200'
                  }`}
                >
                  {tier === 'DIAMOND' ? '💎 Diamond' : tier === 'PLATINUM' ? '🌟 Platinum' : tier === 'SILVER' ? '🥈 Silver' : tier === 'GREEN' ? '🟢 Green' : 'All Tiers'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tests Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
          {filteredExams.map(t => {
            const cat = t.category || (t.examType === 'RSAT' ? 'RSAT' : (t.examType === 'RANKEX' ? 'RANKEX' : 'STUDENT_TEST_SERIES'));
            const tier = t.batchTier || 'ALL';
            const subject = t.subject || 'FULL_MOCK';
            const pattern = t.patternType || t.examType || 'JEE_MAIN';
            const isApproved = t.directorApproval?.status === 'APPROVED';
            const isResultLive = t.resultPublishedToStudents !== false;

            return (
              <div key={t.id} className="p-5 rounded-3xl border-2 border-slate-200 bg-white hover:border-brand-navy space-y-3.5 shadow-xs transition flex flex-col justify-between">
                <div className="space-y-2.5">
                  
                  {/* Top Badges */}
                  <div className="flex items-center justify-between flex-wrap gap-1">
                    <span className={`px-2.5 py-0.5 rounded-full font-black text-[10px] uppercase tracking-wider ${
                      cat === 'RSAT' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      cat === 'RANKEX' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                      'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    }`}>
                      {cat === 'RSAT' ? '🎓 RSAT Scholarship' : cat === 'RANKEX' ? '🏆 RANKEX 2027' : '📚 Student Test Series'}
                    </span>

                    {/* Director Approval Status */}
                    {isApproved ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px] flex items-center gap-1 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Director Approved</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 font-extrabold text-[10px] flex items-center gap-1 border border-amber-200">
                        <AlertCircle className="w-3 h-3 text-amber-600" />
                        <span>Awaiting Director</span>
                      </span>
                    )}
                  </div>

                  {/* Pattern & Tier Row */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-brand-navy text-brand-yellow font-black text-[10px] uppercase">
                      {pattern === 'JEE_ADVANCED' ? '🎯 JEE Advanced' :
                       pattern === 'NEET_UG' || pattern === 'NEET' ? '🩺 NEET-UG' :
                       pattern === 'FOUNDATION_PNCF' || pattern === 'FOUNDATION' ? '🌱 Foundation PNCF' :
                       '🚀 JEE Main'}
                    </span>

                    {tier !== 'ALL' && (
                      <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                        tier === 'DIAMOND' ? 'bg-cyan-100 text-cyan-800' :
                        tier === 'PLATINUM' ? 'bg-indigo-100 text-indigo-800' :
                        tier === 'SILVER' ? 'bg-slate-200 text-slate-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {tier === 'DIAMOND' ? '💎 Diamond' : tier === 'PLATINUM' ? '🌟 Platinum' : tier === 'SILVER' ? '🥈 Silver' : '🟢 Green'}
                      </span>
                    )}

                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold text-[10px]">
                      {t.stream === 'ALL' ? 'All Streams' : t.stream}
                    </span>

                    {/* Results Live Badge */}
                    <span className={`px-2 py-0.5 rounded font-extrabold text-[10px] ${
                      isResultLive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {isResultLive ? '📢 Results Live' : '🔒 Results Hidden'}
                    </span>
                  </div>

                  {/* Title & Metadata */}
                  <div>
                    <h4 className="text-base font-extrabold text-slate-900 leading-snug">{t.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {t.durationMinutes} Mins &bull; {t.totalMarks} Marks &bull; {t.totalQuestions || 90} Questions
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-500 truncate">
                    Batch: <strong>{t.targetBatch || 'ALL'}</strong> &bull; Class: <strong>{t.classLevel || 'Class 12'}</strong>
                  </p>

                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Share with Director */}
                    <button
                      type="button"
                      onClick={() => onOpenDirectorShare && onOpenDirectorShare(t)}
                      className="px-2.5 py-1.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-bold text-[11px] flex items-center justify-center gap-1 shadow-xs transition"
                      title="Share paper details to Director via WhatsApp or Email"
                    >
                      <Share2 className="w-3 h-3 text-brand-yellow" />
                      <span>Director Approval</span>
                    </button>

                    {/* Student Participation & Attendance */}
                    <button
                      type="button"
                      onClick={() => onOpenParticipation && onOpenParticipation(t)}
                      className="px-2.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center gap-1 transition"
                      title="View who attempted vs who missed this exam"
                    >
                      <Users className="w-3 h-3 text-blue-600" />
                      <span>Attendance &amp; Merit</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    {/* 1-Click Excel Sheet Download for this exam */}
                    <button
                      type="button"
                      onClick={() => window.open(adminApi.getDirectorExamSheetUrl(t.id), '_blank')}
                      className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition"
                      title="Download Director CSV Marks Sheet"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Director Sheet (CSV)</span>
                    </button>

                    {/* Delete Test */}
                    <button
                      type="button"
                      onClick={() => handleDeleteTest(t.id)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                      title="Delete Test Window"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Live Student CBT Submissions & Results Desk */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Live Student CBT Submissions &amp; Scorecards</span>
            </h3>
            <p className="text-xs text-slate-500">
              Real-time grading with admin evaluation control: Edit marks, delete invalid attempts, or toggle "Send to Student Panel"
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => handleBulkPublish(true)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow flex items-center gap-1.5 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send All Filtered to Student Panel</span>
            </button>

            {/* 1-Click Complete Marks Excel CSV Export */}
            <button
              onClick={handleDownloadExcelCsv}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-black shadow flex items-center gap-1.5 transition"
              title="Export complete marks sheet with UTF-8 BOM for Microsoft Excel & Google Sheets"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download Complete Marks Excel Sheet (CSV)</span>
            </button>

            {/* Printable Executive Director's Report */}
            <button
              onClick={onOpenDirectorReport}
              className="px-4 py-2 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl text-xs font-black shadow flex items-center gap-1.5 transition"
              title="Open Director's Printable Executive Merit Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF Director's Report</span>
            </button>
          </div>
        </div>

        {/* Submissions Filter Toolbar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-black uppercase text-slate-400">Category:</span>
            <button
              onClick={() => setSubmissionCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${submissionCategoryFilter === 'ALL' ? 'bg-brand-navy text-brand-yellow' : 'bg-white text-slate-600'}`}
            >
              All ({submissions.length})
            </button>
            <button
              onClick={() => setSubmissionCategoryFilter('RSAT')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${submissionCategoryFilter === 'RSAT' ? 'bg-amber-500 text-white' : 'bg-white text-slate-600'}`}
            >
              RSAT
            </button>
            <button
              onClick={() => setSubmissionCategoryFilter('RANKEX')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${submissionCategoryFilter === 'RANKEX' ? 'bg-purple-600 text-white' : 'bg-white text-slate-600'}`}
            >
              RANKEX
            </button>
            <button
              onClick={() => setSubmissionCategoryFilter('STUDENT_TEST_SERIES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${submissionCategoryFilter === 'STUDENT_TEST_SERIES' ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'}`}
            >
              Student Test Series
            </button>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Specific Exam Filter Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-black uppercase text-slate-400">Filter Exam:</span>
              <select
                value={selectedExamFilter}
                onChange={(e) => setSelectedExamFilter(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 max-w-xs truncate focus:outline-none"
              >
                <option value="ALL">All Scheduled &amp; Attempted Exams</option>
                {availableExamOptions.map(exam => (
                  <option key={exam} value={exam}>{exam}</option>
                ))}
              </select>
            </div>

            <select
              value={submissionPublishFilter}
              onChange={(e) => setSubmissionPublishFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700"
            >
              <option value="ALL">All Publication States</option>
              <option value="PUBLISHED">Published to Students</option>
              <option value="PENDING">Pending / Draft</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search candidate..."
                value={submissionSearch}
                onChange={(e) => setSubmissionSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 w-44 focus:w-56 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                <th className="py-3 px-4">Candidate</th>
                <th className="py-3 px-4">Exam &amp; Category</th>
                <th className="py-3 px-4">Score (+4 / -1)</th>
                <th className="py-3 px-4">Accuracy</th>
                <th className="py-3 px-4">Scholarship / Slab</th>
                <th className="py-3 px-4">Anti-Cheat</th>
                <th className="py-3 px-4">Student Panel Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-bold text-xs">
                    No exam submissions found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub, idx) => {
                  const subCat = sub.category || (sub.examType === 'RSAT' || (sub.examTitle && sub.examTitle.includes('RSAT')) ? 'RSAT' : (sub.examType === 'RANKEX' || (sub.examTitle && sub.examTitle.includes('RANKEX')) ? 'RANKEX' : 'STUDENT_TEST_SERIES'));
                  const isPublished = sub.isPublished !== undefined ? sub.isPublished : (subCat === 'RSAT');

                  return (
                    <tr key={sub.id || idx} className="hover:bg-slate-50 transition">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{sub.studentName}</p>
                        <p className="font-mono text-xs text-slate-500">+91-{sub.mobile}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase mb-1 ${
                          subCat === 'RSAT' ? 'bg-amber-100 text-amber-800' :
                          subCat === 'RANKEX' ? 'bg-purple-100 text-purple-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {subCat}
                        </span>
                        <p className="text-xs font-semibold text-brand-navy max-w-xs truncate">{sub.examTitle}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-black text-slate-900 text-sm">{sub.score}</span>
                        <span className="text-slate-400 text-xs"> / {sub.maxMarks}</span>
                      </td>
                      <td className="py-3 px-4 font-bold text-brand-yellowDark">
                        {sub.percentage}%
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-xs">
                          {sub.scholarshipPercent || 50}% Off
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {sub.tabSwitchCount && sub.tabSwitchCount > 0 ? (
                          <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px]">
                            ⚠️ {sub.tabSwitchCount} Switches
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                            Clean ✓
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {isPublished ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
                            <Check className="w-3 h-3 text-emerald-700" /> Published to Student
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-[11px]">
                            ⏳ Pending Verification
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Send to Student Panel / Unpublish toggle */}
                          <button
                            type="button"
                            onClick={() => handleTogglePublishSubmission(sub.id)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                              isPublished
                                ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                            }`}
                            title={isPublished ? 'Unpublish from Student Panel' : 'Send to Student Panel'}
                          >
                            {isPublished ? (
                              <span>Unpublish</span>
                            ) : (
                              <>
                                <Send className="w-3 h-3" />
                                <span>Send to Student</span>
                              </>
                            )}
                          </button>

                          {/* Inspect Full Candidate Answer Sheet */}
                          <button
                            type="button"
                            onClick={() => onInspectSubmission(sub)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 transition"
                            title="Inspect Full Question-by-Question Answer Sheet"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Marks */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditSubmission(sub)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-brand-yellow hover:text-brand-navy text-slate-600 transition"
                            title="Edit Marks &amp; Remarks"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete Submission */}
                          <button
                            type="button"
                            onClick={() => handleDeleteSubmission(sub.id)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition"
                            title="Delete Invalid Submission"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
