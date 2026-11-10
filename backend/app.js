const express = require('express');
const cors = require('cors');
const path = require('path');

// Middlewares
const errorHandler = require('./middlewares/errorHandler');
const compressionMiddleware = require('./middlewares/compressionMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const rankXRoutes = require('./routes/rankXRoutes');
const rsatRoutes = require('./routes/rsatRoutes');
const examRoutes = require('./routes/examRoutes');
const questionRoutes = require('./routes/questionRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cashfreeRoutes = require('./routes/cashfreeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const cmsRoutes = require('./routes/cmsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const facultyRoutes = require('./routes/facultyRoutes');
const courseRoutes = require('./routes/courseRoutes');
const admissionRoutes = require('./routes/admissionRoutes');
const studyMaterialRoutes = require('./routes/studyMaterialRoutes');
const liveClassRoutes = require('./routes/liveClassRoutes');
const recordedLectureRoutes = require('./routes/recordedLectureRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const feeRoutes = require('./routes/feeRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');

const app = express();

// Global Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compressionMiddleware);

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'Rankers Path Backend API',
    timestamp: new Date().toISOString()
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/rankx', rankXRoutes);
app.use('/api/rsat', rsatRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payments/cashfree', cashfreeRoutes);
app.use('/api/fees', feeRoutes);


app.use('/api/admin', adminRoutes);
app.use('/api/cms', cmsRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/faculty', facultyRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admissions', admissionRoutes);
app.use('/api/study-materials', studyMaterialRoutes);
app.use('/api/live-classes', liveClassRoutes);
app.use('/api/recorded-lectures', recordedLectureRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/testimonials', testimonialRoutes);

// Catch-all 404
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.method} ${req.originalUrl}`
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
