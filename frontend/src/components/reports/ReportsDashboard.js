import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { reportsAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  BarChart3, 
  Users, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';

// Simple Chart Components (using CSS for basic visualization)
const BarChart = ({ data, title, color = 'bg-primary-500' }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(item => item.value));
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-gray-600 truncate">{item.label}</div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-4 relative">
                <div 
                  className={`${color} h-4 rounded-full transition-all duration-500`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-sm font-medium text-right">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const LineChart = ({ data, title }) => {
  if (!data || data.length === 0) return null;
  
  const maxValue = Math.max(...data.map(item => item.count));
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="h-48 flex items-end justify-between space-x-2">
        {data.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="bg-primary-500 rounded-t-md w-full transition-all duration-500"
              style={{ height: `${(item.count / maxValue) * 100}%` }}
            ></div>
            <div className="text-xs text-gray-600 mt-2 transform -rotate-45 origin-left">
              {item._id}
            </div>
            <div className="text-xs font-medium">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color = 'text-primary-600', bgColor = 'bg-primary-100' }) => (
  <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`${bgColor} ${color} p-3 rounded-lg`}>
        <Icon size={24} />
      </div>
    </div>
  </div>
);

const ReportsDashboard = () => {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await reportsAPI.getDashboardStats();
      setDashboardData(response.data.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 pt-20 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8 pt-20 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm font-medium flex items-center justify-center gap-2 mx-auto"
          >
            <RefreshCw size={16} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { overview, appointmentsByStatus, dailyAppointments } = dashboardData || {};

  // Prepare chart data
  const statusChartData = appointmentsByStatus?.map(item => ({
    label: item._id,
    value: item.count
  })) || [];

  return (
    <div className="p-6 lg:p-8 pt-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-primary-600" />
            Reports Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Comprehensive analytics and reporting for your clinic</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm font-medium flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Patients"
          value={overview?.totalPatients || 0}
          icon={Users}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Total Appointments"
          value={overview?.totalAppointments || 0}
          icon={Calendar}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          title="Total Prescriptions"
          value={overview?.totalPrescriptions || 0}
          icon={FileText}
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <StatCard
          title="Active Doctors"
          value={overview?.totalDoctors || 0}
          icon={Activity}
          color="text-orange-600"
          bgColor="bg-orange-100"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary-600" />
            Today's Activity
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Appointments Today</span>
              <span className="font-semibold">{overview?.todayAppointments || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            This Week
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Appointments</span>
              <span className="font-semibold">{overview?.weekAppointments || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            This Month
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">New Patients</span>
              <span className="font-semibold">{overview?.monthPatients || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Appointments</span>
              <span className="font-semibold">{overview?.monthAppointments || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <BarChart
          data={statusChartData}
          title="Appointments by Status"
          color="bg-primary-500"
        />
        <LineChart
          data={dailyAppointments}
          title="Daily Appointments (Last 7 Days)"
        />
      </div>

      {/* Report Links */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary-600" />
          Detailed Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/reports/appointments"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold group-hover:text-primary-600">Appointments</h3>
            </div>
            <p className="text-gray-600 text-sm">Detailed appointment analytics and reports</p>
            <div className="flex items-center gap-1 mt-3 text-primary-600 text-sm">
              <span>View Report</span>
              <Download size={14} />
            </div>
          </Link>

          <Link
            to="/reports/patients"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold group-hover:text-blue-600">Patients</h3>
            </div>
            <p className="text-gray-600 text-sm">Patient demographics and statistics</p>
            <div className="flex items-center gap-1 mt-3 text-blue-600 text-sm">
              <span>View Report</span>
              <Download size={14} />
            </div>
          </Link>

          <Link
            to="/reports/prescriptions"
            className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold group-hover:text-purple-600">Prescriptions</h3>
            </div>
            <p className="text-gray-600 text-sm">Prescription trends and medication analysis</p>
            <div className="flex items-center gap-1 mt-3 text-purple-600 text-sm">
              <span>View Report</span>
              <Download size={14} />
            </div>
          </Link>

          {user?.role === 'clinic_admin' && (
            <Link
              to="/reports/revenue"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold group-hover:text-green-600">Revenue</h3>
              </div>
              <p className="text-gray-600 text-sm">Financial reports and revenue analytics</p>
              <div className="flex items-center gap-1 mt-3 text-green-600 text-sm">
                <span>View Report</span>
                <Download size={14} />
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsDashboard;
