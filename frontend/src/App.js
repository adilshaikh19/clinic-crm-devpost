import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { suppressResizeObserverError, handleResizeObserverError } from "./utils/resizeObserverFix";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import ErrorBoundary from "./components/shared/ErrorBoundary";
import DashboardLayout from "./components/shared/DashboardLayout";
import Login from "./components/auth/Login";
import ClinicRegistration from "./components/auth/ClinicRegistration";

// Admin Components
import AdminDashboard from "./components/admin/AdminDashboard";
import CreateUser from "./components/admin/CreateUser";
import StaffList from "./components/admin/StaffList";
import EditUser from "./components/admin/EditUser"; // Added this import

// Receptionist Components
import ReceptionistPatientList from "./components/receptionist/PatientList";
import ReceptionistPatientForm from "./components/receptionist/PatientForm";
import ReceptionistAppointmentsList from "./components/receptionist/AppointmentsList";
import ReceptionistCreateAppointment from "./components/receptionist/CreateAppointment";
import EditPatient from "./components/receptionist/EditPatient"; // Added this import


// Doctor Components
import DoctorPrescriptionsList from "./components/doctor/PrescriptionsList";
import AdminPrescriptionsTest from "./components/debug/AdminPrescriptionsTest";
import UserTest from "./components/debug/UserTest";
import CreatePrescriptionPage from "./components/doctor/CreatePrescriptionPage";
import ViewPrescription from "./components/doctor/ViewPrescription";
import DoctorDashboard from "./components/doctor/DoctorDashboard";
import DoctorAppointmentList from "./components/doctor/AppointmentList";
import Availability from "./components/doctor/Availability";

// Shared Components
import PatientDetail from "./components/shared/PatientDetail";
import ProfilePage from "./components/shared/ProfilePage"; // Import ProfilePage
import LandingPage from "./components/shared/LandingPage"; // Import LandingPage
import ReportsDashboard from "./components/reports/ReportsDashboard";
import Report from "./components/reports/Report";
import DoctorAvailability from "./components/shared/DoctorAvailability";


import { Activity, Calendar, Users2, CalendarDays, ArrowRight, Sparkles } from "lucide-react";

// Placeholder components for other dashboards

const ReceptionistDashboard = () => (
  <div className="p-8 pt-20 bg-gray-50 min-h-screen">
    {/* Header */}
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-2">
        <span className="px-2 py-1 bg-secondary-100 text-secondary-800 text-xs font-medium rounded-md">
          Receptionist Portal
        </span>
      </div>
      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
        <Activity className="h-8 w-8 text-secondary-600" /> 
        Receptionist Dashboard
      </h1>
      <p className="text-gray-600 mt-2 flex items-center gap-1">
        <Calendar className="h-4 w-4 text-secondary-500" />
        Manage patients and appointments efficiently
      </p>
    </div>
    
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
        <div className="p-3 rounded-full bg-primary-100 text-primary-600 shadow-sm inline-flex mb-4">
          <Users2 size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Patient Management
        </h3>
        <p className="text-gray-600 mb-4">
          Register new patients and manage existing records.
        </p>
        <a
          href="/receptionist/patients"
          className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
        >
          Manage Patients <ArrowRight size={16} />
        </a>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
        <div className="p-3 rounded-full bg-secondary-100 text-secondary-600 shadow-sm inline-flex mb-4">
          <CalendarDays size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Appointments</h3>
        <p className="text-gray-600 mb-4">
          Schedule and manage patient appointments.
        </p>
        <a
          href="/receptionist/appointments"
          className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
        >
          Manage Appointments <ArrowRight size={16} />
        </a>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
        <div className="p-3 rounded-full bg-purple-100 text-purple-600 shadow-sm inline-flex mb-4">
          <Sparkles size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Quick Actions
        </h3>
        <p className="text-gray-600 mb-4">
          Frequently used actions and shortcuts.
        </p>
        <a
          href="/receptionist/patients/new"
          className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
        >
          Add New Patient <ArrowRight size={16} />
        </a>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-all">
        <div className="p-3 rounded-full bg-blue-100 text-blue-600 shadow-sm inline-flex mb-4">
          <CalendarDays size={24} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Doctor Availability
        </h3>
        <p className="text-gray-600 mb-4">
          View doctor schedules and availability.
        </p>
        <a
          href="/receptionist/doctor-availability"
          className="text-primary-600 hover:text-primary-800 font-medium flex items-center gap-1"
        >
          View Availability <ArrowRight size={16} />
        </a>
      </div>
    </div>
  </div>
);

