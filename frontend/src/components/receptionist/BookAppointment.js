import React, { useState } from 'react';
import { api } from '../../services/api';

const BookAppointment = ({ patientId }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [doctor, setDoctor] = useState('');
  const [details, setDetails] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const appointmentData = {
        patientId,
        date,
        time,
        doctor,
        details,
      };

      const response = await api.post('/appointments', appointmentData); // Assuming you have an endpoint for creating appointments

      if (response.status === 201) {
        setSuccessMessage('Appointment booked successfully!');
        // Optionally, reset the form
        setDate('');
        setTime('');
        setDoctor('');
        setDetails('');
      } else {
        setErrorMessage('Failed to book appointment.');
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'An error occurred while booking the appointment.');
    }
  };

  return (
    <div>
      <h2>Book Appointment</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="date">Date:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="time">Time:</label>
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="doctor">Doctor:</label>
          <input
            type="text"
            id="doctor"
            value={doctor}
            onChange={(e) => setDoctor(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="details">Details:</label>
          <textarea
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
};

export default BookAppointment;