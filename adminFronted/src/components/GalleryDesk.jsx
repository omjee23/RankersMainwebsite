import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Edit3,
  Filter,
  RefreshCw,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Search,
  Eye
} from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { compressImage } from '../utils/imageCompressor';

export default function GalleryDesk() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTag, setActiveTag] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Upload / Edit Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [previewSrc, setPreviewSrc] = useState('');
  const [compressStats, setCompressStats] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    tag: 'Classroom',
    src: '',
    description: '',
    order: 10,
    active: true
  });

  const categories = ['ALL', 'Classroom', 'Celebration', 'Mentorship', 'Campus', 'Events'];

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getGalleryPhotos();
      if (res && res.data) {
        setPhotos(res.data);
      }
    } catch (err) {
      console.error('Failed to load gallery photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleOpenAddModal = () => {
    setEditingPhoto(null);
    setPreviewSrc('');
    setCompressStats(null);
    setFormData({
      title: '',
      tag: 'Classroom',
      src: '',
      description: '',
      order: photos.length + 1,
      active: true
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (photo) => {
    setEditingPhoto(photo);
    setPreviewSrc(photo.src);
    setCompressStats(null);
    setFormData({
      title: photo.title || '',
      tag: photo.tag || 'Classroom',
      src: photo.src || '',
      description: photo.description || '',
      order: photo.order !== undefined ? photo.order : 10,
      active: photo.active !== false
    });
    setModalOpen(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setUploadingFile(true);
    try {
      const compressed = await compressImage(file, { maxWidth: 1200, maxHeight: 800, quality: 0.82 });
      setPreviewSrc(compressed.dataUrl);
      setFormData(prev => ({ ...prev, src: compressed.dataUrl }));
      setCompressStats({
        originalKb: Math.round(file.size / 1024),
        compressedKb: Math.round(compressed.size / 1024)
      });
    } catch (err) {
      alert('Error compressing image: ' + err.message);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a photo title or caption.');
      return;
    }
    if (!formData.src.trim()) {
      alert('Please upload an image file or provide a valid image URL.');
      return;
    }

    setLoading(true);
    try {
      if (editingPhoto) {
        const res = await adminApi.updateGalleryPhoto(editingPhoto.id, formData);
        if (res && res.success) {
          setPhotos(prev => prev.map(p => p.id === editingPhoto.id ? res.data : p));
          setModalOpen(false);
        } else {
          alert(res.message || 'Failed to update photo');
        }
      } else {
        const res = await adminApi.createGalleryPhoto(formData);
        if (res && res.success) {
          setPhotos(prev => [res.data, ...prev]);
          setModalOpen(false);
        } else {
          alert(res.message || 'Failed to upload photo');
        }
      }
    } catch (err) {
      alert('Error saving photo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this campus photo from the gallery?')) {
      return;
    }

    setLoading(true);
    try {
      const res = await adminApi.deleteGalleryPhoto(photoId);
      if (res && res.success) {
        setPhotos(prev => prev.filter(p => p.id !== photoId));
      } else {
        alert(res.message || 'Failed to delete photo');
      }
    } catch (err) {
      alert('Error deleting photo: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredPhotos = photos.filter(p => {
    if (activeTag !== 'ALL' && p.tag && p.tag.toLowerCase() !== activeTag.toLowerCase()) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchTitle = p.title && p.title.toLowerCase().includes(q);
      const matchDesc = p.description && p.description.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  const getTagColor = (tag) => {
    switch ((tag || '').toLowerCase()) {
      case 'classroom':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'celebration':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'mentorship':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'campus':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-900 font-extrabold text-xs uppercase tracking-wider mb-2">
            <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>Campus Media & Life at Rankers</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Campus Gallery Manager
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-xl">
            Upload classroom, celebration, and mentorship moments. Photos are automatically compressed and updated instantly on the main website.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPhotos}
            className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition flex items-center gap-2 text-xs font-bold shadow-xs"
            title="Refresh photos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-navy' : ''}`} />
            <span className="hidden sm:inline">Sync</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-5 py-3 rounded-2xl bg-brand-navy hover:bg-[#152a55] text-brand-yellow font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Photo</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTag(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition whitespace-nowrap ${
                activeTag === cat
                  ? 'bg-brand-navy text-brand-yellow shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Photos' : cat}
              {cat === 'ALL' && ` (${photos.length})`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by caption..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-yellow focus:bg-white"
          />
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-200 transition-all duration-300 flex flex-col"
          >
            {/* Image Preview Box */}
            <div className="relative aspect-video bg-slate-100 overflow-hidden">
              <img
                src={photo.src}
                alt={photo.title}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/web/gallery-1.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider border shadow-xs ${getTagColor(photo.tag)}`}>
                {photo.tag}
              </span>
              <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                #{photo.order || 1}
              </span>
            </div>

            {/* Details */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-snug line-clamp-1">
                  {photo.title}
                </h4>
                {photo.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {photo.description}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => handleOpenEditModal(photo)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-brand-navy hover:bg-slate-100 transition flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-slate-500" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => handleDelete(photo.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredPhotos.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-dashed border-slate-300">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No photos found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No campus photos match your current filter. Click "Upload New Photo" above to add photos.
            </p>
          </div>
        )}
      </div>

      {/* Upload / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-brand-navy flex items-center justify-center font-black shadow-xs">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black">
                    {editingPhoto ? 'Edit Campus Photo' : 'Upload Campus Photo'}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    Instantly syncs with Vijay Nagar campus website gallery
                  </p>
                </div>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              {/* Image Upload Area */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Photo (Auto Compressed &lt;60KB)
                </label>
                
                <div className="border-2 border-dashed border-slate-300 hover:border-brand-navy/60 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/50 transition relative group">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                  />
                  
                  {previewSrc ? (
                    <div className="relative">
                      <img
                        src={previewSrc}
                        alt="Preview"
                        className="w-full h-36 object-cover rounded-xl shadow-xs border border-slate-200"
                      />
                      <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-white text-[10px] font-bold">
                        Click to change photo
                      </div>
                    </div>
                  ) : (
                    <div className="py-4 flex flex-col items-center">
                      <Upload className="w-8 h-8 text-slate-400 group-hover:text-brand-navy transition mb-2" />
                      <span className="text-xs font-bold text-slate-800">Click or drag photo here</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">Supports JPG, PNG, WEBP</span>
                    </div>
                  )}
                </div>

                {compressStats && (
                  <p className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Compressed: {compressStats.originalKb} KB &rarr; {compressStats.compressedKb} KB (Fast loading guaranteed)
                  </p>
                )}
              </div>

              {/* Or Direct Image URL */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Or Image URL / Asset Path
                </label>
                <input
                  type="text"
                  placeholder="/assets/web/gallery-1.jpg or https://..."
                  value={formData.src}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, src: e.target.value }));
                    setPreviewSrc(e.target.value);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                />
              </div>

              {/* Title & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Caption / Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Science Olympiad Winners"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category Tag *
                  </label>
                  <select
                    value={formData.tag}
                    onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none font-bold bg-white"
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Celebration">Celebration</option>
                    <option value="Mentorship">Mentorship</option>
                    <option value="Campus">Campus</option>
                    <option value="Events">Events</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                  Short Description (Optional)
                </label>
                <textarea
                  rows="2"
                  placeholder="Add extra details or date of celebration..."
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                />
              </div>

              {/* Display Order & Active */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-1.5">
                    Display Sequence #
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: Number(e.target.value) }))}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                      className="w-4 h-4 rounded text-brand-navy focus:ring-brand-yellow"
                    />
                    <span className="text-xs font-bold text-slate-800">Visible on Website</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploadingFile}
                  className="px-6 py-2.5 rounded-xl bg-brand-navy hover:bg-[#152a55] text-brand-yellow font-black text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition flex items-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingPhoto ? 'Save Changes' : 'Upload to Gallery'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
