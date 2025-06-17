// Frontend Configuration for Different Environments
const config = {
  // Development (localhost)
  development: {
    API_BASE_URL: 'http://localhost:5000',
    SOCKET_URL: 'http://localhost:5000'
  },
  
  // Local Network (for mobile APK testing)
  // Replace 192.168.1.100 with your computer's actual IP
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
  
  if (isMobile || isLocalNetwork) {
    return 'local_network';
  }
  
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'development';
  }
  
  return 'production';
};

const currentEnv = getEnvironment();
export const API_BASE_URL = config[currentEnv].API_BASE_URL;
export const SOCKET_URL = config[currentEnv].SOCKET_URL;

console.log(`🌍 Frontend Environment: ${currentEnv}`);
console.log(`🔗 API URL: ${API_BASE_URL}`);
console.log(`🔌 Socket URL: ${SOCKET_URL}`);

export default config; 