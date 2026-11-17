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
import AboutRankersPathView from './components/AboutRankersPathView';
import RefundPolicyView from './components/RefundPolicyView';
import AdmissionFormView from './components/AdmissionFormView';
import JeeAdvancedCourseView from './components/JeeAdvancedCourseView';
import NeetUgCourseView from './components/NeetUgCourseView';
import JeeMainCourseView from './components/JeeMainCourseView';
import FoundationCourseView from './components/FoundationCourseView';
import RSATPaymentModal from './components/RSATPaymentModal';
import CashfreePaymentPortalModal from './components/CashfreePaymentPortalModal';
import DigitalBoardHostModal from './components/DigitalBoardHostModal';
import DualPromoPopup from './components/DualPromoPopup';
import RsatDashboardView from './components/RsatDashboardView';
import RankXDashboardView from './components/RankXDashboardView';
import TestimonialsSection from './components/TestimonialsSection';
import SEOHead from './components/SEOHead';
import { MessageCircle, Award, Zap } from 'lucide-react';

export const ROUTE_PATH_MAP = {
  '/': 'home',
  '/home': 'home',
  '/about': 'about',
  '/about-us': 'about',
  '/team': 'team',
  '/faculty': 'team',
  '/mentors': 'team',
  '/admission': 'admission',
  '/admissions': 'admission',
  '/apply': 'admission',
  '/refund-policy': 'refund-policy',
  '/courses/jee-advanced': 'course-jee-adv',
  '/courses/jee-adv': 'course-jee-adv',
  '/courses/neet-ug': 'course-neet-ug',
  '/courses/neet': 'course-neet-ug',
  '/courses/jee-main': 'course-jee-main',
  '/courses/foundation': 'course-foundation',
  '/student-dashboard': 'dashboard',
  '/dashboard': 'dashboard',
  '/rsat': 'rsat-dashboard',
  '/rsat-portal': 'rsat-dashboard',
  '/rsat-dashboard': 'rsat-dashboard',
  '/rankx': 'rankx-dashboard',
  '/rankex': 'rankx-dashboard',
  '/rankex-portal': 'rankx-dashboard'
};

export const TAB_ROUTE_MAP = {
  'home': '/',
  'about': '/about',
  'team': '/faculty',
  'admission': '/admissions',
  'refund-policy': '/refund-policy',
  'course-jee-adv': '/courses/jee-advanced',
  'course-neet-ug': '/courses/neet-ug',
  'course-jee-main': '/courses/jee-main',
  'course-foundation': '/courses/foundation',
  'dashboard': '/student-dashboard',
  'rsat-dashboard': '/rsat-portal',
  'rankx-dashboard': '/rankex-portal'
};

function getInitialTabFromUrl() {
  if (typeof window === 'undefined') return 'home';
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
  return ROUTE_PATH_MAP[path] || 'home';
}

