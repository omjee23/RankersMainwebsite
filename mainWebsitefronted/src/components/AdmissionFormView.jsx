import React, { useState } from 'react';
import {
  ArrowLeft,
  Printer,
  CheckCircle2,
  AlertCircle,
  Upload,
  Camera,
  FileText,
  Building,
  GraduationCap,
  Sparkles,
  Download,
  Info,
  Calendar,
  Phone,
  Mail,
  MapPin,
  User,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../services/api';

export default function AdmissionFormView({ onBack, onOpenEnquiry }) {
  const [formMode, setFormMode] = useState('fill'); // 'fill' or 'print-blank'
  const [showTerms, setShowTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Main Form Data State
  const initialForm = {
    stream: 'NEET', // NEET, IIT/JEE, Other Classes
    targetClass: 'XI studying', // XI studying, XII studying, XII Passed, 9th, 10th
    firstName: '',
    lastName: '',
    fatherName: '',
    motherName: '',
    fatherOccupation: '',
    motherOccupation: '',
    dob: '',
    gender: 'Male',
    bloodGroup: '',
    category: 'GEN',
    nationality: 'Indian',
    aadharNo: '',
    address: '',
    city: 'Indore',
    state: 'Madhya Pradesh',
    pin: '',
    phoneResidence: '',
    phoneOffice: '',
    parentMobile: '',
    studentMobile: '',
    smsMobile: '',
    email: '',
    facebookId: '',
    twitterId: '',
    studentClassCategory: 'X passed / XI studying',
    schoolName: '',
    marksX: '',
    marksXII: '',
    gradeScience: '',
    gradeMaths: '',
    examBoard: 'CBSE',
    scholarshipEligibility: '15%',
    source: 'Website',
    place: 'Indore',
    date: new Date().toISOString().split('T')[0],
    studentSignatureName: '',
    parentSignatureName: '',
    declarationAccepted: true,
    photoUrl: ''
  };

  const [formData, setFormData] = useState(initialForm);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Demo auto-fill for testing convenience
  const handleQuickFillDemo = () => {
    setFormData({
      stream: 'NEET',
      targetClass: 'XII Passed',
      firstName: 'Rahul',
      lastName: 'Verma',
      fatherName: 'Suresh Verma',
      motherName: 'Meena Verma',
      fatherOccupation: 'Government Officer',
      motherOccupation: 'Homemaker',
      dob: '2007-06-18',
      gender: 'Male',
      bloodGroup: 'B+',
      category: 'GEN',
      nationality: 'Indian',
      aadharNo: '874521096321',
      address: '74, Scheme No. 54, Near Satya Sai Square, Vijay Nagar',
      city: 'Indore',
      state: 'Madhya Pradesh',
      pin: '452010',
      phoneResidence: '0731-255987',
      phoneOffice: '',
      parentMobile: '9826011223',
      studentMobile: '9131445566',
      smsMobile: '9131445566',
      email: 'rahul.verma26@gmail.com',
      facebookId: '',
      twitterId: '',
      studentClassCategory: 'XII passed',
      schoolName: 'Delhi Public School (DPS) Nipania, Indore',
      marksX: '93.5',
      marksXII: '88.2',
      gradeScience: 'A1',
      gradeMaths: 'A1',
      examBoard: 'CBSE',
      scholarshipEligibility: '50%',
      source: 'Friends/Relatives',
      place: 'Indore',
      date: new Date().toISOString().split('T')[0],
      studentSignatureName: 'Rahul Verma',
      parentSignatureName: 'Suresh Verma',
      declarationAccepted: true,
      photoUrl: ''
    });
  };

  // Photo Upload Handler with base64 conversion
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Photo must be smaller than 3MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const scale = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);
        setFormData(prev => ({ ...prev, photoUrl: compressedBase64 }));
      };
    };
    reader.readAsDataURL(file);
  };

  // Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.firstName.trim()) {
      setErrorMessage('Please enter First Name.');
      return;
    }
    if (!formData.parentMobile.trim() && !formData.studentMobile.trim()) {
      setErrorMessage('Please enter at least one contact mobile number.');
      return;
    }
    if (!formData.declarationAccepted) {
      setErrorMessage('Please accept the declaration terms to proceed.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.submitAdmission(formData);
      if (res.success) {
        setSubmitSuccess(res.data);
      } else {
        setErrorMessage(res.message || 'Error submitting application form.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Network error submitting application.');
    } finally {
      setSubmitting(false);
    }
  };

  // Print Form Trigger
  const handlePrint = (mode = 'filled') => {
    if (mode === 'blank') {
      setFormMode('print-blank');
      setTimeout(() => {
        window.print();
        setFormMode('fill');
      }, 200);
    } else {
      window.print();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 py-6 sm:py-10 print:p-0 print:bg-white">
      {/* Top Floating Control Bar (Hidden on print) */}
      <div className="max-w-5xl mx-auto px-4 mb-6 print:hidden">
        <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-black uppercase text-brand-navy hover:text-brand-yellowDark bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Website</span>
            </button>
            <div className="hidden md:block border-l border-slate-200 pl-3">
              <h1 className="text-base font-black text-brand-navy">Official Admission Form</h1>
              <p className="text-xs text-slate-500">Session 2026-27 • NEET-UG & IIT-JEE Offline / Online Admission</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleQuickFillDemo}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
              title="Click to fill sample values for quick preview"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Auto-Fill Demo</span>
            </button>

            <button
              type="button"
              onClick={() => handlePrint('blank')}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              title="Print blank 2-page offline form for manual handwriting"
            >
              <FileText className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Blank Form</span>
            </button>

            <button
              type="button"
              onClick={() => handlePrint('filled')}
              className="px-3 py-2 bg-brand-navy hover:bg-[#081533] text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
              title="Print pre-filled form with entered student details"
            >
              <Printer className="w-3.5 h-3.5 text-brand-yellow" />
              <span>Print Filled Form</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Form Paper Container (Page 1: Admission Form) */}
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl border border-slate-300 overflow-hidden print:shadow-none print:border-none print:rounded-none">
        
        {/* Printable Paper Canvas: Page 1 */}
        <div className="p-6 sm:p-10 border-b-4 border-dashed border-slate-300 print:p-6 print:border-b-0 print:break-after-page">
          
          {/* Header Top Meta (Registration No, Receipt No, Date) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm font-semibold border-b pb-3 mb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Registration No.:</span>
                <span className="font-mono font-bold text-brand-navy tracking-wider">
                  {formMode === 'print-blank' ? '....................................' : (submitSuccess?.registrationNo || 'To be allotted by Office')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-600">Receipt No.:</span>
                <span className="font-mono font-bold text-brand-navy tracking-wider">
                  {formMode === 'print-blank' ? '....................................' : (submitSuccess?.receiptNo || '....................................')}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-600">Date:</span>
              <div className="flex gap-1 font-mono font-bold">
                {formMode === 'print-blank' ? (
                  ['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y'].map((ch, idx) => (
                    <span key={idx} className="w-6 h-7 border border-slate-400 flex items-center justify-center text-xs bg-slate-50 text-slate-400">
                      {ch}
                    </span>
                  ))
                ) : (
                  formData.date ? formData.date.replace(/-/g, '').split('').map((ch, idx) => (
                    <span key={idx} className="w-6 h-7 border border-slate-400 flex items-center justify-center text-xs bg-white text-brand-navy font-black">
                      {ch}
                    </span>
                  )) : (
                    ['D', 'D', 'M', 'M', 'Y', 'Y', 'Y', 'Y'].map((ch, idx) => (
                      <span key={idx} className="w-6 h-7 border border-slate-400 flex items-center justify-center text-xs bg-slate-50 text-slate-400">
                        {ch}
                      </span>
                    ))
                  )
                )}
              </div>
            </div>
          </div>

          {/* Institute Header Info with Official Address & Logo & Photo Box */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center pb-4 mb-4 border-b">
            
            {/* Left: To Address */}
            <div className="md:col-span-4 text-xs leading-relaxed text-slate-700">
              <p className="font-bold text-slate-900">To,</p>
              <p className="font-bold text-slate-900">The Directors</p>
              <p className="font-black text-brand-navy">Rankers Path</p>
              <p>HQ City walk block A, 129, Sch. no. 54,</p>
              <p>near Satya Sai Square, Vijay Nagar, Indore</p>
              <p className="font-semibold text-slate-900 mt-1">Helpline: +91 9131435511 / 7974546310</p>
            </div>

            {/* Center: Official Logo */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center">
              <img
                src="/assets/web/logo-header.svg"
                alt="RankersPath - Safalta Ka Sankalp"
                className="h-16 sm:h-20 w-auto object-contain mb-1"
              />
              <p className="text-[11px] font-bold text-brand-navy uppercase tracking-widest">
                Safalta Ka Sankalp • Indore (M.P.)
              </p>
            </div>

            {/* Right: Passport Photo Box */}
            <div className="md:col-span-3 flex justify-center md:justify-end">
              <div className="w-32 h-40 border-2 border-dashed border-slate-400 rounded-lg flex flex-col items-center justify-center text-center p-2 bg-slate-50 relative overflow-hidden group">
                {formData.photoUrl && formMode !== 'print-blank' ? (
                  <>
                    <img
                      src={formData.photoUrl}
                      alt="Student"
                      className="w-full h-full object-cover rounded"
                    />
                    <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[10px] font-bold cursor-pointer transition print:hidden">
                      <Camera className="w-5 h-5 mb-1 text-brand-yellow" />
                      <span>Change Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </>
                ) : (
                  <>
                    <User className="w-8 h-8 text-slate-300 mb-1" />
                    <span className="text-[9px] font-semibold text-slate-500 leading-tight">
                      Affix your recent passport size colour photograph here
                    </span>
                    <label className="mt-2 px-2 py-1 bg-white border border-slate-300 rounded text-[9px] font-bold text-brand-navy hover:bg-slate-100 cursor-pointer shadow-xs transition print:hidden">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                    </label>
                  </>
                )}
              </div>
            </div>

          </div>

          {/* Form Title Banner (Exact match with reference image) */}
          <div className="bg-[#009FE3] text-white py-2 px-4 rounded text-center mb-5 shadow-sm">
            <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wider uppercase">
              ADMISSION FORM FOR NEET UG 2026-27 • IIT JEE 2026-27
            </h2>
          </div>

          {/* 1. COURSE APPLIED FOR */}
          <div className="mb-6 p-4 bg-sky-50/50 rounded-xl border border-sky-100">
            <div className="text-xs font-black uppercase text-brand-navy mb-3 flex items-center justify-between">
              <span>COURSE APPLIED FOR:</span>
              <span className="text-[11px] font-normal text-slate-500">(Please mark [✓] against the course you wish to apply)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* NEET Block */}
              <div className="border border-sky-200 bg-white rounded-lg p-3">
                <div className="text-xs font-black text-brand-navy mb-2 pb-1 border-b border-sky-100 flex items-center justify-between">
                  <span>NEET (Medical)</span>
                  <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">UG</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'XI studying', value: 'XI studying' },
                    { label: 'XII studying', value: 'XII studying' },
                    { label: 'XII Passed (Dropper)', value: 'XII Passed' }
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition ${
                        formData.stream === 'NEET' && formData.targetClass === opt.value
                          ? 'bg-sky-100 font-bold text-sky-900'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="courseSelection"
                        checked={formData.stream === 'NEET' && formData.targetClass === opt.value}
                        onChange={() => {
                          handleInputChange('stream', 'NEET');
                          handleInputChange('targetClass', opt.value);
                        }}
                        className="text-brand-navy focus:ring-brand-navy"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* IIT / JEE Block */}
              <div className="border border-sky-200 bg-white rounded-lg p-3">
                <div className="text-xs font-black text-brand-navy mb-2 pb-1 border-b border-sky-100 flex items-center justify-between">
                  <span>IIT / JEE (Engg)</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-bold">Main + Adv</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { label: 'XI studying', value: 'XI studying' },
                    { label: 'XII studying', value: 'XII studying' },
                    { label: 'XII Passed (Dropper)', value: 'XII Passed' }
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition ${
                        formData.stream === 'IIT/JEE' && formData.targetClass === opt.value
                          ? 'bg-sky-100 font-bold text-sky-900'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="courseSelection"
                        checked={formData.stream === 'IIT/JEE' && formData.targetClass === opt.value}
                        onChange={() => {
                          handleInputChange('stream', 'IIT/JEE');
                          handleInputChange('targetClass', opt.value);
                        }}
                        className="text-brand-navy focus:ring-brand-navy"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Other Classes (Foundation) Block */}
              <div className="border border-sky-200 bg-white rounded-lg p-3">
                <div className="text-xs font-black text-brand-navy mb-2 pb-1 border-b border-sky-100 flex items-center justify-between">
                  <span>Other Classes (PNCF)</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">Foundation</span>
                </div>
                <div className="space-y-2 text-xs">
                  {[
                    { label: '9th Class Foundation', value: '9th' },
                    { label: '10th Class Foundation', value: '10th' }
                  ].map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 p-1.5 rounded cursor-pointer transition ${
                        formData.stream === 'Other Classes' && formData.targetClass === opt.value
                          ? 'bg-sky-100 font-bold text-sky-900'
                          : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="courseSelection"
                        checked={formData.stream === 'Other Classes' && formData.targetClass === opt.value}
                        onChange={() => {
                          handleInputChange('stream', 'Other Classes');
                          handleInputChange('targetClass', opt.value);
                        }}
                        className="text-brand-navy focus:ring-brand-navy"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Salutation & Pledge statement from original form */}
          <div className="text-xs italic text-slate-600 mb-5 bg-slate-50 p-3 rounded-lg border border-slate-200 leading-relaxed">
            <p className="font-semibold text-slate-800 not-italic mb-1">Respected Sir,</p>
            I want to take admission in your esteemed Institute for the Program Course in Medical/Engineering Stream marked (✓) in the box above. I have read the 'Terms &amp; Conditions' of the Institute given overleaf and agree to abide by the same. My particulars are given below:
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* 2. PERSONAL DETAILS */}
            <div className="border border-slate-300 rounded-xl p-4 bg-white relative">
              <div className="flex flex-wrap items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <span className="text-xs font-black uppercase text-brand-navy tracking-wider">
                  Personal Details
                </span>
                <span className="text-[10px] font-semibold text-slate-500 italic">
                  (It is compulsory to fill the form clearly in CAPITAL LETTERS only • Mandatory fields marked *)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                
                <div>
                  <label className="block font-bold text-slate-700 mb-1">First Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value.toUpperCase())}
                    placeholder="e.g. ADITYA"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy uppercase tracking-wider font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Last Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value.toUpperCase())}
                    placeholder="e.g. SHARMA"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy uppercase tracking-wider font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Father's / Guardian's Name*</label>
                  <input
                    type="text"
                    required
                    value={formData.fatherName}
                    onChange={(e) => handleInputChange('fatherName', e.target.value.toUpperCase())}
                    placeholder="FATHER'S FULL NAME"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mother's Name</label>
                  <input
                    type="text"
                    value={formData.motherName}
                    onChange={(e) => handleInputChange('motherName', e.target.value.toUpperCase())}
                    placeholder="MOTHER'S FULL NAME"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy uppercase tracking-wider"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Occupation of Father / Guardian</label>
                  <input
                    type="text"
                    value={formData.fatherOccupation}
                    onChange={(e) => handleInputChange('fatherOccupation', e.target.value)}
                    placeholder="e.g. Business / Doctor / Engineer"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Occupation of Mother</label>
                  <input
                    type="text"
                    value={formData.motherOccupation}
                    onChange={(e) => handleInputChange('motherOccupation', e.target.value)}
                    placeholder="e.g. Homemaker / Teacher"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date of Birth* (DD/MM/YYYY)</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => handleInputChange('dob', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender (M/F)*</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value.toUpperCase())}
                    placeholder="e.g. B+, O+, AB+"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy uppercase"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category* (GEN / OBC / SC / ST / PH)</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy font-bold"
                  >
                    <option value="GEN">GEN (General)</option>
                    <option value="OBC">OBC (Other Backward Class)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="PH">PH (Physically Handicapped)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    placeholder="Indian"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Aadhar Number (12 Digits)</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={formData.aadharNo}
                    onChange={(e) => handleInputChange('aadharNo', e.target.value.replace(/\D/g, ''))}
                    placeholder="XXXX XXXX XXXX"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy tracking-widest font-mono"
                  />
                </div>

              </div>
            </div>

            {/* 3. CORRESPONDENCE ADDRESS */}
            <div className="border border-slate-300 rounded-xl p-4 bg-white">
              <div className="pb-2 mb-3 border-b border-slate-200">
                <span className="text-xs font-black uppercase text-brand-navy tracking-wider">
                  Correspondence Address
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                
                <div className="sm:col-span-2 md:col-span-3">
                  <label className="block font-bold text-slate-700 mb-1">Postal Address*</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="House / Flat No., Street, Colony, Landmark"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">City*</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Indore"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">State*</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    placeholder="Madhya Pradesh"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">PIN Code*</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.pin}
                    onChange={(e) => handleInputChange('pin', e.target.value.replace(/\D/g, ''))}
                    placeholder="452010"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile (Parent)*</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={formData.parentMobile}
                    onChange={(e) => handleInputChange('parentMobile', e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit Parent Contact"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy font-bold text-brand-navy font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mobile (Student)</label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={formData.studentMobile}
                    onChange={(e) => handleInputChange('studentMobile', e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit Student Contact"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-Mail ID*</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone (Residence) STD</label>
                  <input
                    type="text"
                    value={formData.phoneResidence}
                    onChange={(e) => handleInputChange('phoneResidence', e.target.value)}
                    placeholder="e.g. 0731-XXXXXX"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone (Office) STD</label>
                  <input
                    type="text"
                    value={formData.phoneOffice}
                    onChange={(e) => handleInputChange('phoneOffice', e.target.value)}
                    placeholder="Office Contact (optional)"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Social ID / WhatsApp</label>
                  <input
                    type="text"
                    value={formData.facebookId}
                    onChange={(e) => handleInputChange('facebookId', e.target.value)}
                    placeholder="WhatsApp No / Handle"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

              </div>
            </div>

            {/* 4. EDUCATION DETAILS */}
            <div className="border border-slate-300 rounded-xl p-4 bg-white">
              <div className="flex flex-wrap items-center justify-between pb-2 mb-3 border-b border-slate-200">
                <span className="text-xs font-black uppercase text-brand-navy tracking-wider">
                  Education Details
                </span>
                <span className="text-[10px] text-slate-500 italic">
                  (Attach a self-attested photocopy of your original marksheet)
                </span>
              </div>

              <div className="space-y-4 text-xs">
                
                {/* Student Class Category */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Student Class Category (Please select in the relevant box):
                  </label>
                  <div className="flex flex-wrap gap-4 mt-1">
                    {[
                      'X passed / XI studying',
                      'XII studying',
                      'XII passed'
                    ].map(cat => (
                      <label key={cat} className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                        <input
                          type="radio"
                          name="studentClassCategory"
                          checked={formData.studentClassCategory === cat}
                          onChange={() => handleInputChange('studentClassCategory', cat)}
                          className="text-brand-navy focus:ring-brand-navy"
                        />
                        <span>{cat}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* School / College Name */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    School / College Name &amp; Address:
                  </label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => handleInputChange('schoolName', e.target.value)}
                    placeholder="School / Junior College Name, City"
                    className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
                  />
                </div>

                {/* Marks Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      X Board Marks (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.marksX}
                      onChange={(e) => handleInputChange('marksX', e.target.value)}
                      placeholder="Sc. &amp; Maths %"
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy font-bold text-brand-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      XII Board Marks (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.marksXII}
                      onChange={(e) => handleInputChange('marksXII', e.target.value)}
                      placeholder="PCM / PCB %"
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy font-bold text-brand-navy"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Grades (CBSE Class X)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.gradeScience}
                        onChange={(e) => handleInputChange('gradeScience', e.target.value.toUpperCase())}
                        placeholder="In Science"
                        className="w-1/2 px-2 py-2 border border-slate-300 rounded focus:border-brand-navy text-center uppercase"
                      />
                      <input
                        type="text"
                        value={formData.gradeMaths}
                        onChange={(e) => handleInputChange('gradeMaths', e.target.value.toUpperCase())}
                        placeholder="In Maths"
                        className="w-1/2 px-2 py-2 border border-slate-300 rounded focus:border-brand-navy text-center uppercase"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Exam. Board
                    </label>
                    <select
                      value={formData.examBoard}
                      onChange={(e) => handleInputChange('examBoard', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded focus:border-brand-navy focus:ring-1 focus:ring-brand-navy font-semibold"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="MP Board">MP Board</option>
                      <option value="Other">Other State Board</option>
                    </select>
                  </div>
                </div>

                {/* Eligibility for Scholarship Grid (Exact match with reference image) */}
                <div className="pt-2">
                  <label className="block font-bold text-slate-700 mb-2">
                    Eligibility for Scholarship (Select your scholarship tier based on RSAT / Board scores):
                  </label>
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-11 gap-2 text-center">
                    {['5%', '10%', '15%', '25%', '35%', '45%', '50%', '60%', '70%', '90%', 'Others'].map(pct => (
                      <label
                        key={pct}
                        className={`p-2 border rounded-lg cursor-pointer transition text-xs font-bold ${
                          formData.scholarshipEligibility === pct
                            ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <input
                          type="radio"
                          name="scholarshipEligibility"
                          checked={formData.scholarshipEligibility === pct}
                          onChange={() => handleInputChange('scholarshipEligibility', pct)}
                          className="sr-only"
                        />
                        <span>{pct}</span>
                      </label>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            {/* 5. HOW DID YOU COME TO KNOW ABOUT RANKERS PATH? */}
            <div className="border border-slate-300 rounded-xl p-4 bg-white">
              <label className="block text-xs font-black uppercase text-brand-navy tracking-wider mb-2">
                How did you come to know about Rankers Path?
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 text-xs">
                {[
                  'Promotions Team',
                  'Newspaper',
                  'Teachers',
                  'Friends/Relatives',
                  'Ex-Rankers Students',
                  'Website',
                  'Radio/TV'
                ].map(src => (
                  <label
                    key={src}
                    className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition ${
                      formData.source === src
                        ? 'bg-sky-50 border-sky-400 font-bold text-sky-900'
                        : 'hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="source"
                      checked={formData.source === src}
                      onChange={() => handleInputChange('source', src)}
                      className="text-brand-navy focus:ring-brand-navy"
                    />
                    <span className="text-[11px]">{src}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Sign-off & Signatures */}
            <div className="border border-slate-300 rounded-xl p-4 bg-slate-50/70">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs items-end">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Place*</label>
                  <input
                    type="text"
                    required
                    value={formData.place}
                    onChange={(e) => handleInputChange('place', e.target.value)}
                    placeholder="e.g. Indore"
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Student Signature (Full Name)*</label>
                  <input
                    type="text"
                    required
                    value={formData.studentSignatureName}
                    onChange={(e) => handleInputChange('studentSignatureName', e.target.value)}
                    placeholder="Type student name as signature"
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white font-serif italic text-brand-navy font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Parent / Guardian Signature*</label>
                  <input
                    type="text"
                    required
                    value={formData.parentSignatureName}
                    onChange={(e) => handleInputChange('parentSignatureName', e.target.value)}
                    placeholder="Type parent name as signature"
                    className="w-full px-3 py-2 border border-slate-300 rounded bg-white font-serif italic text-brand-navy font-bold"
                  />
                </div>
              </div>

              {/* Mandatory Declaration Checkbox */}
              <div className="mt-4 pt-3 border-t border-slate-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.declarationAccepted}
                    onChange={(e) => handleInputChange('declarationAccepted', e.target.checked)}
                    className="mt-0.5 rounded text-brand-navy focus:ring-brand-navy w-4 h-4"
                  />
                  <span className="text-xs text-slate-700 leading-snug">
                    <strong>Declaration:</strong> I have read the Terms &amp; Conditions of Rankers Path and various policies of the Company as mentioned in the Form and Prospectus &amp; promise to abide by the same.
                  </span>
                </label>
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Action Bar inside form (Hidden on print) */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 print:hidden">
              <button
                type="button"
                onClick={() => setShowTerms(!showTerms)}
                className="text-xs font-bold text-brand-navy hover:underline flex items-center gap-1"
              >
                <span>{showTerms ? 'Hide' : 'View'} Official Terms &amp; Conditions (Page 2)</span>
                {showTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-navy hover:bg-[#081533] text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transition transform hover:scale-[1.01] flex items-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Admission...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-brand-yellow" />
                      <span>Submit Admission Online</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>

        </div>

        {/* Printable Paper Canvas: Page 2 (Terms & Conditions, Checklist, Office Use) */}
        <div className={`p-6 sm:p-10 bg-white print:p-6 print:block ${showTerms ? 'block' : 'hidden md:block print:block'}`}>
          
          {/* Page 2 Header */}
          <div className="border-b-2 border-slate-800 pb-3 mb-4 flex items-center justify-between">
            <h3 className="text-base font-black uppercase text-brand-navy tracking-wide">
              Terms &amp; Conditions &bull; Rankers Path Indore
            </h3>
            <span className="text-xs font-semibold text-slate-500 uppercase">Page 2 of 2</span>
          </div>

          {/* For Office Use Only Box (Exact match with Page 2 image) */}
          <div className="border-2 border-slate-400 rounded-lg p-3 mb-6 bg-slate-50/50 text-[11px]">
            <div className="flex items-center justify-between font-bold border-b border-slate-300 pb-1 mb-2">
              <span className="uppercase text-brand-navy">For Office Use Only</span>
              <span className="italic text-[10px] text-slate-500">(Please tick ✓ the relevant box)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>Category of Provided: <span className="font-mono">________ %</span></div>
              <div>Demand Draft No.: <span className="font-mono">________________</span></div>
              <div>Amount (₹): <span className="font-mono">________________</span></div>
              <div>Drawn on: <span className="font-mono">________________</span></div>
              <div>Registration No.: <span className="font-mono">________________</span></div>
              <div>Office Receipt No.: <span className="font-mono">________________</span></div>
              <div>Receipt Date: <span className="font-mono">________________</span></div>
              <div>Centre: <span className="font-mono">Vijay Nagar Main Campus, Indore</span></div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center gap-4">
              <span>Fee Paid: [ ] Lumpsum &nbsp; [ ] Instalment</span>
              <span>1st Instalment: ________</span>
              <span>2nd Instalment: ________</span>
              <span>Counsellor: ________________</span>
            </div>
          </div>

          {/* 19 Points Official Terms & Conditions (Authentic text from media_1790776409138.png) */}
          <div className="text-[10px] sm:text-[11px] leading-relaxed text-slate-700 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 mb-6">
            <p><strong>1.</strong> Incomplete forms shall not be considered under any circumstances.</p>
            <p><strong>2.</strong> If there is any pendency in admission form, it will be rejected.</p>
            <p><strong>3.</strong> The duly filled Admission Form should be sent to the Registered Office or submitted to the nearest centre.</p>
            <p><strong>4.</strong> It is compulsory to attach a self-attested photocopy of the mark-sheet of the last qualifying Exam. (X or XII).</p>
            <p><strong>5.</strong> It is compulsory for students to paste a recent passport size colour photograph in the space provided and also staple two extra colour photographs with the Admission Form.</p>
            <p><strong>6.</strong> Institute reserves the right to use the single/group photograph(s) for publicity in case the student(s) secures position/rank or succeeds in Medical/Engineering Entrance Exams.</p>
            <p><strong>7.</strong> Students enrolled in Rankers Path Medical/Engineering Course will have to provide photocopy of Admit Card of JEE (Main &amp; Advanced) and other Engineering Entrance Exams or NEET Exam as soon as they receive their admit cards from the examining body.</p>
            <p><strong>8.</strong> Refund &amp; Transfer Policy will be applicable as per Institute Policy.</p>
            <p><strong>9.</strong> It is for the student to see whether he/she is eligible for a certain Medical/Engineering Entrance Exam or not. The Institute does not hold itself responsible if the student's admission form cannot be forwarded or is rejected by the examination body on any ground whatsoever.</p>
            <p><strong>10.</strong> The responsibility of getting the admission form forwarded to the examining body is that of the student himself/herself or that of the parents/guardian.</p>
            <p><strong>11.</strong> In case of school tie-up, School Principal / Signing Authority / Parents will be treated as Guardian.</p>
            <p><strong>12.</strong> If the study material provided to the student is lost/misplaced once delivered at the correspondence address, a duplicate book can be obtained against payment of ₹500 per book (including GST) through DD/Cheque/Online/Card.</p>
            <p><strong>13.</strong> If the dispatch is returned due to change of address / door locked / non-availability of addressee, courier/postage charges of ₹500 will be charged for re-dispatch.</p>
            <p><strong>14.</strong> For change of Exam Mode and Centre, ₹1000 (for each change) will be charged. Mode and Centre can be changed once in a session.</p>
            <p><strong>15.</strong> If at any point the Central Government increases GST (currently 18%), the extra amount will be borne by the students from the date of enforcement of the act by the govt.</p>
            <p><strong>16.</strong> Rankers Path reserves the right to make any alteration in its programs/venue/timing without prior notice. The Director's decision will be final and binding on students and parents.</p>
            <p><strong>17.</strong> The Examination Centre of any place can be changed as per the requirement/need of the company without any prior notice to the students/parents.</p>
            <p><strong>18.</strong> Do Not Disturb (DND): REPL may contact users via SMS, WhatsApp, email and call to give notifications on various important updates. Therefore, user holds seat even in case the users mobile number is registered with Do not (DND) database.</p>
            <p className="md:col-span-2"><strong>19.</strong> In case of any dispute or difference between you and Institute regarding the interpretation of these terms and conditions, non-payment of any claim or any dispute arising out of or in pursuant to these terms and conditions, the same shall be referred to sole Arbitrator who shall be appointed by Managing Director of Rankers path Indore. The proceedings shall be conducted at Indore under the provisions of Arbitration &amp; Conciliation Act and the Courts at Indore only shall have the jurisdiction.</p>
          </div>

          {/* Checklist Box (Exact match from media_1790776409138.png) */}
          <div className="border border-slate-300 rounded-lg p-3 bg-slate-50 text-[11px] mb-6">
            <h4 className="font-black text-brand-navy uppercase mb-2">*Checklist (Please verify documents attached):</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-brand-navy" />
                <span>Three recent passport size colour Photographs (latest).</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-brand-navy" />
                <span>Photocopy of self-attested mark-sheet of last qualifying Exam. (X or XII).</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-brand-navy" />
                <span>DD in favour of 'Rankers Path' payable at Indore (or Online Slip).</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-brand-navy" />
                <span>Attach proof of Scholarship along with Admission Form.</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-brand-navy" />
                <span>Provide E-Mail ID &amp; Mobile no. for sending Information / SMS.</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked className="rounded text-brand-navy" />
                <span>Compulsory for Parents/Guardian and student to sign Terms &amp; Conditions.</span>
              </label>
            </div>
          </div>

          {/* Page 2 Signatures */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-300 text-xs text-slate-800">
            <div className="text-center">
              <div className="w-48 border-b-2 border-slate-400 pb-1 mb-1 font-serif italic text-brand-navy">
                {formData.parentSignatureName || '...........................................'}
              </div>
              <span className="font-bold">Signature of the Parents/Guardian*</span>
            </div>

            <div className="text-center">
              <div className="w-48 border-b-2 border-slate-400 pb-1 mb-1 font-serif italic text-brand-navy">
                {formData.studentSignatureName || '...........................................'}
              </div>
              <span className="font-bold">Signature of the Student*</span>
            </div>
          </div>

        </div>

      </div>

      {/* Submission Success Modal */}
      {submitSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 text-center border border-slate-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Admission Form Submitted
            </span>

            <h3 className="text-2xl font-black text-brand-navy mt-3 mb-1">
              Congratulations, {submitSuccess.firstName}!
            </h3>
            <p className="text-xs text-slate-600 mb-6">
              Your official admission form for <strong>{submitSuccess.stream} ({submitSuccess.targetClass})</strong> has been registered with Rankers Path Indore.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2 mb-6 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Application Number:</span>
                <span className="font-mono font-black text-brand-navy text-sm tracking-wider">
                  {submitSuccess.applicationNo}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Student Name:</span>
                <span className="font-bold text-slate-800">
                  {submitSuccess.firstName} {submitSuccess.lastName}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Target Course:</span>
                <span className="font-bold text-slate-800">
                  {submitSuccess.stream} &bull; {submitSuccess.targetClass}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200">
                <span className="text-slate-500">Registered Mobile:</span>
                <span className="font-bold text-slate-800">
                  {submitSuccess.studentMobile || submitSuccess.parentMobile}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500">Centre:</span>
                <span className="font-bold text-slate-800">
                  Vijay Nagar Main Campus, Indore
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-3 px-4 bg-brand-navy hover:bg-[#081533] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md"
              >
                <Printer className="w-4 h-4 text-brand-yellow" />
                <span>Print Application Form</span>
              </button>

              <button
                onClick={() => {
                  setSubmitSuccess(null);
                  onBack();
                }}
                className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition"
              >
                Return to Website
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
