import React, { useState, useEffect } from 'react';
import { availabilityAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Calendar, Clock, Plus, Trash2, Save, AlertCircle, CheckCircle } from 'lucide-react';

const Availability = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([{ startTime: '09:00', endTime: '10:00' }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (date && user) {
      // You might want to fetch existing availability for the selected date
    }
  }, [date, user]);

  const handleSlotChange = (index, field, value) => {
    const newSlots = [...slots];
    newSlots[index][field] = value;
    setSlots(newSlots);
  };

  const addSlot = () => {
    setSlots([...slots, { startTime: '', endTime: '' }]);
  };

  const removeSlot = (index) => {
    const newSlots = slots.filter((_, i) => i !== index);
    setSlots(newSlots);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const availabilityData = {
        date,
        slots,
      };
      await availabilityAPI.setAvailability(availabilityData);
      setSuccess('Availability saved successfully!');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save availability');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Availability</h2>
      
      {error && (
        <div className="flex items-center p-4 mb-4 bg-red-100 border-l-4 border-red-500 text-red-700">
          <AlertCircle className="mr-2" />
          {error}
        </div>
      )}
      
      {success && (
        <div className="flex items-center p-4 mb-4 bg-green-100 border-l-4 border-green-500 text-green-700">
          <CheckCircle className="mr-2" />
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-4 border rounded-lg">
          <div className="flex items-center mb-4">
            <Calendar className="mr-2" />
            <label htmlFor="date" className="text-lg font-semibold">Select Date</label>
          </div>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="p-2 border rounded-md w-full"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="p-4 border rounded-lg">
          <div className="flex items-center mb-4">
            <Clock className="mr-2" />
            <h3 className="text-lg font-semibold">Time Slots</h3>
          </div>
          {slots.map((slot, index) => (
            <div key={index} className="flex items-center space-x-4 mb-2">
              <input
                type="time"
                value={slot.startTime}
                onChange={(e) => handleSlotChange(index, 'startTime', e.target.value)}
                className="p-2 border rounded-md"
              />
              <span>to</span>
              <input
                type="time"
                value={slot.endTime}
                onChange={(e) => handleSlotChange(index, 'endTime', e.target.value)}
                className="p-2 border rounded-md"
              />
              <button type="button" onClick={() => removeSlot(index)} className="text-red-500">
                <Trash2 />
              </button>
            </div>
          ))}
          <button type="button" onClick={addSlot} className="flex items-center text-blue-500 mt-2">
            <Plus className="mr-1" /> Add Slot
          </button>
        </div>

        <button type="submit" className="flex items-center justify-center w-full p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          <Save className="mr-2" /> Save Availability
        </button>
      </form>
    </div>
  );
};

export default Availability;
