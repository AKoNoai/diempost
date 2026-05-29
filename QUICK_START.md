# 🚀 Quick Start Guide

## Project Overview

```
diempost/ (MERN Stack)
├── backend/      → Node.js + Express API (port 5000)
├── frontend/     → React User Submission (port 3000)  
├── admin/        → React Admin Dashboard (port 3001)
└── docs/         → Guides & documentation
```

## 🎯 What's Built

### ✅ Features Completed

1. **User Page** (No Login Required)
   - Upload image
   - Enter score, name, email, phone
   - Submit to admin
   - Mobile responsive

2. **Admin Dashboard** (Login Required)
   - Secure JWT authentication
   - View all submissions with filters
   - Edit/Delete submissions
   - Export to Excel file
   - Dashboard statistics
   - Search functionality

3. **Backend API**
   - MongoDB database
   - RESTful API routes
   - JWT authentication
   - Excel export
   - CORS enabled
   - Error handling

4. **Responsive Design**
   - Mobile-first approach
   - Tailwind CSS
   - Works on all devices

---

## 📦 Installation & Setup

### Option 1: Local Development

#### 1️⃣ Backend Setup
```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm run dev
# Backend runs on http://localhost:5000
```

#### 2️⃣ Frontend Setup (User Page)
```bash
cd frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

#### 3️⃣ Admin Setup (Optional - Another Terminal)
```bash
cd admin
npm install
npm run dev
# Admin runs on http://localhost:3001
```

### Option 2: One Command Setup
```bash
# Run all three in separate terminals
# Terminal 1
cd backend && npm install && npm run dev

# Terminal 2
cd frontend && npm install && npm run dev

# Terminal 3
cd admin && npm install && npm run dev
```

---

## 🌐 Access URLs

- **User Page**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login (from frontend)
- **Admin Dashboard**: http://localhost:3001/login (from admin)
- **Backend API**: http://localhost:5000/api
- **API Health**: http://localhost:5000/api/health

---

## 🔐 Default Admin Credentials

```
Email: admin@diempost.com
Password: admin123
```

⚠️ **Change password after first login!**

---

## 📝 Environment Setup

### Backend (.env)
```ini
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/diempost
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
ADMIN_EMAIL=admin@diempost.com
ADMIN_PASSWORD=admin123
```

### Frontend (.env)
```ini
VITE_API_URL=http://localhost:5000/api
```

### Admin (.env)
```ini
VITE_API_URL=http://localhost:5000/api
```

---

## 📱 Testing the App

### Test User Submission:
1. Go to http://localhost:3000
2. Upload an image
3. Enter score (0-100)
4. Enter name
5. Click "Gửi cho Admin"

### Test Admin Dashboard:
1. Go to http://localhost:3000/admin/login
2. Login with admin@diempost.com / admin123
3. View submissions table
4. Try editing, deleting
5. Export Excel

---

## 🚀 Deploy to Vercel

### Backend Deployment:
```bash
cd backend
vercel
# Follow prompts, add environment variables
```

### Frontend Deployment:
```bash
cd frontend
# Update .env: VITE_API_URL=https://backend-url.vercel.app/api
vercel
```

### Admin Deployment:
```bash
cd admin
# Update .env: VITE_API_URL=https://backend-url.vercel.app/api
vercel
```

See `DEPLOYMENT_GUIDE.md` for detailed instructions.

---

## 📊 API Endpoints

### Public Endpoints
```
POST /api/submissions
GET /api/submissions

GET /api/health
```

### Admin Endpoints (Protected with JWT)
```
POST /admin/login
GET /admin/submissions
PUT /admin/submissions/:id
DELETE /admin/submissions/:id
GET /admin/export/excel
GET /admin/stats
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB |
| Auth | JWT |
| Export | ExcelJS |
| UI Components | React Icons |
| Notifications | React Hot Toast |

---

## 📚 Project Structure

```
backend/
├── models/           # MongoDB schemas
├── routes/           # API endpoints
├── middleware/       # Auth middleware
├── server.js         # Main server
├── .env             # Config
└── package.json

frontend/
├── src/
│   ├── pages/       # UserSubmission, AdminLogin, AdminDashboard
│   ├── components/  # SubmissionModal, PrivateRoute
│   ├── services/    # API calls
│   ├── App.jsx      # Main app
│   └── main.jsx     # Entry point
├── index.html
├── vite.config.js
├── package.json
└── .env

admin/
├── src/             # Same structure as frontend
├── index.html
├── vite.config.js
├── package.json
└── .env
```

---

## 🐛 Troubleshooting

### Can't connect to MongoDB
- Check connection string in .env
- Ensure IP whitelist in MongoDB Atlas
- Verify database exists

### Frontend can't reach backend
- Ensure backend is running on port 5000
- Check VITE_API_URL in .env
- Verify CORS is enabled

### Port already in use
```bash
# Kill process on port
lsof -i :5000    # Find
kill -9 <PID>    # Kill
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support & Resources

- Express: https://expressjs.com
- MongoDB: https://docs.mongodb.com
- React: https://react.dev
- Vite: https://vitejs.dev
- Tailwind: https://tailwindcss.com

---

## ✨ Next Steps

1. ✅ Set up MongoDB Atlas
2. ✅ Run local development
3. ✅ Test all features
4. ✅ Deploy to Vercel
5. ✅ Set up custom domain (optional)
6. ✅ Monitor production

---

**Ready to submit scores! 🎉**
