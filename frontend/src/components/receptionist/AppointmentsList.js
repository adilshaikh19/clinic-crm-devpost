import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { appointmentAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { PlusCircle, Trash2, User, Search } from 'lucide-react';

const AppointmentsList = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateMessage, setUpdateMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await appointmentAPI.getAppointments();
      setAppointments(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setUpdateMessage("");
      setLoading(true);
      await appointmentAPI.updateAppointment(appointmentId, { status: newStatus });
      if (newStatus === "registered") {
        setUpdateMessage("Patient registered successfully!");
      } else {
        setUpdateMessage("Appointment status updated successfully!");
      }
      
      // Refresh appointments list to show updated data
      await fetchAppointments();
    } catch (err) {
      console.error("Error updating appointment status:", err);
      setUpdateMessage(err.response?.data?.message || "Failed to update appointment status");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        setUpdateMessage("");
        await appointmentAPI.deleteAppointment(appointmentId);
        setUpdateMessage("Appointment deleted successfully!");
        fetchAppointments();
      } catch (err) {
        setUpdateMessage(err.response?.data?.message || "Failed to delete appointment");
      }
    }
  };

  const getNewAppointmentLink = () => {
    if (user?.role === "clinic_admin") return "/admin/appointments/new";
    if (user?.role === "doctor") return "/doctor/appointments/new";
    return "/receptionist/appointments/new";
  };

  const StatusBadge = ({ status }) => {
    const statusColors = {
      scheduled: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-purple-100 text-purple-800',
      registered: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const filteredAppointments = appointments.filter(a => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      a.patientId?.name.toLowerCase().includes(searchTermLower) ||
      a.doctorId?.name.toLowerCase().includes(searchTermLower) ||
      a.status.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <div className="p-6 lg:p-8 pt-20 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Appointments</h1>
        <Link
          to={getNewAppointmentLink()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-semibold shadow-sm"
        >
          <PlusCircle size={20} />
          New Appointment
        </Link>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by patient, doctor, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="text-gray-400" size={20}/>
          </div>
        </div>
      </div>

      {loading && <div className="text-center text-gray-600">Loading appointments...</div>}
      {error && <div className="text-center text-red-600 mb-4">{error}</div>}
      {updateMessage && (
        <div className={`mb-4 p-3 rounded-lg ${updateMessage.includes("successfully") ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
          {updateMessage}
        </div>
      )}

      {!loading && !error && (
        <div className="bg-white shadow-md rounded-2xl overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((a) => (
                <tr key={a._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                            <span className="font-semibold">
                                {a.patientId?.name?.charAt(0)?.toUpperCase() || a.name?.charAt(0)?.toUpperCase() || 'N'}
                            </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{a.patientId?.name || a.name || "N/A"}</div>
                        {!a.patientId && a.name && (
                          <div className="text-xs text-gray-500">(Unregistered)</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{a.doctorId?.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{new Date(a.date).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">{a.time}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={a.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                        {a.status === "scheduled" && !a.patientId && a.name && (
                        <button
                            onClick={() => handleStatusChange(a._id, "registered")}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-md text-xs hover:bg-green-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <User size={14}/>
                            {loading ? 'Registering...' : 'Register Patient'}
                        </button>
                        )}
                        <button
                        onClick={() => handleDeleteAppointment(a._id)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition-colors font-semibold"
                        >
                        <Trash2 size={14}/>
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <div className="text-gray-400 text-6xl mb-4">📅</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
                    <p className="text-gray-600">Try adjusting your search or schedule a new appointment.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentsList;