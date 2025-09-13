import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userAPI } from '../../services/api';
import { Users, UserPlus, Edit, UserCheck, UserX, Search, Filter, RefreshCw, Phone, Mail, Award, Activity } from 'lucide-react';

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await userAPI.getUsers();

      console.log('API Response:', response); // Debug log

      // Ensure we have an array
      const staffData = response?.data?.data || response?.data || [];
      console.log('Staff Data:', staffData); // Debug log
      if (Array.isArray(staffData)) {
        setStaff(staffData);
      } else {
        console.warn('API returned non-array data:', staffData);
        setStaff([]);
        setError('Invalid data format received from server');
      }
    } catch (error) {
      console.error('Error fetching staff:', error);
      setStaff([]); // Ensure staff is always an array
      setError(error.response?.data?.message || 'Failed to load staff members');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (userId) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  const handleChangeStatus = async (userId, newStatus) => {
    const action = newStatus ? 'activate' : 'deactivate';
    if (window.confirm(`Are you sure you want to ${action} this staff member?`)) {
      try {
        await userAPI.updateUserStatus(userId, newStatus);
        fetchStaff(); // Refresh the list after status change
        alert(`Staff member ${action}d successfully!`);
      } catch (error) {
        console.error(`Error ${action}ing staff member:`, error);
        alert(error.response?.data?.message || `Failed to ${action} staff member.`);
      }
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'doctor':
        return 'bg-primary-100 text-primary-800';
      case 'receptionist':
        return 'bg-secondary-100 text-secondary-800';
      case 'clinic_admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatRole = (role) => {
    return role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Ensure staff is always an array
  const safeStaff = Array.isArray(staff) ? staff : [];

  return (
    <div>
      {/* Header with modern design */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 p-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium mb-2">
            <Activity size={14} /> Staff Overview
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-2">
            Manage your clinic's staff members and their roles.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/admin/users/create"
            className="bg-primary-600 text-white px-5 py-2.5 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow"
          >
            <UserPlus size={18} />
            <span>Add New Staff</span>
          </Link>
          <button
            onClick={fetchStaff}
            className="border border-gray-200 bg-white text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 shadow-sm hover:shadow"
          >
            <RefreshCw size={18} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search staff members..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          />
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 flex items-center gap-2">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Staff List - Modern Card Design */}
      <div>
        {safeStaff.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-50 text-primary-600 mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No staff members yet</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">Get started by adding your first staff member to your clinic team.</p>
            <Link
              to="/admin/users/create"
              className="inline-flex items-center px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors gap-2 shadow-sm"
            >
              <UserPlus size={18} />
              Add First Staff Member
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {safeStaff.map((member) => (
              <div key={member._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-14 h-14 bg-primary-600 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-lg font-semibold">
                          {member.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {member.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(member.role)}`}>
                            {formatRole(member.role)}
                          </span>
                          <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full ${member.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {member.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} className="text-gray-400" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} className="text-gray-400" />
                      <span className="text-sm">{member.phone || 'No phone number'}</span>
                    </div>
                    {member.role === 'doctor' && (
                      <>
                        <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                          <Award size={16} className="text-gray-400" />
                          <div className="flex flex-wrap gap-2">
                            {member.specialization && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {member.specialization}
                              </span>
                            )}
                            {member.experience !== undefined && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                {member.experience} years exp.
                              </span>
                            )}
                          </div>
                        </div>
                        {member.licenseNumber && (
                          <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                            <span className="text-xs text-gray-500">License: {member.licenseNumber}</span>
                          </div>
                        )}
                        {member.qualifications && (
                          <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                            <span className="text-xs text-gray-500">Qualifications: {member.qualifications}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                    <button
                      className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-2"
                      onClick={() => handleEdit(member._id)}
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    {member.isActive ? (
                      <button
                        className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
                        onClick={() => handleChangeStatus(member._id, false)}
                      >
                        <UserX size={16} />
                        <span>Deactivate</span>
                      </button>
                    ) : (
                      <button
                        className="px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-2"
                        onClick={() => handleChangeStatus(member._id, true)}
                      >
                        <UserCheck size={16} />
                        <span>Activate</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats - Enhanced Modern Design */}
      {safeStaff.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Staff Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary-50 to-white rounded-2xl border border-primary-100 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-primary-100 text-primary-600 shadow-sm">
                  <Users size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-primary-700">Total Doctors</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {safeStaff.filter(s => s.role === 'doctor').length}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-primary-100">
                <p className="text-xs text-primary-600">
                  {Math.round((safeStaff.filter(s => s.role === 'doctor').length / safeStaff.length) * 100)}% of total staff
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-secondary-50 to-white rounded-2xl border border-secondary-100 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 shadow-sm">
                  <Users size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-secondary-700">Receptionists</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {safeStaff.filter(s => s.role === 'receptionist').length}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-secondary-100">
                <p className="text-xs text-secondary-600">
                  {Math.round((safeStaff.filter(s => s.role === 'receptionist').length / safeStaff.length) * 100)}% of total staff
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl border border-purple-100 shadow-sm p-6 hover:shadow-md transition-all">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 shadow-sm">
                  <Users size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-700">Total Staff</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {safeStaff.length}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-purple-100">
                <p className="text-xs text-purple-600">
                  {safeStaff.filter(s => s.isActive).length} active, {safeStaff.filter(s => !s.isActive).length} inactive
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffList;