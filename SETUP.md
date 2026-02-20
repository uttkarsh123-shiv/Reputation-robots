# Simple Setup Guide

## Quick Start (Production URLs Already Set)

Your app is configured to use deployed backend by default:
- **Backend**: https://market-place-q2ss.onrender.com
- **Frontend**: https://market-place-olive.vercel.app

### Run Web App
```bash
cd web
npm install
npm run dev
```
Opens at `http://localhost:5173` and connects to production backend

### Run Mobile App
```bash
cd mobile
npm install
npm start
```
Scan QR code with Expo Go - connects to production backend

---

## For Local Backend Development

If you want to run backend locally:

### 1. Start Backend
```bash
cd backend

# Edit .env and change:
# NODE_ENV=development
# CLIENT_URL=*

npm install
npm run dev
```

### 2. Update Web
Edit `web/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Then restart: `npm run dev`

### 3. Update Mobile
Edit `mobile/src/config/api.js`:
```javascript
const API_URL = 'http://192.168.1.6:5000/api'; // Your PC IP
```

---

## Environment Files

### Backend `.env` (Currently: Production)
```env
NODE_ENV=production
CLIENT_URL=https://market-place-olive.vercel.app
```

### Web `.env` (Currently: Production)
```env
VITE_API_URL=https://market-place-q2ss.onrender.com/api
```

### Mobile `src/config/api.js` (Currently: Production)
```javascript
const API_URL = 'https://market-place-q2ss.onrender.com/api';
```

---

## Deployment

### Backend (Render)
Already deployed! Set these environment variables in Render dashboard:
- `NODE_ENV=production`
- `MONGODB_URI=your_mongodb_uri`
- `JWT_SECRET=your_secret`
- `CLIENT_URL=https://market-place-olive.vercel.app`

### Frontend (Vercel)
Already deployed! Set this environment variable in Vercel dashboard:
- `VITE_API_URL=https://market-place-q2ss.onrender.com/api`

### Mobile (Expo)
Just run `npm start` and scan QR code - it's already configured for production!

---

## That's it! 🎉

Everything is set up for production. Only change URLs if you need to develop locally.
