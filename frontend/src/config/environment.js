// Frontend Configuration for Different Environments
const config = {
  // Development (localhost)
  development: {
    API_BASE_URL: 'http://localhost:5000',
    SOCKET_URL: 'http://localhost:5000'
  },
  
  // Local Network (for mobile APK testing)
  // Replace with your computer's actual IP address 192.168.1.100
  local_network: {
    API_BASE_URL: 'http://10.144.228.166:5000',
    SOCKET_URL: 'http://10.144.228.166:5000'
  },
  
  // Production (when deployed)
  production: {
    API_BASE_URL: 'https://your-domain.com',
    SOCKET_URL: 'https://your-domain.com'
  }
};

// Auto-detect environment or set manually
const getEnvironment = () => {
  // Check if running on mobile device
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  // Check if accessing via IP address (likely mobile on local network)
  const isLocalNetwork = window.location.hostname.match(/^\d+\.\d+\.\d+\.\d+$/);
  
  // For mobile or IP access, use local network config
  if (isMobile || isLocalNetwork) {
    console.log('📱 Mobile device detected, using local network configuration');
    return 'local_network';
  }
  
  // For localhost development
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('💻 Localhost detected, using development configuration');
    return 'development';
  }
  
  // Default to production
  console.log('🌐 Production environment detected');
  return 'production';
};

const currentEnv = getEnvironment();
export const API_BASE_URL = config[currentEnv].API_BASE_URL;
export const SOCKET_URL = config[currentEnv].SOCKET_URL;

console.log(`🌍 Frontend Environment: ${currentEnv}`);
console.log(`🔗 API URL: ${API_BASE_URL}`);
console.log(`🔌 Socket URL: ${SOCKET_URL}`);

// Show helpful message for mobile users
if (currentEnv === 'local_network') {
  console.log('📱 MOBILE SETUP:');
  console.log('1. Ensure your computer is running the backend server');
  console.log('2. Make sure both devices are on the same WiFi network');
  console.log('3. If connection fails, check your computer\'s IP address');
  console.log('4. The app will use demo mode if backend is not available');
}

export default config; 