import React, { useEffect, useState } from "react";
import {
  FiBarChart2,
  FiChevronDown,
  FiEdit,
  FiGrid,
  FiHelpCircle,
  FiHome,
  FiLogOut,
  FiMenu,
  FiSettings,
  FiShoppingBag,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router";
import routers from "../config/router";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { logOutSuccess } from "../store/authSlice";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  path?: string;
  submenu?: MenuItem[];
}

const AdminSidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Xác nhận đăng xuất",
      text: "Bạn có chắc chắn muốn đăng xuất không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    });

    if (result.isConfirmed) {
      console.log("User logged out");
      dispatch(logOutSuccess());
      navigate(routers.login);

      Swal.fire({
        title: "Đăng xuất thành công!",
        text: "Bạn đã đăng xuất khỏi hệ thống.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-xl",
        },
      });
    }
  };
  // Auto-open submenu if any of its items is active
  useEffect(() => {
    const currentPath = window.location.pathname;

    menuItems.forEach((item) => {
      if (item.submenu) {
        const hasActiveSubmenu = item.submenu.some(
          (subItem) => subItem.path === currentPath
        );
        if (hasActiveSubmenu && openSubmenu !== item.id) {
          setOpenSubmenu(item.id);
        }
      }
    });
  }, []);

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <FiHome size={20} />,
      path: routers.adminDashboard,
    },
    {
      id: "templates",
      label: "Quản lý Template",
      icon: <FiGrid size={20} />,
      path: routers.adminTemplates,
    },
    {
      id: "orders",
      label: "Quản lý Đơn hàng",
      icon: <FiShoppingBag size={20} />,
      path: routers.adminOrders,
    },
    {
      id: "users",
      label: "Quản lý Người dùng",
      icon: <FiUsers size={20} />,
      path: routers.adminUsers,
      submenu: [
        {
          id: "all-users",
          label: "Tất cả người dùng",
          icon: <FiUsers size={16} />,
          path: routers.adminUsers,
        },

        {
          id: "sellers",
          label: "Tác giả Template",
          icon: <FiEdit size={16} />,
          path: routers.adminSellers,
        },
      ],
    },
    {
      id: "analytics",
      label: "Thống kê & Báo cáo",
      icon: <FiBarChart2 size={20} />,
      path: routers.analytics,
    },
  ];

  const bottomMenuItems: MenuItem[] = [
    {
      id: "settings",
      label: "Cài đặt",
      icon: <FiSettings size={20} />,
      path: "/settings",
    },
    {
      id: "help",
      label: "Trợ giúp",
      icon: <FiHelpCircle size={20} />,
      path: "/help",
    },
  ];

  const toggleSubmenu = (itemId: string) => {
    if (openSubmenu === itemId) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(itemId);
    }
  };

  // Helper function to check if any submenu item is active
  const isSubmenuActive = (submenu: MenuItem[]) => {
    return submenu.some((subItem) => {
      return window.location.pathname === subItem.path;
    });
  };

  // Helper function to get active class for main menu items
  const getMainMenuClass = (
    isActive: boolean,
    hasActiveSubmenu: boolean = false
  ) => {
    const isMainActive = isActive || hasActiveSubmenu;
    return `w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
      isMainActive
        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-[1.02]"
        : "hover:bg-gray-100 text-gray-700 hover:shadow-sm"
    } ${isCollapsed ? "justify-center" : ""}`;
  };

  // Helper function to get active class for submenu items
  const getSubmenuClass = (isActive: boolean) => {
    return `w-full flex items-center space-x-3 p-3 rounded-lg text-sm transition-all duration-200 ${
      isActive
        ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-l-4 border-blue-500 shadow-sm font-medium ml-2"
        : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
    }`;
  };

  // Helper function to get active class for bottom menu items
  const getBottomMenuClass = (isActive: boolean) => {
    return `w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-gray-100 text-gray-900 font-medium shadow-sm"
        : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
    } ${isCollapsed ? "justify-center px-0" : ""}`;
  };

  return (
    <div
      className={`bg-white fixed z-50 left-0 top-0 bottom-0 shadow-xl transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-80"
      } flex flex-col border-r border-gray-200 h-full`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <FiGrid className="text-white" size={16} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">TemplateHub</h1>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />}
          </button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">AD</span>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900">Admin User</h3>
              <p className="text-xs text-gray-500">admin@templatehub.com</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <div key={item.id}>
            {item.submenu ? (
              <div>
                <NavLink
                  to={item.path || "#"}
                  className={({ isActive }) => {
                    const hasActiveSubmenu = isSubmenuActive(item.submenu!);
                    return getMainMenuClass(isActive, hasActiveSubmenu);
                  }}
                  onClick={() => toggleSubmenu(item.id)}
                >
                  {({ isActive }) => {
                    const hasActiveSubmenu = isSubmenuActive(item.submenu!);
                    const isMainActive = isActive || hasActiveSubmenu;

                    return (
                      <>
                        <div className="flex items-center space-x-3">
                          <span
                            className={
                              isMainActive ? "text-white" : "text-gray-500"
                            }
                          >
                            {item.icon}
                          </span>
                          {!isCollapsed && (
                            <span className="font-medium">{item.label}</span>
                          )}
                        </div>

                        {!isCollapsed && (
                          <div className="flex items-center space-x-2">
                            {item.badge && (
                              <span
                                className={`px-2 py-1 text-xs rounded-full font-medium ${
                                  isMainActive
                                    ? "bg-white/20 text-white"
                                    : "bg-blue-100 text-blue-600"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                            <FiChevronDown
                              className={`transition-transform duration-200 ${
                                openSubmenu === item.id ? "rotate-180" : ""
                              } ${
                                isMainActive ? "text-white" : "text-gray-400"
                              }`}
                              size={16}
                            />
                          </div>
                        )}
                      </>
                    );
                  }}
                </NavLink>

                {/* Submenu */}
                {!isCollapsed && openSubmenu === item.id && (
                  <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-100 pl-4">
                    {item.submenu.map((subItem) => (
                      <NavLink
                        key={subItem.id}
                        to={subItem.path || "#"}
                        className={({ isActive }) => getSubmenuClass(isActive)}
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={
                                isActive ? "text-blue-600" : "text-gray-400"
                              }
                            >
                              {subItem.icon}
                            </span>
                            <span>{subItem.label}</span>
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path || "#"}
                className={({ isActive }) => getMainMenuClass(isActive, false)}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <span
                        className={isActive ? "text-white" : "text-gray-500"}
                      >
                        {item.icon}
                      </span>
                      {!isCollapsed && (
                        <span className="font-medium">{item.label}</span>
                      )}
                    </div>
                    {!isCollapsed && item.badge && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 text-blue-600"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            )}
          </div>
        ))}
      </nav>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {bottomMenuItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path || "#"}
            className={({ isActive }) => getBottomMenuClass(isActive)}
          >
            {({ isActive }) => (
              <>
                <span className={isActive ? "text-gray-900" : "text-gray-500"}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
              </>
            )}
          </NavLink>
        ))}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${"hover:bg-gray-50 text-gray-600 hover:text-gray-900"} ${
            isCollapsed ? "justify-center px-0" : ""
          }`}
        >
          <>
            <span className={"text-gray-500"}>
              <FiLogOut size={20} />
            </span>
            {!isCollapsed && <span className="font-medium">Đăng xuất</span>}
          </>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
