import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  X,
  Play,
  FolderOpen,
  Share2,
  Sparkles,
  Link as LinkIcon,
  BookOpen,
  Award,
  Video,
  Radio,
  ChevronLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  HelpCircle,
  Sliders,
  Zap,
  CalendarCheck2
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const MONTHS_LIST = [
  { value: 1, name: 'January' },
  { value: 2, name: 'February' },
  { value: 3, name: 'March' },
  { value: 4, name: 'April' },
  { value: 5, name: 'May' },
  { value: 6, name: 'June' },
  { value: 7, name: 'July' },
  { value: 8, name: 'August' },
  { value: 9, name: 'September' },
  { value: 10, name: 'October' },
  { value: 11, name: 'November' },
  { value: 12, name: 'December' }
];

const DEFAULT_FACULTIES = {
  NEET: [
    'Dr. Rajesh Sharma (Ex-HOD Biology)',
    'Er. Arvind Gupta (IIT Delhi Alum - Physics)',
    'Dr. S. K. Verma (Kota Veteran - Chemistry)',
    'Dr. Sandeep Patidar (Doctorate Chem)'
  ],
  JEE: [
    'Er. Arvind Gupta (IIT Delhi Alum - Physics)',
    'Er. Bhaskar Patel (Kota Senior Mentor - Maths)',
    'Er. Abhishek Sir (Ex-Kota - Maths)',
    'Dr. S. K. Verma (Kota Veteran - Chemistry)',
    'Dr. Sandeep Patidar (Doctorate Chem)'
  ]
};

