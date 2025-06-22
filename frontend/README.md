# GymTastic AI Trainer

A real-time AI-powered fitness application that uses computer vision and pose detection to provide instant feedback on exercise form. Built with modern web technologies and deployed as both a web app and mobile app.

## 🚀 Technologies Used

### Frontend Framework & Core
- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Vue Router 4** - Client-side routing for single-page application
- **Vite** - Modern build tool for fast development and optimized production builds

### Mobile Development
- **Capacitor 7** - Cross-platform mobile development framework
- **Android SDK** - Native Android app capabilities
- **Capacitor Plugins**:
  - `@capacitor/camera` - Camera access and controls
  - `@capacitor-community/text-to-speech` - Voice feedback system

### Styling & UI
- **Tailwind CSS 3** - Utility-first CSS framework
- **@tailwindcss/forms** - Form styling utilities
- **PostCSS** - CSS post-processing
- **Dark Mode Support** - Custom dark/light theme toggle

### Real-time Communication
- **Socket.IO Client** - WebSocket communication for real-time pose analysis
- **Custom WebSocket Composable** - Reactive WebSocket connection management

### Authentication & Security
- **JWT (JSON Web Tokens)** - Secure user authentication
- **jwt-decode** - Client-side token decoding

### Development & Build Tools
- **Terser** - JavaScript minification for production
- **Autoprefixer** - CSS vendor prefixing
- **ESLint** - Code linting and formatting

## 🎯 Key Features

### Real-time Pose Detection
- **Computer Vision Analysis**: Real-time pose detection using camera feed
- **Exercise Recognition**: Supports Squat, Plank, and Lunge exercises
- **Form Feedback**: Instant feedback on exercise form and technique
- **Accuracy Scoring**: Real-time accuracy percentage based on pose analysis

### Voice & Audio Feedback
- **Text-to-Speech**: Real-time voice coaching and feedback
- **Cross-platform TTS**: Native mobile TTS and Web Speech API
- **Smart Repetition Filtering**: Prevents repetitive feedback spam
- **Adjustable Voice Settings**: Rate, pitch, and volume controls

### User Management
- **Authentication System**: Secure login/register with JWT tokens
- **User Profiles**: Personalized user accounts and settings
- **Workout History**: Track and view previous workout sessions
- **Session Management**: Timed workout sessions with progress tracking

### Mobile-First Design
- **Responsive Layout**: Optimized for mobile devices
- **Native Mobile App**: Full Android/iOS app capabilities
- **Touch-Friendly Interface**: Large buttons and intuitive gestures
- **Camera Integration**: Native camera access on mobile devices

### Real-time Features
- **Live Connection Status**: Visual indicators for connection health
- **WebSocket Communication**: Real-time data streaming to AI backend
- **Session Timers**: Live workout duration tracking
- **Instant Feedback**: Sub-second response time for pose analysis

## 🏗️ Application Architecture

### Component Structure
```
src/
├── components/
│   ├── CameraPage.vue      # Main camera interface with pose detection
│   ├── Login.vue           # User authentication
│   ├── Register.vue        # User registration
│   ├── Profile.vue         # User profile management
│   ├── Workouts.vue        # Workout selection and management
│   ├── History.vue         # Workout history and analytics
│   ├── Main.vue            # Dashboard/home page
│   └── DarkModeToggle.vue  # Theme switching
│
├── composables/
│   ├── useWebSocket.js     # WebSocket connection management
│   ├── useVoiceFeedback.js # Text-to-speech functionality
│   └── useDarkMode.js      # Dark mode state management
│
├── config/
│   └── environment.js     # Environment configuration
│
└── services/
    └── socket.js          # Socket.IO service layer
```

### Data Flow
1. **Camera Capture** → Video stream from device camera
2. **Frame Processing** → Frames sent to AI backend via WebSocket
3. **Pose Analysis** → AI processes pose data and returns feedback
4. **Real-time Display** → Pose landmarks and feedback displayed instantly
5. **Voice Feedback** → TTS provides audio coaching
6. **Session Tracking** → Workout data stored and tracked

## 📱 How the App Works

### 1. User Onboarding
- **Registration/Login**: Users create accounts with secure authentication
- **Profile Setup**: Initial profile configuration and preferences
- **Camera Permissions**: Request access to device camera

### 2. Exercise Selection
- **Exercise Types**: Choose from Squat, Plank, or Lunge
- **Exercise Preview**: View demonstration videos for proper form
- **Difficulty Settings**: Customize workout intensity

