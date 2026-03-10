# API Connection Troubleshooting Guide

## Issue: Login Not Working / API Not Responding

### Understanding the Setup

**Local Development:**
- Frontend URL: `http://localhost:3001` (Vite dev server)  
- API URL: `https://localhost:7049`  
- API Endpoint: `https://localhost:7049/api/Auth/login`

**Production:**
- API URL: `http://161.97.112.112:5000`
- API Endpoint: `http://161.97.112.112:5000/api/Auth/login`

⚠️ **Note**: `https://localhost:7049/index.html` is NOT the API URL - that's an HTML page, not an API endpoint.

---

## Solution Options

### Option 1: Use Vite Proxy (Recommended for Local Dev)

This avoids CORS and SSL certificate issues.

1. **Already configured** in `vite.config.ts`
2. Update `.env.local`:
   ```env
   VITE_API_BASE_URL=
   ```
3. Restart dev server:
   ```bash
   npm run dev
   ```

The frontend will proxy `/api` requests to `https://localhost:7049`

---

### Option 2: Direct API Connection

If you want to connect directly without proxy:

1. Update `.env.local`:
   ```env
   VITE_API_BASE_URL=https://localhost:7049
   ```

2. **Enable CORS** on your backend API. Add to your ASP.NET Core `Program.cs` or `Startup.cs`:
   ```csharp
   builder.Services.AddCors(options =>
   {
       options.AddPolicy("AllowFrontend", policy =>
       {
           policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
                 .AllowAnyMethod()
                 .AllowAnyHeader()
                 .AllowCredentials();
       });
   });

   // After var app = builder.Build();
   app.UseCors("AllowFrontend");
   ```

3. Restart both servers

---

## Testing the Connection

### 1. Check if API is Running

Open browser or PowerShell:
```powershell
# Test API health endpoint (if available)
Invoke-WebRequest -Uri https://localhost:7049/api/health -SkipCertificateCheck

# Or check Swagger
Start-Process https://localhost:7049/swagger
```

### 2. Check Browser Console

1. Open Dev Tools (F12)
2. Go to **Console** tab
3. Try to login
4. Look for errors:
   - ❌ `ERR_SSL_PROTOCOL_ERROR` → Certificate issue
   - ❌ `CORS error` → CORS not configured on backend
   - ❌ `404 Not Found` → API endpoint wrong
   - ❌ `NET::ERR_CONNECTION_REFUSED` → API server not running

### 3. Check Network Tab

1. Open Dev Tools (F12)
2. Go to **Network** tab
3. Try to login
4. Look for the request to `/api/Auth/login`
5. Check:
   - **Request URL**: Should be correct API endpoint
   - **Status Code**: 200 = success, 401 = wrong credentials, 500 = server error
   - **Response**: Check error message

---

## Common Issues & Fixes

### ❌ SSL Certificate Error
**Fix**: Use Option 1 (Proxy) or trust the dev certificate

### ❌ CORS Error
**Fix**: Enable CORS on your backend (see Option 2)

### ❌ 404 Not Found
**Fix**: Check your backend API endpoints:
- Should be: `/api/Auth/login` (case-sensitive)
- Not: `/api/auth/login` or `/Auth/login`

### ❌ API Server Not Running
**Fix**: 
```bash
cd your-backend-folder
dotnet run
```
Check it starts on port 7049

---

## Quick Test Commands

```powershell
# 1. Restart frontend (after config changes)
npm run dev

# 2. Test API directly
curl -k -X POST https://localhost:7049/api/Auth/login `
  -H "Content-Type: application/json" `
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Check if port 7049 is in use
netstat -ano | findstr :7049
```

---

## Need More Help?

Share the error from:
1. Browser Console (F12 → Console tab)
2. Network tab (F12 → Network → Click failed request → Response)
3. Backend API logs
