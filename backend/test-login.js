const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testLogin() {
  try {
    console.log('Testing login with your credentials...');
    
    const loginData = {
      email: "adil2@gmail.com",
      password: "123456",
      clinicId: "d4d5ef17-934e-459d-87f0-f53987a93111"
    };

    console.log('Login payload:', loginData);

    const response = await axios.post(`${API_BASE}/auth/login`, loginData);
    
    console.log('Login successful!');
    console.log('Response:', response.data);
    
  } catch (error) {
    console.error('Login failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

async function checkUsers() {
  try {
    console.log('Checking existing users...');
    const response = await axios.get(`${API_BASE}/auth/debug/users`);
    console.log('Users in database:', response.data);
  } catch (error) {
    console.error('Failed to check users:', error.message);
  }
}

async function testHealth() {
  try {
    console.log('Testing server health...');
    const response = await axios.get(`${API_BASE}/health`);
    console.log('Server is running:', response.data);
  } catch (error) {
    console.error('Server not responding:', error.message);
  }
}

async function runTests() {
  await testHealth();
  await checkUsers();
  await testLogin();
}

runTests();