const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function createTestClinic() {
  try {
    console.log('Creating test clinic...');
    
    const clinicData = {
      clinicName: "Test Clinic",
      address: "123 Test Street, Test City",
      contactInfo: "test@clinic.com | +1234567890",
      adminName: "Adil Admin",
      adminEmail: "adil2@gmail.com",
      adminPassword: "123456"
    };

    console.log('Clinic registration payload:', clinicData);

    const response = await axios.post(`${API_BASE}/auth/register-clinic`, clinicData);
    
    console.log('Clinic created successfully!');
    console.log('Response:', response.data);
    
    return response.data.data.clinicId;
    
  } catch (error) {
    console.error('Clinic creation failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
    return null;
  }
}

async function testLogin(clinicId) {
  try {
    console.log('\nTesting login with new clinic...');
    
    const loginData = {
      email: "adil2@gmail.com",
      password: "123456",
      clinicId: clinicId
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

async function runSetup() {
  const clinicId = await createTestClinic();
  if (clinicId) {
    await testLogin(clinicId);
  }
}

runSetup();