import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Award,
  RotateCcw,
  Send,
  Sparkles,
  HelpCircle,
  Bookmark,
  Delete,
  CheckSquare,
  BarChart2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function CbtExamModal({ isOpen, onClose, user, initialTestId = null }) {
  const [examState, setExamState] = useState('INTRO'); // INTRO, IN_EXAM, RESULT
  const [testInfo, setTestInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [activeSubject, setActiveSubject] = useState('ALL');
  const [activeSection, setActiveSection] = useState('ALL');
  const [answers, setAnswers] = useState({}); // qId -> { selectedOption, selectedOptions, numericAnswer, status }
  const [timeLeft, setTimeLeft] = useState(180 * 60);
  const [submissionId, setSubmissionId] = useState(null);
  const [violations, setViolations] = useState(0);
  const [violationAlert, setViolationAlert] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [detailedSolutions, setDetailedSolutions] = useState([]);
  const [showSolutions, setShowSolutions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sectionCapWarning, setSectionCapWarning] = useState(null);

  // Available tests for selector in INTRO state
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(initialTestId || 'test-neet-mock-01');

  useEffect(() => {
    if (isOpen) {
      const studentStream = user?.targetStream || 'ALL';
      let queryCategory = 'ALL';
      if (initialTestId === 'test-rsat-scholarship' || (initialTestId && initialTestId.includes('rsat'))) {
        queryCategory = 'RSAT';
      } else if (initialTestId && initialTestId.includes('rankex')) {
        queryCategory = 'RANKEX';
      } else if (initialTestId) {
        queryCategory = 'STUDENT_TEST_SERIES';
      }

      api.getAvailableExams({
        category: queryCategory,
        stream: queryCategory === 'STUDENT_TEST_SERIES' ? studentStream : 'ALL'
      }).then(res => {
        if (res.data && res.data.length > 0) {
          setAvailableTests(res.data);
          if (initialTestId && res.data.some(t => t.id === initialTestId)) {
            setSelectedTestId(initialTestId);
          } else if (initialTestId) {
            setSelectedTestId(initialTestId);
          } else if (res.data[0]) {
            setSelectedTestId(res.data[0].id);
          }
        }
      });
    } else {
      // Reset on close
      setExamState('INTRO');
      setQuestions([]);
      setCurrentIdx(0);
      setAnswers({});
      setResultData(null);
      setDetailedSolutions([]);
      setShowSolutions(false);
      setViolations(0);
    }
  }, [isOpen, initialTestId, user]);

  // Current selected test metadata
  const currentTestMeta = useMemo(() => {
    return availableTests.find(t => t.id === selectedTestId) || availableTests[0] || {
      title: 'Rankers Path All-India CBT Mock Test',
      examType: 'NEET',
      durationMinutes: 200,
      totalMarks: 720,
      subjects: ['Physics', 'Chemistry', 'Botany', 'Zoology']
    };
  }, [availableTests, selectedTestId]);

  // Start Exam Session
  const handleStartExam = async () => {
    setLoading(true);
    const res = await api.startExam({ testId: selectedTestId });
    setLoading(false);

    if (res.success && res.data) {
      setTestInfo(res.data.testInfo || currentTestMeta);
      setQuestions(res.data.questions || []);
      setSubmissionId(res.data.submissionId);
      setAnswers(res.data.savedAnswers || {});
      const durationMins = res.data.durationMinutes || currentTestMeta.durationMinutes || 180;
      setTimeLeft(durationMins * 60);
      setCurrentIdx(0);

      // Set initial active subject and section
      if (res.data.questions && res.data.questions.length > 0) {
        setActiveSubject(res.data.questions[0].subject || 'ALL');
        setActiveSection(res.data.questions[0].section || 'ALL');
      }

      setExamState('IN_EXAM');
    }
  };

  // Timer countdown
  useEffect(() => {
    if (examState !== 'IN_EXAM') return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examState]);

  // Anti-cheat tab switch detector
  useEffect(() => {
    if (examState !== 'IN_EXAM') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(v => {
          const nextV = v + 1;
          setViolationAlert(true);
          if (submissionId) {
            api.reportViolation(submissionId);
          }
          if (nextV >= 3) {
            handleSubmitExam();
          }
          return nextV;
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [examState, submissionId]);

  const currentQ = questions[currentIdx];

  // Subjects and Sections extracted dynamically
  const subjectsList = testInfo?.subjects || ['Physics', 'Chemistry', 'Mathematics'];
  const sectionsList = useMemo(() => {
    const set = new Set();
    questions.forEach(q => {
      if (q.section) set.add(q.section);
    });
    return Array.from(set);
  }, [questions]);

  // Check attempt counts in current question's section
  const sectionAttemptStats = useMemo(() => {
    if (!currentQ || !currentQ.section) return { attempted: 0, maxAllowed: 99 };
    const secName = currentQ.section;
    const subjName = currentQ.subject;

    // Filter questions in this subject and section
    const qInSec = questions.filter(q => q.subject === subjName && q.section === secName);
    let attempted = 0;
    qInSec.forEach(q => {
      const a = answers[q.id];
      if (
        a &&
        (a.selectedOption !== null && a.selectedOption !== undefined ||
         (Array.isArray(a.selectedOptions) && a.selectedOptions.length > 0) ||
         (a.numericAnswer !== null && a.numericAnswer !== undefined && a.numericAnswer !== ''))
      ) {
        attempted += 1;
      }
    });

    let maxAllowed = qInSec.length;
    if (secName === 'Section B') {
      if (testInfo?.examType === 'JEE_MAIN') maxAllowed = 5;
      if (testInfo?.examType === 'NEET') maxAllowed = 10;
    }

    return { attempted, maxAllowed, isSecB: secName === 'Section B' };
  }, [currentQ, questions, answers, testInfo]);

  // Handlers for Answers
  const handleSelectOption = (optIdx) => {
    if (!currentQ) return;
    const isAlreadyAttempted = answers[currentQ.id]?.selectedOption !== undefined && answers[currentQ.id]?.selectedOption !== null;

    if (!isAlreadyAttempted && sectionAttemptStats.isSecB && sectionAttemptStats.attempted >= sectionAttemptStats.maxAllowed) {
      setSectionCapWarning(`You have already attempted the maximum allowed ${sectionAttemptStats.maxAllowed} questions in ${currentQ.section}. Clear response on another question to attempt this one.`);
      return;
    }
    setSectionCapWarning(null);

    const updated = {
      ...answers,
      [currentQ.id]: {
        selectedOption: optIdx,
        status: 'ANSWERED'
      }
    };
    setAnswers(updated);

    api.saveAnswer({
      submissionId,
      questionId: currentQ.id,
      selectedOption: optIdx,
      status: 'ANSWERED'
    });
  };

  const handleToggleMultiOption = (optIdx) => {
    if (!currentQ) return;
    const current = answers[currentQ.id]?.selectedOptions || [];
    let nextOptions;
    if (current.includes(optIdx)) {
      nextOptions = current.filter(i => i !== optIdx);
    } else {
      nextOptions = [...current, optIdx].sort();
    }

    const updated = {
      ...answers,
      [currentQ.id]: {
        selectedOptions: nextOptions,
        status: nextOptions.length > 0 ? 'ANSWERED' : 'NOT_ANSWERED'
      }
    };
    setAnswers(updated);

    api.saveAnswer({
      submissionId,
      questionId: currentQ.id,
      selectedOptions: nextOptions,
      status: nextOptions.length > 0 ? 'ANSWERED' : 'NOT_ANSWERED'
    });
  };

  const handleNumericInput = (val) => {
    if (!currentQ) return;
    const currentVal = answers[currentQ.id]?.numericAnswer || '';
    let nextVal = currentVal;

    if (val === 'CLEAR') {
      nextVal = '';
    } else if (val === 'BACKSPACE') {
      nextVal = currentVal.slice(0, -1);
    } else if (val === '.') {
      if (!currentVal.includes('.')) nextVal = currentVal + '.';
    } else if (val === '-') {
      if (currentVal.startsWith('-')) nextVal = currentVal.slice(1);
      else nextVal = '-' + currentVal;
    } else {
      if (currentVal.length < 8) nextVal = currentVal + val;
    }

    const isAlreadyAttempted = currentVal !== '';
    if (!isAlreadyAttempted && nextVal !== '' && sectionAttemptStats.isSecB && sectionAttemptStats.attempted >= sectionAttemptStats.maxAllowed) {
      setSectionCapWarning(`You have already attempted the maximum allowed ${sectionAttemptStats.maxAllowed} questions in ${currentQ.section}.`);
      return;
    }
    setSectionCapWarning(null);

    const updated = {
      ...answers,
      [currentQ.id]: {
        numericAnswer: nextVal,
        status: nextVal !== '' ? 'ANSWERED' : 'NOT_ANSWERED'
      }
    };
    setAnswers(updated);

    api.saveAnswer({
      submissionId,
      questionId: currentQ.id,
      numericAnswer: nextVal,
      status: nextVal !== '' ? 'ANSWERED' : 'NOT_ANSWERED'
    });
  };

  const handleDirectNumericChange = (e) => {
    if (!currentQ) return;
    const raw = e.target.value;
    if (!/^-?\d*\.?\d*$/.test(raw)) return;
    if (raw.length > 8) return;

    const currentVal = answers[currentQ.id]?.numericAnswer || '';
    const isAlreadyAttempted = currentVal !== '';
    if (!isAlreadyAttempted && raw !== '' && sectionAttemptStats.isSecB && sectionAttemptStats.attempted >= sectionAttemptStats.maxAllowed) {
      setSectionCapWarning(`You have already attempted the maximum allowed ${sectionAttemptStats.maxAllowed} questions in ${currentQ.section}.`);
      return;
    }
    setSectionCapWarning(null);

    const updated = {
      ...answers,
      [currentQ.id]: {
        numericAnswer: raw,
        status: raw !== '' ? 'ANSWERED' : 'NOT_ANSWERED'
      }
    };
    setAnswers(updated);

    api.saveAnswer({
      submissionId,
      questionId: currentQ.id,
      numericAnswer: raw,
      status: raw !== '' ? 'ANSWERED' : 'NOT_ANSWERED'
    });
  };

  const handleSaveAndNext = () => {
    setSectionCapWarning(null);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleMarkForReview = () => {
    setSectionCapWarning(null);
    if (!currentQ) return;
    const currentAns = answers[currentQ.id] || {};
    const updated = {
      ...answers,
      [currentQ.id]: {
        ...currentAns,
        status: 'MARKED_FOR_REVIEW'
      }
    };
    setAnswers(updated);
    api.saveAnswer({
      submissionId,
      questionId: currentQ.id,
      ...currentAns,
      status: 'MARKED_FOR_REVIEW'
    });
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleClearResponse = () => {
    setSectionCapWarning(null);
    if (!currentQ) return;
    setAnswers(prev => {
      const nextAnswers = { ...prev };
      delete nextAnswers[currentQ.id];
      return nextAnswers;
    });
    api.saveAnswer({
      submissionId,
      questionId: currentQ.id,
      selectedOption: null,
      selectedOptions: [],
      numericAnswer: null,
      status: 'NOT_ANSWERED'
    });
  };

  const handleSubmitExam = async () => {
    if (examState !== 'IN_EXAM') return;
    const confirmSub = window.confirm('Are you sure you want to finalize and submit your test paper? Your score will be computed instantly.');
    if (!confirmSub) return;

    setLoading(true);
    const res = await api.submitExam({ submissionId });
    setLoading(false);

    if (res.success && res.data) {
      setResultData(res.data);
      setExamState('RESULT');

      // Fetch solutions
      api.getSubmissionResult(res.data.id || submissionId).then(solRes => {
        if (solRes.data?.solutions) {
          setDetailedSolutions(solRes.data.solutions);
        }
      });

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const formatTime = (secs) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Question Palette status helpers
  const getQuestionStatus = (q) => {
    const ans = answers[q.id];
    if (!ans) return 'NOT_VISITED';
    const hasValue =
      ans.selectedOption !== null && ans.selectedOption !== undefined ||
      (Array.isArray(ans.selectedOptions) && ans.selectedOptions.length > 0) ||
      (ans.numericAnswer !== null && ans.numericAnswer !== undefined && ans.numericAnswer !== '');

    if (ans.status === 'MARKED_FOR_REVIEW') {
      return hasValue ? 'ANSWERED_AND_MARKED' : 'MARKED_FOR_REVIEW';
    }
    return hasValue ? 'ANSWERED' : 'NOT_ANSWERED';
  };

  const answeredCount = questions.filter(q => getQuestionStatus(q) === 'ANSWERED' || getQuestionStatus(q) === 'ANSWERED_AND_MARKED').length;
  const notAnsweredCount = questions.filter(q => getQuestionStatus(q) === 'NOT_ANSWERED').length;
  const markedCount = questions.filter(q => getQuestionStatus(q) === 'MARKED_FOR_REVIEW').length;
  const markedAnsweredCount = questions.filter(q => getQuestionStatus(q) === 'ANSWERED_AND_MARKED').length;
  const notVisitedCount = questions.length - Object.keys(answers).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#0B132B]/95 backdrop-blur-md flex flex-col p-2 sm:p-4 text-slate-800 animate-in fade-in select-none">
      
      {/* 1. TOP NTA / TCS iON CBT HEADER */}
      <header className="bg-brand-navy text-white px-4 sm:px-6 py-2.5 rounded-2xl flex items-center justify-between shadow-xl border border-brand-yellow/30 flex-shrink-0">
        
        {/* Left: Branding & Dynamic Exam Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-black text-brand-yellow text-sm border border-brand-yellow/40">
              RP
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-white tracking-wide leading-tight">
                {testInfo?.title || currentTestMeta?.title || 'Rankers Path Examination Portal'}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-brand-yellow text-brand-navy">
                  {testInfo?.examType === 'JEE_ADVANCED' ? 'TCS iON CBT Hall' : 'NTA Simulation Pattern'}
                </span>
                <span className="text-[10px] text-slate-300 font-bold hidden sm:inline">
                  Total Marks: {testInfo?.totalMarks || currentTestMeta?.totalMarks} &bull; {testInfo?.durationMinutes || currentTestMeta?.durationMinutes} Mins
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center / Right: Live Clock & Action */}
        {examState === 'IN_EXAM' && (
          <div className="flex items-center gap-3 sm:gap-6">
            <div
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-sm sm:text-base font-black shadow-inner ${
                timeLeft < 600
                  ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500'
                  : 'bg-white/10 text-brand-yellow border border-white/20'
              }`}
            >
              <Clock className="w-4 h-4 text-brand-yellow" />
              <span>{formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={loading}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition shadow-md flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Exam</span>
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
          title="Exit CBT Portal"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Tab switch violation banner */}
      {violationAlert && (
        <div className="mt-2 bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-between shadow animate-bounce">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-brand-yellow flex-shrink-0" />
            <span>
              <strong>Warning ({violations}/3):</strong> Tab switching or minimizing the test window is prohibited. Your exam will automatically submit on the 3rd infraction.
            </span>
          </div>
          <button onClick={() => setViolationAlert(false)} className="text-white hover:underline text-[11px] font-black ml-2">
            Dismiss
          </button>
        </div>
      )}

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col mt-2 sm:mt-3 overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-200">
        
        {/* ========================================================
            STATE 1: INTRO & PATTERN SELECTOR
           ======================================================== */}
        {examState === 'INTRO' && (
          <div className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-brand-yellow text-brand-navy text-xs font-black uppercase tracking-wider">
                Official Computer Based Test (CBT) Portal
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Choose Your Examination Pattern &amp; Batch Test
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
                Rankers Path offers authentic NTA and TCS iON pattern simulation for JEE Main, NEET UG, Foundation (Classes 9th &amp; 10th PNCF), and JEE Advanced. Select your test to begin:
              </p>
            </div>

            {/* Test Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {availableTests.map(t => {
                const isSelected = selectedTestId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTestId(t.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'border-brand-navy bg-brand-yellow/10 shadow-lg scale-[1.02]'
                        : 'border-slate-200 hover:border-brand-yellow/60 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                          t.examType === 'NEET' ? 'bg-emerald-100 text-emerald-800' :
                          t.examType === 'JEE_MAIN' ? 'bg-blue-100 text-blue-800' :
                          t.examType === 'FOUNDATION' ? 'bg-purple-100 text-purple-900 border border-purple-300' :
                          t.examType === 'RANKEX' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                          t.examType === 'RSAT' ? 'bg-amber-100 text-amber-950 border border-amber-300' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {t.examType === 'FOUNDATION' ? '🌱 FOUNDATION PNCF' : t.examType === 'RSAT' ? '🏆 RSAT SCHOLARSHIP' : t.examType}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">
                          {t.durationMinutes} Mins
                        </span>
                      </div>
                      <h4 className="text-sm font-extrabold text-slate-900 leading-snug">
                        {t.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {t.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800">{t.totalMarks} Marks</span>
                      <span className={`font-bold text-[11px] ${isSelected ? 'text-brand-navy underline' : 'text-slate-400'}`}>
                        {isSelected ? 'Selected ✓' : 'Click to Select'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Test Overview & Guidelines */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h4 className="text-sm font-black text-brand-navy uppercase tracking-wider">
                    {currentTestMeta.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Stream: <strong>{currentTestMeta.stream}</strong> &bull; Pattern: <strong>{currentTestMeta.examType}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-700">
                  <span>⏱ Duration: <strong>{currentTestMeta.durationMinutes} Minutes</strong></span>
                  <span>🎯 Maximum Marks: <strong>{currentTestMeta.totalMarks}</strong></span>
                </div>
              </div>

              {/* Pattern specific instruction breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <strong className="block text-brand-navy mb-1">Subjects Covered:</strong>
                  <span>{(currentTestMeta.subjects || []).join(' • ')}</span>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200">
                  <strong className="block text-brand-navy mb-1">Marking Scheme:</strong>
                  {currentTestMeta.examType === 'JEE_ADVANCED' ? (
                    <span>Single Correct (+3/-1), Multi-Correct (+4 full, partial marks, -2 incorrect), Numerical (+3/0).</span>
                  ) : currentTestMeta.examType === 'JEE_MAIN' ? (
                    <span>Section A: 20 MCQs (+4/-1). Section B: 10 Numerical with Virtual Keypad (Attempt any 5, +4/-1).</span>
                  ) : currentTestMeta.examType === 'RANKEX' ? (
                    <span>40 Questions across Physics (10), Chemistry (10), Mathematics (10), Mental Ability (10). Correct: +4, Incorrect: -1.</span>
                  ) : (
                    <span>Section A: 35 MCQs (+4/-1). Section B: 15 MCQs (Attempt any 10, +4/-1).</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                <p><strong>NTA Palette Color Legend:</strong></p>
                <div className="flex flex-wrap gap-3 pt-1 text-[11px] font-bold">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-300 inline-block"></span> Not Visited</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-rose-500 inline-block"></span> Not Answered</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span> Answered</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-purple-600 inline-block"></span> Marked for Review</span>
                </div>
              </div>
            </div>

            <div className="text-center pt-2">
              <button
                onClick={handleStartExam}
                disabled={loading}
                className="px-8 py-3.5 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-sm uppercase tracking-wider shadow-xl transition transform hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
              >
                <Sparkles className="w-4 h-4 text-brand-navy" />
                <span>{loading ? 'Preparing Exam Hall...' : 'Enter CBT Examination Hall'}</span>
              </button>
            </div>
          </div>
        )}

        {/* ========================================================
            STATE 2: ACTIVE EXAM HALL
           ======================================================== */}
        {examState === 'IN_EXAM' && currentQ && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left 70%: Question Canvas */}
            <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-slate-200 overflow-hidden">
              
              {/* Dynamic Subject & Section Header Bar */}
              <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
                {/* Subject Selector Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {subjectsList.map(subj => {
                    const isSubjActive = (currentQ.subject || 'Physics').toLowerCase() === subj.toLowerCase();
                    const subjQuestions = questions.filter(q => q.subject?.toLowerCase() === subj.toLowerCase());
                    const subjAnswered = subjQuestions.filter(q => getQuestionStatus(q) === 'ANSWERED' || getQuestionStatus(q) === 'ANSWERED_AND_MARKED').length;

                    return (
                      <button
                        key={subj}
                        onClick={() => {
                          const firstInSubj = questions.findIndex(q => q.subject?.toLowerCase() === subj.toLowerCase());
                          if (firstInSubj !== -1) setCurrentIdx(firstInSubj);
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition whitespace-nowrap flex items-center gap-1.5 ${
                          isSubjActive
                            ? 'bg-brand-navy text-white shadow'
                            : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        <span>{subj}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSubjActive ? 'bg-brand-yellow text-brand-navy' : 'bg-slate-100 text-slate-500'}`}>
                          {subjAnswered}/{subjQuestions.length}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Section Indicator & Cap Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-slate-800 px-2.5 py-1 rounded-md bg-white border border-slate-200 shadow-sm">
                    {currentQ.section || 'Section A'}
                  </span>
                  {sectionAttemptStats.isSecB && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      sectionAttemptStats.attempted >= sectionAttemptStats.maxAllowed
                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                        : 'bg-slate-200 text-slate-700'
                    }`}>
                      Attempted: <strong>{sectionAttemptStats.attempted} / {sectionAttemptStats.maxAllowed}</strong> (Max)
                    </span>
                  )}
                </div>
              </div>

              {/* Section Cap Alert */}
              {sectionCapWarning && (
                <div className="bg-amber-100 border-b border-amber-200 text-amber-900 text-xs px-4 py-2 font-bold flex items-center justify-between">
                  <span>⚠️ {sectionCapWarning}</span>
                  <button onClick={() => setSectionCapWarning(null)} className="text-xs underline font-black">
                    Close
                  </button>
                </div>
              )}

              {/* Question Text & Options Canvas */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
                
                {/* Question Info Ribbon */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-brand-navy text-white font-black text-sm flex items-center justify-center">
                      Q{currentIdx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-500">
                      of {questions.length} Questions
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Correct: +{testInfo?.examType === 'JEE_ADVANCED' ? '3 or +4' : '4'}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                      Negative: -{testInfo?.examType === 'JEE_ADVANCED' && currentQ.questionType === 'MULTI_CORRECT' ? '2' : (currentQ.questionType === 'NUMERICAL' || currentQ.questionType === 'NAT' || currentQ.questionType === 'NAT_RANGE') && testInfo?.examType === 'JEE_ADVANCED' ? '0' : '1'}
                    </span>
                  </div>
                </div>

                {/* Question Statement */}
                <div className="text-slate-900 text-sm sm:text-base font-semibold leading-relaxed whitespace-pre-line">
                  {currentQ.questionText}
                </div>

                {/* Option Inputs by Question Type */}
                <div className="space-y-3 pt-2">
                  
                  {/* TYPE 1: Single Option MCQ (NEET & JEE Main Section A) */}
                  {currentQ.questionType === 'MCQ' && (
                    <div className="space-y-2.5">
                      {currentQ.options?.map((opt, optIdx) => {
                        const isSelected = answers[currentQ.id]?.selectedOption === optIdx;
                        const optionLetters = ['A', 'B', 'C', 'D', 'E'];

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleSelectOption(optIdx)}
                            className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                              isSelected
                                ? 'border-brand-navy bg-brand-yellow/15 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs flex-shrink-0 ${
                              isSelected
                                ? 'bg-brand-navy text-white'
                                : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}>
                              {optionLetters[optIdx]}
                            </span>
                            <span className="text-xs sm:text-sm font-medium text-slate-800 pt-1 leading-snug">
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* TYPE 2: Multi-Correct Checkboxes (JEE Advanced Section 2) */}
                  {currentQ.questionType === 'MULTI_CORRECT' && (
                    <div className="space-y-3">
                      <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 font-bold flex items-center gap-2">
                        <CheckSquare className="w-4 h-4 text-blue-700" />
                        <span>One or more than one option may be correct. Partial marks awarded for correct selections without wrong choices.</span>
                      </div>
                      {currentQ.options?.map((opt, optIdx) => {
                        const isChecked = (answers[currentQ.id]?.selectedOptions || []).includes(optIdx);
                        const optionLetters = ['A', 'B', 'C', 'D', 'E'];

                        return (
                          <div
                            key={optIdx}
                            onClick={() => handleToggleMultiOption(optIdx)}
                            className={`p-3.5 rounded-xl border-2 cursor-pointer transition flex items-start gap-3 ${
                              isChecked
                                ? 'border-brand-navy bg-brand-navy/10 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border ${
                              isChecked
                                ? 'bg-brand-navy text-white border-brand-navy'
                                : 'bg-white text-transparent border-slate-300'
                            }`}>
                              ✓
                            </div>
                            <span className="font-bold text-xs text-slate-600 pt-0.5">({optionLetters[optIdx]})</span>
                            <span className="text-xs sm:text-sm font-medium text-slate-800 pt-0.5 leading-snug">
                              {opt}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* TYPE 3: Numerical Value with On-Screen Keypad (JEE Main Sec B, Range NAT & Foundation) */}
                  {(currentQ.questionType === 'NUMERICAL' || currentQ.questionType === 'NAT' || currentQ.questionType === 'NAT_RANGE') && (
                    <div className="space-y-4 max-w-sm">
                      {currentQ.questionType === 'NAT_RANGE' && (
                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 font-bold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                          <span>
                            <strong>Range Evaluation:</strong> Enter your calculated numerical value. Full marks awarded if answer falls inside acceptable range.
                          </span>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 uppercase">
                          Enter Numerical Value (Decimal or Integer):
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Type here or use keypad below"
                            value={answers[currentQ.id]?.numericAnswer || ''}
                            onChange={handleDirectNumericChange}
                            className="w-full px-4 py-3 text-lg font-mono font-black text-brand-navy bg-white border-2 border-brand-navy rounded-xl focus:ring-2 focus:ring-brand-yellow focus:outline-none shadow-sm"
                          />
                        </div>
                      </div>

                      {/* On-screen Virtual Numeric Keypad */}
                      <div className="bg-slate-100 p-3 rounded-2xl border border-slate-300 shadow-sm space-y-2">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block text-center">
                          NTA Official Virtual Keypad
                        </span>
                        <div className="grid grid-cols-3 gap-1.5">
                          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '-'].map(key => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => handleNumericInput(key)}
                              className="py-2.5 bg-white hover:bg-brand-yellow hover:text-brand-navy text-slate-800 font-extrabold rounded-lg border border-slate-200 shadow-sm transition active:scale-95"
                            >
                              {key}
                            </button>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <button
                            type="button"
                            onClick={() => handleNumericInput('BACKSPACE')}
                            className="py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs transition"
                          >
                            ⌫ Backspace
                          </button>
                          <button
                            type="button"
                            onClick={() => handleNumericInput('CLEAR')}
                            className="py-2 bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold rounded-lg text-xs transition"
                          >
                            Clear Value
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>

              {/* Bottom Control Bar */}
              <div className="bg-slate-50 border-t border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleMarkForReview}
                    className="px-3 sm:px-4 py-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>Mark for Review &amp; Next</span>
                  </button>

                  <button
                    onClick={handleClearResponse}
                    className="px-3 sm:px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition"
                  >
                    Clear Response
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
                    }}
                    disabled={currentIdx === 0}
                    className="p-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                    title="Previous Question"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={handleSaveAndNext}
                    className="px-5 py-2 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black text-xs uppercase tracking-wider shadow transition flex items-center gap-1.5"
                  >
                    <span>Save &amp; Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right 30%: Question Palette & Legend */}
            <div className="w-full lg:w-80 bg-slate-50 flex flex-col overflow-hidden max-h-56 sm:max-h-72 lg:max-h-none flex-shrink-0 lg:flex-shrink border-t lg:border-t-0">
              
              {/* Palette Legend */}
              <div className="p-3 bg-white border-b border-slate-200 grid grid-cols-2 gap-2 text-[11px] font-bold text-slate-600 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px]">
                    {answeredCount}
                  </span>
                  <span>Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-rose-500 text-white flex items-center justify-center text-[10px]">
                    {notAnsweredCount}
                  </span>
                  <span>Not Answered</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-purple-600 text-white flex items-center justify-center text-[10px]">
                    {markedCount}
                  </span>
                  <span>Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded bg-slate-300 text-slate-700 flex items-center justify-center text-[10px]">
                    {notVisitedCount}
                  </span>
                  <span>Not Visited</span>
                </div>
              </div>

              {/* Question Number Matrix */}
              <div className="flex-1 p-3 overflow-y-auto">
                <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                  Question Palette ({currentQ.subject || 'All'})
                </span>

                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {questions.map((q, qIndex) => {
                    const status = getQuestionStatus(q);
                    const isCurrent = currentIdx === qIndex;

                    let bgClass = 'bg-slate-200 text-slate-700'; // NOT_VISITED
                    if (status === 'ANSWERED') bgClass = 'bg-emerald-500 text-white';
                    else if (status === 'NOT_ANSWERED') bgClass = 'bg-rose-500 text-white';
                    else if (status === 'MARKED_FOR_REVIEW') bgClass = 'bg-purple-600 text-white';
                    else if (status === 'ANSWERED_AND_MARKED') bgClass = 'bg-purple-600 text-white ring-2 ring-emerald-400';

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentIdx(qIndex)}
                        className={`h-9 rounded-lg font-black text-xs flex items-center justify-center transition ${bgClass} ${
                          isCurrent ? 'ring-2 ring-brand-navy ring-offset-2 scale-105' : 'hover:opacity-80'
                        }`}
                      >
                        {qIndex + 1}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Submit Test Footer */}
              <div className="p-3 bg-white border-t border-slate-200 flex-shrink-0">
                <button
                  onClick={handleSubmitExam}
                  className="w-full py-2.5 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-xl font-black text-xs uppercase tracking-wider shadow transition"
                >
                  Final Exam Submission
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            STATE 3: POST-EXAM ANALYSIS & SCORECARD
           ======================================================== */}
        {examState === 'RESULT' && resultData && (
          <div className="flex-1 p-6 sm:p-10 overflow-y-auto max-w-5xl mx-auto space-y-6">
            
            {/* Scorecard Hero */}
            <div className="bg-gradient-to-r from-brand-navy via-brand-navyCard to-brand-navy text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-yellow/30 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-center md:text-left space-y-1">
                <span className="px-3 py-1 rounded-full bg-brand-yellow text-brand-navy font-black text-[10px] uppercase tracking-wider">
                  Official Scorecard &amp; All-India Rank
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  Examination Result Analysis
                </h3>
                <p className="text-xs text-slate-300">
                  {testInfo?.title || 'Rankers Path Mock Examination'} &bull; Evaluated as per NTA/TCS iON guidelines
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-center">
                  <span className="text-[10px] text-slate-300 uppercase font-bold block">Total Score</span>
                  <strong className="text-3xl sm:text-4xl font-black text-brand-yellow">
                    {resultData.score}
                    <span className="text-base text-slate-400">/{resultData.maxMarks}</span>
                  </strong>
                </div>

                <div className="text-center border-l border-white/20 pl-6">
                  <span className="text-[10px] text-slate-300 uppercase font-bold block">Percentile</span>
                  <strong className="text-3xl sm:text-4xl font-black text-emerald-400">
                    {resultData.percentile || '98.5'}%
                  </strong>
                </div>
              </div>
            </div>

            {/* If Student Test Series and Live Results are still pending Director announcement */}
            {resultData.category === 'STUDENT_TEST_SERIES' && resultData.isPublished === false && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3.5 text-amber-900 shadow-sm animate-in fade-in">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-xs space-y-1">
                  <strong className="block font-black text-amber-950 uppercase tracking-wide">
                    ⏳ Result Evaluation Under Academic Director Review
                  </strong>
                  <p className="text-amber-800 leading-relaxed">
                    Your answers have been securely recorded. The Academic Director and Faculty are currently evaluating and standardizing student batches. Official percentile ranks and question solutions will be published live on your portal shortly.
                  </p>
                </div>
              </div>
            )}

            {/* 4 Metric Pill Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <span className="text-xs text-slate-400 font-bold block">All-India / Batch Rank</span>
                <strong className="text-xl font-black text-brand-navy">
                  AIR {resultData.allIndiaRank || '14'}
                </strong>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <span className="text-xs text-emerald-600 font-bold block">Correct Answers</span>
                <strong className="text-xl font-black text-emerald-700">
                  {resultData.correctCount} Correct
                </strong>
              </div>

              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
                <span className="text-xs text-rose-600 font-bold block">Negative Penalty</span>
                <strong className="text-xl font-black text-rose-700">
                  -{resultData.totalNegativeMarks || resultData.incorrectCount || 0} Marks
                </strong>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl">
                <span className="text-xs text-amber-700 font-bold block">Scholarship Eligible</span>
                <strong className="text-xl font-black text-brand-yellowDark">
                  {resultData.scholarshipPercent || 75}% Waiver
                </strong>
              </div>
            </div>

            {/* Subject-Wise Performance Breakdown */}
            {resultData.subjectBreakdown && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-brand-navy" />
                  <span>Subject Performance Matrix</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {Object.entries(resultData.subjectBreakdown).map(([subj, stats]) => (
                    <div key={subj} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <strong className="text-sm font-black text-slate-800">{subj}</strong>
                        <span className="text-xs font-black text-brand-navy px-2 py-0.5 rounded bg-white border border-slate-200">
                          {stats.marks} Marks
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 text-[11px] text-center pt-1 border-t border-slate-200">
                        <div className="text-emerald-700 font-bold">✓ {stats.correct}</div>
                        <div className="text-rose-600 font-bold">✗ {stats.incorrect}</div>
                        <div className="text-slate-400 font-bold">○ {stats.unattempted}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Solutions Toggle & Accordion */}
            <div className="space-y-4 pt-2">
              <button
                onClick={() => setShowSolutions(!showSolutions)}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-brand-navy" />
                <span>{showSolutions ? 'Hide Question Solutions' : 'View Question-by-Question Step Solutions'}</span>
              </button>

              {showSolutions && detailedSolutions.length > 0 && (
                <div className="space-y-4 pt-2">
                  {detailedSolutions.map((sol, idx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    return (
                      <div key={sol.id} className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-black text-xs text-brand-navy px-2 py-1 rounded bg-slate-100">
                            Q{idx + 1} &bull; {sol.subject} &bull; {sol.section}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            Type: {sol.questionType}
                          </span>
                        </div>

                        <p className="text-sm font-semibold text-slate-900">{sol.questionText}</p>

                        {sol.options && sol.options.length > 0 && (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {sol.options.map((opt, oIdx) => (
                              <div
                                key={oIdx}
                                className={`p-2.5 rounded-lg border flex items-center gap-2 ${
                                  Number(sol.correctOption) === oIdx || (Array.isArray(sol.correctAnswer) && sol.correctAnswer.includes(oIdx))
                                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                                    : 'bg-slate-50 border-slate-200 text-slate-700'
                                }`}
                              >
                                <span className="font-bold">({letters[oIdx]})</span>
                                <span>{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Range NAT or Numerical Solution Display */}
                        {(sol.questionType === 'NAT_RANGE' || sol.questionType === 'NUMERICAL' || sol.questionType === 'NAT') && (
                          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              {sol.questionType === 'NAT_RANGE' ? (
                                <span className="font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-lg border border-amber-300">
                                  🎯 Acceptable Correct Range: [{sol.rangeMin} — {sol.rangeMax}]
                                </span>
                              ) : (
                                <span className="font-extrabold text-blue-900 bg-blue-100 px-3 py-1 rounded-lg border border-blue-200">
                                  🔢 Correct Numerical Value: {sol.correctAnswer || sol.correctValue}
                                </span>
                              )}

                              <span className="font-bold text-slate-700">
                                Your Entered Answer:{' '}
                                <strong className="font-mono text-brand-navy">
                                  {sol.studentResponse?.numericAnswer !== null && sol.studentResponse?.numericAnswer !== undefined && sol.studentResponse?.numericAnswer !== ''
                                    ? sol.studentResponse.numericAnswer
                                    : 'Not Attempted'}
                                </strong>
                              </span>
                            </div>
                          </div>
                        )}

                        <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900 space-y-1">
                          <strong>Faculty Solution &amp; Explanation:</strong>
                          <p className="text-slate-700 leading-relaxed">{sol.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Exit CTA */}
            <div className="text-center pt-4">
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-brand-navy text-white hover:bg-brand-navyLight rounded-xl font-bold text-xs uppercase tracking-wider transition shadow"
              >
                Close Examination Report
              </button>
            </div>

          </div>
        )}

      </main>

    </div>
  );
}
