#!/bin/bash
# ==============================================================================
# Rankers Path - Automated VPS Provisioning Script for Ubuntu 22.04 / 24.04 LTS
# ==============================================================================
set -e

echo "=== 1. Updating System Packages ==="
apt update && apt upgrade -y
apt install -y curl wget git ufw nginx certbot python3-certbot-nginx build-essential

echo "=== 2. Installing Node.js 20 LTS & PM2 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "PM2 version: $(pm2 -v)"

echo "=== 3. Setting Up UFW Firewall ==="
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
ufw status

echo "=== 4. Creating Web Directory ==="
mkdir -p /var/www/rankerproject

echo "=== System Preparation Complete! ==="
echo "Now upload your project code to /var/www/rankerproject"
