import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <Sidebar isCollapsed={isSidebarCollapsed} />
      <div
        className="flex-1 flex flex-col transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isSidebarCollapsed ? '80px' : '256px',
        }}
      >
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          toggleSidebar={toggleSidebar}
        />
        <main className="flex-1 p-2 pt-16 overflow-y-auto">
          <div className="">
            <div className="sm:px-0">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
