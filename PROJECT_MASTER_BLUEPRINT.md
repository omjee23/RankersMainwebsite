# 🏛️ RANKERS PATH — MASTER PROJECT BLUEPRINT & ARCHITECTURE
**NEET & IIT-JEE Coaching Platform, Scholarship Examination (RankX / RSAT), Test Series & Institutional ERP**

> **Institute Tagline:** *Safalta Ka Sankalp*  
> **Location:** HQ City Walk, Scheme No. 54, Near Satya Sai Square, Vijay Nagar, Indore, M.P.  
> **Document Purpose:** Central single source of truth for the complete system architecture, UI/UX design standards, feature breakdown, database schemas, API routes, and implementation roadmap.

---

## 🎨 1. BRAND IDENTITY & DESIGN SYSTEM (PRO-LEVEL AESTHETICS)

### Core Color Palette
Inspired by the institute’s official brand and student dress uniform (Iconic Academic Yellow & Trust Navy):
* **Primary Brand Yellow (Dress Color):** `#FFB800` / `#F59E0B` (Vibrant, high-energy academic gold/amber)
* **Deep Contrast Navy (Institutional Trust):** `#0B1B3D` / `#0F2B48` (Prestigious oxford navy, high contrast against yellow)
* **Accent Gold / Highlight:** `#D97706` / `#FEF3C7` (Warm focus accents, badges, and alerts)
* **Backgrounds:** Pure Crisp White (`#FFFFFF`) & Soft Tech Slate (`#F8FAFC` / `#F1F5F9`)
* **Dark Slate Neutral (Text):** `#0F172A` (Headings) and `#334155` (Body text)
* **Status Colors:**
  * 🟩 **Answered / Success:** `#10B981` (NTA Green)
  * 🟥 **Unanswered / Danger:** `#EF4444` (NTA Red)
  * 🟪 **Marked for Review:** `#8B5CF6` (NTA Purple)
  * ⬜ **Not Visited:** `#94A3B8` (NTA Slate Gray)

### Typography & Visual Style
* **Headings:** `Plus Jakarta Sans` / `Poppins` (Bold, modern, authoritative typography)
* **Body & Numbers:** `Inter` (Optimized for readability of questions, mathematical numbers, and tables)
* **Formula & Equations:** `KaTeX` / `MathJax` (Crisp rendering of NEET/JEE physics and chemistry formulas)
* **Component Styling:** Soft card shadows (`shadow-sm`, `shadow-xl`), rounded borders (`rounded-2xl`), frosted glass headers (`backdrop-blur-md bg-white/90`), and smooth micro-interactions.

---

## 🗂️ 2. WORKSPACE DIRECTORY ARCHITECTURE

