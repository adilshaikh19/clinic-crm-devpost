import React, { useState, useEffect, useRef } from 'react';
import { prescriptionAPI } from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
import commonMedications from '../../data/commonMedications';
import { PlusCircle, Trash2, FileText, Pill, Clock, AlertCircle, CheckCircle } from 'lucide-react';

const CreatePrescription = ({ patientId }) => {
  // const { user } = useAuth();
  const [medications, setMedications] = useState([
    { name: '', dosage: '', frequency: '', duration: '' },
  ]);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeMedicationIndex, setActiveMedicationIndex] = useState(0);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const suggestionsRef = useRef(null);

  const handleMedicationChange = (index, e) => {
    const { name, value } = e.target;
    const newMedications = [...medications];
    newMedications[index][name] = value;
    setMedications(newMedications);
    
    if (name === 'name') {
      setSearchTerm(value);
      setActiveMedicationIndex(index);
      setShowSuggestions(true);
      
      // Filter medications based on search term
      const filtered = commonMedications.filter(med => 
        med.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredMedications(filtered);
    }
  };
  
  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const selectMedication = (medication) => {
    const newMedications = [...medications];
    newMedications[activeMedicationIndex].name = medication.name;
    
    // If there are common dosages, set the first one as default
    if (medication.commonDosages && medication.commonDosages.length > 0) {
      newMedications[activeMedicationIndex].dosage = medication.commonDosages[0];
    }
    
    setMedications(newMedications);
    setShowSuggestions(false);
    setSearchTerm('');
  };

  const addMedication = () => {
    setMedications([
      ...medications,
      { name: '', dosage: '', frequency: '', duration: '' },
    ]);
  };

  const removeMedication = (index) => {
    const newMedications = medications.filter((_, i) => i !== index);
    setMedications(newMedications);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const prescriptionData = {
        patientId,
        medications,
        notes,
      };
      await prescriptionAPI.createPrescription(prescriptionData);
      setSuccess('Prescription created successfully!');
      setMedications([{ name: '', dosage: '', frequency: '', duration: '' }]);
      setNotes('');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create prescription');
    }
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-gray-50 p-6 rounded-xl shadow-lg">
      <div className="flex items-center mb-6 pb-4 border-b border-gray-200">
        <FileText size={24} className="text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Create Prescription</h2>
      </div>

      <p className='hidden'>{searchTerm}</p>
      
      {error && (
        <div className="flex items-center p-4 mb-6 bg-red-50 border-l-4 border-red-500 rounded-md">
          <AlertCircle size={20} className="text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="flex items-center p-4 mb-6 bg-green-50 border-l-4 border-green-500 rounded-md">
          <CheckCircle size={20} className="text-green-500 mr-2" />
          <p className="text-green-700">{success}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex items-center mb-4">
            <Pill size={20} className="text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Medications</h3>
          </div>
          
          {medications.map((med, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100 hover:border-blue-200 transition-all duration-200">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="col-span-1 md:col-span-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medication Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter medication name"
                      value={med.name}
                      onChange={(e) => handleMedicationChange(index, e)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                      autoComplete="off"
                    />
                    {showSuggestions && activeMedicationIndex === index && filteredMedications.length > 0 && (
                      <div 
                        ref={suggestionsRef}
                        className="absolute z-10 mt-1 w-full bg-white shadow-xl max-h-60 rounded-lg py-1 text-base overflow-auto focus:outline-none border border-gray-200"
                      >
                        {filteredMedications.map((medication, idx) => (
                          <div
                            key={idx}
                            className="cursor-pointer hover:bg-blue-50 px-4 py-3 flex items-center transition-colors duration-150"
                            onClick={() => selectMedication(medication)}
                          >
                            <Pill size={16} className="text-blue-500 mr-2" />
                            <span>{medication.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-1 relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    name="dosage"
                    placeholder="e.g., 10mg"
                    value={med.dosage}
                    onChange={(e) => handleMedicationChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                    list={`dosage-list-${index}`}
                  />
                  <datalist id={`dosage-list-${index}`}>
                    {commonMedications.find(m => m.name === med.name)?.commonDosages.map((dosage, idx) => (
                      <option key={idx} value={dosage} />
                    ))}
                  </datalist>
                </div>
                
                <div className="col-span-1 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                  <div className="relative">
                    <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="frequency"
                      placeholder="e.g., Twice a day"
                      value={med.frequency}
                      onChange={(e) => handleMedicationChange(index, e)}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>
                </div>
                
                <div className="col-span-1 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    placeholder="e.g., 7 days"
                    value={med.duration}
                    onChange={(e) => handleMedicationChange(index, e)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    required
                  />
                </div>
                
                <div className="col-span-1 md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={() => removeMedication(index)}
                    className="w-full flex items-center justify-center p-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg transition-all duration-200 shadow-sm"
                  >
                    <Trash2 size={16} className="mr-2" />
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addMedication}
          className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-200 mb-6"
        >
          <PlusCircle size={18} className="mr-2" />
          Add Medication
        </button>
        
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex items-center mb-4">
            <FileText size={20} className="text-blue-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-800">Additional Information</h3>
          </div>
          
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Doctor's Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows="4"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Add any additional notes or instructions for the patient..."
            ></textarea>
          </div>
        </div>
        
        <button
          type="submit"
          className="flex items-center justify-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 px-6 rounded-lg shadow-md transition-all duration-200 w-full"
        >
          <CheckCircle size={18} className="mr-2" />
          Create Prescription
        </button>
      </form>
    </div>
  );
};

export default CreatePrescription;