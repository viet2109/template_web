import { useState } from "react";
import AdminSidebar from "../components/AdminSideBar";

interface LayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<LayoutProps> = ({ children }) => {
 

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar  />
      <div className="mx-16 w-full overflow-hidden">{children}</div>
    </div>
  );
};

export default AdminLayout;
