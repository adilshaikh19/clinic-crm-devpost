import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFileText, 
  FiEye, 
  FiPrinter, 
  FiSearch, 
  FiCalendar,
  FiPlus,
  FiClock
} from 'react-icons/fi';
import { prescriptionAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../shared/LoadingSpinner';

const PrescriptionsList = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await prescriptionAPI.getPrescriptions();
      setPrescriptions(response.data.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to load prescriptions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      year: 'numeric',
      month: 'short', 
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = prescription.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prescription.medications?.some(med => 
                           med.name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const prescriptionDate = new Date(prescription.createdAt);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      switch (dateFilter) {
        case 'today':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          matchesDate = prescriptionDate >= today && prescriptionDate < tomorrow;
          break;
        case 'week':
          const weekAgo = new Date(today);
          weekAgo.setDate(weekAgo.getDate() - 7);
          matchesDate = prescriptionDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(today);
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          matchesDate = prescriptionDate >= monthAgo;
          break;
        default:
          matchesDate = true;
      }
    }
    
    return matchesSearch && matchesDate;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user?.role === 'clinic_admin' ? 'All Prescriptions' : 'My Prescriptions'}
              </h1>
              <p className="text-gray-600">
                {user?.role === 'clinic_admin' 
                  ? 'Manage all clinic prescriptions' 
                  : 'Manage prescriptions you\'ve created'
                }
              </p>
            </div>
            <Link
              to={user?.role === 'clinic_admin' ? '/admin/prescriptions/new' : '/doctor/prescriptions/new'}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              New Prescription
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient or medication..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-center bg-gray-50 rounded-lg px-4 py-2">
              <span className="text-sm text-gray-600">
                {filteredPrescriptions.length} prescription{filteredPrescriptions.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <FiFileText className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Prescriptions List */}
        <div className="space-y-6">
          {filteredPrescriptions.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 text-center py-12">
              <FiFileText className="text-6xl text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No prescriptions found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || dateFilter !== 'all' 
                  ? 'Try adjusting your filters to see more prescriptions.'
                  : 'You haven\'t created any prescriptions yet.'}
              </p>
              <Link
                to={user?.role === 'clinic_admin' ? '/admin/prescriptions/new' : '/doctor/prescriptions/new'}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <FiPlus className="mr-2" />
                Create First Prescription
              </Link>
            </div>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <div key={prescription._id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <FiFileText className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {prescription.patient?.name || 'Unknown Patient'}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {prescription.patient?.patientId || 'N/A'}
                        </span>
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
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      to={user?.role === 'clinic_admin' 
                        ? `/admin/prescriptions/${prescription._id}` 
                        : `/doctor/prescriptions/${prescription._id}`
                      } 
                      className="flex items-center px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <FiEye className="mr-1" />
                      View
                    </Link>
                    <Link
                      to={user?.role === 'clinic_admin' 
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
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <FiFileText className="mr-2" />
                    Medications ({prescription.medications?.length || 0})
                  </h4>
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
                      +{prescription.medications.length - 4} more medication{prescription.medications.length - 4 !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>

                {prescription.notes && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Doctor's Notes</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                      {prescription.notes.length > 150 
                        ? `${prescription.notes.substring(0, 150)}...` 
                        : prescription.notes}
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionsList;