import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { reportsAPI, userAPI } from "../../services/api";
// import { useAuth } from "../../context/AuthContext";
import {
  Download,
  Filter,
  Calendar,
  Users,
  FileText,
  TrendingUp,
  ArrowLeft,
  Search,
  RefreshCw,
  BarChart3,
  PieChart,
} from "lucide-react";

// Chart Components
const BarChart = ({ data, title, color = "bg-primary-500" }) => {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <BarChart3 size={20} />
        {title}
      </h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-24 text-sm text-gray-600 truncate">
              {item.label}
            </div>
            <div className="flex-1 mx-3">
              <div className="bg-gray-200 rounded-full h-4 relative">
                <div
                  className={`${color} h-4 rounded-full transition-all duration-500`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-sm font-medium text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieChartSimple = ({ data, title }) => {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <PieChart size={20} />
        {title}
      </h3>
      <div className="space-y-2">
        {data.map((item, index) => {
          const percentage = ((item.value / total) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    colors[index % colors.length]
                  }`}
                ></div>
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <div className="text-sm font-medium">
                {item.value} ({percentage}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Report = () => {
  const { reportType } = useParams();
  const navigate = useNavigate();
  // const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    status: "",
    doctorId: "",
    gender: "",
  });
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = useCallback(async () => {
    try {
      const response = await userAPI.getUsers();
      setDoctors(response.data.data.filter((user) => user.role === "doctor"));
    } catch (error) {
      console.error("Error fetching doctors:", error);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let response;
      const params = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== "")
      );

      switch (reportType) {
        case "appointments":
          response = await reportsAPI.getAppointmentsReport(params);
          break;
        case "patients":
          response = await reportsAPI.getPatientsReport(params);
          break;
        case "prescriptions":
          response = await reportsAPI.getPrescriptionsReport(params);
          break;
        case "revenue":
          response = await reportsAPI.getRevenueReport(params);
          break;
        default:
          throw new Error("Invalid report type");
      }

      setData(response.data.data);
    } catch (err) {
      console.error("Error fetching report data:", err);
      setError(err.response?.data?.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  }, [filters, reportType]); // ✅ depends on filters + reportType

  useEffect(() => {
    fetchDoctors();
    fetchData();
  }, [fetchDoctors, fetchData]);


  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchData();
  };

  const clearFilters = () => {
    setFilters({
      startDate: "",
      endDate: "",
      status: "",
      doctorId: "",
      gender: "",
    });
  };

  // Build flat table structure reused by table and exports
  const buildTable = () => {
    if (!data) return { rows: [], headers: [] };
    let rows = [];
    let headers = [];
    switch (reportType) {
      case "appointments": {
        const list = data.appointments || [];
        headers = ["ID", "Patient", "Doctor", "Date", "Time", "Status"];
        rows = list.map((item) => [
          item.appointmentId || item._id || "",
          item.patientId?.name || item.name || "N/A",
          item.doctorId?.name || "N/A",
          item.date ? new Date(item.date).toLocaleDateString() : "",
          item.time || "",
          item.status || "",
        ]);
        break;
      }
      case "patients": {
        const list = data.patients || [];
        headers = [
          "Patient ID",
          "Name",
          "Email",
          "Phone",
          "Gender",
          "Assigned Doctor",
          "Registered",
        ];
        rows = list.map((item) => [
          item.patientId || "",
          item.name || "",
          item.email || "",
          item.phone || "",
          item.gender || "",
          item.assignedDoctorId?.name || "Unassigned",
          item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
        ]);
        break;
      }
      case "prescriptions": {
        const list = data.prescriptions || [];
        headers = ["Patient", "Doctor", "Medications", "Date"];
        rows = list.map((item) => [
          item.patientId?.name || "N/A",
          item.doctorId?.name || "N/A",
          (item.medications?.length || 0).toString(),
          item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "",
        ]);
        break;
      }
      case "revenue": {
        const list = data.revenueData || [];
        headers = ["Month", "Appointments", "Revenue"];
        rows = list.map((item) => [
          item.month || "",
          (item.appointments ?? "").toString(),
          typeof item.revenue === "number"
            ? `$${item.revenue}`
            : item.revenue || "",
        ]);
        break;
      }
      default:
        break;
    }
    return { rows, headers };
  };

  const downloadExcel = async () => {
    try {
      const { rows, headers } = buildTable();
      if (!rows.length) return alert("No data to export");
      // Lazy import to avoid bundling if not used
      const XLSX = (await import("xlsx")).default || (await import("xlsx"));
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
      const filename = `${getReportTitle().replace(/\s+/g, "_")}.xlsx`;
      XLSX.writeFile(workbook, filename);
    } catch (e) {
      console.error("Excel export failed:", e);
      alert(
        "Failed to export Excel. Please ensure dependencies are installed."
      );
    }
  };

  const downloadPDF = async () => {
    try {
      const { rows, headers } = buildTable();
      if (!rows.length) return alert("No data to export");

      // Import jsPDF and the autotable plugin (supports various module shapes)
      const jsPDFModule = await import("jspdf");
      const { jsPDF } = jsPDFModule.jsPDF
        ? jsPDFModule
        : { jsPDF: jsPDFModule.default || jsPDFModule };
      const autoTableModule = await import("jspdf-autotable");
      const autoTableFn = autoTableModule.default || autoTableModule.autoTable;

      const doc = new jsPDF({ orientation: "landscape" });
      const title = getReportTitle();
      doc.setFontSize(14);
      doc.text(title, 14, 14);

      // Use attached method if present, else call the imported function with doc
      if (typeof doc.autoTable === "function") {
        doc.autoTable({
          head: [headers],
          body: rows,
          startY: 20,
          styles: { fontSize: 8 },
        });
      } else if (typeof autoTableFn === "function") {
        autoTableFn(doc, {
          head: [headers],
          body: rows,
          startY: 20,
          styles: { fontSize: 8 },
        });
      } else {
        throw new Error("jspdf-autotable plugin not loaded");
      }

      const filename = `${title.replace(/\s+/g, "_")}.pdf`;
      doc.save(filename);
    } catch (e) {
      console.error("PDF export failed:", e);
      alert(
        "Failed to export PDF. Please ensure dependencies are installed. Check console for details."
      );
    }
  };

  const handleDownload = async (format) => {
    if (format === "excel" || format === "xlsx") return downloadExcel();
    if (format === "pdf") return downloadPDF();
    alert("Unsupported format");
  };

  const getReportTitle = () => {
    const titles = {
      appointments: "Appointments Report",
      patients: "Patients Report",
      prescriptions: "Prescriptions Report",
      revenue: "Revenue Report",
    };
    return titles[reportType] || "Report";
  };

  const getReportIcon = () => {
    const icons = {
      appointments: Calendar,
      patients: Users,
      prescriptions: FileText,
      revenue: TrendingUp,
    };
    const Icon = icons[reportType] || FileText;
    return <Icon className="h-8 w-8 text-primary-600" />;
  };

  const renderCharts = () => {
    if (!data) return null;

    switch (reportType) {
      case "appointments":
        const statusData = Object.entries(data.summary?.byStatus || {}).map(
          ([key, value]) => ({
            label: key,
            value: value,
          })
        );
        const doctorData = Object.entries(data.summary?.byDoctor || {}).map(
          ([key, value]) => ({
            label: key,
            value: value,
          })
        );

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PieChartSimple data={statusData} title="Appointments by Status" />
            <BarChart
              data={doctorData}
              title="Appointments by Doctor"
              color="bg-green-500"
            />
          </div>
        );

      case "patients":
        const genderData = Object.entries(data.summary?.byGender || {}).map(
          ([key, value]) => ({
            label: key,
            value: value,
          })
        );
        const ageData = Object.entries(data.summary?.byAgeGroup || {}).map(
          ([key, value]) => ({
            label: key,
            value: value,
          })
        );

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <PieChartSimple data={genderData} title="Patients by Gender" />
            <BarChart
              data={ageData}
              title="Patients by Age Group"
              color="bg-blue-500"
            />
          </div>
        );

      case "prescriptions":
        const prescDoctorData = Object.entries(
          data.summary?.byDoctor || {}
        ).map(([key, value]) => ({
          label: key,
          value: value,
        }));
        const medicationData = Object.entries(
          data.summary?.medicationFrequency || {}
        )
          .sort(([, a], [, b]) => b - a)
          .slice(0, 10)
          .map(([key, value]) => ({
            label: key,
            value: value,
          }));

        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <BarChart
              data={prescDoctorData}
              title="Prescriptions by Doctor"
              color="bg-purple-500"
            />
            <BarChart
              data={medicationData}
              title="Top 10 Medications"
              color="bg-pink-500"
            />
          </div>
        );

      case "revenue":
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
              <h3 className="text-lg font-semibold mb-4">Revenue Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-semibold text-green-600">
                    ${data.totalRevenue}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Appointments</span>
                  <span className="font-semibold">
                    {data.totalAppointments}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Average per Appointment</span>
                  <span className="font-semibold">
                    $
                    {(data.totalRevenue / data.totalAppointments || 0).toFixed(
                      2
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const renderTable = () => {
    if (!data) return null;

    let tableData = [];
    let columns = [];

    switch (reportType) {
      case "appointments":
        tableData = data.appointments || [];
        columns = [
          { key: "appointmentId", label: "ID" },
          {
            key: "patientName",
            label: "Patient",
            render: (item) => item.patientId?.name || item.name || "N/A",
          },
          {
            key: "doctorName",
            label: "Doctor",
            render: (item) => item.doctorId?.name || "N/A",
          },
          {
            key: "date",
            label: "Date",
            render: (item) => new Date(item.date).toLocaleDateString(),
          },
          { key: "time", label: "Time" },
          {
            key: "status",
            label: "Status",
            render: (item) => (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : item.status === "scheduled"
                    ? "bg-blue-100 text-blue-800"
                    : item.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {item.status}
              </span>
            ),
          },
        ];
        break;

      case "patients":
        tableData = data.patients || [];
        columns = [
          { key: "patientId", label: "Patient ID" },
          { key: "name", label: "Name" },
          { key: "email", label: "Email" },
          { key: "phone", label: "Phone" },
          { key: "gender", label: "Gender" },
          {
            key: "doctorName",
            label: "Assigned Doctor",
            render: (item) => item.assignedDoctorId?.name || "Unassigned",
          },
          {
            key: "createdAt",
            label: "Registered",
            render: (item) => new Date(item.createdAt).toLocaleDateString(),
          },
        ];
        break;

      case "prescriptions":
        tableData = data.prescriptions || [];
        columns = [
          {
            key: "patientName",
            label: "Patient",
            render: (item) => item.patientId?.name || "N/A",
          },
          {
            key: "doctorName",
            label: "Doctor",
            render: (item) => item.doctorId?.name || "N/A",
          },
          {
            key: "medications",
            label: "Medications",
            render: (item) => item.medications?.length || 0,
          },
          {
            key: "createdAt",
            label: "Date",
            render: (item) => new Date(item.createdAt).toLocaleDateString(),
          },
        ];
        break;

      case "revenue":
        tableData = data.revenueData || [];
        columns = [
          { key: "month", label: "Month" },
          { key: "appointments", label: "Appointments" },
          {
            key: "revenue",
            label: "Revenue",
            render: (item) => `$${item.revenue}`,
          },
        ];
        break;

      default:
        return null;
    }

    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold">Detailed Data</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tableData.map((item, index) => (
                <tr key={item._id || index} className="hover:bg-gray-50">
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {column.render ? column.render(item) : item[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {tableData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No data available for the selected filters.
            </p>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 pt-20 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 pt-20 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/reports")}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              {getReportIcon()}
              {getReportTitle()}
            </h1>
            <p className="text-gray-600 mt-1">
              Comprehensive analytics and data insights
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownload("pdf")}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-sm font-medium flex items-center gap-2"
          >
            <Download size={16} />
            PDF
          </button>
          <button
            onClick={() => handleDownload("excel")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-sm font-medium flex items-center gap-2"
          >
            <Download size={16} />
            Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Filter size={20} />
          Filters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          {reportType === "appointments" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="registered">Registered</option>
              </select>
            </div>
          )}
          {reportType === "patients" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange("gender", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          )}
          {(reportType === "appointments" ||
            reportType === "patients" ||
            reportType === "prescriptions") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor
              </label>
              <select
                value={filters.doctorId}
                onChange={(e) => handleFilterChange("doctorId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">All Doctors</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name}{" "}
                    {doctor.specialization ? `(${doctor.specialization})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={applyFilters}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm font-medium flex items-center gap-2"
          >
            <Search size={16} />
            Apply Filters
          </button>
          <button
            onClick={clearFilters}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Clear
          </button>
          <button
            onClick={fetchData}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 border border-red-200">
          {error}
        </div>
      )}

      {/* Charts */}
      {renderCharts()}

      {/* Data Table */}
      {renderTable()}
    </div>
  );
};

export default Report;
