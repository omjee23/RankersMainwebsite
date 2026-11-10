import React, { useState } from 'react';
import { X, Maximize2, Minimize2, Radio, Video, ExternalLink, ShieldCheck, Users } from 'lucide-react';

export default function JitsiLiveModal({ isOpen, onClose, liveClass, user }) {
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isOpen || !liveClass) return null;

  const studentName = user?.fullName || 'Rankers Student';
  const roomName = liveClass.roomName || 'RankersPath_Live_Class';
  
  // Construct privacy-enhanced Jitsi URL with student display name preset
  const jitsiSrc = `https://meet.jit.si/${roomName}#userInfo.displayName=${encodeURIComponent(studentName)}&config.prejoinPageEnabled=false&config.startWithAudioMuted=true`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className={`bg-slate-900 text-white rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-300 border border-slate-700 ${
        isFullScreen ? 'w-full h-full fixed inset-0 rounded-none' : 'w-full max-w-6xl h-[88vh]'
      }`}>
        
        {/* Top Header Bar */}
        <div className="bg-brand-navy px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-brand-yellow/30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-rose-500 text-white font-black text-[10px] uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
              Jitsi Live Classroom
            </span>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white line-clamp-1">
                {liveClass.title}
              </h3>
              <p className="text-[11px] text-slate-300">
                Subject: <strong className="text-brand-yellow">{liveClass.subject}</strong> &bull; Mentor: {liveClass.facultyName} &bull; Studio: <span className="text-emerald-400 font-bold">{liveClass.classroomStudio || 'Epson 75" 4K Smart Board (Vijay Nagar)'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={liveClass.jitsiUrl || `https://meet.jit.si/${roomName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition text-slate-200"
              title="Open in Standalone Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Full Tab</span>
            </a>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 transition"
              title={isFullScreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition"
              title="Leave Live Class"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Embedded Jitsi Meeting Frame */}
        <div className="flex-1 w-full h-full bg-black relative">
          <iframe
            src={jitsiSrc}
            title={liveClass.title}
            className="w-full h-full border-0"
            allow="camera; microphone; display-capture; fullscreen; clipboard-read; clipboard-write; autoplay"
            allowFullScreen
          />
        </div>

        {/* Bottom Status strip */}
        <div className="bg-slate-950 px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 flex-shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Room: <span className="font-mono text-slate-300">{roomName}</span></span>
          </div>
          <span className="text-slate-500">Audio/Camera permissions required for interactive doubts</span>
        </div>

      </div>
    </div>
  );
}
