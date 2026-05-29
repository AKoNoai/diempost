## Local Development Guide

### Quick Start

#### Terminal 1: Start Backend
```bash
cd backend
npm install
npm run dev
```
Backend will run on `http://localhost:5000`

#### Terminal 2: Start Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:3000`

### API Testing

Test the API with cURL:

#### Submit a score
```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "score": 85,
    "image": "data:image/png;base64,...",
    "email": "john@example.com"
  }'
```

#### Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@diempost.com",
    "password": "admin123"
  }'
```

#### Get Submissions (needs token)
```bash
curl http://localhost:5000/api/admin/submissions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Database Setup

#### Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# Connect with MongoDB Compass or shell
mongo
```

#### MongoDB Atlas (Cloud)
1. Create account at https://cloud.mongodb.com
2. Create free cluster
3. Get connection string
4. Update `.env` file

### Useful Commands

**Backend:**
```bash
npm run dev      # Start with auto-reload
npm start        # Start production
npm test         # Run tests (if configured)
```

**Frontend:**
```bash
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Common Issues

**Port Already in Use:**
```bash
# Change in vite.config.js or use:
lsof -i :5000   # Find process
kill -9 <PID>   # Kill process
```

**CORS Error:**
- Backend CORS is configured in server.js
- Check frontend URL matches allowed origins

**Module Not Found:**
```bash
rm -rf node_modules package-lock.json
npm install
```

---

Happy coding! 🚀
