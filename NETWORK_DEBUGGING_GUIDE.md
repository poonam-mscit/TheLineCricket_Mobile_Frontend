# Network Debugging Guide for TheLineCricket Mobile App

## 🔍 **Network Error Troubleshooting**

### **Common Network Errors & Solutions:**

#### **1. "Network request failed" Error**
**Cause**: Mobile device cannot reach the backend server
**Solutions**:
- ✅ Check if backend is running: `python run.py`
- ✅ Verify IP address: `10.147.173.114:5000`
- ✅ Ensure both devices are on same network
- ✅ Check firewall settings

#### **2. "Request timeout" Error**
**Cause**: Server takes too long to respond
**Solutions**:
- ✅ Increased timeout from 10s to 30s
- ✅ Check server performance
- ✅ Verify network stability

#### **3. "Connection failed" Error**
**Cause**: Cannot establish connection
**Solutions**:
- ✅ Test backend connectivity: `curl http://10.147.173.114:5000/api/health`
- ✅ Check CORS configuration
- ✅ Verify mobile app network permissions

### **🔧 Debugging Steps:**

#### **Step 1: Test Backend Connectivity**
```bash
# Test from command line
curl http://10.147.173.114:5000/api/health
curl http://10.147.173.114:5000/api/network-test
```

#### **Step 2: Check Mobile App Network**
```javascript
// Add to your mobile app for debugging
import environment from './src/config/environment';
console.log('API Base URL:', environment.API_BASE_URL);
```

#### **Step 3: Test Network Connectivity**
```javascript
// Test network before API calls
const testNetwork = async () => {
  try {
    const response = await fetch(`${environment.API_BASE_URL}/api/network-test`);
    const data = await response.json();
    console.log('Network test result:', data);
  } catch (error) {
    console.error('Network test failed:', error);
  }
};
```

### **📱 Mobile App Network Configuration:**

#### **Environment Settings:**
```javascript
// src/config/environment.js
development: {
  API_BASE_URL: 'http://10.147.173.114:5000',  // ✅ Correct IP
  SOCKET_URL: 'http://10.147.173.114:5000',    // ✅ Correct IP
}
```

#### **API Client Settings:**
```javascript
// src/services/apiClient.js
timeout: 30000,  // ✅ Increased to 30 seconds
```

### **🔧 Backend Network Configuration:**

#### **CORS Settings:**
```python
# app.py - CORS configuration
origins = [
    'http://10.147.173.114:5000',    # ✅ Backend URL
    'exp://10.147.173.114:19000',    # ✅ Expo development
    'http://10.147.173.114:8081',    # ✅ Metro bundler
    '*'  # ✅ Allow all for development
]
```

#### **Network Test Endpoints:**
- ✅ `/api/health` - Basic health check
- ✅ `/api/network-test` - Detailed network info

### **🚀 Quick Fixes Applied:**

1. **✅ Increased API timeout** from 10s to 30s
2. **✅ Enhanced error messages** with specific troubleshooting steps
3. **✅ Added network connectivity checks** before API calls
4. **✅ Improved error handling** for different network scenarios
5. **✅ Added network test endpoint** for debugging

### **📋 Testing Steps:**

1. **Start backend**: `python run.py`
2. **Test connectivity**: `curl http://10.147.173.114:5000/api/health`
3. **Run mobile app**: `npx expo start`
4. **Check console logs** for network debugging info
5. **Test signup flow** with enhanced error messages

### **🎯 Expected Results:**

- ✅ Backend accessible at `http://10.147.173.114:5000`
- ✅ Mobile app connects successfully
- ✅ Signup flow works without network errors
- ✅ Clear error messages if issues occur

### **🔍 Debugging Console Output:**

When working correctly, you should see:
```
🌐 Making API request to: http://10.147.173.114:5000/api/firebase/signup
📡 Request config: { method: 'POST', headers: {...} }
⏱️ Timeout set to 30 seconds
📡 Response status: 200
✅ API request successful
```

If there are issues, you'll see detailed error messages with troubleshooting steps.
