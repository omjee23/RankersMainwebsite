#!/bin/bash

echo "=========================================================="
echo "🚀 STARTING RANKERS PATH FULL-STACK 3-TIER PLATFORM"
echo "=========================================================="

# 1. Start Backend API in Background (Port: 5002)
echo "Starting Backend API Server on Port 5002..."
(cd backend && node server.js) &
BACKEND_PID=$!

# 2. Start Main Student Website in Background (Port: 5175)
echo "Starting Main Student Website on Port 5175..."
(cd mainWebsitefronted && npm run dev) &
WEB_PID=$!

# 3. Start Admin Portal in Background (Port: 5174)
echo "Starting Admin & Faculty Portal on Port 5174..."
(cd adminFronted && npm run dev) &
ADMIN_PID=$!

echo ""
echo "✅ All 3 services launched successfully:"
echo "🌐 Main Website: http://localhost:5175"
echo "👑 Admin Portal: http://localhost:5174"
echo "⚙️ Backend API:  http://localhost:5002/api"
echo ""
echo "Press Ctrl+C to terminate all servers."

trap "kill $BACKEND_PID $WEB_PID $ADMIN_PID" EXIT
wait
