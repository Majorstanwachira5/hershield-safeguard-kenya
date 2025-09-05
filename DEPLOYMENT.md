# 🚀 HerShield Deployment Guide

## Quick Deploy Options

### 🔵 **Option 1: Vercel (Recommended for Frontend)**

**Step 1: Connect to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `Majorstanwachira5/hershield-safeguard-kenya`

**Step 2: Configure Build Settings**
- **Framework Preset**: Vite
- **Root Directory**: `./` (leave default)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**Step 3: Add Environment Variables**
```
VITE_API_BASE_URL = https://hershield-backend.railway.app/api/v1
```

**Step 4: Deploy**
- Click "Deploy"
- Your app will be live at: `https://hershield-safeguard-kenya.vercel.app`

---

### 🟢 **Option 2: Netlify (Alternative Frontend)**

**Step 1: Connect to Netlify**
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "New site from Git"
4. Choose `Majorstanwachira5/hershield-safeguard-kenya`

**Step 2: Configure Build Settings**
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Production branch**: `main`

**Step 3: Add Environment Variables**
Go to Site Settings > Environment Variables:
```
VITE_API_BASE_URL = https://hershield-backend.railway.app/api/v1
```

**Step 4: Deploy**
- Click "Deploy site"
- Your app will be live at: `https://hershield-safeguard-kenya.netlify.app`

---

### 🚂 **Backend Deployment: Railway (Required for AI Features)**

**Step 1: Connect to Railway**
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"
5. Choose `Majorstanwachira5/hershield-safeguard-kenya`

**Step 2: Configure Service**
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node dist/server.js`

**Step 3: Add Environment Variables**
```
NODE_ENV=production
PORT=5050
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hershield
JWT_SECRET=your-super-secure-jwt-secret-key
JWT_EXPIRE=90d
OPENAI_API_KEY=your-openai-api-key (optional)
```

**Step 4: Database Setup**
1. Add MongoDB service in Railway
2. Or use MongoDB Atlas (recommended)
3. Update MONGODB_URI with connection string

**Step 5: Deploy**
- Railway will auto-deploy
- Your API will be live at: `https://hershield-backend.railway.app`

---

## 🎯 **One-Click Deployment Buttons**

### Deploy Frontend to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Majorstanwachira5/hershield-safeguard-kenya&env=VITE_API_BASE_URL&envDescription=API%20Base%20URL%20for%20backend&envLink=https://github.com/Majorstanwachira5/hershield-safeguard-kenya%23environment-variables)

### Deploy Frontend to Netlify
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Majorstanwachira5/hershield-safeguard-kenya)

### Deploy Backend to Railway
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/8J4Jj1?referralCode=alphasec)

---

## 🌍 **Environment Variables Guide**

### Frontend (.env)
```bash
VITE_API_BASE_URL=https://your-backend-url.com/api/v1
```

### Backend (Railway/Production)
```bash
NODE_ENV=production
PORT=5050
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hershield
JWT_SECRET=your-super-secure-secret-minimum-32-characters
JWT_EXPIRE=90d
BCRYPT_SALT_ROUNDS=12

# Optional AI Features
OPENAI_API_KEY=sk-your-openai-key

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 📱 **Mobile App Features**

Once deployed, your app will have:
- ✅ **PWA Support**: Users can install it as an app
- ✅ **Mobile Responsive**: Works on all Android/iOS devices
- ✅ **Offline Capable**: Core features work without internet
- ✅ **Push Notifications**: Emergency alerts (when configured)

---

## 🛠️ **Advanced Deployment**

### Using CLI Commands

**Vercel:**
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=dist
```

**Railway:**
```bash
npm install -g @railway/cli
railway login
railway up
```

---

## 🔍 **Verification Steps**

After deployment, verify:

1. **Frontend Health Check**
   - Visit your deployed URL
   - Check if AI Safety Hub loads at `/ai`
   - Verify mobile responsiveness

2. **Backend Health Check**
   - Visit `https://your-backend-url.com/health`
   - Should return success status

3. **AI Features**
   - Test Message Analyzer
   - Try Safety Advisor
   - Check Emergency Center

---

## 🚨 **Troubleshooting**

### Common Issues:

**Build Fails:**
- Check if all dependencies are in `package.json`
- Verify Node.js version compatibility (18+)

**API Connection Issues:**
- Verify `VITE_API_BASE_URL` points to correct backend
- Check CORS settings in backend
- Ensure backend is running and accessible

**Database Connection:**
- Verify MongoDB URI is correct
- Check IP whitelist settings in MongoDB Atlas
- Ensure database user has proper permissions

---

## 📞 **Support**

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/Majorstanwachira5/hershield-safeguard-kenya/issues)
2. Review deployment logs in your platform
3. Verify all environment variables are set correctly

---

**🎉 Once deployed, share your live HerShield app with the world!**

**Live URLs:**
- **Frontend**: `https://hershield-safeguard-kenya.vercel.app`
- **Backend**: `https://hershield-backend.railway.app`
- **GitHub**: `https://github.com/Majorstanwachira5/hershield-safeguard-kenya`
