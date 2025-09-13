import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authAPI } from "../../services/api";
import { Stethoscope, Mail, Lock, Hash } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    clinicId: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(formData);
      const { user } = response.data.data;
      login(user);

      // Redirect based on role
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
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Login failed";
      setError(errorMessage);
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
                <Stethoscope className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-blue-100">Clinic ERP</p>
                <h1 className="text-2xl font-bold leading-tight">
                  Healthcare Management
                </h1>
              </div>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight mb-4">
              Welcome back
            </h2>
            <p className="text-blue-100 text-lg mb-8">
              Sign in to manage appointments, prescriptions, patients, and staff
              seamlessly.
            </p>

            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>{" "}
                Secure, role-based access
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>{" "}
                Streamlined clinic workflows
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span> Fast
                prescription printing
              </li>
            </ul>
          </div>

          {/* Right: Login Card */}
          <div className="flex items-center justify-center">
            <div className="w-full max-w-md bg-white border border-gray-100 shadow-xl rounded-2xl p-8">
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 mb-3">
                  <Stethoscope className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
                <p className="text-gray-500 text-sm">
                  Access your clinic management system
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="w-full pl-10 input-field"
                      placeholder="you@clinic.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      className="w-full pl-10 input-field"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </div>
                </div>

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
                      className="w-full pl-10 input-field"
                      placeholder="yourclinic123"
                      value={formData.clinicId}
                      onChange={handleChange}
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Use the unique ID created when registering your clinic
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Sign in"}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-primary-600 hover:text-primary-500 text-sm"
                  >
                    Don't have a clinic account? Register here
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

export default Login;