```
RankerProject/
│
├── PROJECT_MASTER_BLUEPRINT.md    <-- [YOU ARE HERE] Single source of truth for the entire platform
│
├── mainWebsitefronted/             <-- Public Website + Student Portal + CBT Exam Hall
│   ├── public/
│   │   ├── assets/                 <-- Logos, faculty photos, gallery, student dress imagery
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             <-- Navbar, AnnouncementBanner, Footer, MobileNav
│   │   │   ├── home/               <-- Hero, FacultyGrid, Courses, ComparisonTable, Gallery, Contact
│   │   │   ├── rankx/              <-- RankX offline exam info & venue booking modal
│   │   │   ├── rsat/               <-- RSAT online exam onboarding & instructions
│   │   │   ├── testSeries/         <-- Test series catalog & test cards
│   │   │   ├── cbt/                <-- Real NTA-Style Online CBT Exam Screen
│   │   │   └── common/             <-- Button, Modal, Card, OTPInput, Badge, Loader
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── RankXRegistrationPage.jsx
│   │   │   ├── RSATRegistrationPage.jsx
│   │   │   ├── CourseEnrolmentPage.jsx
│   │   │   ├── StudentLoginPage.jsx
│   │   │   ├── StudentDashboardPage.jsx
│   │   │   ├── OnlineExamScreenPage.jsx
│   │   │   ├── ResultCardPage.jsx
│   │   │   └── RefundPolicyPage.jsx
│   │   ├── context/                <-- AuthContext, ExamContext, CartContext
│   │   ├── services/               <-- API client (axios), authService, examService, paymentService
│   │   └── styles/
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── adminFronted/                   <-- Super Admin & Faculty Management Portal
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/             <-- AdminSidebar, AdminHeader, StatsCard
│   │   │   ├── charts/             <-- RegistrationTrends, RevenueChart, AccuracyChart
│   │   │   ├── tables/             <-- DataTable with search, filters, pagination & Excel export
│   │   │   └── questionBuilder/    <-- Rich MCQ editor with formula & image support
│   │   ├── pages/
│   │   │   ├── AdminLoginPage.jsx
│   │   │   ├── DashboardOverview.jsx
│   │   │   ├── StudentManagement.jsx       <-- Search, filter, edit, view history
│   │   │   ├── RankXCentresPage.jsx        <-- Venue capacities, attendance & QR scanner
│   │   │   ├── OfflineMarksUpload.jsx      <-- Bulk Excel/CSV upload for RankX marks
│   │   │   ├── OnlineExamsManagement.jsx   <-- RSAT & 20 Test Series scheduler
│   │   │   ├── QuestionBankPage.jsx        <-- MCQ repository & bulk question import
│   │   │   ├── PaymentReconciliation.jsx   <-- PayU/Razorpay transaction audit & receipts
│   │   │   ├── WebsiteCMSPage.jsx          <-- Change batch dates, banners, notices in 1 click
│   │   │   ├── SMSLogsPage.jsx             <-- OTP delivery tracking & audit logs
│   │   │   └── ReportsExportPage.jsx       <-- 18 exportable reports (CSV/Excel)
│   │   ├── services/               <-- adminApi, exportService, questionApi
│   │   └── App.jsx
│   └── package.json
│
└── backend/                        <-- Enterprise-Grade Structured REST API
    ├── server.js                   <-- Clean entrypoint (Server boot, DB connection, port listen)
    ├── app.js                      <-- Express app configuration, CORS, rate limits, route mounting
    ├── config/
    │   ├── db.js                   <-- Database connection (MongoDB / PostgreSQL)
    │   ├── constants.js            <-- Exam rules, status enums, NTA marks (+4/-1), pricing
    │   └── smsGateway.js           <-- SMS API configuration & DLT template IDs
    ├── models/
    │   ├── User.js                 <-- Auth model (Student, Teacher, SuperAdmin)
    │   ├── StudentProfile.js       <-- Full student demographic, school, photo, parent details
    │   ├── RankXRegistration.js    <-- Offline exam registration, venue ID, admit card QR
    │   ├── RSATRegistration.js     <-- Online scholarship exam registration
    │   ├── CourseEnrolment.js      <-- Academic batches & course admissions
    │   ├── Exam.js                 <-- Exam definition (RankX, RSAT, 20 Test Series)
    │   ├── Question.js             <-- MCQ schema (Subjects, options, correct key, solutions, images)
    │   ├── ExamSubmission.js       <-- Answers, time taken per question, marks, percentile
    │   ├── ExaminationCentre.js    <-- Physical venue, address, capacity, booked count
    │   ├── PaymentTransaction.js   <-- Gateway order ID, amount, status, signature, PDF receipt
    │   ├── SMSLog.js               <-- Mobile, OTP, status, template ID, timestamp
    │   └── CMSContent.js           <-- Dynamic banners, batch announcements, faculty info
    ├── controllers/
    │   ├── authController.js       <-- Send OTP, Verify OTP, Password Login, Token Refresh
    │   ├── studentController.js    <-- Profile management, registered exams, payment history
    │   ├── rankXController.js      <-- Offline exam registration, centre selection, admit card
    │   ├── rsatController.js       <-- RSAT online exam booking & eligibility
    │   ├── examEngineController.js <-- Start test, fetch questions, auto-save answers, submit
    │   ├── questionController.js   <-- CRUD questions, bulk Excel import
    │   ├── offlineMarksController.js<-- Upload Excel marksheet, calculate ranks, publish
    │   ├── paymentController.js    <-- Create order, verify webhook/signature, refund status
    │   ├── adminController.js      <-- Dashboard metrics, centre capacity, student management
    │   ├── cmsController.js        <-- Dynamic homepage notices, batch alerts, gallery
    │   └── reportController.js     <-- Generate and stream CSV/Excel reports
    ├── routes/
    │   ├── authRoutes.js
    │   ├── studentRoutes.js
    │   ├── rankXRoutes.js
    │   ├── rsatRoutes.js
    │   ├── examRoutes.js
    │   ├── questionRoutes.js
    │   ├── paymentRoutes.js
    │   ├── adminRoutes.js
    │   ├── cmsRoutes.js
    │   └── reportRoutes.js
    ├── middlewares/
    │   ├── authMiddleware.js       <-- JWT verification
    │   ├── roleMiddleware.js       <-- Admin / Teacher / Student permission enforcement
    │   ├── rateLimiter.js          <-- OTP flood protection & brute force prevention
    │   ├── antiCheatValidator.js   <-- Server-side exam timer and tamper verification
    │   ├── uploadMiddleware.js     <-- Multer file upload (student photo, marksheet Excel)
    │   └── errorHandler.js         <-- Centralized error and exception handler
    ├── services/
    │   ├── smsService.js           <-- Fast2SMS / Msg91 / Twilio OTP gateway integration
    │   ├── paymentService.js       <-- PayU / Razorpay SDK integration
    │   ├── qrCodeService.js        <-- QR code generator for Admit Cards
    │   └── pdfService.js           <-- Dynamic Admit Card and Fee Receipt PDF generator
    ├── utils/
    │   ├── apiResponse.js          <-- Standard { success, message, data } response formatter
    │   └── excelParser.js          <-- Excel/CSV reader and writer
    └── package.json
```

