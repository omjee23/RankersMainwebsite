import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Download,
  Search,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  RefreshCw,
  X,
  Layers,
  FolderOpen
} from 'lucide-react';
import { adminApi } from '../services/adminApi';

const CATEGORIES = [
  { key: 'ALL', label: 'All Types' },
  { key: 'PDF', label: 'PDF Handbooks' },
  { key: 'NOTES', label: 'Class Notes' },
  { key: 'PYQ', label: 'PYQ Banks' },
  { key: 'SHEET', label: 'Practice Sheets (DPP)' },
  { key: 'IMAGE', label: 'Infographics & Maps' },
  { key: 'FORM', label: 'Official Forms' }
];

export default function StudyMaterialDesk({ fixedStream = null }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [streamFilter, setStreamFilter] = useState(fixedStream || 'ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'PDF',
    subject: fixedStream === 'JEE' ? 'Mathematics' : (fixedStream === 'NEET' ? 'Biology' : (fixedStream === 'FOUNDATION' ? 'Physics' : 'Physics')),
    chapter: '',
    part: 'Part 1',
    partTitle: '',
    stream: fixedStream || 'ALL',
    targetClass: fixedStream === 'FOUNDATION' ? 'Class 9th & 10th (PNCF)' : (fixedStream === 'JEE' ? 'Super 30 & Class 12 JEE' : (fixedStream === 'NEET' ? 'Class 12 & Dropper NEET' : 'All Batches')),
    fileUrl: '',
    fileSize: '3.5 MB',
    description: ''
  });

  const loadMaterials = async () => {
    setLoading(true);
    const res = await adminApi.getStudyMaterials({
      category: categoryFilter,
      subject: subjectFilter,
      stream: streamFilter,
      search: searchTerm
    });
    setLoading(false);
    if (res.data) {
      setMaterials(res.data);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, [categoryFilter, subjectFilter, streamFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadMaterials();
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      category: 'PDF',
      subject: fixedStream === 'JEE' ? 'Mathematics' : (fixedStream === 'NEET' ? 'Biology' : (fixedStream === 'FOUNDATION' ? 'Physics' : 'Physics')),
      chapter: '',
      part: 'Part 1',
      partTitle: '',
      stream: fixedStream || 'ALL',
      targetClass: fixedStream === 'FOUNDATION' ? 'Class 9th & 10th (PNCF)' : (fixedStream === 'JEE' ? 'Super 30 & Class 12 JEE' : (fixedStream === 'NEET' ? 'Class 12 & Dropper NEET' : 'All Batches')),
      fileUrl: '',
      fileSize: '3.5 MB',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      subject: item.subject,
      chapter: item.chapter || '',
      part: item.part || 'Part 1',
      partTitle: item.partTitle || '',
      stream: item.stream,
      targetClass: item.targetClass || (fixedStream === 'FOUNDATION' ? 'Class 9th & 10th (PNCF)' : 'All Batches'),
      fileUrl: item.fileUrl || '',
      fileSize: item.fileSize || '3.5 MB',
      description: item.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.fileUrl) {
      alert('Please fill in title and file URL');
      return;
    }

    if (editingItem) {
      const res = await adminApi.updateStudyMaterial(editingItem.id, formData);
      if (res.success) {
        setIsModalOpen(false);
        loadMaterials();
      } else {
        alert(res.message || 'Failed to update');
      }
    } else {
      const res = await adminApi.createStudyMaterial(formData);
      if (res.success) {
        setIsModalOpen(false);
        loadMaterials();
      } else {
        alert(res.message || 'Failed to upload');
      }
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    const res = await adminApi.deleteStudyMaterial(id);
    if (res.success) {
      loadMaterials();
    } else {
      alert(res.message || 'Failed to delete');
    }
  };

  // Category Icon helper
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'PDF':
        return <span className="px-2 py-0.5 rounded text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-200">PDF Handbook</span>;
      case 'NOTES':
        return <span className="px-2 py-0.5 rounded text-[11px] font-black bg-indigo-100 text-indigo-800 border border-indigo-200">Class Notes</span>;
      case 'PYQ':
        return <span className="px-2 py-0.5 rounded text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-200">PYQ Bank</span>;
      case 'SHEET':
        return <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">DPP Sheet</span>;
      case 'IMAGE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-black bg-cyan-100 text-cyan-800 border border-cyan-200">Map / Image</span>;
      case 'FORM':
        return <span className="px-2 py-0.5 rounded text-[11px] font-black bg-purple-100 text-purple-800 border border-purple-200">Official Form</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-black bg-slate-100 text-slate-800">{category}</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Stats */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-yellow/30 text-brand-navy">
              <FolderOpen className="w-6 h-6" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-brand-navy">
                  {fixedStream === 'JEE' ? 'IIT-JEE Study Material Hub (Main & Advanced)' :
                   fixedStream === 'NEET' ? 'NEET-UG Medical Study Material Hub' :
                   fixedStream === 'FOUNDATION' ? 'PNCF Foundation & Olympiad Study Material Hub' :
                   'Study Material Hub Management'}
                </h2>
                {fixedStream && (
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    fixedStream === 'JEE' ? 'bg-blue-600 text-white' :
                    fixedStream === 'NEET' ? 'bg-emerald-600 text-white' :
                    'bg-purple-600 text-white'
                  }`}>
                    {fixedStream === 'JEE' ? 'Engineering (IIT-JEE)' :
                     fixedStream === 'NEET' ? 'Pre-Medical (NEET-UG)' :
                     'PNCF Foundation (9th & 10th)'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {fixedStream === 'JEE' ? 'Upload and manage Physics, Chemistry, and Mathematics modules, 10-year PYQ banks, DPPs, and formula booklets exclusively for JEE aspirants.' :
                 fixedStream === 'NEET' ? 'Upload and manage Biology (Botany & Zoology), Physics, and Chemistry NCERT extract handbooks, daily practice sheets, unit test papers, and past year question banks exclusively for NEET aspirants.' :
                 fixedStream === 'FOUNDATION' ? 'Upload and organize Physics, Chemistry, Mathematics, Biology, and Mental Ability (MAT) chapter-wise and part-wise notes, DPP practice sheets, and NTSE/Olympiad modules for Class 9th & 10th students.' :
                 'Publish and organize PDFs, Toppers Notes, PYQ Banks, DPP Sheets, Mindmaps, and Official Forms for Student Dashboard.'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-brand-navy hover:bg-brand-navyLight text-brand-yellow rounded-xl font-black text-xs uppercase tracking-wider shadow transition flex items-center gap-2 flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Material</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase">Total Files</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{materials.length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-rose-500 uppercase">PDFs</span>
          <p className="text-2xl font-black text-rose-600 mt-1">{materials.filter(m => m.category === 'PDF').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-indigo-500 uppercase">Notes</span>
          <p className="text-2xl font-black text-indigo-600 mt-1">{materials.filter(m => m.category === 'NOTES').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-amber-500 uppercase">PYQs</span>
          <p className="text-2xl font-black text-amber-600 mt-1">{materials.filter(m => m.category === 'PYQ').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-emerald-500 uppercase">DPP Sheets</span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{materials.filter(m => m.category === 'SHEET').length}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-purple-500 uppercase">Forms</span>
          <p className="text-2xl font-black text-purple-600 mt-1">{materials.filter(m => m.category === 'FORM').length}</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by title, subject, chapter, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-yellow focus:outline-none"
            />
          </form>

          {/* Subject Dropdown */}
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Subjects</option>
            <option value="Physics">Physics</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Biology">Biology</option>
            {fixedStream === 'FOUNDATION' || !fixedStream ? (
              <option value="Mental Ability (MAT)">Mental Ability (MAT)</option>
            ) : null}
            <option value="General">General</option>
          </select>

          {/* Stream Dropdown */}
          <select
            value={streamFilter}
            onChange={(e) => setStreamFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none"
          >
            <option value="ALL">All Streams</option>
            <option value="NEET">NEET Only</option>
            <option value="JEE_MAIN">JEE Main</option>
            <option value="JEE_ADVANCED">JEE Advanced</option>
            <option value="FOUNDATION">Foundation (9th & 10th)</option>
          </select>

          <button
            onClick={loadMaterials}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setCategoryFilter(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                categoryFilter === cat.key
                  ? 'bg-brand-navy text-brand-yellow shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Materials Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs font-bold">
            Loading study materials library...
          </div>
        ) : materials.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No study materials found matching selected filters. Click "+ Upload New Material" to add your first document.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Title &amp; Description</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Batch / Stream</th>
                  <th className="py-3.5 px-4">File Details</th>
                  <th className="py-3.5 px-4">Downloads</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {materials.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="py-4 px-4 max-w-sm">
                      <div className="flex items-center gap-1.5 flex-wrap mb-1">
                        {m.chapter && (
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-bold text-[10px] border border-slate-200">
                            📖 {m.chapter}
                          </span>
                        )}
                        {m.part && (
                          <span className="px-2 py-0.5 rounded bg-brand-yellow/30 text-brand-navy font-black text-[10px] border border-amber-300">
                            {m.part}
                          </span>
                        )}
                        {m.partTitle && (
                          <span className="text-[10px] text-slate-500 font-medium italic">
                            ({m.partTitle})
                          </span>
                        )}
                      </div>
                      <p className="font-extrabold text-slate-900 text-sm line-clamp-1">{m.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{m.description || 'No description provided'}</p>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getCategoryBadge(m.category)}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap font-bold text-brand-navy">
                      {m.subject}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {m.stream} &bull; {m.targetClass}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                      <span className="font-mono">{m.fileSize}</span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap font-bold text-emerald-600">
                      {m.downloadCount || 0}
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap space-x-2">
                      <a
                        href={m.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-p-1.5 p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 inline-block"
                        title="Direct File Link"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleOpenEdit(m)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-blue-50 text-blue-600 inline-block"
                        title="Edit Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id, m.title)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 text-rose-600 inline-block"
                        title="Delete Material"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-extrabold text-brand-navy">
                {editingItem ? 'Edit Study Material' : 'Upload New Study Material'}
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
                <label className="block mb-1 text-slate-900 font-bold">Document Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NEET UG Complete Biology Formula & Mnemonics Book"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-yellow focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Material Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    <option value="PDF">PDF Handbook</option>
                    <option value="NOTES">Classroom Handwritten Notes</option>
                    <option value="PYQ">PYQ Question Bank</option>
                    <option value="SHEET">DPP Practice Sheet</option>
                    <option value="IMAGE">Infographic / Reaction Chart</option>
                    <option value="FORM">Official Student Form</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Subject *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  >
                    {fixedStream === 'JEE' ? (
                      <>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Mathematics">Mathematics</option>
                      </>
                    ) : fixedStream === 'NEET' ? (
                      <>
                        <option value="Biology">Biology (Botany & Zoology)</option>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                      </>
                    ) : fixedStream === 'FOUNDATION' ? (
                      <>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Biology">Biology</option>
                        <option value="Mental Ability (MAT)">Mental Ability (MAT)</option>
                        <option value="General">General / All Foundation</option>
                      </>
                    ) : (
                      <>
                        <option value="Physics">Physics</option>
                        <option value="Chemistry">Chemistry</option>
                        <option value="Mathematics">Mathematics</option>
                        <option value="Biology">Biology</option>
                        <option value="Mental Ability (MAT)">Mental Ability (MAT)</option>
                        <option value="General">General / All Subjects</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Chapter, Part & Part Title */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="sm:col-span-1">
                  <label className="block mb-1 text-slate-900 font-bold">Chapter Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Light - Reflection or Rotational Dynamics"
                    value={formData.chapter}
                    onChange={(e) => setFormData({ ...formData, chapter: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Part / Module *</label>
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
                    <option value="Full Chapter">Full Chapter Master</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Part Sub-Title / Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Ray Diagrams & Mirror Formula"
                    value={formData.partTitle}
                    onChange={(e) => setFormData({ ...formData, partTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Target Stream</label>
                  {fixedStream ? (
                    <input
                      type="text"
                      disabled
                      value={
                        fixedStream === 'JEE' ? 'IIT-JEE (Main & Advanced)' :
                        fixedStream === 'NEET' ? 'NEET-UG (Medical)' :
                        'PNCF Foundation (Class 9th & 10th)'
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-bold cursor-not-allowed"
                    />
                  ) : (
                    <select
                      value={formData.stream}
                      onChange={(e) => setFormData({ ...formData, stream: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                    >
                      <option value="ALL">All Enrolled Batches</option>
                      <option value="NEET">NEET UG</option>
                      <option value="JEE_MAIN">JEE Main</option>
                      <option value="JEE_ADVANCED">JEE Advanced</option>
                      <option value="FOUNDATION">Foundation (Class 9 & 10)</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">Target Class Level</label>
                  <input
                    type="text"
                    placeholder="e.g. Class 12 & Dropper"
                    value={formData.targetClass}
                    onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-slate-900 font-bold">File URL or Link *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. /uploads/materials/neet-bio.pdf or Drive link"
                    value={formData.fileUrl}
                    onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block mb-1 text-slate-900 font-bold">File Size Indicator</label>
                  <input
                    type="text"
                    placeholder="e.g. 4.2 MB"
                    value={formData.fileSize}
                    onChange={(e) => setFormData({ ...formData, fileSize: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-slate-900 font-bold">Description &amp; Key Highlights</label>
                <textarea
                  rows={3}
                  placeholder="Summary of chapters covered, question count, or instructions for students..."
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
                  {editingItem ? 'Save Changes' : 'Publish Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
