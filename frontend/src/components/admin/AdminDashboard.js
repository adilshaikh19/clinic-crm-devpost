import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { userAPI, patientAPI, appointmentAPI } from "../../services/api";
import {
  Users,
  Calendar,
  Clock,
  PlusCircle,
  LineChart,
  UserPlus,
  Activity,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStaff: 0,
    totalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [usersResponse, patientsResponse, appointmentsResponse] =
        await Promise.all([
          userAPI.getUsers().catch(() => ({ data: { data: [] } })),
          patientAPI.getPatients().catch(() => ({ data: { data: [] } })),
          appointmentAPI
            .getAppointments()
            .catch(() => ({ data: { data: [] } })),
        ]);

      const users = usersResponse.data?.data || [];
      const patients = patientsResponse.data?.data || [];
      const appointments = appointmentsResponse.data?.data || [];

      const today = new Date().toDateString();
      const todayAppointments = appointments.filter(
        (apt) => new Date(apt.appointmentDate).toDateString() === today
      ).length;

      setStats({
        totalStaff: users.length,
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        todayAppointments,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon }) => (
    <div className="rounded-2xl p-5 bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="mt-1 text-2xl font-extrabold text-gray-900">
            {loading ? "…" : value}
          </p>
        </div>
        <div className="h-11 w-11 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
          {icon}
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ label, icon, onClick }) => (
    <button
      onClick={onClick}
      className="group rounded-xl p-4 bg-white border border-gray-100 shadow-sm hover:shadow-md text-left flex items-center gap-3 transition"
    >
      <div className="h-10 w-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
        {icon}
      </div>
      <span className="font-semibold text-gray-900 group-hover:text-primary-700">
        {label}
      </span>
    </button>
  );

  return (
    <div className="p-6 lg:p-8 pt-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-medium ring-1 ring-primary-100">
          <Activity size={14} /> Admin Overview
        </div>
        <h1 className="mt-3 text-3xl sm:text-4xl font-extrabold text-gray-900">
          Welcome, {user?.name}
        </h1>
        <p className="mt-1 text-gray-600">
          Here’s what’s happening across your clinic.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Staff"
          value={stats.totalStaff}
          icon={<Users size={20} />}
        />
        <StatCard
          title="Total Patients"
          value={stats.totalPatients}
          icon={<Users size={20} />}
        />
        <StatCard
          title="Total Appointments"
          value={stats.totalAppointments}
          icon={<Calendar size={20} />}
        />
        <StatCard
          title="Today’s Appointments"
          value={stats.todayAppointments}
          icon={<Clock size={20} />}
        />
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <QuickAction
            label="Add New Staff"
            icon={<PlusCircle size={18} />}
            onClick={() => (window.location.href = "/admin/users/create")}
          />
          <QuickAction
            label="Manage Patients"
            icon={<Users size={18} />}
            onClick={() => (window.location.href = "/admin/patients")}
          />
          <QuickAction
            label="View Reports"
            icon={<LineChart size={18} />}
            onClick={() => (window.location.href = "/admin/reports")}
          />
          <QuickAction
            label="Doctor Availability"
            icon={<Calendar size={18} />}
            onClick={() => (window.location.href = "/admin/doctor-availability")}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
            <UserPlus size={18} className="text-primary-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                New staff member added: Dr. Smith
              </p>
              <p className="text-xs text-gray-600">2 hours ago</p>
            </div>
          </div>
          <div className="text-center py-8 text-gray-500 text-sm">
            More recent activities will appear here
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
