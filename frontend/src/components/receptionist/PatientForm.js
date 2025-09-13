import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PatientFormShared from '../shared/PatientForm';
import { patientAPI } from '../../services/api';

const PatientForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(!!id);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  

  const fetchPatient = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await patientAPI.getPatient(id);
      setPatient(response.data.data);
    } catch (error) {
      console.error('Error fetching patient for edit:', error);
      setError(error.response?.data?.message || 'Failed to load patient data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate(-1); // Go back to the previous page (patient detail or list)
    }, 2000);
  };

  const handleCancel = () => {
    navigate(-1); // Go back to the previous page
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm font-medium flex items-center justify-center gap-2">
          Go Back
        </button>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-green-500 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>
          <p className="text-gray-600 mb-4">Patient has been saved successfully.</p>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 pt-20 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        <PatientFormShared
          patient={patient} // Pass the loaded patient data for editing
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default PatientForm;