---

## 💻 3. CORE MODULES BREAKDOWN

### Module 1: Student Verification & Authentication
* **Mobile Number SMS OTP Verification:**
  * Mandatory 6-digit OTP sent to student mobile.
  * Rate-limited to max 3 attempts per 10 minutes to prevent SMS billing abuse.
  * Duplicate mobile check: Prevents multiple accounts under the same mobile number.
* **Dual Login Support:**
  * Quick 1-click Mobile OTP Login for students.
  * Secure Password/PIN login for registered students & faculty/admin.

### Module 2: RankX — Offline Scholarship Examination
* **Concept:** Managed online, conducted physically at designated Indore/MP test centers.
* **Online Booking Flow:**
  1. Student selects Class (8th to 12th/Dropper) and Stream (NEET / IIT-JEE).
  2. Student selects preferred Examination Centre (e.g., Vijay Nagar Centre, Annapurna Centre, Palasia Centre).
  3. System checks **live seat capacity** (prevents overbooking).
  4. Online payment / free voucher application.
  5. System generates **Unique Roll Number & Digital Admit Card (PDF)** with a scannable **QR Code**.
* **Offline Execution & Result Upload:**
  * Center coordinators scan QR code on arrival to mark attendance.
  * Faculty conducts test, grades OMR/answer sheets, and uploads **bulk marks via Excel/CSV**.
  * System auto-calculates Scores, Percentiles, Ranks, and Scholarship Discounts (e.g., 100%, 75%, 50%, 25%).
  * Instant result publication on student dashboard + SMS alert.

### Module 3: RSAT — Online Scholarship Examination
* **Concept:** 100% online scholarship test with timed computer-based interface.
* **Duration:** 45–60 minutes | MCQ format | Physics, Chemistry, Biology/Mathematics.
* **Features:**
  * Scheduled test window (e.g., Sunday 10:00 AM – 11:00 AM).
  * Auto-calculated scholarship percentage based on score cut-offs.

### Module 4: NTA-Standard CBT Online Test Engine
* **Authentic NEET/JEE Exam Interface:**
  * Question Palette on right side with live status count:
    * 🟩 Answered | 🟥 Not Answered | 🟪 Marked for Review | ⬜ Not Visited
  * Action buttons: *Save & Next*, *Clear Response*, *Mark for Review & Next*.
  * Subject Switcher tabs: *Physics*, *Chemistry*, *Biology / Mathematics*.
* **Exam Integrity & Anti-Cheating System:**
  * **Server-Synced Countdown Timer:** Cannot be bypassed by altering local machine time.
  * **Tab-Switching Detection:** Warns student on losing window focus; auto-submits after 3 violations.
  * **Local State Auto-Save:** Every answer is saved every 5 seconds; test can resume seamlessly even on internet disconnect.
  * Right-click, inspect element, and copy-paste strictly disabled.
* **Instant & Scheduled Result Analytics:**
  * Marks calculation with standard NEET/JEE marking (+4 for correct, -1 for incorrect, 0 for unattempted).
  * Subject-wise performance radar & accuracy percentage.
  * Time management breakdown (Average time per question).

### Module 5: Year-Long Online Test Series (20 Tests)
* **Target Audience:** NEET & IIT-JEE 11th, 12th, and Dropper aspirants.
* **Structure:** 20 Scheduled Full-Syllabus and Part-Syllabus Tests.
* **Lifecycle:**
  * Test activated on scheduled date/time.
  * Once the window closes, missed tests are marked as *Lapsed/Expired* (as per institute policy).
  * Comprehensive performance comparison across all 20 tests.

