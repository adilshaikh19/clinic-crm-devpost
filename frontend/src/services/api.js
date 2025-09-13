import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL ||
//   (process.env.NODE_ENV === 'production'
//     ? "https://clinicerp.onrender.com"
//     : "http://localhost:3001");

const API_BASE_URL = "https://clinicerp.onrender.com";

// Token management
const getToken = () => localStorage.getItem('authToken');
const setToken = (token) => localStorage.setItem('authToken', token);
const removeToken = () => localStorage.removeItem('authToken');

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Keep for backward compatibility
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 errors
      removeToken();
      // The AuthContext will handle the redirect to the login page
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  registerClinic: (data) => api.post('/auth/register-clinic', data),
  login: async (data) => {
    const response = await api.post('/auth/login', data);
    // Store token if login is successful
    if (response.data.success && response.data.data.token) {
      setToken(response.data.data.token);
    }
    return response;
  },
  logout: async () => {
    try {
      const response = await api.post('/auth/logout');
      // Clear token on logout
      removeToken();
      return response;
    } catch (error) {
      // Clear token even if logout request fails
      removeToken();
      throw error;
    }
  },
  getMe: () => api.get('/auth/me'),
  checkClinicId: (clinicId) => api.get(`/auth/check-clinic-id/${clinicId}`),
};

// Export token management functions for use in components
export { getToken, setToken, removeToken };

// User management API calls
export const userAPI = {
  createUser: (data) => api.post('/users', data),
  getUsers: () => api.get('/users'),
  getUser: (id) => api.get(`/users/${id}`),
  updateUser: (id, data) => api.put(`/users/${id}`, data), // Admin update
  updateProfile: (id, data) => api.put(`/users/profile/${id}`, data), // Self update
  updatePassword: (id, data) => api.put(`/users/password/${id}`, data),
  updateUserStatus: (id, isActive) => api.put(`/users/${id}/status`, { isActive }),
  getDoctorDashboardStats: () => api.get('/users/doctor/dashboard-stats'),
};

// Patient management API calls
export const patientAPI = {
  createPatient: (data) => api.post('/patients', data),
  getPatients: () => api.get('/patients'),
  getPatient: (id) => api.get(`/patients/${id}`),
  updatePatient: (id, data) => api.put(`/patients/${id}`, data),
  deletePatient: (id) => api.delete(`/patients/${id}`),
  getDoctors: () => api.get('/patients/doctors/list'),
  getPatientPrescriptions: (patientId) => api.get(`/patients/${patientId}/prescriptions`),
};

// Appointment management API calls
export const appointmentAPI = {
  createAppointment: (data) => api.post('/appointments', data),
  getAppointments: () => api.get('/appointments'),
  getAppointment: (id) => api.get(`/appointments/${id}`),
  updateAppointment: (id, data) => api.put(`/appointments/${id}`, data),
  deleteAppointment: (id) => api.delete(`/appointments/${id}`),
  getAppointmentsByDoctorAndDate: (doctorId, date) => api.get(`/appointments/doctor/${doctorId}/date/${date}`),
};

// Prescription management API calls
export const prescriptionAPI = {
  createPrescription: (data) => api.post('/prescriptions', data),
  getPrescriptions: () => api.get('/prescriptions'),
  getPatientPrescriptions: (patientId) => api.get(`/patients/${patientId}/prescriptions`),
  getPrescription: (id) => api.get(`/prescriptions/${id}`),
};

export const clinicAPI = {
  getClinic: () => api.get('/clinic'),
};

export const availabilityAPI = {
  setAvailability: (data) => api.post('/availability', data),
  getAvailability: (doctorId) => api.get(`/availability/doctor/${doctorId}`),
};

// Reports API calls
export const reportsAPI = {
  getDashboardStats: () => api.get('/reports/dashboard-stats'),
  getAppointmentsReport: (params) => api.get('/reports/appointments', { params }),
  getPatientsReport: (params) => api.get('/reports/patients', { params }),
  getPrescriptionsReport: (params) => api.get('/reports/prescriptions', { params }),
  getRevenueReport: (params) => api.get('/reports/revenue', { params }),
};

// Payment API calls
export const paymentAPI = {
  getPayments: (params) => api.get('/payments', { params }),
  getPatientPayments: (patientId) => api.get(`/payments/patient/${patientId}`),
  createPayment: (data) => api.post('/payments', data),
  getPayment: (id) => api.get(`/payments/${id}`),
  updatePayment: (id, data) => api.put(`/payments/${id}`, data),
  deletePayment: (id) => api.delete(`/payments/${id}`),
  getInvoice: (id) => api.get(`/payments/${id}/invoice`),
};

export default api;