### 3. Real-time Workout Session
- **Camera Activation**: Start camera feed for pose detection
- **Exercise Detection**: AI recognizes and tracks selected exercise
- **Live Feedback**: Real-time form analysis with visual and audio feedback
- **Pose Visualization**: Overlay pose landmarks on video feed
- **Session Timer**: Track workout duration and progress

### 4. Feedback System
- **Visual Feedback**: 
  - Pose landmark overlay on camera feed
  - Accuracy percentage display
  - Form correctness indicators
  - Real-time tips and corrections
  
- **Audio Feedback**:
  - Voice coaching for form improvements
  - Motivational feedback
  - Progress announcements
  - Exercise counting and timing

### 5. Progress Tracking
- **Session History**: Record completed workouts
- **Analytics**: Track improvement over time
- **Performance Metrics**: Accuracy scores and form analysis
- **Goal Setting**: Personal fitness targets

### 6. Mobile App Features
- **Offline Capability**: Core functionality works without internet
- **Native Performance**: Optimized for mobile hardware
- **Background Processing**: Continues tracking during app switching
- **Push Notifications**: Workout reminders and achievements

## 🔧 Technical Implementation

### WebSocket Communication
```javascript
// Real-time pose data streaming
const socket = io(SOCKET_URL)
socket.emit('pose_frame', frameData)
socket.on('pose_analysis', handlePoseAnalysis)
```

### Camera & Video Processing
```javascript
// Capture video stream and process frames
const videoElement = ref(null)
const canvasElement = ref(null)
// Frame capture and WebSocket transmission
```

### Voice Feedback System
```javascript
// Cross-platform text-to-speech
const { speak, isPlaying } = useVoiceFeedback()
await speak("Great form! Keep it up!", 'normal', true, accuracy)
```

### Responsive State Management
```javascript
// Reactive WebSocket connection
const { isConnected, send } = useWebSocket(socketUrl)
// Dark mode state
const { isDarkMode, toggleDarkMode } = useDarkMode()
```

## 🛠️ Installation & Setup

