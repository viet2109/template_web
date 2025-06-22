import React, { useMemo, useState } from "react";
import {
    FiAlertTriangle,
    FiCheck,
    FiCheckCircle,
    FiChevronLeft,
    FiChevronRight,
    FiClock,
    FiCreditCard,
    FiDownload,
    FiEdit,
    FiEye,
    FiFilter,
    FiMail,
    FiPackage,
    FiPhone,
    FiPrinter,
    FiRefreshCw,
    FiSearch,
    FiSend,
    FiTrash2,
    FiUser,
    FiXCircle,
} from "react-icons/fi";

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  templateName: string;
  templateCategory: string;
  amount: number;
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded";
  paymentMethod: string;
  transactionId: string;
  orderDate: string;
  completedDate?: string;
  downloadCount: number;
  maxDownloads: number;
}

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "1",
      orderNumber: "ORD-2024-001234",
      customerName: "Nguyễn Văn An",
      customerEmail: "an.nguyen@gmail.com",
      customerPhone: "0123456789",
      templateName: "Modern Business Landing Page",
      templateCategory: "Business",
      amount: 299000,
      status: "completed",
      paymentMethod: "VNPay",
      transactionId: "VNP-20241201-123456",
      orderDate: "2024-12-01T10:30:00",
      completedDate: "2024-12-01T10:35:00",
      downloadCount: 2,
      maxDownloads: 5,
    },
    {
      id: "2",
      orderNumber: "ORD-2024-001235",
      customerName: "Trần Thị Bình",
      customerEmail: "binh.tran@email.com",
      customerPhone: "0987654321",
      templateName: "E-commerce Dashboard Template",
      templateCategory: "Dashboard",
      amount: 599000,
      status: "processing",
      paymentMethod: "VNPay",
      transactionId: "VNP-20241202-789012",
      orderDate: "2024-12-02T14:20:00",
      downloadCount: 0,
      maxDownloads: 3,
    },
    {
      id: "3",
      orderNumber: "ORD-2024-001236",
      customerName: "Lê Hoàng Cường",
      customerEmail: "cuong.le@company.com",
      customerPhone: "0369852147",
      templateName: "Restaurant Website Template",
      templateCategory: "Restaurant",
      amount: 399000,
      status: "pending",
      paymentMethod: "VNPay",
      transactionId: "VNP-20241203-345678",
      orderDate: "2024-12-03T09:15:00",
      downloadCount: 0,
      maxDownloads: 5,
    },
    {
      id: "4",
      orderNumber: "ORD-2024-001237",
      customerName: "Phạm Thị Dung",
      customerEmail: "dung.pham@gmail.com",
      customerPhone: "0147258369",
      templateName: "Portfolio Creative Template",
      templateCategory: "Portfolio",
      amount: 199000,
      status: "cancelled",
      paymentMethod: "VNPay",
      transactionId: "VNP-20241203-901234",
      orderDate: "2024-12-03T16:45:00",
      downloadCount: 0,
      maxDownloads: 5,
    },
    {
      id: "5",
      orderNumber: "ORD-2024-001238",
      customerName: "Vũ Minh Đức",
      customerEmail: "duc.vu@tech.com",
      customerPhone: "0258147369",
      templateName: "SaaS Landing Page Kit",
      templateCategory: "SaaS",
      amount: 799000,
      status: "refunded",
      paymentMethod: "VNPay",
      transactionId: "VNP-20241204-567890",
      orderDate: "2024-12-04T11:30:00",
      downloadCount: 1,
      maxDownloads: 3,
    },
    // Add more sample data for pagination demonstration
    {
      id: "6",
      orderNumber: "ORD-2024-001239",
      customerName: "Hoàng Thị Lan",
      customerEmail: "lan.hoang@gmail.com",
      customerPhone: "0123987654",
      templateName: "Blog Template Modern",
      templateCategory: "Blog",
      amount: 149000,
      status: "completed",
      paymentMethod: "VNPay",
      transactionId: "VNP-20241205-111111",
      orderDate: "2024-12-05T08:15:00",
      completedDate: "2024-12-05T08:20:00",
      downloadCount: 1,
      maxDownloads: 5,
    },
    {
      id: "7",
      orderNumber: "ORD-2024-001240",
      customerName: "Đặng Văn Hùng",
      customerEmail: "hung.dang@company.vn",
      customerPhone: "0987123456",
      templateName: "Corporate Website Template",
      templateCategory: "Corporate",
      amount: 499000,
      status: "processing",
      paymentMethod: "VNPay",
      transactionId: "VNP-20241205-222222",
      orderDate: "2024-12-05T14:30:00",
      downloadCount: 0,
      maxDownloads: 3,
    },
    {
      id: "8",
      orderNumber: "ORD-2024-001241",
      customerName: "Lý Thị Mai",
      customerEmail: "mai.ly@email.com",
      customerPhone: "0365741852",
      templateName: "Fashion Store Template",
      templateCategory: "E-commerce",
      amount: 699000,
      status: "pending",
      paymentMethod: "VNPay",
      transactionId: "VNP-20241206-333333",
      orderDate: "2024-12-06T10:45:00",
      downloadCount: 0,
      maxDownloads: 5,
    },
    // Add more orders to demonstrate pagination
    ...Array.from({ length: 15 }, (_, i) => ({
      id: `${i + 9}`,
      orderNumber: `ORD-2024-00${1242 + i}`,
      customerName: `Khách hàng ${i + 9}`,
      customerEmail: `customer${i + 9}@email.com`,
      customerPhone: `09${String(i + 9).padStart(8, "0")}`,
      templateName: `Template ${i + 9}`,
      templateCategory: [
        "Business",
        "Blog",
        "E-commerce",
        "Portfolio",
        "Restaurant",
      ][i % 5],
      amount: (i + 1) * 100000 + 99000,
      status: (
        ["pending", "processing", "completed", "cancelled", "refunded"] as const
      )[i % 5],
      paymentMethod: "VNPay",
      transactionId: `VNP-20241207-${String(i + 444444).padStart(6, "0")}`,
      orderDate: `2024-12-${String(7 + (i % 20)).padStart(2, "0")}T${String(
        9 + (i % 12)
      ).padStart(2, "0")}:${String((i * 5) % 60).padStart(2, "0")}:00`,
      completedDate:
        i % 5 === 2
          ? `2024-12-${String(7 + (i % 20)).padStart(2, "0")}T${String(
              10 + (i % 12)
            ).padStart(2, "0")}:${String((i * 5) % 60).padStart(2, "0")}:00`
          : undefined,
      downloadCount: i % 5 === 2 ? Math.floor(Math.random() * 3) + 1 : 0,
      maxDownloads: Math.floor(Math.random() * 3) + 3,
    })),
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportReport, setShowExportReport] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    processing: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-purple-100 text-purple-800",
  };

  const statusIcons = {
    pending: FiClock,
    processing: FiRefreshCw,
    completed: FiCheckCircle,
    cancelled: FiXCircle,
    refunded: FiRefreshCw,
  };

  const statusLabels = {
    pending: "Chờ xử lý",
    processing: "Đang xử lý",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    refunded: "Đã hoàn tiền",
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.templateName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, endIndex);

  // Pagination Component
  const Pagination = () => {
    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      return pages;
    };
    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Hiển thị {startIndex + 1} -{" "}
            {Math.min(endIndex, filteredOrders.length)} của{" "}
            {filteredOrders.length} kết quả
          </span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="ml-4 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={10}>10/trang</option>
            <option value={25}>25/trang</option>
            <option value={50}>50/trang</option>
            <option value={100}>100/trang</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronLeft size={16} />
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 rounded-lg border transition-colors ${
                currentPage === page
                  ? "bg-blue-600 text-white border-blue-600"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleUpdateStatus = (order: Order) => {
    setSelectedOrder(order);
    setShowStatusUpdate(true);
  };

  const handleSendEmail = (order: Order) => {
    setSelectedOrder(order);
    setShowEmailModal(true);
  };

  const handleDeleteOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowDeleteConfirm(true);
  };

  const handleEditOrder = (order: Order) => {
    setEditingOrder({ ...order });
  };

  const confirmDelete = () => {
    if (selectedOrder) {
      setOrders((prev) => prev.filter((o) => o.id !== selectedOrder.id));
      setShowDeleteConfirm(false);
      setSelectedOrder(null);
    }
  };

  const updateOrderStatus = (newStatus: Order["status"]) => {
    if (selectedOrder) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id
            ? {
                ...order,
                status: newStatus,
                completedDate:
                  newStatus === "completed"
                    ? new Date().toISOString()
                    : order.completedDate,
              }
            : order
        )
      );
      setShowStatusUpdate(false);
      setSelectedOrder(null);
    }
  };

  const saveOrderChanges = () => {
    if (editingOrder) {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === editingOrder.id ? editingOrder : order
        )
      );
      setEditingOrder(null);
    }
  };

  // Status Update Modal
  const StatusUpdateModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Cập nhật trạng thái
              </h3>
              <button
                onClick={() => setShowStatusUpdate(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiXCircle size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="text-sm text-gray-600">
              Đơn hàng:{" "}
              <span className="font-medium">{selectedOrder.orderNumber}</span>
            </div>
            <div className="text-sm text-gray-600">
              Trạng thái hiện tại:{" "}
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  statusColors[selectedOrder.status]
                }`}
              >
                {statusLabels[selectedOrder.status]}
              </span>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Trạng thái mới:
              </label>
              <div className="space-y-2">
                {Object.entries(statusLabels).map(([status, label]) => (
                  <button
                    key={status}
                    onClick={() => updateOrderStatus(status as Order["status"])}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all flex items-center gap-2 ${
                      selectedOrder.status === status
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {React.createElement(
                      statusIcons[status as keyof typeof statusIcons],
                      { size: 16 }
                    )}
                    <span>{label}</span>
                    {selectedOrder.status === status && (
                      <FiCheck className="ml-auto text-blue-600" size={16} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Email Modal
  const EmailModal = () => {
    const [emailType, setEmailType] = useState("order_confirmation");
    const [emailContent, setEmailContent] = useState("");

    if (!selectedOrder) return null;

    const emailTemplates = {
      order_confirmation: `Xin chào ${
        selectedOrder.customerName
      },\n\nCảm ơn bạn đã đặt hàng tại website của chúng tôi.\n\nThông tin đơn hàng:\n- Mã đơn hàng: ${
        selectedOrder.orderNumber
      }\n- Template: ${selectedOrder.templateName}\n- Giá trị: ${formatCurrency(
        selectedOrder.amount
      )}\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
      download_instructions: `Xin chào ${selectedOrder.customerName},\n\nĐơn hàng ${selectedOrder.orderNumber} của bạn đã được xử lý thành công.\n\nBạn có thể tải về template tại link sau: [DOWNLOAD_LINK]\n\nLưu ý: Bạn có thể tải về tối đa ${selectedOrder.maxDownloads} lần.\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
      support: `Xin chào ${selectedOrder.customerName},\n\nChúng tôi nhận thấy bạn có thể cần hỗ trợ với đơn hàng ${selectedOrder.orderNumber}.\n\nVui lòng liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào.\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
    };

    const sendEmail = () => {
      // Simulate email sending
      alert(`Email đã được gửi đến ${selectedOrder.customerEmail}`);
      setShowEmailModal(false);
      setSelectedOrder(null);
    };

    return (
      <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">Gửi email</h3>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiXCircle size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Người nhận:
                </label>
                <input
                  type="email"
                  value={selectedOrder.customerEmail}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại email:
                </label>
                <select
                  value={emailType}
                  onChange={(e) => {
                    setEmailType(e.target.value);
                    setEmailContent(
                      emailTemplates[
                        e.target.value as keyof typeof emailTemplates
                      ]
                    );
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="order_confirmation">Xác nhận đơn hàng</option>
                  <option value="download_instructions">
                    Hướng dẫn tải về
                  </option>
                  <option value="support">Hỗ trợ khách hàng</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung email:
              </label>
              <textarea
                value={
                  emailContent ||
                  emailTemplates[emailType as keyof typeof emailTemplates]
                }
                onChange={(e) => setEmailContent(e.target.value)}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={sendEmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FiSend size={16} />
                Gửi email
              </button>
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => {
    if (!selectedOrder) return null;

    return (
      <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <FiAlertTriangle className="text-red-600" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Xác nhận xóa
                </h3>
                <p className="text-gray-600">
                  Bạn có chắc chắn muốn xóa đơn hàng này?
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="font-medium text-gray-900">
                {selectedOrder.orderNumber}
              </p>
              <p className="text-sm text-gray-600">
                {selectedOrder.customerName}
              </p>
              <p className="text-sm text-gray-600">
                {selectedOrder.templateName}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa đơn hàng
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Export Report Modal
  const ExportReportModal = () => {
    const [reportType, setReportType] = useState("all_orders");
    const [dateRange, setDateRange] = useState("this_month");

    const exportReport = () => {
      // Simulate report export
      alert(`Đã xuất báo cáo ${reportType} cho ${dateRange}`);
      setShowExportReport(false);
    };

    return (
      <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-md w-full">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Xuất báo cáo
              </h3>
              <button
                onClick={() => setShowExportReport(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiXCircle size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại báo cáo:
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all_orders">Tất cả đơn hàng</option>
                <option value="completed_orders">Đơn hàng hoàn thành</option>
                <option value="revenue_report">Báo cáo doanh thu</option>
                <option value="customer_report">Báo cáo khách hàng</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khoảng thời gian:
              </label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="today">Hôm nay</option>
                <option value="this_week">Tuần này</option>
                <option value="this_month">Tháng này</option>
                <option value="last_month">Tháng trước</option>
                <option value="this_year">Năm này</option>
                <option value="all_time">Tất cả</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={exportReport}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 justify-center"
              >
                <FiDownload size={16} />
                Xuất Excel
              </button>
              <button
                onClick={() => setShowExportReport(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Edit Order Modal
  const EditOrderModal = () => {
    if (!editingOrder) return null;

    return (
      <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Chỉnh sửa đơn hàng
              </h3>
              <button
                onClick={() => setEditingOrder(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiXCircle size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên khách hàng:
                </label>
                <input
                  type="text"
                  value={editingOrder.customerName}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customerName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email:
                </label>
                <input
                  type="email"
                  value={editingOrder.customerEmail}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customerEmail: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại:
                </label>
                <input
                  type="tel"
                  value={editingOrder.customerPhone}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      customerPhone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giá trị (VND):
                </label>
                <input
                  type="number"
                  value={editingOrder.amount}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      amount: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số lần tải tối đa:
                </label>
                <input
                  type="number"
                  value={editingOrder.maxDownloads}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      maxDownloads: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái:
                </label>
                <select
                  value={editingOrder.status}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      status: e.target.value as Order["status"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(statusLabels).map(([status, label]) => (
                    <option key={status} value={status}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={saveOrderChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FiCheck size={16} />
                Lưu thay đổi
              </button>
              <button
                onClick={() => setEditingOrder(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Order Detail Modal (existing)
  const OrderDetailModal = () => {
    if (!selectedOrder) return null;

    const StatusIcon = statusIcons[selectedOrder.status];

    return (
      <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">
                Chi tiết đơn hàng
              </h3>
              <button
                onClick={() => setShowOrderDetail(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiXCircle size={24} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Thông tin đơn hàng
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mã đơn hàng:</span>
                      <span className="font-medium">
                        {selectedOrder.orderNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày đặt:</span>
                      <span>{formatDate(selectedOrder.orderDate)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Trạng thái:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          // Phần code còn thiếu để hoàn thiện OrderManagement component

                          statusColors[selectedOrder.status]
                        }`}
                      >
                        <StatusIcon size={12} />
                        {statusLabels[selectedOrder.status]}
                      </span>
                    </div>
                    {selectedOrder.completedDate && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày hoàn thành:</span>
                        <span>{formatDate(selectedOrder.completedDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Thông tin khách hàng
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <FiUser size={14} className="text-gray-400" />
                      <span>{selectedOrder.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMail size={14} className="text-gray-400" />
                      <span>{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiPhone size={14} className="text-gray-400" />
                      <span>{selectedOrder.customerPhone}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Thông tin sản phẩm
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Template:</span>
                      <span className="font-medium">
                        {selectedOrder.templateName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Danh mục:</span>
                      <span>{selectedOrder.templateCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Giá trị:</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(selectedOrder.amount)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Thông tin thanh toán
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phương thức:</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mã giao dịch:</span>
                      <span className="font-mono text-xs">
                        {selectedOrder.transactionId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Thông tin tải về
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Đã tải:</span>
                      <span>
                        {selectedOrder.downloadCount}/
                        {selectedOrder.maxDownloads} lần
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${
                            (selectedOrder.downloadCount /
                              selectedOrder.maxDownloads) *
                            100
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleUpdateStatus(selectedOrder)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FiRefreshCw size={16} />
                Cập nhật trạng thái
              </button>
              <button
                onClick={() => handleSendEmail(selectedOrder)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FiSend size={16} />
                Gửi email
              </button>
              <button
                onClick={() => handleEditOrder(selectedOrder)}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center gap-2"
              >
                <FiEdit size={16} />
                Chỉnh sửa
              </button>
              <button
                onClick={() => {
                  setShowOrderDetail(false);
                  window.print();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <FiPrinter size={16} />
                In đơn hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-gray-600 mt-2">
            Quản lý tất cả đơn hàng template của khách hàng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Tổng đơn hàng
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.length}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FiPackage className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">
                  {orders.filter((o) => o.status === "completed").length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <FiCheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {orders.filter((o) => o.status === "pending").length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <FiClock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(
                    orders
                      .filter((o) => o.status === "completed")
                      .reduce((sum, o) => sum + o.amount, 0)
                  )}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <FiCreditCard className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start justify-center">
              <div className="flex flex-1 flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative flex-1">
                  <FiSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng, khách hàng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                  />
                </div>

                <div className="relative">
                  <FiFilter
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    {Object.entries(statusLabels).map(([status, label]) => (
                      <option key={status} value={status}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowExportReport(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FiDownload size={16} />
                  Xuất báo cáo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                    Đơn hàng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-56">
                    Khách hàng
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">
                    Template
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Giá trị
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-28">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">
                    Ngày đặt
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Tải về
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-32">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="w-44">
                          <div
                            className="text-sm font-medium text-gray-900 truncate"
                            title={order.orderNumber}
                          >
                            {order.orderNumber}
                          </div>
                          <div
                            className="text-xs text-gray-500 truncate font-mono"
                            title={order.transactionId}
                          >
                            {order.transactionId}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-52">
                          <div
                            className="text-sm font-medium text-gray-900 truncate"
                            title={order.customerName}
                          >
                            {order.customerName}
                          </div>
                          <div
                            className="text-xs text-gray-500 truncate"
                            title={order.customerEmail}
                          >
                            {order.customerEmail}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-60">
                          <div
                            className="text-sm font-medium text-gray-900 truncate"
                            title={order.templateName}
                          >
                            {order.templateName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.templateCategory}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-28">
                          <div className="text-sm font-semibold text-gray-900">
                            {formatCurrency(order.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {order.paymentMethod}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-24">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              statusColors[order.status]
                            }`}
                          >
                            <StatusIcon size={10} />
                            <span className="truncate">
                              {statusLabels[order.status]}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-36">
                          <div className="text-xs text-gray-900">
                            {new Date(order.orderDate).toLocaleDateString(
                              "vi-VN"
                            )}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.orderDate).toLocaleTimeString(
                              "vi-VN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                          {order.completedDate && (
                            <div className="text-xs text-green-600 mt-1">
                              Hoàn thành:{" "}
                              {new Date(order.completedDate).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="w-20">
                          <div className="text-xs text-gray-900 font-medium">
                            {order.downloadCount}/{order.maxDownloads}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                              style={{
                                width: `${Math.min(
                                  (order.downloadCount / order.maxDownloads) *
                                    100,
                                  100
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="text-blue-600 hover:text-blue-900 p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Xem chi tiết"
                          >
                            <FiEye size={14} />
                          </button>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="text-green-600 hover:text-green-900 p-1.5 rounded-lg hover:bg-green-50 transition-colors"
                            title="Chỉnh sửa"
                          >
                            <FiEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleSendEmail(order)}
                            className="text-purple-600 hover:text-purple-900 p-1.5 rounded-lg hover:bg-purple-50 transition-colors"
                            title="Gửi email"
                          >
                            <FiSend size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order)}
                            className="text-red-600 hover:text-red-900 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            title="Xóa đơn hàng"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination />
        </div>
      </div>

      {/* Modals */}
      {showOrderDetail && <OrderDetailModal />}
      {showStatusUpdate && <StatusUpdateModal />}
      {showEmailModal && <EmailModal />}
      {showDeleteConfirm && <DeleteConfirmModal />}
      {showExportReport && <ExportReportModal />}
      {editingOrder && <EditOrderModal />}
    </div>
  );
};

export default OrderManagement;
