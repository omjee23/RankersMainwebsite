import React, { useState } from 'react';
import { X, Phone, Lock, Sparkles, CheckCircle2, User } from 'lucide-react';
import { api } from '../services/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('MOBILE'); // MOBILE, OTP
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [fullName, setFullName] = useState('');
  const [targetClass, setTargetClass] = useState('Class 11');
  const [targetStream, setTargetStream] = useState('NEET');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtpCode, setDevOtpCode] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    const cleanMobile = mobile.replace(/\D/g, '').slice(-10);
    if (cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    const res = await api.requestOtp(cleanMobile);
    setLoading(false);

    if (res.success) {
      if (res.data?.devOtp) setDevOtpCode(res.data.devOtp);
      setStep('OTP');
    } else {
      setError(res.message || 'Failed to send OTP');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!otp || otp.length < 4) {
      setError('Please enter the 6-digit OTP received on your mobile');
      return;
    }

    setLoading(true);
    const res = await api.verifyOtpAndLogin({
      mobile,
      otp,
      fullName: fullName || 'Rankers Student',
      targetClass,
      targetStream
    });
    setLoading(false);

    if (res.success) {
      onLoginSuccess(res.data.user);
      onClose();
    } else {
      setError(res.message || 'Invalid OTP');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-navy to-brand-navyCard p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 text-brand-yellow flex items-center justify-center mx-auto mb-2">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-extrabold text-white">Student Portal Access</h3>
          <p className="text-xs text-slate-300 mt-0.5">Instant Mobile SMS Verification</p>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              {error}
            </div>
          )}

          {step === 'MOBILE' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Candidate Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priyanshu Patidar"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  10-Digit Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="9131435511"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 text-sm font-mono focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target</label>
                  <select
                    value={targetStream}
                    onChange={(e) => setTargetStream(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                  >
                    <option value="NEET">NEET (UG)</option>
                    <option value="IIT_JEE">IIT-JEE</option>
                    <option value="FOUNDATION">Foundation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Class</label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-semibold"
                  >
                    <option value="Class 11">Class 11th</option>
                    <option value="Class 12">Class 12th</option>
                    <option value="Dropper">Dropper</option>
                    <option value="Class 10">Class 10th</option>
                    <option value="Class 9">Class 9th</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                <span>{loading ? 'Sending SMS OTP...' : 'Send SMS OTP Verification'}</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1">
                <p className="text-xs text-slate-500">
                  Enter 6-digit OTP sent to <strong className="text-slate-900">+91-{mobile}</strong>
                </p>
                {devOtpCode && (
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-900 text-[11px] font-mono font-bold rounded-lg">
                    Dev Test Code: {devOtpCode}
                  </span>
                )}
              </div>

              <div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="&bull; &bull; &bull; &bull; &bull; &bull;"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full py-3.5 text-center text-2xl font-mono font-black tracking-widest rounded-xl border-2 border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-brand-yellow" />
                <span>{loading ? 'Verifying...' : 'Verify & Enter Portal'}</span>
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setStep('MOBILE')}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
}
