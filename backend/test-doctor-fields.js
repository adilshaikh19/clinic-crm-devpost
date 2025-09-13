const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./src/models/User');
const connectDB = require('./src/config/database');

const testDoctorFields = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database');

    // Test creating a doctor with new fields
    const testDoctor = {
      clinicId: 'TEST_CLINIC',
      name: 'Dr. Test Doctor',
      email: 'test.doctor@example.com',
      passwordHash: 'hashedpassword123',
      role: 'doctor',
      phone: '+1234567890',
      specialization: 'Cardiology',
      licenseNumber: 'MD-12345',
      qualifications: 'MBBS, MD Cardiology',
      experience: 10,
      isActive: true
    };

    // Create the doctor
    const doctor = new User(testDoctor);
    await doctor.save();
    console.log('✅ Doctor created successfully with new fields:');
    console.log({
      name: doctor.name,
      specialization: doctor.specialization,
      licenseNumber: doctor.licenseNumber,
      qualifications: doctor.qualifications,
      experience: doctor.experience
    });

    // Test retrieving the doctor
    const retrievedDoctor = await User.findById(doctor._id);
    console.log('✅ Doctor retrieved successfully:');
    console.log({
      name: retrievedDoctor.name,
      specialization: retrievedDoctor.specialization,
      licenseNumber: retrievedDoctor.licenseNumber,
      qualifications: retrievedDoctor.qualifications,
      experience: retrievedDoctor.experience
    });

    // Test updating doctor fields
    retrievedDoctor.experience = 12;
    retrievedDoctor.qualifications = 'MBBS, MD Cardiology, Fellowship in Interventional Cardiology';
    await retrievedDoctor.save();
    console.log('✅ Doctor updated successfully');

    // Clean up - delete test doctor
    await User.findByIdAndDelete(doctor._id);
    console.log('✅ Test doctor cleaned up');

    console.log('\n🎉 All doctor field tests passed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Close database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the test
testDoctorFields();