export default function ClassCalendarDesk() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & State
  const [activeStream, setActiveStream] = useState('NEET'); // 'NEET' or 'JEE'
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'agenda'
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(10); // 10 = October

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // Class Form State
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Biology',
    stream: 'NEET',
    targetBatch: 'Class 11 Leader',
    facultyName: 'Dr. Rajesh Sharma (Ex-HOD Biology)',
    date: '2026-10-15',
    startTime: '09:00 AM',
    endTime: '10:30 AM',
    dayOfWeek: 'Thursday',
    chapter: '',
    syllabus: '',
    classMode: 'HYBRID',
    gcUrl: 'https://meet.google.com/rp-live-class',
    teacherMessage: '',
    status: 'SCHEDULED',
    hasTest: false,
    testDetails: {
      testTitle: '',
      testType: 'Weekly Unit Test',
      testTiming: '02:00 PM - 05:20 PM',
      totalMarks: 720,
      syllabus: '',
      questionPaperUrl: '',
      instructions: ''
    }
  });

  // Bulk Planner State
  const [bulkDuration, setBulkDuration] = useState(1); // 1 or 2 months
  const [bulkBatch, setBulkBatch] = useState('Class 11 Leader');
  const [bulkGcUrl, setBulkGcUrl] = useState('https://meet.google.com/rp-live-class');

  const monthString = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

  const loadData = async () => {
    setLoading(true);
    const res = await adminApi.getLiveClasses({
      stream: activeStream,
      month: monthString,
      targetBatch: batchFilter === 'ALL' ? undefined : batchFilter
    });
    setLoading(false);
    if (res.data) {
      setClasses(res.data);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeStream, selectedYear, selectedMonth, batchFilter]);

  // Navigate months
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear(selectedYear - 1);
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear(selectedYear + 1);
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  // Open Add Single Slot
  const handleOpenAdd = (dateStr = null) => {
    setEditingItem(null);
    const targetDate = dateStr || `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-15`;
    const d = new Date(targetDate + 'T00:00:00Z');
    const dayName = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });

    setFormData({
      title: '',
      subject: activeStream === 'NEET' ? 'Biology' : 'Mathematics',
      stream: activeStream,
      targetBatch: activeStream === 'NEET' ? 'Class 11 Leader NEET' : 'Super 30 IIT-JEE',
      facultyName: DEFAULT_FACULTIES[activeStream][0] || 'Rankers Faculty Team',
      date: targetDate,
      startTime: '09:00 AM',
      endTime: '10:30 AM',
      dayOfWeek: dayName,
      chapter: '',
      syllabus: '',
      classMode: 'HYBRID',
      gcUrl: 'https://meet.google.com/rp-live-class',
      teacherMessage: '',
      status: 'SCHEDULED',
      hasTest: false,
      testDetails: {
        testTitle: `${activeStream} Weekly Assessment Test`,
        testType: 'Weekly Unit Test',
        testTiming: activeStream === 'NEET' ? '02:00 PM - 05:20 PM' : '09:00 AM - 12:00 PM',
        totalMarks: activeStream === 'NEET' ? 720 : 300,
        syllabus: '',
        questionPaperUrl: '',
        instructions: 'Attempt all sections. Negative marking applicable.'
      }
    });
    setIsEditModalOpen(true);
  };

  // Open Edit Slot
  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      subject: item.subject || (activeStream === 'NEET' ? 'Biology' : 'Mathematics'),
      stream: item.stream || activeStream,
      targetBatch: item.targetBatch || 'All Batches',
      facultyName: item.facultyName || 'Rankers Faculty Team',
      date: item.date || `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-01`,
      startTime: item.startTime || '09:00 AM',
      endTime: item.endTime || '10:30 AM',
      dayOfWeek: item.dayOfWeek || 'Monday',
      chapter: item.chapter || '',
      syllabus: item.syllabus || '',
      classMode: item.classMode || 'HYBRID',
      gcUrl: item.gcUrl || '',
      teacherMessage: item.teacherMessage || '',
      status: item.status || 'SCHEDULED',
      hasTest: Boolean(item.hasTest),
      testDetails: item.testDetails || {
        testTitle: `${item.stream || activeStream} Assessment Test`,
        testType: 'Weekly Unit Test',
        testTiming: '02:00 PM - 05:20 PM',
        totalMarks: 720,
        syllabus: '',
        questionPaperUrl: '',
        instructions: ''
      }
    });
    setIsEditModalOpen(true);
  };

  // Save single class or test slot
  const handleSaveSlot = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.date || !formData.startTime) {
      alert('Please fill in Subject, Date, and Start Time.');
      return;
    }

    const payload = {
      ...formData,
      title: formData.title.trim() || `${formData.subject}: ${formData.chapter || 'Lecture'}`
    };

    if (editingItem) {
      const res = await adminApi.updateLiveClass(editingItem.id, payload);
      if (res.success) {
        setIsEditModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Failed to update schedule');
      }
    } else {
      const res = await adminApi.createLiveClass(payload);
      if (res.success) {
        setIsEditModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Failed to schedule class');
      }
    }
  };

  // Delete slot
  const handleDeleteSlot = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    const res = await adminApi.deleteLiveClass(id);
    if (res.success) {
      loadData();
    } else {
      alert(res.message || 'Failed to delete');
    }
  };

  // Execute Bulk Planning (1 or 2 months)
  const handleExecuteBulkPlan = async () => {
    const defaultTemplate = activeStream === 'NEET' ? [
      { dayOfWeek: 'Monday', subject: 'Biology', facultyName: 'Dr. Rajesh Sharma (Ex-HOD Biology)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Genetics & Molecular Inheritance' },
      { dayOfWeek: 'Tuesday', subject: 'Physics', facultyName: 'Er. Arvind Gupta (IIT Delhi Alum - Physics)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Kinematics & Dynamics' },
      { dayOfWeek: 'Wednesday', subject: 'Chemistry', facultyName: 'Dr. S. K. Verma (Kota Veteran - Chemistry)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Chemical Thermodynamics' },
      { dayOfWeek: 'Thursday', subject: 'Biology', facultyName: 'Dr. Rajesh Sharma (Ex-HOD Biology)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Human Physiology & Coordination' },
      { dayOfWeek: 'Friday', subject: 'Physics', facultyName: 'Er. Arvind Gupta (IIT Delhi Alum - Physics)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Rotational Motion & Inertia' },
      { dayOfWeek: 'Saturday', subject: 'Chemistry', facultyName: 'Dr. Sandeep Patidar (Doctorate Chem)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Organic Reaction Mechanisms' },
      {
        dayOfWeek: 'Sunday',
        subject: 'Full Syllabus Test',
        facultyName: 'Dr. Rajesh Sharma & Team',
        startTime: '02:00 PM',
        endTime: '05:20 PM',
        chapter: 'Consolidated Weekly Assessment',
        hasTest: true,
        testDetails: {
          testTitle: 'NEET All-India Weekly Unit Test',
          testType: 'Weekly Unit Test',
          testTiming: '02:00 PM - 05:20 PM',
          totalMarks: 720,
          syllabus: 'Weekly Topics in Bio, Phy & Chem covered in preceding 6 days',
          questionPaperUrl: '/uploads/materials/sample-document.pdf',
          instructions: '+4 for correct, -1 for wrong response. 200 minutes total duration.'
        }
      }
    ] : [
      { dayOfWeek: 'Monday', subject: 'Mathematics', facultyName: 'Er. Bhaskar Patel (Kota Senior Mentor - Maths)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Calculus & Definite Integration' },
      { dayOfWeek: 'Tuesday', subject: 'Physics', facultyName: 'Er. Arvind Gupta (IIT Delhi Alum - Physics)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Mechanics & Rotational Dynamics' },
      { dayOfWeek: 'Wednesday', subject: 'Chemistry', facultyName: 'Dr. S. K. Verma (Kota Veteran - Chemistry)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Chemical Kinetics & Equilibrium' },
      { dayOfWeek: 'Thursday', subject: 'Mathematics', facultyName: 'Er. Abhishek Sir (Ex-Kota - Maths)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Vectors & 3D Geometry' },
      { dayOfWeek: 'Friday', subject: 'Physics', facultyName: 'Er. Arvind Gupta (IIT Delhi Alum - Physics)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Electrostatics & Current Electricity' },
      { dayOfWeek: 'Saturday', subject: 'Chemistry', facultyName: 'Dr. Sandeep Patidar (Doctorate Chem)', startTime: '09:00 AM', endTime: '10:30 AM', chapter: 'Coordination Chemistry & Solid State' },
      {
        dayOfWeek: 'Sunday',
        subject: 'JEE Mock Exam',
        facultyName: 'Er. Arvind Gupta & Team',
        startTime: '09:00 AM',
        endTime: '12:00 PM',
        chapter: 'Consolidated Weekly CBT Assessment',
        hasTest: true,
        testDetails: {
          testTitle: 'JEE Advanced Full Weekly Mock Test',
          testType: 'Part Syllabus Test',
          testTiming: '09:00 AM - 12:00 PM',
          totalMarks: 300,
          syllabus: 'Combined Maths, Physics and Chemistry topics of the week',
          questionPaperUrl: '/uploads/materials/sample-document.pdf',
          instructions: 'Single choice, multi-correct, and integer value questions.'
        }
      }
    ];

    const payload = {
      stream: activeStream,
      targetBatch: bulkBatch,
      year: selectedYear,
      startMonth: selectedMonth,
      durationMonths: bulkDuration,
      weeklyTemplate: defaultTemplate,
      gcUrl: bulkGcUrl
    };

    setLoading(true);
    const res = await adminApi.bulkPlanLiveClasses(payload);
    setLoading(false);

    if (res.success) {
      alert(`Success! Generated ${res.count} class and test slots for ${bulkDuration} month(s).`);
      setIsBulkModalOpen(false);
      loadData();
    } else {
      alert(res.message || 'Failed to bulk generate');
    }
  };

  // Helper: Get days in current selected month
  const daysInCurrentMonth = new Date(selectedYear, selectedMonth, 0).getDate();
  const firstDayOfWeekIdx = new Date(selectedYear, selectedMonth - 1, 1).getDay(); // 0 = Sun

  // Group classes by date
  const classesByDate = {};
  classes.forEach(c => {
    if (c.date) {
      if (!classesByDate[c.date]) classesByDate[c.date] = [];
      classesByDate[c.date].push(c);
    }
  });

  // Helper badge color
  const getSubjectBadge = (subject) => {
    const s = (subject || '').toLowerCase();
    if (s.includes('bio')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (s.includes('phy')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (s.includes('chem')) return 'bg-amber-100 text-amber-800 border-amber-200';
    if (s.includes('math')) return 'bg-cyan-100 text-cyan-800 border-cyan-200';
    return 'bg-purple-100 text-purple-800 border-purple-200';
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Designer Controls */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-brand-navy text-brand-yellow shadow-inner">
              <CalendarCheck2 className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-black text-brand-navy">
                  Academic Calendar &amp; Class Schedule Designer
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow text-brand-navy text-[10px] font-black uppercase tracking-wider">
                  MONTHLY PLANNER
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Design 1-Month or 2-Months class calendars for <strong className="text-brand-navy">{activeStream}</strong>, schedule daily chapters, faculty, Google Classroom / Meet links, and insert weekly tests.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-brand-yellow text-brand-navy rounded-xl font-black text-xs uppercase tracking-wider shadow hover:brightness-105 transition flex items-center gap-1.5"
          >
            <Zap className="w-4 h-4" />
            <span>⚡ Bulk Plan 1–2 Months</span>
          </button>

          <button
            onClick={() => handleOpenAdd()}
            className="px-4 py-2.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl font-black text-xs uppercase tracking-wider shadow transition flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Single Slot</span>
          </button>

          <button
            onClick={loadData}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition"
            title="Refresh schedule"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stream Tabs & Month Navigator Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Stream Switcher (NEET vs JEE) */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveStream('NEET')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center gap-2 ${
              activeStream === 'NEET'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>NEET-UG Medical</span>
          </button>

          <button
            onClick={() => setActiveStream('JEE')}
            className={`px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition flex items-center gap-2 ${
              activeStream === 'JEE'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>IIT-JEE Engineering</span>
          </button>
        </div>

        {/* Month Navigator */}
        <div className="flex items-center gap-3 justify-center">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center min-w-[170px]">
            <h3 className="text-base font-black text-brand-navy">
              {MONTHS_LIST.find(m => m.value === selectedMonth)?.name} {selectedYear}
            </h3>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {classes.length} Slots Scheduled &bull; {classes.filter(c => c.hasTest).length} Tests
            </span>
          </div>

          <button
            onClick={handleNextMonth}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher: Calendar vs Agenda */}
        <div className="flex items-center gap-2 justify-end">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'calendar' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Month Grid
            </button>
            <button
              onClick={() => setViewMode('agenda')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewMode === 'agenda' ? 'bg-white text-brand-navy shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Agenda
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* VIEW MODE 1: INTERACTIVE MONTH CALENDAR GRID */}
      {/* ============================================================== */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Day of Week Header */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-3 text-xs font-black text-slate-600 uppercase tracking-wider">
            <span className="text-rose-600">Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Calendar Day Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100">
            {/* Empty prefix cells before 1st of month */}
            {Array.from({ length: firstDayOfWeekIdx }).map((_, idx) => (
              <div key={`empty-${idx}`} className="bg-slate-50/50 min-h-[130px] p-2" />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInCurrentMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const dateString = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
              const daySlots = classesByDate[dateString] || [];
              const isToday = new Date().toISOString().split('T')[0] === dateString;
              const hasTestOnDay = daySlots.some(s => s.hasTest);

              return (
                <div
                  key={dateString}
                  className={`min-h-[130px] p-2 flex flex-col justify-between group transition hover:bg-slate-50/80 ${
                    isToday ? 'bg-amber-50/40 ring-1 ring-brand-yellow/50' : 'bg-white'
                  }`}
                >
                  {/* Date Header */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${
                        isToday
                          ? 'bg-brand-yellow text-brand-navy shadow-xs'
                          : hasTestOnDay
                          ? 'bg-rose-500 text-white font-black'
                          : 'text-slate-700'
                      }`}
                    >
                      {dayNum}
                    </span>

                    <button
                      onClick={() => handleOpenAdd(dateString)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-brand-navy rounded-lg hover:bg-slate-200 transition"
                      title={`Add slot on ${dateString}`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Day Slots */}
                  <div className="space-y-1.5 flex-1 overflow-y-auto max-h-[140px] pr-0.5">
                    {daySlots.map(slot => (
                      <div
                        key={slot.id}
                        onClick={() => handleOpenEdit(slot)}
                        className={`p-2 rounded-xl border text-[11px] cursor-pointer transition hover:scale-[1.02] shadow-2xs ${
                          slot.hasTest
                            ? 'bg-gradient-to-r from-rose-50 to-amber-50 border-rose-300 text-rose-950 ring-1 ring-rose-400/40'
                            : 'bg-white border-slate-200 hover:border-brand-navy/30'
                        }`}
                      >
                        {/* Test Badge or Subject Badge */}
                        <div className="flex items-center justify-between gap-1 mb-1">
                          {slot.hasTest ? (
                            <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white font-black text-[9px] uppercase tracking-wider flex items-center gap-1">
                              <Award className="w-2.5 h-2.5" />
                              <span>TEST</span>
                            </span>
                          ) : (
                            <span className={`px-1.5 py-0.2 rounded font-black text-[9px] uppercase border ${getSubjectBadge(slot.subject)}`}>
                              {slot.subject}
                            </span>
                          )}

                          <span className="text-[10px] text-slate-500 font-bold whitespace-nowrap">
                            {slot.startTime}
                          </span>
                        </div>

                        {/* Title & Chapter snippet */}
                        <p className="font-bold text-slate-900 line-clamp-1 text-[11px]">
                          {slot.hasTest ? slot.testDetails?.testTitle || slot.title : slot.chapter || slot.title}
                        </p>

                        <p className="text-[10px] text-slate-500 line-clamp-1">
                          {slot.facultyName.split('(')[0].trim()}
                        </p>
                      </div>
                    ))}

                    {daySlots.length === 0 && (
                      <div className="h-full flex items-center justify-center text-[10px] text-slate-300 italic">
                        No class
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VIEW MODE 2: CHRONOLOGICAL DAILY AGENDA LIST */}
      {/* ============================================================== */}
      {viewMode === 'agenda' && (
        <div className="space-y-4">
          {classes.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No classes scheduled for {MONTHS_LIST.find(m => m.value === selectedMonth)?.name}</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4">Use the "⚡ Bulk Plan 1–2 Months" wizard to generate schedule in seconds.</p>
              <button
                onClick={() => setIsBulkModalOpen(true)}
                className="px-5 py-2.5 bg-brand-navy text-brand-yellow font-black text-xs uppercase tracking-wider rounded-xl shadow"
              >
                Plan Month Now
              </button>
            </div>
          ) : (
            classes.map(slot => (
              <div
                key={slot.id}
                className={`bg-white rounded-3xl p-5 border shadow-xs transition hover:shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  slot.hasTest ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
                }`}
              >
                {/* Left: Date & Time Info */}
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 text-center font-black ${
                    slot.hasTest ? 'bg-rose-600 text-white shadow-md' : 'bg-brand-navy text-white shadow-inner'
                  }`}>
                    <span className="text-[10px] uppercase">{slot.dayOfWeek?.slice(0, 3)}</span>
                    <span className="text-lg leading-none mt-0.5">{slot.date ? slot.date.split('-')[2] : '01'}</span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${getSubjectBadge(slot.subject)}`}>
                        {slot.subject}
                      </span>
                      {slot.hasTest && (
                        <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider">
                          OFFICIAL TEST ({slot.testDetails?.totalMarks || 720} MARKS)
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {slot.targetBatch}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>

                    <h4 className="text-base font-extrabold text-slate-900">
                      {slot.hasTest ? slot.testDetails?.testTitle || slot.title : slot.title}
                    </h4>

                    {slot.chapter && (
                      <p className="text-xs text-brand-navy font-semibold mt-0.5">
                        Chapter/Topic: <span className="font-normal text-slate-700">{slot.chapter}</span>
                      </p>
                    )}

                    <p className="text-xs text-slate-500 mt-0.5">
                      Faculty: <strong className="text-slate-800">{slot.facultyName}</strong>
                    </p>

                    {slot.hasTest && slot.testDetails?.syllabus && (
                      <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                        <strong>Test Syllabus:</strong> {slot.testDetails.syllabus}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Meeting Link & Actions */}
                <div className="flex items-center gap-2 self-end md:self-center flex-shrink-0">
                  {slot.gcUrl && (
                    <a
                      href={slot.gcUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition flex items-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Classroom GC</span>
                    </a>
                  )}

                  <button
                    onClick={() => handleOpenEdit(slot)}
                    className="p-2 rounded-xl text-slate-500 hover:text-brand-navy hover:bg-slate-100 transition"
                    title="Edit Class / Test"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteSlot(slot.id, slot.title)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete Class Slot"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: SINGLE CLASS / TEST SLOT EDITOR */}
      {/* ============================================================== */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[92vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-extrabold text-brand-navy">
                  {editingItem ? 'Edit Day Class & Test Schedule' : 'Schedule New Class / Test Slot'}
                </h3>
                <p className="text-xs text-slate-500">
                  Configure daily subject, chapter, teacher, Google Classroom link &amp; test details.
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="space-y-4 text-xs font-semibold text-slate-700">
              
              {/* Row 1: Date & Day of Week */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Class Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      const d = new Date(newDate + 'T00:00:00Z');
                      const dayName = d.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
                      setFormData({ ...formData, date: newDate, dayOfWeek: dayName });
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Day of Week</label>
                  <input
                    type="text"
                    disabled
                    value={formData.dayOfWeek}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 font-bold"
                  />
                </div>
              </div>

              {/* Row 2: Subject & Stream */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    {activeStream === 'NEET' ? (
                      <>
                        <option value="Biology">Biology (Botany &amp; Zoology)</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Full Syllabus Test">Full Syllabus (Test Day)</option>
                      </>
                    ) : (
                      <>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Full Pattern Test">Full Pattern (Test Day)</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Target Stream</label>
                  <input
                    type="text"
                    disabled
                    value={activeStream === 'NEET' ? 'NEET-UG (Medical)' : 'IIT-JEE (Engineering)'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-700"
                  />
                </div>
              </div>

              {/* Row 3: Faculty Name & Target Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Faculty Name *</label>
                  <select
                    value={formData.facultyName}
                    onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    {(DEFAULT_FACULTIES[activeStream] || []).map((f, i) => (
                      <option key={i} value={f}>{f}</option>
                    ))}
                    <option value="Rankers Faculty Team">Rankers Path Faculty Team</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Target Batch</label>
                  <input
                    type="text"
                    value={formData.targetBatch}
                    onChange={(e) => setFormData({ ...formData, targetBatch: e.target.value })}
                    placeholder="e.g. Class 11 Leader, Super 30"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 4: Chapter / Daily Topics */}
              <div>
                <label className="block mb-1 text-slate-900 font-bold">Daily Chapter / Topics Taught *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotational Dynamics - Moment of Inertia of Rigid Bodies"
                  value={formData.chapter}
                  onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow"
                />
              </div>

              {/* Row 5: Timings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Start Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 09:00 AM"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">End Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:30 AM"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Row 6: Google Classroom / Live Link & Class Mode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Google Classroom / Meet ("जीसी") Link</label>
                  <input
                    type="url"
                    placeholder="https://meet.google.com/xxx-yyyy-zzz"
                    value={formData.gcUrl}
                    onChange={(e) => setFormData({ ...formData, gcUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Class Mode</label>
                  <select
                    value={formData.classMode}
                    onChange={(e) => setFormData({ ...formData, classMode: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="HYBRID">Hybrid (Classroom + Live Online)</option>
                    <option value="CLASSROOM">Offline Classroom Only (Vijay Nagar)</option>
                    <option value="ONLINE_LIVE">Online Live Only</option>
                  </select>
                </div>
              </div>

              {/* Row 7: Teacher Notice / Message */}
              <div>
                <label className="block mb-1 text-slate-900 font-bold">Teacher Message / Notice for Students</label>
                <input
                  type="text"
                  placeholder="e.g. Bring NCERT Part-1 textbook. Today we solve 10 previous year questions."
                  value={formData.teacherMessage}
                  onChange={(e) => setFormData({ ...formData, teacherMessage: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              {/* ======================================================= */}
              {/* TEST SCHEDULER SECTION */}
              {/* ======================================================= */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-2.5">
                    <Award className="w-5 h-5 text-rose-600" />
                    <div>
                      <h4 className="font-bold text-rose-950 text-xs">Schedule a Test on this Date</h4>
                      <p className="text-[11px] text-rose-700">Add an official Unit Test, Mock Exam or Part Test with syllabus and question paper.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.hasTest}
                    onChange={(e) => setFormData({ ...formData, hasTest: e.target.checked })}
                    className="w-5 h-5 accent-rose-600 cursor-pointer rounded"
                  />
                </div>

                {formData.hasTest && (
                  <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 animate-in fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1 text-slate-900 font-bold">Test Title *</label>
                        <input
                          type="text"
                          required={formData.hasTest}
                          placeholder="e.g. NEET Weekly Unit Test #03"
                          value={formData.testDetails?.testTitle || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            testDetails: { ...formData.testDetails, testTitle: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-slate-900 font-bold">Test Type</label>
                        <select
                          value={formData.testDetails?.testType || 'Weekly Unit Test'}
                          onChange={(e) => setFormData({
                            ...formData,
                            testDetails: { ...formData.testDetails, testType: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                        >
                          <option value="Weekly Unit Test">Weekly Unit Test</option>
                          <option value="Part Syllabus Test">Part Syllabus Test</option>
                          <option value="Full Mock CBT">Full Syllabus Mock CBT</option>
                          <option value="Daily Practice Quiz">Daily Practice Quiz</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block mb-1 text-slate-900 font-bold">Total Marks</label>
                        <input
                          type="number"
                          value={formData.testDetails?.totalMarks || 720}
                          onChange={(e) => setFormData({
                            ...formData,
                            testDetails: { ...formData.testDetails, totalMarks: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block mb-1 text-slate-900 font-bold">Question Paper / PDF URL</label>
                        <input
                          type="text"
                          placeholder="e.g. /uploads/materials/test-paper-03.pdf"
                          value={formData.testDetails?.questionPaperUrl || ''}
                          onChange={(e) => setFormData({
                            ...formData,
                            testDetails: { ...formData.testDetails, questionPaperUrl: e.target.value }
                          })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1 text-slate-900 font-bold">Test Syllabus Covered</label>
                      <textarea
                        rows="2"
                        placeholder="e.g. Biology: Ch 4-6 | Physics: Rotational Motion | Chemistry: Thermodynamics"
                        value={formData.testDetails?.syllabus || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          testDetails: { ...formData.testDetails, syllabus: e.target.value }
                        })}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-extrabold shadow transition"
                >
                  {editingItem ? 'Save Changes' : 'Schedule Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: BULK 1-MONTH / 2-MONTHS PLANNER WIZARD */}
      {/* ============================================================== */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                  <Zap className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-xl font-extrabold text-brand-navy">
                    ⚡ Bulk Plan Academic Calendar
                  </h3>
                  <p className="text-xs text-slate-500">
                    Auto-generate daily lectures &amp; Sunday tests for 1 or 2 months in 1 click.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold text-slate-700">
              {/* Planning Duration */}
              <div>
                <label className="block mb-1.5 text-slate-900 font-bold">Planning Horizon</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setBulkDuration(1)}
                    className={`py-3 px-4 rounded-xl border text-center font-black transition ${
                      bulkDuration === 1
                        ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    1 Month Horizon ({MONTHS_LIST.find(m => m.value === selectedMonth)?.name})
                  </button>
                  <button
                    type="button"
                    onClick={() => setBulkDuration(2)}
                    className={`py-3 px-4 rounded-xl border text-center font-black transition ${
                      bulkDuration === 2
                        ? 'border-brand-navy bg-brand-navy text-brand-yellow shadow'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    2 Months Horizon (Consecutive)
                  </button>
                </div>
              </div>

              {/* Stream & Batch Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Target Stream</label>
                  <input
                    type="text"
                    disabled
                    value={activeStream === 'NEET' ? 'NEET-UG (Medical)' : 'IIT-JEE (Engineering)'}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 font-bold text-slate-700"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Target Batch</label>
                  <input
                    type="text"
                    value={bulkBatch}
                    onChange={(e) => setBulkBatch(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Google Classroom Default Link */}
              <div>
                <label className="block mb-1 text-slate-900 font-bold">Default Google Classroom ("जीसी") Live Link</label>
                <input
                  type="url"
                  value={bulkGcUrl}
                  onChange={(e) => setBulkGcUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
              </div>

              {/* Preview Blueprint */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-600 space-y-1.5">
                <span className="font-bold text-slate-900 block text-xs">Standard Weekly Blueprint:</span>
                <p className="text-[11px]">&bull; Mon to Sat: 6 daily subject lectures with faculty and chapter sequence.</p>
                <p className="text-[11px]">&bull; Sunday: Scheduled Assessment Test ({activeStream === 'NEET' ? '720 Marks' : '300 Marks'}) with syllabus.</p>
                <p className="text-[11px]">&bull; Total slots generated: ~{bulkDuration * 30} slots across calendar dates.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteBulkPlan}
                  className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-extrabold shadow transition flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Generate Full Calendar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