### Prerequisites
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Git** - [Download from git-scm.com](https://git-scm.com/)
- **Modern browser** with camera access permissions (Chrome, Firefox, Safari, Edge)
- **Running backend server** for AI pose detection

### For Mobile Development (Optional)
- **Android Studio** - [Download from developer.android.com](https://developer.android.com/studio)
- **Java JDK 17+** - Required for Android development
- **Android SDK** - Installed via Android Studio
- **USB Debugging enabled** on your Android device

## 📦 Installation Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/gymtasticint.git
cd gymtasticint/frontend
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the frontend root directory:
```env
# Backend API Configuration
VITE_BACKEND_URL=http://localhost:5000
VITE_SOCKET_URL=ws://localhost:5000

# App Configuration
VITE_APP_NAME=GymTastic AI Trainer
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_DEBUG_MODE=true
```

### 4. Start Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

## 🚀 Deployment Instructions

### Web Deployment

#### Option 1: Netlify Deployment
1. **Build the application:**
```bash
npm run build
```

2. **Deploy to Netlify:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=dist
```

#### Option 2: Vercel Deployment
1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel --prod
```

#### Option 3: Manual Deployment
1. **Build for production:**
```bash
npm run build
```

2. **Upload the `dist` folder to your web server**

#### Option 4: Docker Deployment
1. **Create Dockerfile:**
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. **Build and run Docker container:**
```bash
docker build -t gymtastic-frontend .
docker run -p 80:80 gymtastic-frontend
```

### Environment Variables for Production
Update your production environment variables:
```env
VITE_BACKEND_URL=https://your-backend-domain.com
VITE_SOCKET_URL=wss://your-backend-domain.com
VITE_DEBUG_MODE=false
```

## 📱 Mobile App Development

### Initial Mobile Setup

1. **Install Capacitor CLI:**
```bash
npm install -g @capacitor/cli
```

2. **Build web assets:**
```bash
npm run build
```

3. **Initialize Capacitor (if not already done):**
```bash
npx cap init
```

4. **Add Android platform:**
```bash
npx cap add android
```

5. **Sync project:**
```bash
npx cap sync
```

### Android Development Setup

1. **Install Android Studio and SDK:**
   - Download and install Android Studio
   - Install Android SDK (API level 24 or higher)
   - Install Android SDK Build-Tools
   - Set up Android emulator or connect physical device

2. **Configure Android environment:**
```bash
# Add to your .bashrc or .zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

3. **Open project in Android Studio:**
```bash
npx cap open android
```

## 📦 Build APK Instructions

### Method 1: Using Android Studio (Recommended)

1. **Prepare the build:**
```bash
# Build web assets
npm run build

# Sync with Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android
```

2. **In Android Studio:**
   - Wait for Gradle sync to complete
   - Go to `Build` → `Generate Signed Bundle / APK`
   - Choose `APK`
   - Create a new keystore or use existing one
   - Select build variant (`debug` or `release`)
   - Click `Finish`

3. **APK location:**
   - Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release APK: `android/app/build/outputs/apk/release/app-release.apk`

### Method 2: Command Line Build

1. **Build debug APK:**
```bash
# Build web assets
npm run build

# Sync with Capacitor
npx cap sync android

# Build debug APK
cd android
./gradlew assembleDebug
```

2. **Build release APK:**
```bash
# Build web assets for production
npm run build

# Sync with Capacitor
npx cap sync android

# Build release APK (requires signing)
cd android
./gradlew assembleRelease
```

### Method 3: Automated Build Script

Create a build script `build-apk.sh`:
```bash
#!/bin/bash

echo "Building GymTastic APK..."

# Clean previous builds
echo "Cleaning previous builds..."
rm -rf dist
rm -rf android/app/build

# Install dependencies
echo "Installing dependencies..."
npm install

# Build web assets
echo "Building web assets..."
npm run build

# Sync with Capacitor
echo "Syncing with Capacitor..."
npx cap sync android

# Build APK
echo "Building APK..."
cd android
./gradlew assembleDebug

echo "APK built successfully!"
echo "Location: android/app/build/outputs/apk/debug/app-debug.apk"
```

Make it executable and run:
```bash
chmod +x build-apk.sh
./build-apk.sh
```

### Signing the APK for Production

1. **Generate a keystore:**
```bash
keytool -genkey -v -keystore gymtastic-release-key.keystore -alias gymtastic -keyalg RSA -keysize 2048 -validity 10000
```

2. **Configure signing in `android/app/build.gradle`:**
```gradle
android {
    ...
    signingConfigs {
        release {
            keyAlias 'gymtastic'
            keyPassword 'your-key-password'
            storeFile file('gymtastic-release-key.keystore')
            storePassword 'your-store-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

3. **Build signed APK:**
```bash
cd android
./gradlew assembleRelease
```

### APK Installation

1. **Install on connected device:**
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

2. **Or transfer APK to device and install manually**

### Build Troubleshooting

**Common Issues:**
- **Gradle sync failed**: Check Android SDK installation and paths
- **Build failed**: Ensure Java JDK 17+ is installed
- **Signing errors**: Verify keystore path and passwords
- **Out of memory**: Increase Gradle heap size in `gradle.properties`

**Gradle heap size fix:**
```properties
# In android/gradle.properties
org.gradle.jvmargs=-Xmx4096m -XX:MaxPermSize=512m -XX:+HeapDumpOnOutOfMemoryError -Dfile.encoding=UTF-8
```

## 🎮 Usage Guide

### Web Application
1. Allow camera access when prompted by the browser
2. Select an exercise type from the exercise menu
3. Click "Start" to begin pose detection
4. Follow the real-time feedback to improve your form
5. Click "Stop" when finished
6. View your session results in the History tab

### Mobile Application
1. Ensure your device has a working camera
2. Grant camera permissions when prompted
3. Select your preferred exercise
4. Use voice commands or touch controls
5. Track your progress in the Profile section

## 🚨 Troubleshooting

### Connection Issues
- **WebSocket failures**: Check that your backend server is running
- **Camera access**: Requires HTTPS in production environments
- **Mobile permissions**: Ensure camera permissions are granted

### Performance Optimization
- **Frame rate**: Adjust camera resolution for better performance
- **Voice feedback**: Disable voice if experiencing audio delays
- **Network**: Use stable internet connection for real-time analysis

### Platform-Specific Issues
- **iOS Safari**: May require user gesture to start camera
- **Android Chrome**: Ensure latest browser version
- **Desktop**: Some features optimized for mobile may have limited functionality

## 🔮 Future Enhancements

- **Additional Exercises**: Push-ups, pull-ups, and more
- **Group Workouts**: Multi-user sessions and competitions
- **Wearable Integration**: Heart rate and fitness tracker support
- **AI Coaching**: Personalized workout recommendations
- **Social Features**: Share progress and compete with friends
