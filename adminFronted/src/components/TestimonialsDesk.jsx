import React, { useState, useEffect } from 'react';
import {
  MessageSquareQuote,
  Star,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  Sparkles,
  GraduationCap,
  BookOpen,
  Users,
  X
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { compressImage } from '../utils/imageCompressor';

export default function TestimonialsDesk() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeStream, setActiveStream] = useState('ALL');
  const [activeType, setActiveType] = useState('ALL'); // 'ALL', 'CURRENT', 'ALUMNI'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'ACTIVE', 'HIDDEN'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState('');
  const [compressStats, setCompressStats] = useState(null);

  const [formData, setFormData] = useState({
    studentName: '',
    studentType: 'CURRENT', // 'CURRENT' or 'ALUMNI'
    photo: '',
    targetStream: 'NEET',
    batch: '',
    rating: 5,
    quote: '',
    featured: true,
    active: true,
    order: 1
  });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTestimonials({ activeOnly: 'false' });
      if (res && res.data) {
        setTestimonials(res.data);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setPreviewPhoto('');
    setCompressStats(null);
    setFormData({
      studentName: '',
      studentType: 'CURRENT',
      photo: '',
      targetStream: 'NEET',
      batch: 'Class 12th • NEET Target Batch',
      rating: 5,
      quote: '',
      featured: true,
      active: true,
      order: testimonials.length + 1
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setPreviewPhoto(item.photo || '');
    setCompressStats(null);
    setFormData({
      studentName: item.studentName || '',
      studentType: item.studentType || 'CURRENT',
      photo: item.photo || '',
      targetStream: item.targetStream || 'NEET',
      batch: item.batch || '',
      rating: item.rating !== undefined ? item.rating : 5,
      quote: item.quote || '',
      featured: item.featured !== false,
      active: item.active !== false,
      order: item.order !== undefined ? item.order : 10
    });
    setModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 400, maxHeight: 400, quality: 0.85 });
      setPreviewPhoto(compressed.dataUrl);
      setFormData(prev => ({ ...prev, photo: compressed.dataUrl }));
      setCompressStats({
        orig: (compressed.originalSize / 1024).toFixed(1),
        comp: (compressed.compressedSize / 1024).toFixed(1)
      });
    } catch (err) {
      alert('Photo compression failed: ' + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentName.trim()) {
      alert('Please enter student name.');
      return;
    }
    if (!formData.quote.trim()) {
      alert('Please enter student testimonial review quote.');
      return;
    }

    setLoading(true);
    try {
      if (editingItem) {
        const res = await adminApi.updateTestimonial(editingItem.id, formData);
        if (res && res.success) {
          setTestimonials(prev => prev.map(t => t.id === editingItem.id ? res.data : t));
          setModalOpen(false);
        } else {
          alert(res?.message || 'Failed to update testimonial');
        }
      } else {
        const res = await adminApi.createTestimonial(formData);
        if (res && res.success) {
          setTestimonials(prev => [res.data, ...prev]);
          setModalOpen(false);
        } else {
          alert(res?.message || 'Failed to create testimonial');
        }
      }
    } catch (err) {
      alert('Request error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the testimonial for "${name}"?`)) {
      return;
    }
    try {
      const res = await adminApi.deleteTestimonial(id);
      if (res && res.success) {
        setTestimonials(prev => prev.filter(t => t.id !== id));
      } else {
        alert(res?.message || 'Failed to delete');
      }
    } catch (err) {
      alert('Delete error: ' + err.message);
    }
  };

  const handleToggleActive = async (item) => {
    const updatedStatus = !item.active;
    try {
      const res = await adminApi.updateTestimonial(item.id, { active: updatedStatus });
      if (res && res.success) {
        setTestimonials(prev => prev.map(t => t.id === item.id ? { ...t, active: updatedStatus } : t));
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Filtered list
  const filteredList = testimonials.filter(item => {
    if (activeStream !== 'ALL' && item.targetStream !== activeStream) return false;
    if (activeType === 'CURRENT' && item.studentType === 'ALUMNI') return false;
    if (activeType === 'ALUMNI' && item.studentType !== 'ALUMNI') return false;
    if (statusFilter === 'ACTIVE' && !item.active) return false;
    if (statusFilter === 'HIDDEN' && item.active) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = item.studentName?.toLowerCase().includes(q);
      const matchBatch = item.batch?.toLowerCase().includes(q);
      const matchQuote = item.quote?.toLowerCase().includes(q);
      if (!matchName && !matchBatch && !matchQuote) return false;
    }
    return true;
  });

  // KPI calculations
  const totalCount = testimonials.length;
  const currentCount = testimonials.filter(t => t.studentType === 'CURRENT' || !t.studentType).length;
  const alumniCount = testimonials.filter(t => t.studentType === 'ALUMNI').length;
  const activeCount = testimonials.filter(t => t.active).length;

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-brand-navy via-brand-navyCard to-brand-navy text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-brand-yellow/30 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-gradient-to-l from-brand-yellow/10 to-transparent pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-yellow/20 border border-brand-yellow/40 text-brand-yellow text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student Reviews &bull; Real Experiences</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Student Testimonials &amp; Reviews Desk
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Manage reviews from students currently preparing for NEET &amp; JEE, and old students (alumni). Upload photos, edit quotes, or toggle visibility on the website.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchTestimonials}
              disabled={loading}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-2xl border border-white/20 text-white transition disabled:opacity-50"
              title="Refresh Testimonials"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={handleOpenAddModal}
              className="px-6 py-3.5 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg transition flex items-center gap-2 transform hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Student Review</span>
            </button>
          </div>
        </div>

        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-white/15">
          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block">Total Reviews</span>
            <p className="text-2xl font-black text-white mt-0.5">{totalCount}</p>
            <span className="text-[10px] text-emerald-400 font-semibold">{activeCount} Live on Website</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block">Currently Studying</span>
            <p className="text-2xl font-black text-brand-yellow mt-0.5">{currentCount}</p>
            <span className="text-[10px] text-slate-300">NEET &bull; JEE &bull; Foundation</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block">Alumni / Old Students</span>
            <p className="text-2xl font-black text-cyan-400 mt-0.5">{alumniCount}</p>
            <span className="text-[10px] text-slate-300">Past Classroom Students</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
            <span className="text-[10px] font-extrabold text-slate-300 uppercase tracking-wider block">Active Status</span>
            <p className="text-2xl font-black text-emerald-300 mt-0.5">{activeCount}</p>
            <span className="text-[10px] text-slate-300">{totalCount - activeCount} Hidden</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Student Type Pills (Current vs Alumni) */}
        <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
          {[
            { id: 'ALL', label: 'All Reviews' },
            { id: 'CURRENT', label: '🟢 Currently Studying' },
            { id: 'ALUMNI', label: '🎓 Alumni / Old Students' }
          ].map(type => (
            <button
              key={type.id}
              type="button"
              onClick={() => setActiveType(type.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition ${
                activeType === type.id
                  ? 'bg-brand-navy text-brand-yellow shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}

          <div className="h-5 w-px bg-slate-200 mx-1 hidden sm:block"></div>

          {['ALL', 'NEET', 'JEE', 'FOUNDATION'].map(stream => (
            <button
              key={stream}
              type="button"
              onClick={() => setActiveStream(stream)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                activeStream === stream
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >
              {stream === 'ALL' ? 'All Streams' : stream}
            </button>
          ))}
        </div>

        {/* Search & Status Filters */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student or quote..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="HIDDEN">Hidden Only</option>
          </select>
        </div>
      </div>

      {/* Testimonials Card Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-brand-navy mb-2" />
          <p className="font-bold text-sm text-slate-600">Loading student testimonials...</p>
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200">
          <MessageSquareQuote className="w-12 h-12 mx-auto text-slate-300 mb-2" />
          <p className="font-extrabold text-base text-slate-800">No testimonials found</p>
          <p className="text-xs text-slate-500 mt-1">Try changing filters or click "Add Student Review" above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredList.map((item) => {
            const isAlumni = item.studentType === 'ALUMNI';
            return (
              <div
                key={item.id}
                className={`rounded-2xl p-4 sm:p-5 border transition flex flex-col justify-between shadow-xs hover:shadow-md ${
                  item.active ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div>
                  {/* Card Top: Avatar, Name, Stream & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {item.photo ? (
                          <img
                            src={item.photo}
                            alt={item.studentName}
                            className="w-11 h-11 rounded-full object-cover border-2 border-brand-yellow/60"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.studentName)}&background=071126&color=ffb800&bold=true`;
                            }}
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-brand-navy text-brand-yellow font-black text-sm flex items-center justify-center border-2 border-brand-yellow/60">
                            {item.studentName?.charAt(0) || 'S'}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 text-white p-0.5 rounded-full border-2 border-white">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                        </div>
                      </div>

                      <div>
                        <h4 className="font-extrabold text-sm text-slate-900 leading-snug">{item.studentName}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {isAlumni ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                              🎓 Old Student / Alumni
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              🟢 Currently Studying
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Active Status Badge */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(item)}
                      className={`p-1.5 rounded-lg border transition ${
                        item.active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                      }`}
                      title={item.active ? 'Click to Hide from website' : 'Click to Make Visible on website'}
                    >
                      {item.active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Batch & Stream Pill */}
                  <div className="flex items-center justify-between text-[11px] text-slate-600 font-semibold mb-2 pb-2 border-b border-slate-100">
                    <span className="truncate">{item.batch || 'Classroom Preparation'}</span>
                    <span className="px-2 py-0.5 rounded font-black text-[10px] bg-slate-100 text-slate-700 ml-2">
                      {item.targetStream || 'NEET'}
                    </span>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < (item.rating || 5)
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-200 fill-slate-200'
                        }`}
                      />
                    ))}
                    <span className="text-[10px] font-bold text-slate-400 ml-1">{item.rating || 5}.0</span>
                  </div>

                  {/* Quote */}
                  <p className="text-xs text-slate-700 leading-relaxed italic line-clamp-3">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-medium">
                    Order: #{item.order || 1}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="p-1.5 text-slate-600 hover:text-brand-navy hover:bg-slate-100 rounded-lg transition font-bold"
                      title="Edit Review"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.studentName)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition font-bold"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* ADD / EDIT MODAL                                         */}
      {/* ========================================================= */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-8 space-y-4 animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-yellow/20 flex items-center justify-center text-brand-navy">
                  <MessageSquareQuote className="w-5 h-5 text-brand-navy" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {editingItem ? 'Edit Student Review' : 'Add New Student Review'}
                  </h3>
                  <p className="text-[11px] text-slate-500">Add feedback from current students or alumni</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold text-slate-700">
              {/* 1. Student Name & Status (Current vs Alumni) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aniket Solanki"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Student Type *</label>
                  <select
                    value={formData.studentType}
                    onChange={(e) => setFormData({ ...formData, studentType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-yellow font-bold text-slate-800"
                  >
                    <option value="CURRENT">🟢 Currently Studying (अध्ययनरत)</option>
                    <option value="ALUMNI">🎓 Old Student / Alumni (पूर्व छात्र)</option>
                  </select>
                </div>
              </div>

              {/* 2. Target Stream & Batch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Target Stream *</label>
                  <select
                    value={formData.targetStream}
                    onChange={(e) => setFormData({ ...formData, targetStream: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-yellow font-bold text-slate-800"
                  >
                    <option value="NEET">NEET-UG (Medical)</option>
                    <option value="JEE">IIT-JEE (Main &amp; Advanced)</option>
                    <option value="FOUNDATION">Foundation (Class 9th &amp; 10th)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Batch / Class</label>
                  <input
                    type="text"
                    placeholder="e.g. Class 12th • NEET Target"
                    value={formData.batch}
                    onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                  />
                </div>
              </div>

              {/* 3. Small Photo Upload / URL (Small Avatar) */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <label className="block text-slate-900 font-bold">Student Photo (Small Profile Picture)</label>

                <div className="flex items-center gap-3">
                  {/* Photo Preview Thumbnail */}
                  <div className="relative flex-shrink-0">
                    {previewPhoto ? (
                      <img
                        src={previewPhoto}
                        alt="Preview"
                        className="w-13 h-13 rounded-full object-cover border-2 border-brand-yellow shadow-sm"
                      />
                    ) : (
                      <div className="w-13 h-13 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-bold">
                        No Photo
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-brand-navy hover:bg-[#081533] text-white text-[11px] font-bold shadow-xs transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingFile ? 'Compressing...' : 'Upload from Computer'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploadingFile}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="Or paste online image URL..."
                      value={formData.photo}
                      onChange={(e) => {
                        setFormData({ ...formData, photo: e.target.value });
                        setPreviewPhoto(e.target.value);
                      }}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-[11px] focus:outline-none focus:ring-1 focus:ring-brand-yellow"
                    />
                  </div>
                </div>
              </div>

              {/* 4. Rating */}
              <div>
                <label className="block mb-1 text-slate-900 font-bold">Rating (Stars)</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 rounded-lg hover:scale-110 transition"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= formData.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 ml-2">{formData.rating} Stars</span>
                </div>
              </div>

              {/* 5. Student Quote / Review */}
              <div>
                <label className="block mb-1 text-slate-900 font-bold">Student Review / Feedback *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="What does the student say about faculty, doubt clearing, teaching, test series, or study atmosphere?"
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none leading-relaxed"
                />
              </div>

              {/* 6. Active Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="block text-xs font-bold text-slate-900">Show on Main Website</span>
                  <span className="text-[10px] text-slate-500">Toggle active to display in the website testimonials section</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-brand-navy hover:bg-[#081533] text-brand-yellow font-black shadow-md transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingItem ? 'Save Changes' : 'Publish Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
