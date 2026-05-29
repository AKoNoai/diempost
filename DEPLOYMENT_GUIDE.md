# 🚀 DEPLOYMENT GUIDE - Vercel

## Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- MongoDB Atlas account (free tier available)

---

## Step 1: Prepare MongoDB

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user and get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/diempost
   ```

---

## Step 2: Prepare GitHub

### Backend
1. Create new GitHub repo: `diempost-backend`
2. Clone locally and push:
```bash
cd backend
git init
git add .
git commit -m "Initial backend setup"
git branch -M main
git remote add origin https://github.com/yourusername/diempost-backend.git
git push -u origin main
```

### Frontend
1. Create new GitHub repo: `diempost-frontend`
2. Push same way:
```bash
cd frontend
git init
git add .
git commit -m "Initial frontend setup"
git branch -M main
git remote add origin https://github.com/yourusername/diempost-frontend.git
git push -u origin main
```

---

## Step 3: Deploy Backend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select `diempost-backend` repository
5. **Framework Preset**: Other
6. **Root Directory**: . (current)
7. **Build Command**: Leave empty
8. **Output Directory**: Leave empty
9. **Install Command**: npm install

### Add Environment Variables:
Click "Environment Variables" and add:

| Name | Value |
|------|-------|
| `MONGODB_URI` | `mongodb+srv://username:password@cluster.mongodb.net/diempost` |
| `JWT_SECRET` | `your-random-secret-key-here` |
| `NODE_ENV` | `production` |
| `ADMIN_EMAIL` | `admin@diempost.com` |
| `ADMIN_PASSWORD` | `admin123` |

10. Click "Deploy"
11. Wait for deployment to complete
12. Copy your backend URL (e.g., `https://your-backend.vercel.app`)

---

## Step 4: Deploy Frontend on Vercel

1. Go to Vercel dashboard
2. Click "New Project"
3. Select `diempost-frontend` repository
4. **Framework Preset**: Vite
5. **Root Directory**: . (current)
6. **Build Command**: `npm run build`
7. **Output Directory**: `dist`
8. **Install Command**: `npm install`

### Add Environment Variables:
| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://your-backend.vercel.app/api` |

9. Click "Deploy"
10. Wait for completion

---

## Step 5: Test Deployment

### Test User Page:
1. Visit your frontend URL
2. Fill in form and submit
3. Should see success message

### Test Admin:
1. Go to `https://your-frontend.vercel.app/admin/login`
2. Login with:
   - Email: `admin@diempost.com`
   - Password: `admin123`
3. Test CRUD operations
4. Try Excel export

---

## Step 6: Custom Domain (Optional)

### Add Domain to Vercel:
1. Go to Project Settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS setup instructions from your registrar

---

## 🔒 Security Checklist

- [ ] Change default admin password
- [ ] Update MongoDB IP whitelist to allow Vercel IPs
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS (automatic with Vercel)
- [ ] Set up environment variables for production
- [ ] Disable public submission if needed

---

## 🐛 Troubleshooting

### Backend 500 Error
- Check MongoDB connection in Vercel logs
- Verify IP whitelist in MongoDB Atlas
- Check environment variables

### Frontend Can't Connect
- Verify `VITE_API_URL` env variable
- Check CORS in backend
- Verify backend is deployed

### Build Fails
- Check `vercel.json` config
- Ensure all dependencies in `package.json`
- Check Node.js version compatibility

### View Logs
```bash
vercel logs https://your-project.vercel.app
```

---

## 📊 Monitoring

1. Go to project dashboard
2. Check "Deployments" tab
3. Monitor "Analytics" for traffic
4. Check "Logs" for errors

---

## 🔄 Redeploy

### Automatic (Recommended)
- Every git push to main branch triggers redeploy

### Manual
```bash
# Redeploy backend
vercel --prod

# Redeploy frontend
vercel --prod
```

---

## 💡 Pro Tips

1. **Staging**: Use git branches for staging deployments
2. **Environment**: Use different env vars for dev/prod
3. **Backups**: Regularly export MongoDB data
4. **Monitoring**: Set up email alerts for failed deployments
5. **Speed**: Enable Vercel Edge Caching

---

## 📞 Support

- Vercel Docs: https://vercel.com/docs
- MongoDB Docs: https://docs.mongodb.com
- Express Docs: https://expressjs.com

---

**Your app is now live! 🎉**
