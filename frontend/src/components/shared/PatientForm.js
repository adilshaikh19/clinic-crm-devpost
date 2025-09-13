import React, { useState, useEffect, useCallback } from 'react';
import { patientAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import {
  User,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Stethoscope,
  MapPin,
  Heart,
  PlusCircle,
  X,
} from "lucide-react";



const PatientForm = ({ patient = null, onSuccess, onCancel }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        gender: 'male',
        address: {
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: ''
        },
        emergencyContact: {
            name: '',
            relationship: '',
            phone: ''
        },
        medicalHistory: {
            allergies: [],
            chronicConditions: [],
            currentMedications: [],
            bloodType: '',
            notes: ''
        },
        assignedDoctorId: ''
    });

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user?.role === 'clinic_admin' || user?.role === 'receptionist') {
            fetchDoctors();
        }

        if (patient) {
            setFormData({
                name: patient.name || '',
                email: patient.email || '',
                phone: patient.phone || '',
                dateOfBirth: patient.dateOfBirth ? patient.dateOfBirth.split('T')[0] : '',
                gender: patient.gender || 'male',
                address: {
                    street: patient.address?.street || '',
                    city: patient.address?.city || '',
                    state: patient.address?.state || '',
                    zipCode: patient.address?.zipCode || '',
                    country: patient.address?.country || ''
                },
                emergencyContact: {
                    name: patient.emergencyContact?.name || '',
                    relationship: patient.emergencyContact?.relationship || '',
                    phone: patient.emergencyContact?.phone || ''
                },
                medicalHistory: {
                    allergies: patient.medicalHistory?.allergies || [],
                    chronicConditions: patient.medicalHistory?.chronicConditions || [],
                    currentMedications: patient.medicalHistory?.currentMedications || [],
                    bloodType: patient.medicalHistory?.bloodType || '',
                    notes: patient.medicalHistory?.notes || ''
                },
                assignedDoctorId: patient.assignedDoctorId?._id || patient.assignedDoctorId || ''
            });
        }
    }, [patient, user]);

    const fetchDoctors = async () => {
        try {
            const response = await patientAPI.getDoctors();
            setDoctors(response.data.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
            setDoctors([]);
        }
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    }, []);

    const handleBloodTypeChange = useCallback((e) => {
        const { value } = e.target;
        setFormData(prev => ({
            ...prev,
            medicalHistory: {
                ...prev.medicalHistory,
                bloodType: value
            }
        }));
    }, []);

    const handleArrayChange = useCallback((field, value) => {
        const items = value.split(',').map(item => item.trim()).filter(item => item);
        setFormData(prev => ({
            ...prev,
            medicalHistory: {
                ...prev.medicalHistory,
                [field]: items
            }
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });
        setLoading(true);

        try {
            const submitData = {
                ...formData,
                medicalHistory: {
                    ...formData.medicalHistory,
                    allergies: formData.medicalHistory.allergies.filter(item => item),
                    chronicConditions: formData.medicalHistory.chronicConditions.filter(item => item),
                    currentMedications: formData.medicalHistory.currentMedications.filter(item => item)
                }
            };

            if (patient) {
                await patientAPI.updatePatient(patient._id, submitData);
                setMessage({ type: 'success', text: 'Patient updated successfully!' });
            } else {
                await patientAPI.createPatient(submitData);
                console.log('Patient created, data sent:', submitData);
                setMessage({ type: 'success', text: 'Patient created successfully!' });

                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    dateOfBirth: '',
                    gender: 'male',
                    address: { street: '', city: '', state: '', zipCode: '', country: '' },
                    emergencyContact: { name: '', relationship: '', phone: '' },
                    medicalHistory: { allergies: [], chronicConditions: [], currentMedications: [], bloodType: '', notes: '' },
                    assignedDoctorId: ''
                });
            }

            if (onSuccess) onSuccess();
        } catch (error) {
            console.error('Error saving patient:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to save patient'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-200 px-6 py-8">
                <div className="w-full">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-medium mb-3">
                                <User size={14} />
                                Patient Management
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {patient ? 'Edit Patient Information' : 'Add New Patient'}
                            </h1>
                            <p className="text-gray-600 mt-1">
                                {patient ? 'Update patient details and medical information' : 'Create a comprehensive patient record'}
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="w-full px-6 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    {message.text && (
                        <div className="p-6 pb-0">
                            <div className={`p-4 rounded-lg flex items-start gap-3 ${message.type === 'success'
                                ? 'bg-green-50 text-green-800 border border-green-200'
                                : 'bg-red-50 text-red-800 border border-red-200'
                                }`}>
                                {message.type === 'success' ? (
                                    <PlusCircle size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <X size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                                )}
                                <div>
                                    <p className="font-medium">{message.text}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Basic Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <User size={20} className="text-primary-600" />
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                            placeholder="Enter full name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                            placeholder="Enter email address"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                            placeholder="Enter phone number"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                    <div className="relative">
                                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                            {formData.gender === 'female' ? <venus size={18} /> : <mars size={18} />}
                                        </span>
                                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors appearance-none bg-white">
                                            <option value="male">👨 Male</option>
                                            <option value="female">👩 Female</option>
                                            <option value="other">⚧ Other</option>
                                        </select>
                                    </div>
                                </div>
                                {(user?.role === 'clinic_admin' || user?.role === 'receptionist') && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Doctor *</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Stethoscope size={18} /></span>
                                            <select name="assignedDoctorId" value={formData.assignedDoctorId} onChange={handleChange} required className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors appearance-none bg-white">
                                                <option value="">Select a doctor</option>
                                                {doctors.map(doctor => (
                                                    <option key={doctor._id} value={doctor._id}>
                                                        {doctor.name} {doctor.specialization ? `(${doctor.specialization})` : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Address Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin size={20} className="text-primary-600" />
                                Address Information
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="address.street"
                                            value={formData.address.street}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                            placeholder="Enter street address"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="address.city"
                                        value={formData.address.city}
                                        onChange={handleChange}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                        placeholder="Enter city"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <input
                                        type="text"
                                        name="address.state"
                                        value={formData.address.state}
                                        onChange={handleChange}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                        placeholder="Enter state"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                    <input
                                        type="text"
                                        name="address.zipCode"
                                        value={formData.address.zipCode}
                                        onChange={handleChange}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                        placeholder="Enter ZIP code"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                    <input
                                        type="text"
                                        name="address.country"
                                        value={formData.address.country}
                                        onChange={handleChange}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                        placeholder="Enter country"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <User size={20} className="text-primary-600" />
                                Emergency Contact
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="text"
                                            name="emergencyContact.name"
                                            value={formData.emergencyContact.name}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                            placeholder="Enter contact name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Relationship</label>
                                    <input
                                        type="text"
                                        name="emergencyContact.relationship"
                                        value={formData.emergencyContact.relationship}
                                        onChange={handleChange}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                        placeholder="e.g., Spouse, Parent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="tel"
                                            name="emergencyContact.phone"
                                            value={formData.emergencyContact.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                            placeholder="Enter contact phone"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Medical History */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                <Heart size={20} className="text-primary-600" />
                                Medical History
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                                    <input
                                        type="text"
                                        value={formData.medicalHistory.allergies.join(', ')}
                                        onChange={(e) => handleArrayChange('allergies', e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                        placeholder="e.g., Penicillin, Peanuts (separate with commas)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Chronic Conditions</label>
                                    <input
                                        type="text"
                                        value={formData.medicalHistory.chronicConditions.join(', ')}
                                        onChange={(e) => handleArrayChange('chronicConditions', e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                        placeholder="e.g., Diabetes, Asthma (separate with commas)"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                                    <input
                                        type="text"
                                        value={formData.medicalHistory.currentMedications.join(', ')}
                                        onChange={(e) => handleArrayChange('currentMedications', e.target.value)}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors"
                                        placeholder="e.g., Metformin, Lisinopril (separate with commas)"
                                    />
                                </div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Blood Type</label>
                                        <div className="relative">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400"><Heart size={18} /></span>
                                            <select name="medicalHistory.bloodType" value={formData.medicalHistory.bloodType} onChange={handleBloodTypeChange} className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors appearance-none bg-white">
                                                <option value="">Select blood type</option>
                                                <option value="A+">🩸 A+</option>
                                                <option value="A-">🩸 A-</option>
                                                <option value="B+">🩸 B+</option>
                                                <option value="B-">🩸 B-</option>
                                                <option value="AB+">🩸 AB+</option>
                                                <option value="AB-">🩸 AB-</option>
                                                <option value="O+">🩸 O+</option>
                                                <option value="O-">🩸 O-</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Medical Notes</label>
                                    <textarea
                                        name="medicalHistory.notes"
                                        value={formData.medicalHistory.notes}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 hover:border-gray-400 transition-colors resize-none"
                                        placeholder="Any additional medical information, previous surgeries, family history, etc..."
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
                                    onClick={onCancel}
                                    className="px-6 py-3 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center gap-2 font-medium"
                                >
                                    <X size={18} />
                                    <span>Cancel</span>
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 font-medium shadow-sm hover:shadow-md"
                                >
                                    {loading ? (
                                        <>
                                            <PlusCircle className="h-4 w-4 animate-spin" />
                                            <span>Saving Patient...</span>
                                        </>
                                    ) : (
                                        <>
                                            <PlusCircle size={18} />
                                            <span>{patient ? 'Update Patient' : 'Create Patient'}</span>
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

export default PatientForm;
