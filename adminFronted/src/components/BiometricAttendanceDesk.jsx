import React, { useState, useEffect } from 'react';
import {
  Fingerprint,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Search,
  Filter,
  RefreshCw,
  Send,
  Building,
  Check,
  AlertCircle,
  Wifi,
  Sparkles,
  Phone,
  Calendar
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

export default function BiometricAttendanceDesk() {
  const [todayData, setTodayData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // 'ALL', 'PRESENT', 'ABSENT'
  const [batchFilter, setBatchFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [testPunchOpen, setTestPunchOpen] = useState(false);
  const [testStudentId, setTestStudentId] = useState('student-dev-1');
  const [testPunchType, setTestPunchType] = useState('IN');
  const [punchStatusMsg, setPunchStatusMsg] = useState('');

  const fetchAttendance = async () => {
    setLoading(true);
    try {
      const todayRes = await adminApi.getTodayAttendance();
      if (todayRes && todayRes.success) {
        setTodayData(todayRes.data);
      }
      const logsRes = await adminApi.getAttendanceLogs();
      if (logsRes && logsRes.success) {
        setLogs(logsRes.data || []);
      }
    } catch (err) {
      console.error('Failed to load attendance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const handleTestPunch = async (e) => {
    e.preventDefault();
    setPunchStatusMsg('Registering biometric punch...');
    try {
      const res = await adminApi.pushBiometricPunch({
        enrollId: testStudentId,
        punchType: testPunchType,
        deviceId: 'RP-BIO-VIJAY-NAGAR-01',
        location: '9HQ City Walk, Block A, 129, Vijay Nagar, Indore'
      });
      if (res && res.success) {
        setPunchStatusMsg(`✅ Biometric Punch Recorded for ${res.data?.studentName || testStudentId} (${testPunchType})`);
        fetchAttendance();
        setTimeout(() => {
          setPunchStatusMsg('');
          setTestPunchOpen(false);
        }, 1800);
      } else {
        setPunchStatusMsg(`⚠️ ${res?.message || 'Failed to record punch'}`);
      }
    } catch (err) {
      setPunchStatusMsg(`❌ Error: ${err.message}`);
    }
  };

  // Filtered logs
  const filteredLogs = logs.filter((log) => {
    if (activeTab === 'PRESENT' && log.status !== 'PRESENT') return false;
    if (activeTab === 'ABSENT' && log.status !== 'ABSENT') return false;
    if (batchFilter !== 'ALL' && !log.batchTier?.toLowerCase().includes(batchFilter.toLowerCase())) return false;
    if (search) {
      const q = search.toLowerCase();
      const matchName = log.studentName?.toLowerCase().includes(q);
      const matchMobile = log.mobile?.includes(q);
      const matchId = log.studentId?.toLowerCase().includes(q);
      if (!matchName && !matchMobile && !matchId) return false;
    }
    return true;
  });

  const exportCsv = () => {
    window.open('http://localhost:5002/api/attendance/export-csv', '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* 1. Header Banner & Biometric Hardware Status */}
      <div className="bg-gradient-to-r from-brand-navy via-[#102A5C] to-brand-navy rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>eSSL / Realtime Biometric Cloud Synced</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Classroom Biometric Attendance &amp; Fingerprint Ledger
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time daily attendance logged directly from the biometric fingerprint terminal at Vijay Nagar Main Campus. Auto-syncs student In-Time, Out-Time, and triggers parent WhatsApp alerts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setTestPunchOpen(true)}
              className="bg-brand-yellow hover:bg-amber-400 text-brand-navy font-black text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-lg transition flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Fingerprint className="w-4 h-4" />
              <span>Simulate Fingerprint Punch</span>
            </button>

            <button
              onClick={exportCsv}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-white/20 shadow transition flex items-center gap-2"
              title="Download official monthly CSV for Academic Director"
            >
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Export Director CSV</span>
            </button>

            <button
              onClick={fetchAttendance}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
              title="Refresh attendance records"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Biometric Terminal Metadata */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-yellow" />
            <span><strong>Terminal:</strong> 9HQ City Walk, Block A, 129, Vijay Nagar</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span><strong>Device:</strong> SilkBio-101 / Realtime 4K Cloud Terminal</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-yellow" />
            <span><strong>Last Sync:</strong> {todayData?.biometricStatus?.lastSync || 'Live Real-time'}</span>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
            <Users className="w-5 h-5 text-brand-navy" />
          </div>
          <h3 className="text-3xl font-black text-brand-navy mt-2">
            {todayData ? todayData.totalEnrolled : '--'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">Class 11, 12 &amp; Dropper Batches</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Present Today</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className="text-3xl font-black text-emerald-600 mt-2">
            {todayData ? todayData.totalPresent : '--'}
          </h3>
          <p className="text-xs text-emerald-700 font-bold mt-1">
            {todayData ? `${todayData.attendancePercentage}% Attendance Rate` : ''}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Absent / Unmarked</span>
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
          <h3 className="text-3xl font-black text-red-600 mt-2">
            {todayData ? todayData.totalAbsent : '--'}
          </h3>
          <p className="text-xs text-red-600 font-bold mt-1">WhatsApp Parent Alerts Ready</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Shift Timing</span>
            <Clock className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="text-2xl font-black text-brand-navy mt-2">
            08:00 AM – 01:30 PM
          </h3>
          <p className="text-xs text-slate-500 mt-1">Morning Classroom Shift</p>
        </div>

      </div>

      {/* 3. Filters & Attendance Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'ALL' ? 'bg-brand-navy text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Records ({logs.length})
            </button>
            <button
              onClick={() => setActiveTab('PRESENT')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'PRESENT' ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Present Only
            </button>
            <button
              onClick={() => setActiveTab('ABSENT')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                activeTab === 'ABSENT' ? 'bg-red-600 text-white shadow' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Absent Candidates
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Batch Filter */}
            <select
              value={batchFilter}
              onChange={(e) => setBatchFilter(e.target.value)}
              className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none focus:ring-2 focus:ring-brand-navy"
            >
              <option value="ALL">All Batches</option>
              <option value="JEE">JEE Batches</option>
              <option value="NEET">NEET Batches</option>
              <option value="Dropper">Dropper / Leader</option>
              <option value="Class 11">Class 11th</option>
              <option value="Class 12">Class 12th</option>
            </select>

            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name or mobile..."
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 outline-none focus:ring-2 focus:ring-brand-navy w-56 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Attendance Records Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Student Name &amp; ID</th>
                <th className="py-3.5 px-4">Batch / Target</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Punch-In Time</th>
                <th className="py-3.5 px-4">Punch-Out Time</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Terminal / Source</th>
                <th className="py-3.5 px-4 text-right">Parent WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-brand-navy text-sm">{log.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{log.studentId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {log.batchTier || 'Regular Classroom'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono">
                      {log.date}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-700">
                      {log.inTime ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{log.inTime}</span>
                        </div>
                      ) : (
                        <span className="text-slate-300">--</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-indigo-700">
                      {log.outTime ? (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{log.outTime}</span>
                        </div>
                      ) : (
                        <span className="text-amber-600 bg-amber-50 px-2 py-0.5 rounded text-[10px]">In Class</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {log.status === 'PRESENT' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>PRESENT</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black bg-red-100 text-red-800">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          <span>ABSENT</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      <div className="font-semibold text-[11px] flex items-center gap-1 text-slate-700">
                        <Fingerprint className="w-3.5 h-3.5 text-brand-navy" />
                        <span>{log.punchSource || 'BIOMETRIC_FINGERPRINT'}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">{log.deviceLocation || 'Vijay Nagar'}</div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {log.mobile ? (
                        <a
                          href={`https://wa.me/91${log.mobile}?text=${encodeURIComponent(
                            `Dear Parent, attendance update for your ward ${log.studentName}: Status is ${log.status} at Rankers Path Vijay Nagar Centre on ${log.date} (In-Time: ${log.inTime || 'N/A'}).`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold border border-emerald-200 transition"
                          title="Send instant WhatsApp message to parents"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>Send Alert</span>
                        </a>
                      ) : (
                        <span className="text-slate-300">--</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400">
                    No attendance records match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 4. Fingerprint Simulator Modal (for Testing Biometric Flow) */}
      {testPunchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5 text-emerald-600" />
                <h3 className="font-black text-brand-navy text-lg">Biometric Punch Simulator</h3>
              </div>
              <button
                onClick={() => setTestPunchOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Use this tool to simulate a student placing their finger on the terminal at Vijay Nagar Centre.
            </p>

            <form onSubmit={handleTestPunch} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  value={testStudentId}
                  onChange={(e) => setTestStudentId(e.target.value)}
                  className="w-full text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 outline-none focus:ring-2 focus:ring-brand-navy"
                >
                  <option value="student-dev-1">Rankers Student (9131435511)</option>
                  <option value="student-aarav-sharma">Aarav Sharma (9826012345)</option>
                  <option value="student-ananya-verma">Ananya Verma (9826023456)</option>
                  <option value="student-rohan-gupta">Rohan Gupta (9826034567)</option>
                  <option value="student-priya-patel">Priya Patel (9826045678)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Punch Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTestPunchType('IN')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      testPunchType === 'IN'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    🟢 Punch IN (Arrival)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTestPunchType('OUT')}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      testPunchType === 'OUT'
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow'
                        : 'bg-slate-50 text-slate-600 border-slate-200'
                    }`}
                  >
                    🔵 Punch OUT (Departure)
                  </button>
                </div>
              </div>

              {punchStatusMsg && (
                <div className="p-3 bg-slate-100 rounded-xl text-xs font-bold text-slate-800 text-center animate-in fade-in">
                  {punchStatusMsg}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTestPunchOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-xs font-black bg-brand-navy hover:bg-brand-navyLight text-brand-yellow shadow-lg transition flex items-center gap-1.5"
                >
                  <Fingerprint className="w-4 h-4" />
                  <span>Execute Punch</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
