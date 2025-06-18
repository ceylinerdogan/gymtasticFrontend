// Frontend Configuration for Different Environments
const config = {
  // Development (localhost)
  development: {
    API_BASE_URL: 'http://localhost:5000',
    SOCKET_URL: 'http://localhost:5000'
  },
  
  // Local Network (mobile APK testing) - Updated with your actual IPs
  local_network: {
    API_BASE_URL: 'http://192.168.137.1:5000', // Primary: Mobile hotspot IP
    SOCKET_URL: 'http://192.168.137.1:5000',
    // Fallback IPs for different network configurations
    FALLBACK_IPS: [
      'http://10.143.4.6:5000',    // University network IP
      'http://192.168.1.100:5000', // Common router IP range
      'http://192.168.0.100:5000', // Alternative router IP
      'http://10.0.0.100:5000'     // Another common range
    ]
  },
  
  // University Network (for university WiFi)
  university_network: {
    API_BASE_URL: 'http://10.143.4.6:5000',
    SOCKET_URL: 'http://10.143.4.6:5000'
  },
  
  // Production (when deployed)
  production: {
    API_BASE_URL: 'https://your-domain.com',
    SOCKET_URL: 'https://your-domain.com'
  }
};

// Enhanced environment detection with IP-based fallbacks
const getEnvironment = () => {
  const hostname = window.location.hostname;
  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isLocalNetwork = hostname.match(/^\d+\.\d+\.\d+\.\d+$/);
  
  // For mobile or IP access, determine which network
  if (isMobile || isLocalNetwork) {
    console.log('📱 Mobile device detected');
    
    // Check if on university network
    if (hostname.startsWith('10.143') || hostname.includes('metu')) {
      console.log('🏫 University network detected');
      return 'university_network';
    }
    
    // Default to local network for mobile
    console.log('🏠 Local network configuration');
    return 'local_network';
  }
  
  // For localhost development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    console.log('💻 Localhost development mode');
    return 'development';
  }
  
  console.log('🌐 Production environment');
  return 'production';
};

const currentEnv = getEnvironment();
export const API_BASE_URL = config[currentEnv].API_BASE_URL;
export const SOCKET_URL = config[currentEnv].SOCKET_URL;
export const FALLBACK_IPS = config[currentEnv].FALLBACK_IPS || [];

console.log(`🌍 Environment: ${currentEnv}`);
console.log(`🔗 Primary API: ${API_BASE_URL}`);
console.log(`🔌 Socket URL: ${SOCKET_URL}`);

if (FALLBACK_IPS.length > 0) {
  console.log('🔄 Fallback IPs available:', FALLBACK_IPS);
}

// Connection test function
export const testConnection = async (url) => {
  try {
    const response = await fetch(`${url}/health`, { 
      method: 'GET', 
      timeout: 3000 
    });
    return response.ok;
  } catch (error) {
    console.log(`❌ Connection failed to ${url}:`, error.message);
    return false;
  }
};

// Find working backend URL
export const findWorkingBackend = async () => {
  console.log('🔍 Testing backend connections...');
  
  // Test primary URL first
  if (await testConnection(API_BASE_URL)) {
    console.log(`✅ Primary backend connected: ${API_BASE_URL}`);
    return API_BASE_URL;
  }
  
  // Test fallback IPs
  for (const fallbackUrl of FALLBACK_IPS) {
    if (await testConnection(fallbackUrl)) {
      console.log(`✅ Fallback backend connected: ${fallbackUrl}`);
      return fallbackUrl;
    }
  }
  
  console.log('❌ No backend servers available - using demo mode');
  return null;
};

// Show setup instructions
if (currentEnv === 'local_network' || currentEnv === 'university_network') {
  console.log('📋 BACKEND SETUP CHECKLIST:');
  console.log('1. ✅ Your IPs detected: 192.168.137.1, 10.143.4.6');
  console.log('2. 🖥️  Start backend server: python app.py');
  console.log('3. 🌐 Server should bind to 0.0.0.0:5000 (not 127.0.0.1)');
  console.log('4. 📱 Ensure phone and computer on same WiFi');
  console.log('5. 🔥 Check Windows Firewall allows port 5000');
  console.log('6. 🧪 Test in browser: http://192.168.137.1:5000');
}

export default config; 