import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  FiAlertTriangle,
  FiCheck,
  FiCheckCircle,
  FiChevronRight,
  FiClock,
  FiCreditCard,
  FiDownload,
  FiEdit,
  FiEye,
  FiLoader,
  FiMail,
  FiPackage,
  FiPrinter,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiTrash2,
  FiUser,
  FiXCircle,
} from "react-icons/fi";

// Import types from your existing type definitions
import {
  AdminOrderAnalyticsDto,
  AdminOrderDto,
  LicenseType,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from "../types"; // Adjust import path as needed

// Import API function
import {
  fetchAdminOrders,
  fetchAnalytic,
  GetOrdersParams,
} from "../api/adminOrder"; // Adjust import path as needed

const OrderManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<
    PaymentStatus | "all"
  >("all");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderDto | null>(
    null
  );
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExportReport, setShowExportReport] = useState(false);
  const [editingOrder, setEditingOrder] = useState<AdminOrderDto | null>(null);
  const [pageSize, setPageSize] = useState(10);

  // Analytics Query
  const {
    data: analyticsData,
    isLoading: analyticsLoading,
    isError: analyticsError,
    refetch: refetchAnalytics,
  } = useQuery<AdminOrderAnalyticsDto>({
    queryKey: ["admin-orders-analytics"],
    queryFn: fetchAnalytic,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // API Query
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
    queryKey: [
      "admin-orders",
      // searchQuery,
      statusFilter,
      paymentStatusFilter,
      pageSize,
    ],
    queryFn: ({ pageParam = 0 }) => {
      const params: GetOrdersParams = {
        page: pageParam,
        size: pageSize,
        status: statusFilter !== "all" ? statusFilter : undefined,
        paymentStatus:
          paymentStatusFilter !== "all" ? paymentStatusFilter : undefined,
        sort: ["createdAt,desc"],
      };
      return fetchAdminOrders(params);
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page.number < lastPage.page.totalPages - 1) {
        return lastPage.page.number + 1;
      }
      return undefined;
    },
    initialPageParam: 0,
  });

  // Flatten all pages data
  const orders = useMemo(() => {
    return data?.pages.flatMap((page) => page.content) || [];
  }, [data]);

  const totalElements = data?.pages[0]?.page.totalElements || 0;

  const statusColors = {
    [OrderStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [OrderStatus.PROCESSING]: "bg-blue-100 text-blue-800",
    [OrderStatus.COMPLETED]: "bg-green-100 text-green-800",
    [OrderStatus.CANCELLED]: "bg-red-100 text-red-800",
    [OrderStatus.REFUNDED]: "bg-purple-100 text-purple-800",
  };

  const paymentStatusColors = {
    [PaymentStatus.PENDING]: "bg-yellow-100 text-yellow-800",
    [PaymentStatus.PAID]: "bg-green-100 text-green-800",
    [PaymentStatus.FAILED]: "bg-red-100 text-red-800",
    [PaymentStatus.REFUNDED]: "bg-purple-100 text-purple-800",
  };

  const statusIcons = {
    [OrderStatus.PENDING]: FiClock,
    [OrderStatus.PROCESSING]: FiRefreshCw,
    [OrderStatus.COMPLETED]: FiCheckCircle,
    [OrderStatus.CANCELLED]: FiXCircle,
    [OrderStatus.REFUNDED]: FiRefreshCw,
  };

  const statusLabels = {
    [OrderStatus.PENDING]: "Chờ xử lý",
    [OrderStatus.PROCESSING]: "Đang xử lý",
    [OrderStatus.COMPLETED]: "Hoàn thành",
    [OrderStatus.CANCELLED]: "Đã hủy",
    [OrderStatus.REFUNDED]: "Đã hoàn tiền",
  };

  const paymentStatusLabels = {
    [PaymentStatus.PENDING]: "Chờ thanh toán",
    [PaymentStatus.PAID]: "Đã thanh toán",
    [PaymentStatus.FAILED]: "Thất bại",
    [PaymentStatus.REFUNDED]: "Đã hoàn tiền",
  };

  const paymentMethodLabels = {
    [PaymentMethod.VNPAY]: "VNPay",
    [PaymentMethod.PAYPAL]: "PayPal",
    [PaymentMethod.STRIPE]: "Stripe",
    [PaymentMethod.COD]: "COD",
    [PaymentMethod.BANK_TRANSFER]: "Chuyển khoản",
  };

  const licenseTypeLabels = {
    [LicenseType.SINGLE]: "Đơn lẻ",
    [LicenseType.MULTIPLE]: "Nhiều",
    [LicenseType.EXTENDED]: "Mở rộng",
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

  const handleViewOrder = (order: AdminOrderDto) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handleUpdateStatus = (order: AdminOrderDto) => {
    setSelectedOrder(order);
    setShowStatusUpdate(true);
  };

  const handleSendEmail = (order: AdminOrderDto) => {
    setSelectedOrder(order);
    setShowEmailModal(true);
  };

  const handleDeleteOrder = (order: AdminOrderDto) => {
    setSelectedOrder(order);
    setShowDeleteConfirm(true);
  };

  const handleEditOrder = (order: AdminOrderDto) => {
    setEditingOrder({ ...order });
  };

  const confirmDelete = () => {
    if (selectedOrder) {
      // TODO: Implement delete API call
      console.log("Delete order:", selectedOrder.id);
      setShowDeleteConfirm(false);
      setSelectedOrder(null);
      refetch();
      refetchAnalytics();
    }
  };

  const updateOrderStatus = (newStatus: OrderStatus) => {
    if (selectedOrder) {
      // TODO: Implement update status API call
      console.log("Update order status:", selectedOrder.id, newStatus);
      setShowStatusUpdate(false);
      setSelectedOrder(null);
      refetch();
      refetchAnalytics();
    }
  };

  const saveOrderChanges = () => {
    if (editingOrder) {
      // TODO: Implement update order API call
      console.log("Update order:", editingOrder);
      setEditingOrder(null);
      refetch();
      refetchAnalytics();
    }
  };

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <FiLoader className="animate-spin" size={20} />
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-2">
            <FiAlertTriangle size={48} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-4">
            {error?.message || "Không thể tải dữ liệu đơn hàng"}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

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
              Đơn hàng: <span className="font-medium">#{selectedOrder.id}</span>
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
                    onClick={() => updateOrderStatus(status as OrderStatus)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all flex items-center gap-2 ${
                      selectedOrder.status === status
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {React.createElement(statusIcons[status as OrderStatus], {
                      size: 16,
                    })}
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

    const customerName = `${selectedOrder.user.firstName} ${selectedOrder.user.lastName}`;
    const customerEmail = selectedOrder.user.email;

    const emailTemplates = {
      order_confirmation: `Xin chào ${customerName},\n\nCảm ơn bạn đã đặt hàng tại website của chúng tôi.\n\nThông tin đơn hàng:\n- Mã đơn hàng: #${
        selectedOrder.id
      }\n- Giá trị: ${formatCurrency(
        selectedOrder.orderItems.reduce((sum, item) => sum + item.price, 0)
      )}\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
      download_instructions: `Xin chào ${customerName},\n\nĐơn hàng #${selectedOrder.id} của bạn đã được xử lý thành công.\n\nBạn có thể tải về template trong tài khoản của mình.\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
      support: `Xin chào ${customerName},\n\nChúng tôi nhận thấy bạn có thể cần hỗ trợ với đơn hàng #${selectedOrder.id}.\n\nVui lòng liên hệ với chúng tôi nếu bạn có bất kỳ thắc mắc nào.\n\nTrân trọng,\nĐội ngũ hỗ trợ`,
    };

    const sendEmail = () => {
      // TODO: Implement send email API call
      alert(`Email đã được gửi đến ${customerEmail}`);
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
                  value={customerEmail}
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
              <p className="font-medium text-gray-900">#{selectedOrder.id}</p>
              <p className="text-sm text-gray-600">
                {selectedOrder.user.firstName} {selectedOrder.user.lastName}
              </p>
              <p className="text-sm text-gray-600">
                {selectedOrder.orderItems.length} sản phẩm
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
      // TODO: Implement export report API call
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

  // Order Detail Modal
  const OrderDetailModal = () => {
    if (!selectedOrder) return null;

    const StatusIcon = statusIcons[selectedOrder.status];
    const customerName = `${selectedOrder.user.firstName} ${selectedOrder.user.lastName}`;
    const totalAmount = selectedOrder.orderItems.reduce(
      (sum, item) => sum + item.price,
      0
    );

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
                      <span className="font-medium">#{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Ngày đặt:</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Trạng thái:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                          statusColors[selectedOrder.status]
                        }`}
                      >
                        <StatusIcon size={12} />
                        {statusLabels[selectedOrder.status]}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Thanh toán:</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          paymentStatusColors[selectedOrder.paymentStatus]
                        }`}
                      >
                        {paymentStatusLabels[selectedOrder.paymentStatus]}
                      </span>
                    </div>
                    {selectedOrder.completedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-500">Ngày hoàn thành:</span>
                        <span>{formatDate(selectedOrder.completedAt)}</span>
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
                      <span>{customerName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiMail size={14} className="text-gray-400" />
                      <span>{selectedOrder.user.email}</span>
                    </div>
                    {selectedOrder.user.avatar && (
                      <div className="mt-2">
                        <img
                          src={selectedOrder.user.avatar.path}
                          alt="Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Thông tin template
                  </h4>
                  <div className="space-y-3">
                    {selectedOrder.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-gray-200 pb-2 last:border-b-0"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {item.template.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {item.template.category}
                            </div>
                            <div className="text-xs text-gray-500">
                              Giấy phép: {licenseTypeLabels[item.licenseType]}
                            </div>
                          </div>
                          <div className="text-sm font-medium text-green-600">
                            {formatCurrency(item.price)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Thông tin thanh toán
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Phương thức:</span>
                      <span>
                        {paymentMethodLabels[selectedOrder.paymentMethod]}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Mã giao dịch:</span>
                      <span className="font-mono text-xs">
                        {selectedOrder.paymentTransactionId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tiền tệ:</span>
                      <span>{selectedOrder.currency}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Thuế:</span>
                      <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-lg border-t border-gray-300 pt-2">
                      <span>Tổng cộng:</span>
                      <span className="text-green-600">
                        {formatCurrency(totalAmount)}
                      </span>
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
                <FiEdit size={16} />
                Cập nhật trạng thái
              </button>
              <button
                onClick={() => handleSendEmail(selectedOrder)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FiMail size={16} />
                Gửi email
              </button>
              <button
                onClick={() => window.print()}
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
      <div className="mx-auto p-6">
        <div className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Quản lý đơn hàng
          </h1>
          <p className="text-gray-600">
            Quản lý và theo dõi tất cả đơn hàng của khách hàng
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {analyticsLoading && (
            <div className=" bg-gray-50 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <FiLoader className="animate-spin" size={20} />
                <span>Đang tải dữ liệu...</span>
              </div>
            </div>
          )}

          {analyticsData && (
            <>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-full">
                    <FiPackage className="text-blue-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Tổng đơn hàng
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.totalOrders}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-full">
                    <FiCheckCircle className="text-green-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Hoàn thành
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.totalCompletedOrders}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-full">
                    <FiClock className="text-yellow-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Chờ xử lý
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData.totalPendingOrders}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <FiCreditCard className="text-purple-600" size={24} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Doanh thu
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(analyticsData.revenue)}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          {/* Header with filters and actions */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-4 items-center w-full lg:w-auto">
                <div className="relative flex-1 lg:max-w-md">
                  <FiSearch
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Tìm kiếm đơn hàng..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as OrderStatus | "all")
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    {Object.entries(statusLabels).map(([status, label]) => (
                      <option key={status} value={status}>
                        {label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={paymentStatusFilter}
                    onChange={(e) =>
                      setPaymentStatusFilter(
                        e.target.value as PaymentStatus | "all"
                      )
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">Tất cả thanh toán</option>
                    {Object.entries(paymentStatusLabels).map(
                      ([status, label]) => (
                        <option key={status} value={status}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowExportReport(true)}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FiDownload size={16} />
                  Xuất báo cáo
                </button>
                <button
                  onClick={() => refetch()}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  <FiRefreshCw size={16} />
                  Làm mới
                </button>
              </div>
            </div>
          </div>

          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Khách hàng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thanh toán
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => {
                  const StatusIcon = statusIcons[order.status];
                  const customerName = `${order.user.firstName} ${order.user.lastName}`;
                  const totalAmount = order.orderItems.reduce(
                    (sum, item) => sum + item.price,
                    0
                  );

                  return (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          #{order.id}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.paymentTransactionId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {order.user.avatar ? (
                            <img
                              className="h-8 w-8 rounded-full"
                              src={order.user.avatar.path}
                              alt=""
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                              <FiUser className="text-gray-400" size={16} />
                            </div>
                          )}
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {customerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.orderItems.length} sản phẩm
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.orderItems[0]?.template.name}
                          {order.orderItems.length > 1 &&
                            ` +${order.orderItems.length - 1} khác`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(totalAmount)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.currency}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[order.status]
                          }`}
                        >
                          <StatusIcon size={12} />
                          {statusLabels[order.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                            paymentStatusColors[order.paymentStatus]
                          }`}
                        >
                          {paymentStatusLabels[order.paymentStatus]}
                        </span>
                        <div className="text-xs text-gray-500 mt-1">
                          {paymentMethodLabels[order.paymentMethod]}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
                            title="Xem chi tiết"
                          >
                            <FiEye size={16} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order)}
                            className="p-1 text-green-600 hover:text-green-800 transition-colors"
                            title="Cập nhật trạng thái"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleSendEmail(order)}
                            className="p-1 text-purple-600 hover:text-purple-800 transition-colors"
                            title="Gửi email"
                          >
                            <FiMail size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order)}
                            className="p-1 text-red-600 hover:text-red-800 transition-colors"
                            title="Xóa đơn hàng"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {hasNextPage && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Hiển thị {orders.length} trong tổng số {totalElements} đơn hàng
              </div>
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isFetchingNextPage ? (
                  <>
                    <FiLoader className="animate-spin" size={16} />
                    Đang tải...
                  </>
                ) : (
                  <>
                    Tải thêm
                    <FiChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          )}

          {orders.length === 0 && (
            <div className="text-center py-12">
              <FiPackage className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không có đơn hàng
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Chưa có đơn hàng nào được tạo hoặc không tìm thấy kết quả phù
                hợp.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showOrderDetail && <OrderDetailModal />}
      {showStatusUpdate && <StatusUpdateModal />}
      {showEmailModal && <EmailModal />}
      {showDeleteConfirm && <DeleteConfirmModal />}
      {showExportReport && <ExportReportModal />}
    </div>
  );
};

export default OrderManagement;
