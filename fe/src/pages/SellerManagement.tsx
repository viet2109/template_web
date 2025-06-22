import React, { useEffect, useState } from "react";

import {
  FiCalendar,
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiDollarSign,
  FiDownload,
  FiEdit3,
  FiEye,
  FiSearch,
  FiTrash,
  FiUser,
  FiX,
} from "react-icons/fi";

// Mock data cho sellers
const mockSellers = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    joinDate: "2024-01-15",
    status: "active",
    totalTemplates: 25,
    totalRevenue: 15000000,
    avatar:
      "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=3b82f6&color=white",
    shopName: "A Template Store",
    rating: 4.8,
    lastActive: "2024-06-02",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com",
    phone: "0907654321",
    joinDate: "2024-02-20",
    status: "pending",
    totalTemplates: 12,
    totalRevenue: 8500000,
    avatar:
      "https://ui-avatars.com/api/?name=Tran+Thi+B&background=ef4444&color=white",
    shopName: "B Design Hub",
    rating: 4.2,
    lastActive: "2024-06-01",
  },
  {
    id: 3,
    name: "Lê Minh C",
    email: "leminhc@email.com",
    phone: "0912345678",
    joinDate: "2023-12-10",
    status: "suspended",
    totalTemplates: 45,
    totalRevenue: 32000000,
    avatar:
      "https://ui-avatars.com/api/?name=Le+Minh+C&background=f59e0b&color=white",
    shopName: "C Creative Studio",
    rating: 4.9,
    lastActive: "2024-05-30",
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    phone: "0923456789",
    joinDate: "2024-03-05",
    status: "active",
    totalTemplates: 18,
    totalRevenue: 12000000,
    avatar:
      "https://ui-avatars.com/api/?name=Pham+Thi+D&background=10b981&color=white",
    shopName: "D Template World",
    rating: 4.5,
    lastActive: "2024-06-03",
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    phone: "0934567890",
    joinDate: "2024-01-25",
    status: "active",
    totalTemplates: 33,
    totalRevenue: 22000000,
    avatar:
      "https://ui-avatars.com/api/?name=Hoang+Van+E&background=8b5cf6&color=white",
    shopName: "E Digital Solutions",
    rating: 4.7,
    lastActive: "2024-06-02",
  },
];

