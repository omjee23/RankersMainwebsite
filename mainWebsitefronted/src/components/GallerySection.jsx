import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, X, ZoomIn, RefreshCw } from 'lucide-react';

const DEFAULT_GALLERY_IMAGES = [
  { id: 'def-1', src: '/assets/web/gallery-1.jpg', title: 'Classroom Session in Progress', tag: 'Classroom' },
  { id: 'def-2', src: '/assets/web/gallery-2.jpg', title: 'Students at Rankers Path Study Hall', tag: 'Campus' },
  { id: 'def-3', src: '/assets/web/gallery-3.jpg', title: 'Dedicated Doubt Solving Hour', tag: 'Mentorship' },
  { id: 'def-4', src: '/assets/web/gallery-4.jpg', title: 'Student Felicitation & Result Celebration', tag: 'Celebration' },
  { id: 'def-5', src: '/assets/web/gallery-5.jpg', title: 'Interactive Science Concept Demonstration', tag: 'Classroom' },
  { id: 'def-6', src: '/assets/web/gallery-6.jpg', title: 'Focused Preparation & Test Session', tag: 'Classroom' },
  { id: 'def-7', src: '/assets/web/gallery-7.jpg', title: 'Annual Student Gathering & Motivation', tag: 'Celebration' },
  { id: 'def-8', src: '/assets/web/gallery-8.jpg', title: 'Faculty Discussion with Parents & Students', tag: 'Mentorship' },
  { id: 'def-9', src: '/assets/web/gallery-9.jpg', title: 'Rank Holders Recognition Ceremony', tag: 'Celebration' },
  { id: 'def-10', src: '/assets/web/gallery-10.jpg', title: 'Small Batch Learning Environment', tag: 'Classroom' },
  { id: 'def-11', src: '/assets/web/gallery-11.jpg', title: 'Biology Diagram & Concept Mastery', tag: 'Classroom' },
  { id: 'def-12', src: '/assets/web/gallery-12.jpg', title: 'Celebration of Success with Teachers', tag: 'Celebration' }
];

export default function GallerySection() {
  const [images, setImages] = useState(DEFAULT_GALLERY_IMAGES);
  const [selectedImg, setSelectedImg] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  const filters = ['All', 'Classroom', 'Celebration', 'Mentorship', 'Campus'];

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:5002/api/gallery');
        const data = await res.json();
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setImages(data.data);
        }
      } catch (err) {
        console.warn('Using default gallery photos:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  const filteredImages = activeFilter === 'All'
    ? images
    : images.filter(img => (img.tag || '').toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="gallery" className="py-20 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-navy font-extrabold text-xs uppercase tracking-wider mb-3">
            <ImageIcon className="w-4 h-4 text-brand-yellowDark" /> Campus Life &amp; Celebrations
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Life at Rankers Path
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Real classroom energy, student celebrations, and personalized mentorship in action at our Vijay Nagar campus.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {filters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                  activeFilter === filter
                    ? 'bg-brand-navy text-brand-yellow'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredImages.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => setSelectedImg(img)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl bg-slate-100 aspect-video cursor-pointer border border-slate-200 transition-all duration-300 transform hover:-translate-y-1"
            >
              <img
                src={img.src}
                alt={img.title ? `${img.title} — Rankers Path Indore Campus Gallery` : 'Rankers Path Vijay Nagar Indore Campus Photo'}
                loading="lazy"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/web/gallery-1.jpg';
                }}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                <span className="text-[10px] uppercase font-bold text-brand-yellow tracking-wider">
                  {img.tag}
                </span>
                <p className="text-xs font-bold line-clamp-1 mt-0.5">
                  {img.title}
                </p>
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-white/20 backdrop-blur-md">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {selectedImg && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedImg(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImg(null)}
              className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
              aria-label="Close image modal"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={selectedImg.src}
              alt={selectedImg.title ? `${selectedImg.title} — Rankers Path Indore` : 'Rankers Path Indore Campus Moment'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/assets/web/gallery-1.jpg';
              }}
              className="w-full max-h-[75vh] object-contain bg-black"
            />
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-yellow text-brand-navy uppercase">
                  {selectedImg.tag}
                </span>
                <h4 className="text-base font-bold mt-1 text-slate-100">{selectedImg.title}</h4>
              </div>
              <span className="text-xs text-slate-400">Rankers Path, Indore</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
