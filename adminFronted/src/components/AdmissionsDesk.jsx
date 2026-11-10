import React, { useState, useEffect } from 'react';
import {
  FileSpreadsheet,
  Download,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Trash2,
  Edit3,
  Printer,
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building,
  GraduationCap,
  Award,
  DollarSign,
  Key,
  Copy,
  Check,
  Share2,
  Send
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

export default function AdmissionsDesk() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [streamFilter, setStreamFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  // Selected Application for Modal
  const [selectedAdm, setSelectedAdm] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingOffice, setSavingOffice] = useState(false);

  // Student Credentials Modal State (Rankers@XXXX)
  const [credentialModalOpen, setCredentialModalOpen] = useState(false);
  const [generatedCreds, setGeneratedCreds] = useState(null);
  const [generatingCreds, setGeneratingCreds] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const [officeForm, setOfficeForm] = useState({
    status: 'PENDING',
    registrationNo: '',
    receiptNo: '',
    centre: 'Vijay Nagar Main Campus',
    counsellorName: '',
    promotionsExecutive: '',
    feePaymentMode: 'Instalment',
    amount: '',
    drawnOn: '',
    demandDraftNo: '',
    instalment1Paid: '',
    instalment2Paid: '',
    instalment3Paid: '',
    officeRemarks: ''
  });

  // Load Admissions
  useEffect(() => {
    loadAdmissions();
  }, [streamFilter, statusFilter]);

  const loadAdmissions = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getAdmissions({
        stream: streamFilter,
        status: statusFilter,
        search: searchTerm
      });
      if (res && res.data) {
        setAdmissions(res.data);
      }
    } catch (err) {
      console.error('Failed to load admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadAdmissions();
  };

  // Open Full Detail Modal
  const handleOpenDetailModal = (adm) => {
    setSelectedAdm(adm);
    setOfficeForm({
      status: adm.status || 'PENDING',
      registrationNo: adm.registrationNo || '',
      receiptNo: adm.receiptNo || '',
      centre: adm.centre || 'Vijay Nagar Main Campus',
      counsellorName: adm.counsellorName || '',
      promotionsExecutive: adm.promotionsExecutive || '',
      feePaymentMode: adm.feePaymentMode || 'Instalment',
      amount: adm.amount || '',
      drawnOn: adm.drawnOn || '',
      demandDraftNo: adm.demandDraftNo || '',
      instalment1Paid: adm.instalment1Paid || '',
      instalment2Paid: adm.instalment2Paid || '',
      instalment3Paid: adm.instalment3Paid || '',
      officeRemarks: adm.officeRemarks || ''
    });
    setIsModalOpen(true);
  };

  // Save Office Processing Details
  const handleSaveOfficeDetails = async (e) => {
    e.preventDefault();
    if (!selectedAdm) return;
    setSavingOffice(true);
    try {
      const res = await adminApi.updateAdmission(selectedAdm.id, officeForm);
      if (res && res.success) {
        setAdmissions(prev =>
          prev.map(item => item.id === selectedAdm.id ? { ...item, ...officeForm } : item)
        );
        setSelectedAdm(prev => ({ ...prev, ...officeForm }));
        setIsModalOpen(false);
      } else {
        alert(res?.message || 'Error updating record');
      }
    } catch (err) {
      alert(err.message || 'Error saving details');
    } finally {
      setSavingOffice(false);
    }
  };

  // Quick Status Update
  const handleQuickStatusChange = async (id, newStatus) => {
    try {
      const res = await adminApi.updateAdmission(id, { status: newStatus });
      if (res && res.success) {
        setAdmissions(prev =>
          prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
        );
      }
    } catch (err) {
      console.error('Quick status update failed:', err);
    }
  };

  // Generate Student Credentials (Rankers@XXXX)
  const handleGenerateCredentials = async (adm) => {
    if (adm.studentId) {
      setGeneratedCreds({
        admissionId: adm.id,
        applicationNo: adm.applicationNo,
        studentId: adm.studentId,
        password: adm.studentPassword || `Rankers#${adm.studentId.replace(/\D/g, '') || '2026'}`,
        studentName: `${adm.firstName} ${adm.lastName}`.trim(),
        mobile: adm.studentMobile || adm.parentMobile,
        stream: adm.stream,
        targetClass: adm.targetClass,
        centre: adm.centre
      });
      setCredentialModalOpen(true);
      return;
    }

    const studentFullName = `${adm.firstName} ${adm.lastName}`.trim();
    if (!window.confirm(`Generate official Student ID (Rankers@XXXX) and Password to enrol ${studentFullName}?`)) {
      return;
    }

    setGeneratingCreds(true);
    try {
      const res = await adminApi.generateStudentCredentials(adm.id);
      if (res && res.success) {
        setGeneratedCreds(res.data);
        setCredentialModalOpen(true);
        // Update table list
        setAdmissions(prev => prev.map(item => item.id === adm.id ? {
          ...item,
          status: 'APPROVED',
          isEnrolled: true,
          studentId: res.data.studentId,
          studentPassword: res.data.password
        } : item));
        if (selectedAdm && selectedAdm.id === adm.id) {
          setSelectedAdm(prev => ({
            ...prev,
            status: 'APPROVED',
            isEnrolled: true,
            studentId: res.data.studentId,
            studentPassword: res.data.password
          }));
        }
      } else {
        alert(res?.message || 'Failed to generate credentials');
      }
    } catch (err) {
      alert(err.message || 'Error generating credentials');
    } finally {
      setGeneratingCreds(false);
    }
  };

  const handleCopyText = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Delete Admission Record
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this admission record?')) return;
    try {
      const res = await adminApi.deleteAdmission(id);
      if (res && res.success) {
        setAdmissions(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  // Excel / CSV Export with UTF-8 BOM
  const handleExportExcel = () => {
    if (admissions.length === 0) {
      alert('No admission records to export.');
      return;
    }

    const headers = [
      'Application No',
      'Submission Date',
      'Status',
      'Target Stream',
      'Target Class',
      'Student Name',
      'Gender',
      'Date of Birth',
      'Category',
      'Blood Group',
      'Aadhar No',
      'Father Name',
      'Mother Name',
      'Father Occupation',
      'Mother Occupation',
      'Student Mobile',
      'Parent Mobile',
      'Email ID',
      'Address',
      'City',
      'State',
      'PIN Code',
      'School / College',
      '10th Board Marks (%)',
      '12th Board Marks (%)',
      '10th Grade Science',
      '10th Grade Maths',
      'Board of Exam',
      'Scholarship Eligibility',
      'How they knew RP',
      'Office Reg No',
      'Office Receipt No',
      'Centre',
      'Fee Mode',
      'Instalment 1 Paid',
      'Instalment 2 Paid',
      'Counsellor',
      'Promotions Exec',
      'Office Remarks'
    ];

    const escapeCsv = (str) => {
      const val = str !== undefined && str !== null ? String(str) : '';
      return `"${val.replace(/"/g, '""')}"`;
    };

    const rows = admissions.map(item => [
      item.applicationNo || '',
      (item.createdAt || '').slice(0, 10),
      item.status || 'PENDING',
      item.stream || '',
      item.targetClass || '',
      `${item.firstName || ''} ${item.lastName || ''}`.trim(),
      item.gender || '',
      item.dob || '',
      item.category || '',
      item.bloodGroup || '',
      item.aadharNo || '',
      item.fatherName || '',
      item.motherName || '',
      item.fatherOccupation || '',
      item.motherOccupation || '',
      item.studentMobile || '',
      item.parentMobile || '',
      item.email || '',
      item.address || '',
      item.city || '',
      item.state || '',
      item.pin || '',
      item.schoolName || '',
      item.marksX || '',
      item.marksXII || '',
      item.gradeScience || '',
      item.gradeMaths || '',
      item.examBoard || '',
      item.scholarshipEligibility || '',
      item.source || '',
      item.registrationNo || '',
      item.receiptNo || '',
      item.centre || '',
      item.feePaymentMode || '',
      item.instalment1Paid || '',
      item.instalment2Paid || '',
      item.counsellorName || '',
      item.promotionsExecutive || '',
      item.officeRemarks || ''
    ].map(escapeCsv).join(','));

    // Prepend UTF-8 BOM so Microsoft Excel opens it without character encoding issues
    const csvContent = '\uFEFF' + headers.map(h => `"${h}"`).join(',') + '\n' + rows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.setAttribute('download', `RankersPath_Admissions_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filtered by Search
  const filteredAdmissions = admissions.filter(item => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    const full = `${item.firstName || ''} ${item.lastName || ''} ${item.applicationNo || ''} ${item.studentMobile || ''} ${item.parentMobile || ''} ${item.city || ''} ${item.registrationNo || ''} ${item.fatherName || ''}`.toLowerCase();
    return full.includes(q);
  });

  // Metric Computations
  const totalCount = admissions.length;
  const neetCount = admissions.filter(a => a.stream === 'NEET').length;
  const jeeCount = admissions.filter(a => a.stream === 'IIT/JEE').length;
  const pendingCount = admissions.filter(a => a.status === 'PENDING').length;
  const approvedCount = admissions.filter(a => a.status === 'APPROVED' || a.status === 'FEE_PAID').length;

  return (
    <div className="space-y-6">
      
      {/* 1. TOP METRICS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-brand-navy/10 text-brand-navy flex items-center justify-center font-bold">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Applications</span>
            <span className="text-2xl font-black text-slate-900">{totalCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">NEET Medical</span>
            <span className="text-2xl font-black text-slate-900">{neetCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">IIT-JEE Engg</span>
            <span className="text-2xl font-black text-slate-900">{jeeCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-100 text-yellow-700 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Review</span>
            <span className="text-2xl font-black text-yellow-700">{pendingCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Approved / Enrolled</span>
            <span className="text-2xl font-black text-emerald-600">{approvedCount}</span>
          </div>
        </div>

      </div>

      {/* 2. ACTION TOOLBAR & FILTERS */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Name, App No, Phone, City..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:bg-white"
          />
        </form>

        {/* Filter Drops */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Stream Filter */}
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Streams</option>
            <option value="NEET">NEET (UG)</option>
            <option value="IIT/JEE">IIT / JEE</option>
            <option value="Other Classes">Foundation (9th/10th)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="VERIFIED">Verified</option>
            <option value="APPROVED">Approved</option>
            <option value="FEE_PAID">Fee Paid</option>
            <option value="REJECTED">Rejected</option>
          </select>

          {/* Refresh */}
          <button
            onClick={loadAdmissions}
            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* EXCEL EXPORT BUTTON (Requested by user) */}
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-[#107C41] hover:bg-[#0b5c30] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow flex items-center gap-2 transform hover:scale-[1.02]"
            title="Export all admission entries directly into Excel spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-200" />
            <span>Download Excel</span>
          </button>

        </div>

      </div>

      {/* 3. ADMISSION DATA TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-[11px] font-black uppercase tracking-wider text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Application Details</th>
                <th className="py-3 px-4">Applicant &amp; Parent</th>
                <th className="py-3 px-4">Course &amp; Class</th>
                <th className="py-3 px-4">Contact &amp; City</th>
                <th className="py-3 px-4">Academic &amp; Scholarship</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400">
                    <FileSpreadsheet className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold text-sm">No admission applications found.</p>
                    <p className="text-xs">Applications submitted via website admission form will appear here automatically.</p>
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((adm) => (
                  <tr key={adm.id} className="hover:bg-slate-50/80 transition">
                    
                    {/* App No & Date */}
                    <td className="py-3 px-4">
                      <span className="font-mono font-black text-brand-navy block text-xs">
                        {adm.applicationNo || 'RP-ADM-2026'}
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        {(adm.createdAt || adm.date || '').slice(0, 10)}
                      </span>
                      {adm.studentId ? (
                        <span className="inline-flex items-center gap-1 mt-1 text-[10px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full font-mono font-black shadow-xs">
                          <Key className="w-2.5 h-2.5 text-emerald-700" />
                          {adm.studentId}
                        </span>
                      ) : adm.registrationNo ? (
                        <span className="inline-block mt-1 text-[9px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold">
                          Reg: {adm.registrationNo}
                        </span>
                      ) : null}
                    </td>

                    {/* Applicant & Parent */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 border border-slate-300">
                          {adm.photoUrl ? (
                            <img src={adm.photoUrl} alt="Student" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 leading-tight">
                            {adm.firstName} {adm.lastName}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            Father: {adm.fatherName || '—'}
                          </div>
                          <div className="text-[9px] text-slate-400">
                            {adm.gender} &bull; {adm.category} {adm.bloodGroup ? `&bull; ${adm.bloodGroup}` : ''}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Course & Class */}
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                        adm.stream === 'NEET'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : adm.stream === 'IIT/JEE'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}>
                        {adm.stream}
                      </span>
                      <span className="block text-[11px] font-semibold text-slate-700 mt-1">
                        {adm.targetClass}
                      </span>
                      <span className="block text-[10px] text-slate-400">
                        {adm.centre || 'Vijay Nagar'}
                      </span>
                    </td>

                    {/* Contact & City */}
                    <td className="py-3 px-4 text-xs">
                      <div className="flex items-center gap-1 font-mono font-bold text-brand-navy">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{adm.studentMobile || adm.parentMobile || '—'}</span>
                      </div>
                      {adm.parentMobile && adm.studentMobile && (
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          Parent: {adm.parentMobile}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span>{adm.city || 'Indore'}, {adm.state || 'MP'}</span>
                      </div>
                    </td>

                    {/* Academic & Scholarship */}
                    <td className="py-3 px-4 text-xs">
                      {adm.marksX && (
                        <div>
                          <span className="text-slate-500 text-[10px]">10th: </span>
                          <span className="font-bold text-slate-900">{adm.marksX}%</span>
                        </div>
                      )}
                      {adm.marksXII && (
                        <div>
                          <span className="text-slate-500 text-[10px]">12th: </span>
                          <span className="font-bold text-slate-900">{adm.marksXII}%</span>
                        </div>
                      )}
                      <div className="mt-1">
                        <span className="px-1.5 py-0.5 rounded bg-brand-yellow/20 text-brand-navy font-black text-[10px]">
                          Scholarship: {adm.scholarshipEligibility || '0%'}
                        </span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-3 px-4">
                      <select
                        value={adm.status || 'PENDING'}
                        onChange={(e) => handleQuickStatusChange(adm.id, e.target.value)}
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                          adm.status === 'APPROVED' || adm.status === 'FEE_PAID'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : adm.status === 'VERIFIED'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : adm.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="VERIFIED">VERIFIED</option>
                        <option value="APPROVED">APPROVED</option>
                        <option value="FEE_PAID">FEE PAID</option>
                        <option value="REJECTED">REJECTED</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleGenerateCredentials(adm)}
                          disabled={generatingCreds}
                          className={`p-1.5 rounded-lg transition flex items-center gap-1 font-bold text-[10px] ${
                            adm.studentId
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-300'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                          }`}
                          title={adm.studentId ? `View ID: ${adm.studentId}` : 'Approve & Generate Student ID (Rankers@XXXX)'}
                        >
                          <Key className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">{adm.studentId ? 'ID' : 'Enrol'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenDetailModal(adm)}
                          className="p-1.5 rounded-lg bg-brand-navy text-white hover:bg-[#081533] transition"
                          title="View &amp; Process Official Form"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(adm.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. FULL FORM DETAILS & OFFICE PROCESSING MODAL */}
      {isModalOpen && selectedAdm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            
            {/* Modal Header */}
            <div className="p-6 bg-brand-navy text-white rounded-t-3xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-brand-yellow block">
                  Official Admission Form Record
                </span>
                <h3 className="text-xl font-black">
                  {selectedAdm.firstName} {selectedAdm.lastName} &bull; <span className="font-mono text-brand-yellow">{selectedAdm.applicationNo}</span>
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              
              {/* Form Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Photo & Basic Info */}
                <div className="border border-slate-200 rounded-2xl p-4 text-center bg-slate-50">
                  <div className="w-32 h-40 mx-auto rounded-xl bg-slate-200 border-2 border-slate-300 overflow-hidden flex items-center justify-center mb-3">
                    {selectedAdm.photoUrl ? (
                      <img src={selectedAdm.photoUrl} alt="Student" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-slate-400" />
                    )}
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">
                    {selectedAdm.firstName} {selectedAdm.lastName}
                  </h4>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Course: <strong className="text-brand-navy">{selectedAdm.stream}</strong> ({selectedAdm.targetClass})
                  </p>
                  <p className="text-xs text-slate-500">
                    Category: <strong>{selectedAdm.category}</strong> &bull; Blood: <strong>{selectedAdm.bloodGroup || 'N/A'}</strong>
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    DOB: <strong>{selectedAdm.dob || 'N/A'}</strong> &bull; Gender: <strong>{selectedAdm.gender}</strong>
                  </p>
                  {selectedAdm.aadharNo && (
                    <p className="text-[11px] font-mono text-slate-600 mt-1">
                      Aadhar: {selectedAdm.aadharNo}
                    </p>
                  )}
                </div>

                {/* Family & Correspondence Details */}
                <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white text-xs">
                  <h4 className="font-black text-brand-navy text-xs uppercase tracking-wider border-b pb-1.5">
                    Family &amp; Address
                  </h4>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Father / Guardian:</span>
                    <span className="font-bold text-slate-800">{selectedAdm.fatherName || '—'}</span>
                    {selectedAdm.fatherOccupation && <span className="text-slate-500"> ({selectedAdm.fatherOccupation})</span>}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Mother:</span>
                    <span className="font-bold text-slate-800">{selectedAdm.motherName || '—'}</span>
                    {selectedAdm.motherOccupation && <span className="text-slate-500"> ({selectedAdm.motherOccupation})</span>}
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Address:</span>
                    <span className="font-semibold text-slate-700">{selectedAdm.address || '—'}</span>
                    <span className="block text-slate-500">{selectedAdm.city}, {selectedAdm.state} - {selectedAdm.pin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Contacts:</span>
                    <span className="font-mono font-bold text-slate-800 block">Parent: {selectedAdm.parentMobile || '—'}</span>
                    <span className="font-mono font-bold text-slate-800 block">Student: {selectedAdm.studentMobile || '—'}</span>
                    <span className="text-slate-600 block">{selectedAdm.email || '—'}</span>
                  </div>
                </div>

                {/* Academic & Scholarship Details */}
                <div className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-white text-xs">
                  <h4 className="font-black text-brand-navy text-xs uppercase tracking-wider border-b pb-1.5">
                    Academic Scores &amp; Scholarship
                  </h4>
                  <div>
                    <span className="text-slate-400 block text-[10px]">School / College:</span>
                    <span className="font-bold text-slate-800">{selectedAdm.schoolName || '—'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">10th Board:</span>
                      <span className="font-bold text-slate-800">{selectedAdm.marksX ? `${selectedAdm.marksX}%` : '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">12th Board:</span>
                      <span className="font-bold text-slate-800">{selectedAdm.marksXII ? `${selectedAdm.marksXII}%` : '—'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Science Grade:</span>
                      <span className="font-bold text-slate-800">{selectedAdm.gradeScience || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Maths Grade:</span>
                      <span className="font-bold text-slate-800">{selectedAdm.gradeMaths || '—'}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Exam Board:</span>
                    <span className="font-bold text-slate-800">{selectedAdm.examBoard || 'CBSE'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Scholarship Eligibility:</span>
                    <span className="px-2 py-0.5 rounded bg-brand-yellow font-black text-brand-navy text-xs inline-block">
                      {selectedAdm.scholarshipEligibility || '0%'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Heard About Rankers Path:</span>
                    <span className="font-semibold text-slate-700">{selectedAdm.source || 'Website'}</span>
                  </div>
                </div>

              </div>

              {/* Office Administration Form */}
              <form onSubmit={handleSaveOfficeDetails} className="border-2 border-brand-navy/20 rounded-2xl p-5 bg-sky-50/40 space-y-4">
                <div className="flex items-center justify-between border-b border-sky-200 pb-2">
                  <h4 className="font-black text-brand-navy text-sm uppercase tracking-wider flex items-center gap-2">
                    <Building className="w-4 h-4 text-brand-navy" />
                    <span>For Office Use &bull; ERP Allotment &amp; Accounts</span>
                  </h4>
                  <span className="text-xs font-semibold text-slate-500">Edit and save office records</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Application Status</label>
                    <select
                      value={officeForm.status}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl font-bold text-brand-navy bg-white"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="VERIFIED">VERIFIED</option>
                      <option value="APPROVED">APPROVED</option>
                      <option value="FEE_PAID">FEE PAID</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Office Registration No.</label>
                    <input
                      type="text"
                      value={officeForm.registrationNo}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, registrationNo: e.target.value }))}
                      placeholder="e.g. REG-2026-0045"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Office Receipt No.</label>
                    <input
                      type="text"
                      value={officeForm.receiptNo}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, receiptNo: e.target.value }))}
                      placeholder="e.g. RCP-2026-0199"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Allotted Centre</label>
                    <select
                      value={officeForm.centre}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, centre: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold"
                    >
                      <option value="Vijay Nagar Main Campus">Vijay Nagar Main Campus (HQ City Walk, Indore)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Assigned Counsellor</label>
                    <input
                      type="text"
                      value={officeForm.counsellorName}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, counsellorName: e.target.value }))}
                      placeholder="Counsellor Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Promotions Executive</label>
                    <input
                      type="text"
                      value={officeForm.promotionsExecutive}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, promotionsExecutive: e.target.value }))}
                      placeholder="Executive Name"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fee Payment Mode</label>
                    <select
                      value={officeForm.feePaymentMode}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, feePaymentMode: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-semibold"
                    >
                      <option value="Lumpsum">Lumpsum (One-Time)</option>
                      <option value="Instalment">Instalment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Amount Paid (₹)</label>
                    <input
                      type="text"
                      value={officeForm.amount}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="e.g. 55000"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">1st Instalment Details</label>
                    <input
                      type="text"
                      value={officeForm.instalment1Paid}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, instalment1Paid: e.target.value }))}
                      placeholder="e.g. ₹55,000 (Paid 29/09)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">2nd Instalment Details</label>
                    <input
                      type="text"
                      value={officeForm.instalment2Paid}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, instalment2Paid: e.target.value }))}
                      placeholder="e.g. Due Dec 2026"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Demand Draft / Bank Details</label>
                    <input
                      type="text"
                      value={officeForm.drawnOn}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, drawnOn: e.target.value }))}
                      placeholder="DD No. / Bank Name / Transaction Ref"
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block font-bold text-slate-700 mb-1">Office Remarks / Verification Notes</label>
                    <input
                      type="text"
                      value={officeForm.officeRemarks}
                      onChange={(e) => setOfficeForm(prev => ({ ...prev, officeRemarks: e.target.value }))}
                      placeholder="Add administrative notes, document verification status, etc."
                      className="w-full px-3 py-2 border border-slate-300 rounded-xl bg-white"
                    />
                  </div>

                  {/* Student Portal Enrolment Credentials Box */}
                  <div className="sm:col-span-4 p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <Key className="w-3 h-3 text-emerald-700" />
                        <span>Enrolment &amp; Student Portal Access</span>
                      </span>
                      <h5 className="font-extrabold text-sm text-emerald-950 mt-1">
                        {selectedAdm.studentId ? (
                          <span>Enrolled Student ID: <strong className="font-mono text-brand-navy">{selectedAdm.studentId}</strong></span>
                        ) : (
                          <span>Assign Official Student ID (Rankers@XXXX)</span>
                        )}
                      </h5>
                      <p className="text-xs text-emerald-700">
                        {selectedAdm.studentId
                          ? `Password: ${selectedAdm.studentPassword || `Rankers#${selectedAdm.studentId.replace(/\D/g, '')}`} • Student can log in directly at website.`
                          : 'Generates sequential Rankers@XXXX ID and allows student to access Enrolled Student Portal (Lectures, Batches, Notes).'}
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={generatingCreds}
                      onClick={() => handleGenerateCredentials(selectedAdm)}
                      className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition flex items-center gap-1.5 flex-shrink-0"
                    >
                      <Key className="w-3.5 h-3.5" />
                      <span>{selectedAdm.studentId ? 'View Credentials' : 'Enrol & Generate ID'}</span>
                    </button>
                  </div>

                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Form</span>
                  </button>

                  <button
                    type="submit"
                    disabled={savingOffice}
                    className="px-5 py-2 bg-brand-navy hover:bg-[#081533] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {savingOffice ? (
                      <span>Saving...</span>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-brand-yellow" />
                        <span>Save Office Record</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>

          </div>
        </div>
      )}

      {/* 5. STUDENT CREDENTIALS POPUP MODAL (Rankers@XXXX) */}
      {credentialModalOpen && generatedCreds && (
        <div className="fixed inset-0 z-[60] bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setCredentialModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Key className="w-6 h-6" />
            </div>

            <div className="text-center mb-5">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Official Admission Enrolment
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Student Portal Credentials
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Generated for <strong>{generatedCreds.studentName}</strong> ({generatedCreds.applicationNo})
              </p>
            </div>

            <div className="space-y-3 bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-5 text-xs">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  Official Student ID (User Login)
                </span>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-black text-brand-navy text-sm">
                  <span>{generatedCreds.studentId}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(generatedCreds.studentId, 'id')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-50 transition"
                    title="Copy Student ID"
                  >
                    {copiedField === 'id' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">
                  Portal Password
                </span>
                <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 font-mono font-black text-slate-800 text-sm">
                  <span>{generatedCreds.password}</span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(generatedCreds.password, 'pass')}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-navy hover:bg-slate-50 transition"
                    title="Copy Password"
                  >
                    {copiedField === 'pass' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-500">
                <span>Portal Link: </span>
                <span className="font-mono font-bold text-slate-700">http://localhost:5175/</span>
              </div>
            </div>

            <div className="space-y-2">
              {/* WhatsApp Share Button */}
              {generatedCreds.mobile && (
                <a
                  href={`https://wa.me/91${generatedCreds.mobile.replace(/\D/g, '').slice(-10)}?text=${encodeURIComponent(
                    `Dear ${generatedCreds.studentName},\nCongratulations! Your admission at Rankers Path is confirmed.\n\nYour Student Portal Credentials are:\nStudent ID: ${generatedCreds.studentId}\nPassword: ${generatedCreds.password}\nLogin at: http://localhost:5175/\n\nTeam Rankers Path Indore`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-[#25D366] hover:bg-[#1ebd5a] text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Send Credentials on WhatsApp</span>
                </a>
              )}

              <button
                type="button"
                onClick={() => {
                  const fullMsg = `Dear ${generatedCreds.studentName}, your Rankers Path Student Portal ID is ${generatedCreds.studentId} and Password is ${generatedCreds.password}. Login at http://localhost:5175/`;
                  handleCopyText(fullMsg, 'all');
                }}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2"
              >
                {copiedField === 'all' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedField === 'all' ? 'Copied Full Message!' : 'Copy Full Message Text'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
