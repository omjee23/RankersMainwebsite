import React, { useState } from 'react';
import {
  X,
  Send,
  Mail,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  FileText,
  Clock,
  Award
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

export default function DirectorShareModal({
  isOpen,
  onClose,
  test,
  onTestApproved
}) {
  const [directorMobile, setDirectorMobile] = useState('9131435511');
  const [directorEmail, setDirectorEmail] = useState('director@rankerspath.in');
  const [facultyNote, setFacultyNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [approvalLoading, setApprovalLoading] = useState(false);
  const [shareData, setShareData] = useState(null);

  if (!isOpen || !test) return null;

  const handleGenerateShare = async () => {
    setLoading(true);
    try {
      const res = await adminApi.sendTestToDirector(test.id, {
        directorMobile,
        directorEmail,
        note: facultyNote
      });
      if (res.success && res.data) {
        setShareData(res.data);
      } else {
        alert(res.message || 'Failed to prepare director notification');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveNow = async () => {
    if (!window.confirm(`Authorize and Approve "${test.title}" for student release?`)) return;
    setApprovalLoading(true);
    try {
      const res = await adminApi.approveTestByDirector(test.id, {
        approvedBy: 'Academic Director (Prof. Verma)',
        feedback: 'Approved for Live Student Portal CBT Exam Session',
        publishToStudents: true
      });
      if (res.success) {
        alert(`✅ Test "${test.title}" is now APPROVED by Director and published to Student Portal!`);
        if (onTestApproved) onTestApproved(res.data);
        onClose();
      } else {
        alert(res.message || 'Approval failed');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setApprovalLoading(false);
    }
  };

  const patternBadge = test.patternType || test.examType;
  const isApproved = test.directorApproval?.status === 'APPROVED';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Header */}
        <div className="bg-brand-navy p-6 text-white flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy font-black text-[10px] uppercase tracking-wider">
                Director Approval Desk
              </span>
              {isApproved ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 font-extrabold text-[10px] flex items-center gap-1 border border-emerald-400/40">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Approved
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 font-extrabold text-[10px] border border-amber-400/40">
                  ⏳ Awaiting Director Authorization
                </span>
              )}
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

        {/* Body */}
        <div className="p-6 space-y-5 text-xs text-slate-700">
          
          {/* Paper Blueprint Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">
              Exam Paper Blueprint
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Pattern</span>
                <strong className="text-slate-900 font-black">{patternBadge}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Total Marks</span>
                <strong className="text-emerald-600 font-black">{test.totalMarks} Marks</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Duration</span>
                <strong className="text-slate-900 font-black">{test.durationMinutes} Mins</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] text-slate-400 block font-bold">Questions</span>
                <strong className="text-slate-900 font-black">{test.totalQuestions || 90} Qs</strong>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 pt-1">
              <strong>Subjects:</strong> {(test.subjects || []).join(', ')} &bull; <strong>Target Batch:</strong> {test.targetBatch || test.batchTier}
            </p>
          </div>

          {/* Director Contact Inputs */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-sm text-slate-900">
              Send Test Paper to Academic Director for Review &amp; Approval:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Director WhatsApp Number *
                </label>
                <input
                  type="text"
                  value={directorMobile}
                  onChange={(e) => setDirectorMobile(e.target.value)}
                  placeholder="9131435511"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold text-slate-900 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                  Director Email Address *
                </label>
                <input
                  type="email"
                  value={directorEmail}
                  onChange={(e) => setDirectorEmail(e.target.value)}
                  placeholder="director@rankerspath.in"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-medium text-slate-900 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Faculty Note / Special Remark (Optional)
              </label>
              <textarea
                rows={2}
                value={facultyNote}
                onChange={(e) => setFacultyNote(e.target.value)}
                placeholder="e.g. Respected Director Sir, please verify Question 14 (Matrix Match) and negative marking scheme before publishing to students."
                className="w-full p-3 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none"
              ></textarea>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={handleGenerateShare}
              className="w-full py-3 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black rounded-xl text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4 text-brand-yellow" />
              <span>{loading ? 'Preparing Dispatch...' : 'Generate Director WhatsApp & Email Links'}</span>
            </button>
          </div>

          {/* Share Channels Card if Generated */}
          {shareData && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-3 animate-in slide-in-from-top-2">
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                📲 Dispatch Channels Ready:
              </span>

              <div className="flex flex-col sm:flex-row items-center gap-2">
                <a
                  href={shareData.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-black text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Send via WhatsApp (+{directorMobile})</span>
                </a>

                <a
                  href={shareData.mailtoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-wider shadow flex items-center justify-center gap-2 transition"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send via Email ({directorEmail})</span>
                </a>
              </div>

              {/* Message Preview */}
              <div className="p-3 bg-white rounded-xl border border-emerald-200 font-mono text-[11px] text-slate-700 whitespace-pre-wrap max-h-36 overflow-y-auto">
                {shareData.textMessage}
              </div>
            </div>
          )}

          {/* Quick Director Approval Action Bar */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-slate-500 text-[11px] flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Only authorized Academic Director can release test papers to students</span>
            </span>

            <button
              type="button"
              disabled={approvalLoading}
              onClick={handleApproveNow}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase rounded-xl shadow transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{approvalLoading ? 'Authorizing...' : '1-Click Director Approve & Publish'}</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