### Module 6: Course Admissions & Fee Collection
* **Courses:**
  * 11th + 12th NEET Two-Year Comprehensive
  * 11th + 12th IIT-JEE (Mains + Advanced)
  * Dropper / Repeater NEET & JEE Focus Batches
  * 9th & 10th Foundation (Olympiads, NTSE, IOQM, SOF)
* **Fee Engine:**
  * One-time registration fee collection + Course installment tracking.
  * Integration with PayU / Razorpay (UPI, Google Pay, PhonePe, Cards, NetBanking).
  * Anti-duplicate transaction lock and downloadable GST-compliant digital receipts.

### Module 7: Role-Based Dashboards
1. **Student Dashboard:**
   * Profile & enrollment status.
   * Download Admit Cards (RankX) with QR code.
   * Access RSAT & Test Series CBT hall.
   * Complete test score history & downloadable PDF receipts.
2. **Teacher / Faculty Dashboard:**
   * Question Bank Builder (add questions, LaTeX math formulas, options, solutions).
   * Bulk Excel mark sheet upload for offline exams.
   * Class performance & accuracy analytics.
3. **Admin Management Dashboard:**
   * Real-time metrics: Total registrations, paid vs. unpaid, today's revenue.
   * Physical exam center capacity management.
   * Payment audit & reconciliation.
   * Dynamic CMS: Update website hero banners, new batch start dates, and gallery without coding.
   * 18 Exportable Excel/CSV reports.

---

## 📊 4. 18 EXPORTABLE REPORTS & ANALYTICS
The platform provides instant 1-click Excel/CSV export for:
1. Overall Student Registration Report
2. Examination-wise Registration Breakdown
3. Class-wise Registration Report (8th, 9th, 10th, 11th, 12th, Dropper)
4. Stream / Subject-wise Registration (NEET vs. IIT-JEE)
5. Physical Centre-wise Allocation & Capacity Report
6. Paid vs. Unpaid Registrations
7. Payment Transaction Log (Success, Pending, Failed)
8. SMS Gateway Delivery & Log Report
9. RankX Candidate Attendance Sheet (for invigilators)
10. RankX Offline Marks & Rank List
11. RSAT Online Score & Scholarship Allocation Report
12. Test Series 20-Test Participation Report
13. Missed / Lapsed Test Report
14. Student Performance & Progress Radar Report
15. Course Enrolment & Lead Inquiries Report
16. Gateway Settlement & Transaction Reconciliation Report
17. Teacher Activity & Question Creation Audit
18. System Error & Security Logs

---

## 🚀 5. IMPLEMENTATION ROADMAP & CHECKLIST

- [ ] **Phase 1: Brand Assets & Media Sync**
  - Download all original high-res assets from `rankerspath.in` (Logos, faculty photos, gallery images, student uniform theme).
  - Configure Tailwind design tokens matching `#FFB800` (Yellow) and `#0B1B3D` (Navy Blue).

- [ ] **Phase 2: Modular Enterprise Backend**
  - Set up `server.js`, `app.js`, database connection, and environment config.
  - Implement Mongoose/PostgreSQL models for Users, Profiles, Exams, Questions, Payments, and CMS.
  - Build Auth & SMS OTP controller with rate-limiting.
  - Build Exam Engine with server-side timer and auto-grading.
  - Build Payment Gateway integration and PDF receipt/admit card generators.
  - Build CSV/Excel bulk import/export utilities.

- [ ] **Phase 3: High-Converting Main Website & Student Portal (`mainWebsitefronted`)**
  - Modernized Pro-level UI with yellow uniform accents & navy trust contrast.
  - Dynamic Hero section with RankX/RSAT registration triggers.
  - Interactive Faculty Showcase, Course Catalog & Comparison Matrix.
  - Student Registration & OTP Modal.
  - Student Dashboard (Admit Card, Receipts, Test Results).
  - Real NTA-Style CBT Online Exam Hall with formula rendering.

- [ ] **Phase 4: Admin & Faculty Control Hub (`adminFronted`)**
  - Super Admin & Teacher Auth.
  - Live Analytics Dashboard with Recharts.
  - Question Bank Studio & CSV Question Importer.
  - RankX Center Manager & QR Attendance Scanner.
  - Offline Mark sheet CSV Uploader & Rank Publisher.
  - Website CMS (Dynamic Batch Date & Announcement Manager).
  - 18 Excel/CSV Report Exporters.

- [ ] **Phase 5: Security Audits & End-to-End Testing**
  - Anti-cheat testing, payment failure recovery, OTP brute force tests, and mobile responsiveness across all devices.
