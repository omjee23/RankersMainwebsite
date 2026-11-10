import React, { useState, useEffect } from 'react';
import {
  Play,
  Video,
  Film,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Search,
  RefreshCw,
  X,
  FileText,
  Clock,
  Layers,
  Sparkles,
  Eye
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

const SUBJECTS = ['ALL', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Mental Ability (MAT)'];

// Helper to extract clean 11-character YouTube video ID
function extractYouTubeVideoId(input) {
  if (!input) return '';
  const trimmed = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
  const match = trimmed.match(regExp);
  return match && match[1] ? match[1] : trimmed;
}

export default function RecordedLecturesDesk() {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [streamFilter, setStreamFilter] = useState('ALL');

  // Preview Video Modal
  const [previewVideo, setPreviewVideo] = useState(null);

  // Add / Edit Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLecture, setEditingLecture] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: 'Physics',
    chapter: '',
    lectureNo: 1,
    part: 'Part 1',
    partTitle: '',
    stream: 'ALL',
    videoUrl: '',
    videoId: '',
    duration: '45 Mins',
    facultyName: 'Er. Arvind Gupta',
    notesUrl: '',
    dppUrl: '',
    description: ''
  });

  const loadLectures = async () => {
    setLoading(true);
    const res = await adminApi.getRecordedLectures({
      subject: subjectFilter,
      stream: streamFilter,
      search: searchTerm
    });
    setLoading(false);
    if (res.data) setLectures(res.data);
  };

  useEffect(() => {
    loadLectures();
  }, [subjectFilter, streamFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadLectures();
  };

  const handleOpenAdd = () => {
    setEditingLecture(null);
    setFormData({
      title: '',
      subject: 'Physics',
      chapter: '',
      lectureNo: 1,
      part: 'Part 1',
      partTitle: '',
      stream: 'ALL',
      videoUrl: '',
      videoId: '',
      duration: '45 Mins',
      facultyName: 'Er. Arvind Gupta',
      notesUrl: '',
      dppUrl: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingLecture(item);
    setFormData({
      title: item.title,
      subject: item.subject,
      chapter: item.chapter || '',
      lectureNo: item.lectureNo || 1,
      part: item.part || `Part ${item.lectureNo || 1}`,
      partTitle: item.partTitle || '',
      stream: item.stream || 'ALL',
      videoUrl: item.videoUrl || '',
      videoId: item.videoId || '',
      duration: item.duration || '45 Mins',
      facultyName: item.facultyName || '',
      notesUrl: item.notesUrl || '',
      dppUrl: item.dppUrl || '',
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || (!formData.videoUrl && !formData.videoId)) {
      alert('Please fill in title and YouTube video URL or ID');
      return;
    }

    if (editingLecture) {
      const res = await adminApi.updateRecordedLecture(editingLecture.id, formData);
      if (res.success) {
        setIsModalOpen(false);
        loadLectures();
      } else {
        alert(res.message || 'Failed to update');
      }
    } else {
      const res = await adminApi.createRecordedLecture(formData);
      if (res.success) {
        setIsModalOpen(false);
        loadLectures();
      } else {
        alert(res.message || 'Failed to publish');
      }
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}"?`)) return;
    const res = await adminApi.deleteRecordedLecture(id);
    if (res.success) {
      loadLectures();
    } else {
      alert(res.message || 'Failed to delete');
    }
  };

  const currentExtractedId = extractYouTubeVideoId(formData.videoId || formData.videoUrl);

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-red-100 text-red-600">
              <Film className="w-6 h-6" />
            </span>
            <div>
              <h2 className="text-2xl font-black text-brand-navy">Subject-Wise Recorded Lectures (YouTube)</h2>
              <p className="text-xs text-slate-500">
                Organize chapter-wise video library powered by YouTube unlisted streams with attached lecture notes and DPPs.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl font-black text-xs uppercase tracking-wider shadow transition flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recorded Lecture</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Lectures</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{lectures.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-blue-500 uppercase">Physics</span>
          <p className="text-2xl font-black text-blue-600 mt-1">{lectures.filter(l => l.subject === 'Physics').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-500 uppercase">Chemistry</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{lectures.filter(l => l.subject === 'Chemistry').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-500 uppercase">Mathematics</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{lectures.filter(l => l.subject === 'Mathematics').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-500 uppercase">Biology</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{lectures.filter(l => l.subject === 'Biology').length}</p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by chapter, lecture title, faculty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none"
            />
          </form>

          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
          >
            <option value="ALL">All Streams</option>
            <option value="NEET">NEET UG</option>
            <option value="JEE_MAIN">JEE Main</option>
            <option value="JEE_ADVANCED">JEE Advanced</option>
            <option value="FOUNDATION">Foundation (9th & 10th)</option>
          </select>

          <button
            onClick={loadLectures}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {SUBJECTS.map(subj => (
            <button
              key={subj}
              onClick={() => setSubjectFilter(subj)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                subjectFilter === subj
                  ? 'bg-brand-navy text-brand-yellow shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {subj}
            </button>
          ))}
        </div>
      </div>

      {/* Lectures Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-400 text-xs font-bold bg-white rounded-3xl border border-slate-200">
          Loading recorded lectures library...
        </div>
      ) : lectures.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs bg-white rounded-3xl border border-slate-200">
          No recorded lectures found for the selected filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lectures.map((lec) => (
            <div
              key={lec.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
            >
              {/* Thumbnail Header with Play Button */}
              <div className="relative aspect-video bg-slate-900 group overflow-hidden">
                <img
                  src={`https://img.youtube.com/vi/${lec.videoId}/hqdefault.jpg`}
                  alt={lec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=60';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <button
                    onClick={() => setPreviewVideo(lec)}
                    className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl transform group-hover:scale-110 transition"
                    title="Play Preview"
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-mono font-bold">
                  {lec.duration}
                </div>
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-brand-navy/80 text-brand-yellow text-[10px] font-black uppercase">
                  {lec.subject}
                </div>
              </div>

              {/* Lecture Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 flex-wrap">
                    <span className="text-slate-800 font-extrabold">{lec.chapter}</span>
                    <span>&bull;</span>
                    <span className="px-1.5 py-0.2 rounded bg-brand-yellow/30 text-brand-navy font-black text-[10px]">
                      {lec.part || `Part ${lec.lectureNo}`}
                    </span>
                    {lec.partTitle && (
                      <span className="text-slate-500 font-medium italic">
                        ({lec.partTitle})
                      </span>
                    )}
                    <span>&bull;</span>
                    <span>Lec #{lec.lectureNo}</span>
                  </div>
                  <h4 className="font-extrabold text-sm text-slate-900 mt-1 line-clamp-2">
                    {lec.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Faculty: <strong className="text-brand-navy">{lec.facultyName}</strong>
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                    {lec.stream}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(lec)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-blue-600"
                      title="Edit"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(lec.id, lec.title)}
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Preview Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4">
            <div className="flex items-center justify-between p-4 border-b border-slate-800">
              <div>
                <h4 className="font-black text-sm text-brand-yellow">{previewVideo.title}</h4>
                <p className="text-xs text-slate-400">{previewVideo.subject} &bull; {previewVideo.chapter} &bull; {previewVideo.facultyName}</p>
              </div>
              <button
                onClick={() => setPreviewVideo(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewVideo.videoId}?autoplay=1&rel=0&modestbranding=1`}
                title={previewVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-brand-navy">
                {editingLecture ? 'Edit Recorded Lecture' : 'Add New Recorded Lecture'}
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
                <label className="block mb-1 text-slate-900 font-bold">Lecture Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rotational Motion: Moment of Inertia Theorems & Solved Problems"
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
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Biology">Biology</option>
                    <option value="Mental Ability (MAT)">Mental Ability (MAT)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Target Stream *</label>
                  <select
                    value={formData.stream}
                    onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="ALL">All Streams (NEET, JEE &amp; Foundation)</option>
                    <option value="NEET">NEET Only</option>
                    <option value="JEE_MAIN">JEE Main</option>
                    <option value="JEE_ADVANCED">JEE Advanced</option>
                    <option value="FOUNDATION">Foundation PNCF (Class 9th &amp; 10th)</option>
                  </select>
                </div>
              </div>

              {/* Chapter, Part, Part Title & Lecture Number */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="sm:col-span-2">
                  <label className="block mb-1 text-slate-900 font-bold">Chapter / Unit Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rotational Dynamics or Light"
                    value={formData.chapter}
                    onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Part / Episode *</label>
                  <select
                    value={formData.part}
                    onChange={(e) => setFormData({ ...formData, part: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none font-bold text-slate-700"
                  >
                    <option value="Part 1">Part 1</option>
                    <option value="Part 2">Part 2</option>
                    <option value="Part 3">Part 3</option>
                    <option value="Part 4">Part 4</option>
                    <option value="Part 5">Part 5</option>
                    <option value="Part 6">Part 6</option>
                    <option value="Full Chapter">Full Chapter</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Lec #</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.lectureNo}
                    onChange={(e) => setFormData({ ...formData, lectureNo: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block mb-1 text-slate-900 font-bold">Part Sub-Title / Topic Covered</label>
                  <input
                    type="text"
                    placeholder="e.g. Moment of Inertia & Parallel Axis Theorem or Ray Diagrams"
                    value={formData.partTitle}
                    onChange={(e) => setFormData({ ...formData, partTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* YouTube Link & Auto Extract */}
              <div className="p-4 rounded-2xl bg-red-50/60 border border-red-200 space-y-3">
                <label className="block text-red-950 font-extrabold">YouTube Video URL or Video ID *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. https://www.youtube.com/watch?v=f94y1q8o0p4 or f94y1q8o0p4"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value, videoId: '' })}
                  className="w-full px-3.5 py-2 rounded-xl border border-red-300 bg-white focus:outline-none"
                />

                {currentExtractedId && (
                  <div className="flex items-center gap-3 pt-2">
                    <img
                      src={`https://img.youtube.com/vi/${currentExtractedId}/default.jpg`}
                      alt="Thumbnail preview"
                      className="w-16 h-12 object-cover rounded-lg border border-red-300"
                    />
                    <div className="text-[11px] text-red-900">
                      <span className="font-bold">Detected Video ID:</span> <span className="font-mono bg-white px-1.5 py-0.5 rounded border border-red-200">{currentExtractedId}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Faculty Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Er. Arvind Gupta"
                    value={formData.facultyName}
                    onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Estimated Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 52 Mins"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Attached Notes PDF URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /uploads/materials/physics-notes.pdf"
                    value={formData.notesUrl}
                    onChange={(e) => setFormData({ ...formData, notesUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Attached DPP Practice Sheet URL</label>
                  <input
                    type="text"
                    placeholder="e.g. /uploads/materials/physics-dpp.pdf"
                    value={formData.dppUrl}
                    onChange={(e) => setFormData({ ...formData, dppUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-900 font-bold">Lecture Description / Key Topics</label>
                <textarea
                  rows={2}
                  placeholder="Key theorems, formulas, or homework tasks discussed in this lecture..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                />
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
                  {editingLecture ? 'Save Changes' : 'Publish Lecture'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
