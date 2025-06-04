# GymTastic AI Trainer

A real-time pose detection application for exercise form monitoring.

## Features

- Camera-based pose detection
- Real-time form feedback
- Supports multiple exercise types (Squat, Plank, Lunge)
- WebSocket communication with the backend for AI processing

## Prerequisites

- Node.js 18+
- A modern browser with camera access permissions
- Running backend server

## Setup and Installation

1. Install dependencies:

```bash
npm install
```

2. Configure backend URL:

Create a `.env.local` file in the project root with:

```
VITE_BACKEND_URL=your-backend-url:port
```

Default is `localhost:5000` if not specified.

3. Start the development server:

```bash
npm run dev
```

4. Build for production:

```bash
npm run build
```

## Usage

1. Allow camera access when prompted by the browser
2. Select an exercise type from the top menu
3. Click "Start" to begin pose detection
4. Follow the feedback provided to improve your form
5. Click "Stop" when finished

## Mobile Usage

This application is designed to work as a mobile web app. For the best experience on mobile:

1. Ensure your device has a working camera
2. Access the application via a modern mobile browser (Chrome, Safari)
3. For iOS/Android, you can add it to your home screen for a more app-like experience

## Troubleshooting

- If the WebSocket connection fails, check that your backend server is running
- Camera access requires HTTPS in production environments
- For local development, ensure your browser allows camera access
