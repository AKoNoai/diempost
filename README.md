# 📊 Gửi Điểm - MERN Application

Ứng dụng web MERN Stack để quản lý gửi điểm và thông tin người dùng.

## ✨ Tính Năng

### 👥 Trang Người Dùng
- ✅ Không cần đăng nhập
- ✅ Gửi hình ảnh, điểm, tên
- ✅ Hỗ trợ email và điện thoại (tùy chọn)
- ✅ Giao diện đẹp, responsive trên mobile

### 👨‍💼 Trang Admin
- ✅ Đăng nhập an toàn (JWT)
- ✅ Quản lý bản ghi (CRUD)
- ✅ Lọc theo trạng thái
- ✅ Xuất file Excel
- ✅ Dashboard thống kê
- ✅ Tìm kiếm nâng cao

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT
- **File Export**: ExcelJS
- **Deployment**: Vercel

## 📁 Project Structure

```
diempost/
├── admin/              # Admin dashboard (React)
├── backend/            # Node.js server
│   ├── models/         # MongoDB schemas
│   ├── routes/         # API routes
│   ├── middleware/     # Auth middleware
│   ├── server.js       # Main server
│   └── .env            # Environment variables
├── frontend/           # User page (React)
│   ├── src/
│   │   ├── pages/      # Pages (User, Admin, Login)
│   │   ├── components/ # Reusable components
│   │   ├── services/   # API services
│   │   └── App.jsx     # Root component
│   └── .env            # Environment variables
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 14+
- MongoDB (local or Atlas)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
```

**Configure `.env`:**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/diempost
JWT_SECRET=your_secret_key_here
PORT=5000
ADMIN_EMAIL=admin@diempost.com
ADMIN_PASSWORD=admin123
```

**Start backend:**
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

**Configure `.env`:**
```
VITE_API_URL=http://localhost:5000/api
```

**Start frontend:**
```bash
npm run dev
```

Visit: `http://localhost:3000`

## 📱 API Endpoints

### Public Routes
- `POST /api/submissions` - Gửi điểm
- `GET /api/submissions` - Danh sách công khai (limited)

### Admin Routes (Protected)
- `POST /admin/login` - Đăng nhập
- `GET /admin/submissions` - Danh sách đầy đủ
- `GET /admin/submissions/:id` - Chi tiết bản ghi
- `PUT /admin/submissions/:id` - Cập nhật bản ghi
- `DELETE /admin/submissions/:id` - Xóa bản ghi
- `GET /admin/export/excel` - Xuất Excel
- `GET /admin/stats` - Thống kê

## 🔑 Default Admin Credentials

```
Email: admin@diempost.com
Password: admin123
```

⚠️ **Thay đổi mật khẩu ngay sau đăng nhập đầu tiên!**

## 🌐 Deployment on Vercel

### Backend Deployment

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourname/diempost-backend.git
git push -u origin main
```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your backend repository
   - Add Environment Variables:
     - `MONGODB_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Your JWT secret
     - `NODE_ENV`: production
   - Click "Deploy"

### Frontend Deployment

1. **Update API URL in `.env`:**
```
VITE_API_URL=https://your-backend-vercel-url.vercel.app/api
```

2. **Push to GitHub and deploy same way on Vercel**

## 📋 Database Schema

### Submission Model
```javascript
{
  name: String,
  score: Number,
  image: {
    url: String,
    publicId: String
  },
  email: String,
  phone: String,
  status: enum['pending', 'approved', 'rejected'],
  notes: String,
  ipAddress: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Admin Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  name: String,
  role: String,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🎨 UI Features

- 📱 **Fully Responsive** - Mobile, tablet, desktop
- 🎨 **Gradient Design** - Modern, clean interface
- ⚡ **Fast Loading** - Optimized with Vite
- 🎯 **User Friendly** - Intuitive navigation
- 🔒 **Secure** - JWT authentication

## 📝 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
CLOUDINARY_CLOUD_NAME=optional
CLOUDINARY_API_KEY=optional
CLOUDINARY_API_SECRET=optional
PORT=5000
NODE_ENV=development
ADMIN_EMAIL=admin@diempost.com
ADMIN_PASSWORD=admin123
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure port 5000 is available
- Check `.env` file exists

### Frontend can't connect to API
- Verify `VITE_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is running

### Excel export not working
- Check file path permissions
- Ensure ExcelJS is installed
- Check disk space

## 📄 License

MIT License

## 👨‍💻 Support

For issues or questions, please open an issue on GitHub.

---

**Happy Coding! 🚀**
