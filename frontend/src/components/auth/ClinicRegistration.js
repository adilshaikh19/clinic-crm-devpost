import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  Stethoscope,
  Building2,
  Mail,
  Lock,
  User,
  MapPin,
  Phone,
  Hash,
} from "lucide-react";

const ClinicRegistration = () => {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    clinicId: "",
    clinicName: "",
    address: "",
    contactInfo: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");
  const [clinicIdStatus, setClinicIdStatus] = useState({
    checking: false,
    available: null,
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "clinicId") {
      checkClinicIdAvailability(value);
    }
  };

  const checkClinicIdAvailability = async (clinicId) => {
    if (!clinicId || clinicId.length < 3) {
      setClinicIdStatus({ checking: false, available: null, message: "" });
      return;
    }

    if (!/^[a-zA-Z0-9]+$/.test(clinicId)) {
      setClinicIdStatus({
        checking: false,
        available: false,
        message: "Clinic ID can only contain letters and numbers",
      });
      return;
    }

    setClinicIdStatus({
      checking: true,
      available: null,
      message: "Checking availability...",
    });

    try {
      const response = await authAPI.checkClinicId(clinicId);
      setClinicIdStatus({
        checking: false,
        available: response.data.available,
        message: response.data.message,
      });
    } catch (error) {
      setClinicIdStatus({
        checking: false,
        available: false,
        message: "Error checking availability",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setSuccess("");

    try {
      const response = await authAPI.registerClinic(formData);
      const clinicId = response?.data?.data?.clinicId;

      if (clinicId) {
        const loginRes = await authAPI.login({
          email: formData.adminEmail,
          password: formData.adminPassword,
          clinicId,
        });
        const { user } = loginRes.data.data;
        setAuthUser(user);
        switch (user.role) {
          case "clinic_admin":
            navigate("/admin");
            break;
          case "doctor":
            navigate("/doctor");
            break;
          case "receptionist":
            navigate("/receptionist");
            break;
          default:
            navigate("/");
        }
        return;
      }

      setSuccess(
        "Clinic registered successfully! Please login with your credentials."
      );
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      const errorList = error.response?.data?.errors || [errorMessage];
      setErrors(errorList);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch min-h-[80vh]">
          {/* Left: Brand/Hero */}
          <div className="hidden lg:flex flex-col justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-white/10 rounded-full blur-2xl" />

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
                <Building2 className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-blue-100">Clinic ERP</p>
                <h1 className="text-2xl font-bold leading-tight">
                  Register your clinic
                </h1>
              </div>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Start your digital transformation
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Manage patients, appointments, prescriptions, billing, and staff
              with an integrated platform.
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>{" "}
                HIPAA-inspired privacy practices
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>{" "}
                Role-based access control
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Fast
                onboarding for staff
              </li>
            </ul>
          </div>

          {/* Right: Registration Card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md bg-white border border-gray-100 shadow-xl rounded-2xl p-8">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-3">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Register Clinic
                </h2>
                <p className="text-gray-500 text-sm">
                  Create an account to start managing your clinic
                </p>
              </div>

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <ul className="text-sm text-red-700 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm text-green-700">
                  {success}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="clinicId"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Clinic ID
                  </label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="clinicId"
                      name="clinicId"
                      type="text"
                      required
                      placeholder="e.g., myclinic123"
                      className={`w-full pl-10 input-field ${
                        clinicIdStatus.available === false
                          ? "border-red-500"
                          : clinicIdStatus.available === true
                          ? "border-green-500"
                          : ""
                      }`}
                      value={formData.clinicId}
                      onChange={handleChange}
                      minLength={3}
                      maxLength={20}
                      pattern="[a-zA-Z0-9]+"
                      title="Clinic ID can only contain letters and numbers (3-20 characters)"
                    />
                  </div>
                  {clinicIdStatus.message && (
                    <p
                      className={`mt-1 text-sm ${
                        clinicIdStatus.checking
                          ? "text-gray-500"
                          : clinicIdStatus.available === false
                          ? "text-red-600"
                          : clinicIdStatus.available === true
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {clinicIdStatus.message}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Unique identifier used by your staff to sign in (letters &
                    numbers, 3-20 chars)
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="clinicName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Clinic Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="clinicName"
                      name="clinicName"
                      type="text"
                      required
                      className="w-full pl-10 input-field"
                      value={formData.clinicName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <textarea
                      id="address"
                      name="address"
                      required
                      rows="3"
                      className="w-full pl-10 input-field"
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contactInfo"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Contact Information
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="contactInfo"
                      name="contactInfo"
                      type="text"
                      required
                      className="w-full pl-10 input-field"
                      value={formData.contactInfo}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="adminName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Admin Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="adminName"
                      name="adminName"
                      type="text"
                      required
                      className="w-full pl-10 input-field"
                      value={formData.adminName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="adminEmail"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Admin Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="adminEmail"
                      name="adminEmail"
                      type="email"
                      required
                      className="w-full pl-10 input-field"
                      value={formData.adminEmail}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="adminPassword"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Admin Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="adminPassword"
                      name="adminPassword"
                      type="password"
                      required
                      className="w-full pl-10 input-field"
                      value={formData.adminPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={
                    loading ||
                    clinicIdStatus.available === false ||
                    !formData.clinicId
                  }
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Register Clinic"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="text-primary-600 hover:text-primary-500 text-sm"
                  >
                    Already have an account? Login here
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicRegistration;
