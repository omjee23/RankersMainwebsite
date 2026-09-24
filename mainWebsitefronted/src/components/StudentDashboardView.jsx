import React, { useState, useEffect } from 'react';
import { User, Award, BookOpen, Clock, FileText, Download, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { api } from '../services/api';

export default function StudentDashboardView({ user, onOpenRankX, onOpenRSAT }) {
  const [rankXData, setRankXData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    api.getMyRankX().then(res => {
      if (res.data) setRankXData(res.data);
    });
  }, []);

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-in fade-in">
      
      {/* Student Profile Hero Card */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-navyCard to-brand-navy text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-brand-yellow/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="w-20 h-20 rounded-2xl bg-brand-yellow text-brand-navy flex items-center justify-center font-black text-2xl shadow-inner">
            {user?.fullName?.charAt(0) || 'S'}
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy font-bold text-[10px] uppercase">
                Student Account Active
              </span>
              <span className="text-xs text-slate-300 font-semibold">+91-{user?.mobile}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              Welcome back, {user?.fullName}!
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
              Enrolled Stream: <strong className="text-brand-yellow">{user?.targetStream || 'NEET'}</strong> &bull; {user?.targetClass || 'Class 11'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenRSAT}
            className="px-5 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-xl font-extrabold text-sm shadow transition flex items-center gap-2"
          >
            <Zap className="w-4 h-4 text-brand-navy" />
            <span>Launch RSAT Exam</span>
          </button>
          <button
            onClick={onOpenRankX}
            className="px-5 py-3 bg-white/10 hover:bg-white/15 text-white border border-white/20 rounded-xl font-bold text-sm transition"
          >
            View Admit Card
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">RankX Status</span>
            <h4 className="text-xl font-extrabold text-brand-navy mt-1">
              {rankXData ? 'Registered &bull; Centre Allotted' : 'Not Registered'}
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              {rankXData ? rankXData.centreName : 'Offline exam venue booking open'}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-brand-yellowDark flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">RSAT Scholarship</span>
            <h4 className="text-xl font-extrabold text-brand-navy mt-1">
              Eligible for 75%
            </h4>
            <p className="text-xs text-emerald-600 font-bold mt-0.5">
              Verified Merit Discount
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Test Series</span>
            <h4 className="text-xl font-extrabold text-brand-navy mt-1">
              20 Tests Scheduled
            </h4>
            <p className="text-xs text-slate-500 mt-0.5">
              NEET Full-Length Mock Exams
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Registered Exams Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-brand-yellowDark" />
              <span>Registered Examination Hub</span>
            </h3>

            {rankXData ? (
              <div className="p-5 rounded-2xl border-2 border-brand-navy/20 bg-slate-50 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy font-black text-[10px] uppercase">
                      Offline Scholarship Exam
                    </span>
                    <h4 className="text-lg font-extrabold text-brand-navy mt-1">RankX 2026 Examination</h4>
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

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block">Exam Date</span>
                    <strong className="text-slate-800">{rankXData.examDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Timings</span>
                    <strong className="text-slate-800">{rankXData.examTiming}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Attendance</span>
                    <strong className="text-amber-600 uppercase font-bold">{rankXData.attendanceStatus || 'PENDING'}</strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 space-y-3">
                <p className="text-slate-600 text-sm">You haven't booked your seat for RankX Offline Scholarship Exam yet.</p>
                <button
                  onClick={onOpenRankX}
                  className="px-6 py-2.5 bg-brand-yellow text-brand-navy rounded-xl font-bold text-xs uppercase shadow"
                >
                  Book Your Test Centre
                </button>
              </div>
            )}

            {/* Test Series 20 Test Schedule Card */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-sm font-extrabold text-slate-800 mb-3 uppercase tracking-wider">
                Year-Long Test Series (20 Tests)
              </h4>
              <div className="space-y-3">
                <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">
                      T01
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">NEET Full Syllabus Mock 01 (Physics, Chem, Bio)</p>
                      <p className="text-xs text-slate-500">180 Questions &bull; 720 Marks &bull; Complete NTA Pattern</p>
                    </div>
                  </div>
                  <button
                    onClick={onOpenRSAT}
                    className="px-3 py-1.5 bg-brand-navy text-brand-yellow font-bold text-xs rounded-lg hover:bg-brand-navyLight"
                  >
                    Start Test
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">
                      T02
                    </span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">IIT-JEE Mains Mock 01 (Physics, Chem, Maths)</p>
                      <p className="text-xs text-slate-500">75 Questions &bull; 300 Marks &bull; Computer Based Test</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">Available Next Sunday</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Fee & Receipts / Quick Counselor */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h4 className="text-base font-extrabold text-slate-900">Digital Fee Receipts &amp; Invoices</h4>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-700">RankX Registration</span>
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
            <h4 className="text-base font-extrabold text-brand-navy">Need Admission Guidance?</h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              Connect directly with our founding faculty coordinators at Vijay Nagar campus for personal counselling.
            </p>
            <a
              href="https://wa.me/919131435511?text=Hi%2C%20I%20am%20logged%20in%20to%20student%20dashboard%20and%20need%20academic%20counseling."
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-[#25D366] text-white text-center rounded-xl font-bold text-xs shadow"
            >
              Direct Faculty WhatsApp
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
