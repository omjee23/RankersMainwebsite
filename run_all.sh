#!/bin/bash

echo "=========================================================="
echo "🚀 STARTING RANKERS PATH FULL-STACK PLATFORM"
echo "=========================================================="

# 1. Start Backend in Background
echo "Starting Backend on Port 5001..."
(cd backend && node server.js) &
BACKEND_PID=$!

# 2. Start Main Website
echo "Starting Main Website Frontend on Port 5173..."
(cd mainWebsitefronted && npm run dev) &
WEB_PID=$!

# 3. Start Admin Frontend
echo "Starting Admin Portal Frontend on Port 5174..."
(cd adminFronted && npm run dev) &
ADMIN_PID=$!

echo ""
echo "✅ All 3 services launched:"
echo "🌐 Main Website: http://localhost:5173"
echo "👑 Admin Portal: http://localhost:5174"
echo "⚙️ Backend API:  http://localhost:5001/api"
echo ""
echo "Press Ctrl+C to stop all servers."

trap "kill $BACKEND_PID $WEB_PID $ADMIN_PID" EXIT
wait
