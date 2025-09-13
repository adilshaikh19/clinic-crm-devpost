import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiFileText,
  FiEye,
  FiPrinter,
  FiCalendar,
  FiUser,
  FiPlus,
  FiClock,
} from "react-icons/fi";
import { patientAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

const PatientPrescriptions = ({ patientId }) => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPatientPrescriptions = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await patientAPI.getPatientPrescriptions(patientId);
        setPrescriptions(response.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load prescriptions"
        );
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientPrescriptions();
    }
  }, [patientId]);


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <div className="bg-blue-100 p-2 rounded-lg mr-3">
            <FiFileText size={20} className="text-blue-600" />
          </div>
          Prescription History
        </h3>
        {(user.role === "doctor" || user.role === "clinic_admin") && (
          <Link
            to={
              user.role === "clinic_admin"
                ? `/admin/patients/${patientId}/prescriptions/new`
                : `/doctor/patients/${patientId}/prescriptions/new`
            }
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FiPlus className="mr-2" />
            New Prescription
          </Link>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <FiFileText className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {prescriptions.length === 0 ? (
        <div className="text-center py-12">
          <FiFileText className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No prescriptions found
          </h3>
          <p className="text-gray-600 mb-4">
            This patient doesn't have any prescriptions yet.
          </p>
          {(user.role === "doctor" || user.role === "clinic_admin") && (
            <Link
              to={
                user.role === "clinic_admin"
                  ? `/admin/patients/${patientId}/prescriptions/new`
                  : `/doctor/patients/${patientId}/prescriptions/new`
              }
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Create First Prescription
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {prescriptions.map((prescription) => (
            <div
              key={prescription._id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiFileText className="text-blue-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="text-lg font-semibold text-gray-900">
                        Prescription #{prescription.prescriptionId}
                      </h4>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 space-x-4">
                      <div className="flex items-center">
                        <FiCalendar className="mr-1" />
                        {formatDate(prescription.createdAt)}
                      </div>
                      <div className="flex items-center">
                        <FiClock className="mr-1" />
                        {formatTime(prescription.createdAt)}
                      </div>
                      {prescription.doctor && (
                        <div className="flex items-center">
                          <FiUser className="mr-1" />
                          Dr. {prescription.doctor.name}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={
                      user.role === "clinic_admin"
                        ? `/admin/prescriptions/${prescription._id}`
                        : `/doctor/prescriptions/${prescription._id}`
                    }
                    className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiEye className="mr-1" />
                    View
                  </Link>
                  <Link
                    to={
                      user.role === "clinic_admin"
                        ? `/admin/prescriptions/${prescription._id}`
                        : `/doctor/prescriptions/${prescription._id}`
                    }
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiPrinter className="mr-1" />
                    Print
                  </Link>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <FiFileText className="mr-2" />
                  Medications ({prescription.medications?.length || 0})
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {prescription.medications?.slice(0, 4).map((med, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">{med.name}</p>
                      <p className="text-sm text-gray-600">
                        {med.dosage} • {med.frequency} • {med.duration}
                      </p>
                    </div>
                  ))}
                </div>
                {prescription.medications?.length > 4 && (
                  <p className="text-sm text-gray-500 mt-2">
                    +{prescription.medications.length - 4} more medication
                    {prescription.medications.length - 4 !== 1 ? "s" : ""}
                  </p>
                )}
              </div>

              {prescription.notes && (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h5 className="font-semibold text-gray-900 mb-2">
                    Doctor's Notes
                  </h5>
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                    {prescription.notes.length > 150
                      ? `${prescription.notes.substring(0, 150)}...`
                      : prescription.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
