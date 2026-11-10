import React, { useState } from 'react';
import { Plus, Target, Hash, CheckCircle2, Filter, Sparkles, BookOpen } from 'lucide-react';

export default function QuestionBankDesk({
  questions = [],
  newQuestion,
  setNewQuestion,
  handleAddQuestion
}) {
  const [streamFilter, setStreamFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered Questions
  const filteredQuestions = questions.filter(q => {
    const qStream = q.stream || (q.examType === 'JEE_MAIN' || q.examType === 'JEE_ADVANCED' ? 'JEE' : q.examType === 'FOUNDATION' ? 'FOUNDATION' : 'NEET');
    const qType = q.questionType || (q.options && q.options.length > 0 ? 'MCQ' : 'NUMERICAL');

    if (streamFilter !== 'ALL' && qStream !== streamFilter) return false;
    if (typeFilter !== 'ALL' && qType !== typeFilter) return false;
    if (searchQuery) {
      const text = (q.questionText || '').toLowerCase();
      const topic = (q.topic || '').toLowerCase();
      const subj = (q.subject || '').toLowerCase();
      const s = searchQuery.toLowerCase();
      if (!text.includes(s) && !topic.includes(s) && !subj.includes(s)) return false;
    }
    return true;
  });

  return (
    <div className="mt-8 space-y-8 animate-in fade-in">
      {/* Add New Question Form */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-brand-yellowDark" />
            <span>Create New Question (MCQ, Exact NAT &amp; Range-Based NAT)</span>
          </h3>
          <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            NTA JEE Mains &bull; NEET-UG &bull; Foundation PNCF
          </span>
        </div>

        <form onSubmit={handleAddQuestion} className="space-y-5">
          {/* Stream, Question Type, Subject & Class Level */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Stream *</label>
              <select
                value={newQuestion.stream || 'JEE'}
                onChange={(e) => {
                  const st = e.target.value;
                  setNewQuestion({
                    ...newQuestion,
                    stream: st,
                    examType: st === 'JEE' ? 'JEE_MAIN' : st === 'FOUNDATION' ? 'FOUNDATION' : 'NEET',
                    classLevel: st === 'FOUNDATION' ? 'Class 9' : (newQuestion.classLevel === 'Class 9' ? 'Class 11' : newQuestion.classLevel)
                  });
                }}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold text-brand-navy"
              >
                <option value="JEE">IIT-JEE (Mains &amp; Advanced)</option>
                <option value="NEET">NEET-UG (Medical)</option>
                <option value="FOUNDATION">Foundation PNCF (9th &amp; 10th)</option>
                <option value="ALL">All Streams / RSAT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Question Type *</label>
              <select
                value={newQuestion.questionType || 'MCQ'}
                onChange={(e) => setNewQuestion({ ...newQuestion, questionType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border-2 border-brand-yellow text-xs bg-amber-50/50 font-black text-brand-navy"
              >
                <option value="MCQ">🔘 MCQ (Single Choice A/B/C/D)</option>
                <option value="NAT_RANGE">🎯 NAT_RANGE (Range-Based Numerical)</option>
                <option value="NUMERICAL">🔢 NAT (Exact Numerical / Decimal)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject *</label>
              <select
                value={newQuestion.subject || 'Physics'}
                onChange={(e) => setNewQuestion({ ...newQuestion, subject: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
              >
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Biology">Biology (Botany / Zoology)</option>
                <option value="Mental Ability">Mental Ability (MAT)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Class Level</label>
              <select
                value={newQuestion.classLevel || 'Class 11'}
                onChange={(e) => setNewQuestion({ ...newQuestion, classLevel: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
              >
                {newQuestion.stream === 'FOUNDATION' ? (
                  <>
                    <option value="Class 9">Class 9th PNCF</option>
                    <option value="Class 10">Class 10th PNCF</option>
                  </>
                ) : (
                  <>
                    <option value="Class 11">Class 11th</option>
                    <option value="Class 12">Class 12th</option>
                    <option value="Dropper">Dropper / Repeater</option>
                    <option value="Class 9">Class 9th</option>
                    <option value="Class 10">Class 10th</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Topic / Chapter</label>
              <input
                type="text"
                placeholder="e.g. Projectile Motion / Chemical Bonding / Heron's Formula"
                value={newQuestion.topic || ''}
                onChange={(e) => setNewQuestion({ ...newQuestion, topic: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Exam Section</label>
              <select
                value={newQuestion.section || (newQuestion.questionType === 'MCQ' ? 'Section A' : 'Section B')}
                onChange={(e) => setNewQuestion({ ...newQuestion, section: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-medium"
              >
                <option value="Section A">Section A (Mandatory MCQs)</option>
                <option value="Section B">Section B (Numerical / Optional)</option>
              </select>
            </div>
          </div>

          {/* Question Statement */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Question Statement *</label>
            <textarea
              rows={3}
              required
              placeholder="Enter question text, values, formulas, and units..."
              value={newQuestion.questionText || ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium leading-relaxed"
            ></textarea>
          </div>

          {/* DYNAMIC QUESTION INPUTS */}
          {/* CASE 1: MCQ (Options A, B, C, D) */}
          {(!newQuestion.questionType || newQuestion.questionType === 'MCQ') && (
            <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider block">
                MCQ Multiple Choice Options (A, B, C, D)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(newQuestion.options || ['', '', '', '']).map((opt, idx) => (
                  <div key={idx}>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Option {String.fromCharCode(65 + idx)}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={`Option ${String.fromCharCode(65 + idx)} text`}
                      value={opt}
                      onChange={(e) => {
                        const newOpts = [...(newQuestion.options || ['', '', '', ''])];
                        newOpts[idx] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOpts });
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correct Answer Key *</label>
                <select
                  value={newQuestion.correctOption !== undefined ? newQuestion.correctOption : 0}
                  onChange={(e) => setNewQuestion({ ...newQuestion, correctOption: Number(e.target.value) })}
                  className="w-full sm:w-1/2 px-3 py-2.5 rounded-xl border border-slate-300 text-xs bg-white font-bold"
                >
                  <option value={0}>Option A is Correct</option>
                  <option value={1}>Option B is Correct</option>
                  <option value={2}>Option C is Correct</option>
                  <option value={3}>Option D is Correct</option>
                </select>
              </div>
            </div>
          )}

          {/* CASE 2: NAT_RANGE (Range-Based Numerical Answer) */}
          {newQuestion.questionType === 'NAT_RANGE' && (
            <div className="p-5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300 space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-600" />
                <h4 className="text-xs font-black uppercase text-amber-900 tracking-wider">
                  Range-Based Numerical Evaluation Rules
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Minimum Allowed Value (Range Min) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 12.4"
                    value={newQuestion.rangeMin !== undefined ? newQuestion.rangeMin : ''}
                    onChange={(e) => setNewQuestion({ ...newQuestion, rangeMin: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-400 text-xs font-black bg-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Lower boundary (inclusive)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Maximum Allowed Value (Range Max) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="e.g. 12.6"
                    value={newQuestion.rangeMax !== undefined ? newQuestion.rangeMax : ''}
                    onChange={(e) => setNewQuestion({ ...newQuestion, rangeMax: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-400 text-xs font-black bg-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Upper boundary (inclusive)</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Ideal Center / Expected Value
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 12.5"
                    value={newQuestion.correctAnswer || ''}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-amber-400 text-xs font-bold bg-white"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">Shown in solution sheet</span>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>
                  <strong>Evaluation Engine Rule:</strong> Any candidate submitting a value between{' '}
                  <strong className="underline text-brand-navy">
                    {newQuestion.rangeMin || '12.4'}
                  </strong>{' '}
                  and{' '}
                  <strong className="underline text-brand-navy">
                    {newQuestion.rangeMax || '12.6'}
                  </strong>{' '}
                  (inclusive) will automatically receive full <strong>+4 marks</strong>!
                </span>
              </div>
            </div>
          )}

          {/* CASE 3: NUMERICAL / EXACT NAT */}
          {newQuestion.questionType === 'NUMERICAL' && (
            <div className="p-5 bg-blue-50 rounded-2xl border-2 border-blue-200 space-y-4">
              <div className="flex items-center gap-2">
                <Hash className="w-5 h-5 text-blue-600" />
                <h4 className="text-xs font-black uppercase text-blue-900 tracking-wider">
                  Exact Numerical / Integer Value Configuration
                </h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Exact Numerical Value *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 25 or 3.14"
                    value={newQuestion.correctAnswer || ''}
                    onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-blue-300 text-xs font-black bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase mb-1">
                    Acceptable Rounding Tolerance (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Default 0.05"
                    value={newQuestion.tolerance !== undefined ? newQuestion.tolerance : ''}
                    onChange={(e) => setNewQuestion({ ...newQuestion, tolerance: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-blue-300 text-xs font-medium bg-white"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Explanation */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Step-by-Step Faculty Solution &amp; Explanation
            </label>
            <textarea
              rows={2}
              placeholder="Detailed formula, step-by-step reasoning, and range justification shown to students in result review..."
              value={newQuestion.explanation || ''}
              onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
              className="w-full p-3 rounded-xl border border-slate-300 text-xs font-medium"
            ></textarea>
          </div>

          <button
            type="submit"
            className="px-6 py-3 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase rounded-xl shadow transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Save Question to Repository</span>
          </button>
        </form>
      </div>

      {/* Questions List with Stream & Type Filters */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-brand-yellowDark" />
              <span>Current Question Bank ({questions.length} Total Questions)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse questions categorized by Stream, Class, and Evaluation Mode
            </p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Search questions or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium"
            />
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-slate-100 pb-4">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2">Stream:</span>
          {['ALL', 'JEE', 'NEET', 'FOUNDATION'].map(st => (
            <button
              key={st}
              onClick={() => setStreamFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                streamFilter === st
                  ? st === 'JEE' ? 'bg-blue-600 text-white' :
                    st === 'NEET' ? 'bg-emerald-600 text-white' :
                    st === 'FOUNDATION' ? 'bg-purple-600 text-white' :
                    'bg-brand-navy text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st === 'ALL' ? 'All Streams' : st === 'JEE' ? 'IIT-JEE' : st === 'NEET' ? 'NEET-UG' : 'Foundation PNCF'}
            </button>
          ))}

          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-4 mr-2">Type:</span>
          {['ALL', 'MCQ', 'NAT_RANGE', 'NUMERICAL'].map(tp => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                typeFilter === tp
                  ? tp === 'NAT_RANGE' ? 'bg-amber-500 text-white' :
                    tp === 'NUMERICAL' ? 'bg-indigo-600 text-white' :
                    'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tp === 'ALL' ? 'All Types' : tp === 'MCQ' ? '🔘 MCQ' : tp === 'NAT_RANGE' ? '🎯 Range NAT' : '🔢 Exact NAT'}
            </button>
          ))}
        </div>

        {/* Questions Grid */}
        <div className="space-y-3">
          {filteredQuestions.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-2xl">
              No questions found matching your filter criteria.
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const qStream = q.stream || (q.examType === 'JEE_MAIN' || q.examType === 'JEE_ADVANCED' ? 'JEE' : q.examType === 'FOUNDATION' ? 'FOUNDATION' : 'NEET');
              const qType = q.questionType || (q.options && q.options.length > 0 ? 'MCQ' : 'NUMERICAL');

              return (
                <div key={q.id || idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 transition hover:border-slate-300">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                        qStream === 'JEE' ? 'bg-blue-100 text-blue-900 border border-blue-200' :
                        qStream === 'NEET' ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' :
                        qStream === 'FOUNDATION' ? 'bg-purple-100 text-purple-900 border border-purple-200' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        {qStream === 'JEE' ? 'IIT-JEE' : qStream === 'NEET' ? 'NEET-UG' : qStream === 'FOUNDATION' ? 'Foundation 9/10' : 'RSAT'}
                      </span>

                      <span className="px-2 py-0.5 rounded bg-brand-navy text-brand-yellow font-bold text-[10px]">
                        {q.subject} &bull; {q.classLevel || 'Class 11'}
                      </span>

                      {q.topic && (
                        <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {q.topic}
                        </span>
                      )}
                    </div>

                    {/* Question Type & Key Badge */}
                    <div className="flex items-center gap-2">
                      {qType === 'NAT_RANGE' ? (
                        <span className="px-2.5 py-1 rounded-lg bg-amber-100 border border-amber-300 text-amber-900 text-xs font-black flex items-center gap-1">
                          <Target className="w-3.5 h-3.5 text-amber-600" />
                          <span>Range: [{q.rangeMin} — {q.rangeMax}]</span>
                        </span>
                      ) : qType === 'NUMERICAL' ? (
                        <span className="px-2.5 py-1 rounded-lg bg-blue-100 border border-blue-200 text-blue-900 text-xs font-black flex items-center gap-1">
                          <Hash className="w-3.5 h-3.5 text-blue-600" />
                          <span>Value: {q.correctAnswer || q.correctValue}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-900 text-xs font-black">
                          Key: Option {String.fromCharCode(65 + Number(q.correctOption || 0))}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                    {q.questionText}
                  </p>

                  {/* Options if MCQ */}
                  {qType === 'MCQ' && q.options && q.options.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div
                          key={oIdx}
                          className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-2 ${
                            Number(q.correctOption) === oIdx ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-white border-slate-200'
                          }`}
                        >
                          <span className="font-bold">({String.fromCharCode(65 + oIdx)})</span>
                          <span>{opt}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.explanation && (
                    <div className="text-[11px] text-slate-600 bg-white/70 p-2.5 rounded-xl border border-slate-200/80">
                      <strong className="text-slate-800">Explanation: </strong>
                      <span>{q.explanation}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
