import React from 'react';
import { Printer, FileSpreadsheet, X } from 'lucide-react';

export default function DirectorReportModal({
  isOpen,
  onClose,
  selectedExamFilter,
  filteredSubmissions,
  onDownloadExcelCsv
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 print:p-0 print:shadow-none print:max-h-none print:overflow-visible">
        
        {/* Modal Actions Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-yellow/30 text-brand-navy">
              <Printer className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">Director's Executive Marks &amp; Merit Report</h3>
              <p className="text-xs text-slate-500">Official confidential candidate evaluation dossier ready for printing or PDF export.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase rounded-xl shadow flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onDownloadExcelCsv}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase rounded-xl shadow flex items-center gap-1.5 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Download Excel</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="space-y-6">
          {/* Official Letterhead Header */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-brand-yellow/30 print:bg-white print:text-black print:border-b-2 print:border-black print:p-2">
            <div className="text-center sm:text-left">
              <span className="text-[10px] uppercase tracking-widest font-black text-brand-yellow print:text-black">
                Kota Coaching System &bull; Indore Head Office
              </span>
              <h2 className="text-2xl font-black mt-1">RANKERS PATH EDUCATIONAL INSTITUTE</h2>
              <p className="text-xs text-slate-300 mt-0.5 print:text-slate-600">
                Vijay Nagar Main Campus, Indore (M.P.) &bull; Contact: +91 91314 35511 &bull; info@rankerspath.in
              </p>
            </div>
            <div className="text-right sm:text-right border-t sm:border-t-0 sm:border-l border-white/20 sm:pl-4 print:text-black print:border-black">
              <span className="text-[10px] uppercase text-brand-yellow font-black block print:text-black">
                ACADEMIC AUDIT DOSSIER
              </span>
              <span className="text-xs font-mono font-bold block mt-1">
                Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-[10px] text-slate-300 block print:text-slate-600">
                Filter: {selectedExamFilter === 'ALL' ? 'All Exams' : selectedExamFilter}
              </span>
            </div>
          </div>

          {/* Key Metric Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Candidates Evaluated</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{filteredSubmissions.length}</p>
              <span className="text-[10px] text-slate-500">Total Attempts Recorded</span>
            </div>

            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200">
              <span className="text-[10px] font-bold text-blue-700 uppercase">Batch Average Score</span>
              <p className="text-2xl font-black text-blue-950 mt-1">
                {filteredSubmissions.length > 0
                  ? Math.round(filteredSubmissions.reduce((acc, s) => acc + (s.percentage || 0), 0) / filteredSubmissions.length)
                  : 68}%
              </p>
              <span className="text-[10px] text-blue-600">Mean Accuracy Metric</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-700 uppercase">Highest Marks Awarded</span>
              <p className="text-2xl font-black text-amber-950 mt-1">
                {filteredSubmissions.length > 0
                  ? Math.max(...filteredSubmissions.map(s => s.score || 0))
                  : 0}
              </p>
              <span className="text-[10px] text-amber-600">Topper Score Achieved</span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase">Scholarship Qualifiers</span>
              <p className="text-2xl font-black text-emerald-950 mt-1">
                {filteredSubmissions.filter(s => (s.scholarshipPercent || 0) >= 50).length}
              </p>
              <span className="text-[10px] text-emerald-600">50%–90% Tuition Waivers</span>
            </div>
          </div>

          {/* Candidate Marks Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden print:border-black">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-600 uppercase font-black text-[10px] print:bg-slate-200 print:text-black">
                <tr>
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Candidate Details</th>
                  <th className="py-2.5 px-3">Exam Title &amp; Stream</th>
                  <th className="py-2.5 px-3">Score (+4/-1)</th>
                  <th className="py-2.5 px-3">% Marks</th>
                  <th className="py-2.5 px-3">Percentile</th>
                  <th className="py-2.5 px-3">Scholarship</th>
                  <th className="py-2.5 px-3">Integrity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {[...filteredSubmissions]
                  .sort((a, b) => (b.score || 0) - (a.score || 0))
                  .map((s, idx) => (
                    <tr key={s.id || idx} className="hover:bg-slate-50 print:hover:bg-transparent">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                        #{idx + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="font-extrabold text-slate-900">{s.studentName}</p>
                        <p className="font-mono text-[10px] text-slate-500">+91-{s.mobile}</p>
                      </td>
                      <td className="py-2.5 px-3">
                        <p className="font-bold text-slate-800 line-clamp-1">{s.examTitle}</p>
                        <span className="text-[10px] text-slate-400">{s.targetStream || s.stream || 'ALL'} &bull; {s.targetClass || 'Class 12'}</span>
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-black text-slate-900">{s.score}</span>
                        <span className="text-slate-400 text-[10px]"> / {s.maxMarks || 100}</span>
                      </td>
                      <td className="py-2.5 px-3 font-bold text-brand-navy">
                        {s.percentage}%
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] font-bold text-indigo-700">
                        {s.percentile ? `${s.percentile} %ile` : `${Math.min(99.9, Math.round(((s.score || 0) / (s.maxMarks || 100)) * 100))}%ile`}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-black text-[10px] print:border print:border-emerald-600">
                          {s.scholarshipPercent || 50}% Off
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {(s.tabSwitchCount || 0) > 0 ? (
                          <span className="text-rose-600 font-bold text-[10px]">
                            ⚠️ {s.tabSwitchCount} Switches
                          </span>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[10px]">
                            Clean ✓
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          {/* Director Sign-Off Block */}
          <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 text-xs text-slate-500 print:text-black">
            <div>
              <p className="font-bold text-slate-700">Confidentiality Notice:</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                This merit list is generated directly from the Rankers Path CBT Assessment Server and is certified for official scholarship disbursement and batch tier placement.
              </p>
            </div>
            <div className="text-right sm:text-right flex-shrink-0 min-w-[200px]">
              <div className="h-12 border-b border-dashed border-slate-400"></div>
              <p className="font-black text-slate-900 mt-1">Director / Academic Dean</p>
              <p className="text-[10px] text-slate-400">Rankers Path Kota Mentors, Indore</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
