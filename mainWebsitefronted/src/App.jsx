import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FacultySection from './components/FacultySection';
import CoursesSection from './components/CoursesSection';
import WhyUsSection from './components/WhyUsSection';
import GallerySection from './components/GallerySection';
import ContactAndEnquiry from './components/ContactAndEnquiry';
import Footer from './components/Footer';
import RankXModal from './components/RankXModal';
import CbtExamModal from './components/CbtExamModal';
import AuthModal from './components/AuthModal';
import StudentDashboardView from './components/StudentDashboardView';
import TeamPageView from './components/TeamPageView';
import { MessageCircle, Award, Zap } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'team', or 'dashboard'
  const [isRankXOpen, setIsRankXOpen] = useState(false);
  const [isRsatOpen, setIsRsatOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Check persisted student login
  useEffect(() => {
    const cached = localStorage.getItem('rp_student_user');
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rp_student_token');
    localStorage.removeItem('rp_student_user');
    setUser(null);
    setActiveTab('home');
  };

  const handleOpenTeam = () => {
    setActiveTab('team');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Top Navbar */}
      <Navbar
        user={user}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onOpenRankX={() => setIsRankXOpen(true)}
        onOpenRSAT={() => setIsRsatOpen(true)}
        onOpenDashboard={() => setActiveTab('dashboard')}
        onOpenTeam={handleOpenTeam}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              onOpenRankX={() => setIsRankXOpen(true)}
              onOpenRSAT={() => setIsRsatOpen(true)}
              onOpenEnquiry={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <FacultySection onOpenTeam={handleOpenTeam} />
            <CoursesSection
              onOpenEnquiry={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenRSAT={() => setIsRsatOpen(true)}
            />
            <WhyUsSection />
            <GallerySection />
            <ContactAndEnquiry />
          </>
        )}

        {activeTab === 'team' && (
          <TeamPageView
            onBack={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenEnquiry={() => {
              setActiveTab('home');
              setTimeout(() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
        )}

        {activeTab === 'dashboard' && (
          <StudentDashboardView
            user={user}
            onOpenRankX={() => setIsRankXOpen(true)}
            onOpenRSAT={() => setIsRsatOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenRankX={() => setIsRankXOpen(true)}
        onOpenRSAT={() => setIsRsatOpen(true)}
      />

      {/* Interactive Modals */}
      <RankXModal
        isOpen={isRankXOpen}
        onClose={() => setIsRankXOpen(false)}
        user={user}
        onRequireLogin={() => {
          setIsRankXOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <CbtExamModal
        isOpen={isRsatOpen}
        onClose={() => setIsRsatOpen(false)}
        user={user}
      />

      <AuthModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(loggedUser) => {
          setUser(loggedUser);
          setActiveTab('dashboard');
        }}
      />

      {/* Sticky Bottom Actions on Mobile */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col gap-3">
        {/* Floating WhatsApp */}
        <a
          href="https://wa.me/919131435511?text=Hi%2C%20I%20want%20to%20enquire%20about%20Rankers%20Path."
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xl hover:scale-110 transition duration-300 border-2 border-white"
          aria-label="WhatsApp Us"
        >
          <MessageCircle className="w-7 h-7" />
        </a>
      </div>
    </div>
  );
}
