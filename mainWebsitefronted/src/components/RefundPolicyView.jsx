import React from 'react';
import {
  ArrowLeft,
  FileText,
  ShieldCheck,
  AlertTriangle,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Printer,
  Mail,
  Phone,
  MapPin,
  BookOpen,
  DollarSign,
  ArrowRight,
  Info
} from 'lucide-react';

export default function RefundPolicyView({ onBack, onOpenEnquiry }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen text-slate-800">
      
      {/* 1. TOP BREADCRUMB & HEADER BANNER */}
      <div className="bg-gradient-to-br from-[#0B1B3D] via-[#102450] to-[#0A1633] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b-4 border-brand-yellow">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition shadow-sm backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 text-brand-yellow" />
              <span>Back to Home</span>
            </button>

            <div className="flex items-center gap-2.5">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition backdrop-blur-sm"
                title="Print this policy"
              >
                <Printer className="w-4 h-4 text-brand-yellow" />
                <span className="hidden sm:inline">Print / Save Policy</span>
              </button>

              <a
                href="mailto:rankerspathofficial.edu@gmail.com?subject=Refund%20Application%20Enquiry"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy text-xs font-black transition shadow"
              >
                <Mail className="w-4 h-4" />
                <span>Email Grievance Cell</span>
              </a>
            </div>
          </div>

          {/* Institutional Title & Badge */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-yellow/20 text-brand-yellow font-extrabold text-[11px] uppercase tracking-wider border border-brand-yellow/30">
              <ShieldCheck className="w-4 h-4" />
              <span>OFFICIAL INSTITUTIONAL GUIDELINES • 2026–27 ACADEMIC SESSION</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Refund &amp; Transfer Policy
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
              <strong>Rankerspath Educational Pvt. Ltd.</strong> works in a completely transparent manner. Our refund and transfer policy ensures that all student withdrawal requests, fee calculations, and inter-branch transfers are processed fairly, systematically, and without ambiguity.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-brand-yellow" /> Official Policy Document (7 Pages)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4 text-brand-yellow" /> rankerspathofficial.edu@gmail.com
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4 text-brand-yellow" /> Indore HQ &amp; All Branches
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN POLICY CONTENT CONTAINER */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20 relative z-20 space-y-10">

        {/* Section 1: Core Principles & Application Submission */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-brand-navy flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-brand-navy" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-yellowDark">Section 1</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                General Refund Policy &amp; Grievance Submission
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Mandatory procedure for seeking admission withdrawal and refund calculation.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
            <p>
              Company works in a transparent manner. Our Refund policy ensures that all the refunds are processed in a fair manner. In case, where a student expresses his intention of not attending the course, and withdrawing his admission, we would require a <strong>formal written Refund Application / Grievance Letter</strong> (stating the specific reason for seeking a refund) from the <strong>Parent / Legal Guardian (along with proof of relationship)</strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5">
                  <MapPin className="w-4 h-4 text-brand-navy" />
                  <span>Mode 1: In-Person Submission</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit the signed application letter in person at the branch / centre of admission. The date of physical receipt stamped at the branch counter will be strictly considered for calculation.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-slate-900 mb-1.5">
                  <Mail className="w-4 h-4 text-brand-navy" />
                  <span>Mode 2: Official Email Submission</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Parents can send the refund request via registered email to <strong className="text-brand-navy">rankerspathofficial.edu@gmail.com</strong> or to the official Branch email ID. The date of email receipt will be taken for calculation.
                </p>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <strong>Savings Account Disbursement Only:</strong> The refund will be processed <strong>only into a &quot;Savings Bank Account&quot;</strong> in the name of the student or parent/guardian, and strictly not in any business, current, or third-party accounts.
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
                A. Strictly Non-Refundable Fee Components (Classroom Courses):
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  'Registration Fee is NOT refundable under any circumstances whatsoever.',
                  'Admission Fee is NOT refundable if refund application is submitted after the Batch Start Date.',
                  'Short Term Classroom Course Fee / Test Series Fee is NOT refundable under any circumstances whatsoever.',
                  'Fee paid towards Admission Cum Scholarship Test (ACST), RANKERS PATH & Instant Admission cum Scholarship Test (iACST) is NOT refundable under any circumstances whatsoever.'
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-start gap-2 bg-rose-50/70 p-3 rounded-xl border border-rose-100 text-xs text-rose-900 font-medium">
                    <XCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Deduction Matrix Table (Matching Page 2) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-brand-navy text-brand-yellow flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-brand-yellow" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-yellowDark">Section 2</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Fee Component Refund Matrix &amp; Weekly Timeline
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Standard deduction schedule based on batch commencement and application timing (Classroom Courses).
              </p>
            </div>
          </div>

          {/* Responsive Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0B1B3D] text-white uppercase text-[11px] font-extrabold tracking-wider">
                <tr>
                  <th className="py-4 px-4 border-r border-slate-700 min-w-[180px]">Fee Components</th>
                  <th className="py-4 px-3.5 border-r border-slate-700 min-w-[130px] text-center">Before Batch Commencement</th>
                  <th className="py-4 px-3.5 border-r border-slate-700 min-w-[110px] text-center">Week 1</th>
                  <th className="py-4 px-3.5 border-r border-slate-700 min-w-[110px] text-center">Week 2</th>
                  <th className="py-4 px-3.5 border-r border-slate-700 min-w-[110px] text-center">Week 3</th>
                  <th className="py-4 px-3.5 border-r border-slate-700 min-w-[110px] text-center">Week 4</th>
                  <th className="py-4 px-4 min-w-[200px] text-center">Week 5 or Later</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                {/* Row 1: Registration Fee */}
                <tr className="bg-slate-50/50 hover:bg-slate-100/50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 border-r border-slate-200">
                    Registration Fee
                  </td>
                  <td colSpan={6} className="py-3.5 px-4 text-center font-bold text-rose-600 bg-rose-50/40">
                    Non-Refundable
                  </td>
                </tr>

                {/* Row 2: Admission & Digital Access Fee */}
                <tr className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900 border-r border-slate-200">
                    Admission &amp; Digital Access Fee
                  </td>
                  <td className="py-3.5 px-3.5 text-center font-bold text-emerald-600 bg-emerald-50/60 border-r border-slate-200">
                    100% Refundable
                  </td>
                  <td colSpan={5} className="py-3.5 px-4 text-center font-bold text-rose-600 bg-rose-50/40">
                    Non-Refundable
                  </td>
                </tr>

                {/* Row 3: Tuition Fee, Technology & Exam Fee */}
                <tr className="bg-slate-50/50 hover:bg-slate-100/50 transition">
                  <td className="py-4 px-4 font-bold text-slate-900 border-r border-slate-200">
                    Tuition Fee, Technology &amp; Exam Fee
                  </td>
                  <td className="py-4 px-3.5 text-center font-bold text-emerald-600 bg-emerald-50/60 border-r border-slate-200">
                    100% Refundable
                  </td>
                  <td className="py-4 px-3.5 text-center border-r border-slate-200">
                    <span className="font-bold text-amber-700">25% of 1st Installment</span> will be Deducted
                  </td>
                  <td className="py-4 px-3.5 text-center border-r border-slate-200">
                    <span className="font-bold text-amber-800">50% of 1st Installment</span> will be Deducted
                  </td>
                  <td className="py-4 px-3.5 text-center border-r border-slate-200">
                    <span className="font-bold text-rose-600">75% of 1st Installment</span> will be Deducted
                  </td>
                  <td className="py-4 px-3.5 text-center border-r border-slate-200">
                    <span className="font-bold text-rose-700">100% of 1st Installment</span> will be Deducted
                  </td>
                  <td className="py-4 px-4 text-xs text-slate-700 leading-snug">
                    <strong>Minimum of the below is refundable:</strong>
                    <ul className="mt-1 space-y-1 list-disc list-inside text-[11px] text-slate-600">
                      <li>75% of Total Installment payable, <span className="font-semibold text-slate-900">OR</span></li>
                      <li>Total Amount paid as the future Installments due on or after the refund application date.</li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Section 2 Notes */}
          <div className="mt-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
            <span className="font-extrabold uppercase text-slate-900 text-[11px] tracking-wider block">
              Important Calculation Rules (NOTE):
            </span>
            <ul className="space-y-1.5 list-disc list-inside leading-relaxed">
              <li><strong>Week-1 Counting:</strong> Week-1 will be counted from the date of registration by the student or the date of start of the batch, whichever is later.</li>
              <li><strong>Course Duration:</strong> Total course duration is calculated from Batch start date / Registration date (whichever is later) to the official Course End date.</li>
              <li><strong>Future Installment Dates:</strong> Future instalment dates will be considered strictly as per the institute payment schedule shared, and will NOT be as per third-party bank loan EMI dates (if any loan taken).</li>
              <li><strong>Digital Tool Access:</strong> The discontinued student will retain digital tools access (excluding live class platforms like MS Teams, Crystal, etc.) only if the Admission Fee was fully paid and has not been refunded at any point.</li>
            </ul>
          </div>
        </div>

        {/* Section 3: Study Material / Books Policy (Matching Page 3) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700">Section 3</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                B. Refund Policy for Study Material (Books / Modules)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Study material kit valuation and non-returnable policy.
              </p>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            <p>
              After admission, in any circumstances, the admission kit, printed study modules, and reference books are strictly <strong>non-refundable</strong>. Sold / issued modules cannot be accepted back under any circumstances.
            </p>

            {/* 4 Cost Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">NEET Modules Kit</span>
                <p className="text-2xl font-black text-brand-navy mt-1">₹12,000/-</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">Non-Refundable</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">IIT-JEE Modules Kit</span>
                <p className="text-2xl font-black text-brand-navy mt-1">₹15,000/-</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">Non-Refundable</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Class 11th Module</span>
                <p className="text-2xl font-black text-brand-navy mt-1">₹5,000/-</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">Non-Refundable</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Class 10th Module</span>
                <p className="text-2xl font-black text-brand-navy mt-1">₹5,000/-</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">Non-Refundable</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: What to Consider vs What NOT to Consider (Matching Page 3 & 4) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-blue-700">Section 4</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                C. Key Points for Calculation of Refund
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Legal parameters considered vs parameters rejected during calculation.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* What to Consider */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 font-black text-emerald-900 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>WHAT WILL BE CONSIDERED:</span>
              </div>
              <ul className="space-y-2 text-xs text-emerald-950 font-medium">
                <li className="flex items-start gap-2">
                  <span className="font-black text-emerald-700">a.</span>
                  <span><strong>Batch Start Date / Registration Date</strong>, whichever is later.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-emerald-700">b.</span>
                  <span><strong>Date of formal submission of application</strong> for withdrawal and refund at the branch counter or official email.</span>
                </li>
              </ul>
            </div>

            {/* What will NOT to Consider */}
            <div className="p-5 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
              <div className="flex items-center gap-2 font-black text-rose-900 text-sm">
                <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>WHAT WILL NOT BE CONSIDERED:</span>
              </div>
              <ul className="space-y-2 text-xs text-rose-950 font-medium">
                <li className="flex items-start gap-2">
                  <span className="font-black text-rose-700">a.</span>
                  <span>Date when the student attended the first class.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-black text-rose-700">b.</span>
                  <span>Date of last class attended by the student.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Concrete Illustration Box (Matching Page 4) */}
          <div className="mt-6 p-6 rounded-2xl bg-slate-900 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-white/10">
              <span className="text-xs font-black uppercase tracking-wider text-brand-yellow flex items-center gap-1.5">
                <Info className="w-4 h-4" /> Practical Illustration (Exact Example)
              </span>
              <span className="text-[11px] text-slate-400">Page 4 of Official Policy</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">a. Registration Date</span>
                <p className="text-sm font-black text-white mt-0.5">6th April</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">b. Batch Commencement Date</span>
                <p className="text-sm font-black text-white mt-0.5">8th April</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">c. Student Actually Joined</span>
                <p className="text-sm font-black text-white mt-0.5">12th April</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">d. Last Class Attended</span>
                <p className="text-sm font-black text-white mt-0.5">15th November</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">e. Application Submission</span>
                <p className="text-sm font-black text-brand-yellow mt-0.5">15th December</p>
              </div>
              <div className="bg-emerald-500/20 p-3 rounded-xl border border-emerald-400/40">
                <span className="text-emerald-300 text-[10px] uppercase font-bold block">f. Calculated Between</span>
                <p className="text-sm font-black text-emerald-400 mt-0.5">08th April – 15th Dec</p>
              </div>
            </div>

            <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-slate-300">
              <strong className="text-rose-400">g. Refund will NOT be calculated from:</strong> 12th April – 15th December <span className="text-slate-500">OR</span> 15th November <span className="text-slate-500">OR</span> 6th April – 15th November.
            </div>
          </div>
        </div>

        {/* Section 5 & 6: Mode of Payment & Scholarship Refunds (Matching Page 5) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Mode of Payment */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-navy text-brand-yellow flex items-center justify-center font-black">
                ₹
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Section 5</span>
                <h3 className="text-lg font-black text-slate-900">Mode of Payment of Refund</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              All refunds shall be paid through <strong>Online Bank Transfer ONLY</strong> in the name and to the registered savings account of the student / parent / guardian within:
            </p>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-center">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Processing Turnaround</span>
              <p className="text-2xl font-black text-amber-950 mt-1">45 to 60 Days Minimum</p>
              <p className="text-[11px] text-amber-800 mt-0.5">From the date of receipt of application by the branch</p>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
              <strong>Account Verification Note:</strong> The Institute shall not be held responsible or accountable for crediting refund money to the wrong account due to incorrect banking details furnished by the student / parent / guardian.
            </div>
          </div>

          {/* Scholarship Refund Policy */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-yellow text-brand-navy flex items-center justify-center font-black">
                ★
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Section 6</span>
                <h3 className="text-lg font-black text-slate-900">Scholarship Refund Policy</h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Students eligible for board merit scholarships or rank waivers must submit the application strictly within the designated window:
            </p>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-center">
              <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Mandatory Submission Cutoff</span>
              <p className="text-2xl font-black text-blue-950 mt-1">On or Before 30th July</p>
              <p className="text-[11px] text-blue-800 mt-0.5">Along with photocopy of Class X Board Exam marksheet</p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              <li>Any application received beyond <strong>30th July</strong> shall be rejected without exception.</li>
              <li>Scholarship refund amount shall be disbursed in the <strong>2nd week of August</strong>.</li>
              <li>In case of admission withdrawal of Scholarship Students, refund follows the general Refund Policy.</li>
            </ul>
          </div>

        </div>

        {/* Section 7: Transfer Policy (Matching Pages 5, 6, 7) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-700 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-indigo-700">Section 7</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Official Student Transfer Policy (Inter-Branch &amp; Inter-City)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Guidelines for transferring from one branch / centre to another branch in different cities.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-black uppercase text-brand-navy">Step 1: Written Application</span>
              <p className="text-xs text-slate-600 mt-1">
                Parent/Legal Guardian submits written application stating genuine reason, addressed to Assistant Director / Centre Head.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-black uppercase text-brand-navy">Step 2: Transfer Fee</span>
              <p className="text-xs text-slate-600 mt-1">
                Students need to pay a standard transfer processing fee of <strong className="text-brand-navy">₹2,500/-</strong>.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-black uppercase text-brand-navy">Step 3: Document Verification</span>
              <p className="text-xs text-slate-600 mt-1">
                Residential address proof (parent transfer/posting letter) + fee paid details duly certified by accounts in-charge.
              </p>
            </div>
          </div>

          {/* Transfer Fee Rules Table (Matching Page 6) */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#0B1B3D] text-white uppercase text-[11px] font-extrabold tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 min-w-[60px] text-center">S.No</th>
                  <th className="py-3.5 px-4 min-w-[240px]">Case / Transfer Situation</th>
                  <th className="py-3.5 px-4 min-w-[280px]">Payment / Settlement of Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-500">1.</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">For Fee paid in Installments</td>
                  <td className="py-3.5 px-4 text-slate-700">
                    Pay the balance amount in accordance with the fee structure of the transferee branch / centre (*As mentioned in Prospectus), as per the payment schedule.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 bg-slate-50/40">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-500">2.</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Transfer to branch / centre having higher fee than the fee of transferor branch
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-bold text-brand-navy">
                    Pay the difference in fee between the two centres.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-500">3.</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    Transfer to branch / centre having lower fee than the fee of transferor branch
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    <span className="font-bold text-rose-600">No refund shall be made</span> with respect to the difference in the amount of fee between the two.
                  </td>
                </tr>

                <tr className="hover:bg-slate-50 bg-slate-50/40">
                  <td className="py-3.5 px-4 text-center font-bold text-slate-500">4.</td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block mb-1">Transfer Request timing vs Fee Due Date:</span>
                    <span className="text-[11px] text-slate-500">(e.g. In case due date of installment is Oct 5)</span>
                    <ul className="mt-1 space-y-1 text-[11px]">
                      <li>• <strong>Case a:</strong> Applied before due date (e.g. Sept 30) ➔ <em>Request Considered &amp; Transfer Certificate Issued</em></li>
                      <li>• <strong>Case b:</strong> Applied on/after due date (Oct 1–5 or beyond) ➔ <em>Request considered after payment of fees</em></li>
                    </ul>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    Pay the stipulated installment amount at the transferor branch / centre before the transfer can be authorized.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Important Transfer Notes (Matching Page 7) */}
          <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs text-amber-950">
            <span className="font-black uppercase tracking-wider block text-amber-900 text-xs">
              Important Transfer Conditions (Page 7):
            </span>
            <ul className="space-y-1.5 list-disc list-inside leading-relaxed">
              <li><strong>Transfer Fee:</strong> Students must pay the mandatory transfer fee of <strong className="text-amber-900">₹2,500</strong>.</li>
              <li><strong>Prior Dues Clearance:</strong> Any fee due before the transfer application date has to be completely paid in the transferor branch to initiate the transfer.</li>
              <li><strong>Eligibility Prerequisite:</strong> Student needs to pay the full Registration, Admission &amp; digital access fee, and 1st installment in the transferor branch to be eligible for inter-branch transfer.</li>
              <li><strong>Intra-City Transfer Restrictions:</strong> Intra-city transfers (i.e. transfer between branches within the same city) are allowed only under exceptional circumstances at the sole discretion of RANKERSPATH EDUCATIONAL PVT. LTD.</li>
              <li><strong>Maximum Transfer Limit:</strong> The number of inter-city transfers permitted for any student is <strong>maximum 2</strong>. Beyond that, the institute reserves the right to refuse transfer requests.</li>
              <li><strong>Processing Time:</strong> Normally, the complete inter-branch transfer process is finalized within a week&apos;s time.</li>
            </ul>
          </div>
        </div>

        {/* 3. GRIEVANCE CELL & CONTACT CARD */}
        <div className="bg-gradient-to-r from-[#0B1B3D] to-[#122b62] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-yellow/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-black uppercase tracking-wider text-brand-yellow">Official Grievance Redressal Cell</span>
            <h3 className="text-xl sm:text-2xl font-black">Need Assistance with Refund or Transfer?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Submit your written application with supporting documents to our central accounts grievance cell or email directly for formal acknowledgement.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0 w-full sm:w-auto">
            <a
              href="mailto:rankerspathofficial.edu@gmail.com?subject=Refund%20Application%20Submission"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-yellow hover:bg-[#e6a500] text-brand-navy font-black text-xs uppercase tracking-wider transition shadow text-center flex items-center justify-center gap-2"
            >
              <Mail className="w-4 h-4" />
              <span>Submit via Email</span>
            </a>

            <button
              onClick={onBack}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition text-center"
            >
              Back to Home
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
