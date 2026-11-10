import React from 'react';
import { MessageCircle, Phone, MapPin } from 'lucide-react';

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Footer({
  onOpenRankX,
  onOpenRSAT,
  onOpenRefundPolicy,
  onOpenAdmission,
  onOpenCoursePage,
  onOpenCashfreePortal,
  onOpenAbout,
  onOpenTeam
}) {
  return (
    <footer className="bg-[#071126] text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <img
              src="/assets/web/footer-logo.png"
              alt="Rankers Path"
              className="h-10 w-auto object-contain brightness-110"
            />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              NEET &amp; IIT-JEE coaching institute in Vijay Nagar, Indore. 
              Led by founding faculty with 25+ years of experience each who personally teach every single batch.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://instagram.com/rankers.path"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-yellow hover:text-brand-navy flex items-center justify-center transition"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/919131435511?text=Hi%2C%20Rankers%20Path"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#25D366] hover:text-white flex items-center justify-center transition"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="tel:+919131435511"
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-brand-yellow hover:text-brand-navy flex items-center justify-center transition"
                aria-label="Phone"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-yellow">Explore Courses</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onOpenCoursePage && onOpenCoursePage('jee-adv')}
                  className="hover:text-white transition text-left"
                >
                  JEE (Main + Advanced)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCoursePage && onOpenCoursePage('neet-ug')}
                  className="hover:text-white transition text-left"
                >
                  Pre-Medical (NEET-UG)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCoursePage && onOpenCoursePage('jee-main')}
                  className="hover:text-white transition text-left"
                >
                  JEE (Main) Focused
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCoursePage && onOpenCoursePage('pncf')}
                  className="hover:text-white transition text-left"
                >
                  Foundation (9th &amp; 10th)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAbout}
                  className="hover:text-brand-yellow text-brand-yellow font-extrabold transition text-left"
                >
                  About Rankers Path
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTeam}
                  className="hover:text-white transition text-left"
                >
                  Faculty &amp; Mentors Team
                </button>
              </li>
              <li><a href="#why-us" className="hover:text-white transition">Why Rankers Path</a></li>
              <li><a href="#gallery" className="hover:text-white transition">Photo Gallery</a></li>
              <li><a href="#contact" className="hover:text-white transition">Contact &amp; Location</a></li>
              <li>
                <button
                  onClick={onOpenAdmission}
                  className="hover:text-brand-yellow text-brand-yellow font-bold transition text-left"
                >
                  Offline / Online Admission Form
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenRefundPolicy}
                  className="hover:text-brand-yellow text-amber-300 font-semibold transition text-left"
                >
                  Refund &amp; Transfer Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Scholarship & Exams */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-yellow">Exams &amp; Tests</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button onClick={onOpenRankX} className="hover:text-white transition text-left">
                  RANKEX 2027 Scholarship Exam
                </button>
              </li>
              <li>
                <button onClick={onOpenRSAT} className="hover:text-white transition text-left">
                  RSAT Online Scholarship
                </button>
              </li>
              <li>
                <button onClick={onOpenRSAT} className="hover:text-white transition text-left">
                  NEET 20-Test Mock Series
                </button>
              </li>
              <li>
                <button onClick={onOpenRSAT} className="hover:text-white transition text-left">
                  IIT-JEE Advanced CBT
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenCashfreePortal && onOpenCashfreePortal()}
                  className="hover:text-amber-300 text-emerald-400 font-bold transition text-left flex items-center gap-1.5"
                >
                  <span>💳 Online Fee Portal (Cashfree)</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-yellow">Vijay Nagar Branch</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              HQ City Walk, Block A, 129, Scheme No. 54, Near Satya Sai Square, Vijay Nagar, Indore - 452010
            </p>
            <p className="text-xs text-slate-300 font-semibold">
              Helpline: 9131435511 / 7974546310
            </p>
            <p className="text-xs text-slate-400">
              Email: rankerspathofficial.edu@gmail.com
            </p>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Rankerspath Educational Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={onOpenRefundPolicy}
              className="text-slate-400 hover:text-brand-yellow underline transition"
            >
              Official Refund &amp; Transfer Policy
            </button>
            <span className="text-slate-700">•</span>
            <button
              onClick={() => onOpenCashfreePortal && onOpenCashfreePortal()}
              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 transition"
              title="Official Cashfree Online Fee & Admission Payment Portal"
            >
              <span>💳 Cashfree Fee Portal</span>
            </button>
            <span className="text-slate-700">•</span>
            <a
              href={import.meta.env.VITE_ADMIN_PORTAL_URL || 'http://localhost:5174'}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-brand-yellow flex items-center gap-1 transition font-semibold"
              title="Access Admin & Faculty Portal"
            >
              <span>🔐 Staff &amp; Faculty Portal</span>
            </a>
            <span className="text-slate-700">•</span>
            <span className="text-slate-400">Safalta Ka Sankalp</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