const Unauthorized = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-gray-900">Unauthorized</h1>
      <p className="mt-4 text-gray-600">
        You don't have permission to access this page.
      </p>
    </div>
  </div>
);

function App() {
  useEffect(() => {
    // Additional ResizeObserver error suppression at React level
    suppressResizeObserverError();
    handleResizeObserverError();
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<ClinicRegistration />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/debug" element={<UserTest />} />

            {/* Protected routes */}
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <AdminDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <StaffList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/users/create"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <CreateUser />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route // Added this route for EditUser
              path="/admin/users/edit/:id"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <EditUser />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/patients"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <ReceptionistPatientList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/patients/new"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <ReceptionistPatientForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/appointments"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <ReceptionistAppointmentsList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/appointments/new"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <ReceptionistCreateAppointment />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/doctor-availability"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <DoctorAvailability />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Admin Prescription Routes */}
            <Route
              path="/admin/prescriptions"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <AdminPrescriptionsTest />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/prescriptions/new"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <CreatePrescriptionPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/prescriptions/:id"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <ViewPrescription />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/patients/:patientId/prescriptions/new"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <CreatePrescriptionPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Doctor Routes */}
            <Route
              path="/doctor"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <DoctorDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/patients"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <ReceptionistPatientList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/patients/new"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <ReceptionistPatientForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/appointments"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <DoctorAppointmentList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/appointments/new"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <ReceptionistCreateAppointment />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/prescriptions"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <DoctorPrescriptionsList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/prescriptions/new"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <CreatePrescriptionPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/patients/:patientId/prescriptions/new"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <CreatePrescriptionPage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/prescriptions/:id"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <ViewPrescription />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/prescriptions/:id/print"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <ViewPrescription />
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/availability"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <Availability />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Reports Routes */}
            <Route
              path="/reports"
              element={
                <ProtectedRoute requiredRole={["clinic_admin", "doctor", "receptionist"]}>
                  <DashboardLayout>
                    <ReportsDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/reports/:reportType"
              element={
                <ProtectedRoute requiredRole={["clinic_admin", "doctor", "receptionist"]}>
                  <DashboardLayout>
                    <Report />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Receptionist Routes */}
            <Route
              path="/receptionist"
              element={
                <ProtectedRoute requiredRole="receptionist">
                  <DashboardLayout>
                    <ReceptionistDashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/receptionist/patients"
              element={
                <ProtectedRoute requiredRole="receptionist">
                  <DashboardLayout>
                    <ReceptionistPatientList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/receptionist/patients/new"
              element={
                <ProtectedRoute requiredRole="receptionist">
                  <DashboardLayout>
                    <ReceptionistPatientForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/receptionist/appointments"
              element={
                <ProtectedRoute requiredRole="receptionist">
                  <DashboardLayout>
                    <ReceptionistAppointmentsList />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/receptionist/appointments/new"
              element={
                <ProtectedRoute requiredRole="receptionist">
                  <DashboardLayout>
                    <ReceptionistCreateAppointment />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/receptionist/doctor-availability"
              element={
                <ProtectedRoute requiredRole="receptionist">
                  <DashboardLayout>
                    <DoctorAvailability />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/receptionist/patients/:id/edit"
              element={
                <ProtectedRoute requiredRole="receptionist">
                  <DashboardLayout>
                    <EditPatient />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/receptionist/patients/:id"
              element={
                <ProtectedRoute requiredRole="receptionist">
                  <DashboardLayout>
                    <PatientDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/patients/:id/edit"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <ReceptionistPatientForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/patients/:id"
              element={
                <ProtectedRoute requiredRole="clinic_admin">
                  <DashboardLayout>
                    <PatientDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/patients/:id/edit"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <ReceptionistPatientForm />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/doctor/patients/:id"
              element={
                <ProtectedRoute requiredRole="doctor">
                  <DashboardLayout>
                    <PatientDetail />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <ProfilePage />
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
