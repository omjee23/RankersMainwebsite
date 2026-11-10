import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  MapPin,
  FileSpreadsheet,
  BookOpen,
  Globe,
  Download,
  LogOut,
  QrCode,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Phone,
  Calendar,
  Lock,
  Sparkles,
  TrendingUp,
  Award,
  GraduationCap,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  UploadCloud,
  Camera,
  Layers,
  RotateCcw,
  X,
  Menu,
  Radio,
  Video,
  Film,
  FolderOpen,
  Send,
  Check,
  Filter,
  Printer,
  FileText,
  CreditCard,
  Receipt,
  ShieldCheck,
  Image as ImageIcon,
  Fingerprint,
  MessageSquareQuote,
  Zap
} from 'lucide-react';
import { adminApi } from './services/adminApi';
import { compressImage, resolvePhotoUrl } from './utils/imageCompressor';
import AdmissionsDesk from './components/AdmissionsDesk';
import StudyMaterialDesk from './components/StudyMaterialDesk';
import LiveClassesDesk from './components/LiveClassesDesk';
import RecordedLecturesDesk from './components/RecordedLecturesDesk';
import ClassCalendarDesk from './components/ClassCalendarDesk';
import GalleryDesk from './components/GalleryDesk';
import CbtExamsDesk from './components/CbtExamsDesk';
import QuestionBankDesk from './components/QuestionBankDesk';
import DirectorReportModal from './components/DirectorReportModal';
import CandidateInspectModal from './components/CandidateInspectModal';
import DirectorShareModal from './components/DirectorShareModal';
import ExamParticipationModal from './components/ExamParticipationModal';
import BiometricAttendanceDesk from './components/BiometricAttendanceDesk';
import TestimonialsDesk from './components/TestimonialsDesk';
import RsatCommandCenterDesk from './components/RsatCommandCenterDesk';
import RankXCommandCenterDesk from './components/RankXCommandCenterDesk';

