import React, { useState, useEffect } from 'react';
import {
  X,
  Users,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Send,
  Eye,
  Award,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

export default function ExamParticipationModal({
  isOpen,
  onClose,
  test,
  onInspectSubmission
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [activeTab, setActiveTab] = useState('ATTEMPTED'); // 'ATTEMPTED' or 'ABSENT'
  const [toggleLoading, setToggleLoading] = useState(false);
  const [directorMobile, setDirectorMobile] = useState('9131435511');

  const loadParticipation = async () => {
    if (!test) return;
    setLoading(true);
    try {
      const res = await adminApi.getExamParticipation(test.id);
      if (res.success && res.data) {
        setData(res.data);
      } else {
        alert(res.message || 'Failed to load exam participation');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && test) {
      loadParticipation();
    }
  }, [isOpen, test]);

  if (!isOpen || !test) return null;

  const handleToggleLiveResult = async () => {
    setToggleLoading(true);
    try {
      const currentLive = data?.stats?.resultPublishedToStudents !== false;
      const res = await adminApi.toggleLiveExamResults(test.id, !currentLive);
      if (res.success) {
        setData(prev => ({
          ...prev,
          stats: {
            ...prev.stats,
            resultPublishedToStudents: res.data.resultPublishedToStudents
          }
        }));
        alert(`Results for "${test.title}" are now ${res.data.resultPublishedToStudents ? 'LIVE on Student Portal!' : 'HIDDEN from Student Portal.'}`);
      } else {
        alert(res.message || 'Toggle failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setToggleLoading(false);
    }
  };

  const handleDownloadCsv = () => {
    const url = adminApi.getDirectorExamSheetUrl(test.id);
    window.open(url, '_blank');
  };

  const handleShareToDirectorWhatsApp = () => {
    const stats = data?.stats || {};
    const top = (data?.attemptedStudents || [])[0];

    const message =
`*RANKERS PATH INDORE - DIRECTOR MERIT & ATTENDANCE SHEET*
Respected Director Sir,
Here is the official exam participation and performance ledger for:

📝 *Exam Name:* ${test.title}
🎯 *Pattern:* ${test.patternType || test.examType}
📊 *Participation:* ${stats.totalAttempted || 0} / ${stats.totalEnrolled || 0} Students (${stats.attendancePercentage || 0}% Attendance)
⚠️ *Absent:* ${stats.totalAbsent || 0} Students

🏆 *Batch Top Ranker:* ${top ? `${top.studentName} (${top.score}/${test.totalMarks} - ${top.percentage}%)` : 'No attempts recorded'}
📈 *Average Score:* ${stats.avgScore || 0} / ${test.totalMarks} Marks
📢 *Result Portal Status:* ${stats.resultPublishedToStudents ? 'LIVE for Students' : 'Under Review / Hidden'}

👉 *Download Full CSV/Excel Sheet:*
${adminApi.getDirectorExamSheetUrl(test.id)}

--
Academic Head, Rankers Path Indore`;

    const cleanPhone = String(directorMobile).replace(/[^0-9]/g, '');
    const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const waUrl = `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  const stats = data?.stats || {};
  const attempted = data?.attemptedStudents || [];
  const absent = data?.absentStudents || [];
  const isResultLive = stats.resultPublishedToStudents !== false;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200 flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-brand-navy p-6 text-white flex items-center justify-between flex-shrink-0">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy font-black text-[10px] uppercase tracking-wider">
                Student Attendance &amp; Merit Ledger
              </span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-white font-extrabold text-[10px]">
                {test.patternType || test.examType}
              </span>
            </div>
            <h3 className="text-lg font-black text-white">{test.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Top Summary Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Enrolled in Batch</span>
              <h4 className="text-2xl font-black text-brand-navy mt-1">{stats.totalEnrolled || 0}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Eligible Candidates</p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[10px] font-bold text-emerald-700 uppercase block">Attempted / Present</span>
              <h4 className="text-2xl font-black text-emerald-800 mt-1">{stats.totalAttempted || 0}</h4>
              <p className="text-[11px] text-emerald-700 font-bold mt-0.5">{stats.attendancePercentage || 0}% Turnout</p>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
              <span className="text-[10px] font-bold text-rose-700 uppercase block">Absent / Missed</span>
              <h4 className="text-2xl font-black text-rose-800 mt-1">{stats.totalAbsent || 0}</h4>
              <p className="text-[11px] text-rose-600 mt-0.5">Need Follow-up</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[10px] font-bold text-amber-800 uppercase block">Highest / Avg Score</span>
              <h4 className="text-2xl font-black text-amber-900 mt-1">
                {stats.highestScore || 0} <span className="text-xs font-normal text-amber-700">/ {stats.avgScore || 0}</span>
              </h4>
              <p className="text-[11px] text-amber-800 font-bold mt-0.5">Out of {test.totalMarks} Marks</p>
            </div>
          </div>

          {/* Action Toolbar: Live Result Toggle & Director Sharing */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50/50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Live Result Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={toggleLoading}
                onClick={handleToggleLiveResult}
                className="flex items-center gap-2 cursor-pointer transition text-left"
              >
                {isResultLive ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
                <div>
                  <span className={`text-xs font-black block ${isResultLive ? 'text-emerald-700' : 'text-slate-600'}`}>
                    {isResultLive ? '📢 Results are LIVE on Student Portal' : '🔒 Results are HIDDEN from Student Portal'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {isResultLive ? 'Students can view rank, marks & solutions' : 'Students see "Result Announcement Pending"'}
                  </span>
                </div>
              </button>
            </div>

            {/* Export & WhatsApp Share Buttons */}
            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow flex items-center gap-1.5 transition"
                title="Download Director Excel Sheet CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Download Excel Sheet</span>
              </button>

              <button
                type="button"
                onClick={handleShareToDirectorWhatsApp}
                className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs shadow flex items-center gap-1.5 transition"
                title="Send Merit Sheet to Director WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Share to Director (WhatsApp)</span>
              </button>
            </div>

          </div>

          {/* Tabs: Attempted vs Absent */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <button
              onClick={() => setActiveTab('ATTEMPTED')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                activeTab === 'ATTEMPTED'
                  ? 'bg-brand-navy text-brand-yellow shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Attempted Candidates ({attempted.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('ABSENT')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-2 ${
                activeTab === 'ABSENT'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Absent Candidates ({absent.length})</span>
            </button>
          </div>

          {/* TAB 1: Attempted Students Table */}
          {activeTab === 'ATTEMPTED' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Rank</th>
                    <th className="py-2.5 px-3">Student / Roll</th>
                    <th className="py-2.5 px-3">Score / Max</th>
                    <th className="py-2.5 px-3">Accuracy</th>
                    <th className="py-2.5 px-3">Correct / Wrong</th>
                    <th className="py-2.5 px-3">Anti-Cheat</th>
                    <th className="py-2.5 px-3 text-right">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {attempted.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 font-bold">
                        No students have attempted this exam yet.
                      </td>
                    </tr>
                  ) : (
                    attempted.map((sub, idx) => (
                      <tr key={sub.id || idx} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-black text-xs ${
                            idx === 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                            idx === 1 ? 'bg-slate-200 text-slate-800' :
                            idx === 2 ? 'bg-amber-50 text-amber-800' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {sub.computedRank || idx + 1}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <p className="font-black text-slate-900">{sub.studentName}</p>
                          <p className="font-mono text-[11px] text-slate-500">Roll: {sub.rollNumber || 'RPX-2026'}</p>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-black text-slate-900 text-sm">{sub.score}</span>
                          <span className="text-slate-400"> / {sub.maxMarks || test.totalMarks}</span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-extrabold text-emerald-700">{sub.percentage || 0}%</span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          <span className="text-emerald-600 font-bold">✓ {sub.correctCount || 0}</span>
                          <span className="text-slate-300 mx-1">|</span>
                          <span className="text-rose-600 font-bold">✗ {sub.incorrectCount || 0}</span>
                        </td>
                        <td className="py-3 px-3">
                          {(sub.tabSwitchCount || 0) > 0 ? (
                            <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold text-[10px]">
                              ⚠️ {sub.tabSwitchCount} tab switches
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              Clean ✓
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onInspectSubmission && onInspectSubmission(sub)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 transition"
                            title="Inspect Answer Sheet"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* TAB 2: Absent Students Table */}
          {activeTab === 'ABSENT' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Student Name</th>
                    <th className="py-2.5 px-3">Contact</th>
                    <th className="py-2.5 px-3">Target Stream</th>
                    <th className="py-2.5 px-3">Target Batch</th>
                    <th className="py-2.5 px-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {absent.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-slate-400 font-bold">
                        🎉 100% Attendance! All enrolled students have attempted this test.
                      </td>
                    </tr>
                  ) : (
                    absent.map((u, idx) => (
                      <tr key={u.id || idx} className="hover:bg-slate-50 transition">
                        <td className="py-3 px-3">
                          <p className="font-black text-slate-900">{u.fullName}</p>
                          <p className="text-[11px] text-slate-400">{u.email || 'No email'}</p>
                        </td>
                        <td className="py-3 px-3 font-mono font-bold text-slate-700">
                          {u.mobile ? `+91-${u.mobile}` : 'N/A'}
                        </td>
                        <td className="py-3 px-3 font-bold text-brand-navy">
                          {u.targetStream || test.stream}
                        </td>
                        <td className="py-3 px-3 text-slate-600">
                          {u.targetBatch || test.targetBatch}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 font-black text-[10px] uppercase">
                            Absent
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
