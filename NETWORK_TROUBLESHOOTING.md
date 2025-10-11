# Network Error Troubleshooting Guide

## 🔍 **Current Network Error Analysis**

### **Problem**: Mobile app cannot connect to backend server
### **Backend Status**: ✅ Running and accessible at `http://10.147.173.114:5000`
### **Frontend Configuration**: ✅ Correctly configured

## 🛠️ **Enhanced Network Solutions Applied**

### **1. Multiple URL Fallback System**
```javascript
// Now tries multiple URLs in sequence:
1. http://10.147.173.114:5000 (Primary)
2. http://localhost:5000 (Fallback 1)
3. http://127.0.0.1:5000 (Fallback 2)
```

### **2. Network Connectivity Pre-Check**
```javascript
// Before making API calls:
✅ Check network connectivity
✅ Validate internet connection
✅ Test backend accessibility
```

### **3. Enhanced Error Handling**
```javascript
// Detailed error messages with:
✅ Specific troubleshooting steps
✅ Alternative URLs tried
✅ Network status information
```

## 🔧 **Troubleshooting Steps**

### **Step 1: Verify Backend is Running**
```bash
# Check if backend is accessible
curl http://10.147.173.114:5000/api/health
curl http://10.147.173.114:5000/api/network-test
```

### **Step 2: Check Network Configuration**
```bash
# Verify IP address
ipconfig | findstr "IPv4"
# Should show: 10.147.173.114
```

### **Step 3: Test Mobile App Network**
```bash
# Start mobile app with debugging
cd TheLineCricket_Mobile_Frontend
npx expo start --clear
```

### **Step 4: Check Console Logs**
Look for these logs in the mobile app console:
```
🌐 Making API request to (attempt 1/3): http://10.147.173.114:5000/api/firebase/signup
⚠️ Attempt 1 failed for http://10.147.173.114:5000/api/firebase/signup: [Error message]
🔄 Trying next URL: http://localhost:5000/api/firebase/signup
```

## 📱 **Mobile App Network Debugging**

### **Expected Console Output:**
```
🔧 Mobile App Configuration:
📡 API Base URL: http://10.147.173.114:5000
🔌 Socket URL: http://10.147.173.114:5000
🌍 Environment: development
🐛 Debug Mode: true

🌐 Making API request to (attempt 1/3): http://10.147.173.114:5000/api/firebase/signup
📡 Request config: { method: 'POST', headers: {...} }
⏱️ Timeout set to 30 seconds
```

### **If Network Error Occurs:**
```
⚠️ Attempt 1 failed for http://10.147.173.114:5000/api/firebase/signup: Network request failed
🔄 Trying next URL: http://localhost:5000/api/firebase/signup
⚠️ Attempt 2 failed for http://localhost:5000/api/firebase/signup: Network request failed
🔄 Trying next URL: http://127.0.0.1:5000/api/firebase/signup
❌ All API request attempts failed
```

## 🎯 **Common Network Issues & Solutions**

### **Issue 1: "Network request failed"**
**Cause**: Mobile device cannot reach backend server
**Solutions**:
- ✅ Check if both devices are on same network
- ✅ Verify firewall settings
- ✅ Try alternative URLs (localhost, 127.0.0.1)
- ✅ Check if backend is running on correct port

### **Issue 2: "Request timeout"**
**Cause**: Server takes too long to respond
**Solutions**:
- ✅ Increased timeout to 30 seconds
- ✅ Check server performance
- ✅ Verify network stability

### **Issue 3: "Connection refused"**
**Cause**: Backend server not running
**Solutions**:
- ✅ Start backend: `python run.py`
- ✅ Check if port 5000 is available
- ✅ Verify backend is listening on 0.0.0.0:5000

## 🔍 **Debugging Commands**

### **Backend Health Check:**
```bash
# Test backend connectivity
curl -v http://10.147.173.114:5000/api/health
curl -v http://10.147.173.114:5000/api/network-test
```

### **Network Interface Check:**
```bash
# Check network interfaces
ipconfig /all
netstat -an | findstr :5000
```

### **Firewall Check:**
```bash
# Check if port 5000 is blocked
netsh advfirewall firewall show rule name=all | findstr 5000
```

## 📋 **Testing Checklist**

- [ ] Backend server running (`python run.py`)
- [ ] Backend accessible via curl
- [ ] Mobile app network configuration correct
- [ ] Both devices on same network
- [ ] Firewall allows port 5000
- [ ] Alternative URLs configured
- [ ] Network connectivity pre-check working
- [ ] Console logs show detailed debugging info

## 🚀 **Expected Results After Fixes**

### **Successful Connection:**
```
🌐 Making API request to (attempt 1/3): http://10.147.173.114:5000/api/firebase/signup
📡 Response status: 200
✅ API request successful
📡 Response data: {...}
```

### **Fallback Success:**
```
🌐 Making API request to (attempt 1/3): http://10.147.173.114:5000/api/firebase/signup
⚠️ Attempt 1 failed for http://10.147.173.114:5000/api/firebase/signup: Network request failed
🔄 Trying next URL: http://localhost:5000/api/firebase/signup
📡 Response status: 200
✅ API request successful
```

**The enhanced network handling should now resolve the connection issues!** 🎉
