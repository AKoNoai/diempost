# 🎓 API Testing & Integration Guide

## 📌 Base URLs

**Local Development:**
- Backend API: `http://localhost:5000/api`
- Frontend: `http://localhost:3000`
- Admin: `http://localhost:3001`

**Production (After Deployment):**
- Backend API: `https://your-backend.vercel.app/api`
- Frontend: `https://your-frontend.vercel.app`
- Admin: `https://your-admin.vercel.app` (optional)

---

## 🔍 Testing with cURL or Postman

### 1. Health Check
```bash
curl http://localhost:5000/api/health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-05-29T..."
}
```

---

## 📤 Public Endpoints

### Submit a Score (No Auth Required)

**Endpoint:** `POST /api/submissions`

**Request:**
```bash
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "score": 85.5,
    "image": "data:image/png;base64,iVBORw0KGgoAAAANS...",
    "email": "john@example.com",
    "phone": "0123456789"
  }'
```

**Parameters:**
| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | String | ✅ Yes | User name |
| score | Number | ✅ Yes | 0-100 |
| image | String | ✅ Yes | Base64 image |
| email | String | ❌ No | User email |
| phone | String | ❌ No | User phone |

**Success Response (201):**
```json
{
  "success": true,
  "message": "Submission received successfully",
  "data": {
    "_id": "....",
    "name": "John Doe",
    "score": 85.5,
    "status": "pending",
    "createdAt": "2024-05-29T..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Name, score, and image are required"
}
```

---

### Get Public Submissions List

**Endpoint:** `GET /api/submissions`

**Query Parameters:**
```bash
curl "http://localhost:5000/api/submissions?limit=10&page=1"
```

| Parameter | Type | Default | Notes |
|-----------|------|---------|-------|
| limit | Number | 10 | Items per page |
| page | Number | 1 | Page number |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "score": 85.5,
      "createdAt": "2024-05-29T...",
      "status": "pending"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

---

## 🔐 Admin Endpoints (Protected with JWT)

### 1. Admin Login

**Endpoint:** `POST /admin/login`

**Request:**
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@diempost.com",
    "password": "admin123"
  }'
```

**Success Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "admin": {
    "id": "...",
    "email": "admin@diempost.com",
    "name": "Admin"
  }
}
```

**Store this token for authenticated requests!**

---

### 2. Get All Submissions (Admin)

**Endpoint:** `GET /admin/submissions`

**Headers:**
```bash
curl http://localhost:5000/api/admin/submissions \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Query Parameters:**
```bash
curl "http://localhost:5000/api/admin/submissions?status=pending&search=john&limit=20&page=1" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

| Parameter | Type | Notes |
|-----------|------|-------|
| status | String | pending, approved, rejected |
| search | String | Search by name or email |
| limit | Number | Items per page (default: 20) |
| page | Number | Page number (default: 1) |

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "score": 85.5,
      "email": "john@example.com",
      "status": "pending",
      "image": {
        "url": "data:image/...",
        "publicId": null
      },
      "notes": "",
      "createdAt": "2024-05-29T...",
      "updatedAt": "2024-05-29T..."
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 5
  }
}
```

---

### 3. Get Single Submission

**Endpoint:** `GET /admin/submissions/:id`

```bash
curl http://localhost:5000/api/admin/submissions/123abc \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

### 4. Update Submission

**Endpoint:** `PUT /admin/submissions/:id`

```bash
curl -X PUT http://localhost:5000/api/admin/submissions/123abc \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "Jane Doe",
    "score": 92,
    "status": "approved",
    "notes": "Good performance"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Submission updated successfully",
  "data": { ... }
}
```

---

### 5. Delete Submission

**Endpoint:** `DELETE /admin/submissions/:id`

```bash
curl -X DELETE http://localhost:5000/api/admin/submissions/123abc \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "message": "Submission deleted successfully"
}
```

---

### 6. Get Dashboard Statistics

**Endpoint:** `GET /admin/stats`

```bash
curl http://localhost:5000/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 150,
    "pending": 45,
    "approved": 80,
    "rejected": 25
  }
}
```

---

### 7. Export to Excel

**Endpoint:** `GET /admin/export/excel`

