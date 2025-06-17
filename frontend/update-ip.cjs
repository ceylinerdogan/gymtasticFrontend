#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
      // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
      const familyV4Value = typeof iface.family === 'string' ? 'IPv4' : 4;
      if (iface.family === familyV4Value && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function updateConfig() {
  const configPath = path.join(__dirname, 'src', 'config', 'environment.js');
  const localIP = getLocalIP();
  
  console.log(`🔍 Found your local IP: ${localIP}`);
  
  try {
    let content = fs.readFileSync(configPath, 'utf8');
    
    // Replace the IP in local_network configuration
    const oldPattern = /API_BASE_URL: 'http:\/\/[\d.]+:5000'/;
    const newAPIURL = `API_BASE_URL: 'http://${localIP}:5000'`;
    
    const oldSocketPattern = /SOCKET_URL: 'http:\/\/[\d.]+:5000'/;
    const newSocketURL = `SOCKET_URL: 'http://${localIP}:5000'`;
    
    content = content.replace(oldPattern, newAPIURL);
    content = content.replace(oldSocketPattern, newSocketURL);
    
    fs.writeFileSync(configPath, content);
    
    console.log(`✅ Updated environment.js with IP: ${localIP}`);
    console.log(`📱 Your mobile app will now connect to: http://${localIP}:5000`);
    console.log('');
    console.log('🚀 Next steps:');
    console.log('1. Start your backend: python main.py');
    console.log('2. Build your app for production: npm run build');
    console.log('3. Build APK with Capacitor (see instructions below)');
    
  } catch (error) {
    console.error('❌ Error updating config:', error.message);
  }
}

if (require.main === module) {
  updateConfig();
}

module.exports = { getLocalIP, updateConfig }; 