import React, { useState, useEffect } from 'react';
import { appointmentAPI, patientAPI } from '../../services/api';
import { AlertCircle } from 'lucide-react';

const DoctorAvailability = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await patientAPI.getDoctors();
        setDoctors(response.data.data);
      } catch (error) {
        setError('Failed to fetch doctors');
      }
    };
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const fetchAppointments = async () => {
        setLoading(true);
        try {
          const response = await appointmentAPI.getAppointmentsByDoctorAndDate(selectedDoctor, selectedDate);
          setAppointments(response.data.data);
        } catch (error) {
          setError('Failed to fetch appointments');
        } finally {
          setLoading(false);
        }
      };
      fetchAppointments();
    }
  }, [selectedDoctor, selectedDate]);

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Doctor's Schedule</h2>

      {error && (
        <div className="flex items-center p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <AlertCircle className="mr-2" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="doctor" className="block text-lg font-semibold mb-2">Select Doctor</label>
          <select
            id="doctor"
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="p-2 border rounded-md w-full"
          >
            <option value="">-- Select a Doctor --</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date" className="block text-lg font-semibold mb-2">Select Date</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border rounded-md w-full"
          />
        </div>
      </div>

      {loading && <p>Loading appointments...</p>}

      {!loading && selectedDoctor && selectedDate && (
        <div>
          <h3 className="text-xl font-bold mb-2">Appointments for {new Date(selectedDate).toLocaleDateString()}</h3>
          {appointments.length > 0 ? (
            <ul className="space-y-2">
              {appointments.map((appt) => (
                <li key={appt._id} className="p-4 border rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{appt.patientId ? appt.patientId.name : 'Walk-in'}</p>
                    <p className="text-sm text-gray-600">{appt.notes}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{appt.time}</p>
                    <p className={`text-sm font-bold ${appt.status === 'Completed' ? 'text-green-500' : 'text-blue-500'}`}>{appt.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No appointments scheduled for this day.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorAvailability;