require('dotenv').config();
const http = require('http');
const app = require('./app');
const { initializeDatabase } = require('./config/db');

const PORT = process.env.PORT || 5002;

async function bootstrap() {
  // 1. Initialize persistent storage and seed default collections
  await initializeDatabase();

  // 2. Create HTTP server instance
  const server = http.createServer(app);

  // 3. Listen on configured port
  server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 RANKERS PATH BACKEND SERVER RUNNING ON PORT: ${PORT}`);
    console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
    console.log(`🩺 Healthcheck: http://localhost:${PORT}/api/health`);
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`======================================================\n`);
  });
}

bootstrap().catch((err) => {
  console.error('💥 Fatal initialization error:', err);
});

// Handle uncaught exceptions gracefully
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled Rejection:', err.message);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught Exception:', err.message);
});
