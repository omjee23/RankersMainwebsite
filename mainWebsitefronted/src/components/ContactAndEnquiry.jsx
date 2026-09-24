import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Send, CheckCircle2 } from 'lucide-react';

const InstagramIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function ContactAndEnquiry() {
  const [formState, setFormState] = useState({
    name: '',
    mobile: '',
    targetStream: 'NEET',
    message: '',
    honeypot: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formState.honeypot) return; // bot detected
    if (!formState.name || !formState.mobile) return;

    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section id="contact" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-yellow/15 text-brand-navy font-extrabold text-xs uppercase tracking-wider mb-3">
            Contact &amp; Campus Location
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Get in Touch with Our Academic Team
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Have questions about admissions, batch schedules, or scholarship eligibility? Visit our Vijay Nagar campus or request a callback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Campus Information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B1B3D] text-white rounded-3xl p-8 shadow-xl border border-brand-yellow/30 space-y-6">
              <h3 className="text-2xl font-extrabold text-brand-yellow">Headquarters &amp; Main Branch</h3>
              
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-yellow">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">Address</h4>
                  <p className="text-sm text-slate-100 font-medium mt-0.5 leading-relaxed">
                    HQ City Walk, Block A, 129, Scheme No. 54, Near Satya Sai Square, Vijay Nagar, Indore - 452010, Madhya Pradesh
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-yellow">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">Phone Lines</h4>
                  <p className="text-sm text-slate-100 font-medium mt-0.5">
                    <a href="tel:+919131435511" className="hover:text-brand-yellow transition">9131435511</a> &nbsp;/&nbsp; 
                    <a href="tel:+917974546310" className="hover:text-brand-yellow transition">7974546310</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-yellow">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">Email Inquiry</h4>
                  <p className="text-sm text-slate-100 font-medium mt-0.5">
                    <a href="mailto:info@rankerspath.in" className="hover:text-brand-yellow transition">info@rankerspath.in</a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-brand-yellow">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs uppercase font-extrabold text-slate-300 tracking-wider">Social Updates</h4>
                  <a
                    href="https://instagram.com/rankers.path"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-yellow hover:underline font-bold mt-0.5 inline-block"
                  >
                    @rankers.path (Instagram)
                  </a>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <a
                  href="https://wa.me/919131435511?text=Hi%2C%20I%27d%20like%20to%20know%20more%20about%20admissions%20at%20Rankers%20Path."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat Direct on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Send an Enquiry Card */}
          <div className="lg:col-span-7 bg-[#F8FAFC] rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-sm">
            <h3 className="text-2xl font-extrabold text-slate-900">Request a Callback / Counseling</h3>
            <p className="text-slate-600 text-sm mt-1">
              Leave your details below and our senior academic counselor will call you back within 15 minutes.
            </p>

            {submitted ? (
              <div className="mt-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-in fade-in">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="text-xl font-bold text-emerald-900">Thank You, {formState.name}!</h4>
                <p className="text-sm text-emerald-700">
                  Your enquiry has been received. Our counselor will contact you on <strong>+91-{formState.mobile}</strong> shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-2 text-xs font-bold text-emerald-800 underline"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow font-medium text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                      Mobile Number (10 digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[6-9][0-9]{9}"
                      maxLength={10}
                      placeholder="e.g. 9876543210"
                      value={formState.mobile}
                      onChange={(e) => setFormState({ ...formState, mobile: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow font-medium text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Target Stream
                  </label>
                  <select
                    value={formState.targetStream}
                    onChange={(e) => setFormState({ ...formState, targetStream: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow font-medium text-sm bg-white"
                  >
                    <option value="NEET">NEET (Medical UG)</option>
                    <option value="IIT_JEE">IIT-JEE (Mains + Advanced)</option>
                    <option value="FOUNDATION">Class 9th / 10th Foundation</option>
                    <option value="DROPPER_NEET">NEET Dropper (Batch starting 24 June)</option>
                    <option value="DROPPER_JEE">IIT-JEE Dropper / Repeater</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                    Questions / Message (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us what you'd like to know (Batch timing, fees, scholarship, etc.)..."
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-yellow font-medium text-sm"
                  ></textarea>
                </div>

                {/* Honeypot field for anti-spam bots */}
                <input
                  type="text"
                  name="honeypot"
                  value={formState.honeypot}
                  onChange={(e) => setFormState({ ...formState, honeypot: e.target.value })}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-brand-yellow hover:bg-[#e6a500] text-brand-navy rounded-xl font-extrabold text-base shadow-lg shadow-brand-yellow/20 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting...' : 'Submit Callback Request'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Embedded Google Map */}
        <div className="mt-16 rounded-3xl overflow-hidden shadow-lg border border-slate-200 h-80 sm:h-96 w-full">
          <iframe
            title="Rankers Path Vijay Nagar Indore Location"
            src="https://www.google.com/maps?q=HQ+City+Walk+Block+A+129+Scheme+No+54+Near+Satya+Sai+Square+Vijay+Nagar+Indore+452010+Madhya+Pradesh&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>
    </section>
  );
}
