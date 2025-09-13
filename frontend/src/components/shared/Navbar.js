import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Menu, Search, Bell, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = ({ isSidebarCollapsed, toggleSidebar }) => {
  const { user, logout } = useAuth();

  return (
    <header
      className="fixed top-0 right-0 h-16 bg-white/90 backdrop-blur border-b border-gray-200 shadow-sm flex items-center justify-between px-4 z-20 transition-all duration-300 ease-in-out"
      style={{
        left: isSidebarCollapsed ? '80px' : '256px',
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="text-gray-600 hover:text-gray-900"
          aria-label="Toggle sidebar"
        >
          <Menu size={22} />
        </button>
        <div className="relative hidden md:block">
          <Search
            size={18}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-gray-600 hover:text-gray-900">
          <Bell size={20} />
        </button>

        <div className="relative group">
          <button className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-semibold">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-900">
              {user?.name}
            </span>
          </button>
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md border border-gray-100 shadow-lg py-1 hidden group-hover:block">
            <Link
              to="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <User size={16} className="mr-2" />
              My Profile
            </Link>
            {/* <Link
              to="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <Settings size={16} className="mr-2" />
              Settings
            </Link> */}
            <button
              onClick={logout}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              <LogOut size={16} className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
