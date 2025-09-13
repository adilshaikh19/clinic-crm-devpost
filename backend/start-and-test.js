const { spawn } = require('child_process');
const axios = require('axios');

const API_BASE = 'http://localhost:3001';

function startServer() {
  console.log('Starting server...');
  const server = spawn('node', ['src/server.js'], {
    stdio: 'inherit',
    cwd: __dirname
  });

  server.on('error', (err) => {
    console.error('Failed to start server:', err);
  });

  return server;
}

async function waitForServer(maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await axios.get(`${API_BASE}/health`);
      console.log('Server is ready!');
      return true;
    } catch (error) {
      console.log(`Waiting for server... (${i + 1}/${maxAttempts})`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  return false;
}

async function testLogin() {
  try {
    console.log('\n=== Testing Login ===');
    
    const loginData = {
      email: "adil2@gmail.com",
      password: "123456",
      clinicId: "d4d5ef17-934e-459d-87f0-f53987a93111"
    };

    console.log('Login payload:', loginData);

    const response = await axios.post(`${API_BASE}/auth/login`, loginData);
    
    console.log('✅ Login successful!');
    console.log('User:', response.data.data.user);
    
  } catch (error) {
    console.error('❌ Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}

async function checkUsers() {
  try {
    console.log('\n=== Checking Users ===');
    const response = await axios.get(`${API_BASE}/auth/debug/users`);
    console.log('Users in database:', response.data.users);
  } catch (error) {
    console.error('Failed to check users:', error.response?.data || error.message);
  }
}

async function createTestUser() {
  try {
    console.log('\n=== Creating Test Clinic ===');
    
    const clinicData = {
      clinicName: "Test Clinic",
      address: "123 Test Street, Test City",
      contactInfo: "test@clinic.com | +1234567890",
      adminName: "Adil Admin",
      adminEmail: "adil2@gmail.com",
      adminPassword: "123456"
    };

    const response = await axios.post(`${API_BASE}/auth/register-clinic`, clinicData);
    
    console.log('✅ Clinic created successfully!');
    console.log('Clinic ID:', response.data.data.clinicId);
    
    return response.data.data.clinicId;
    
  } catch (error) {
    console.error('❌ Clinic creation failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    }
    return null;
  }
}

async function main() {
  const server = startServer();
  
  const serverReady = await waitForServer();
  if (!serverReady) {
    console.error('Server failed to start');
    process.exit(1);
  }

  await checkUsers();
  
  // Try login first
  await testLogin();
  
  // If login fails, create test user and try again
  console.log('\nIf login failed, creating test clinic...');
  const clinicId = await createTestUser();
  
  if (clinicId) {
    console.log('\nTrying login with new clinic...');
    await testLogin();
  }

  console.log('\n=== Test Complete ===');
  console.log('Press Ctrl+C to stop the server');
}

main().catch(console.error);