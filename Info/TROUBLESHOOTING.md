# Troubleshooting: Cannot Add Expense/Income

## Step-by-Step Diagnosis

### 1. Check Browser Console for Errors
Press `F12` in your browser to open Developer Tools
- Go to "Console" tab
- Try adding an expense/income
- Look for error messages
- Take a screenshot or note the error

### 2. Verify You Are Logged In
- Check if you see the app navbar (with month/year selectors)
- If you see a public navbar instead, you're not authenticated
- **Solution**: Login again

### 3. Check Network Requests
In Developer Tools:
- Go to "Network" tab
- Add a filter: "expense" or "income"
- Try adding an expense
- Check if the POST request appears
- Click on it and check:
  - Request Headers → Authorization header should be: `Bearer <token>`
  - Response Status should be 200 or 201
  - Response body should show the created expense

### 4. Verify Token is Stored
In Developer Tools Console, type:
```javascript
localStorage.getItem("usersdatatoken")
```
- Should show a long token string (starts with "ey...")
- If empty, you need to login again

### 5. Check Browser Cache
- Press Ctrl+Shift+Delete
- Clear "Cached images and files"
- Reload the page (F5)
- Try adding expense again

---

## Common Issues & Solutions

### Issue: "401 Unauthorized" Error
**Cause**: Token not being sent or expired
**Solution**:
1. Logout (clear localStorage)
2. Login again
3. Try adding expense again

### Issue: CORS Error
**Cause**: Browser blocking request from frontend to backend
**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Hard reload (Ctrl+F5)
3. Check if backend is running

### Issue: "Cannot read property '_id' of undefined"
**Cause**: User data not loaded yet
**Solution**:
1. Wait a moment for page to fully load
2. Check if you're authenticated
3. Refresh the page

### Issue: Request hangs/takes too long
**Cause**: Backend server not responding
**Solution**:
1. Check if backend server is running
2. Check internet connection
3. Wait a few seconds and try again

---

## Quick Verification Script

Paste this in browser console (F12 → Console tab):

```javascript
// Check if token exists
const token = localStorage.getItem("usersdatatoken");
console.log("Token exists:", !!token);

// Check if app knows you're logged in
const logindata = localStorage.getItem("logindata");
console.log("Login data:", logindata ? "YES" : "NO");

// Try a test request
fetch("https://budget-buddy-k52t.onrender.com/api/expense", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  },
  body: JSON.stringify({
    category: "Test",
    amount: 100,
    description: "Test",
    date: new Date().toISOString(),
    account: "Cash",
    user: "testuser"
  })
})
.then(r => r.json())
.then(d => console.log("Response:", d))
.catch(e => console.error("Error:", e));
```

---

## Still Not Working?

### Check These Files

**On Frontend**
- Open `http://localhost:3000` in browser
- Check browser console (F12) for errors

**On Backend**
- Verify server is running on port 5001
- Check for console errors in server terminal

### Required Environment
- MongoDB Atlas connection working
- Backend running on http://localhost:5001
- Frontend running on http://localhost:3000

---

## What Was Fixed

✅ Authorization headers now include "Bearer " prefix
✅ All POST/PUT/DELETE requests include authentication
✅ Backend routes protected with authentication middleware
✅ Budget deletion now available with delete button

**These changes require:**
1. Logout and login again (to refresh token)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard reload page (Ctrl+F5)

---

## Need More Help?

**Check the logs:**
1. Open browser DevTools (F12)
2. Go to Network tab
3. Try adding an expense
4. Click on the POST request to /api/expense
5. Check both "Request" and "Response" tabs
6. Share what you see with any error details

