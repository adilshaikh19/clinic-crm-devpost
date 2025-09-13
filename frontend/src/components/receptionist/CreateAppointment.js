import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { appointmentAPI, userAPI, patientAPI } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { 
  User, 
  Phone, 
  Calendar as CalendarIcon, 
  Clock, 
  Stethoscope, 
  MapPin, 
  FileText,
  Save,
  X
} from "lucide-react";

const CreateAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const selectedPatientId = searchParams.get("patientId");

  const [doctors, setDoctors] = useState([]);
  const [prefilledFromPatient, setPrefilledFromPatient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(!!selectedPatientId);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    doctorId: "",
    date: "",
    time: "",
    notes: "",
  });

  useEffect(() => {
    // Load doctors regardless
    loadDoctors();
  }, []);

  useEffect(() => {
    // If we came from Patient Detail with patientId in query, prefill
    if (!selectedPatientId) return;

    const prefillFromPatient = async () => {
      try {
        setInitializing(true);
        setError("");
        const res = await patientAPI.getPatient(selectedPatientId);
        const p = res.data?.data;
        if (p) {
          setForm((prev) => ({
            ...prev,
            name: p.name || "",
            phone: p.phone || "",
            dateOfBirth: p.dateOfBirth
              ? new Date(p.dateOfBirth).toISOString().slice(0, 10)
              : "",
            gender: p.gender || prev.gender,
            address: {
              street: p.address?.street || "",
              city: p.address?.city || "",
              state: p.address?.state || "",
              zipCode: p.address?.zipCode || "",
              country: p.address?.country || "",
            },
            doctorId:
              p.assignedDoctorId?._id ||
              p.assignedDoctorId ||
              prev.doctorId ||
              "",
          }));
          setPrefilledFromPatient(true);
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
            "Failed to load patient details for prefill"
        );
      } finally {
        setInitializing(false);
      }
    };

    prefillFromPatient();
  }, [selectedPatientId]);

  const loadDoctors = async () => {
    try {
      setError("");
      const usersRes = await userAPI.getUsers();
      const doctorsOnly = (usersRes.data.data || []).filter(
        (u) => u.role === "doctor"
      );
      setDoctors(doctorsOnly);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load doctors");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      // If booking for existing patient, send patientId and skip patient fields validation
      const isExistingPatient = !!selectedPatientId;

      if (!isExistingPatient) {
        // Backend requires at least name, phone, dateOfBirth, gender when patientId is not provided
        if (!form.name) {
          setError(
            "Patient Name is required."
          );
          setLoading(false);
          return;
        }
      }

      const payload = isExistingPatient
        ? {
            patientId: selectedPatientId,
            doctorId: form.doctorId,
            date: form.date,
            time: form.time,
            notes: form.notes,
          }
        : form;

      await appointmentAPI.createAppointment(payload);
      if (user?.role === "clinic_admin") navigate("/admin/appointments");
      else if (user?.role === "doctor") navigate("/doctor/appointments");
      else navigate("/receptionist/appointments");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  const pageTitle = selectedPatientId
    ? "Book Appointment for Patient"
    : "New Appointment";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 px-6 py-8">
        <div className="w-full">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-3">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4h3a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2h3z" />
                </svg>
                Appointment Management
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
              <p className="text-gray-600 mt-1">
                {selectedPatientId
                  ? "Patient details are pre-filled from the patient record"
                  : "Create a new appointment with patient and scheduling details"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full px-6 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {error && (
            <div className="p-6 pb-0">
              <div className="p-4 rounded-lg flex items-start gap-3 bg-red-50 text-red-800 border border-red-200">
                <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Patient Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <User size={20} className="text-primary-600" />
                Patient Information
                {prefilledFromPatient && (
                  <span className="text-sm font-normal text-primary-600 bg-primary-50 px-2 py-1 rounded-full">
                    Pre-filled from patient record
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      readOnly={prefilledFromPatient}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors ${
                        prefilledFromPatient ? "bg-gray-50 text-gray-600" : "border-gray-300"
                      }`}
                      placeholder="Enter full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      readOnly={prefilledFromPatient}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors ${
                        prefilledFromPatient ? "bg-gray-50 text-gray-600" : "border-gray-300"
                      }`}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      readOnly={prefilledFromPatient}
                      className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors ${
                        prefilledFromPatient ? "bg-gray-50 text-gray-600" : "border-gray-300"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    disabled={prefilledFromPatient}
                    className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors appearance-none bg-white ${
                      prefilledFromPatient ? "bg-gray-50 text-gray-600" : "border-gray-300"
                    }`}
                  >
                    <option value="male">👨 Male</option>
                    <option value="female">👩 Female</option>
                    <option value="other">⚧ Other</option>
                  </select>
                </div>
              </div>

              {/* Address */}
              <div className="mt-8">
                <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin size={18} className="text-primary-600" />
                  Address Information
                </h4>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="address.street"
                        value={form.address.street}
                        onChange={handleChange}
                        readOnly={prefilledFromPatient}
                        className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors ${
                          prefilledFromPatient ? "bg-gray-50 text-gray-600" : "border-gray-300"
                        }`}
                        placeholder="Enter street address"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="address.city"
                      value={form.address.city}
                      onChange={handleChange}
                      readOnly={prefilledFromPatient}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors ${
                        prefilledFromPatient ? "bg-gray-50 text-gray-600" : "border-gray-300"
                      }`}
                      placeholder="Enter city"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="address.state"
                      value={form.address.state}
                      onChange={handleChange}
                      readOnly={prefilledFromPatient}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors ${
                        prefilledFromPatient ? "bg-gray-50 text-gray-600" : "border-gray-300"
                      }`}
                      placeholder="Enter state"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      name="address.zipCode"
                      value={form.address.zipCode}
                      onChange={handleChange}
                      readOnly={prefilledFromPatient}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors ${
                        prefilledFromPatient ? "bg-gray-50 text-gray-600" : "border-gray-300"
                      }`}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      name="address.country"
                      value={form.address.country}
                      onChange={handleChange}
                      readOnly={prefilledFromPatient}
                      className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors ${
                        prefilledFromPatient ? "bg-gray-50 text-gray-600" : "border-gray-300"
                      }`}
                      placeholder="Enter country"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Appointment Details */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <CalendarIcon size={20} className="text-primary-600" />
                Appointment Details
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Doctor *
                  </label>
                  <div className="relative">
                    <Stethoscope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <select
                      name="doctorId"
                      value={form.doctorId}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors appearance-none bg-white"
                    >
                      <option value="">Select doctor</option>
                      {doctors.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name} {d.specialization ? `(${d.specialization})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Date *
                  </label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="time"
                      name="time"
                      value={form.time}
                      onChange={handleChange}
                      required
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors resize-none"
                    rows={4}
                    placeholder="Any additional notes or special requirements for the appointment..."
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-200">
              <div className="text-sm text-gray-500 mb-4 sm:mb-0">
                All fields marked with * are required
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-2 font-medium"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button
                  type="submit"
                  disabled={loading || initializing}
                  className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                >
                  {loading ? (
                    <>
                      <Save className="h-4 w-4 animate-spin" />
                      <span>Creating Appointment...</span>
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      <span>Create Appointment</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;
