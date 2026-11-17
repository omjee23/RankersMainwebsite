#!/bin/bash
# ==============================================================================
# Rankers Path - One-Command Zero-Downtime Live Update Script
# Usage on VPS: cd /var/www/rankerproject && bash update.sh
# ==============================================================================
set -e

echo "=================================================="
echo "🚀 1. Pulling latest code from GitHub..."
echo "=================================================="
cd /var/www/rankerproject
git pull origin main

echo "=================================================="
echo "⚙️ 2. Updating Backend & Reloading PM2..."
echo "=================================================="
cd /var/www/rankerproject/backend
npm install --production
pm2 reload rankers-backend || pm2 restart rankers-backend

echo "=================================================="
echo "🌐 3. Rebuilding Main Website Frontend..."
echo "=================================================="
cd /var/www/rankerproject/mainWebsitefronted
npm install
npm run build

echo "=================================================="
echo "🛡️ 4. Rebuilding Admin ERP Portal..."
echo "=================================================="
cd /var/www/rankerproject/adminFronted
npm install
npm run build

echo "=================================================="
echo "🔄 5. Reloading Nginx Web Server..."
echo "=================================================="
nginx -t && systemctl reload nginx

echo "=================================================="
echo "🎉 SUCCESS! All changes are now LIVE on:"
echo "   🌐 https://rankerspath.co.in"
echo "   🛡️ https://admin.rankerspath.co.in"
echo "=================================================="
