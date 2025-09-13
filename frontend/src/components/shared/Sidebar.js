import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  BarChart2,
  Users,
  Calendar,
  User,
  LogOut,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  LayoutDashboard,
  FilePlus,
  List,
  FileText,
} from "lucide-react";

const Sidebar = ({ isCollapsed }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [openMenus, setOpenMenus] = React.useState({});

  const toggleMenu = (menu) =>
    setOpenMenus((prev) => ({ ...prev, [menu]: !prev[menu] }));

  const isActive = (path) => location.pathname === path;

  const adminMenuItems = [
    { path: "/admin", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    {
      label: "Staff",
      icon: <Users size={20} />,
      submenu: [
        {
          path: "/admin/users",
          label: "Manage Staff",
          icon: <List size={20} />,
        },
        {
          path: "/admin/users/create",
          label: "Add Staff",
          icon: <FilePlus size={20} />,
        },
      ],
    },
    {
      label: "Patients",
      icon: <Users size={20} />,
      submenu: [
        {
          path: "/admin/patients",
          label: "Patient List",
          icon: <List size={20} />,
        },
        {
          path: "/admin/patients/new",
          label: "Add Patient",
          icon: <FilePlus size={20} />,
        },
      ],
    },
    {
      label: "Appointments",
      icon: <Calendar size={20} />,
      submenu: [
        {
          path: "/admin/appointments",
          label: "Appointments List",
          icon: <List size={20} />,
        },
        {
          path: "/admin/appointments/new",
          label: "New Appointment",
          icon: <FilePlus size={20} />,
        },
      ],
    },
    {
      label: "Prescriptions",
      icon: <FileText size={20} />,
      submenu: [
          // {
          //   path: "/admin/prescriptions",
          //   label: "All Prescriptions",
          //   icon: <List size={20} />,
          // },
        {
          path: "/admin/prescriptions/new",
          label: "New Prescription",
          icon: <FilePlus size={20} />,
        },
      ],
    },
    { path: "/reports", label: "Reports", icon: <BarChart2 size={20} /> },
    { path: "/profile", label: "My Profile", icon: <User size={20} /> },
    // { path: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const doctorMenuItems = [
    {
      path: "/doctor",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      path: "/doctor/appointments",
      label: "My Appointments",
      icon: <Calendar size={20} />,
    },
    {
      path: "/doctor/patients",
      label: "My Patients",
      icon: <Users size={20} />,
    },
    {
      path: "/doctor/prescriptions",
      label: "Prescriptions",
      icon: <FileText size={20} />,
    },
    // {
    //   path: "/doctor/availability",
    //   label: "Availability",
    //   icon: <Clock size={20} />,
    // },
    { path: "/reports", label: "Reports", icon: <BarChart2 size={20} /> },
    { path: "/profile", label: "My Profile", icon: <User size={20} /> },
  ];

  const receptionistMenuItems = [
    {
      path: "/receptionist",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Patients",
      icon: <Users size={20} />,
      submenu: [
        {
          path: "/receptionist/patients",
          label: "Patient List",
          icon: <List size={20} />,
        },
        {
          path: "/receptionist/patients/new",
          label: "Add Patient",
          icon: <FilePlus size={20} />,
        },
      ],
    },
    {
      label: "Appointments",
      icon: <Calendar size={20} />,
      submenu: [
        {
          path: "/receptionist/appointments",
          label: "Appointments List",
          icon: <List size={20} />,
        },
        {
          path: "/receptionist/appointments/new",
          label: "New Appointment",
          icon: <FilePlus size={20} />,
        },
      ],
    },
    // {
    //   path: "/receptionist/schedule",
    //   label: "Schedule",
    //   icon: <Calendar size={20} />,
    // },
    { path: "/profile", label: "My Profile", icon: <User size={20} /> },
    // { path: "/settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case "clinic_admin":
        return adminMenuItems;
      case "doctor":
        return doctorMenuItems;
      case "receptionist":
        return receptionistMenuItems;
      default:
        return [];
    }
  };

  const MenuButton = ({ active, children, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-lg text-sm transition-colors
        ${active
          ? "bg-primary-50 text-primary-700 ring-1 ring-primary-100"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      {children}
    </button>
  );

  const renderMenuItem = (item) => {
    const isMenuOpen = openMenus[item.label];

    if (item.submenu) {
      const parentActive = item.submenu.some((s) => location.pathname.startsWith(s.path));
      return (
        <div key={item.label}>
          <MenuButton
            active={parentActive}
            onClick={() => toggleMenu(item.label)}
          >
            <div className="flex items-center gap-3">
              <span
                className={`text-gray-500 ${parentActive ? "text-primary-600" : ""
                  }`}
              >
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </div>
            {!isCollapsed &&
              (isMenuOpen ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              ))}
          </MenuButton>
          {!isCollapsed && isMenuOpen && (
            <ul className="pl-10 space-y-1 py-2">
              {item.submenu.map((subItem) => (
                <li key={subItem.path}>
                  <Link
                    to={subItem.path}
                    className={`flex items-center gap-3 p-2 rounded-md text-sm transition-colors
                      ${isActive(subItem.path)
                        ? "bg-primary-50 text-primary-700 ring-1 ring-primary-100"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                  >
                    <span className="text-gray-500">{subItem.icon}</span>
                    <span>{subItem.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    return (
      <li key={item.path}>
        <Link
          to={item.path}
          className={`flex items-center gap-3 p-3 rounded-lg text-sm transition-colors
            ${isActive(item.path)
              ? "bg-primary-50 text-primary-700 ring-1 ring-primary-100"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
        >
          <span
            className={`text-gray-500 ${isActive(item.path) ? "text-primary-600" : ""
              }`}
          >
            {item.icon}
          </span>
          {!isCollapsed && <span className="font-medium">{item.label}</span>}
        </Link>
      </li>
    );
  };

  return (
    <div
      className="fixed top-0 left-0 h-full bg-white border-r border-gray-200 text-gray-900 flex flex-col transition-all duration-300 ease-in-out z-30 sidebar-transition"
      style={{
        width: isCollapsed ? '80px' : '256px',
      }}
    >
      {/* Header */}
      <div
        className={`h-16 px-4 border-b border-gray-200 flex items-center ${isCollapsed ? "justify-center" : "justify-between"
          }`}
      >
        {!isCollapsed && (
          <h2 className="text-lg font-bold tracking-tight">CliniPrac</h2>
        )}
        <div className="h-8 w-8 rounded-lg bg-primary-600 text-white flex items-center justify-center">
          <Stethoscope size={18} />
        </div>
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-gray-200">
        <div
          className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"
            }`}
        >
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          {!isCollapsed && (
            <div>
              <p className="font-medium text-gray-900 leading-tight">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role?.replace("_", " ")}
              </p>
              <p className="text-xs text-gray-400">
                Clinic: {user?.clinicId}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="space-y-1">{getMenuItems().map(renderMenuItem)}</ul>
      </nav>

      {/* Logout Button */}
      <div className="px-3 py-4 border-t border-gray-200">
        <button
          onClick={logout}
          className={`w-full flex items-center p-3 rounded-lg text-sm transition-colors
            text-gray-600 hover:bg-gray-50 hover:text-gray-900 ${isCollapsed ? "justify-center" : "gap-3"
            }`}
        >
          <LogOut size={18} />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;