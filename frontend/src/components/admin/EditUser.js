import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { Save, X, Loader2, UserCog, Activity } from 'lucide-react';

const EditUser = () => {
  const { id } = useParams(); // Get user ID from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'doctor',
    specialization: '',
    phone: '',
    licenseNumber: '',
    qualifications: '',
    experience: '',
    isActive: true, // Include isActive in form data
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getUser(id); // Assuming a getUser API call exists
        const userData = response.data.data;
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'doctor',
          specialization: userData.specialization || '',
          phone: userData.phone || '',
          licenseNumber: userData.licenseNumber || '',
          qualifications: userData.qualifications || '',
          experience: userData.experience || '',
          isActive: userData.isActive,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
        setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load user data.' });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Basic validation
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' });
      return;
    }
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'Email is required' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'Please enter a valid email address' });
      return;
    }

    try {
      setSubmitting(true);
      const userDataToUpdate = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        isActive: formData.isActive,
      };

      // Add doctor-specific fields
      if (formData.role === 'doctor') {
        if (formData.specialization) userDataToUpdate.specialization = formData.specialization;
        if (formData.licenseNumber) userDataToUpdate.licenseNumber = formData.licenseNumber;
        if (formData.qualifications) userDataToUpdate.qualifications = formData.qualifications;
        if (formData.experience) userDataToUpdate.experience = parseInt(formData.experience);
      }

      await userAPI.updateUser(id, userDataToUpdate);
      
      setMessage({ type: 'success', text: 'User updated successfully!' });
      // Optionally navigate back to staff list after successful update
      // navigate('/admin/staff');
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        setMessage({
          type: 'error', 
          text: error.response.data.errors.join(', ')
        });
      } else {
        setMessage({
          type: 'error', 
          text: error.response?.data?.message || 'Failed to update user. Please try again.' 
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded-md">
            Staff Management
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <UserCog className="h-8 w-8 text-primary-600" /> 
              Edit Staff Member
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-1">
              <Activity className="h-4 w-4 text-primary-500" />
              Update the details for this staff member
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8 max-w-2xl">
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${ 
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.type === 'success' ? 
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg> :
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            }
            <span className="font-medium">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                placeholder="Enter email address"
              />
              <p className="text-xs text-gray-500 mt-1">
                Please enter a valid email address
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
              >
                <option value="doctor">Doctor</option>
                <option value="receptionist">Receptionist</option>
              </select>
            </div>
          </div>

          {/* Doctor-specific fields */}
          {formData.role === 'doctor' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization
                </label>
                <input
                  type="text"
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                  placeholder="e.g., General Medicine, Cardiology, Pediatrics"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    Medical License Number
                  </label>
                  <input
                    type="text"
                    id="licenseNumber"
                    name="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                    placeholder="e.g., MD-12345"
                  />
                </div>

                <div>
                  <label htmlFor="qualifications" className="block text-sm font-medium text-gray-700 mb-2">
                    Qualifications
                  </label>
                  <input
                    type="text"
                    id="qualifications"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                    placeholder="e.g., MBBS, MD"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    min="0"
                    max="50"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
                    placeholder="e.g., 5"
                  />
                </div>
              </div>
            </div>
          )}

          {/* isActive checkbox */}
          <div>
            <label htmlFor="isActive" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2">Account Active</span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/admin/staff')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm font-medium"
            >
              <X className="h-5 w-5" /> Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-md font-medium"
            >
              {submitting ? <><Loader2 className="h-5 w-5 animate-spin" /> Updating...</> : <><Save className="h-5 w-5" /> Update User</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;