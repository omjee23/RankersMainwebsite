import React, { useState, useEffect } from 'react';
import {
  Video,
  Radio,
  Calendar,
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
  Tv,
  Cast,
  Copy,
  Check,
  Send,
  Mic
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function LiveClassesDesk() {
  const [classes, setClasses] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(false);
  const [streamFilter, setStreamFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'timetable'

  // Digital Board Hybrid Studio State
  const [copiedPin, setCopiedPin] = useState(null);
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Biology',
    stream: 'NEET',
    targetBatch: 'NEET 2026 Droppers',
    facultyName: 'Dr. Rajesh Sharma',
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    dayOfWeek: 'Monday',
    roomName: '',
    status: 'SCHEDULED',
    isOpenToAll: false,
    googleDriveRecordingUrl: '',
    recordingEmail: 'recordings@rankerspath.in',
    description: '',
    isDigitalBoardLive: true,
    classroomStudio: 'Epson 75" 4K Smart Board (Studio Hall 1 - Vijay Nagar)',
    boardQuickPin: String(Math.floor(1000 + Math.random() * 9000))
  });

  const loadData = async () => {
    setLoading(true);
    const [cRes, tRes] = await Promise.all([
      adminApi.getLiveClasses({ stream: streamFilter, status: statusFilter }),
      adminApi.getTimetable({ stream: streamFilter })
    ]);
    setLoading(false);
    if (cRes.data) setClasses(cRes.data);
    if (tRes.data) setTimetable(tRes.data);
  };

  useEffect(() => {
    loadData();
  }, [streamFilter, statusFilter]);

  const handleStartBoardBroadcast = async (classItem) => {
    if (!classItem) return;
    setBroadcastLoading(true);
    try {
      const res = await adminApi.startBoardBroadcast(classItem.id);
      if (res.success && res.data) {
        alert(`🔴 Broadcast Started! "${classItem.title}" is now LIVE on the Student Portal!`);
        loadData();
        if (res.data.whatsappShareUrl) {
          if (window.confirm('Do you want to send the WhatsApp Live Alert to the batch right now?')) {
            window.open(res.data.whatsappShareUrl, '_blank');
          }
        }
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setBroadcastLoading(false);
    }
  };

  const handleSendWhatsAppBatchAlert = (c) => {
    const msg = `🔴 *LIVE CLASS ALERT - RANKERS PATH*\n\n` +
      `📚 *${c.title}*\n` +
      `👨‍🏫 Faculty: *${c.facultyName}*\n` +
      `🎯 Stream: *${c.stream} (${c.targetBatch || 'All Enrolled'})*\n` +
      `📺 Studio: *Epson 75" 4K Smart Board (Vijay Nagar Hall 1)*\n\n` +
      `👉 Join Live Class on Student Portal:\n` +
      `http://localhost:5175\n\n` +
      `Class has commenced on the digital smart board. Please join immediately with your notebook!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCopyPin = (pinText) => {
    navigator.clipboard.writeText(pinText);
    setCopiedPin(pinText);
    setTimeout(() => setCopiedPin(null), 3000);
  };

  const handleOpenAdd = () => {
    setEditingClass(null);
    const autoRoom = `RankersPath_Live_${Math.floor(1000 + Math.random() * 9000)}`;
    setFormData({
      title: '',
      subject: 'Biology',
      stream: 'NEET',
      targetBatch: 'NEET 2026 Droppers',
      facultyName: 'Dr. Rajesh Sharma',
      date: new Date().toISOString().split('T')[0],
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      dayOfWeek: 'Monday',
      roomName: autoRoom,
      status: 'SCHEDULED',
      isOpenToAll: false,
      googleDriveRecordingUrl: '',
      recordingEmail: 'recordings@rankerspath.in',
      description: '',
      isDigitalBoardLive: true,
      classroomStudio: 'Epson 75" 4K Smart Board (Studio Hall 1 - Vijay Nagar)',
      boardQuickPin: String(Math.floor(1000 + Math.random() * 9000))
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingClass(item);
    setFormData({
      title: item.title,
      subject: item.subject,
      stream: item.stream,
      targetBatch: item.targetBatch || 'All Enrolled',
      facultyName: item.facultyName || 'Rankers Faculty Team',
      date: item.date || new Date().toISOString().split('T')[0],
      startTime: item.startTime || '10:00 AM',
      endTime: item.endTime || '',
      dayOfWeek: item.dayOfWeek || 'Monday',
      roomName: item.roomName || '',
      status: item.status || 'SCHEDULED',
      isOpenToAll: Boolean(item.isOpenToAll),
      googleDriveRecordingUrl: item.googleDriveRecordingUrl || '',
      recordingEmail: item.recordingEmail || 'recordings@rankerspath.in',
      description: item.description || '',
      isDigitalBoardLive: item.isDigitalBoardLive !== undefined ? Boolean(item.isDigitalBoardLive) : true,
      classroomStudio: item.classroomStudio || 'Epson 75" 4K Smart Board (Studio Hall 1 - Vijay Nagar)',
      boardQuickPin: item.boardQuickPin || String(Math.floor(1000 + Math.random() * 9000))
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.date || !formData.startTime) {
      alert('Please fill in title, date, and start time');
      return;
    }

    if (editingClass) {
      const res = await adminApi.updateLiveClass(editingClass.id, formData);
      if (res.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Failed to update');
      }
    } else {
      const res = await adminApi.createLiveClass(formData);
      if (res.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert(res.message || 'Failed to create');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const res = await adminApi.updateLiveClass(id, { status: newStatus });
    if (res.success) {
      loadData();
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to cancel & delete "${title}"?`)) return;
    const res = await adminApi.deleteLiveClass(id);
    if (res.success) {
      loadData();
    } else {
      alert(res.message || 'Failed to delete');
    }
  };

  const liveCount = classes.filter(c => c.status === 'LIVE').length;
  const openCount = classes.filter(c => c.isOpenToAll).length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-rose-100 text-rose-600">
              <Radio className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-brand-navy">Live Classes &amp; Timetable Desk</h2>
              <p className="text-xs text-slate-500">
                Jitsi Meet integration with Open-to-All masterclasses, weekly period timetables, and Google Drive recording archives.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'list' ? 'bg-brand-navy text-white shadow' : 'text-slate-600'
              }`}
            >
              Class List
            </button>
            <button
              onClick={() => setViewMode('timetable')}
              className={`px-3 py-1.5 rounded-lg transition ${
                viewMode === 'timetable' ? 'bg-brand-navy text-white shadow' : 'text-slate-600'
              }`}
            >
              Weekly Timetable
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-5 py-3 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl font-black text-xs uppercase tracking-wider shadow transition flex items-center gap-2 flex-shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule New Class</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Live Right Now</span>
            <p className="text-2xl font-black text-rose-600 mt-1 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping inline-block" />
              {liveCount} Active
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Scheduled Sessions</span>
            <p className="text-2xl font-black text-blue-600 mt-1">
              {classes.filter(c => c.status === 'SCHEDULED').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Open-to-All Sessions</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{openCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase">Completed / Archived</span>
            <p className="text-2xl font-black text-slate-700 mt-1">
              {classes.filter(c => c.status === 'COMPLETED').length}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Digital Board Hybrid Studio Controller */}
      {(() => {
        const liveOrUpcoming = classes.find(c => c.status === 'LIVE') ||
          classes.find(c => c.status === 'SCHEDULED') ||
          classes[0];
        const activePin = liveOrUpcoming?.boardQuickPin || '4821';
        const boardLaunchUrl = `http://localhost:5175/?studio=true&pin=${activePin}`;

        return (
          <div className="bg-gradient-to-br from-slate-900 via-brand-navy to-slate-900 text-white rounded-3xl p-6 sm:p-7 border-2 border-brand-yellow/40 shadow-xl space-y-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div className="flex items-start gap-4">
                <span className="p-3 rounded-2xl bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/30 flex items-center justify-center">
                  <Tv className="w-7 h-7 animate-pulse" />
                </span>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white font-black text-[10px] uppercase tracking-wider">
                      Hardware Connected
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40 font-mono text-[10px] font-bold">
                      Epson EI-P7501 (75" 4K UHD &bull; Android 14 EDLA)
                    </span>
                    <span className="text-[11px] text-slate-400">
                      Studio Hall 1 (9HQ City Walk, Vijay Nagar, Indore)
                    </span>
                  </div>
                  <h3 className="text-xl font-black text-white mt-1">
                    Digital Smart Board Classroom Studio Desk
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Stream live classroom whiteboard pen strokes, slides, and wireless collar mic directly to student dashboard with 0 latency.
                  </p>
                </div>
              </div>

              {liveOrUpcoming && (
                <div className="flex items-center gap-3">
                  <a
                    href={boardLaunchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 transition transform hover:scale-105"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Launch on Digital Board (Touch Screen)</span>
                  </a>
                </div>
              )}
            </div>

            {/* Studio Live Session Controller */}
            {liveOrUpcoming ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Active Session Info */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-brand-yellow tracking-wider">
                      Classroom Broadcast Target
                    </span>
                    <span className={`px-2 py-0.5 rounded font-black text-[10px] uppercase ${
                      liveOrUpcoming.status === 'LIVE' ? 'bg-rose-500 text-white animate-pulse' : 'bg-blue-500/20 text-blue-300'
                    }`}>
                      {liveOrUpcoming.status === 'LIVE' ? '🔴 LIVE NOW' : 'SCHEDULED'}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-base font-extrabold text-white line-clamp-1">{liveOrUpcoming.title}</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      {liveOrUpcoming.subject} &bull; Mentor: <strong className="text-emerald-400">{liveOrUpcoming.facultyName}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Batch: <span className="font-semibold text-slate-300">{liveOrUpcoming.targetBatch}</span> &bull; Room: <span className="font-mono text-slate-300">{liveOrUpcoming.roomName}</span>
                    </p>
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    {liveOrUpcoming.status !== 'LIVE' ? (
                      <button
                        onClick={() => handleStartBoardBroadcast(liveOrUpcoming)}
                        disabled={broadcastLoading}
                        className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider shadow transition flex items-center justify-center gap-2"
                      >
                        <Radio className="w-4 h-4 animate-ping" />
                        <span>{broadcastLoading ? 'Starting...' : 'Go Live on Student Portal'}</span>
                      </button>
                    ) : (
                      <span className="w-full py-2 text-center rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold">
                        ⚡ Currently Live on Student Portal
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Board Access PIN & URL */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                  <span className="text-[10px] font-black uppercase text-brand-yellow tracking-wider block">
                    Fast Launch PIN for Digital Board
                  </span>
                  <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-center space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Board Access 4-Digit PIN</span>
                    <strong className="text-3xl font-mono font-black text-brand-yellow tracking-widest block">
                      {activePin}
                    </strong>
                    <p className="text-[10px] text-slate-400">Open Chrome on Epson Board &bull; Enter PIN or visit Fast URL</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopyPin(boardLaunchUrl)}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition flex items-center justify-center gap-1.5"
                    >
                      {copiedPin === boardLaunchUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPin === boardLaunchUrl ? 'URL Copied!' : 'Copy Board URL'}</span>
                    </button>

                    <button
                      onClick={() => handleSendWhatsAppBatchAlert(liveOrUpcoming)}
                      className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black transition flex items-center gap-1"
                      title="Send WhatsApp Alert to Enrolled Batch"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>WhatsApp Batch</span>
                    </button>
                  </div>
                </div>

                {/* Hardware Checklist & Settings */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2.5 text-xs">
                  <span className="text-[10px] font-black uppercase text-brand-yellow tracking-wider block">
                    Epson 75" Classroom Audio/Video Setup
                  </span>

                  <div className="space-y-2 text-[11px] text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span><strong>4K Display Screen Share:</strong> Captures Note 5 pen strokes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span><strong>Wireless Collar Mic:</strong> Boya / K8 receiver in USB port</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      <span><strong>PTZ Camera / Webcam:</strong> Mounted on top of 75" panel</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                      <span><strong>Broadband LAN / 5GHz:</strong> Min 20 Mbps stable speed</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Bitrate Optimization:</span>
                    <span className="font-bold text-brand-yellow">1080p 60FPS Fluid Strokes</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No active class scheduled. Click "Schedule New Class" above to set up today's live lecture.
              </div>
            )}
          </div>
        );
      })()}

      {/* Filter Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Streams / Batches</option>
            <option value="NEET">NEET UG</option>
            <option value="JEE_MAIN">JEE Main</option>
            <option value="JEE_ADVANCED">JEE Advanced</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value="LIVE">Live Now</option>
            <option value="SCHEDULED">Upcoming / Scheduled</option>
            <option value="COMPLETED">Completed &amp; Recorded</option>
          </select>
        </div>

        <button
          onClick={loadData}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* View Mode 1: Class List */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs font-bold">
              Loading live classes...
            </div>
          ) : classes.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-xs">
              No live classes scheduled matching filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Class Title &amp; Faculty</th>
                    <th className="py-3.5 px-4">Target Batch</th>
                    <th className="py-3.5 px-4">Date &amp; Time Slot</th>
                    <th className="py-3.5 px-4">Jitsi Room</th>
                    <th className="py-3.5 px-4">Status &amp; Actions</th>
                    <th className="py-3.5 px-4">Drive Recording</th>
                    <th className="py-3.5 px-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {classes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition">
                      <td className="py-4 px-4 max-w-xs">
                        <div className="flex items-center gap-2">
                          {c.isOpenToAll && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 uppercase">
                              Open to All
                            </span>
                          )}
                          <span className="font-extrabold text-slate-900 text-sm line-clamp-1">{c.title}</span>
                        </div>
                        <p className="text-[11px] text-brand-navy font-bold mt-0.5">
                          {c.subject} &bull; {c.facultyName}
                        </p>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                          {c.stream} &bull; {c.targetBatch}
                        </span>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-bold text-slate-900">{c.dayOfWeek}, {c.date}</p>
                        <p className="text-[11px] text-slate-500">{c.startTime} - {c.endTime || 'Ongoing'}</p>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <a
                            href={c.jitsiUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-mono text-[11px] font-bold"
                            title="Launch Standard Jitsi Room"
                          >
                            <Video className="w-3 h-3" />
                            <span>Jitsi</span>
                          </a>

                          <a
                            href={`http://localhost:5175/?studio=true&pin=${c.boardQuickPin || '4821'}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-mono text-[11px] font-black border border-emerald-300 shadow-xs"
                            title="Launch Digital Board Host Studio (Epson 75)"
                          >
                            <Tv className="w-3 h-3 text-emerald-600" />
                            <span>Board Host</span>
                          </a>

                          <button
                            type="button"
                            onClick={() => handleSendWhatsAppBatchAlert(c)}
                            className="p-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition"
                            title="Send WhatsApp Alert to Enrolled Batch"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <select
                            value={c.status}
                            onChange={(e) => handleStatusChange(c.id, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider ${
                              c.status === 'LIVE' ? 'bg-rose-500 text-white animate-pulse' :
                              c.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                              'bg-slate-100 text-slate-700'
                            }`}
                          >
                            <option value="SCHEDULED">Scheduled</option>
                            <option value="LIVE">🔴 LIVE NOW</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-4 px-4 whitespace-nowrap">
                        {c.googleDriveRecordingUrl ? (
                          <a
                            href={c.googleDriveRecordingUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 text-[11px] font-bold"
                          >
                            <FolderOpen className="w-3 h-3 text-amber-600" />
                            <span>Drive Folder</span>
                          </a>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">No recording yet</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => handleOpenEdit(c)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-blue-600 inline-block"
                          title="Edit Class"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(c.id, c.title)}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600 inline-block"
                          title="Delete Class"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* View Mode 2: Weekly Timetable */}
      {viewMode === 'timetable' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-black text-slate-900">Weekly Lecture Timetable</h3>
              <p className="text-xs text-slate-500">Live batch schedule configured across all 7 days of the week.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAYS_OF_WEEK.map((day) => {
              const dayClasses = timetable[day] || [];

              return (
                <div key={day} className="rounded-2xl border-2 border-slate-200 p-4 space-y-3 bg-slate-50/50">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="font-extrabold text-sm text-brand-navy">{day}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold">
                      {dayClasses.length} Sessions
                    </span>
                  </div>

                  {dayClasses.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-4 text-center">Self-study / No scheduled live class</p>
                  ) : (
                    <div className="space-y-2">
                      {dayClasses.map((dc) => (
                        <div key={dc.id} className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {dc.startTime} - {dc.endTime}
                            </span>
                            {dc.isOpenToAll ? (
                              <span className="text-[9px] font-black text-emerald-600 uppercase bg-emerald-50 px-1 rounded">Open</span>
                            ) : (
                              <span className="text-[9px] font-black text-brand-navy uppercase bg-slate-100 px-1 rounded">{dc.stream}</span>
                            )}
                          </div>
                          <p className="font-extrabold text-xs text-slate-900 line-clamp-1">{dc.title}</p>
                          <p className="text-[11px] text-slate-500">{dc.subject} &bull; {dc.facultyName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Schedule / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-brand-navy">
                {editingClass ? 'Edit Live Class Schedule' : 'Schedule New Live Class'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-900 font-bold">Class Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Molecular Genetics & DNA Replication Live Problem Solving"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="Biology">Biology</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="General">General / All Subjects</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Stream Category *</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="NEET">NEET UG</option>
                    <option value="JEE_MAIN">JEE Main</option>
                    <option value="JEE_ADVANCED">JEE Advanced</option>
                    <option value="ALL">All Enrolled Streams</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Target Batch Name</label>
                  <input
                    type="text"
                    placeholder="e.g. NEET 2026 Droppers / Super 30"
                    value={formData.targetBatch}
                    onChange={(e) => setFormData({ ...formData, targetBatch: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Faculty Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Rajesh Sharma"
                    value={formData.facultyName}
                    onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Day of Week</label>
                  <select
                    value={formData.dayOfWeek}
                    onChange={(e) => setFormData({ ...formData, dayOfWeek: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Start Time *</label>
                  <input
                    type="text"
                    placeholder="e.g. 10:00 AM"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              {/* Digital Smart Board & Hybrid Studio Setup */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tv className="w-4 h-4 text-indigo-700" />
                    <div>
                      <span className="font-extrabold text-sm text-indigo-950 block">Broadcast on Epson 75" 4K Smart Board</span>
                      <p className="text-[11px] text-indigo-800">
                        Enables whiteboard screen-share &amp; fast 4-digit PIN launcher for teacher on the digital panel.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.isDigitalBoardLive}
                    onChange={(e) => setFormData({ ...formData, isDigitalBoardLive: e.target.checked })}
                    className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                </div>

                {formData.isDigitalBoardLive && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-indigo-100">
                    <div>
                      <label className="block text-[11px] font-bold text-indigo-900 mb-1">Classroom Studio Venue</label>
                      <input
                        type="text"
                        value={formData.classroomStudio}
                        onChange={(e) => setFormData({ ...formData, classroomStudio: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-indigo-900 mb-1">Board Quick Access PIN</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={formData.boardQuickPin}
                        onChange={(e) => setFormData({ ...formData, boardQuickPin: e.target.value })}
                        placeholder="e.g. 4821"
                        className="w-full px-3 py-2 rounded-xl border border-indigo-200 bg-white text-xs font-mono font-bold text-indigo-950"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Open-to-All Toggle */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="font-extrabold text-sm text-emerald-950 block">Open to All Masterclass?</span>
                  <p className="text-[11px] text-emerald-800">
                    If enabled, any guest visitor or student can attend this live session without batch restrictions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isOpenToAll}
                  onChange={(e) => setFormData({ ...formData, isOpenToAll: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {/* Jitsi Room Name */}
              <div>
                <label className="block mb-1 text-slate-900 font-bold">Jitsi Meet Room Identifier</label>
                <input
                  type="text"
                  placeholder="e.g. RankersPath_NEET_Genetics_Live"
                  value={formData.roomName}
                  onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-[11px] focus:outline-none"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  Students connect automatically via Jitsi Meet at: <span className="font-mono text-brand-navy">https://meet.jit.si/{formData.roomName || '[room-name]'}</span>
                </p>
              </div>

              {/* Google Drive Recording Field */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold">
                  <FolderOpen className="w-4 h-4 text-amber-700" />
                  <span>Google Drive Recording Link (Post-Class Archive)</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. https://drive.google.com/drive/folders/..."
                  value={formData.googleDriveRecordingUrl}
                  onChange={(e) => setFormData({ ...formData, googleDriveRecordingUrl: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-amber-300 bg-white text-xs focus:outline-none"
                />
                <div className="flex items-center justify-between text-[11px] text-amber-800">
                  <span>Linked Recording Account:</span>
                  <span className="font-mono font-bold text-amber-950">{formData.recordingEmail}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow font-black rounded-xl uppercase tracking-wider shadow"
                >
                  {editingClass ? 'Save Changes' : 'Schedule Live Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
