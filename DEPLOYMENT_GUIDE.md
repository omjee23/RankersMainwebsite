# 🚀 Rankers Path Platform — Deployment & Production Guide

This comprehensive handbook provides complete, step-by-step instructions for pushing the codebase to your GitHub repository and deploying all three services (**Main Website**, **Admin Portal**, and **Backend Server**) to production.

---

## 📁 Architecture Overview

```
RankerProject/
├── mainWebsitefronted/   -> Public Website & Student Portal (Vite + React)
├── adminFronted/         -> Super Administrator & Faculty Dashboard (Vite + React)
└── backend/              -> Express REST API, CBT Engine & Razorpay Checkout (Node.js)
```

---

## 1. 🐙 How to Push to GitHub (Run on Your Mac Terminal)

Since you prefer to personally push the code to your GitHub repository, open your Mac terminal in the `RankerProject` folder and execute the following commands:

```bash
# 1. Navigate to the project root
cd /Users/hiiom/Documents/Developer/RankerProject

# 2. Untrack sensitive credentials and build caches from Git index
git rm --cached backend/.env
git rm -r --cached adminFronted/dist mainWebsitefronted/dist 2>/dev/null || true

# 3. Add all cleaned and prepared files
git add .

# 4. Commit your changes
git commit -m "feat: complete Rankers Path platform with dynamic gallery, dual popups, and deployment configs"

# 5. Push to your GitHub repository
git push origin main
```

> [!TIP]
> The root `.gitignore` is pre-configured to automatically protect:
> - `backend/.env` (Never exposes live Razorpay secret keys)
> - `krishnacollege` (External symlinks are strictly excluded)
> - `node_modules/` and `dist/` folders across all directories.

---

## 2. 🌐 Deploying the Backend API (Render / Railway / VPS)

### Option A: Deploy on Render.com (Recommended Free/Low Cost)
1. Log in to [Render.com](https://render.com) and click **New +** &rarr; **Web Service**.
2. Connect your GitHub repository.
3. Configure the settings:
   - **Name**: `rankerspath-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Add **Environment Variables**:
   - `PORT`: `5002` (or let Render set default `10000`)
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: *(A random 32-character secure string)*
   - `RAZORPAY_KEY_ID`: `rzp_test_TlskCN2MeU7OYI` (or your live key)
   - `RAZORPAY_KEY_SECRET`: `0A2zUtzhrZKlOgYgtiRcCGr0` (or your live secret)
   - `ALLOWED_ORIGINS`: `https://rankerspath.in,https://admin.rankerspath.in`
5. Click **Deploy Web Service**.
6. Render will assign you a live URL, for example: `https://rankerspath-backend.onrender.com/api`.

---

## 3. 💻 Deploying the Main Website (`mainWebsitefronted`)

### Deploy on Vercel / Netlify:
1. Go to [Vercel](https://vercel.com) &rarr; **Add New Project**.
2. Select your repository.
3. In **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `mainWebsitefronted`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://rankerspath-backend.onrender.com/api` (Replace with your live backend URL)
   - `VITE_RAZORPAY_KEY_ID`: `rzp_test_TlskCN2MeU7OYI`
5. Click **Deploy**.
6. Set custom domain in Vercel: `rankerspath.in` & `www.rankerspath.in`.

---

## 4. 🛡️ Deploying the Admin Portal (`adminFronted`)

### Deploy on Vercel / Netlify:
1. Go to [Vercel](https://vercel.com) &rarr; **Add New Project** (select the same repo again).
2. In **Project Settings**:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `adminFronted`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://rankerspath-backend.onrender.com/api`
4. Click **Deploy**.
5. Set custom subdomain in Vercel: `admin.rankerspath.in`.

---

## 5. ⚙️ Pre-configured Production Enhancements

The codebase already includes all production hardening features:
- **SPA Fallback Routing**: `_redirects` and `vercel.json` are installed in both frontends to prevent 404 errors on browser page reloads.
- **Traffic Compression**: Gzip & Deflate native Node.js compression active in backend (`compressionMiddleware.js`).
- **Image Optimization**: Client-side image compressor (<50KB WebP) active for all photo uploads.
- **SEO & Search Console**: Verified `robots.txt`, `sitemap.xml`, and Google Schema.org structured data.
- **Dynamic Campus Gallery**: Live uploads managed directly from Admin without rebuilding the site.

---
