import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { patientAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import CreatePrescription from './CreatePrescription';
import LoadingSpinner from '../shared/LoadingSpinner';
import { FiArrowLeft, FiUser } from 'react-icons/fi';

const CreatePrescriptionPage = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    const fetchPatient = async () => {
      try {
        setLoading(true);
        const response = await patientAPI.getPatient(patientId);
        setPatient(response.data.data);
      } catch (error) {
        setError("Failed to load patient information");
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatient();
    }
  }, [patientId]);


  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Prescription</h1>
              {patient && (
                <div className="flex items-center text-gray-600">
                  <FiUser className="mr-2" />
                  <span>For: {patient.name} (ID: {patient.patientId})</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Patient Selection for New Prescription */}
        {!patientId && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Patient</h2>
            <p className="text-gray-600 mb-4">
              To create a prescription, please select a patient from your patient list first.
            </p>
            <button
              onClick={() => navigate(user?.role === 'clinic_admin' ? '/admin/patients' : '/doctor/patients')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Patient List
            </button>
          </div>
        )}

        {/* Create Prescription Form */}
        {(patientId && patient) && (
          <CreatePrescription patientId={patientId} />
        )}
      </div>
    </div>
  );
};

export default CreatePrescriptionPage;