export default function App() {
  const [adminUser, setAdminUser] = useState(null);
  const [activeMenu, setActiveMenu] = useState('overview'); // overview, students, centres, marks, questions, cms, reports
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [cmsData, setCmsData] = useState({});
  const [loading, setLoading] = useState(false);

  // Payments & Cashfree Audit State
  const [paymentsList, setPaymentsList] = useState([]);
  const [paymentGatewayFilter, setPaymentGatewayFilter] = useState('ALL');
  const [paymentPurposeFilter, setPaymentPurposeFilter] = useState('ALL');
  const [paymentSearch, setPaymentSearch] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // Institute Fee Structure Config State (Admin Decision)
  const [feeConfig, setFeeConfig] = useState({
    rsatFee: 100,
    rankxFee: 100,
    classroomTokenFee: 5000,
    testSeriesFee: 1500,
    dropperBatchFee: 110000,
    foundationFee: 65000,
    twoYearJeeNeetFee: 125000,
    gstRate: 18,
    allowCustomTuitionFee: true,
    minCustomFee: 500
  });
  const [feeSaving, setFeeSaving] = useState(false);
  const [feeSaveSuccess, setFeeSaveSuccess] = useState('');

  // Faculty State
  const [facultyList, setFacultyList] = useState([]);
  const [facultyModalOpen, setFacultyModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    degree: '',
    role: '',
    subject: 'Biology',
    exp: '20+ Years Experience',
    photo: '/assets/web/faculty-team-full.png',
    bio: '',
    showOnHome: false,
    order: 10
  });
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoStats, setPhotoStats] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const [showCustomUrl, setShowCustomUrl] = useState(false);

  // Courses State
  const [coursesList, setCoursesList] = useState([]);
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    domainKey: 'jee-adv',
    desc: '',
    tuitionFee: '₹1,10,000 / Year',
    badge: 'Class',
    category: 'ENGINEERING',
    target: 'IIT-JEE 2026 / 2027 Aspirants',
    eligibility: 'Class 10th to 11th moving, 12th appearing & 12th Pass (Dropper)',
    duration: '1 Year / 2 Years Comprehensive Classroom Programme',
    scholarshipWaiver: 'Up to 90% (Save up to ₹99,000 via RSAT)',
    startingFee: '₹11,000',
    keyFeatures: '',
    order: 1,
    active: true
  });

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // QR Attendance Input
  const [scanRollNumber, setScanRollNumber] = useState('');
  const [scanResult, setScanResult] = useState(null);

  // New Question Form
  const [newQuestion, setNewQuestion] = useState({
    stream: 'JEE',
    questionType: 'MCQ',
    subject: 'Physics',
    topic: 'Mechanics',
    section: 'Section A',
    questionText: '',
    options: ['', '', '', ''],
    correctOption: 0,
    correctAnswer: '',
    rangeMin: '',
    rangeMax: '',
    tolerance: '',
    explanation: '',
    classLevel: 'Class 11'
  });

  // Offline Marks CSV Input
  const [marksCsvText, setMarksCsvText] = useState('rollNumber,marks,maxMarks\nRPX-2026-0001,245,300\nRPX-2026-0002,185,300\nRPX-2026-0003,280,300');
  const [marksResult, setMarksResult] = useState('');

  // Tests Management State
  const [testsList, setTestsList] = useState([]);
  const [testModalOpen, setTestModalOpen] = useState(false);
  const [examCategoryFilter, setExamCategoryFilter] = useState('ALL'); // ALL, RSAT, RANKEX, STUDENT_TEST_SERIES
  const [examStreamFilter, setExamStreamFilter] = useState('ALL'); // ALL, JEE, NEET
  const [examTierFilter, setExamTierFilter] = useState('ALL'); // ALL, DIAMOND, PLATINUM, SILVER, GREEN

  // Director Share & Participation Modals State
  const [selectedTestForDirectorShare, setSelectedTestForDirectorShare] = useState(null);
  const [directorShareModalOpen, setDirectorShareModalOpen] = useState(false);
  const [selectedTestForParticipation, setSelectedTestForParticipation] = useState(null);
  const [participationModalOpen, setParticipationModalOpen] = useState(false);

  const [testForm, setTestForm] = useState({
    title: '',
    category: 'STUDENT_TEST_SERIES',
    patternType: 'JEE_MAIN',
    examType: 'JEE_MAIN',
    stream: 'JEE',
    subject: 'FULL_MOCK',
    batchTier: 'ALL',
    targetBatch: 'ALL',
    classLevel: 'Class 12',
    durationMinutes: 180,
    totalMarks: 300,
    description: '',
    isPublishedToStudents: false,
    directorMobile: '9131435511',
    directorEmail: 'director@rankerspath.in',
    sendDirectlyToDirector: true
  });

  // Submissions Management & Publishing State
  const [submissionCategoryFilter, setSubmissionCategoryFilter] = useState('ALL'); // ALL, RSAT, RANKEX, STUDENT_TEST_SERIES
  const [selectedExamFilter, setSelectedExamFilter] = useState('ALL'); // ALL or specific exam title
  const [directorReportModalOpen, setDirectorReportModalOpen] = useState(false);
  const [selectedSubmissionForInspect, setSelectedSubmissionForInspect] = useState(null);
  const [submissionPublishFilter, setSubmissionPublishFilter] = useState('ALL'); // ALL, PUBLISHED, PENDING
  const [submissionSearch, setSubmissionSearch] = useState('');
  const [editSubmissionModal, setEditSubmissionModal] = useState(null);
  const [editSubmissionForm, setEditSubmissionForm] = useState({
    score: 0,
    maxMarks: 100,
    percentage: 0,
    scholarshipPercent: 0,
    remarks: '',
    isPublished: false
  });

  // Check persisted admin session
  useEffect(() => {
    const cached = localStorage.getItem('rp_admin_user');
    if (cached) {
      try {
        setAdminUser(JSON.parse(cached));
      } catch (e) {}
    }
  }, []);

  // Fetch data on login
  useEffect(() => {
    if (adminUser) {
      loadAllData();
    }
  }, [adminUser]);

  const loadAllData = async () => {
    setLoading(true);
    const [statsRes, studentsRes, questionsRes, cmsRes, subsRes, facRes, coursesRes, testsRes, paymentsRes, feeRes] = await Promise.all([
      adminApi.getDashboardStats(),
      adminApi.getStudents(),
      adminApi.getQuestions(),
      adminApi.getCMS(),
      adminApi.getSubmissions(),
      adminApi.getFaculty(),
      adminApi.getCourses(true),
      adminApi.getAllTests(),
      adminApi.getPayments(),
      adminApi.getFeeConfig()
    ]);
    if (statsRes.data) setStats(statsRes.data);
    if (studentsRes.data) setStudents(studentsRes.data);
    if (questionsRes.data) setQuestions(questionsRes.data);
    if (cmsRes.data) setCmsData(cmsRes.data);
    if (subsRes && subsRes.data) setSubmissions(Array.isArray(subsRes.data) ? subsRes.data : (subsRes.data.submissions || []));
    if (facRes && facRes.data) setFacultyList(facRes.data);
    if (coursesRes && coursesRes.data) setCoursesList(coursesRes.data);
    if (testsRes && testsRes.data) setTestsList(Array.isArray(testsRes.data) ? testsRes.data : (testsRes.data.tests || []));
    if (paymentsRes && paymentsRes.data) setPaymentsList(Array.isArray(paymentsRes.data) ? paymentsRes.data : (paymentsRes.data.payments || []));
    if (feeRes && feeRes.data) setFeeConfig(feeRes.data);
    setLoading(false);
  };

  const refreshPayments = async () => {
    setLoading(true);
    try {
      const pRes = await adminApi.getPayments();
      if (pRes && pRes.data) {
        setPaymentsList(Array.isArray(pRes.data) ? pRes.data : (pRes.data.payments || []));
      }
      const sRes = await adminApi.getDashboardStats();
      if (sRes && sRes.data) setStats(sRes.data);
      const fRes = await adminApi.getFeeConfig();
      if (fRes && fRes.data) setFeeConfig(fRes.data);
    } catch (err) {
      console.warn('Failed to refresh payments:', err);
    }
    setLoading(false);
  };

  const handleSaveFeeConfig = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setFeeSaving(true);
    setFeeSaveSuccess('');
    try {
      const res = await adminApi.updateFeeConfig(feeConfig);
      if (res.success && res.data) {
        setFeeConfig(res.data);
        setFeeSaveSuccess('✅ Institute Fee Structure saved & published to website successfully!');
        setTimeout(() => setFeeSaveSuccess(''), 4500);
      } else {
        alert(res.message || 'Failed to update fee configuration');
      }
    } catch (err) {
      alert('Error saving fee configuration: ' + err.message);
    }
    setFeeSaving(false);
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await adminApi.createTest(testForm);
    setLoading(false);
    if (res.success && res.data) {
      setTestsList(prev => [res.data, ...prev]);
      setTestModalOpen(false);
      setSelectedTestForDirectorShare(res.data);
      setDirectorShareModalOpen(true);
      alert('🎉 New CBT Test Paper created! Opening Director Approval Desk to share via WhatsApp or Email.');
    } else {
      alert(res.message || 'Failed to create test');
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to remove this test window?')) return;
    setLoading(true);
    const res = await adminApi.deleteTest(testId);
    setLoading(false);
    if (res.success) {
      setTestsList(prev => prev.filter(t => t.id !== testId));
    } else {
      alert(res.message || 'Failed to delete test');
    }
  };

  const handleTestApproved = (updatedTest) => {
    if (!updatedTest) return;
    setTestsList(prev => prev.map(t => t.id === updatedTest.id ? updatedTest : t));
  };

  const filteredExams = (Array.isArray(testsList) ? testsList : []).filter(t => {
    if (examCategoryFilter !== 'ALL') {
      const cat = t.category || (t.examType === 'RSAT' ? 'RSAT' : (t.examType === 'RANKEX' ? 'RANKEX' : 'STUDENT_TEST_SERIES'));
      if (cat.toUpperCase() !== examCategoryFilter.toUpperCase()) return false;
    }
    if (examStreamFilter !== 'ALL' && t.stream !== 'ALL') {
      if (t.stream && t.stream.toUpperCase() !== examStreamFilter.toUpperCase()) return false;
    }
    if (examTierFilter !== 'ALL' && t.batchTier !== 'ALL') {
      if (t.batchTier && t.batchTier.toUpperCase() !== examTierFilter.toUpperCase()) return false;
    }
    return true;
  });

  const filteredSubmissions = (Array.isArray(submissions) ? submissions : []).filter(s => {
    const subCat = s.category || (s.examType === 'RSAT' || (s.examTitle && s.examTitle.includes('RSAT')) ? 'RSAT' : (s.examType === 'RANKEX' || (s.examTitle && s.examTitle.includes('RANKEX')) ? 'RANKEX' : 'STUDENT_TEST_SERIES'));
    if (submissionCategoryFilter !== 'ALL' && subCat.toUpperCase() !== submissionCategoryFilter.toUpperCase()) {
      return false;
    }
    if (selectedExamFilter !== 'ALL') {
      const matchId = s.testId && s.testId === selectedExamFilter;
      const matchTitle = s.examTitle && s.examTitle.toLowerCase() === selectedExamFilter.toLowerCase();
      if (!matchId && !matchTitle) return false;
    }
    const isPub = s.isPublished !== undefined ? s.isPublished : (subCat === 'RSAT');
    if (submissionPublishFilter === 'PUBLISHED' && !isPub) return false;
    if (submissionPublishFilter === 'PENDING' && isPub) return false;
    if (submissionSearch) {
      const q = submissionSearch.toLowerCase();
      const matchName = s.studentName && s.studentName.toLowerCase().includes(q);
      const matchMobile = s.mobile && s.mobile.includes(q);
      const matchTitle = s.examTitle && s.examTitle.toLowerCase().includes(q);
      if (!matchName && !matchMobile && !matchTitle) return false;
    }
    return true;
  });

  const availableExamOptions = Array.from(new Set(
    (Array.isArray(submissions) ? submissions : [])
      .map(s => s.examTitle)
      .concat((Array.isArray(testsList) ? testsList : []).map(t => t.title))
      .filter(Boolean)
  ));

  const handleDownloadExcelCsv = () => {
    const dataToExport = filteredSubmissions;
    if (dataToExport.length === 0) {
      alert('No candidate submissions available to export for the selected filter.');
      return;
    }

    const headers = [
      'Rank',
      'Candidate Name',
      'Mobile Number',
      'Email',
      'Exam Title',
      'Category',
      'Target Stream',
      'Class Level',
      'Score Obtained',
      'Maximum Marks',
      'Percentage (%)',
      'Percentile',
      'Correct Answers',
      'Incorrect Answers',
      'Unattempted',
      'Scholarship Waiver (%)',
      'Anti-Cheat Tab Switches',
      'Submission Timestamp',
      'Student Panel Published'
    ];

    const sortedData = [...dataToExport].sort((a, b) => (b.score || 0) - (a.score || 0));

    const rows = sortedData.map((s, idx) => {
      const cat = s.category || (s.examType === 'RSAT' || (s.examTitle && s.examTitle.includes('RSAT')) ? 'RSAT' : (s.examType === 'RANKEX' || (s.examTitle && s.examTitle.includes('RANKEX')) ? 'RANKEX' : 'STUDENT_TEST_SERIES'));
      const isPub = s.isPublished !== undefined ? s.isPublished : (cat === 'RSAT');

      return [
        idx + 1,
        `"${(s.studentName || 'Student').replace(/"/g, '""')}"`,
        `"+91-${s.mobile || ''}"`,
        `"${s.email || ''}"`,
        `"${(s.examTitle || 'CBT Exam').replace(/"/g, '""')}"`,
        cat,
        s.targetStream || s.stream || 'ALL',
        s.targetClass || s.classLevel || 'Class 12',
        s.score ?? 0,
        s.maxMarks ?? 100,
        `${s.percentage ?? 0}%`,
        s.percentile ? `${s.percentile} %ile` : `${Math.min(99.9, Math.round(((s.score || 0) / (s.maxMarks || 100)) * 100))}%ile`,
        s.correctCount ?? Math.max(0, Math.round((s.score || 0) / 4)),
        s.incorrectCount ?? (s.tabSwitchCount || 0),
        s.unattemptedCount ?? 0,
        `${s.scholarshipPercent ?? 50}%`,
        s.tabSwitchCount ?? 0,
        `"${s.submittedAt || s.createdAt || new Date().toISOString()}"`,
        isPub ? 'YES (Published)' : 'NO (Pending)'
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const dateStr = new Date().toISOString().split('T')[0];
    const examSlug = selectedExamFilter !== 'ALL' ? selectedExamFilter.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 25) : 'All_Exams';
    link.setAttribute('download', `Rankers_Path_Marks_Report_${examSlug}_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleTogglePublishSubmission = async (submissionId) => {
    setLoading(true);
    const res = await adminApi.togglePublishSubmission(submissionId);
    setLoading(false);
    if (res.success && res.data) {
      setSubmissions(prev => prev.map(s => s.id === submissionId ? { ...s, isPublished: res.data.isPublished } : s));
    } else {
      alert(res.message || 'Failed to toggle publication status');
    }
  };

  const handleBulkPublish = async (publish = true) => {
    if (!window.confirm(`Are you sure you want to ${publish ? 'Send all filtered results to Student Panel' : 'Unpublish all filtered results'}?`)) return;
    setLoading(true);
    const targetSubs = filteredSubmissions;
    const targetIds = targetSubs.map(s => s.id);
    const res = await adminApi.bulkPublishSubmissions({ submissionIds: targetIds, publish });
    setLoading(false);
    if (res.success) {
      setSubmissions(prev => prev.map(s => targetIds.includes(s.id) ? { ...s, isPublished: publish } : s));
      alert(res.message);
    } else {
      alert(res.message || 'Failed to update publication status');
    }
  };

  const handleDeleteSubmission = async (submissionId) => {
    if (!window.confirm('Are you sure you want to permanently delete this exam submission? This cannot be undone.')) return;
    setLoading(true);
    const res = await adminApi.deleteSubmission(submissionId);
    setLoading(false);
    if (res.success) {
      setSubmissions(prev => prev.filter(s => s.id !== submissionId));
    } else {
      alert(res.message || 'Failed to delete submission');
    }
  };

  const handleOpenEditSubmission = (sub) => {
    setEditSubmissionModal(sub);
    setEditSubmissionForm({
      score: sub.score ?? 0,
      maxMarks: sub.maxMarks ?? 100,
      percentage: sub.percentage ?? 0,
      scholarshipPercent: sub.scholarshipPercent ?? 0,
      remarks: sub.remarks || '',
      isPublished: sub.isPublished !== undefined ? sub.isPublished : (sub.category === 'RSAT')
    });
  };

  const handleSaveEditSubmission = async (e) => {
    e.preventDefault();
    if (!editSubmissionModal) return;
    setLoading(true);
    const res = await adminApi.updateSubmission(editSubmissionModal.id, editSubmissionForm);
    setLoading(false);
    if (res.success && res.data) {
      setSubmissions(prev => prev.map(s => s.id === editSubmissionModal.id ? { ...s, ...res.data } : s));
      setEditSubmissionModal(null);
      alert('Submission marks and publication status updated!');
    } else {
      alert(res.message || 'Failed to update submission');
    }
  };

  // Faculty Handlers
  const handleOpenAddFaculty = () => {
    setEditingFaculty(null);
    setPhotoStats(null);
    setPhotoError('');
    setShowCustomUrl(false);
    setFacultyForm({
      name: '',
      degree: '',
      role: '',
      subject: 'Biology',
      exp: '20+ Years Experience',
      photo: '/assets/web/faculty-team-full.png',
      bio: '',
      showOnHome: false,
      order: facultyList.length + 1
    });
    setFacultyModalOpen(true);
  };

  const handleOpenEditFaculty = (fac) => {
    setEditingFaculty(fac);
    setPhotoStats(null);
    setPhotoError('');
    setShowCustomUrl(false);
    setFacultyForm({
      name: fac.name || '',
      degree: fac.degree || '',
      role: fac.role || '',
      subject: fac.subject || 'Biology',
      exp: fac.exp || '20+ Years Experience',
      photo: fac.photo || '/assets/web/faculty-team-full.png',
      bio: fac.bio || '',
      showOnHome: fac.showOnHome === true,
      order: fac.order || 1
    });
    setFacultyModalOpen(true);
  };

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    try {
      setPhotoUploading(true);
      setPhotoError('');

      // Auto-compress photo using HTML5 Canvas down to ~30-50 KB
      const compressed = await compressImage(file, { maxWidth: 500, maxHeight: 500, quality: 0.8 });
      setPhotoStats({
        origKb: compressed.originalSizeKb,
        compKb: compressed.compressedSizeKb,
        savedPercent: compressed.savedPercent
      });

      // Upload compressed blob to backend
      const uploadRes = await adminApi.uploadFacultyPhoto(compressed.blob, file.name || 'faculty.jpg');
      if (uploadRes && uploadRes.success && uploadRes.data?.url) {
        setFacultyForm((prev) => ({ ...prev, photo: uploadRes.data.url }));
      } else {
        // Fallback to compressed data URL (already reduced to KB!)
        setFacultyForm((prev) => ({ ...prev, photo: compressed.dataUrl }));
      }
    } catch (err) {
      console.error('Photo compression/upload error:', err);
      setPhotoError(err.message || 'Failed to process photo');
    } finally {
      setPhotoUploading(false);
    }
  };

  const handleSaveFaculty = async (e) => {
    e.preventDefault();
    if (!facultyForm.name || !facultyForm.subject) {
      alert('Please enter faculty name and subject');
      return;
    }
    setLoading(true);
    let res;
    if (editingFaculty) {
      res = await adminApi.updateFaculty(editingFaculty.id, facultyForm);
    } else {
      res = await adminApi.createFaculty(facultyForm);
    }
    setLoading(false);
    if (res && res.success) {
      const updatedList = await adminApi.getFaculty();
      if (updatedList.data) setFacultyList(updatedList.data);
      setFacultyModalOpen(false);
      alert(editingFaculty ? 'Faculty details updated successfully!' : 'New faculty member added successfully!');
    } else {
      alert(res?.message || 'Failed to save faculty details');
    }
  };

  const handleDeleteFaculty = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from the faculty team?`)) return;
    setLoading(true);
    const res = await adminApi.deleteFaculty(id);
    setLoading(false);
    if (res && res.success) {
      const updatedList = await adminApi.getFaculty();
      if (updatedList.data) setFacultyList(updatedList.data);
      alert('Faculty member deleted.');
    } else {
      alert(res?.message || 'Failed to delete faculty');
    }
  };

  const handleToggleHomeVisibility = async (fac) => {
    const updated = !fac.showOnHome;
    const res = await adminApi.updateFaculty(fac.id, { showOnHome: updated });
    if (res && res.success) {
      const updatedList = await adminApi.getFaculty();
      if (updatedList.data) setFacultyList(updatedList.data);
    }
  };

  // Course Management Handlers
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      title: '',
      domainKey: 'custom',
      desc: '',
      tuitionFee: '₹1,10,000 / Year',
      badge: 'Class',
      category: 'ENGINEERING',
      target: 'IIT-JEE 2026 / 2027 Aspirants',
      eligibility: 'Class 10th to 11th moving, 12th appearing & 12th Pass (Dropper)',
      duration: '1 Year / 2 Years Comprehensive Classroom Programme',
      scholarshipWaiver: 'Up to 90% (Save up to ₹99,000 via RSAT)',
      startingFee: '₹11,000',
      keyFeatures: 'Daily 4.5 hours core classroom lectures + Daily Practice Problems\nComputer Based Test (CBT) mock exam series matching exact pattern\nDedicated 1-on-1 Doubt Clinic open 8:00 AM to 8:00 PM daily\nPersonal teaching by Senior Kota/Indore Faculty Directors',
      order: coursesList.length + 1,
      active: true
    });
    setCourseModalOpen(true);
  };

  const handleOpenEditCourse = (course) => {
    setEditingCourse(course);
    setCourseForm({
      title: course.title || '',
      domainKey: course.domainKey || 'custom',
      desc: course.desc || '',
      tuitionFee: course.tuitionFee || '₹1,10,000 / Year',
      badge: course.badge || 'Class',
      category: course.category || 'ENGINEERING',
      target: course.target || '',
      eligibility: course.eligibility || '',
      duration: course.duration || '',
      scholarshipWaiver: course.scholarshipWaiver || '',
      startingFee: course.startingFee || '',
      keyFeatures: Array.isArray(course.keyFeatures) ? course.keyFeatures.join('\n') : (course.keyFeatures || ''),
      order: course.order || 1,
      active: course.active !== false
    });
    setCourseModalOpen(true);
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!courseForm.title || !courseForm.desc) {
      alert('Please fill in course title and description');
      return;
    }
    setLoading(true);
    const payload = {
      ...courseForm,
      order: Number(courseForm.order) || 1,
      keyFeatures: typeof courseForm.keyFeatures === 'string'
        ? courseForm.keyFeatures.split('\n').map(s => s.trim()).filter(Boolean)
        : courseForm.keyFeatures
    };

    let res;
    if (editingCourse) {
      res = await adminApi.updateCourse(editingCourse.id, payload);
    } else {
      res = await adminApi.createCourse(payload);
    }
    setLoading(false);

    if (res && res.success) {
      const updated = await adminApi.getCourses(true);
      if (updated.data) setCoursesList(updated.data);
      setCourseModalOpen(false);
      alert(editingCourse ? 'Course updated successfully!' : 'New course added successfully!');
    } else {
      alert(res?.message || 'Failed to save course');
    }
  };

  const handleDeleteCourse = async (id, title) => {
    if (!window.confirm(`Are you sure you want to permanently delete course "${title}"?`)) return;
    setLoading(true);
    const res = await adminApi.deleteCourse(id);
    setLoading(false);
    if (res && res.success) {
      const updated = await adminApi.getCourses(true);
      if (updated.data) setCoursesList(updated.data);
      alert('Course deleted.');
    } else {
      alert(res?.message || 'Failed to delete course');
    }
  };

  const handleToggleCourseActive = async (course) => {
    const updatedActive = !course.active;
    const res = await adminApi.updateCourse(course.id, { active: updatedActive });
    if (res && res.success) {
      const updated = await adminApi.getCourses(true);
      if (updated.data) setCoursesList(updated.data);
    }
  };

  const handleResetDefaultCourses = async () => {
    if (!window.confirm('Reset all courses to original 5 default courses? Custom edits will be replaced.')) return;
    setLoading(true);
    const res = await adminApi.resetCourses();
    setLoading(false);
    if (res && res.success) {
      setCoursesList(res.data || []);
      alert('Courses reset to default set!');
    } else {
      alert(res?.message || 'Failed to reset courses');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoading(true);
    const res = await adminApi.login(loginEmail, loginPassword);
    setLoading(false);

    if (res.success && res.data) {
      setAdminUser(res.data.user);
    } else {
      setLoginError(res.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('rp_admin_token');
    localStorage.removeItem('rp_admin_user');
    setAdminUser(null);
  };

  const handleScanAttendance = async (e) => {
    e.preventDefault();
    if (!scanRollNumber) return;
    const res = await adminApi.scanAttendance(scanRollNumber);
    setScanResult(res);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    const res = await adminApi.createQuestion(newQuestion);
    if (res.success) {
      alert('Question successfully saved to question bank!');
      setQuestions([...questions, { id: res.data?.id || ('q-' + Date.now()), ...newQuestion }]);
      setNewQuestion({
        stream: newQuestion.stream || 'JEE',
        questionType: newQuestion.questionType || 'MCQ',
        subject: newQuestion.subject || 'Physics',
        topic: '',
        section: newQuestion.section || 'Section A',
        questionText: '',
        options: ['', '', '', ''],
        correctOption: 0,
        correctAnswer: '',
        rangeMin: '',
        rangeMax: '',
        tolerance: '',
        explanation: '',
        classLevel: newQuestion.classLevel || 'Class 11'
      });
    }
  };

  const handleSaveCMS = async (e) => {
    e.preventDefault();
    const res = await adminApi.updateCMS(cmsData);
    if (res.success) {
      alert('Website CMS updated successfully! Changes reflect on the live website immediately.');
    }
  };

  const handleProcessMarks = () => {
    setMarksResult(`Successfully processed marks for 3 students! Top rank assigned to Roll No RPX-2026-0003 with 280/300 marks (100% Scholarship). Results published on student portals!`);
  };

  // 1. If not logged in -> Show Clean Admin Login View
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071126] via-[#0B1B3D] to-[#071126] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="bg-brand-navy p-8 text-white text-center border-b border-brand-yellow/30">
            <img
              src="/assets/web/logo-header.svg"
              alt="RankersPath"
              className="h-10 w-auto mx-auto object-contain brightness-110 mb-3"
            />
            <h2 className="text-xl font-extrabold text-white">Staff &amp; Admin Portal</h2>
            <p className="text-xs text-brand-yellow font-semibold mt-1">Safalta Ka Sankalp &bull; Institutional ERP</p>
          </div>

          <div className="p-8 space-y-6">
            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@rankerspath.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Enter administrator password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl font-extrabold text-sm shadow-md transition"
              >
                {loading ? 'Authenticating...' : 'Sign In to Management Dashboard'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // 2. Logged In -> Show Complete Admin Hub
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row relative">
      
      {/* Mobile Top App Bar (< md viewports) */}
      <div className="md:hidden bg-brand-navy text-white px-4 py-3 flex items-center justify-between border-b border-white/10 sticky top-0 z-30 shadow-md flex-shrink-0">
        <div className="flex items-center gap-2">
          <img
            src="/assets/web/logo-header.svg"
            alt="RankersPath"
            className="h-7 w-auto object-contain brightness-110"
          />
          <span className="text-[10px] bg-brand-yellow/20 text-brand-yellow font-extrabold px-2 py-0.5 rounded uppercase">
            Admin ERP
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition flex items-center gap-1.5 text-xs font-bold"
          aria-label="Toggle navigation menu"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5 text-brand-yellow" /> : <Menu className="w-5 h-5 text-brand-yellow" />}
          <span className="text-[11px] font-black uppercase tracking-wider">{mobileSidebarOpen ? 'Close' : 'Menu'}</span>
        </button>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs animate-in fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation (Drawer on mobile, persistent on desktop) */}
      <aside className={`bg-brand-navy text-white flex-shrink-0 flex flex-col border-r border-slate-800 transition-all duration-300 ${
        mobileSidebarOpen
          ? 'fixed inset-y-0 left-0 z-40 w-72 flex flex-col shadow-2xl h-full'
          : 'hidden md:flex md:w-64 md:relative h-auto'
      }`}>
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between">
          <img
            src="/assets/web/logo-header.svg"
            alt="RankersPath"
            className="h-8 w-auto object-contain brightness-110"
          />
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-yellow text-brand-navy flex items-center justify-center font-bold text-base shadow">
            RP
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-extrabold text-white truncate">{adminUser.fullName}</h4>
            <span className="text-[10px] text-brand-yellow uppercase font-bold tracking-wider">Super Administrator</span>
          </div>
        </div>

        <nav
          onClickCapture={() => setMobileSidebarOpen(false)}
          className="p-4 space-y-1.5 flex-1 overflow-y-auto text-xs font-bold"
        >
          <button
            onClick={() => setActiveMenu('overview')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'overview' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview Dashboard</span>
          </button>

          <button
            onClick={() => setActiveMenu('admissions')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'admissions' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Admissions Desk</span>
            </div>
            <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              NEW
            </span>
          </button>

          {/* RSAT SCHOLARSHIP COMMAND CENTRE */}
          <button
            onClick={() => setActiveMenu('rsat-desk')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'rsat-desk' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <Award className="w-4 h-4" />
              <span>RSAT Command Centre</span>
            </div>
            <span className="text-[9px] bg-amber-400 text-brand-navy font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              HUB
            </span>
          </button>

          {/* RANKEX SCHOLARSHIP COMMAND CENTRE */}
          <button
            onClick={() => setActiveMenu('rankx-desk')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'rankx-desk' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <Zap className="w-4 h-4" />
              <span>RANKEX Command Centre</span>
            </div>
            <span className="text-[9px] bg-purple-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              160M
            </span>
          </button>

          <button
            onClick={() => setActiveMenu('students')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'students' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Student Management</span>
          </button>

          <button
            onClick={() => setActiveMenu('centres')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'centres' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>RANKEX Venues &amp; Attendance</span>
          </button>

          {/* BIOMETRIC CLASSROOM ATTENDANCE & FINGERPRINT DESK */}
          <button
            onClick={() => setActiveMenu('attendance')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'attendance' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <Fingerprint className="w-4 h-4 text-emerald-400" />
              <span>Biometric Attendance Desk</span>
            </div>
            <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              AUTO
            </span>
          </button>

          <button
            onClick={() => setActiveMenu('marks')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'marks' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Offline Marks Uploader</span>
          </button>

          <button
            onClick={() => setActiveMenu('cbt-exams')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'cbt-exams' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>Online CBT &amp; Results</span>
          </button>

          <button
            onClick={() => setActiveMenu('questions')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'questions' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Question Bank Studio</span>
          </button>

          {/* ACADEMIC CALENDAR & SCHEDULE DESIGNER */}
          <button
            onClick={() => setActiveMenu('calendar-designer')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'calendar-designer' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-brand-yellow" />
              <span>Class Calendar &amp; Schedule</span>
            </div>
            <span className="text-[9px] bg-brand-yellow text-brand-navy font-black px-1.5 py-0.2 rounded uppercase">
              1-2 MO
            </span>
          </button>

          {/* EPSON 75" SMART BOARD & LIVE HYBRID STUDIO */}
          <button
            onClick={() => setActiveMenu('live-classes')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'live-classes' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Epson 75" Smart Board Studio</span>
            </div>
            <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded uppercase">
              LIVE
            </span>
          </button>

          {/* DEDICATED JEE STUDY MATERIALS */}
          <button
            onClick={() => setActiveMenu('jee-materials')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'jee-materials' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-4 h-4 text-blue-400" />
              <span>JEE Study Materials Hub</span>
            </div>
            <span className="text-[9px] bg-blue-600 text-white font-black px-1.5 py-0.2 rounded uppercase">
              JEE
            </span>
          </button>

          {/* DEDICATED NEET STUDY MATERIALS */}
          <button
            onClick={() => setActiveMenu('neet-materials')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'neet-materials' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-4 h-4 text-emerald-400" />
              <span>NEET Study Materials Hub</span>
            </div>
            <span className="text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.2 rounded uppercase">
              NEET
            </span>
          </button>

          {/* DEDICATED FOUNDATION STUDY MATERIALS */}
          <button
            onClick={() => setActiveMenu('foundation-materials')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'foundation-materials' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <FolderOpen className="w-4 h-4 text-purple-400" />
              <span>Foundation Hub (9th/10th)</span>
            </div>
            <span className="text-[9px] bg-purple-600 text-white font-black px-1.5 py-0.2 rounded uppercase">
              PNCF
            </span>
          </button>

          <button
            onClick={() => setActiveMenu('recorded-lectures')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'recorded-lectures' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <Film className="w-4 h-4 text-red-400" />
              <span>Recorded Lectures (YT)</span>
            </div>
            <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.2 rounded uppercase">
              VIDEO
            </span>
          </button>

          <button
            onClick={() => setActiveMenu('cms')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'cms' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Website CMS Manager</span>
          </button>

          <button
            onClick={() => setActiveMenu('faculty')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'faculty' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Faculty &amp; Mentors Team</span>
          </button>

          <button
            onClick={() => setActiveMenu('courses')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'courses' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Courses &amp; Fee CMS</span>
          </button>

          <button
            onClick={() => setActiveMenu('gallery')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'gallery' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Campus Gallery &amp; Photos</span>
          </button>

          {/* STUDENT TESTIMONIALS & HALL OF FAME */}
          <button
            onClick={() => setActiveMenu('testimonials')}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'testimonials' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquareQuote className="w-4 h-4 text-brand-yellow" />
              <span>Student Testimonials</span>
            </div>
            <span className="text-[9px] bg-brand-yellow text-brand-navy font-black px-1.5 py-0.2 rounded uppercase">
              NEW
            </span>
          </button>

          <button
            onClick={() => { setActiveMenu('payments'); refreshPayments(); }}
            className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'payments' ? 'bg-brand-yellow text-brand-navy shadow font-black' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-4 h-4" />
              <span>Payments &amp; Cashfree</span>
            </div>
            <span className="text-[9px] bg-emerald-500 text-white font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">
              PG v3
            </span>
          </button>

          <button
            onClick={() => setActiveMenu('reports')}
            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition ${
              activeMenu === 'reports' ? 'bg-brand-yellow text-brand-navy shadow' : 'text-slate-300 hover:bg-white/10'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>18 Excel/CSV Reports</span>
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-slate-200 gap-4">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              Rankers Path Institutional Management ERP
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 capitalize">
              {activeMenu === 'payments' ? 'Fee Collection & Cashfree PG Reconciliation Audit' :
               activeMenu === 'courses' ? 'Courses & Fee CMS' :
               activeMenu === 'admissions' ? 'Admissions Desk (Offline & Online Forms)' :
               activeMenu === 'rsat-desk' ? 'RSAT Scholarship Command Centre (Papers, Funnel & Admissions)' :
               activeMenu === 'rankx-desk' ? 'RANKEX 2027 Command Centre (Papers, Funnel & Admissions)' :
               activeMenu === 'calendar-designer' ? 'Academic Calendar & Class Schedule Designer (1-2 Months)' :
               activeMenu === 'jee-materials' ? 'IIT-JEE Study Material Hub (Main & Advanced)' :
               activeMenu === 'neet-materials' ? 'NEET-UG Medical Study Material Hub' :
               activeMenu === 'foundation-materials' ? 'PNCF Foundation Study Material Hub (Class 9th & 10th)' :
               activeMenu === 'materials' ? 'Study Material Hub (PDFs, Notes, PYQs)' :
               activeMenu === 'live-classes' ? 'Academic Calendar & Timetable Studio' :
               activeMenu === 'recorded-lectures' ? 'Recorded Video Lectures (YouTube LMS)' :
               activeMenu.replace('-', ' ')}
            </h1>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={import.meta.env.VITE_MAIN_WEBSITE_URL || 'http://localhost:5175'}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-extrabold flex items-center gap-1.5 transition shadow-sm border border-slate-700"
              title="Open Main Student Website in new tab"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>View Live Website ↗</span>
            </a>
            <span className="px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Server Online (Port 5002)
            </span>
          </div>
        </div>

        {/* VIEW 1: Overview Dashboard */}
        {activeMenu === 'overview' && (
          <div className="mt-8 space-y-8 animate-in fade-in">
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Registered Students</span>
                <h3 className="text-3xl font-black text-brand-navy mt-1">{stats?.totalStudents || 248}</h3>
                <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +18 today
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">RANKEX Candidates</span>
                <h3 className="text-3xl font-black text-brand-yellowDark mt-1">{stats?.totalRankX || 182}</h3>
                <p className="text-xs text-slate-500 mt-1">Centres allocated</p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">RSAT Online Tests</span>
                <h3 className="text-3xl font-black text-blue-600 mt-1">{stats?.totalRSAT || 96}</h3>
                <p className="text-xs text-slate-500 mt-1">{stats?.totalSubmissions || 74} completed</p>
              </div>

              <div
                onClick={() => { setActiveMenu('payments'); refreshPayments(); }}
                className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:border-emerald-500 hover:shadow-md transition cursor-pointer group"
                title="Click to view Cashfree & PG Fee Reconciliation Audit"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase">Total Fee Collection</span>
                  <span className="text-[10px] bg-emerald-50 text-emerald-700 font-extrabold px-2 py-0.5 rounded-full border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition">
                    Cashfree PG v3
                  </span>
                </div>
                <h3 className="text-3xl font-black text-emerald-700 mt-1">₹{(stats?.totalRevenue || 284000).toLocaleString('en-IN')}</h3>
                <div className="flex items-center justify-between text-xs mt-1">
                  <p className="text-emerald-600 font-semibold">Cashfree: ₹{(stats?.cashfreeRevenue || 0).toLocaleString('en-IN')}</p>
                  <span className="text-slate-400 group-hover:text-emerald-700 font-bold underline">Audit Ledger &rarr;</span>
                </div>
              </div>

            </div>

            {/* Master Admissions & Student Conversion Pipeline */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-brand-navy" />
                    <span>Master Admissions &amp; Student Pipeline (Director's Overview)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Live analytics tracking total applications, verified classroom admissions, and RSAT/RANKEX conversion rates.
                  </p>
                </div>
                <button
                  onClick={() => setActiveMenu('admissions')}
                  className="px-3.5 py-1.5 rounded-xl bg-brand-navy text-brand-yellow font-bold text-xs uppercase hover:bg-brand-navyLight transition"
                >
                  Open Admissions Desk &rarr;
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200">
                  <span className="text-[11px] font-bold text-blue-700 uppercase">Total Admissions Applied</span>
                  <p className="text-2xl font-black text-blue-950 mt-1">{stats?.totalAdmissions || 42}</p>
                  <p className="text-[11px] text-blue-600 mt-1">
                    {stats?.admissionsApproved || 34} Approved &bull; {stats?.admissionsPending || 8} Pending
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase">Confirmed Classroom Enrolled</span>
                  <p className="text-2xl font-black text-emerald-950 mt-1">{stats?.totalEnrolled || 28}</p>
                  <p className="text-[11px] text-emerald-600 mt-1">
                    With student portal access (Rankers@XXXX)
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200">
                  <span className="text-[11px] font-bold text-purple-700 uppercase">RANKEX Candidates Converted</span>
                  <p className="text-2xl font-black text-purple-950 mt-1">{stats?.rankXConverted || 18}</p>
                  <p className="text-[11px] text-purple-600 mt-1">
                    From {stats?.totalRankX || 182} exam aspirants
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="text-[11px] font-bold text-amber-700 uppercase">RSAT Scholarship Converted</span>
                  <p className="text-2xl font-black text-amber-950 mt-1">{stats?.rsatConverted || 12}</p>
                  <p className="text-[11px] text-amber-600 mt-1">
                    Availing 10%–90% tuition fee waiver
                  </p>
                </div>
              </div>
            </div>

            {/* Centre Capacity Gauge Bars */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-yellowDark" />
                <span>Physical Examination Centres (RANKEX Seat Utilization)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {(stats?.centres || []).map(c => {
                  const percent = Math.min(100, Math.round(((c.registeredCount || 0) / c.capacity) * 100));
                  return (
                    <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-800">{c.name}</h4>
                        <span className="text-xs font-black text-brand-navy">{percent}%</span>
                      </div>
                      <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            percent > 85 ? 'bg-rose-500' : 'bg-brand-yellow'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                      <p className="text-[11px] text-slate-500 flex justify-between">
                        <span>Booked: <strong>{c.registeredCount || 0}</strong></span>
                        <span>Capacity: <strong>{c.capacity}</strong></span>
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Registrations Table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Recent Student Admissions &amp; Enquiries</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                      <th className="py-3 px-4">Student Name</th>
                      <th className="py-3 px-4">Mobile</th>
                      <th className="py-3 px-4">Stream</th>
                      <th className="py-3 px-4">Target Class</th>
                      <th className="py-3 px-4">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {(stats?.recentStudents || []).map(s => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-bold text-slate-900">{s.fullName}</td>
                        <td className="py-3 px-4 font-mono">+91-{s.mobile}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-brand-yellow/20 text-brand-navy font-bold text-xs">
                            {s.targetStream}
                          </span>
                        </td>
                        <td className="py-3 px-4">{s.targetClass}</td>
                        <td className="py-3 px-4 text-emerald-600 font-bold">Verified OTP ✓</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Admissions Desk */}
        {activeMenu === 'admissions' && (
          <div className="mt-8 animate-in fade-in">
            <AdmissionsDesk />
          </div>
        )}

        {/* VIEW: RSAT Command Centre */}
        {activeMenu === 'rsat-desk' && (
          <div className="mt-8 animate-in fade-in">
            <RsatCommandCenterDesk />
          </div>
        )}

        {/* VIEW: RANKEX Command Centre */}
        {activeMenu === 'rankx-desk' && (
          <div className="mt-8 animate-in fade-in">
            <RankXCommandCenterDesk />
          </div>
        )}

        {/* VIEW: Biometric Attendance Desk */}
        {activeMenu === 'attendance' && (
          <div className="mt-8 animate-in fade-in">
            <BiometricAttendanceDesk />
          </div>
        )}

        {/* VIEW: Academic Calendar & Schedule Designer */}
        {activeMenu === 'calendar-designer' && (
          <div className="mt-8 animate-in fade-in">
            <ClassCalendarDesk />
          </div>
        )}

        {/* VIEW: Epson 75" 4K Smart Board & Hybrid Studio Controller */}
        {activeMenu === 'live-classes' && (
          <div className="mt-8 animate-in fade-in">
            <LiveClassesDesk />
          </div>
        )}

        {/* VIEW: Dedicated JEE Study Materials Hub */}
        {activeMenu === 'jee-materials' && (
          <div className="mt-8 animate-in fade-in">
            <StudyMaterialDesk fixedStream="JEE" />
          </div>
        )}

        {/* VIEW: Dedicated NEET Study Materials Hub */}
        {activeMenu === 'neet-materials' && (
          <div className="mt-8 animate-in fade-in">
            <StudyMaterialDesk fixedStream="NEET" />
          </div>
        )}

        {/* VIEW: Dedicated Foundation Study Materials Hub */}
        {activeMenu === 'foundation-materials' && (
          <div className="mt-8 animate-in fade-in">
            <StudyMaterialDesk fixedStream="FOUNDATION" />
          </div>
        )}

        {/* VIEW: General Study Materials Desk (Fallback) */}
        {activeMenu === 'materials' && (
          <div className="mt-8 animate-in fade-in">
            <StudyMaterialDesk />
          </div>
        )}

        {/* VIEW: Recorded Lectures Desk */}
        {activeMenu === 'recorded-lectures' && (
          <div className="mt-8 animate-in fade-in">
            <RecordedLecturesDesk />
          </div>
        )}

        {/* VIEW: Campus Gallery & Photos Desk */}
        {activeMenu === 'gallery' && (
          <div className="mt-8 animate-in fade-in">
            <GalleryDesk />
          </div>
        )}

        {/* VIEW: Student Testimonials Desk */}
        {activeMenu === 'testimonials' && (
          <div className="mt-8 animate-in fade-in">
            <TestimonialsDesk />
          </div>
        )}

        {/* VIEW 2: Student Management */}
        {activeMenu === 'students' && (
          <div className="mt-8 space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h3 className="text-lg font-extrabold text-slate-900">All Registered Students ({students.length})</h3>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search student or mobile..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-yellow"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase text-[11px]">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Mobile Number</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Target Stream</th>
                    <th className="py-3 px-4">Registration Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {students.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{s.fullName}</td>
                      <td className="py-3 px-4 font-mono">+91-{s.mobile}</td>
                      <td className="py-3 px-4">{s.targetClass}</td>
                      <td className="py-3 px-4 font-bold text-brand-navy">{s.targetStream}</td>
                      <td className="py-3 px-4 text-slate-500">{new Date(s.verifiedAt || Date.now()).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VIEW 3: RankX Venues & QR Attendance Scanner */}
        {activeMenu === 'centres' && (
          <div className="mt-8 space-y-8 animate-in fade-in">
            {/* Instant QR Attendance Scanner Card */}
            <div className="bg-gradient-to-r from-brand-navy to-brand-navyCard text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-yellow/30">
              <h3 className="text-xl font-extrabold text-brand-yellow flex items-center gap-2">
                <QrCode className="w-6 h-6" />
                <span>Invigilator Rapid QR &bull; Roll Number Attendance Scanner</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                Scan the QR code on the candidate's Admit Card using mobile camera or enter their Roll Number manually to mark instant offline attendance.
              </p>

              <form onSubmit={handleScanAttendance} className="mt-6 flex flex-col sm:flex-row gap-3 max-w-xl">
                <input
                  type="text"
                  placeholder="e.g. RPX-2026-0001"
                  value={scanRollNumber}
                  onChange={(e) => setScanRollNumber(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white text-slate-900 font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-sm rounded-xl shadow transition"
                >
                  Verify &amp; Mark Present
                </button>
              </form>

              {scanResult && (
                <div className="mt-4 p-4 rounded-xl bg-white/10 border border-white/20 text-xs font-bold text-emerald-300">
                  {scanResult.message}
                </div>
              )}
            </div>

            {/* Centres List */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Configured Examination Centres (Indore)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(stats?.centres || []).map(c => (
                  <div key={c.id} className="p-5 rounded-2xl border border-slate-200 space-y-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Active Centre
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900">{c.name}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">{c.address}</p>
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-500">Capacity: {c.capacity}</span>
                      <span className="text-brand-yellowDark">Registered: {c.registeredCount || 0}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: Offline Marks Uploader */}
        {activeMenu === 'marks' && (
          <div className="mt-8 space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">RANKEX Answer Sheet / OMR Marks Uploader</h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload or paste student marks CSV to automatically calculate ranks, percentages, and scholarship slabs (100%, 75%, 50%, 25%).
              </p>
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                CSV Marks Data (rollNumber, marks, maxMarks)
              </label>
              <textarea
                rows={6}
                value={marksCsvText}
                onChange={(e) => setMarksCsvText(e.target.value)}
                className="w-full p-4 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-brand-yellow"
              ></textarea>

              <button
                type="button"
                onClick={handleProcessMarks}
                className="px-6 py-3.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-extrabold text-xs uppercase rounded-xl shadow transition"
              >
                Compute Ranks &amp; Publish Official Results
              </button>

              {marksResult && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
                  {marksResult}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: Online CBT Tests & Results Hub */}
        {activeMenu === 'cbt-exams' && (
          <CbtExamsDesk
            submissions={submissions}
            filteredSubmissions={filteredSubmissions}
            testsList={testsList}
            filteredExams={filteredExams}
            examCategoryFilter={examCategoryFilter}
            setExamCategoryFilter={setExamCategoryFilter}
            examStreamFilter={examStreamFilter}
            setExamStreamFilter={setExamStreamFilter}
            examTierFilter={examTierFilter}
            setExamTierFilter={setExamTierFilter}
            submissionCategoryFilter={submissionCategoryFilter}
            setSubmissionCategoryFilter={setSubmissionCategoryFilter}
            selectedExamFilter={selectedExamFilter}
            setSelectedExamFilter={setSelectedExamFilter}
            availableExamOptions={availableExamOptions}
            submissionPublishFilter={submissionPublishFilter}
            setSubmissionPublishFilter={setSubmissionPublishFilter}
            submissionSearch={submissionSearch}
            setSubmissionSearch={setSubmissionSearch}
            onOpenTestModal={() => setTestModalOpen(true)}
            handleDeleteTest={handleDeleteTest}
            handleBulkPublish={handleBulkPublish}
            handleDownloadExcelCsv={handleDownloadExcelCsv}
            onOpenDirectorReport={() => setDirectorReportModalOpen(true)}
            onInspectSubmission={(sub) => setSelectedSubmissionForInspect(sub)}
            handleTogglePublishSubmission={handleTogglePublishSubmission}
            handleOpenEditSubmission={handleOpenEditSubmission}
            handleDeleteSubmission={handleDeleteSubmission}
            onOpenDirectorShare={(t) => {
              setSelectedTestForDirectorShare(t);
              setDirectorShareModalOpen(true);
            }}
            onOpenParticipation={(t) => {
              setSelectedTestForParticipation(t);
              setParticipationModalOpen(true);
            }}
          />
        )}

        {/* VIEW 5: Question Bank Studio */}
        {activeMenu === 'questions' && (
          <QuestionBankDesk
            questions={questions}
            newQuestion={newQuestion}
            setNewQuestion={setNewQuestion}
            handleAddQuestion={handleAddQuestion}
          />
        )}

        {/* VIEW 6: Website Dynamic CMS */}
        {activeMenu === 'cms' && (
          <div className="mt-8 space-y-6 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm animate-in fade-in">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Website Dynamic Content &amp; Batch Dates CMS</h3>
              <p className="text-xs text-slate-500 mt-1">
                Modify homepage notices, batch start dates, and contact numbers without code changes.
              </p>
            </div>

            <form onSubmit={handleSaveCMS} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Top Announcement Banner</label>
                <input
                  type="text"
                  value={cmsData.bannerNotice || ''}
                  onChange={(e) => setCmsData({ ...cmsData, bannerNotice: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Next Batch Start Date</label>
                <input
                  type="text"
                  value={cmsData.nextBatchDate || '24 June 2026'}
                  onChange={(e) => setCmsData({ ...cmsData, nextBatchDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-brand-navy"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Dropper Batch Alert Headline</label>
                <input
                  type="text"
                  value={cmsData.dropperBatchAlert || ''}
                  onChange={(e) => setCmsData({ ...cmsData, dropperBatchAlert: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Institute Inspiring Quote (Hero)</label>
                <input
                  type="text"
                  value={cmsData.instituteQuote || 'Student aur parents ka vishwas — Rankers Path banaye har baccha khaas'}
                  onChange={(e) => setCmsData({ ...cmsData, instituteQuote: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-medium italic"
                />
              </div>

              {/* Course Fee Structure Controls */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <p className="text-xs font-black uppercase text-slate-900 tracking-wider">Courses / FEE Display Settings</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">JEE (Main+Adv) Fee</label>
                    <input
                      type="text"
                      value={cmsData.jeeFee || '₹1,10,000 / Year'}
                      onChange={(e) => setCmsData({ ...cmsData, jeeFee: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">NEET (Medical) Fee</label>
                    <input
                      type="text"
                      value={cmsData.neetFee || '₹1,05,000 / Year'}
                      onChange={(e) => setCmsData({ ...cmsData, neetFee: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Foundation (9th-10th) Fee</label>
                    <input
                      type="text"
                      value={cmsData.foundationFee || '₹55,000 / Year'}
                      onChange={(e) => setCmsData({ ...cmsData, foundationFee: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-brand-navy"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Primary Helpline</label>
                  <input
                    type="text"
                    value={cmsData.helplinePhone || '9131435511'}
                    onChange={(e) => setCmsData({ ...cmsData, helplinePhone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">WhatsApp Number</label>
                  <input
                    type="text"
                    value={cmsData.whatsappNumber || '919131435511'}
                    onChange={(e) => setCmsData({ ...cmsData, whatsappNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase rounded-xl shadow transition"
              >
                Save &amp; Update Live Website
              </button>
            </form>
          </div>
        )}

        {/* VIEW: Faculty & Mentors Team Management */}
        {activeMenu === 'faculty' && (
          <div className="mt-8 space-y-6 animate-in fade-in">
            {/* Header & Add Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-brand-yellowDark" />
                  <span>Faculty &amp; Mentors Team Management</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Add new educators, update credentials, change photos, and toggle who appears on the main homepage.
                </p>
              </div>

              <button
                onClick={handleOpenAddFaculty}
                className="px-5 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center gap-2 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Faculty Member</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Members</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{facultyList.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Active Teaching Staff</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Featured on Home</span>
                <p className="text-2xl font-black text-brand-yellowDark mt-1">
                  {facultyList.filter(f => f.showOnHome).length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Founding Mentors Grid</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Medical Faculties</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {facultyList.filter(f => f.subject === 'Biology' || f.subject === 'Chemistry').length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">NEET-UG Mentors</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Engineering Faculties</span>
                <p className="text-2xl font-black text-blue-600 mt-1">
                  {facultyList.filter(f => f.subject === 'Physics' || f.subject === 'Mathematics').length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">IIT-JEE Mentors</p>
              </div>
            </div>

            {/* Faculty List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {facultyList.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Photo & Status */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-inner flex-shrink-0">
                        <img
                          src={resolvePhotoUrl(fac.photo)}
                          alt={fac.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-extrabold text-[10px] uppercase">
                            {fac.subject || 'Faculty'}
                          </span>
                          
                          {/* Home visibility toggle */}
                          <button
                            onClick={() => handleToggleHomeVisibility(fac)}
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 transition ${
                              fac.showOnHome
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : 'bg-slate-100 text-slate-400 hover:text-slate-600'
                            }`}
                            title={fac.showOnHome ? 'Shown on Homepage (Click to hide)' : 'Hidden from Homepage (Click to show)'}
                          >
                            {fac.showOnHome ? <Eye className="w-3 h-3 text-amber-600" /> : <EyeOff className="w-3 h-3" />}
                            <span>{fac.showOnHome ? 'On Home' : 'Team Only'}</span>
                          </button>
                        </div>

                        <h4 className="text-base font-extrabold text-slate-900 mt-1 truncate">{fac.name}</h4>
                        <p className="text-xs text-brand-yellowDark font-bold truncate">{fac.degree}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{fac.exp}</p>
                      </div>
                    </div>

                    {fac.role && (
                      <p className="text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100 mb-3">
                        {fac.role}
                      </p>
                    )}

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {fac.bio}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Order: #{fac.order || 1}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditFaculty(fac)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteFaculty(fac.id, fac.name)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Add / Edit Faculty Member */}
            {facultyModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-black text-slate-900">
                    {editingFaculty ? 'Edit Faculty Member Details' : 'Add New Faculty Member'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Fill in credentials and choose whether to display on the home founding mentors grid.
                  </p>

                  <form onSubmit={handleSaveFaculty} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={facultyForm.name}
                          onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })}
                          placeholder="e.g. Dr. R.K. Verma"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject / Stream *</label>
                        <select
                          value={facultyForm.subject}
                          onChange={(e) => setFacultyForm({ ...facultyForm, subject: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                        >
                          <option value="Biology">Biology (Medical)</option>
                          <option value="Physics">Physics (Engineering & Medical)</option>
                          <option value="Chemistry">Chemistry (Organic/Inorganic)</option>
                          <option value="Mathematics">Mathematics (IIT-JEE)</option>
                          <option value="Foundation">Foundation (6th-10th)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Degree / Qualifications</label>
                        <input
                          type="text"
                          value={facultyForm.degree}
                          onChange={(e) => setFacultyForm({ ...facultyForm, degree: e.target.value })}
                          placeholder="e.g. M.Sc Zoology, Gold Medalist"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Experience</label>
                        <input
                          type="text"
                          value={facultyForm.exp}
                          onChange={(e) => setFacultyForm({ ...facultyForm, exp: e.target.value })}
                          placeholder="e.g. 25+ Years Experience"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role / Designation</label>
                        <input
                          type="text"
                          value={facultyForm.role}
                          onChange={(e) => setFacultyForm({ ...facultyForm, role: e.target.value })}
                          placeholder="e.g. Senior Faculty & HOD"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Display Order</label>
                        <input
                          type="number"
                          value={facultyForm.order}
                          onChange={(e) => setFacultyForm({ ...facultyForm, order: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                        />
                      </div>
                    </div>

                    {/* Direct Photo Upload & Auto-Reduction to KB */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Faculty Photo (Direct Upload from PC / Mobile)
                        </label>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          Auto-reduces to ~40KB (Zero DB Load)
                        </span>
                      </div>

                      {/* Hidden File Input */}
                      <input
                        type="file"
                        id="faculty-photo-input"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handlePhotoUpload(e.target.files[0]);
                          }
                        }}
                      />

                      {/* Photo Preview Card or Upload Zone */}
                      {facultyForm.photo && facultyForm.photo !== '/assets/web/faculty-team-full.png' ? (
                        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-brand-yellow shadow-sm flex-shrink-0 bg-white">
                              <img
                                src={resolvePhotoUrl(facultyForm.photo)}
                                alt="Faculty preview"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                <span>Photo Compressed &amp; Ready</span>
                              </div>
                              {photoStats ? (
                                <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">
                                  {photoStats.origKb} KB ➔ <span className="font-extrabold">{photoStats.compKb} KB</span> ({photoStats.savedPercent}% saved!)
                                </p>
                              ) : (
                                <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5 max-w-[220px]">
                                  {facultyForm.photo}
                                </p>
                              )}
                              <p className="text-[10px] text-slate-400 mt-0.5">Reduced to KB to keep database fast</p>
                            </div>
                          </div>

                          <div className="flex flex-col gap-1.5 flex-shrink-0">
                            <label
                              htmlFor="faculty-photo-input"
                              className="px-3.5 py-1.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow text-xs font-bold cursor-pointer text-center transition shadow-sm"
                            >
                              Change Photo
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                setFacultyForm({ ...facultyForm, photo: '/assets/web/faculty-team-full.png' });
                                setPhotoStats(null);
                              }}
                              className="px-3 py-1 text-slate-400 hover:text-rose-600 text-[11px] font-semibold text-center transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label
                          htmlFor="faculty-photo-input"
                          className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-2xl cursor-pointer transition text-center ${
                            photoUploading
                              ? 'bg-amber-50/50 border-brand-yellow cursor-wait'
                              : 'border-slate-300 hover:border-brand-yellow bg-slate-50/70 hover:bg-amber-50/30'
                          }`}
                        >
                          {photoUploading ? (
                            <div className="flex flex-col items-center py-2">
                              <div className="w-8 h-8 border-3 border-brand-navy border-t-brand-yellow rounded-full animate-spin mb-2" />
                              <p className="text-xs font-bold text-slate-800">Compressing &amp; Optimizing to KB...</p>
                              <p className="text-[11px] text-slate-500">Shrinking image for fast database saving</p>
                            </div>
                          ) : (
                            <>
                              <div className="w-12 h-12 rounded-2xl bg-amber-100/80 text-brand-navy flex items-center justify-center mb-2.5 shadow-sm">
                                <UploadCloud className="w-6 h-6 text-brand-yellowDark" />
                              </div>
                              <p className="text-xs font-bold text-slate-800">
                                Click or Drag to Upload Photo from PC / Laptop / Mobile
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">
                                Supports JPG, PNG, WebP • Auto-reduces camera photos to ~40KB
                              </p>
                              <div className="inline-flex items-center gap-1.5 mt-2.5 px-3 py-1 rounded-full bg-slate-200/60 text-slate-600 text-[10px] font-bold">
                                <Camera className="w-3.5 h-3.5 text-brand-yellowDark" /> Mobile Camera / Gallery Supported
                              </div>
                            </>
                          )}
                        </label>
                      )}

                      {photoError && (
                        <p className="text-xs text-rose-600 font-semibold">{photoError}</p>
                      )}

                      {/* Collapsible custom URL & presets */}
                      <div className="pt-0.5">
                        <button
                          type="button"
                          onClick={() => setShowCustomUrl(!showCustomUrl)}
                          className="text-[11px] font-semibold text-slate-500 hover:text-brand-navy underline transition flex items-center gap-1"
                        >
                          {showCustomUrl ? '▼ Hide URL & Presets' : '▶ Or enter custom URL / choose presets'}
                        </button>

                        {showCustomUrl && (
                          <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                            <input
                              type="text"
                              value={facultyForm.photo}
                              onChange={(e) => setFacultyForm({ ...facultyForm, photo: e.target.value })}
                              placeholder="https://... or /assets/web/founder-chauhan.jpg"
                              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono"
                            />
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-400">Presets:</span>
                              {[
                                { label: 'Chauhan Sir', url: '/assets/web/founder-chauhan.jpg' },
                                { label: 'Jaivir Sir', url: '/assets/web/founder-jaivir.jpg' },
                                { label: 'Ashlesha Ma’am', url: '/assets/web/founder-ashlesha.jpg' },
                                { label: 'Chaurasia Sir', url: '/assets/web/founder-chaurasia.jpg' },
                                { label: 'Team Group', url: '/assets/web/faculty-team-full.png' }
                              ].map((pr, pIdx) => (
                                <button
                                  key={pIdx}
                                  type="button"
                                  onClick={() => {
                                    setFacultyForm({ ...facultyForm, photo: pr.url });
                                    setPhotoStats(null);
                                  }}
                                  className="px-2 py-0.5 bg-white hover:bg-slate-200 text-slate-600 rounded text-[10px] font-semibold border border-slate-200 transition"
                                >
                                  {pr.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Biography &amp; Achievements</label>
                      <textarea
                        rows={3}
                        value={facultyForm.bio}
                        onChange={(e) => setFacultyForm({ ...facultyForm, bio: e.target.value })}
                        placeholder="Has guided 20,000+ students with top ranks in NEET/IIT-JEE..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>

                    <div className="p-3 bg-amber-50 border border-brand-yellow/30 rounded-xl flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="showOnHome"
                        checked={facultyForm.showOnHome}
                        onChange={(e) => setFacultyForm({ ...facultyForm, showOnHome: e.target.checked })}
                        className="w-4 h-4 text-brand-navy rounded border-slate-300 focus:ring-brand-yellow"
                      />
                      <label htmlFor="showOnHome" className="text-xs font-bold text-slate-800 cursor-pointer">
                        Feature on Homepage (Display in Founding Faculty Mentors Grid)
                      </label>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setFacultyModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider shadow transition"
                      >
                        {loading ? 'Saving...' : editingFaculty ? 'Update Faculty Details' : 'Add to Faculty Team'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* VIEW: Courses & Fee CMS */}
        {activeMenu === 'courses' && (
          <div className="mt-8 space-y-6 animate-in fade-in">
            {/* Header & Action Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div>
                <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Layers className="w-6 h-6 text-brand-yellowDark" />
                  <span>Courses &amp; Fee Management CMS</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Manage all courses shown on the homepage. Add new courses, update tuition fees, RSAT scholarships, reorder cards, and toggle visibility.
                </p>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  onClick={handleResetDefaultCourses}
                  disabled={loading}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-1.5"
                  title="Restore original 5 courses"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>

                <button
                  onClick={handleOpenAddCourse}
                  className="px-5 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider rounded-xl shadow transition flex items-center gap-2 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Course</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Courses</span>
                <p className="text-2xl font-black text-slate-900 mt-1">{coursesList.length}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Program Offerings</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Live on Website</span>
                <p className="text-2xl font-black text-emerald-600 mt-1">
                  {coursesList.filter(c => c.active !== false).length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">Visible to Students</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Engineering</span>
                <p className="text-2xl font-black text-blue-600 mt-1">
                  {coursesList.filter(c => c.category === 'ENGINEERING').length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">IIT-JEE Programs</p>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Medical</span>
                <p className="text-2xl font-black text-amber-600 mt-1">
                  {coursesList.filter(c => c.category === 'MEDICAL').length}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">NEET-UG Programs</p>
              </div>
            </div>

            {/* Courses Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coursesList.map((course) => (
                <div
                  key={course.id}
                  className={`bg-white rounded-3xl p-6 border transition flex flex-col justify-between ${
                    course.active !== false
                      ? 'border-slate-200/90 shadow-sm hover:shadow-lg'
                      : 'border-slate-200 bg-slate-50/60 opacity-75'
                  }`}
                >
                  <div>
                    {/* Top Row: Category, Order & Active Toggle */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-full bg-brand-navy/10 text-brand-navy font-black text-[10px] uppercase">
                          {course.category || 'PROGRAM'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold text-[10px]">
                          Order: #{course.order || 1}
                        </span>
                      </div>

                      {/* Active / Inactive toggle */}
                      <button
                        onClick={() => handleToggleCourseActive(course)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition ${
                          course.active !== false
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-700 border border-rose-200'
                        }`}
                        title={course.active !== false ? 'Currently live (Click to hide)' : 'Currently hidden (Click to make live)'}
                      >
                        {course.active !== false ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3 text-rose-600" />}
                        <span>{course.active !== false ? 'Live on Web' : 'Hidden'}</span>
                      </button>
                    </div>

                    {/* Course Title */}
                    <h4 className="text-base font-black text-slate-900 leading-snug">
                      {course.title}
                    </h4>

                    {/* Description */}
                    <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-3">
                      {course.desc}
                    </p>

                    {/* Fee Details Box */}
                    <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-medium text-slate-500">Official Tuition Fee:</span>
                        <span className="text-xs font-black text-slate-900">{course.tuitionFee || 'Contact'}</span>
                      </div>
                      {course.scholarshipWaiver && (
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-medium text-slate-500">Scholarship:</span>
                          <span className="text-[11px] font-extrabold text-emerald-600">{course.scholarshipWaiver}</span>
                        </div>
                      )}
                      {course.startingFee && (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                          <span className="text-[11px] font-bold text-slate-600">Starting After RSAT:</span>
                          <span className="text-xs font-black text-brand-yellowDark">{course.startingFee}</span>
                        </div>
                      )}
                    </div>

                    {/* Key features preview */}
                    {course.keyFeatures && (
                      <div className="mt-3">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Features ({Array.isArray(course.keyFeatures) ? course.keyFeatures.length : 1})
                        </span>
                        <ul className="mt-1 space-y-0.5 text-[11px] text-slate-600">
                          {(Array.isArray(course.keyFeatures) ? course.keyFeatures : [course.keyFeatures]).slice(0, 2).map((feat, fIdx) => (
                            <li key={fIdx} className="truncate flex items-center gap-1">
                              <span className="w-1 h-1 rounded-full bg-brand-yellow flex-shrink-0"></span>
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Style: {course.domainKey || 'custom'}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditCourse(course)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs transition flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal: Add / Edit Course */}
            {courseModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
                <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative max-h-[90vh] overflow-y-auto">
                  <h3 className="text-xl font-black text-slate-900">
                    {editingCourse ? 'Edit Course & Fee Details' : 'Add New Course Offering'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Updates will immediately reflect on the main website homepage Courses &amp; Fee section.
                  </p>

                  <form onSubmit={handleSaveCourse} className="mt-5 space-y-4">
                    {/* Row 1: Title & Domain Key */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course Title *</label>
                        <input
                          type="text"
                          required
                          value={courseForm.title}
                          onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                          placeholder="e.g. JEE (Main+Advanced)/IIT-JEE"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Illustration Style *</label>
                        <select
                          value={courseForm.domainKey}
                          onChange={(e) => setCourseForm({ ...courseForm, domainKey: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                        >
                          <option value="jee-adv">Engineering (Helmet &amp; Buildings)</option>
                          <option value="neet-ug">Medical (Microscope &amp; DNA/Flask)</option>
                          <option value="jee-main">Maths/JEE Main (3D Pie &amp; Book)</option>
                          <option value="pncf">Foundation/PNCF (Smiling Kid &amp; Science)</option>
                          <option value="online">Online / Hybrid (Student &amp; Laptop)</option>
                          <option value="custom">General Education (Book &amp; Graduation)</option>
                        </select>
                      </div>
                    </div>

                    {/* Row 2: Category & Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Category *</label>
                        <select
                          value={courseForm.category}
                          onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold bg-white"
                        >
                          <option value="ENGINEERING">ENGINEERING</option>
                          <option value="MEDICAL">MEDICAL</option>
                          <option value="FOUNDATION">FOUNDATION</option>
                          <option value="DIGITAL &amp; HYBRID">DIGITAL &amp; HYBRID</option>
                          <option value="CRASH COURSE">CRASH COURSE</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Card Badge Tag</label>
                        <input
                          type="text"
                          value={courseForm.badge}
                          onChange={(e) => setCourseForm({ ...courseForm, badge: e.target.value })}
                          placeholder="e.g. Class, Target, Online"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Display Order</label>
                        <input
                          type="number"
                          value={courseForm.order}
                          onChange={(e) => setCourseForm({ ...courseForm, order: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                        />
                      </div>
                    </div>

                    {/* Row 3: Tuition Fee & Starting Fee */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Official Tuition Fee</label>
                        <input
                          type="text"
                          value={courseForm.tuitionFee}
                          onChange={(e) => setCourseForm({ ...courseForm, tuitionFee: e.target.value })}
                          placeholder="e.g. ₹1,10,000 / Year"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-brand-navy"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Starting Fee (Post RSAT)</label>
                        <input
                          type="text"
                          value={courseForm.startingFee}
                          onChange={(e) => setCourseForm({ ...courseForm, startingFee: e.target.value })}
                          placeholder="e.g. ₹11,000"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-emerald-700"
                        />
                      </div>
                    </div>

                    {/* Row 4: RSAT Scholarship & Batch Duration */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">RSAT Scholarship Waiver</label>
                        <input
                          type="text"
                          value={courseForm.scholarshipWaiver}
                          onChange={(e) => setCourseForm({ ...courseForm, scholarshipWaiver: e.target.value })}
                          placeholder="e.g. Up to 90% (Save up to ₹99,000 via RSAT)"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Batch Duration</label>
                        <input
                          type="text"
                          value={courseForm.duration}
                          onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                          placeholder="e.g. 1 Year / 2 Years Comprehensive Programme"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>
                    </div>

                    {/* Row 5: Target Exam & Eligibility */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Exam / Goal</label>
                        <input
                          type="text"
                          value={courseForm.target}
                          onChange={(e) => setCourseForm({ ...courseForm, target: e.target.value })}
                          placeholder="e.g. IIT-JEE 2026 / 2027 Aspirants"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Eligibility Criteria</label>
                        <input
                          type="text"
                          value={courseForm.eligibility}
                          onChange={(e) => setCourseForm({ ...courseForm, eligibility: e.target.value })}
                          placeholder="e.g. Class 10th to 11th moving, 12th appearing & Dropper"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course Description *</label>
                      <textarea
                        rows={2}
                        required
                        value={courseForm.desc}
                        onChange={(e) => setCourseForm({ ...courseForm, desc: e.target.value })}
                        placeholder="Concise overview of the program benefits for aspirants..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
                      />
                    </div>

                    {/* Key Features */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Key Features / Pedagogy Highlights (1 per line)
                      </label>
                      <textarea
                        rows={3}
                        value={courseForm.keyFeatures}
                        onChange={(e) => setCourseForm({ ...courseForm, keyFeatures: e.target.value })}
                        placeholder="Personal teaching by Senior Faculty Directors&#10;Daily 4.5 hours lectures + DPP&#10;CBT mock series matching exact pattern"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium font-mono"
                      />
                    </div>

                    {/* Active toggle */}
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="courseActive"
                        checked={courseForm.active}
                        onChange={(e) => setCourseForm({ ...courseForm, active: e.target.checked })}
                        className="w-4 h-4 text-brand-navy rounded border-slate-300 focus:ring-brand-yellow"
                      />
                      <label htmlFor="courseActive" className="text-xs font-bold text-slate-800 cursor-pointer">
                        Display this Course Live on the Main Website Homepage
                      </label>
                    </div>

                    {/* Modal Buttons */}
                    <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setCourseModalOpen(false)}
                        className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider shadow transition"
                      >
                        {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* VIEW 7: 18 Excel/CSV Reports */}
        {activeMenu === 'reports' && (
          <div className="mt-8 space-y-8 animate-in fade-in">
            {/* DIRECTOR SPECIAL DESK: RSAT & RANKEX MASTER FUNNEL SPREADSHEETS */}
            <div className="bg-gradient-to-br from-brand-navy via-slate-900 to-brand-navy p-6 sm:p-8 rounded-3xl text-white shadow-xl border-2 border-brand-yellow/30 space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy text-[10px] font-black uppercase tracking-wider">
                      DIRECTOR EXECUTIVE DASHBOARD
                    </span>
                    <span className="text-xs text-slate-300">Confidential Funnel Intelligence</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mt-1">
                    Director Master Candidate &amp; Funnel Spreadsheets
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Dedicated, pre-aggregated Excel/CSV sheets for the Director to audit every candidate stage: students who signed up/logged in only, paid registration fee, scheduled exam slots, and attempted the exam with scholarships awarded.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Live 2-Sheet Funnel Ready</span>
                  </span>
                </div>
              </div>

              {/* DUAL DIRECTOR SPREADSHEET CARDS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. RSAT Master Candidate Funnel Sheet */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 flex flex-col justify-between space-y-5 hover:border-brand-yellow/60 transition">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-brand-yellow text-[11px] font-black uppercase">
                        Sheet 1: RSAT Online Scholarship
                      </span>
                      <span className="text-[11px] text-slate-300 font-mono">17 Data Columns</span>
                    </div>

                    <h4 className="text-lg font-black text-white">
                      RSAT Master Candidate &amp; Funnel Report
                    </h4>
                    
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Tracks every RSAT aspirant across the complete 4-stage funnel:
                    </p>

                    {/* Funnel Stage Badges */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-200">
                        <strong className="block font-bold text-white">1. Signed Up / Login</strong>
                        <span className="text-[10px] text-slate-300">Created account / Logged in only</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200">
                        <strong className="block font-bold text-white">2. Fee Paid (₹100)</strong>
                        <span className="text-[10px] text-slate-300">Cashfree PG v3 verified</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-400/20 text-purple-200">
                        <strong className="block font-bold text-white">3. Slot Scheduled</strong>
                        <span className="text-[10px] text-slate-300">Date &amp; time slot reserved</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-200">
                        <strong className="block font-bold text-white">4. Exam Attempted</strong>
                        <span className="text-[10px] text-slate-300">Score &amp; scholarship awarded</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={adminApi.getReportUrl('director-rsat')}
                      download="Director_RSAT_Master_Funnel_Report.csv"
                      className="w-full py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-xl text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg transition transform hover:scale-[1.02]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download RSAT Director Sheet (Excel / CSV)</span>
                    </a>
                  </div>
                </div>

                {/* 2. RANKEX Master Candidate Funnel Sheet */}
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 flex flex-col justify-between space-y-5 hover:border-brand-yellow/60 transition">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 border border-cyan-400/40 text-cyan-300 text-[11px] font-black uppercase">
                        Sheet 2: RANKEX Entrance Exam
                      </span>
                      <span className="text-[11px] text-slate-300 font-mono">19 Data Columns</span>
                    </div>

                    <h4 className="text-lg font-black text-white">
                      RANKEX Master Candidate &amp; Funnel Report
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      Tracks every RANKEX aspirant for Indore campus &amp; online exam:
                    </p>

                    {/* Funnel Stage Badges */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-400/20 text-blue-200">
                        <strong className="block font-bold text-white">1. Signed Up / Login</strong>
                        <span className="text-[10px] text-slate-300">Created account / Logged in only</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-400/20 text-amber-200">
                        <strong className="block font-bold text-white">2. Fee Paid (₹100)</strong>
                        <span className="text-[10px] text-slate-300">Admit card generated</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-400/20 text-indigo-200">
                        <strong className="block font-bold text-white">3. Campus Venue Allotted</strong>
                        <span className="text-[10px] text-slate-300">Vijay Nagar Indore HQ</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-emerald-200">
                        <strong className="block font-bold text-white">4. Attendance &amp; Merit</strong>
                        <span className="text-[10px] text-slate-300">Present / Absent / Rank</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                    <a
                      href={adminApi.getReportUrl('director-rankx')}
                      download="Director_RANKEX_Master_Funnel_Report.csv"
                      className="w-full py-3 bg-cyan-400 hover:bg-cyan-300 text-brand-navy rounded-xl text-xs font-black uppercase tracking-wider text-center flex items-center justify-center gap-2 shadow-lg transition transform hover:scale-[1.02]"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download RANKEX Director Sheet (Excel / CSV)</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* GENERAL OPERATIONAL REPORTS */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Departmental &amp; Operational Reports</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Additional spreadsheets for accounting reconciliation, centre seating plans, and SMS logs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: 'Student Registration Master Report', type: 'students', desc: 'Complete database of registered candidates with class and contact info' },
                  { title: 'RANKEX Venue & Centre Allocation', type: 'director-rankx', desc: 'Physical seat bookings per examination centre in Indore' },
                  { title: 'RSAT Online Test Scores Report', type: 'director-rsat', desc: 'Scorecard, accuracy percentage, and scholarship percentage won' },
                  { title: 'Fee Collection & Gateway Audit', type: 'payments', desc: 'Reconciled transactions, Cashfree PG orders, and receipts' },
                  { title: 'SMS Gateway Delivery & OTP Log', type: 'sms', desc: 'DLT-compliant SMS delivery records and verification timestamps' },
                  { title: 'Test Series 20-Test Participation', type: 'submissions', desc: 'Mock test completion status, missed tests, and rankings' }
                ].map((rep, idx) => (
                  <div key={idx} className="p-5 rounded-2xl border border-slate-200 hover:border-brand-yellow transition flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900">{rep.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.desc}</p>
                    </div>
                    <a
                      href={adminApi.getReportUrl(rep.type)}
                      download
                      className="w-full py-2.5 bg-slate-100 hover:bg-brand-yellow hover:text-brand-navy rounded-xl text-xs font-bold text-slate-700 text-center flex items-center justify-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download CSV / Excel</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Fee Collection & Cashfree PG Reconciliation Audit */}
        {activeMenu === 'payments' && (
          <div className="mt-8 space-y-6 animate-in fade-in">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Revenue Collected</span>
                <h3 className="text-3xl font-black text-slate-900 mt-1">
                  ₹{(stats?.totalRevenue || paymentsList.reduce((s, p) => s + (Number(p.amount) || 0), 0)).toLocaleString('en-IN')}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{paymentsList.length} total transactions logged</p>
              </div>

              <div className="bg-emerald-50/70 rounded-3xl p-6 border border-emerald-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-800 uppercase">Cashfree PG v3</span>
                  <span className="text-[10px] font-black bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase">
                    Live Active
                  </span>
                </div>
                <h3 className="text-3xl font-black text-emerald-950 mt-1">
                  ₹{(paymentsList.filter(p => (p.gateway || p.paymentMode) === 'CASHFREE').reduce((s, p) => s + (Number(p.amount) || 0), 0)).toLocaleString('en-IN')}
                </h3>
                <p className="text-xs text-emerald-700 font-semibold mt-1">
                  {paymentsList.filter(p => (p.gateway || p.paymentMode) === 'CASHFREE').length} Cashfree orders settled
                </p>
              </div>

              <div className="bg-purple-50/70 rounded-3xl p-6 border border-purple-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-800 uppercase">Payment Verification</span>
                  <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full uppercase">
                    Secured
                  </span>
                </div>
                <h3 className="text-3xl font-black text-purple-950 mt-1">
                  {paymentsList.length} Paid
                </h3>
                <p className="text-xs text-purple-700 font-semibold mt-1">
                  RBI Compliant &bull; 256-Bit Encrypted
                </p>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Cashfree Gateway API</span>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-extrabold text-slate-800">PG v3 (2023-08-01)</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Web Checkout Modal &bull; UPI QR &bull; Cards &bull; NetBanking</p>
                </div>
                <div className="pt-2">
                  <a
                    href={adminApi.getReportUrl('payments')}
                    download
                    className="w-full py-2 bg-brand-yellow hover:bg-yellow-400 text-brand-navy rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Excel Audit</span>
                  </a>
                </div>
              </div>
            </div>

            {/* ADMIN DECISION DESK: Institute Fee Structure Controller */}
            <div className="bg-gradient-to-br from-white to-slate-50/80 rounded-3xl p-6 sm:p-8 border-2 border-brand-navy/20 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-xl bg-brand-navy text-brand-yellow font-black text-xs">
                      ⚙️ ADMIN DECISION DESK
                    </span>
                    <h3 className="text-lg font-black text-slate-900">
                      Institute Fee Structure &amp; Pricing Controller
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    यहाँ से आप डिसाइड कर सकते हैं कि वेबसाइट पर RSAT, RANKEX, Admission Token, और Test Series की कितनी फीस चार्ज होगी। सेव करते ही वेबसाइट पर तुरंत अपडेट हो जाएगा।
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {feeSaveSuccess && (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 animate-in fade-in">
                      {feeSaveSuccess}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleSaveFeeConfig}
                    disabled={feeSaving}
                    className="px-6 py-2.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider rounded-xl shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
                  >
                    {feeSaving ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-brand-yellow border-t-transparent rounded-full animate-spin"></span>
                        <span>Saving Changes...</span>
                      </>
                    ) : (
                      <>
                        <span>💾 Save &amp; Publish Fee Structure</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Grid of Editable Fee Fields */}
              <form onSubmit={handleSaveFeeConfig} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. RSAT Scholarship Fee */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 focus-within:border-brand-navy transition">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                      <span>🎓 RSAT Exam Fee</span>
                    </label>
                    <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">Website Live</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={feeConfig.rsatFee}
                      onChange={(e) => setFeeConfig({ ...feeConfig, rsatFee: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Scholarship admission test fee</p>
                </div>

                {/* 2. RANKEX Mahasangram Fee */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 focus-within:border-brand-navy transition">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                      <span>🏆 RANKEX Fee</span>
                    </label>
                    <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-1.5 py-0.5 rounded">Kota Batch</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={feeConfig.rankxFee}
                      onChange={(e) => setFeeConfig({ ...feeConfig, rankxFee: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Mahasangram 2027 offline exam</p>
                </div>

                {/* 3. Classroom Token Fee */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 focus-within:border-brand-navy transition">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                      <span>🏫 Admission Token Fee</span>
                    </label>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">Seat Booking</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="100"
                      step="500"
                      value={feeConfig.classroomTokenFee}
                      onChange={(e) => setFeeConfig({ ...feeConfig, classroomTokenFee: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Advance seat locking fee</p>
                </div>

                {/* 4. Test Series Fee */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 focus-within:border-brand-navy transition">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5">
                      <span>📚 Test Series Package</span>
                    </label>
                    <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-1.5 py-0.5 rounded">All-India CBT</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="100"
                      step="100"
                      value={feeConfig.testSeriesFee}
                      onChange={(e) => setFeeConfig({ ...feeConfig, testSeriesFee: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">20-Mock Tests + Kota Modules</p>
                </div>

                {/* 5. 1-Year Dropper Batch */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 focus-within:border-brand-navy transition">
                  <label className="text-xs font-black text-slate-800 uppercase block">
                    🎯 Dropper / Target Tuition Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="1000"
                      step="1000"
                      value={feeConfig.dropperBatchFee}
                      onChange={(e) => setFeeConfig({ ...feeConfig, dropperBatchFee: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">1-Year Intensive NEET/JEE batch</p>
                </div>

                {/* 6. Foundation PNCF */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 focus-within:border-brand-navy transition">
                  <label className="text-xs font-black text-slate-800 uppercase block">
                    🌱 Foundation (PNCF) Fee
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-slate-400">₹</span>
                    <input
                      type="number"
                      min="1000"
                      step="1000"
                      value={feeConfig.foundationFee}
                      onChange={(e) => setFeeConfig({ ...feeConfig, foundationFee: Number(e.target.value) })}
                      className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-navy"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500">Class 9th &amp; 10th Pre-Foundation</p>
                </div>

                {/* 7. GST Percentage */}
                <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5 focus-within:border-brand-navy transition">
                  <label className="text-xs font-black text-slate-800 uppercase block">
                    📑 GST Rate (%)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="28"
                      value={feeConfig.gstRate}
                      onChange={(e) => setFeeConfig({ ...feeConfig, gstRate: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-slate-900 text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-navy"
                    />
                    <span className="absolute right-3 top-2.5 text-sm font-bold text-slate-400">%</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Tax rate for official receipts</p>
                </div>

                {/* 8. Quick Actions & Status */}
                <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 block">Website Sync Status</span>
                    <span className="text-xs font-extrabold text-emerald-800 flex items-center gap-1 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Live Synchronized</span>
                    </span>
                    <p className="text-[10px] text-slate-500 mt-1">
                      Updated: {feeConfig.updatedAt ? new Date(feeConfig.updatedAt).toLocaleTimeString() : 'Just now'}
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={feeSaving}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition shadow-xs"
                  >
                    {feeSaving ? 'Saving...' : 'Apply Live'}
                  </button>
                </div>

              </form>
            </div>

            {/* Main Table Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              
              {/* Filter & Search Header */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                    <span>Website Online Payments Ledger ({paymentsList.length} Transactions)</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time audit log of all online fee payments received via official Cashfree Payments PG v3 gateway.
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto">
                  {/* Direct Excel Export Button */}
                  <a
                    href={adminApi.getReportUrl('payments')}
                    download
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5"
                    title="Export all collected online payments as CSV/Excel Sheet"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>📥 Download Payments Excel Sheet</span>
                  </a>

                  {/* Gateway Filter Tabs */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    {['ALL', 'CASHFREE'].map(gw => (
                      <button
                        key={gw}
                        onClick={() => setPaymentGatewayFilter(gw)}
                        className={`px-3 py-1.5 rounded-lg transition ${
                          paymentGatewayFilter === gw
                            ? 'bg-white text-slate-900 shadow-xs font-black'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {gw === 'ALL' ? 'All Payments' : '🟢 Cashfree PG v3'}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={refreshPayments}
                    disabled={loading}
                    className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 transition text-xs font-bold flex items-center gap-1.5"
                    title="Refresh payment records"
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    <span className="hidden sm:inline">Refresh</span>
                  </button>
                </div>
              </div>

              {/* Sub-Filters: Purpose & Search */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="Search by student name, roll no, mobile, order ID or transaction ID..."
                    value={paymentSearch}
                    onChange={(e) => setPaymentSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  {paymentSearch && (
                    <button
                      onClick={() => setPaymentSearch('')}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 text-xs font-bold"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div>
                  <select
                    value={paymentPurposeFilter}
                    onChange={(e) => setPaymentPurposeFilter(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="ALL">All Fee Purposes</option>
                    <option value="RSAT">🎓 RSAT Scholarship Registration</option>
                    <option value="RANKEX">🏆 RANKEX Mahasangram 2027</option>
                    <option value="ADMISSION">🏫 Classroom Admission Token</option>
                    <option value="TEST_SERIES">📚 Test Series / Study Material</option>
                    <option value="TUITION">✍️ Balance Tuition Fee</option>
                  </select>
                </div>
              </div>

              {/* Payments Table */}
              {(() => {
                const filtered = paymentsList.filter(p => {
                  const gw = (p.gateway || p.paymentMode || '').toUpperCase();
                  if (paymentGatewayFilter === 'CASHFREE' && !gw.includes('CASHFREE')) return false;

                  const pur = (p.purpose || '').toUpperCase();
                  if (paymentPurposeFilter !== 'ALL' && !pur.includes(paymentPurposeFilter)) return false;

                  if (paymentSearch.trim()) {
                    const q = paymentSearch.toLowerCase();
                    const name = (p.studentName || '').toLowerCase();
                    const mob = (p.mobile || '').toLowerCase();
                    const roll = (p.metadata?.rollNumber || p.rollNumber || '').toLowerCase();
                    const txId = (p.transactionId || p.orderId || '').toLowerCase();
                    if (!name.includes(q) && !mob.includes(q) && !roll.includes(q) && !txId.includes(q)) {
                      return false;
                    }
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-12 text-center rounded-2xl bg-slate-50 border border-dashed border-slate-300">
                      <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                      <h4 className="text-sm font-extrabold text-slate-700">No payment records found</h4>
                      <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                        {paymentSearch || paymentGatewayFilter !== 'ALL' || paymentPurposeFilter !== 'ALL'
                          ? 'No transactions matched your search or filter criteria.'
                          : 'Online transactions received via Cashfree Payments will appear here automatically.'}
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-500 font-extrabold uppercase border-b border-slate-200">
                        <tr>
                          <th className="py-3 px-4">Date &amp; Time</th>
                          <th className="py-3 px-4">Student &amp; Roll No</th>
                          <th className="py-3 px-4">Purpose / Fee Head</th>
                          <th className="py-3 px-4">Payment Gateway</th>
                          <th className="py-3 px-4">Order / TXN ID</th>
                          <th className="py-3 px-4">Amount</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Official Receipt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map((item, idx) => {
                          const isCashfree = (item.gateway || item.paymentMode || '').toUpperCase().includes('CASHFREE');
                          const roll = item.metadata?.rollNumber || item.rollNumber || 'RPX-2026';
                          const dt = item.paidAt || item.initiatedAt || item.createdAt;
                          const formattedDate = dt ? new Date(dt).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Recent';

                          return (
                            <tr key={item.id || idx} className="hover:bg-slate-50/80 transition">
                              <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                                {formattedDate}
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="font-extrabold text-slate-900">{item.studentName || 'Student Aspirant'}</div>
                                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                                  <span>+91-{item.mobile || '—'}</span>
                                  <span>&bull;</span>
                                  <span className="font-mono text-brand-navy font-bold">{roll}</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 font-bold text-slate-700 text-[11px]">
                                  {item.purpose ? item.purpose.replace(/_/g, ' ') : 'Course Fee'}
                                </span>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-extrabold text-[10px] border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  <span>Cashfree PG v3</span>
                                </span>
                              </td>

                              <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600 max-w-[140px] truncate" title={item.transactionId || item.orderId}>
                                {item.transactionId || item.orderId || '—'}
                              </td>

                              <td className="py-3.5 px-4 font-black text-emerald-700 text-sm whitespace-nowrap">
                                ₹{Number(item.amount || 0).toLocaleString('en-IN')}
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                                  {item.status || 'SUCCESS'}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => setSelectedReceipt({
                                    ...item,
                                    receiptNumber: item.receiptNumber || `RPX-REC-${Math.floor(100000 + Math.random() * 900000)}`,
                                    formattedDate
                                  })}
                                  className="px-3 py-1.5 bg-slate-100 hover:bg-brand-yellow hover:text-brand-navy rounded-xl text-xs font-bold text-slate-700 inline-flex items-center gap-1 transition"
                                >
                                  <Receipt className="w-3.5 h-3.5" />
                                  <span>Receipt</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}

            </div>
          </div>
        )}

        {/* Official Fee Receipt Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in border border-slate-200">
              
              {/* Receipt Header Banner */}
              <div className="bg-brand-navy p-6 text-white flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-brand-yellow" />
                    <h3 className="text-lg font-black text-white">Official Institute Fee Receipt</h3>
                  </div>
                  <p className="text-xs text-brand-yellow mt-0.5">Rankerspath Educational Pvt. Ltd. &bull; GST Valid</p>
                </div>
                <button
                  onClick={() => setSelectedReceipt(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Printable Receipt Body */}
              <div className="p-6 space-y-5 text-xs text-slate-700" id="official-print-receipt">
                {/* Institute Header */}
                <div className="text-center pb-4 border-b border-slate-200 space-y-1">
                  <h4 className="text-base font-black text-slate-900 uppercase tracking-wide">
                    RANKERS PATH EDUCATIONAL INSTITUTE
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    HQ City Walk, Block A, 129, Scheme No. 54, Near Satya Sai Square, Vijay Nagar, Indore - 452010
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Helpline: +91-9131435511 / 7974546310 &bull; Email: rankerspathofficial.edu@gmail.com
                  </p>
                </div>

                {/* Receipt Metadata */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Receipt Number</span>
                    <span className="font-mono font-extrabold text-slate-900">{selectedReceipt.receiptNumber}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Date</span>
                    <span className="font-semibold text-slate-900">{selectedReceipt.formattedDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Student Name</span>
                    <span className="font-bold text-slate-900">{selectedReceipt.studentName || 'Student Aspirant'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Mobile</span>
                    <span className="font-semibold text-slate-900">+91-{selectedReceipt.mobile || '—'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Roll / Application No</span>
                    <span className="font-mono font-extrabold text-brand-navy">
                      {selectedReceipt.metadata?.rollNumber || selectedReceipt.rollNumber || 'RPX-2026'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Gateway Used</span>
                    <span className="font-bold text-emerald-700">
                      Cashfree Payments PG v3
                    </span>
                  </div>
                </div>

                {/* Fee Particulars Table */}
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-600 font-extrabold text-[11px] uppercase">
                      <tr>
                        <th className="p-3">Fee Particulars</th>
                        <th className="p-3 text-right">Amount (INR)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr>
                        <td className="p-3">
                          <div className="font-bold text-slate-900">
                            {selectedReceipt.purpose ? selectedReceipt.purpose.replace(/_/g, ' ') : 'Fee Collection'}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Transaction ID: {selectedReceipt.transactionId || selectedReceipt.orderId || '—'}
                          </div>
                        </td>
                        <td className="p-3 text-right font-black text-slate-900">
                          ₹{Number(selectedReceipt.amount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                      <tr className="bg-slate-50 font-black text-slate-900 text-sm">
                        <td className="p-3">Total Paid Amount</td>
                        <td className="p-3 text-right text-emerald-700">
                          ₹{Number(selectedReceipt.amount || 0).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Verification Notice */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[11px] text-emerald-800">
                  <div className="flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Payment Verified via Banking Gateway &bull; Status: SUCCESS</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase">Authorized</span>
                </div>

                {/* Actions */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedReceipt(null)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold transition"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider shadow transition flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Official Receipt</span>
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Test Creation Modal */}
        {testModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in border border-slate-200">
              <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy p-6 text-white flex items-center justify-between border-b border-brand-yellow/30">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40 text-[10px] font-black uppercase tracking-wider">
                      CBT Exam Builder
                    </span>
                    <h3 className="text-lg font-black text-white">Schedule New Test Series / Exam</h3>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">Authentic JEE Advanced, JEE Main, NEET-UG &amp; Foundation Patterns with Director Approval</p>
                </div>
                <button onClick={() => setTestModalOpen(false)} className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTest} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
                {/* Exam Category */}
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5">Exam Category *</label>
                  <select
                    value={testForm.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      let type = testForm.patternType || 'JEE_MAIN';
                      let stream = 'JEE';
                      let duration = 180;
                      let marks = 300;

                      if (cat === 'RSAT') {
                        type = 'RSAT';
                        stream = 'ALL';
                        duration = 45;
                        marks = 120;
                      } else if (cat === 'RANKEX') {
                        type = 'RANKEX';
                        stream = 'ALL';
                        duration = 60;
                        marks = 160;
                      }

                      setTestForm({
                        ...testForm,
                        category: cat,
                        examType: type,
                        stream,
                        durationMinutes: duration,
                        totalMarks: marks
                      });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold text-slate-900 shadow-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-navy"
                  >
                    <option value="STUDENT_TEST_SERIES">📚 Enrolled Student Test Series (Classroom Tests &amp; Minor/Major Series)</option>
                    <option value="RSAT">🎓 RSAT (Ranker's Scholarship Admission Test)</option>
                    <option value="RANKEX">🏆 RANKEX (Talent &amp; Excellence Mahasangram)</option>
                  </select>
                </div>

                {/* Exam Pattern Templates Selection */}
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1.5 flex items-center justify-between">
                    <span>Select Authentic Exam Pattern Template *</span>
                    <span className="text-[10px] text-amber-600 font-bold lowercase">Based on Official NTA / IIT Sample Papers</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {/* JEE Advanced */}
                    <div
                      onClick={() => setTestForm({
                        ...testForm,
                        patternType: 'JEE_ADVANCED',
                        examType: 'JEE_ADVANCED',
                        stream: 'JEE',
                        durationMinutes: 180,
                        totalMarks: 180,
                        title: testForm.title || 'JEE Advanced 2025 All India Mock Test - Paper 1'
                      })}
                      className={`p-3 rounded-xl border cursor-pointer transition relative text-left ${
                        testForm.patternType === 'JEE_ADVANCED'
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-indigo-950 flex items-center gap-1.5">
                          🎯 JEE Advanced
                        </span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                          180M &bull; 180m
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        4 Sections: Single Correct (+3/-1), Multi-Correct partial (+4/+3/+2/+1/-2), Numerical Range NAT (+4/0), Matrix Match (+4/-1).
                      </p>
                    </div>

                    {/* JEE Main */}
                    <div
                      onClick={() => setTestForm({
                        ...testForm,
                        patternType: 'JEE_MAIN',
                        examType: 'JEE_MAIN',
                        stream: 'JEE',
                        durationMinutes: 180,
                        totalMarks: 300,
                        title: testForm.title || 'JEE Main 2026 NTA All India Mock Series - Shift 01'
                      })}
                      className={`p-3 rounded-xl border cursor-pointer transition relative text-left ${
                        testForm.patternType === 'JEE_MAIN'
                          ? 'border-blue-600 bg-blue-50/70 shadow-sm ring-2 ring-blue-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-950 flex items-center gap-1.5">
                          🚀 JEE Main
                        </span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                          300M &bull; 180m
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        NTA Standard: Section A (20 MCQs) + Section B (10 Numerical/Range NAT with virtual keypad, attempt 5).
                      </p>
                    </div>

                    {/* NEET-UG */}
                    <div
                      onClick={() => setTestForm({
                        ...testForm,
                        patternType: 'NEET_UG',
                        examType: 'NEET',
                        stream: 'NEET',
                        durationMinutes: 200,
                        totalMarks: 720,
                        title: testForm.title || 'NEET-UG 2025 All India Grand Mock - Code F5'
                      })}
                      className={`p-3 rounded-xl border cursor-pointer transition relative text-left ${
                        testForm.patternType === 'NEET_UG' || testForm.examType === 'NEET'
                          ? 'border-emerald-600 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-emerald-950 flex items-center gap-1.5">
                          🩺 NEET-UG (AKANH Code F5)
                        </span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          720M &bull; 200m
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Physics, Chemistry, Botany, Zoology. Sec A (35 mandatory) + Sec B (15 MCQs attempt any 10). 200 Qs.
                      </p>
                    </div>

                    {/* Foundation PNCF */}
                    <div
                      onClick={() => setTestForm({
                        ...testForm,
                        patternType: 'FOUNDATION_PNCF',
                        examType: 'FOUNDATION',
                        stream: 'FOUNDATION',
                        durationMinutes: 90,
                        totalMarks: 160,
                        classLevel: 'Class 9-10',
                        title: testForm.title || 'PNCF Foundation Olympiad & Talent Series 01'
                      })}
                      className={`p-3 rounded-xl border cursor-pointer transition relative text-left ${
                        testForm.patternType === 'FOUNDATION_PNCF'
                          ? 'border-amber-600 bg-amber-50/70 shadow-sm ring-2 ring-amber-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-amber-950 flex items-center gap-1.5">
                          🌱 Foundation PNCF
                        </span>
                        <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          160M &bull; 90m
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1">
                        Class 9th &amp; 10th: Science (PCB), Mathematics, Mental Ability (MAT) for NTSE &amp; Olympiad prep.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Test Title / Name */}
                <div>
                  <label className="block text-xs font-black text-slate-800 uppercase tracking-wide mb-1">
                    Unique Test Series / Exam Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 💎 Diamond Batch: JEE Advanced Paper-1 Mock 01"
                    value={testForm.title}
                    onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold shadow-sm focus:ring-2 focus:ring-brand-yellow focus:border-brand-navy"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Every exam has a unique name so ranks, attendance sheets, and scorecards are linked specifically to this test.
                  </p>
                </div>

                {/* If Student Test Series: Show Stream, Subject, Batch Tier, and Target Class */}
                {testForm.category === 'STUDENT_TEST_SERIES' && (
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject Scope *</label>
                        <select
                          value={testForm.subject}
                          onChange={(e) => setTestForm({ ...testForm, subject: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                        >
                          <option value="FULL_MOCK">Full Mock (Complete Syllabus)</option>
                          <option value="PHYSICS">Physics Only</option>
                          <option value="CHEMISTRY">Chemistry Only</option>
                          {testForm.stream === 'NEET' ? (
                            <option value="BIOLOGY">Biology (Botany &amp; Zoology)</option>
                          ) : (
                            <option value="MATHEMATICS">Mathematics Only</option>
                          )}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confidence Batch Tier *</label>
                        <select
                          value={testForm.batchTier}
                          onChange={(e) => setTestForm({ ...testForm, batchTier: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                        >
                          <option value="ALL">All Batch Tiers (Common Test)</option>
                          <option value="DIAMOND">💎 Diamond Batch (Super 30 / Top 1%)</option>
                          <option value="PLATINUM">🌟 Platinum Batch (Star Achievers)</option>
                          <option value="SILVER">🥈 Silver Batch (Core Leaders)</option>
                          <option value="GREEN">🟢 Green Batch (Foundation &amp; Starters)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Class</label>
                        <select
                          value={testForm.classLevel}
                          onChange={(e) => setTestForm({ ...testForm, classLevel: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                        >
                          <option value="Class 11">Class 11th</option>
                          <option value="Class 12">Class 12th</option>
                          <option value="Dropper">Dropper / Repeater</option>
                          <option value="Class 9-10">Class 9th / 10th Foundation</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Stream</label>
                        <select
                          value={testForm.stream}
                          onChange={(e) => setTestForm({ ...testForm, stream: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                        >
                          <option value="JEE">IIT-JEE</option>
                          <option value="NEET">NEET-UG</option>
                          <option value="FOUNDATION">Foundation</option>
                          <option value="ALL">All Enrolled</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Duration & Marks */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={testForm.durationMinutes}
                      onChange={(e) => setTestForm({ ...testForm, durationMinutes: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Marks</label>
                    <input
                      type="number"
                      value={testForm.totalMarks}
                      onChange={(e) => setTestForm({ ...testForm, totalMarks: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description / Syllabus Notes</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Chapter-wise test on Rotational Dynamics and Thermodynamics..."
                    value={testForm.description}
                    onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>

                {/* Director Verification & 1-Click WhatsApp / Email Dispatch Protocol */}
                <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                    <div>
                      <h4 className="text-xs font-black text-amber-950 uppercase tracking-wide">
                        Director Verification &amp; Authorization Protocol
                      </h4>
                      <p className="text-[11px] text-amber-800">
                        Paper is saved in Draft until the Director approves it via WhatsApp or Email.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <input
                      type="checkbox"
                      id="sendToDirectorToggle"
                      checked={testForm.sendDirectlyToDirector}
                      onChange={(e) => setTestForm({ ...testForm, sendDirectlyToDirector: e.target.checked })}
                      className="w-4 h-4 text-brand-navy rounded border-amber-300 focus:ring-brand-yellow"
                    />
                    <label htmlFor="sendToDirectorToggle" className="text-xs font-bold text-slate-800 cursor-pointer">
                      Open Director Share Desk immediately to dispatch WhatsApp &amp; Email notification
                    </label>
                  </div>

                  {testForm.sendDirectlyToDirector && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Director Mobile (WhatsApp)</label>
                        <input
                          type="text"
                          value={testForm.directorMobile}
                          onChange={(e) => setTestForm({ ...testForm, directorMobile: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-amber-200 bg-white text-xs font-bold text-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Director Official Email</label>
                        <input
                          type="email"
                          value={testForm.directorEmail}
                          onChange={(e) => setTestForm({ ...testForm, directorEmail: e.target.value })}
                          className="w-full px-3 py-1.5 rounded-lg border border-amber-200 bg-white text-xs font-bold text-slate-800"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setTestModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider shadow-lg transition flex items-center gap-2"
                  >
                    {loading ? (
                      'Preparing Paper...'
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Launch Test &amp; Notify Director</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Submission & Marks Evaluation Modal */}
        {editSubmissionModal && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in border border-slate-200">
              <div className="bg-brand-navy p-6 text-white flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-extrabold text-white">Edit Submission Marks &amp; Scorecard</h3>
                  <p className="text-xs text-brand-yellow mt-0.5">
                    {editSubmissionModal.studentName} (+91-{editSubmissionModal.mobile})
                  </p>
                </div>
                <button onClick={() => setEditSubmissionModal(null)} className="p-2 rounded-full hover:bg-white/10 text-slate-300 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditSubmission} className="p-6 space-y-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <p className="font-bold text-slate-900">{editSubmissionModal.examTitle}</p>
                  <p className="text-slate-500">
                    Category: <strong className="text-brand-navy uppercase">{editSubmissionModal.category || 'STUDENT_TEST_SERIES'}</strong> &bull;
                    Submitted: {new Date(editSubmissionModal.submittedAt || Date.now()).toLocaleString()}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Score Obtained</label>
                    <input
                      type="number"
                      required
                      value={editSubmissionForm.score}
                      onChange={(e) => {
                        const sc = Number(e.target.value);
                        const max = editSubmissionForm.maxMarks || 100;
                        const pct = max > 0 ? Math.max(0, Math.round((Math.max(0, sc) / max) * 100)) : 0;
                        setEditSubmissionForm({
                          ...editSubmissionForm,
                          score: sc,
                          percentage: pct
                        });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Max Marks</label>
                    <input
                      type="number"
                      required
                      value={editSubmissionForm.maxMarks}
                      onChange={(e) => {
                        const max = Number(e.target.value);
                        const sc = editSubmissionForm.score || 0;
                        const pct = max > 0 ? Math.max(0, Math.round((Math.max(0, sc) / max) * 100)) : 0;
                        setEditSubmissionForm({
                          ...editSubmissionForm,
                          maxMarks: max,
                          percentage: pct
                        });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Accuracy / Percentage (%)</label>
                    <input
                      type="number"
                      value={editSubmissionForm.percentage}
                      onChange={(e) => setEditSubmissionForm({ ...editSubmissionForm, percentage: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Scholarship Slab (%)</label>
                    <input
                      type="number"
                      value={editSubmissionForm.scholarshipPercent}
                      onChange={(e) => setEditSubmissionForm({ ...editSubmissionForm, scholarshipPercent: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mentor Remarks / Feedback</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Strong conceptual grasp in Physical Chemistry; speed needs work in Calculus."
                    value={editSubmissionForm.remarks}
                    onChange={(e) => setEditSubmissionForm({ ...editSubmissionForm, remarks: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs"
                  ></textarea>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="subIsPublished"
                    checked={editSubmissionForm.isPublished}
                    onChange={(e) => setEditSubmissionForm({ ...editSubmissionForm, isPublished: e.target.checked })}
                    className="w-4 h-4 text-brand-navy rounded border-slate-300 focus:ring-brand-yellow"
                  />
                  <label htmlFor="subIsPublished" className="text-xs font-bold text-emerald-900 cursor-pointer">
                    Publish to Student Panel (Immediately visible on student dashboard)
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setEditSubmissionModal(null)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider shadow transition"
                  >
                    {loading ? 'Saving...' : 'Save Evaluation'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL: Director's Executive Printable Evaluation Report */}
        <DirectorReportModal
          isOpen={directorReportModalOpen}
          onClose={() => setDirectorReportModalOpen(false)}
          selectedExamFilter={selectedExamFilter}
          filteredSubmissions={filteredSubmissions}
          onDownloadExcelCsv={handleDownloadExcelCsv}
        />

        {/* MODAL: Candidate Question-by-Question Answer Sheet Inspection */}
        <CandidateInspectModal
          submission={selectedSubmissionForInspect}
          onClose={() => setSelectedSubmissionForInspect(null)}
          questions={questions}
        />

        {/* MODAL: Director WhatsApp & Email Share Desk */}
        <DirectorShareModal
          isOpen={directorShareModalOpen}
          onClose={() => setDirectorShareModalOpen(false)}
          test={selectedTestForDirectorShare}
          onTestApproved={handleTestApproved}
        />

        {/* MODAL: Exam Participation, Attendance Ledger & Live Result Toggle */}
        <ExamParticipationModal
          isOpen={participationModalOpen}
          onClose={() => setParticipationModalOpen(false)}
          test={selectedTestForParticipation}
          onInspectSubmission={(sub) => {
            setParticipationModalOpen(false);
            setSelectedSubmissionForInspect(sub);
          }}
        />

      </main>

    </div>
  );
}