export default function App() {
  const [user, setUser] = useState(null); // Enrolled Classroom LMS Student
  const [rsatUser, setRsatUser] = useState(null); // RSAT Scholarship Student Session
  const [rankxUser, setRankxUser] = useState(null); // RANKEX Talent Exam Student Session
  const [activeTab, setActiveTabState] = useState(getInitialTabFromUrl);

  const navigateTab = (tab, options = {}) => {
    setActiveTabState(tab);
    const targetPath = TAB_ROUTE_MAP[tab] || '/';
    if (typeof window !== 'undefined') {
      if (window.location.pathname !== targetPath) {
        if (options.replace) {
          window.history.replaceState({ tab }, '', targetPath);
        } else {
          window.history.pushState({ tab }, '', targetPath);
        }
      }
      if (!options.preventScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const setActiveTab = navigateTab;
  const [selectedCourseSlug, setSelectedCourseSlug] = useState('jee-adv');
  const [isRankXOpen, setIsRankXOpen] = useState(false);
  const [isRsatPaymentOpen, setIsRsatPaymentOpen] = useState(false);
  const [isCbtExamOpen, setIsCbtExamOpen] = useState(false);
  const [activeTestId, setActiveTestId] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRsatFunnelIntent, setIsRsatFunnelIntent] = useState(false);
  const [isCashfreePortalOpen, setIsCashfreePortalOpen] = useState(false);
  const [cashfreePurpose, setCashfreePurpose] = useState('RSAT_EXAM_FEE');
  const [isDigitalBoardStudioOpen, setIsDigitalBoardStudioOpen] = useState(false);
  const [boardInitialPin, setBoardInitialPin] = useState(null);

  const handleOpenCashfreePortal = (purpose = 'RSAT_EXAM_FEE') => {
    setCashfreePurpose(purpose);
    setIsCashfreePortalOpen(true);
  };

  const handleOpenRSAT = (testId = null) => {
    if (testId && testId !== 'test-rsat-scholarship') {
      setActiveTestId(testId);
      setIsCbtExamOpen(true);
    } else if (rsatUser) {
      setActiveTab('rsat-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setActiveTestId('test-rsat-scholarship');
      setIsRsatPaymentOpen(true);
    }
  };

  const handleOpenRankX = () => {
    if (rankxUser) {
      setActiveTab('rankx-dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsRankXOpen(true);
    }
  };

  const handleRsatFunnelTrigger = () => {
    if (!rsatUser && !user) {
      setIsRsatPaymentOpen(true);
    } else {
      setIsRsatPaymentOpen(true);
    }
  };

  const handleRSATExamUnlocked = (examId) => {
    setActiveTestId(examId || 'test-rsat-scholarship');
    setIsRsatPaymentOpen(false);
    setIsCbtExamOpen(true);
  };

  // Synchronize browser history (Back/Forward) and direct URL section scroll
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleInitialSectionScroll = () => {
      const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      if (currentPath === '/courses' || currentPath === '/contact' || currentPath === '/why-us' || currentPath === '/gallery') {
        setActiveTabState('home');
        window.history.replaceState({ tab: 'home' }, '', '/');
        setTimeout(() => {
          const id = currentPath.replace('/', '');
          const targetId = id === 'courses' ? 'courses-fee' : id;
          const el = document.getElementById(targetId) || document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 250);
      } else if (ROUTE_PATH_MAP[currentPath]) {
        setActiveTabState(ROUTE_PATH_MAP[currentPath]);
      }
    };

    handleInitialSectionScroll();

    const handlePopState = (e) => {
      const currentPath = window.location.pathname.toLowerCase().replace(/\/$/, '') || '/';
      const targetTab = (e.state && e.state.tab) || ROUTE_PATH_MAP[currentPath] || 'home';
      setActiveTabState(targetTab);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Check persisted student logins independently
  useEffect(() => {
    // 1. Enrolled Classroom Student
    const cached = localStorage.getItem('rp_student_user');
    if (cached) {
      try { setUser(JSON.parse(cached)); } catch (e) {}
    }

    // 2. RSAT Scholarship Student
    const cachedRsat = localStorage.getItem('rp_rsat_user');
    if (cachedRsat) {
      try { setRsatUser(JSON.parse(cachedRsat)); } catch (e) {}
    }

    // 3. RANKEX Candidate Student
    const cachedRankx = localStorage.getItem('rp_rankx_user');
    if (cachedRankx) {
      try { setRankxUser(JSON.parse(cachedRankx)); } catch (e) {}
    }

    // Auto-detect Digital Board Studio launch via ?studio=true or ?board=true
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('studio') === 'true' || params.get('board') === 'true') {
        setIsDigitalBoardStudioOpen(true);
        if (params.get('pin')) {
          setBoardInitialPin(params.get('pin'));
        }
      }
      const cfOrderId = params.get('cf_order_id') || params.get('order_id');
      if (cfOrderId) {
        setIsCashfreePortalOpen(true);
      }
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('rp_student_token');
    localStorage.removeItem('rp_student_user');
    setUser(null);
    setActiveTab('home');
  };

  const handleRsatLogout = () => {
    localStorage.removeItem('rp_rsat_token');
    localStorage.removeItem('rp_rsat_user');
    setRsatUser(null);
    if (activeTab === 'rsat-dashboard') {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRankXLogout = () => {
    localStorage.removeItem('rp_rankx_token');
    localStorage.removeItem('rp_rankx_user');
    setRankxUser(null);
    if (activeTab === 'rankx-dashboard') {
      setActiveTab('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = (loggedUser) => {
    setUser(loggedUser);
    if (loggedUser) {
      localStorage.setItem('rp_student_user', JSON.stringify(loggedUser));
    }
  };

  const handleRsatLoginSuccess = (loggedUser) => {
    setRsatUser(loggedUser);
    if (loggedUser) {
      localStorage.setItem('rp_rsat_user', JSON.stringify(loggedUser));
    } else {
      localStorage.removeItem('rp_rsat_user');
      localStorage.removeItem('rp_rsat_token');
    }
  };

  const handleRankXLoginSuccess = (loggedUser) => {
    setRankxUser(loggedUser);
    if (loggedUser) {
      localStorage.setItem('rp_rankx_user', JSON.stringify(loggedUser));
    } else {
      localStorage.removeItem('rp_rankx_user');
      localStorage.removeItem('rp_rankx_token');
    }
  };

  const handleOpenAbout = () => {
    setActiveTab('about');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTeam = () => {
    setActiveTab('team');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenRefundPolicy = () => {
    setActiveTab('refund-policy');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAdmission = () => {
    setActiveTab('admission');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCoursePage = (slug) => {
    if (slug === 'pncf' || slug === 'foundation') {
      setActiveTab('course-foundation');
    } else if (slug === 'neet-ug') {
      setActiveTab('course-neet-ug');
    } else if (slug === 'jee-main') {
      setActiveTab('course-jee-main');
    } else {
      setActiveTab('course-jee-adv');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Reactive Dynamic On-Page SEO Engine */}
      <SEOHead activeTab={activeTab} />

      {/* Top Navbar */}
      <Navbar
        user={user}
        rsatUser={rsatUser}
        rankxUser={rankxUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={handleLogout}
        onLogoutRsat={handleRsatLogout}
        onLogoutRankX={handleRankXLogout}
        onOpenRankX={handleOpenRankX}
        onOpenRSAT={() => handleOpenRSAT()}
        onOpenDashboard={() => setActiveTab('dashboard')}
        onOpenRsatDashboard={() => setActiveTab('rsat-dashboard')}
        onOpenRankXDashboard={() => setActiveTab('rankx-dashboard')}
        onOpenAbout={handleOpenAbout}
        onOpenTeam={handleOpenTeam}
        onOpenRefundPolicy={handleOpenRefundPolicy}
        onOpenAdmission={handleOpenAdmission}
        onOpenCoursePage={handleOpenCoursePage}
        onOpenCashfreePortal={handleOpenCashfreePortal}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              onOpenRankX={handleOpenRankX}
              onOpenRSAT={() => handleOpenRSAT()}
              onOpenAdmission={handleOpenAdmission}
              onOpenEnquiry={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <CoursesSection
              onOpenEnquiry={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenRSAT={() => handleOpenRSAT()}
              onOpenRankX={handleOpenRankX}
              onOpenCoursePage={handleOpenCoursePage}
            />
            <WhyUsSection />
            <FacultySection onOpenTeam={handleOpenTeam} />
            <GallerySection />
            <TestimonialsSection
              onOpenRSAT={() => handleOpenRSAT()}
              onOpenRankX={handleOpenRankX}
              onOpenEnquiry={() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />
            <ContactAndEnquiry />
          </>
        )}

        {activeTab === 'about' && (
          <AboutRankersPathView
            onBack={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenTeam={handleOpenTeam}
            onOpenRSAT={() => handleOpenRSAT()}
            onOpenRankX={handleOpenRankX}
            onOpenAdmission={handleOpenAdmission}
            onOpenEnquiry={() => {
              setActiveTab('home');
              setTimeout(() => {
                const el = document.getElementById('contact');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />
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
            onOpenRankX={handleOpenRankX}
            onOpenRSAT={(testId) => handleOpenRSAT(testId)}
            onOpenRsatPortal={() => {
              setActiveTab('rsat-dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'rsat-dashboard' && (
          <RsatDashboardView
            user={rsatUser}
            onLaunchExam={(examId) => {
              setActiveTestId(examId || 'test-rsat-scholarship');
              setIsCbtExamOpen(true);
            }}
            onOpenPayment={() => setIsRsatPaymentOpen(true)}
            onSwitchToEnrolledPortal={() => {
              setActiveTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenReschedule={() => setIsRsatPaymentOpen(true)}
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLogout={handleRsatLogout}
          />
        )}

        {activeTab === 'rankx-dashboard' && (
          <RankXDashboardView
            user={rankxUser}
            onLaunchExam={(examId) => {
              setActiveTestId(examId || 'test-rankex-2027-class11');
              setIsCbtExamOpen(true);
            }}
            onOpenPayment={() => setIsRankXOpen(true)}
            onSwitchToRsatPortal={() => {
              setActiveTab('rsat-dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSwitchToEnrolledPortal={() => {
              setActiveTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToHome={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLogout={handleRankXLogout}
          />
        )}

        {activeTab === 'refund-policy' && (
          <RefundPolicyView
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

        {activeTab === 'admission' && (
          <AdmissionFormView
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

        {activeTab === 'course-jee-adv' && (
          <JeeAdvancedCourseView
            onBack={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmission={handleOpenAdmission}
            onOpenRSAT={() => handleOpenRSAT()}
            onOpenRankX={() => setIsRankXOpen(true)}
            onOpenRefundPolicy={handleOpenRefundPolicy}
          />
        )}

        {activeTab === 'course-neet-ug' && (
          <NeetUgCourseView
            onBack={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmission={handleOpenAdmission}
            onOpenRSAT={() => handleOpenRSAT()}
            onOpenRankX={() => setIsRankXOpen(true)}
            onOpenRefundPolicy={handleOpenRefundPolicy}
          />
        )}

        {activeTab === 'course-jee-main' && (
          <JeeMainCourseView
            onBack={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmission={handleOpenAdmission}
            onOpenRSAT={() => handleOpenRSAT()}
            onOpenRankX={() => setIsRankXOpen(true)}
            onOpenRefundPolicy={handleOpenRefundPolicy}
          />
        )}

        {activeTab === 'course-foundation' && (
          <FoundationCourseView
            onBack={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAdmission={handleOpenAdmission}
            onOpenRSAT={() => handleOpenRSAT()}
            onOpenRankX={() => setIsRankXOpen(true)}
            onOpenRefundPolicy={handleOpenRefundPolicy}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onOpenRankX={() => setIsRankXOpen(true)}
        onOpenRSAT={() => handleOpenRSAT()}
        onOpenRefundPolicy={handleOpenRefundPolicy}
        onOpenAdmission={handleOpenAdmission}
        onOpenCoursePage={handleOpenCoursePage}
        onOpenCashfreePortal={handleOpenCashfreePortal}
        onOpenAbout={handleOpenAbout}
        onOpenTeam={handleOpenTeam}
      />

      {/* Dual Alternating Promo Popups: RSAT & RANKEX with 10-Second Auto-Dismiss (Home only) */}
      {activeTab === 'home' && (
        <DualPromoPopup
          user={user}
          onOpenRSAT={() => handleOpenRSAT()}
          onOpenRankX={() => setIsRankXOpen(true)}
        />
      )}

      {/* Interactive Modals */}
      <RankXModal
        isOpen={isRankXOpen}
        onClose={() => setIsRankXOpen(false)}
        user={rankxUser}
        onLoginSuccess={handleRankXLoginSuccess}
        onLogout={handleRankXLogout}
        onRequireLogin={() => {
          setIsRankXOpen(false);
          setIsLoginOpen(true);
        }}
        onLaunchOnlineExam={(testId) => {
          setIsRankXOpen(false);
          setActiveTestId(testId || 'test-rankex-2027-class11');
          setIsCbtExamOpen(true);
        }}
        onOpenRankXDashboard={() => {
          setIsRankXOpen(false);
          setActiveTab('rankx-dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* RSAT Registration & ₹100 Payment Modal */}
      <RSATPaymentModal
        isOpen={isRsatPaymentOpen}
        onClose={() => setIsRsatPaymentOpen(false)}
        user={rsatUser}
        onLoginSuccess={handleRsatLoginSuccess}
        onLogout={handleRsatLogout}
        onExamUnlocked={handleRSATExamUnlocked}
        onOpenRsatDashboard={(slotInfo) => {
          setIsRsatPaymentOpen(false);
          setActiveTab('rsat-dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* CBT Exam Modal */}
      <CbtExamModal
        isOpen={isCbtExamOpen}
        onClose={() => {
          setIsCbtExamOpen(false);
          setActiveTestId(null);
        }}
        user={user || rsatUser || rankxUser}
        initialTestId={activeTestId}
      />

      <AuthModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setIsRsatFunnelIntent(false);
        }}
        onLoginSuccess={(loggedUser) => {
          handleLoginSuccess(loggedUser);
          setIsLoginOpen(false);
          if (isRsatFunnelIntent) {
            setIsRsatFunnelIntent(false);
            // Open RSAT payment/timing modal for the user
            setTimeout(() => {
              setIsRsatPaymentOpen(true);
            }, 200);
          } else {
            setActiveTab('dashboard');
          }
        }}
      />

      {/* Cashfree Online Fee & Admission Payment Portal Modal */}
      <CashfreePaymentPortalModal
        isOpen={isCashfreePortalOpen}
        onClose={() => setIsCashfreePortalOpen(false)}
        initialPurpose={cashfreePurpose}
        user={user}
      />

      {/* Epson 75" 4K Smart Board Touch Studio Host Modal */}
      <DigitalBoardHostModal
        isOpen={isDigitalBoardStudioOpen}
        onClose={() => setIsDigitalBoardStudioOpen(false)}
        initialPin={boardInitialPin}
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
