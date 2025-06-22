import React, { useEffect, useState } from "react";
import {
  FiActivity,
  FiAlertTriangle,
  FiCalendar,
  FiEdit3,
  FiFilter,
  FiMail,
  FiMoreVertical,
  FiPhone,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiTrash2,
  FiUserCheck,
  FiUsers,
  FiUserX,
  FiX
} from "react-icons/fi";
import {
  HiOutlineCheckBadge,
  HiOutlineExclamationTriangle,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
} from "react-icons/hi2";

// Define User interface
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "admin" | "user";
  status: "active" | "inactive" | "pending" | "suspended";
  avatar: string;
  joinDate: string;
  lastLogin: string;
  totalPurchases: number;
  totalSpent: number;
  isVerified: boolean;
  location: string;
}

// Mock data
const mockUsers: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "nguyenvanan@gmail.com",
    phone: "0901234567",
    role: "user",
    status: "active",
    avatar:
      "https://ui-avatars.com/api/?name=Nguyen+Van+An&background=3b82f6&color=fff",
    joinDate: "2024-01-15",
    lastLogin: "2024-06-02T14:30:00",
    totalPurchases: 5,
    totalSpent: 1250000,
    isVerified: true,
    location: "Hồ Chí Minh",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "tranthibinh@gmail.com",
    phone: "0912345678",
    role: "user",
    status: "active",
    avatar:
      "https://ui-avatars.com/api/?name=Tran+Thi+Binh&background=10b981&color=fff",
    joinDate: "2024-02-20",
    lastLogin: "2024-06-03T09:15:00",
    totalPurchases: 12,
    totalSpent: 3450000,
    isVerified: true,
    location: "Hà Nội",
  },
  {
    id: 3,
    name: "Lê Minh Cường",
    email: "leminhcuong@gmail.com",
    phone: "0923456789",
    role: "admin",
    status: "active",
    avatar:
      "https://ui-avatars.com/api/?name=Le+Minh+Cuong&background=8b5cf6&color=fff",
    joinDate: "2023-12-01",
    lastLogin: "2024-06-03T16:45:00",
    totalPurchases: 0,
    totalSpent: 0,
    isVerified: true,
    location: "Đà Nẵng",
  },
  {
    id: 4,
    name: "Phạm Thị Dung",
    email: "phamthidung@gmail.com",
    phone: "0934567890",
    role: "user",
    status: "inactive",
    avatar:
      "https://ui-avatars.com/api/?name=Pham+Thi+Dung&background=f59e0b&color=fff",
    joinDate: "2024-03-10",
    lastLogin: "2024-05-15T11:20:00",
    totalPurchases: 2,
    totalSpent: 480000,
    isVerified: false,
    location: "Cần Thơ",
  },
  {
    id: 5,
    name: "Hoàng Văn Em",
    email: "hoangvanem@gmail.com",
    phone: "0945678901",
    role: "user",
    status: "pending",
    avatar:
      "https://ui-avatars.com/api/?name=Hoang+Van+Em&background=ef4444&color=fff",
    joinDate: "2024-05-25",
    lastLogin: "2024-06-01T08:30:00",
    totalPurchases: 0,
    totalSpent: 0,
    isVerified: false,
    location: "Hải Phòng",
  },
  {
    id: 6,
    name: "Vũ Thị Phương",
    email: "vuthiphuong@gmail.com",
    phone: "0956789012",
    role: "user",
    status: "active",
    avatar:
      "https://ui-avatars.com/api/?name=Vu+Thi+Phuong&background=06b6d4&color=fff",
    joinDate: "2024-04-08",
    lastLogin: "2024-06-03T13:00:00",
    totalPurchases: 8,
    totalSpent: 2100000,
    isVerified: true,
    location: "Bình Dương",
  },
  {
    id: 7,
    name: "Đỗ Minh Quân",
    email: "dominhquan@gmail.com",
    phone: "0967890123",
    role: "user",
    status: "active",
    avatar:
      "https://ui-avatars.com/api/?name=Do+Minh+Quan&background=84cc16&color=fff",
    joinDate: "2024-01-22",
    lastLogin: "2024-06-02T19:45:00",
    totalPurchases: 15,
    totalSpent: 4200000,
    isVerified: true,
    location: "Vũng Tàu",
  },
  {
    id: 8,
    name: "Ngô Thị Hương",
    email: "ngothihuong@gmail.com",
    phone: "0978901234",
    role: "user",
    status: "suspended",
    avatar:
      "https://ui-avatars.com/api/?name=Ngo+Thi+Huong&background=f97316&color=fff",
    joinDate: "2024-02-14",
    lastLogin: "2024-05-28T15:20:00",
    totalPurchases: 3,
    totalSpent: 720000,
    isVerified: false,
    location: "Nha Trang",
  },
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "single" | "bulk";
    userId?: number;
    count?: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<Partial<User>>({});

  // Stats calculation
  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    inactive: users.filter((u) => u.status === "inactive").length,
    pending: users.filter((u) => u.status === "pending").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    users: users.filter((u) => u.role === "user").length,
    admins: users.filter((u) => u.role === "admin").length,
    verified: users.filter((u) => u.isVerified).length,
  };

  // Filter and search logic
  useEffect(() => {
    let filtered: User[] = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm)
      );
    }

    if (selectedRole !== "all") {
      filtered = filtered.filter((user) => user.role === selectedRole);
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((user) => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, selectedRole, selectedStatus, users]);

  const handleSelectUser = (userId: number): void => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (): void => {
    setSelectedUsers(
      selectedUsers.length === filteredUsers.length
        ? []
        : filteredUsers.map((user) => user.id)
    );
  };

  const openDeleteModal = (type: "single" | "bulk", userId?: number): void => {
    if (type === "single" && userId) {
      setDeleteTarget({ type: "single", userId });
    } else if (type === "bulk") {
      setDeleteTarget({ type: "bulk", count: selectedUsers.length });
    }
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = (): void => {
    if (deleteTarget?.type === "single" && deleteTarget.userId) {
      setUsers((prev) =>
        prev.filter((user) => user.id !== deleteTarget.userId)
      );
    } else if (deleteTarget?.type === "bulk") {
      setUsers((prev) =>
        prev.filter((user) => !selectedUsers.includes(user.id))
      );
      setSelectedUsers([]);
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleUpdateUserStatus = (userId: number, newStatus: string): void => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId
          ? {
              ...user,
              status: newStatus as
                | "active"
                | "inactive"
                | "pending"
                | "suspended",
            }
          : user
      )
    );
  };

  const handleBulkStatusUpdate = (newStatus: string): void => {
    setUsers((prev) =>
      prev.map((user) =>
        selectedUsers.includes(user.id)
          ? {
              ...user,
              status: newStatus as
                | "active"
                | "inactive"
                | "pending"
                | "suspended",
            }
          : user
      )
    );
    setSelectedUsers([]);
  };

  const handleEditUser = (user: User): void => {
    setCurrentUser(user);
    setEditFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      location: user.location,
      isVerified: user.isVerified,
    });
    setShowUserModal(true);
  };

  const handleSaveUser = (): void => {
    if (currentUser && editFormData) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === currentUser.id ? { ...user, ...editFormData } : user
        )
      );
      setShowUserModal(false);
      setCurrentUser(null);
      setEditFormData({});
    }
  };

  const handleAddUser = (formData: any): void => {
    const newUser: User = {
      id: Math.max(...users.map((u) => u.id)) + 1,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      status: "pending",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        formData.name
      )}&background=3b82f6&color=fff`,
      joinDate: new Date().toISOString().split("T")[0],
      lastLogin: new Date().toISOString(),
      totalPurchases: 0,
      totalSpent: 0,
      isVerified: false,
      location: formData.location || "Chưa cập nhật",
    };
    setUsers((prev) => [...prev, newUser]);
    setShowUserModal(false);
    setEditFormData({});
  };

  const getRoleBadge = (role: string): string => {
    const badges: { [key: string]: string } = {
      admin: "bg-purple-100 text-purple-800 border-purple-200",
      user: "bg-blue-100 text-blue-800 border-blue-200",
    };
    return badges[role] || badges.user;
  };

  const getStatusBadge = (status: string): string => {
    const badges: { [key: string]: string } = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      suspended: "bg-red-100 text-red-800",
    };
    return badges[status] || badges.active;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatLastLogin = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Vừa truy cập";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 48) return "Hôm qua";
    return date.toLocaleDateString("vi-VN");
  };

  // Delete Confirmation Modal
  const DeleteModal: React.FC = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-xl max-w-md w-full transform animate-slideUp">
          <div className="p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
              <FiAlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Xác nhận xóa
              </h3>
              <p className="text-gray-600 mb-6">
                {deleteTarget?.type === "single"
                  ? "Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
                  : `Bạn có chắc chắn muốn xóa ${deleteTarget?.count} người dùng đã chọn? Hành động này không thể hoàn tác.`}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteTarget(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // User Modal (Edit/Add)
  const UserModal: React.FC = () => {
    if (!showUserModal) return null;

    const isEditing = !!currentUser;

    return (
      <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-fadeIn">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform animate-slideUp">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}
              </h2>
              <button
                onClick={() => {
                  setShowUserModal(false);
                  setCurrentUser(null);
                  setEditFormData({});
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:rotate-90"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            {isEditing ? (
              <div className="space-y-6">
                {/* User Avatar and Basic Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-16 h-16 rounded-full border-4 border-white shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentUser.name}
                    </h3>
                    <p className="text-gray-600">{currentUser.email}</p>
                    <p className="text-sm text-gray-500">
                      Tham gia:{" "}
                      {new Date(currentUser.joinDate).toLocaleDateString(
                        "vi-VN"
                      )}
                    </p>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      value={editFormData.name || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={editFormData.email || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Khu vực
                    </label>
                    <input
                      type="text"
                      value={editFormData.location || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Vai trò
                    </label>
                    <select
                      value={editFormData.role || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          role: e.target.value as "admin" | "user",
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Trạng thái
                    </label>
                    <select
                      value={editFormData.status || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          status: e.target.value as
                            | "active"
                            | "inactive"
                            | "pending"
                            | "suspended",
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="active">Hoạt động</option>
                      <option value="inactive">Không hoạt động</option>
                      <option value="pending">Chờ duyệt</option>
                      <option value="suspended">Tạm khóa</option>
                    </select>
                  </div>
                </div>

                {/* Verification Toggle */}
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Trạng thái xác thực
                    </h4>
                    <p className="text-sm text-gray-600">
                      Người dùng đã xác thực email và số điện thoại
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editFormData.isVerified || false}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          isVerified: e.target.checked,
                        }))
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {currentUser.totalPurchases}
                    </p>
                    <p className="text-sm text-gray-600">Đơn hàng</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(currentUser.totalSpent)}
                    </p>
                    <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {formatLastLogin(currentUser.lastLogin)}
                    </p>
                    <p className="text-sm text-gray-600">Truy cập cuối</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowUserModal(false);
                      setCurrentUser(null);
                      setEditFormData({});
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveUser}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <FiEdit3 className="w-4 h-4" />
                    Lưu thay đổi
                  </button>
                  <button
                    onClick={() => openDeleteModal("single", currentUser.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 transform hover:scale-105"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Xóa tài khoản
                  </button>
                </div>
              </div>
            ) : (
              /* Add User Form */
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target as HTMLFormElement);
                  handleAddUser({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                    role: formData.get("role"),
                    location: formData.get("location"),
                  });
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="name"
                    type="text"
                    placeholder="Họ và tên"
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    name="phone"
                    type="tel"
                    placeholder="Số điện thoại"
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    name="location"
                    type="text"
                    placeholder="Khu vực"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <select
                    name="role"
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 md:col-span-2"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowUserModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 transform hover:scale-105"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Tạo tài khoản
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 m-6 rounded-lg lg:p-6 bg-white">
      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Quản lý người dùng
            </h1>
            <p className="text-gray-600">
              Quản lý tài khoản và thông tin người dùng trong hệ thống
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => setIsLoading(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
            <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <FiPlus className="w-4 h-4" />
              Thêm người dùng
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm font-medium">
                  Tổng người dùng
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats.total}
                </p>
              </div>
              <div className="p-3 bg-blue-600 rounded-lg">
                <HiOutlineUserGroup className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm font-medium">
                  Đang hoạt động
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {stats.active}
                </p>
              </div>
              <div className="p-3 bg-green-600 rounded-lg">
                <FiUserCheck className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm font-medium">
                  Đã xác thực
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats.verified}
                </p>
              </div>
              <div className="p-3 bg-purple-600 rounded-lg">
                <HiOutlineCheckBadge className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm font-medium">Cần xử lý</p>
                <p className="text-2xl font-bold text-orange-900">
                  {stats.pending + stats.suspended}
                </p>
              </div>
              <div className="p-3 bg-orange-600 rounded-lg">
                <HiOutlineExclamationTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex gap-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="pending">Chờ duyệt</option>
                <option value="suspended">Tạm khóa</option>
              </select>
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              <FiFilter className="w-4 h-4" />
              Bộ lọc
            </button>
          </div>

          {/* Mobile Filters */}
          {showMobileFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200 space-y-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">Tất cả vai trò</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
                <option value="pending">Chờ duyệt</option>
                <option value="suspended">Tạm khóa</option>
              </select>
            </div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <HiOutlineShieldCheck className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Đã chọn {selectedUsers.length} người dùng
                  </span>
                </div>
                <button
                  onClick={() => setSelectedUsers([])}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
                >
                  Bỏ chọn tất cả
                </button>
              </div>
              <div className="flex gap-2">
                <select
                  onChange={(e) => {
                    if (e.target.value) {
                      handleBulkStatusUpdate(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Cập nhật trạng thái</option>
                  <option value="active">Kích hoạt</option>
                  <option value="inactive">Vô hiệu hóa</option>
                  <option value="suspended">Tạm khóa</option>
                </select>
                <button
                  onClick={() => openDeleteModal("bulk")}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-all duration-200 transform hover:scale-105"
                >
                  <FiTrash2 className="w-4 h-4" />
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {/* Table Header */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-gray-700">
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={
                selectedUsers.length === filteredUsers.length &&
                filteredUsers.length > 0
              }
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
            />
          </div>
          <div className="col-span-3">Người dùng</div>
          <div className="col-span-2">Liên hệ</div>
          <div className="col-span-2">Vai trò & Trạng thái</div>
          <div className="col-span-2">Hoạt động</div>
          <div className="col-span-2 text-center">Thao tác</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiUsers className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy người dùng
              </h3>
              <p className="text-gray-600">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="lg:grid lg:grid-cols-12 gap-4 p-4 hover:bg-gray-50 transition-all duration-200"
              >
                {/* Mobile Layout */}
                <div className="lg:hidden space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
                      />
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full border-2 border-gray-200"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {user.name}
                          {user.isVerified && (
                            <HiOutlineCheckBadge className="w-4 h-4 text-blue-500" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-sm text-gray-500">{user.phone}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        user.status
                      )}`}
                    >
                      {user.status === "active"
                        ? "Hoạt động"
                        : user.status === "inactive"
                        ? "Không hoạt động"
                        : user.status === "pending"
                        ? "Chờ duyệt"
                        : "Tạm khóa"}
                    </span>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex justify-between">
                      <span>Đơn hàng:</span>
                      <span className="font-medium">{user.totalPurchases}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chi tiêu:</span>
                      <span className="font-medium">
                        {formatCurrency(user.totalSpent)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Truy cập cuối:</span>
                      <span className="font-medium">
                        {formatLastLogin(user.lastLogin)}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm transition-all duration-200 transform hover:scale-105"
                    >
                      <FiEdit3 className="w-4 h-4" />
                      Chỉnh sửa
                    </button>
                    <button
                      onClick={() => openDeleteModal("single", user.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-all duration-200 transform hover:scale-105"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:contents">
                  {/* Checkbox */}
                  <div className="col-span-1 flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200"
                    />
                  </div>

                  {/* User Info */}
                  <div className="col-span-3 flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full border-2 border-gray-200"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        {user.name}
                        {user.isVerified && (
                          <HiOutlineCheckBadge className="w-4 h-4 text-blue-500" />
                        )}
                      </h3>
                      <p className="text-sm text-gray-600">{user.location}</p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="col-span-2 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <FiMail className="w-4 h-4 text-gray-400" />
                      <span>{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FiPhone className="w-4 h-4 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  </div>

                  {/* Role & Status */}
                  <div className="col-span-2 space-y-2">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(
                        user.role
                      )}`}
                    >
                      {user.role === "admin" ? "Admin" : "User"}
                    </span>
                    <span
                      className={`block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        user.status
                      )} w-fit`}
                    >
                      {user.status === "active"
                        ? "Hoạt động"
                        : user.status === "inactive"
                        ? "Không hoạt động"
                        : user.status === "pending"
                        ? "Chờ duyệt"
                        : "Tạm khóa"}
                    </span>
                  </div>

                  {/* Activity */}
                  <div className="col-span-2 space-y-1 text-sm">
                    <div className="flex items-center gap-2">
                      <FiActivity className="w-4 h-4 text-gray-400" />
                      <span>{user.totalPurchases} đơn hàng</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiCalendar className="w-4 h-4 text-gray-400" />
                      <span>{formatLastLogin(user.lastLogin)}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Chỉnh sửa"
                    >
                      <FiEdit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openDeleteModal("single", user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 transform hover:scale-110"
                      title="Xóa"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>

                    {/* Status Quick Actions */}
                    <div className="relative group">
                      <button className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200">
                        <FiMoreVertical className="w-4 h-4" />
                      </button>
                      <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-48">
                        <div className="p-2">
                          <button
                            onClick={() =>
                              handleUpdateUserStatus(user.id, "active")
                            }
                            className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                          >
                            <FiUserCheck className="w-4 h-4 inline mr-2" />
                            Kích hoạt
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateUserStatus(user.id, "inactive")
                            }
                            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded transition-colors duration-200"
                          >
                            <FiUserX className="w-4 h-4 inline mr-2" />
                            Vô hiệu hóa
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateUserStatus(user.id, "suspended")
                            }
                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                          >
                            <FiAlertTriangle className="w-4 h-4 inline mr-2" />
                            Tạm khóa
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredUsers.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredUsers.length} trong tổng số {stats.total} người
            dùng
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-all duration-200">
              Trước
            </button>
            <button className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm transition-all duration-200">
              Sau
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <UserModal />
      <DeleteModal />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3">
              <FiRefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
              <span className="text-gray-900 font-medium">
                Đang tải dữ liệu...
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
