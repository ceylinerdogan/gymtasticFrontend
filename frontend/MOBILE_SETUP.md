# 📱 Mobile APK Setup with Capacitor.js

## 🛠️ Prerequisites

Before starting, make sure you have:
- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **Android Studio** (for Android development)
- **Java Development Kit (JDK)** (version 11 or 17)

## 📋 Step-by-Step Instructions

### 1. 🔧 Install Capacitor

```bash
# Install Capacitor CLI globally
npm install -g @capacitor/cli

# Install Capacitor core and Android platform
npm install @capacitor/core @capacitor/android
```

### 2. 🚀 Initialize Capacitor

```bash
# Initialize Capacitor in your project
npx cap init "GymTastic" "com.gymtastic.app"
```

### 3. 🔍 Update Your IP Address

```bash
# Run the IP update script to configure for mobile testing
node update-ip.cjs
```

This script will:
- Automatically detect your computer's local IP address
- Update the `src/config/environment.js` file
- Configure the app to connect to your backend on the local network

### 4. 🏗️ Build Your Vue App

```bash
# Build the Vue app for production
npm run build
```

### 5. 📱 Add Android Platform

```bash
# Add Android platform to your project
npx cap add android
```

### 6. 🔄 Copy Web Assets

```bash
# Copy your built web app to the native project
npx cap copy android
```

### 7. ⚙️ Configure Android

Edit `capacitor.config.json` to allow network access:

```json
{
  "appId": "com.gymtastic.app",
  "appName": "GymTastic",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "allowNavigation": ["*"],
    "cleartext": true
  },
  "android": {
    "allowMixedContent": true
  }
}
```

### 8. 🔓 Set Network Permissions

Edit `android/app/src/main/AndroidManifest.xml` and add these permissions:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
```

Also add the `android:usesCleartextTraffic="true"` attribute to the `<application>` tag:

```xml
<application
    android:usesCleartextTraffic="true"
    ...>
```

### 9. 🎯 Open in Android Studio

```bash
# Open the project in Android Studio
npx cap open android
```

### 10. 🏗️ Build APK in Android Studio

1. **Wait for Gradle sync** to complete
2. **Build > Build Bundle(s) / APK(s) > Build APK(s)**
3. **Wait for build** to complete (5-10 minutes first time)
4. **Locate APK**: `android/app/build/outputs/apk/debug/app-debug.apk`

### 11. 📲 Install APK on Device

**Method 1: Android Studio**
- Connect your Android device via USB
- Enable Developer Options and USB Debugging
- Click the green "Run" button in Android Studio

**Method 2: Manual Installation**
- Transfer the APK file to your Android device
- Enable "Install from Unknown Sources" in Settings
- Open the APK file to install

## 🌐 Testing Your Setup

### Backend Setup
```bash
# Make sure your backend is running
cd ../backend  # or wherever your Python backend is
python main.py
```

The backend should show:
```
🚀 Server running on http://0.0.0.0:5000
✅ Socket.IO initialized with gevent
```

### Mobile Testing
1. **Connect both devices** to the same WiFi network
2. **Start your backend** on your computer
3. **Open the app** on your mobile device
4. **Check the console** - you should see:
   ```
   🌍 Frontend Environment: local_network
   🔗 API URL: http://YOUR_IP:5000
   🔌 Socket URL: http://YOUR_IP:5000
   ```

## 🔄 Development Workflow

For ongoing development:

```bash
# 1. Make changes to your Vue app
# 2. Build the app
npm run build

# 3. Copy to native project
npx cap copy android

# 4. If you made native changes, sync
npx cap sync android
```

## 🐛 Troubleshooting

### Common Issues:

**1. Network Connection Failed**
- Verify both devices are on the same WiFi
- Check Windows Firewall isn't blocking port 5000
- Ensure backend is running on `0.0.0.0:5000`, not `127.0.0.1:5000`

**2. APK Build Failed**
- Make sure Android Studio is fully updated
- Check Java version: `java -version` (should be 11 or 17)
- Clear and rebuild: **Build > Clean Project** then **Build > Rebuild Project**

**3. Camera Not Working**
- Check camera permissions in AndroidManifest.xml
- Test camera access in the app

**4. Socket Connection Issues**
- Check console logs in the mobile app
- Verify the IP address in environment.js is correct
- Test API endpoints directly: `http://YOUR_IP:5000/api/auth/login`

### Checking Network Connection:

```bash
# On your computer, find your IP
ipconfig | findstr IPv4

# Test if your mobile can reach your computer
# On mobile browser, visit: http://YOUR_IP:5000
```

## 🎉 Success!

If everything works correctly, you should be able to:
- ✅ Launch the app on your mobile device
- ✅ Login/register (connects to your backend)
- ✅ Access camera for pose detection
- ✅ Receive real-time pose analysis via Socket.IO
- ✅ See smooth pose detection with gevent backend

## 📈 Performance Benefits with Gevent

Your new setup provides:
- **Faster WebSocket responses** - Better real-time pose detection
- **Higher frame throughput** - Can handle your 10 FPS limit consistently  
- **More stable connections** - Better handling of network interruptions
- **Non-blocking database saves** - Pose detection won't freeze during Firestore writes

---

**Need help?** Check the logs in:
- Browser DevTools (F12) for web version
- Android Studio Logcat for mobile debugging
- Backend console for server issues 