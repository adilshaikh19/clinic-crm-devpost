import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { prescriptionAPI, clinicAPI } from "../../services/api";
import { useReactToPrint } from "react-to-print";
import { useAuth } from "../../context/AuthContext";
import {
  Printer,
  ArrowLeft,
  Stethoscope,
  Calendar,
  User,
  Phone,
  MapPin,
  Mail,
} from "lucide-react";

const ViewPrescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [prescription, setPrescription] = useState(null);
  const [clinic, setClinic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const componentRef = useRef(null);

  // Updated to react-to-print v3 API using contentRef
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `Prescription-${prescription?.prescriptionId || "Unknown"}`,
    pageStyle: `
      @page {
        size: A4;
        margin: 15mm;
      }
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          color-adjust: exact;
          font-family: 'Times New Roman', serif;
        }
        .no-print {
          display: none !important;
        }
        .prescription-container {
          box-shadow: none !important;
          border: 2px solid #000 !important;
        }
        .prescription-header {
          border-bottom: 3px double #000 !important;
        }
        .rx-symbol {
          font-size: 48px !important;
          color: #000 !important;
        }
        .medication-table {
          border: 2px solid #000 !important;
        }
        .medication-table th,
        .medication-table td {
          border: 1px solid #000 !important;
        }
      }
    `,
  });

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch prescription (now includes patient data)
        const prescriptionRes = await prescriptionAPI.getPrescription(id);
        const prescriptionData = prescriptionRes.data.data;
        setPrescription(prescriptionData);

        // Fetch clinic data
        const clinicRes = await clinicAPI.getClinic();
        setClinic(clinicRes.data.data);
      } catch (error) {
        setError(
          error.response?.data?.message || "Failed to load prescription details"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptionData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!prescription || !prescription.patient || !clinic) {
    return (
      <div className="text-center py-12">Prescription details not found.</div>
    );
  }

  const patient = prescription.patient;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Action Buttons */}
        <div className="flex justify-between items-center mb-6 no-print">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Prescriptions
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Printer size={20} className="mr-2" />
            Print Prescription
          </button>
        </div>

        {/* Prescription Document */}
        <div
          ref={componentRef}
          className="prescription-container bg-white shadow-xl border border-gray-200 max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="prescription-header bg-gradient-to-r from-blue-50 to-indigo-50 p-8 border-b-4 border-blue-600">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <Stethoscope size={32} className="text-blue-600 mr-3" />
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {clinic?.name || "Medical Clinic"}
                    </h1>
                    <p className="text-blue-600 font-medium">
                      Healthcare Excellence
                    </p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-2 text-gray-500" />
                    <span>{clinic?.address || "Clinic Address"}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2 text-gray-500" />
                    <span>{clinic?.contactInfo || "Contact Information"}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail size={16} className="mr-2 text-gray-500" />
                    <span>{clinic?.email || "clinic@email.com"}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="rx-symbol text-6xl font-bold text-blue-600 mb-2">
                  ℞
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                  <p className="text-sm text-gray-600">Prescription No.</p>
                  <p className="font-bold text-lg text-gray-900">
                    {prescription?.prescriptionId}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Patient & Doctor Information */}
          <div className="p-8 bg-gray-50 border-b">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Patient Details */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  <User size={20} className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Patient Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-semibold text-gray-900">
                      {patient?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Patient ID:</span>
                    <span className="font-mono text-gray-900">
                      {patient?.patientId}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="text-gray-900">
                      {patient?.dateOfBirth
                        ? calculateAge(patient.dateOfBirth)
                        : "N/A"}{" "}
                      years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span className="capitalize text-gray-900">
                      {patient?.gender}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="text-gray-900">
                      {patient?.phone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Doctor & Date Information */}
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center mb-4">
                  <Stethoscope size={20} className="text-blue-600 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-800">
                    Prescribing Doctor
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-semibold text-gray-900">
                      Dr. {prescription?.doctor?.name || user?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Specialization:</span>
                    <span className="text-gray-900">
                      {prescription?.doctor?.specialization ||
                        "General Medicine"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">License No:</span>
                    <span className="font-mono text-gray-900">
                      {prescription?.doctor?.licenseNumber || "MD-12345"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Date:</span>
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-500 mr-1" />
                      <span className="text-gray-900">
                        {formatDate(prescription?.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="p-8">
            <div className="flex items-center mb-6">
              <div className="text-2xl font-bold text-blue-600 mr-3">℞</div>
              <h3 className="text-xl font-bold text-gray-800">
                Prescribed Medications
              </h3>
            </div>

            <div className="medication-table border-2 border-gray-300 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-300">
                      S.No.
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-300">
                      Medicine Name
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-300">
                      Dosage
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-300">
                      Frequency
                    </th>
                    <th className="px-6 py-4 text-left font-semibold text-gray-700 border-b-2 border-gray-300">
                      Duration
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prescription?.medications?.map((med, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 border-b border-gray-200 font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 font-semibold text-gray-900">
                        {med.name}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                        {med.dosage}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                        {med.frequency}
                      </td>
                      <td className="px-6 py-4 border-b border-gray-200 text-gray-700">
                        {med.duration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Doctor's Instructions */}
          {prescription?.notes && (
            <div className="px-8 pb-6">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">
                  Doctor's Instructions
                </h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {prescription.notes}
                </p>
              </div>
            </div>
          )}

          {/* General Instructions */}
          <div className="px-8 pb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                General Instructions
              </h4>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>• Take medications as prescribed by the doctor</li>
                <li>
                  • Complete the full course of treatment even if you feel
                  better
                </li>
                <li>
                  • Store medications in a cool, dry place away from children
                </li>
                <li>
                  • Consult your doctor if you experience any adverse effects
                </li>
                <li>• Do not share medications with others</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-100 px-8 py-6 border-t-2 border-gray-300">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                <p>Generated on: {formatDate(new Date())}</p>
                <p>This is a digitally generated prescription</p>
              </div>
              <div className="text-right">
                <div className="border-t-2 border-gray-400 pt-2 mt-8 w-48">
                  <p className="text-sm text-gray-600">Doctor's Signature</p>
                  <p className="font-semibold text-gray-800">
                    Dr. {prescription?.doctor?.name || user?.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPrescription;
