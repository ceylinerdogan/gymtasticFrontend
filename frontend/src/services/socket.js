import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.callbacks = {
      landmarks: [],
      poseDetected: [],
      connection: [],
      error: []
    };
    this.testingMode = false;
    this.rawLoggingEnabled = false;
  }

  connect(url = 'http://localhost:5000', options = {}) {
    if (this.socket) {
      console.log('Socket already exists, disconnecting first');
      this.disconnect();
    }

    console.log('Connecting to socket at', url);
    
    try {
      this.socket = io(url, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        timeout: 20000,
        auth: options.token ? { token: options.token } : {},
        ...options
      });

      this.socket.on('connect', () => {
        console.log('Socket connected with ID:', this.socket.id);
        this.connected = true;
        this.callbacks.connection.forEach(cb => cb({ connected: true }));
        
        // Setup universal pose listener for any event that might contain pose data
        this.setupUniversalPoseListener();
        
        // Enable raw data logging for debugging
        this.enableRawDataLogging();
      });

      this.socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        this.connected = false;
        this.callbacks.connection.forEach(cb => cb({ connected: false, reason }));
      });

      this.socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        this.callbacks.error.forEach(cb => cb({ type: 'connect_error', error }));
      });

      // Set up specific event listeners for pose analysis
      this.socket.on('pose_analysis_result', (data) => {
        console.log('📊 Received pose analysis result:', {
          hasLandmarks: !!data.landmarks,
          exercise: data.exercise_name,
          accuracy: data.accuracy
        });
        
        // Process the data
        const processedData = this.processBackendData(data);
        
        // Notify about landmarks if present
        if (processedData.landmarks && Array.isArray(processedData.landmarks) && processedData.landmarks.length > 0) {
          this.callbacks.landmarks.forEach(cb => cb({ 
            landmarks: processedData.landmarks,
            image_dimensions: processedData.image_dimensions 
          }));
        }
        
        // Notify about detected pose
        if (processedData.exercise_name || processedData.poseName) {
          this.callbacks.poseDetected.forEach(cb => cb({
            poseName: processedData.exercise_name || processedData.poseName,
            accuracy: processedData.accuracy,
            feedback: processedData.feedback || []
          }));
        }
      });

      // Handle pose analysis errors
      this.socket.on('pose_analysis_error', (error) => {
        console.error('Pose analysis error:', error);
        this.callbacks.error.forEach(cb => cb({ type: 'pose_analysis_error', error }));
      });

      return true;
    } catch (error) {
      console.error('Error creating socket connection:', error);
      this.callbacks.error.forEach(cb => cb({ type: 'creation_error', error }));
      return false;
    }
  }

  disconnect() {
    if (this.socket) {
      console.log('Disconnecting socket');
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  sendFrame(data) {
    if (!this.socket || !this.connected) {
      console.warn('Cannot send frame - socket not connected');
      return false;
    }

    try {
      // Track sent frames for logging
      this.sentFrames = (this.sentFrames || 0) + 1;
      
      // Log first frame and then every 50th frame
      if (this.sentFrames === 1 || this.sentFrames % 50 === 0) {
        console.log(`Socket: Sending frame #${this.sentFrames} (${Math.round(data.image.length/1024)}KB) to backend`);
      }
      
      // Use the correct event name as specified by the backend
      this.socket.emit('analyze_pose_frame', {
        exercise_id: data.exercise_id || 'squat',
        image: data.image,
        user_id: data.user_id || 'anonymous',
        timestamp: data.timestamp || Date.now(),
        force_detection: data.force_detection || false,
        debug: data.debug || false
      });
      return true;
    } catch (error) {
      console.error('Error sending frame:', error);
      return false;
    }
  }

  onLandmarks(callback) {
    if (typeof callback === 'function') {
      this.callbacks.landmarks.push(callback);
    }
  }

  onPoseDetected(callback) {
    if (typeof callback === 'function') {
      this.callbacks.poseDetected.push(callback);
    }
  }

  onConnection(callback) {
    if (typeof callback === 'function') {
      this.callbacks.connection.push(callback);
    }
  }

  onError(callback) {
    if (typeof callback === 'function') {
      this.callbacks.error.push(callback);
    }
  }

  removeAllListeners() {
    this.callbacks = {
      landmarks: [],
      poseDetected: [],
      connection: [],
      error: []
    };
  }

  setTestingMode(enabled) {
    this.testingMode = enabled;
    if (this.socket && this.connected) {
      this.socket.emit('set_testing_mode', { enabled });
    }
    return this.testingMode;
  }

  isConnected() {
    return this.connected && this.socket && this.socket.connected;
  }

  // Add this new method for raw data logging
  enableRawDataLogging() {
    if (!this.socket || this.rawLoggingEnabled) return;
    
    console.log("Enabling raw socket event logging for debugging");
    
    // Store original emit function
    const originalEmit = this.socket.onevent;
    
    // Override with our logging version
    this.socket.onevent = (packet) => {
      const eventName = packet.data[0];
      const data = packet.data[1];
      
      // Log all incoming events except high-frequency ones
      if (eventName && eventName !== 'connect' && eventName !== 'disconnect') {
        console.log(`🔍 RAW SOCKET EVENT: ${eventName}`, {
          dataType: typeof data,
          isObject: typeof data === 'object',
          isNull: data === null,
          hasLandmarks: data && data.landmarks ? true : false,
          hasExerciseName: data && data.exercise_name ? true : false,
          keys: data ? Object.keys(data) : []
        });
        
        // For specific events, log more details
        if (eventName === 'pose_analysis_result' || eventName === 'landmarks') {
          console.log(`🔍 DETAILED ${eventName}:`, data);
        }
      }
      
      // Call the original handler
      originalEmit.call(this.socket, packet);
    };
    
    this.rawLoggingEnabled = true;
  }

  // Update processBackendData method to be more robust
  processBackendData(data) {
    // Create a copy to avoid modifying the original
    const processed = { ...data };
    
    // Check if this is test data or real pose data
    const isTestData = data.test_data === true;
    if (isTestData) {
      console.log("Received test data, not real pose data");
    }
    
    // Process landmarks if present
    if (data.landmarks) {
      try {
        // Handle string JSON format
        if (typeof data.landmarks === 'string') {
          try {
            processed.landmarks = JSON.parse(data.landmarks);
            console.log("Converted landmarks from string to object");
          } catch (err) {
            console.error("Failed to parse landmarks string:", err);
          }
        }
        
        // Ensure landmarks are an array
        if (processed.landmarks && !Array.isArray(processed.landmarks)) {
          // If it's an object with numbered keys (like {0: {x,y}, 1: {x,y}})
          if (typeof processed.landmarks === 'object') {
            try {
              const keys = Object.keys(processed.landmarks).sort((a, b) => parseInt(a) - parseInt(b));
              const landmarksArray = keys.map(key => processed.landmarks[key]);
              processed.landmarks = landmarksArray;
              console.log("Converted object landmarks to array format");
            } catch (err) {
              console.error("Failed to convert object landmarks to array:", err);
            }
          }
        }
        
        // Process array landmarks to ensure x,y format
        if (Array.isArray(processed.landmarks)) {
          processed.landmarks = processed.landmarks.map(lm => {
            if (!lm) return { x: 0, y: 0, z: 0 }; // Handle null/undefined landmarks
            
            // Already in {x,y} format
            if (typeof lm === 'object' && 'x' in lm && 'y' in lm) {
              // Ensure values are numbers
              return {
                x: Number(lm.x),
                y: Number(lm.y),
                z: lm.z ? Number(lm.z) : 0
              };
            }
            
            // Array format [x,y,z] or [x,y]
            if (Array.isArray(lm)) {
              return {
                x: Number(lm[0]),
                y: Number(lm[1]),
                z: lm.length > 2 ? Number(lm[2]) : 0
              };
            }
            
            // Object with alternate property names
            if (typeof lm === 'object') {
              const x = lm.x || lm.X || lm.position_x || 0;
              const y = lm.y || lm.Y || lm.position_y || 0;
              const z = lm.z || lm.Z || lm.position_z || 0;
              return { 
                x: Number(x), 
                y: Number(y), 
                z: Number(z) 
              };
            }
            
            // Fallback
            return { x: 0, y: 0, z: 0 };
          });
          
          // Validate that the landmarks actually have valid x,y values (not just zeros)
          const validPoints = processed.landmarks.filter(lm => 
            lm.x !== 0 || lm.y !== 0 || lm.z !== 0
          );
          
          if (validPoints.length < 5) {
            console.warn(`Only ${validPoints.length} valid non-zero landmarks found, may not render properly`);
          } else {
            console.log(`Processed ${processed.landmarks.length} landmarks with ${validPoints.length} valid points`);
          }
        }
      } catch (err) {
        console.error("Error processing landmarks:", err);
      }
    }
    
    // Ensure image dimensions exist
    if (!processed.image_dimensions) {
      processed.image_dimensions = {
        width: 640,  // Default width
        height: 480  // Default height
      };
      console.log("Added default image dimensions");
    }
    
    return processed;
  }

  // Add a method to listen for any type of pose data
  setupUniversalPoseListener() {
    if (!this.socket) return;
    
    console.log('Setting up universal pose data listener');
    
    // List of common event names that might contain pose data
    const poseEventNames = [
      'pose_analysis_result',
      'landmarks',
      'pose',
      'pose_landmarks',
      'pose_detection',
      'keypoints',
      'skeleton',
      'body_landmarks',
      'body_pose',
      'analysis_result',
      'pose_result',
      'exercise_analysis'
    ];
    
    // Listen for all these events
    poseEventNames.forEach(eventName => {
      this.socket.on(eventName, (data) => {
        console.log(`Universal listener caught event: ${eventName}`);
        
        try {
          // Process the data directly
          const processedData = this.processBackendData(data);
          
          // If we have landmarks, notify the landmarks callbacks
          if (processedData.landmarks && Array.isArray(processedData.landmarks) && processedData.landmarks.length > 0) {
            console.log(`Universal listener found ${processedData.landmarks.length} landmarks in ${eventName}`);
            
            this.callbacks.landmarks.forEach(cb => cb({
              landmarks: processedData.landmarks,
              image_dimensions: processedData.image_dimensions || { width: 640, height: 480 }
            }));
          }
          
          // If we have pose/exercise info, notify the pose callbacks
          if (processedData.exercise_name || processedData.poseName || processedData.pose_name) {
            const poseName = processedData.exercise_name || processedData.poseName || processedData.pose_name;
            console.log(`Universal listener found pose: ${poseName} in ${eventName}`);
            
            this.callbacks.poseDetected.forEach(cb => cb({
              poseName: poseName,
              accuracy: processedData.accuracy || processedData.score || 1.0
            }));
          }
        } catch (err) {
          console.error(`Error processing ${eventName} event:`, err);
        }
      });
    });
    
    // Also add a catch-all listener as a last resort
    this.socket.onAny((eventName, data) => {
      // Skip the events we're already handling explicitly
      if (poseEventNames.includes(eventName)) return;
      
      // Skip common non-pose events
      const skipEvents = ['connect', 'disconnect', 'connection', 'error', 'reconnect'];
      if (skipEvents.includes(eventName)) return;
      
      try {
        // Check if data might contain pose information
        if (typeof data === 'object' && data !== null) {
          const possibleLandmarkProps = ['landmarks', 'keypoints', 'skeleton', 'points', 'pose'];
          
          // Check if any of these properties exist in the data
          for (const prop of possibleLandmarkProps) {
            if (data[prop] && (Array.isArray(data[prop]) || typeof data[prop] === 'object')) {
              console.log(`Catch-all found possible landmarks in '${prop}' property of '${eventName}' event`);
              
              // Try to process as landmarks
              const landmarks = data[prop];
              if (Array.isArray(landmarks) && landmarks.length > 0) {
                this.callbacks.landmarks.forEach(cb => cb({
                  landmarks: landmarks,
                  image_dimensions: data.image_dimensions || data.dimensions || { width: 640, height: 480 }
                }));
                break; // Stop after processing one property
              }
            }
          }
        }
      } catch (err) {
        // Silently ignore errors in the catch-all listener
      }
    });
  }
}

// Create a singleton instance
const socketService = new SocketService();

export default socketService; 