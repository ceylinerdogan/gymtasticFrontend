import { ref } from 'vue';

/**
 * Composable for managing WebSocket connections
 * @param {string} url - WebSocket server URL
 * @param {Object} options - Additional options
 * @returns {Object} WebSocket state and methods
 */
export function useWebSocket(url, options = {}) {
  const socket = ref(null);
  const isConnected = ref(false);
  const error = ref(null);
  const reconnectAttempts = ref(0);
  const maxReconnectAttempts = options.maxReconnectAttempts || 5;
  const reconnectInterval = options.reconnectInterval || 3000;
  
  // Connect to WebSocket server
  const connect = () => {
    // Close existing connection if any
    if (socket.value) {
      socket.value.close();
    }
    
    try {
      // Create new WebSocket connection
      socket.value = new WebSocket(url);
      
      // Set up event handlers
      socket.value.onopen = handleOpen;
      socket.value.onclose = handleClose;
      socket.value.onerror = handleError;
      socket.value.onmessage = handleMessage;
      
      return socket.value;
    } catch (err) {
      error.value = err;
      return null;
    }
  };
  
  // Handle WebSocket open event
  const handleOpen = (event) => {
    isConnected.value = true;
    reconnectAttempts.value = 0;
    error.value = null;
    
    if (options.onOpen) {
      options.onOpen(event);
    }
  };
  
  // Handle WebSocket close event
  const handleClose = (event) => {
    isConnected.value = false;
    
    if (options.onClose) {
      options.onClose(event);
    }
    
    // Attempt to reconnect if not explicitly closed and within retry limits
    if (!event.wasClean && reconnectAttempts.value < maxReconnectAttempts) {
      reconnectAttempts.value++;
      setTimeout(connect, reconnectInterval);
    }
  };
  
  // Handle WebSocket error event
  const handleError = (event) => {
    error.value = event;
    
    if (options.onError) {
      options.onError(event);
    }
  };
  
  // Handle WebSocket message event
  const handleMessage = (event) => {
    if (options.onMessage) {
      options.onMessage(event);
    }
  };
  
  // Send message to server
  const send = (data) => {
    if (!socket.value || socket.value.readyState !== WebSocket.OPEN) {
      error.value = new Error('WebSocket is not connected');
      return false;
    }
    
    try {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      socket.value.send(message);
      return true;
    } catch (err) {
      error.value = err;
      return false;
    }
  };
  
  // Disconnect from server
  const disconnect = () => {
    if (socket.value) {
      socket.value.close();
      socket.value = null;
    }
    isConnected.value = false;
  };
  
  return {
    socket,
    isConnected,
    error,
    reconnectAttempts,
    connect,
    send,
    disconnect
  };
} 