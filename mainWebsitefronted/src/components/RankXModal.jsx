import React, { useState, useEffect } from 'react';
import { X, Award, MapPin, CheckCircle2, Printer, Calendar, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function RankXModal({ isOpen, onClose, user, onRequireLogin }) {
  const [step, setStep] = useState(1); // 1: Form, 2: Admit Card
  const [centres, setCentres] = useState([]);
  const [admitCard, setAdmitCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: user?.fullName || '',
    fatherName: '',
    mobile: user?.mobile || '',
    targetClass: user?.targetClass || 'Class 11',
    stream: user?.targetStream || 'NEET',
    schoolName: '',
    centreId: 'centre-vijay-nagar',
    city: 'Indore'
  });

  useEffect(() => {
    if (isOpen) {
      api.getCentres().then(res => {
        if (res.data) setCentres(res.data);
      });
      // Check if student already has RankX registration
      api.getMyRankX().then(res => {
        if (res.data) {
          setAdmitCard(res.data);
          setStep(2);
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      onRequireLogin();
      return;
    }

    setLoading(true);
    const selectedCentre = centres.find(c => c.id === formData.centreId);
    const res = await api.registerRankX({
      ...formData,
      centreName: selectedCentre ? selectedCentre.name : 'Vijay Nagar Main Campus'
    });
    setLoading(false);

    if (res.success && res.data) {
      setAdmitCard(res.data);
      setStep(2);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-navyCard p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-yellow/20 flex items-center justify-center text-brand-yellow">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-yellow">Offline Scholarship Test</span>
              <h3 className="text-xl font-extrabold text-white">RankX 2026 Examination Registration</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>RankX Offline Test Date:</strong> Sunday, 18 October 2026. 
                  Exam will be conducted physically at your chosen centre. Seats are limited to physical room capacities.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Candidate name"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Father's / Guardian's Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Father's name"
                    value={formData.fatherName}
                    onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Stream *</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="NEET">NEET (Medical Stream)</option>
                    <option value="IIT_JEE">IIT-JEE (Engineering Stream)</option>
                    <option value="FOUNDATION">Foundation (Class 8th / 9th / 10th)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Class / Grade *</label>
                  <select
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="Class 8">Class 8th</option>
                    <option value="Class 9">Class 9th</option>
                    <option value="Class 10">Class 10th</option>
                    <option value="Class 11">Class 11th</option>
                    <option value="Class 12">Class 12th</option>
                    <option value="Dropper">Dropper / 12th Passed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Current School / College</label>
                  <input
                    type="text"
                    placeholder="e.g. DPS Indore"
                    value={formData.schoolName}
                    onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>
              </div>

              {/* Centre Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Choose Examination Centre (Venue) *
                </label>
                <div className="space-y-2">
                  {centres.map((c) => {
                    const available = Math.max(0, c.capacity - (c.registeredCount || 0));
                    return (
                      <label
                        key={c.id}
                        className={`flex items-start justify-between p-3.5 rounded-2xl border cursor-pointer transition ${
                          formData.centreId === c.id
                            ? 'border-brand-yellow bg-amber-50/50 shadow-sm'
                            : 'border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="radio"
                            name="centreId"
                            value={c.id}
                            checked={formData.centreId === c.id}
                            onChange={(e) => setFormData({ ...formData, centreId: e.target.value })}
                            className="mt-1 text-brand-navy focus:ring-brand-yellow"
                          />
                          <div>
                            <p className="text-sm font-bold text-slate-900">{c.name}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{c.address}</p>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 whitespace-nowrap">
                          {available} seats left
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-base shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Award className="w-5 h-5 text-brand-navy" />
                  <span>{loading ? 'Generating Admit Card...' : 'Confirm Registration & Get Admit Card'}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: Digital Admit Card View */
            <div className="space-y-6 animate-in zoom-in-95">
              <div className="border-4 border-brand-navy rounded-3xl p-6 sm:p-8 bg-white shadow-xl relative overflow-hidden print:border-2">
                
                {/* Admit Card Header */}
                <div className="flex items-center justify-between border-b-2 border-brand-navy pb-4 mb-6">
                  <div>
                    <img
                      src="/assets/web/logo-header.png"
                      alt="Rankers Path"
                      className="h-10 w-auto object-contain"
                    />
                    <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wider">
                      Official Candidate Admit Card &bull; RankX 2026
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Roll Number</span>
                    <p className="text-xl font-black text-brand-navy font-mono">{admitCard.rollNumber}</p>
                  </div>
                </div>

                {/* Candidate Info Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Candidate Name</span>
                    <strong className="text-slate-900 font-bold">{admitCard.studentName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Father's Name</span>
                    <strong className="text-slate-900 font-bold">{admitCard.fatherName || 'Guardian'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Stream / Target</span>
                    <strong className="text-brand-navy font-bold">{admitCard.stream} ({admitCard.targetClass})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Exam Date</span>
                    <strong className="text-slate-900 font-bold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-brand-yellowDark" /> {admitCard.examDate}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Exam Timing</span>
                    <strong className="text-slate-900 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-brand-yellowDark" /> {admitCard.examTiming}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 font-semibold block text-[11px]">Reporting Time</span>
                    <strong className="text-amber-700 font-bold">{admitCard.reportingTime}</strong>
                  </div>
                </div>

                {/* Centre Venue Bar */}
                <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
                    Allotted Examination Centre
                  </span>
                  <h4 className="text-base font-extrabold text-slate-900 mt-0.5">{admitCard.centreName}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{admitCard.centreAddress || 'Vijay Nagar, Indore'}</p>
                </div>

                {/* QR Code & Instructions */}
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-5">
                  <div className="space-y-1 text-xs text-slate-600">
                    <p className="font-bold text-slate-900">Important Instructions for Test Day:</p>
                    <p>&bull; Bring a printed copy of this Admit Card along with a valid School ID / Aadhaar.</p>
                    <p>&bull; Use Black or Blue Ballpoint pen for OMR marking.</p>
                    <p>&bull; Show this QR code at centre entrance for instant attendance verification.</p>
                  </div>

                  {admitCard.qrCodeDataUrl ? (
                    <div className="p-2 border-2 border-brand-navy rounded-2xl bg-white shadow-sm flex flex-col items-center">
                      <img
                        src={admitCard.qrCodeDataUrl}
                        alt="Admit Card QR"
                        className="w-24 h-24 object-contain"
                      />
                      <span className="text-[9px] font-extrabold text-brand-navy uppercase tracking-widest mt-1">
                        Scan at Venue
                      </span>
                    </div>
                  ) : (
                    <div className="w-24 h-24 bg-slate-100 rounded-xl flex items-center justify-center text-[10px] text-slate-400">
                      QR Generated
                    </div>
                  )}
                </div>

              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 print:hidden">
                <button
                  onClick={handlePrint}
                  className="w-full sm:flex-1 py-3.5 bg-brand-navy hover:bg-brand-navyLight text-white rounded-xl font-bold text-sm shadow flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4 text-brand-yellow" />
                  <span>Print / Save Admit Card PDF</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3.5 border border-slate-300 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-100"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
