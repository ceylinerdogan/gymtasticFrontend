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

## 🛠️ Setup and Installation

### Prerequisites
- Node.js 18+
- A modern browser with camera access permissions
- Running backend server for AI pose detection

### Development Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure backend URL:**
Create a `.env.local` file in the project root:
```env
VITE_BACKEND_URL=your-backend-url:port
```
Default is `localhost:5000` if not specified.

3. **Start development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

### Mobile App Setup

1. **Build web assets:**
```bash
npm run build
```

2. **Sync with Capacitor:**
```bash
npx cap sync
```

3. **Open in Android Studio:**
```bash
npx cap open android
```

4. **Run on device:**
```bash
npx cap run android
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