```bash
curl -O http://localhost:5000/api/admin/export/excel \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -o submissions.xlsx
```

This returns an Excel file with all submissions data.

---

## 🧪 Postman Collection Template

```json
{
  "info": {
    "name": "Gửi Điểm API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/health"
      }
    },
    {
      "name": "Submit Score",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/submissions",
        "body": {
          "mode": "raw",
          "raw": "{\"name\":\"Test\",\"score\":85,\"image\":\"data:...\"}"
        }
      }
    },
    {
      "name": "Admin Login",
      "request": {
        "method": "POST",
        "url": "{{baseUrl}}/api/admin/login",
        "body": {
          "mode": "raw",
          "raw": "{\"email\":\"admin@diempost.com\",\"password\":\"admin123\"}"
        }
      }
    },
    {
      "name": "Get Submissions",
      "request": {
        "method": "GET",
        "url": "{{baseUrl}}/api/admin/submissions",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{token}}"
          }
        ]
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

---

## 🔐 Authentication Flow

1. **Login**: `POST /admin/login`
   - Get JWT token from response

2. **Store Token**: Save token in localStorage or session

3. **Use Token**: Include in every request header:
   ```
   Authorization: Bearer eyJhbGc...
   ```

4. **Verify**: Backend validates token signature and expiration

5. **Token Expires**: After 7 days, user must login again

---

## ⚠️ Error Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Request successful |
| 201 | Created | Resource created |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | No token or invalid token |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Backend error |

---

## 📝 Example: Complete Workflow

### Step 1: User Submits Score
```bash
# POST /api/submissions
curl -X POST http://localhost:5000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "score": 88,
    "image": "data:image/png;base64,...",
    "email": "alice@email.com"
  }'

# Response: 201 Created
```

### Step 2: Admin Logs In
```bash
# POST /admin/login
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@diempost.com",
    "password": "admin123"
  }'

# Response includes token
```

### Step 3: Admin Views Submissions
```bash
# GET /admin/submissions
curl http://localhost:5000/api/admin/submissions \
  -H "Authorization: Bearer TOKEN"

# Shows Alice's submission with status: "pending"
```

### Step 4: Admin Approves Submission
```bash
# PUT /admin/submissions/ID
curl -X PUT http://localhost:5000/api/admin/submissions/ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "status": "approved",
    "notes": "Excellent work!"
  }'
```

### Step 5: Admin Exports Data
```bash
# GET /admin/export/excel
curl http://localhost:5000/api/admin/export/excel \
  -H "Authorization: Bearer TOKEN" \
  -o submissions.xlsx
```

---

## 🧠 Integration Example (Frontend)

```javascript
// In your React component
import { adminAPI } from '../services/api';

// Login
const response = await adminAPI.login('admin@diempost.com', 'admin123');
const token = response.data.token;
localStorage.setItem('adminToken', token);

// Get submissions
const subs = await adminAPI.getSubmissions(token, 'pending', '', 20, 1);
console.log(subs.data.data); // Array of submissions

// Update
await adminAPI.updateSubmission(token, submissionId, {
  status: 'approved',
  notes: 'Good'
});

// Export Excel
const response = await adminAPI.exportExcel(token);
// Handle file download
```

---

## 🚀 Testing Checklist

- [ ] POST /api/submissions (create new)
- [ ] GET /api/submissions (public list)
- [ ] POST /admin/login (get token)
- [ ] GET /admin/submissions (list all)
- [ ] GET /admin/submissions/:id (single)
- [ ] PUT /admin/submissions/:id (update)
- [ ] DELETE /admin/submissions/:id (delete)
- [ ] GET /admin/stats (statistics)
- [ ] GET /admin/export/excel (Excel export)
- [ ] Verify JWT token expiration (7 days)
- [ ] Test error responses (missing fields, etc.)
- [ ] Test pagination (page 1, 2, 3...)

---

## 📚 Additional Resources

- [REST API Best Practices](https://restfulapi.net/)
- [JWT Documentation](https://jwt.io/)
- [Postman Documentation](https://learning.postman.com/)
- [cURL Examples](https://curl.se/docs/manual.html)

---

**Happy Testing! 🧪**