const SellerManagement: React.FC = () => {
  const [sellers, setSellers] = useState(mockSellers);
  const [filteredSellers, setFilteredSellers] = useState(mockSellers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "pending" | "suspended"
  >("all");
  const [sortBy, setSortBy] = useState<
    "name" | "joinDate" | "totalRevenue" | "rating"
  >("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [selectedSellers, setSelectedSellers] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"view" | "edit" | "delete" | "">(
    ""
  );
  const [selectedSeller, setSelectedSeller] = useState<
    (typeof mockSellers)[0] | null
  >(null);

  // Filter và search logic
  useEffect(() => {
    let filtered = sellers.filter((seller) => {
      const matchesSearch =
        seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seller.shopName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || seller.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aVal: string | number = a[sortBy];
      let bVal: string | number = b[sortBy];

      if (sortBy === "totalRevenue" || sortBy === "rating") {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredSellers(filtered);
    setCurrentPage(1);
  }, [sellers, searchTerm, statusFilter, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredSellers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentSellers = filteredSellers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { bg: string; text: string; label: string }
    > = {
      active: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Hoạt động",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        label: "Chờ duyệt",
      },
      suspended: { bg: "bg-red-100", text: "text-red-800", label: "Tạm khóa" },
    };
    const config = statusConfig[status] || {
      bg: "bg-gray-100",
      text: "text-gray-800",
      label: status,
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const handleAction = (
    action: "view" | "edit" | "delete",
    seller: (typeof mockSellers)[0]
  ) => {
    setSelectedSeller(seller);
    setModalType(action);
    setShowModal(true);
  };

  const handleBulkAction = (action: "approve" | "suspend") => {
    // Tùy nhu cầu, implement xử lý backend ở đây
    console.log(`Bulk action: ${action} for sellers:`, selectedSellers);
    setSelectedSellers([]);
  };

  // Modal component
  const Modal: React.FC = () => {
    if (!showModal || !selectedSeller || !modalType) return null;

    let title = "";
    let content: React.ReactNode = null;

    if (modalType === "view") {
      title = "Chi tiết Seller";
      content = (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src={selectedSeller.avatar}
              alt={selectedSeller.name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold">{selectedSeller.name}</h3>
              <p className="text-gray-600">{selectedSeller.shopName}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Email:</strong> {selectedSeller.email}
            </div>
            <div>
              <strong>Điện thoại:</strong> {selectedSeller.phone}
            </div>
            <div>
              <strong>Ngày tham gia:</strong>{" "}
              {formatDate(selectedSeller.joinDate)}
            </div>
            <div>
              <strong>Trạng thái:</strong>{" "}
              {getStatusBadge(selectedSeller.status)}
            </div>
            <div>
              <strong>Tổng template:</strong> {selectedSeller.totalTemplates}
            </div>
            <div>
              <strong>Doanh thu:</strong>{" "}
              {formatCurrency(selectedSeller.totalRevenue)}
            </div>
            <div>
              <strong>Đánh giá:</strong> ⭐ {selectedSeller.rating}
            </div>
            <div>
              <strong>Hoạt động cuối:</strong>{" "}
              {formatDate(selectedSeller.lastActive)}
            </div>
          </div>
        </div>
      );
    } else if (modalType === "edit") {
      title = "Chỉnh sửa thông tin Seller";
      content = (
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Tên</label>
            <input
              type="text"
              defaultValue={selectedSeller.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              defaultValue={selectedSeller.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              defaultValue={selectedSeller.phone}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tên shop</label>
            <input
              type="text"
              defaultValue={selectedSeller.shopName}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Trạng thái</label>
            <select
              defaultValue={selectedSeller.status}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Hoạt động</option>
              <option value="pending">Chờ duyệt</option>
              <option value="suspended">Tạm khóa</option>
            </select>
          </div>
        </form>
      );
    } else if (modalType === "delete") {
      title = "Xác nhận xóa";
      content = (
        <div>
          <p>
            Bạn có chắc chắn muốn xóa seller{" "}
            <strong>{selectedSeller.name}</strong>?
          </p>
          <p className="text-red-600 text-sm mt-2">
            Hành động này không thể hoàn tác!
          </p>
        </div>
      );
    }

    return (
      <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 px-4">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={() => setShowModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiX />
            </button>
          </div>
          {content}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowModal(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Hủy
            </button>
            {modalType !== "view" && (
              <button
                className={`px-4 py-2 text-white rounded-md ${
                  modalType === "delete"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {modalType === "delete" ? "Xóa" : "Lưu"}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 lg:p-6 m-6 rounded-xl bg-white min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Quản lý Seller
        </h1>
        <p className="text-gray-600">
          Quản lý thông tin và hoạt động của các seller trên hệ thống
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Tổng Seller</p>
              <p className="text-3xl font-bold">{sellers.length}</p>
            </div>
            <FiUser className="text-4xl text-blue-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Đang hoạt động</p>
              <p className="text-3xl font-bold">
                {sellers.filter((s) => s.status === "active").length}
              </p>
            </div>
            <FiCheck className="text-4xl text-green-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100">Chờ duyệt</p>
              <p className="text-3xl font-bold">
                {sellers.filter((s) => s.status === "pending").length}
              </p>
            </div>
            <FiCalendar className="text-4xl text-yellow-200" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Tổng doanh thu</p>
              <p className="text-xl font-bold">
                {formatCurrency(
                  sellers.reduce((sum, s) => sum + s.totalRevenue, 0)
                )}
              </p>
            </div>
            <FiDollarSign className="text-4xl text-purple-200" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email hoặc tên shop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "all" | "active" | "pending" | "suspended"
                )
              }
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="pending">Chờ duyệt</option>
              <option value="suspended">Tạm khóa</option>
            </select>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split("-");
                setSortBy(
                  field as "name" | "joinDate" | "totalRevenue" | "rating"
                );
                setSortOrder(order as "asc" | "desc");
              }}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="name-asc">Tên A-Z</option>
              <option value="name-desc">Tên Z-A</option>
              <option value="joinDate-desc">Mới nhất</option>
              <option value="joinDate-asc">Cũ nhất</option>
              <option value="totalRevenue-desc">Doanh thu cao nhất</option>
              <option value="totalRevenue-asc">Doanh thu thấp nhất</option>
              <option value="rating-desc">Đánh giá cao nhất</option>
            </select>

            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center gap-2">
              <FiDownload />
              Export
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedSellers.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-md">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-sm text-blue-700">
                Đã chọn {selectedSellers.length} seller(s)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleBulkAction("approve")}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                >
                  Duyệt
                </button>
                <button
                  onClick={() => handleBulkAction("suspend")}
                  className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Tạm khóa
                </button>
                <button
                  onClick={() => setSelectedSellers([])}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Hủy chọn
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Table - Desktop */}
      <div className="hidden lg:block bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSellers(currentSellers.map((s) => s.id));
                      } else {
                        setSelectedSellers([]);
                      }
                    }}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Seller
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Templates
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doanh thu
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Đánh giá
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentSellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSellers.includes(seller.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedSellers([...selectedSellers, seller.id]);
                        } else {
                          setSelectedSellers(
                            selectedSellers.filter((id) => id !== seller.id)
                          );
                        }
                      }}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center">
                      <img
                        src={seller.avatar}
                        alt={seller.name}
                        className="w-10 h-10 rounded-full mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {seller.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {seller.shopName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm text-gray-900">{seller.email}</div>
                    <div className="text-sm text-gray-500">{seller.phone}</div>
                  </td>
                  <td className="px-4 py-4">{getStatusBadge(seller.status)}</td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {seller.totalTemplates}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {formatCurrency(seller.totalRevenue)}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    ⭐ {seller.rating}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAction("view", seller)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Xem chi tiết"
                      >
                        <FiEye />
                      </button>
                      <button
                        onClick={() => handleAction("edit", seller)}
                        className="text-green-600 hover:text-green-800"
                        title="Chỉnh sửa"
                      >
                        <FiEdit3 />
                      </button>
                      <button
                        onClick={() => handleAction("delete", seller)}
                        className="text-red-600 hover:text-red-800"
                        title="Xóa"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {currentSellers.map((seller) => (
          <div
            key={seller.id}
            className="bg-white border border-gray-200 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={selectedSellers.includes(seller.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedSellers([...selectedSellers, seller.id]);
                    } else {
                      setSelectedSellers(
                        selectedSellers.filter((id) => id !== seller.id)
                      );
                    }
                  }}
                  className="rounded mr-3"
                />
                <img
                  src={seller.avatar}
                  alt={seller.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h3 className="font-medium text-gray-900">{seller.name}</h3>
                  <p className="text-sm text-gray-500">{seller.shopName}</p>
                </div>
              </div>
              {getStatusBadge(seller.status)}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-3">
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="font-medium">{seller.email}</p>
              </div>
              <div>
                <span className="text-gray-500">SĐT:</span>
                <p className="font-medium">{seller.phone}</p>
              </div>
              <div>
                <span className="text-gray-500">Templates:</span>
                <p className="font-medium">{seller.totalTemplates}</p>
              </div>
              <div>
                <span className="text-gray-500">Đánh giá:</span>
                <p className="font-medium">⭐ {seller.rating}</p>
              </div>
            </div>

            <div className="mb-3">
              <span className="text-gray-500 text-sm">Doanh thu:</span>
              <p className="font-medium text-green-600">
                {formatCurrency(seller.totalRevenue)}
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleAction("view", seller)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
              >
                <FiEye />
              </button>
              <button
                onClick={() => handleAction("edit", seller)}
                className="p-2 text-green-600 hover:bg-green-50 rounded"
              >
                <FiEdit3 />
              </button>
              <button
                onClick={() => handleAction("delete", seller)}
                className="p-2 text-red-600 hover:bg-red-50 rounded"
              >
                <FiTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Hiển thị {startIndex + 1} -{" "}
          {Math.min(startIndex + itemsPerPage, filteredSellers.length)} của{" "}
          {filteredSellers.length} kết quả
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>

          <div className="flex space-x-1">
            {Array.from({ length: totalPages > 5 ? 5 : totalPages }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-2 text-sm rounded ${
                    currentPage === pageNum
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* No results */}
      {filteredSellers.length === 0 && (
        <div className="text-center py-12">
          <FiUser className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Không tìm thấy seller nào
          </h3>
          <p className="text-gray-500">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      )}

      {/* Modal */}
      <Modal />
    </div>
  );
};

export default SellerManagement;
