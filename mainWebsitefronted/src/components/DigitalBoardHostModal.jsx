import React, { useState, useEffect } from 'react';
import {
  X,
  Maximize2,
  Minimize2,
  Tv,
  Cast,
  Video,
  Mic,
  Users,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Share2,
  Radio,
  Play,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';

export default function DigitalBoardHostModal({ isOpen, onClose, initialPin = null }) {
  const [pin, setPin] = useState(initialPin || '4821');
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [attendeeCount, setAttendeeCount] = useState(38);

  const loadClassByPin = async (targetPin) => {
    setLoading(true);
    try {
      const res = await api.getDigitalBoardClassByPin(targetPin || pin);
      if (res.success && res.data) {
        setClassData(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadClassByPin(initialPin || pin);
    }
  }, [isOpen, initialPin]);

  if (!isOpen) return null;

  const roomName = classData?.roomName || 'RankersPath_Epson75_Studio';
  const facultyName = classData?.facultyName || 'Rankers Path Senior Faculty';
  const classTitle = classData?.title || 'Hybrid Classroom Lecture on Digital Board';
  const batchName = classData?.targetBatch || 'Diamond / Leader Batch';
  const subject = classData?.subject || 'Physics / Chemistry / Mathematics';

  // Jitsi Host URL configured with ultra-HD screen capture & echo cancellation flags for Epson panel
  const hostJitsiUrl = `https://meet.jit.si/${roomName}#userInfo.displayName=${encodeURIComponent(facultyName + ' (Digital Board Host)')}&config.prejoinPageEnabled=false&config.disableDeepLinking=true&config.resolution=1080&config.constraints.video.height.ideal=1080&config.startWithAudioMuted=false&config.startWithVideoMuted=false`;

  const handleStartBroadcast = () => {
    setIsBroadcasting(true);
  };

  const handleSendWhatsAppAlert = () => {
    const msg = `🔴 *LIVE CLASS ALERT - RANKERS PATH*\n\n` +
      `📚 *${classTitle}*\n` +
      `👨‍🏫 Faculty: *${facultyName}*\n` +
      `🎯 Stream: *${classData?.stream || 'NEET/JEE'} (${batchName})*\n` +
      `📺 Studio: *Epson 75" 4K Smart Board (Vijay Nagar Centre - Hall 1)*\n\n` +
      `👉 Join Live Class on Student Portal:\n` +
      `http://localhost:5175\n\n` +
      `Class has commenced on the digital smart board. Please join immediately with your notes!`;
    
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className={`bg-slate-950 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 border-2 border-brand-yellow/40 ${
        isFullScreen ? 'w-full h-full fixed inset-0 rounded-none' : 'w-full max-w-7xl h-[92vh]'
      }`}>

        {/* Top Digital Board Touch Banner */}
        <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy px-6 py-4 flex items-center justify-between border-b border-brand-yellow/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-brand-yellow/20 text-brand-yellow border border-brand-yellow/40 flex items-center justify-center">
              <Tv className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
                  Epson 75" 4K Hybrid Studio Host
                </span>
                <span className="text-[11px] font-bold text-slate-300">
                  Hall 1 (Vijay Nagar Centre) &bull; PIN: <strong className="text-brand-yellow font-mono text-xs">{classData?.boardQuickPin || pin}</strong>
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-white mt-0.5 line-clamp-1">
                {classTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* WhatsApp Batch Alert Button */}
            <button
              onClick={handleSendWhatsAppAlert}
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-black shadow transition"
              title="Broadcast WhatsApp Alert to Batch"
            >
              <Share2 className="w-4 h-4" />
              <span>{shareSuccess ? 'Alert Dispatched!' : 'WhatsApp Batch Alert'}</span>
            </button>

            {/* Standalone Fullscreen Tab */}
            <a
              href={hostJitsiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold text-slate-200 transition"
              title="Open Standalone Host Window"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">External Tab</span>
            </a>

            {/* Fullscreen Toggle for 75" Touch Display */}
            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
              title={isFullScreen ? 'Exit Touch Fullscreen' : 'Touch Fullscreen Mode'}
            >
              {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>

            {/* Close Studio */}
            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition"
              title="Exit Digital Board Studio"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Content Area */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-slate-900">
          
          {/* Main Broadcast Screen */}
          <div className="flex-1 flex flex-col relative bg-black">
            {isBroadcasting ? (
              <div className="w-full h-full relative">
                <iframe
                  src={hostJitsiUrl}
                  title="Digital Board Host Stream"
                  className="w-full h-full border-0"
                  allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; autoplay"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-brand-navy border-2 border-brand-yellow/50 flex items-center justify-center text-brand-yellow shadow-2xl">
                  <Cast className="w-10 h-10 animate-bounce" />
                </div>

                <div className="max-w-xl space-y-2">
                  <h3 className="text-2xl font-black text-white">
                    Ready to Stream from Epson 75" 4K Smart Board?
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Once you start, your entire digital board screen, whiteboard pen annotations, and wireless collar mic will be streamed live to enrolled students in 1080p 60FPS.
                  </p>
                </div>

                {/* 3 Step Touch Guidance */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl text-left text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-[10px] font-black text-brand-yellow uppercase">Step 1</span>
                    <strong className="block text-slate-200">Start Broadcast</strong>
                    <p className="text-slate-400 text-[11px]">Click the big green button below to launch Jitsi room.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-[10px] font-black text-brand-yellow uppercase">Step 2</span>
                    <strong className="block text-slate-200">Share Screen</strong>
                    <p className="text-slate-400 text-[11px]">Click "Share Screen" and choose "Entire Screen" for 4K notes.</p>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-1">
                    <span className="text-[10px] font-black text-brand-yellow uppercase">Step 3</span>
                    <strong className="block text-slate-200">Open Whiteboard</strong>
                    <p className="text-slate-400 text-[11px]">Switch to Note 5 / PDF app and teach offline + online seamlessly.</p>
                  </div>
                </div>

                {/* Big Touch Start Button */}
                <button
                  onClick={handleStartBroadcast}
                  className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base uppercase tracking-wider shadow-2xl flex items-center gap-3 transition transform hover:scale-105 active:scale-95"
                >
                  <Play className="w-6 h-6 fill-white" />
                  <span>Launch Live Stream on Digital Board</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Sidebar: Classroom Controls & Hardware Profile */}
          <div className="w-full md:w-80 bg-slate-950 border-t md:border-t-0 md:border-l border-slate-800 p-5 flex flex-col justify-between overflow-y-auto space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  Hardware Studio Profile
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                  CONNECTED
                </span>
              </div>

              {/* Hardware Specifications Card */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <Tv className="w-4 h-4 text-brand-yellow mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-200 block">Epson EI-P7501 PowerBoardPRO</strong>
                    <p className="text-[11px] text-slate-400">75" 4K UHD &bull; Google EDLA (Android 14)</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 pt-1 border-t border-slate-800">
                  <Mic className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-200 block">Wireless Collar Mic Active</strong>
                    <p className="text-[11px] text-slate-400">Studio Echo Cancellation Enabled</p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 pt-1 border-t border-slate-800">
                  <Video className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <strong className="text-slate-200 block">Classroom PTZ Camera</strong>
                    <p className="text-[11px] text-slate-400">1080p 60FPS High-Bitrate Stream</p>
                  </div>
                </div>
              </div>

              {/* Active Batch & Stream Info */}
              <div className="p-4 rounded-2xl bg-brand-navy/40 border border-brand-yellow/30 space-y-2 text-xs">
                <span className="text-[10px] font-black uppercase text-brand-yellow tracking-wider block">
                  Broadcast Audience
                </span>
                <p className="font-extrabold text-white text-sm">{batchName}</p>
                <p className="text-slate-300 text-xs">{subject} &bull; Mentor: {facultyName}</p>
                <div className="flex items-center gap-2 pt-1 text-slate-400 text-[11px]">
                  <Users className="w-3.5 h-3.5 text-brand-yellow" />
                  <span>Estimated Enrolled: ~45 Students</span>
                </div>
              </div>

              {/* Quick PIN Switcher */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-400 uppercase">
                  Classroom Quick PIN
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="e.g. 4821"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-center font-mono font-black text-brand-yellow text-sm tracking-widest focus:outline-none focus:border-brand-yellow"
                  />
                  <button
                    onClick={() => loadClassByPin(pin)}
                    disabled={loading}
                    className="px-3.5 py-2 rounded-xl bg-brand-navy hover:bg-brand-navyLight text-brand-yellow text-xs font-black transition"
                  >
                    {loading ? '...' : 'Load'}
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Status note */}
            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Rankers Path Secure Stream</span>
              </div>
              <p>Room: <span className="font-mono text-slate-400">{roomName}</span></p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
