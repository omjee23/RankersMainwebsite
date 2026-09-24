import React, { useState, useEffect } from 'react';
import { X, Clock, AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Award, RotateCcw, Send, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';

export default function CbtExamModal({ isOpen, onClose, user }) {
  const [examState, setExamState] = useState('INTRO'); // INTRO, IN_EXAM, RESULT
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // qId -> { selectedOption, status }
  const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes in seconds
  const [submissionId, setSubmissionId] = useState(null);
  const [violations, setViolations] = useState(0);
  const [violationAlert, setViolationAlert] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Initialize Exam
  const handleStartExam = async () => {
    setLoading(true);
    const res = await api.startExam();
    setLoading(false);

    if (res.success && res.data) {
      setQuestions(res.data.questions || []);
      setSubmissionId(res.data.submissionId);
      setAnswers(res.data.savedAnswers || {});
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

  if (!isOpen) return null;

  const currentQ = questions[currentIdx];

  const handleSelectOption = (optIdx) => {
    if (!currentQ) return;
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        selectedOption: optIdx,
        status: 'ANSWERED'
      }
    }));
  };

  const handleSaveAndNext = () => {
    if (currentQ) {
      const currentAns = answers[currentQ.id];
      api.saveAnswer({
        submissionId,
        questionId: currentQ.id,
        selectedOption: currentAns?.selectedOption,
        status: currentAns?.selectedOption !== undefined ? 'ANSWERED' : 'NOT_ANSWERED'
      });
    }
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleMarkForReview = () => {
    if (!currentQ) return;
    const currentAns = answers[currentQ.id];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: {
        selectedOption: currentAns?.selectedOption,
        status: 'MARKED_FOR_REVIEW'
      }
    }));
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleClearResponse = () => {
    if (!currentQ) return;
    setAnswers(prev => {
      const nextAnswers = { ...prev };
      delete nextAnswers[currentQ.id];
      return nextAnswers;
    });
  };

  const handleSubmitExam = async () => {
    setLoading(true);
    const res = await api.submitExam({ submissionId });
    setLoading(false);

    if (res.success && res.data) {
      setResultData(res.data);
      setExamState('RESULT');
      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {}
    }
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Status counters for question palette
  const answeredCount = Object.values(answers).filter(a => a.status === 'ANSWERED').length;
  const markedCount = Object.values(answers).filter(a => a.status === 'MARKED_FOR_REVIEW').length;
  const notVisitedCount = questions.length - Object.keys(answers).length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/95 backdrop-blur-md flex flex-col p-2 sm:p-4 text-slate-800 animate-in fade-in">
      
      {/* Top Bar */}
      <header className="bg-brand-navy text-white px-4 sm:px-6 py-3 rounded-2xl flex items-center justify-between shadow-lg border border-brand-yellow/30">
        <div className="flex items-center gap-3">
          <img
            src="/assets/web/logo-header.png"
            alt="Rankers Path"
            className="h-8 w-auto object-contain brightness-110"
          />
          <span className="hidden sm:inline text-xs font-bold text-brand-yellow px-2 py-0.5 rounded bg-white/10 uppercase">
            RSAT Online CBT Hall
          </span>
        </div>

        {examState === 'IN_EXAM' && (
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-base font-extrabold ${
              timeLeft < 300 ? 'bg-red-500/20 text-red-400 animate-pulse border border-red-500' : 'bg-white/10 text-brand-yellow'
            }`}>
              <Clock className="w-4 h-4" />
              <span>Time Left: {formatTime(timeLeft)}</span>
            </div>

            <button
              onClick={handleSubmitExam}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition shadow"
            >
              Submit Test
            </button>
          </div>
        )}

        <button
          onClick={onClose}
          className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Main Body */}
      <main className="flex-1 flex flex-col mt-3 overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-200">
        
        {/* State 1: Instructions & Onboarding */}
        {examState === 'INTRO' && (
          <div className="flex-1 p-6 sm:p-12 overflow-y-auto max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <span className="px-3 py-1 rounded-full bg-brand-yellow text-brand-navy text-xs font-black uppercase">
                National Testing Agency (NTA) Simulation
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Rankers Path Online Scholarship Test (RSAT)
              </h2>
              <p className="text-sm text-slate-500">
                Test your conceptual preparation for NEET &amp; IIT-JEE and earn up to <strong>100% Tuition Fee Scholarship</strong>.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div>
                <span className="text-xs text-slate-400 font-bold block">Duration</span>
                <strong className="text-base text-slate-800 font-black">45 Minutes</strong>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block">Total Questions</span>
                <strong className="text-base text-slate-800 font-black">Multi-Subject MCQ</strong>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block">Marking Scheme</span>
                <strong className="text-base text-emerald-600 font-black">+4 / -1 / 0</strong>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block">Scholarship</span>
                <strong className="text-base text-brand-yellowDark font-black">Up to 100%</strong>
              </div>
            </div>

            {/* Test Instructions */}
            <div className="space-y-3 text-xs sm:text-sm text-slate-700 bg-white p-5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">Standard Examination Guidelines:</h4>
              <p>&bull; <strong>Marking Scheme:</strong> +4 marks for every correct answer, -1 mark for every incorrect response, 0 for unattempted.</p>
              <p>&bull; <strong>Anti-Cheat Guard:</strong> Do not switch browser tabs or minimize the window. A maximum of 3 warnings will be permitted before automatic test submission.</p>
              <p>&bull; <strong>Auto-Save:</strong> Your chosen answers are saved automatically on every click. You may modify your answers any time before final submission.</p>
              <p>&bull; <strong>NTA Palette Colors:</strong> Green = Answered, Red = Not Answered, Purple = Marked for Review, Gray = Not Visited.</p>
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={handleStartExam}
                disabled={loading}
                className="px-10 py-4 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-base shadow-xl transition transform hover:scale-105"
              >
                {loading ? 'Setting up Exam Hall...' : 'I Am Ready &bull; Start Examination Now'}
              </button>
            </div>
          </div>
        )}

        {/* State 2: Active CBT Exam Screen */}
        {examState === 'IN_EXAM' && currentQ && (
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Area: Question Paper Canvas */}
            <div className="flex-1 flex flex-col border-r border-slate-200 overflow-y-auto">
              
              {/* Question Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-brand-navy text-brand-yellow rounded-lg text-xs font-black">
                    {currentQ.subject}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">Topic: {currentQ.topic || 'General'}</span>
                </div>
                <div className="text-xs font-bold text-slate-600">
                  Question <span className="text-brand-navy font-extrabold text-sm">{currentIdx + 1}</span> of {questions.length}
                </div>
              </div>

              {/* Question Content */}
              <div className="p-6 sm:p-8 flex-1 space-y-6">
                <div className="text-base sm:text-lg font-semibold text-slate-900 leading-relaxed">
                  <span className="font-bold text-brand-navy mr-2">Q{currentIdx + 1}.</span>
                  {currentQ.questionText}
                </div>

                {/* Options List */}
                <div className="space-y-3 pt-2">
                  {currentQ.options.map((opt, optIdx) => {
                    const isSelected = answers[currentQ.id]?.selectedOption === optIdx;
                    return (
                      <div
                        key={optIdx}
                        onClick={() => handleSelectOption(optIdx)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition flex items-center gap-4 ${
                          isSelected
                            ? 'border-brand-navy bg-brand-yellow/10 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                          isSelected ? 'bg-brand-navy text-brand-yellow' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </div>
                        <span className="text-sm sm:text-base font-medium text-slate-800 flex-1">
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Navigation Buttons */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleClearResponse}
                    className="px-3.5 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-600 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Clear Response
                  </button>
                  <button
                    onClick={handleMarkForReview}
                    className="px-3.5 py-2 border border-purple-300 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold"
                  >
                    Mark for Review &amp; Next
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentIdx === 0}
                    onClick={() => setCurrentIdx(currentIdx - 1)}
                    className="px-4 py-2 border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold disabled:opacity-40 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <button
                    onClick={handleSaveAndNext}
                    className="px-6 py-2.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl text-xs font-black shadow flex items-center gap-1.5"
                  >
                    <span>Save &amp; Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>

            {/* Right Area: NTA Question Palette */}
            <div className="w-full lg:w-72 border-t lg:border-t-0 bg-slate-50 p-4 flex flex-col">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-3">
                Question Palette
              </h4>

              {/* Palette Legend */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 mb-4 p-3 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-500 text-white font-bold text-[9px] flex items-center justify-center">✓</span>
                  <span>Answered ({answeredCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-purple-500 text-white font-bold text-[9px] flex items-center justify-center">?</span>
                  <span>Review ({markedCount})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-slate-300 text-slate-600 font-bold text-[9px] flex items-center justify-center">-</span>
                  <span>Not Visited ({notVisitedCount})</span>
                </div>
              </div>

              {/* Question Buttons Matrix */}
              <div className="grid grid-cols-5 gap-2 overflow-y-auto flex-1 content-start">
                {questions.map((q, idx) => {
                  const ans = answers[q.id];
                  let btnColor = 'bg-slate-200 text-slate-700 hover:bg-slate-300'; // Not visited

                  if (ans?.status === 'ANSWERED') {
                    btnColor = 'bg-emerald-500 text-white font-bold shadow-sm';
                  } else if (ans?.status === 'MARKED_FOR_REVIEW') {
                    btnColor = 'bg-purple-500 text-white font-bold shadow-sm';
                  }

                  const isCurrent = idx === currentIdx;

                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIdx(idx)}
                      className={`h-9 rounded-xl text-xs font-bold transition flex items-center justify-center relative ${btnColor} ${
                        isCurrent ? 'ring-2 ring-brand-navy ring-offset-2' : ''
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

            </div>

          </div>
        )}

        {/* State 3: Instant Scorecard & Scholarship Declaration */}
        {examState === 'RESULT' && resultData && (
          <div className="flex-1 p-6 sm:p-12 overflow-y-auto max-w-3xl mx-auto space-y-6 text-center animate-in zoom-in-95">
            
            <div className="w-20 h-20 rounded-3xl bg-brand-yellow/20 text-brand-navy flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-10 h-10 text-brand-yellowDark" />
            </div>

            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider">
                Official Result &bull; Evaluation Complete
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
                Congratulations, {user?.fullName || 'Candidate'}!
              </h2>
              <p className="text-sm text-slate-500">
                You have successfully completed the Rankers Path Scholarship Examination.
              </p>
            </div>

            {/* Scholarship Certificate Callout */}
            <div className="bg-gradient-to-r from-brand-navy to-brand-navyCard text-white p-6 sm:p-8 rounded-3xl shadow-xl border-2 border-brand-yellow space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-widest text-brand-yellow">
                Merit Scholarship Entitlement
              </span>
              <div className="text-4xl sm:text-5xl font-black text-brand-yellow font-sans">
                {resultData.scholarshipPercent || 75}% SCHOLARSHIP
              </div>
              <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto pt-1">
                Applicable on all Classroom Courses (NEET / IIT-JEE Dropper &amp; 11th/12th Batches) at our Vijay Nagar Campus.
              </p>
            </div>

            {/* Scorecard Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div>
                <span className="text-xs text-slate-400 font-bold block">Total Score</span>
                <strong className="text-xl text-brand-navy font-black">{resultData.score} / {resultData.maxMarks}</strong>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block">Percentage</span>
                <strong className="text-xl text-slate-800 font-black">{resultData.percentage}%</strong>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block">Correct Answers</span>
                <strong className="text-xl text-emerald-600 font-black">{resultData.correctCount}</strong>
              </div>
              <div>
                <span className="text-xs text-slate-400 font-bold block">Incorrect Responses</span>
                <strong className="text-xl text-rose-600 font-black">{resultData.incorrectCount}</strong>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <a
                href="https://wa.me/919131435511?text=Hi%2C%20I%20completed%20the%20RSAT%20test%20and%20qualified%20for%20scholarship.%20Please%20guide%20admission%20process."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-sm shadow-md transition"
              >
                Claim Scholarship on WhatsApp
              </a>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-bold text-sm"
              >
                Close &amp; Return to Home
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Tab Switch Warning Toast */}
      {violationAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-rose-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <AlertTriangle className="w-5 h-5 text-white" />
          <div className="text-xs font-bold">
            Warning: Tab Switch Detected ({violations}/3 warnings)! 3 violations will auto-submit the exam.
          </div>
          <button
            onClick={() => setViolationAlert(false)}
            className="text-xs font-black underline ml-2"
          >
            I understand
          </button>
        </div>
      )}

    </div>
  );
}
