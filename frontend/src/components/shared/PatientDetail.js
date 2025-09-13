import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { patientAPI, appointmentAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import CreatePrescription from "../doctor/CreatePrescription";
import PatientPrescriptions from "./PatientPrescriptions";
import PatientPayments from "./PatientPayments";
import {
  User as UserIcon,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  Droplet,
  Pill,
  ClipboardList,
  Edit,
  PlusCircle,
  ArrowLeft,
  Stethoscope,
  User,
  Home,
  Users,
  Activity,
  AlertCircle,
  Clock,
  FileText,
  DollarSign,
} from "lucide-react";
import { FaUserCircle } from "react-icons/fa";

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  const fetchPatient = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await patientAPI.getPatient(id);
      const p = response.data.data;
      setPatient(p);

      // Load appointments for this patient
      try {
        const allAppts = await appointmentAPI.getAppointments();
        const filtered = (allAppts.data?.data || []).filter(
          (a) =>
            a.patientId && (a.patientId._id === p._id || a.patientId === p._id)
        );
        setAppointments(filtered);
      } catch (apErr) {
        console.error("Error fetching appointments for patient:", apErr);
      }
    } catch (error) {
      console.error("Error fetching patient:", error);
      setError(
        error.response?.data?.message || "Failed to load patient details"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchPatient();
    }
  }, [id, fetchPatient]);


  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm font-medium flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>
      </div>
    );
  }

  if (!patient) {
    return <div className="text-center py-12">Patient not found.</div>;
  }

  const basePath = user.role === "clinic_admin" ? "/admin" : `/${user.role}`;

  return (
    <div className="p-4 md:p-8 pt-20 bg-gradient-to-b from-blue-50 to-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center space-x-5 mb-4 md:mb-0">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-4 ring-white">
                {patient.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                <FaUserCircle className="text-white" size={14} />
              </div>
            </div>
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-gray-900 mr-3">
                  {patient.name}
                </h1>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <Activity size={12} className="mr-1" />
                  Active
                </span>
              </div>
              <div className="flex items-center mt-1 text-gray-600">
                <span className="mr-4 flex items-center">
                  <FileText size={14} className="mr-1 text-gray-500" /> 
                  ID: {patient.patientId}
                </span>
                <span className="flex items-center">
                  <Clock size={14} className="mr-1 text-gray-500" /> 
                  Registered: {new Date(patient.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-sm"
            >
              <ArrowLeft size={18} className="mr-2" /> Back
            </button>
            <Link
              to={`${basePath}/patients/${patient._id}/edit`}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm"
            >
              <Edit size={18} className="mr-2" /> Edit Patient
            </Link>
            <Link
              to={`${basePath}/appointments/new?patientId=${patient._id}`}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-sm"
            >
              <CalendarIcon size={18} className="mr-2" /> Book Appointment
            </Link>
            {(user.role === "doctor" || user.role === "clinic_admin") && (
              <button
                onClick={() => setActiveTab("create-prescription")}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 shadow-sm"
              >
                <PlusCircle size={18} className="mr-2" /> Create Prescription
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex flex-wrap gap-2" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("details")}
              className={`${
                activeTab === "details"
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              } whitespace-nowrap py-2 px-4 rounded-lg border font-medium text-sm transition-all duration-200 flex items-center`}
            >
              <UserIcon size={16} className="mr-2" />
              Patient Details
            </button>
            <button
              onClick={() => setActiveTab("prescriptions")}
              className={`${
                activeTab === "prescriptions"
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              } whitespace-nowrap py-2 px-4 rounded-lg border font-medium text-sm transition-all duration-200 flex items-center`}
            >
              <Pill size={16} className="mr-2" />
              Prescriptions
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`${
                activeTab === "appointments"
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              } whitespace-nowrap py-2 px-4 rounded-lg border font-medium text-sm transition-all duration-200 flex items-center`}
            >
              <CalendarIcon size={16} className="mr-2" />
              Appointments
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`${
                activeTab === "payments"
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              } whitespace-nowrap py-2 px-4 rounded-lg border font-medium text-sm transition-all duration-200 flex items-center`}
            >
              <DollarSign size={16} className="mr-2" />
              Payments
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Personal Information Card */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center pb-2 border-b border-gray-100">
                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                  <UserIcon size={20} className="text-blue-600" />
                </div>
                Personal Information
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <Mail size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Email</p>
                    <p className="font-medium">{patient.email || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <Phone size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Phone</p>
                    <p className="font-medium">{patient.phone}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <CalendarIcon size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Date of Birth</p>
                    <p className="font-medium">
                      {formatDate(patient.dateOfBirth)}
                      <span className="ml-2 bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                        {calculateAge(patient.dateOfBirth)} years
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <User size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Gender</p>
                    <p className="font-medium capitalize">{patient.gender}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <Home size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Address</p>
                    <p className="font-medium">
                      {patient.address
                        ? `${patient.address.street}, ${patient.address.city}, ${patient.address.state} ${patient.address.zipCode}`
                        : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Information Card */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center pb-2 border-b border-gray-100">
                <div className="bg-green-100 p-2 rounded-lg mr-3">
                  <Stethoscope size={20} className="text-green-600" />
                </div>
                Medical Information
              </h3>
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <Users size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Assigned Doctor</p>
                    <p className="font-medium">{patient.assignedDoctor?.name || "N/A"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <Droplet size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Blood Type</p>
                    <p className="font-medium">
                      {patient.medicalHistory?.bloodType ? (
                        <span className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-medium">
                          {patient.medicalHistory.bloodType}
                        </span>
                      ) : "N/A"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <AlertCircle size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Allergies</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.medicalHistory?.allergies?.length ? (
                        patient.medicalHistory.allergies.map((allergy, index) => (
                          <span key={index} className="bg-yellow-50 text-yellow-700 text-xs px-2 py-0.5 rounded">
                            {allergy}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <ClipboardList size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Chronic Conditions</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.medicalHistory?.chronicConditions?.length ? (
                        patient.medicalHistory.chronicConditions.map((condition, index) => (
                          <span key={index} className="bg-purple-50 text-purple-700 text-xs px-2 py-0.5 rounded">
                            {condition}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3">
                    <Pill size={16} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Medications</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {patient.medicalHistory?.currentMedications?.length ? (
                        patient.medicalHistory.currentMedications.map((medication, index) => (
                          <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded">
                            {medication}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">None</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact Card */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center pb-2 border-b border-gray-100">
                <div className="bg-orange-100 p-2 rounded-lg mr-3">
                  <Phone size={20} className="text-orange-600" />
                </div>
                Emergency Contact
              </h3>
              <div className="space-y-4 text-gray-700">
                {patient.emergencyContact ? (
                  <>
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <User size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Name</p>
                        <p className="font-medium">{patient.emergencyContact.name || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <Users size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Relationship</p>
                        <p className="font-medium">{patient.emergencyContact.relationship || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-gray-100 p-2 rounded-lg mr-3">
                        <Phone size={16} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Phone</p>
                        <p className="font-medium">{patient.emergencyContact.phone || "N/A"}</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-32 text-gray-500">
                    <p>No emergency contact information available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "prescriptions" && (
          <PatientPrescriptions patientId={patient._id} />
        )}

        {activeTab === "appointments" && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center pb-2 border-b border-gray-100">
              <div className="bg-purple-100 p-2 rounded-lg mr-3">
                <CalendarIcon size={20} className="text-purple-600" />
              </div>
              Appointment History
            </h3>
            
            {appointments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <CalendarIcon size={40} className="text-gray-300 mb-3" />
                <p>No appointments found for this patient.</p>
                <Link
                  to={`${basePath}/appointments/new?patientId=${patient._id}`}
                  className="mt-4 flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-all duration-200"
                >
                  <PlusCircle size={16} className="mr-2" /> Schedule New Appointment
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="px-4 py-3 rounded-l-lg">Date</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Doctor</th>
                      <th className="px-4 py-3 rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {appointments.map((a) => (
                      <tr key={a._id} className="text-sm hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          {new Date(a.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">{a.time}</td>
                        <td className="px-4 py-3">{a.doctorId?.name || "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${a.status === 'completed' ? 'bg-green-100 text-green-800' : ''}
                            ${a.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : ''}
                            ${a.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                            ${a.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          `}>
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "payments" && (
          <PatientPayments patientId={patient._id} />
        )}

        {activeTab === "create-prescription" && (user.role === "doctor" || user.role === "clinic_admin") && (
          <CreatePrescription patientId={patient._id} />
        )}
      </div>
    </div>
  );
};

export default PatientDetail;
