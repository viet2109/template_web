import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
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
  FiX,
} from "react-icons/fi";
import {
  HiOutlineCheckBadge,
  HiOutlineExclamationTriangle,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { MdPendingActions } from "react-icons/md"
import { fetchAdminUsers, GetUsersParams } from "../api/adminUser";
import { AdminUserDto, AuthProvider, Role, UserStatus } from "../types";

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRole, setSelectedRole] = useState<Role | "all">("all");
  const [selectedStatus, setSelectedStatus] = useState<UserStatus | "all">(
    "all"
  );
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [showUserModal, setShowUserModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<AdminUserDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    type: "single" | "bulk";
    userId?: number;
    count?: number;
  } | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [editFormData, setEditFormData] = useState<Partial<AdminUserDto>>({});

  // Build query params
  const queryParams: GetUsersParams = useMemo(() => {
    const params: GetUsersParams = {
      size: 20,
    };

    if (searchTerm) {
      if (searchTerm.includes("@")) {
        params.email = searchTerm;
      } else {
        params.name = searchTerm;
      }
    }

    if (selectedRole !== "all") {
      params.role = selectedRole;
    }

    return params;
  }, [searchTerm, selectedRole]);

  // Infinite query for users
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["admin-users", queryParams],
    queryFn: ({ pageParam = 0 }) =>
      fetchAdminUsers({ ...queryParams, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.page.number < lastPage.page.totalPages - 1) {
        return lastPage.page.number + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  // Flatten all users from all pages
  const allUsers = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) || [];
  }, [data]);

  // Filter users by status (client-side filtering for status since API doesn't support it)
  const filteredUsers = useMemo(() => {
    if (selectedStatus === "all") {
      return allUsers;
    }
    return allUsers.filter((user) => user.status === selectedStatus);
  }, [allUsers, selectedStatus]);

  // Stats calculation
  const stats = useMemo(() => {
    const totalFromLastPage =
      data?.pages[data.pages.length - 1]?.page.totalElements || 0;
    return {
      total: totalFromLastPage,
      active: filteredUsers.filter((u) => u.status === UserStatus.ACTIVE)
        .length,
      pending: filteredUsers.filter((u) => u.status === UserStatus.PENDING)
        .length,
      suspended: filteredUsers.filter((u) => u.status === UserStatus.SUSPENDED)
        .length,
      disabled: filteredUsers.filter((u) => u.status === UserStatus.DISABLED)
        .length,
      users: filteredUsers.filter((u) => u.roles.includes(Role.USER)).length,
      admins: filteredUsers.filter((u) => u.roles.includes(Role.ADMIN)).length,
      sellers: filteredUsers.filter((u) => u.roles.includes(Role.SELLER))
        .length,
    };
  }, [filteredUsers, data]);

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
    // TODO: Implement actual delete API calls
    console.log("Delete users:", deleteTarget);
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setSelectedUsers([]);
    refetch();
  };

  const handleUpdateUserStatus = (
    userId: number,
    newStatus: UserStatus
  ): void => {
    // TODO: Implement actual status update API call
    console.log("Update user status:", userId, newStatus);
    refetch();
  };

  const handleBulkStatusUpdate = (newStatus: UserStatus): void => {
    // TODO: Implement bulk status update API call
    console.log("Bulk update status:", selectedUsers, newStatus);
    setSelectedUsers([]);
    refetch();
  };

  const handleEditUser = (user: AdminUserDto): void => {
    setCurrentUser(user);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      status: user.status,
      roles: user.roles,
    });
    setShowUserModal(true);
  };

  const handleSaveUser = (): void => {
    if (currentUser && editFormData) {
      // TODO: Implement actual update API call
      console.log("Update user:", currentUser.id, editFormData);
      setShowUserModal(false);
      setCurrentUser(null);
      setEditFormData({});
      refetch();
    }
  };

  const handleAddUser = (formData: any): void => {
    // TODO: Implement actual create user API call
    console.log("Create user:", formData);
    setShowUserModal(false);
    setEditFormData({});
    refetch();
  };

  const getRoleBadge = (roles: Role): string => {
    if (roles === Role.ADMIN) {
      return "bg-purple-100 text-purple-800 border-purple-200";
    }
    if (roles === Role.SELLER) {
      return "bg-green-100 text-green-800 border-green-200";
    }
    return "bg-blue-100 text-blue-800 border-blue-200";
  };

  const getRoleLabel = (roles: Role): string => {
    if (roles === Role.ADMIN) return "Admin";
    if (roles === Role.SELLER) return "Seller";
    return "User";
  };

  const getStatusBadge = (status: UserStatus): string => {
    const badges: { [key in UserStatus]: string } = {
      [UserStatus.ACTIVE]: "bg-green-100 text-green-800",
      [UserStatus.PENDING]: "bg-yellow-100 text-yellow-800",
      [UserStatus.SUSPENDED]: "bg-red-100 text-red-800",
      [UserStatus.DISABLED]: "bg-gray-100 text-gray-800",
      [UserStatus.DELETED]: "bg-red-200 text-red-900",
    };
    return badges[status] || badges[UserStatus.ACTIVE];
  };

  const getStatusLabel = (status: UserStatus): string => {
    const labels: { [key in UserStatus]: string } = {
      [UserStatus.ACTIVE]: "Hoạt động",
      [UserStatus.PENDING]: "Chờ duyệt",
      [UserStatus.SUSPENDED]: "Tạm khóa",
      [UserStatus.DISABLED]: "Vô hiệu hóa",
      [UserStatus.DELETED]: "Đã xóa",
    };
    return labels[status] || "Không xác định";
  };

  const getProviderLabel = (provider: AuthProvider): string => {
    const labels: { [key in AuthProvider]: string } = {
      [AuthProvider.LOCAL]: "Tài khoản thường",
      [AuthProvider.GOOGLE]: "Google",
      [AuthProvider.FACEBOOK]: "Facebook",
    };
    return labels[provider] || "Không xác định";
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("vi-VN");
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
                  <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl">
                    {currentUser.firstName[0]}
                    {currentUser.lastName[0]}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {currentUser.firstName} {currentUser.lastName}
                    </h3>
                    <p className="text-gray-600">{currentUser.email}</p>
                    <p className="text-sm text-gray-500">
                      Tham gia: {formatDate(currentUser.createdAt)}
                    </p>
                    <p className="text-sm text-gray-500">
                      {getProviderLabel(currentUser.provider)}
                    </p>
                  </div>
                </div>

                {/* Edit Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ
                    </label>
                    <input
                      type="text"
                      value={editFormData.firstName || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tên
                    </label>
                    <input
                      type="text"
                      value={editFormData.lastName || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          lastName: e.target.value,
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
                      Trạng thái
                    </label>
                    <select
                      value={editFormData.status || ""}
                      onChange={(e) =>
                        setEditFormData((prev) => ({
                          ...prev,
                          status: e.target.value as UserStatus,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value={UserStatus.ACTIVE}>Hoạt động</option>
                      <option value={UserStatus.PENDING}>Chờ duyệt</option>
                      <option value={UserStatus.SUSPENDED}>Tạm khóa</option>
                      <option value={UserStatus.DISABLED}>Vô hiệu hóa</option>
                    </select>
                  </div>
                </div>

                {/* Activity Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {currentUser.totalOrders}
                    </p>
                    <p className="text-sm text-gray-600">Đơn hàng</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {formatCurrency(currentUser.totalSpent)}
                    </p>
                    <p className="text-sm text-gray-600">Tổng chi tiêu</p>
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
                    firstName: formData.get("firstName"),
                    lastName: formData.get("lastName"),
                    email: formData.get("email"),
                    phone: formData.get("phone"),
                  });
                }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    name="firstName"
                    type="text"
                    placeholder="Họ"
                    required
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    name="lastName"
                    type="text"
                    placeholder="Tên"
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
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
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

  if (isError) {
    return (
      <div className="p-4 m-6 rounded-lg lg:p-6 bg-white">
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiAlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Lỗi tải dữ liệu
          </h3>
          <p className="text-gray-600 mb-4">
            {error?.message || "Không thể tải danh sách người dùng"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 m-6 shadow-lg rounded-lg lg:p-6 bg-white">
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
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              <FiRefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              Làm mới
            </button>
            {/* <button
              onClick={() => setShowUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105"
            >
              <FiPlus className="w-4 h-4" />
              Thêm người dùng
            </button> */}
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
                <p className="text-purple-600 text-sm font-medium">Đang chờ xác thực</p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats.pending}
                </p>
              </div>
              <div className="p-3 bg-purple-600 rounded-lg">
                <MdPendingActions className="w-6 h-6 text-white" />
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
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as Role | "all")}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Tất cả vai trò</option>
              <option value={Role.USER}>Người dùng</option>
              <option value={Role.SELLER}>Người bán</option>
              <option value={Role.ADMIN}>Quản trị viên</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) =>
                setSelectedStatus(e.target.value as UserStatus | "all")
              }
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value={UserStatus.ACTIVE}>Hoạt động</option>
              <option value={UserStatus.PENDING}>Chờ duyệt</option>
              <option value={UserStatus.SUSPENDED}>Tạm khóa</option>
              <option value={UserStatus.DISABLED}>Vô hiệu hóa</option>
            </select>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              <FiFilter className="w-4 h-4" />
              Bộ lọc
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-blue-800 font-medium">
                Đã chọn {selectedUsers.length} người dùng
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleBulkStatusUpdate(UserStatus.ACTIVE)}
                  className="px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-all duration-200"
                >
                  Kích hoạt
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate(UserStatus.SUSPENDED)}
                  className="px-3 py-2 bg-yellow-600 text-white text-sm rounded-lg hover:bg-yellow-700 transition-all duration-200"
                >
                  Tạm khóa
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate(UserStatus.DISABLED)}
                  className="px-3 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-all duration-200"
                >
                  Vô hiệu hóa
                </button>
                <button
                  onClick={() => openDeleteModal("bulk")}
                  className="px-3 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-all duration-200"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <FiRefreshCw className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Users Table */}
      {!isLoading && (
        <div className="bg-white border border-gray-200 rounded-xl">
          {/* Desktop Table */}
          <div className="hidden lg:block  overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedUsers.length === filteredUsers.length &&
                        filteredUsers.length > 0
                      }
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Người dùng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vai trò
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hoạt động
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tham gia
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium mr-4">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <FiPhone className="w-3 h-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        {user.roles.map((role, _index) => (
                          <span
                            key={role}
                            className={`inline-flex m-1 items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(
                              role
                            )}`}
                          >
                            {getRoleLabel(role)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          user.status
                        )}`}
                      >
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-gray-600">
                          <FiActivity className="w-3 h-3" />
                          {user.updatedAt
                            ? formatLastLogin(user.updatedAt)
                            : "Chưa đăng nhập"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {user.totalOrders} đơn hàng •{" "}
                          {formatCurrency(user.totalSpent)}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
                          title="Chỉnh sửa"
                        >
                          <FiEdit3 className="w-4 h-4" />
                        </button>
                        <div className="relative group">
                          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200">
                            <FiMoreVertical className="w-4 h-4" />
                          </button>
                          <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                            <div className="py-1">
                              {user.status !== UserStatus.ACTIVE && (
                                <button
                                  onClick={() =>
                                    handleUpdateUserStatus(
                                      user.id,
                                      UserStatus.ACTIVE
                                    )
                                  }
                                  className="w-full px-4 py-2 text-left text-sm text-green-700 hover:bg-green-50 flex items-center gap-2"
                                >
                                  <FiUserCheck className="w-4 h-4" />
                                  Kích hoạt
                                </button>
                              )}
                              {user.status === UserStatus.ACTIVE && (
                                <button
                                  onClick={() =>
                                    handleUpdateUserStatus(
                                      user.id,
                                      UserStatus.SUSPENDED
                                    )
                                  }
                                  className="w-full px-4 py-2 text-left text-sm text-yellow-700 hover:bg-yellow-50 flex items-center gap-2"
                                >
                                  <FiUserX className="w-4 h-4" />
                                  Tạm khóa
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  window.open(`mailto:${user.email}`)
                                }
                                className="w-full px-4 py-2 text-left text-sm text-blue-700 hover:bg-blue-50 flex items-center gap-2"
                              >
                                <FiMail className="w-4 h-4" />
                                Gửi email
                              </button>
                              <button
                                onClick={() =>
                                  openDeleteModal("single", user.id)
                                }
                                className="w-full px-4 py-2 text-left text-sm text-red-700 hover:bg-red-50 flex items-center gap-2"
                              >
                                <FiTrash2 className="w-4 h-4" />
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-4 p-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-white border border-gray-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => handleSelectUser(user.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleEditUser(user)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all duration-200"
                  >
                    <FiEdit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Vai trò</p>
                    <div>
                      {user.roles.map((role, _index) => (
                        <span
                          className={`inline-flex items-center m-1 px-2 py-1 rounded-full text-xs font-medium border ${getRoleBadge(
                            role
                          )}`}
                        >
                          {getRoleLabel(role)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Trạng thái</p>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(
                        user.status
                      )}`}
                    >
                      {getStatusLabel(user.status)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiCalendar className="w-3 h-3" />
                      {formatDate(user.createdAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <FiActivity className="w-3 h-3" />
                      {user.updatedAt
                        ? formatLastLogin(user.updatedAt)
                        : "Chưa đăng nhập"}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {user.totalOrders} đơn hàng •{" "}
                    {formatCurrency(user.totalSpent)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredUsers.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <FiUsers className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không tìm thấy người dùng
              </h3>
              <p className="text-gray-600 mb-4">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedRole("all");
                  setSelectedStatus("all");
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center mt-6">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all duration-200 transform hover:scale-105"
          >
            {isFetchingNextPage ? (
              <>
                <FiRefreshCw className="w-4 h-4 animate-spin inline mr-2" />
                Đang tải...
              </>
            ) : (
              "Tải thêm"
            )}
          </button>
        </div>
      )}

      {/* Modals */}
      <DeleteModal />
      <UserModal />
    </div>
  );
};

export default UserManagement;
