import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiUsers, 
  FiCalendar, 
  FiFileText, 
  FiTrendingUp, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiActivity,
  FiEye,
} from 'react-icons/fi';
import { userAPI } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const DoctorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await userAPI.getDoctorDashboardStats();
        setStats(response.data.data);
      } catch (error) {
        setError('Could not fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FiXCircle className="text-6xl text-red-500 mx-auto mb-4" />
          <p className="text-red-500 text-lg">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's your practice overview.</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Patients */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPatients}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FiUsers className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          {/* Today's Appointments */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900">{stats.todaysAppointments}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <FiCalendar className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Prescriptions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPrescriptions}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <FiFileText className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.completionRate}%</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <FiTrendingUp className="text-2xl text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FiClock className="text-xl text-orange-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">This Week</p>
                <p className="text-xl font-semibold">{stats.thisWeekAppointments} appointments</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FiCheckCircle className="text-xl text-green-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-semibold">{stats.completedAppointments} appointments</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <FiActivity className="text-xl text-blue-500 mr-3" />
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-xl font-semibold">{stats.thisMonthPrescriptions} prescriptions</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Appointments */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Upcoming Appointments</h2>
                <Link 
                  to="/doctor/appointments" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  <FiEye className="mr-1" />
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {stats.upcomingAppointments && stats.upcomingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {stats.upcomingAppointments.map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <FiUsers className="text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.patientId ? appointment.patientId.name : appointment.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {formatDate(appointment.date)} at {formatTime(appointment.time)}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiCalendar className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No upcoming appointments</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Recent Patients</h2>
                <Link 
                  to="/doctor/patients" 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
                >
                  <FiEye className="mr-1" />
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              {stats.recentPatients && stats.recentPatients.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentPatients.slice(0, 5).map((appointment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <FiUsers className="text-green-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {appointment.patientId ? appointment.patientId.name : appointment.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Last visit: {formatDate(appointment.date)}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Completed
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FiUsers className="text-4xl text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No recent patients</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/doctor/appointments" 
              className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FiCalendar className="text-2xl text-blue-600 mr-3" />
              <div>
                <p className="font-medium text-blue-900">View Appointments</p>
                <p className="text-sm text-blue-600">Manage your schedule</p>
              </div>
            </Link>

            <Link 
              to="/doctor/patients" 
              className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FiUsers className="text-2xl text-green-600 mr-3" />
              <div>
                <p className="font-medium text-green-900">View Patients</p>
                <p className="text-sm text-green-600">Patient records</p>
              </div>
            </Link>

            <Link 
              to="/doctor/prescriptions" 
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <FiFileText className="text-2xl text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-purple-900">Prescriptions</p>
                <p className="text-sm text-purple-600">Manage prescriptions</p>
              </div>
            </Link>

            <Link 
              to="/doctor/availability" 
              className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
            >
              <FiClock className="text-2xl text-orange-600 mr-3" />
              <div>
                <p className="font-medium text-orange-900">Availability</p>
                <p className="text-sm text-orange-600">Set your schedule</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Performance Metrics */}
        {stats.appointmentStatusStats && stats.appointmentStatusStats.length > 0 && (
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Appointment Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.appointmentStatusStats.map((stat, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                  <p className="text-sm text-gray-600 capitalize">{stat._id}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;