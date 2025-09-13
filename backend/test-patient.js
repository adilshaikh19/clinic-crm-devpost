const axios = require('axios');

const API_BASE = 'http://localhost:3001';

async function testPatientFlow() {
  try {
    console.log('=== Testing Patient Management ===\n');

    // First, login to get a token
    console.log('1. Logging in...');
    const loginResponse = await axios.post(`${API_BASE}/auth/login`, {
      email: "adil2@gmail.com",
      password: "123456",
      clinicId: "d4d5ef17-934e-459d-87f0-f53987a93111"
    });

    const token = loginResponse.data.data.token;
    console.log('✅ Login successful');

    // Set up axios with auth header
    const authApi = axios.create({
      baseURL: API_BASE,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Get doctors list
    console.log('\n2. Getting doctors list...');
    const doctorsResponse = await authApi.get('/users');
    const doctors = doctorsResponse.data.data.filter(user => user.role === 'doctor');
    console.log(`✅ Found ${doctors.length} doctors`);

    if (doctors.length === 0) {
      console.log('❌ No doctors found. Please create a doctor first.');
      return;
    }

    // Create a test patient
    console.log('\n3. Creating test patient...');
    const patientData = {
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "+1234567890",
      dateOfBirth: "1990-01-15",
      gender: "male",
      address: {
        street: "123 Main St",
        city: "Anytown",
        state: "CA",
        zipCode: "12345",
        country: "USA"
      },
      emergencyContact: {
        name: "Jane Doe",
        relationship: "Spouse",
        phone: "+1234567891"
      },
      medicalHistory: {
        allergies: ["Penicillin", "Peanuts"],
        chronicConditions: ["Hypertension"],
        currentMedications: ["Lisinopril"],
        bloodType: "O+",
        notes: "Patient is generally healthy"
      },
      assignedDoctorId: doctors[0]._id
    };

    const createResponse = await authApi.post('/patients', patientData);
    console.log('✅ Patient created successfully');
    console.log('Patient ID:', createResponse.data.data.patientId);

    const patientId = createResponse.data.data._id;

    // Get all patients
    console.log('\n4. Getting all patients...');
    const patientsResponse = await authApi.get('/patients');
    console.log(`✅ Found ${patientsResponse.data.data.length} patients`);

    // Get specific patient
    console.log('\n5. Getting specific patient...');
    const patientResponse = await authApi.get(`/patients/${patientId}`);
    console.log('✅ Patient details retrieved');
    console.log('Patient name:', patientResponse.data.data.name);

    // Update patient
    console.log('\n6. Updating patient...');
    const updateData = {
      phone: "+1234567899",
      medicalHistory: {
        ...patientResponse.data.data.medicalHistory,
        notes: "Updated notes - Patient doing well"
      }
    };

    await authApi.put(`/patients/${patientId}`, updateData);
    console.log('✅ Patient updated successfully');

    console.log('\n=== All Patient Tests Passed! ===');

  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Network Error:', error.message);
    }
  }
}

testPatientFlow();