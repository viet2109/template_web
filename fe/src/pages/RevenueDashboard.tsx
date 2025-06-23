import { useQuery } from "@tanstack/react-query";
import { endOfMonth, format, startOfMonth } from "date-fns";
import { FC, useState } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import {
  FiAlertCircle,
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
  FiPackage,
  FiPieChart,
  FiRefreshCw,
  FiTrendingUp,
} from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  fetchRevenueByCategory,
  fetchRevenueByPeriod,
} from "../api/adminAnalytic";
import { GroupBy } from "../types";

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("vi-VN").format(value);
};

// Category display names mapping
const categoryDisplayNames: Record<string, string> = {
  BUSINESS: "Template Business",
  PORTFOLIO: "Template Portfolio",
  E_COMMERCE: "Template E-commerce",
  BLOG: "Template Blog",
  LANDING_PAGE: "Template Landing Page",
  ADMIN_DASHBOARD: "Admin Dashboard",
  CRM: "CRM",
  CMS: "CMS",
  OTHER: "Khác",
};

// Category colors
const categoryColors: Record<string, string> = {
  BUSINESS: "#3B82F6",
  PORTFOLIO: "#10B981",
  E_COMMERCE: "#F59E0B",
  BLOG: "#EF4444",
  LANDING_PAGE: "#8B5CF6",
  ADMIN_DASHBOARD: "#06B6D4",
  CRM: "#84CC16",
  CMS: "#F97316",
  OTHER: "#6B7280",
};

// Empty State Component
const EmptyState: FC<{
  title: string;
  description: string;
  icon: React.ReactNode;
  actionText?: string;
  onAction?: () => void;
}> = ({ title, description, icon, actionText, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <div className="p-4 bg-gray-100 rounded-full mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">{actionText}</span>
        </button>
      )}
    </div>
  );
};

// Custom Tooltip Component for Bar Chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
        <p className="font-semibold text-gray-900 mb-2">{`Thời gian: ${label}`}</p>
        <div className="space-y-1">
          <p className="text-blue-600">
            <span className="font-medium">Doanh thu:</span>{" "}
            {formatCurrency(data.revenue)}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const RevenueDashboard: FC = () => {
  const [groupBy, setGroupBy] = useState<GroupBy>(GroupBy.MONTHLY);

  const today = new Date();
  const firstDayOfMonth = format(startOfMonth(today), "yyyy-MM-dd");
  const lastDayOfMonth = format(endOfMonth(today), "yyyy-MM-dd");

  const [startDate, setStartDate] = useState<string>(firstDayOfMonth);
  const [endDate, setEndDate] = useState<string>(lastDayOfMonth);
  const [pieChartMonth, setPieChartMonth] = useState<string>(
    format(today, "yyyy-MM")
  );

  // Query for revenue by period
  const {
    data: revenueByPeriodData = [],
    isLoading: isLoadingPeriod,
    refetch: refetchPeriod,
  } = useQuery({
    queryKey: ["revenueByPeriod", startDate, endDate, groupBy],
    queryFn: () =>
      fetchRevenueByPeriod({
        start: startDate,
        end: endDate,
        groupBy: groupBy,
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Query for revenue by category
  const {
    data: revenueByCategoryData = [],
    isLoading: isLoadingCategory,
    refetch: refetchCategory,
  } = useQuery({
    queryKey: [
      "revenueByCategory",
      pieChartMonth.split("-")[0],
      pieChartMonth.split("-")[1],
    ],
    queryFn: () =>
      fetchRevenueByCategory({
        year: parseInt(pieChartMonth.split("-")[0]),
        month: parseInt(pieChartMonth.split("-")[1]),
      }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleRefresh = () => {
    refetchPeriod();
    refetchCategory();
  };

  // Calculate totals
  const totalRevenue = revenueByPeriodData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalCategoryRevenue = revenueByCategoryData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );

  // Check if data is empty
  const hasRevenueData = revenueByPeriodData.length > 0;
  const hasCategoryData = revenueByCategoryData.length > 0;

  // Transform category data for pie chart
  const pieChartData = revenueByCategoryData.map((item) => ({
    name: categoryDisplayNames[item.category] || item.category,
    value:
      totalCategoryRevenue > 0
        ? Math.round((item.revenue / totalCategoryRevenue) * 100)
        : 0,
    revenue: item.revenue,
    color: categoryColors[item.category] || "#6B7280",
  }));

  // Transform period data for bar chart
  const barChartData = revenueByPeriodData.map((item) => ({
    name: item.period,
    revenue: item.revenue,
  }));

  const isLoading = isLoadingPeriod || isLoadingCategory;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between flex-wrap">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Thống Kê Doanh Thu
            </h1>
            <p className="text-gray-600">
              Quản lý và theo dõi hiệu suất kinh doanh của cửa hàng
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <button
              onClick={handleRefresh}
              className={`flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              <FiRefreshCw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="text-sm font-medium">Làm mới</span>
            </button>
            {hasRevenueData && (
              <div className="flex items-center space-x-2 text-green-600">
                <BsArrowUpRight className="w-6 h-6" />
                <span className="text-sm font-medium">
                  +12.5% so với tháng trước
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Tổng Doanh Thu
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {hasRevenueData
                  ? formatCurrency(totalRevenue)
                  : formatCurrency(0)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <FiDollarSign className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Danh Mục Bán Chạy
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {hasCategoryData
                  ? categoryDisplayNames[revenueByCategoryData[0]?.category] ||
                    revenueByCategoryData[0]?.category
                  : "Chưa có dữ liệu"}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <FiTrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                Tổng Danh Mục
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {revenueByCategoryData.length}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <FiBarChart2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiBarChart2 className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Biểu Đồ Doanh Thu Theo Thời Gian
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <FiCalendar className="w-4 h-4 text-gray-500" />
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as GroupBy)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              >
                <option value={GroupBy.DAILY}>Theo Ngày</option>
                <option value={GroupBy.WEEKLY}>Theo Tuần</option>
                <option value={GroupBy.MONTHLY}>Theo Tháng</option>
                <option value={GroupBy.YEARLY}>Theo Năm</option>
              </select>
            </div>

            <div className="flex w-fit md:items-center items-start flex-col md:flex-row space-x-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
              <span className="text-center w-full text-gray-500">-</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          {isLoadingPeriod ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : hasRevenueData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={12}
                  tickLine={false}
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `${(value / 1000).toFixed(0)}K`;
                    }
                    return value.toString();
                  }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <Legend />
                <Bar
                  dataKey="revenue"
                  fill="#3B82F6"
                  name="Doanh thu (VND)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState
              title="Không có dữ liệu doanh thu"
              description="Hiện tại chưa có dữ liệu doanh thu trong khoảng thời gian đã chọn. Hãy thử chọn khoảng thời gian khác hoặc kiểm tra lại dữ liệu."
              icon={<FiBarChart2 className="w-8 h-8 text-gray-400" />}
              actionText="Thử lại"
              onAction={refetchPeriod}
            />
          )}
        </div>
      </div>

      {/* Pie Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiPieChart className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              Doanh Thu Theo Danh Mục
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiCalendar className="w-4 h-4 text-gray-500" />
              <input
                type="month"
                value={pieChartMonth}
                onChange={(e) => setPieChartMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {hasCategoryData ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              {isLoadingCategory ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${value}%`, "Tỷ lệ"]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Chi Tiết Danh Mục
              </h3>
              {pieChartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.name}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-900">
                      {item.value}%
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-80">
            {isLoadingCategory ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <EmptyState
                title="Không có dữ liệu danh mục"
                description="Chưa có dữ liệu doanh thu theo danh mục trong tháng đã chọn. Hãy thử chọn tháng khác hoặc kiểm tra lại dữ liệu sản phẩm."
                icon={<FiPackage className="w-8 h-8 text-gray-400" />}
                actionText="Thử lại"
                onAction={refetchCategory}
              />
            )}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          🚀 Hành Động Nhanh
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
              hasRevenueData || hasCategoryData
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!hasRevenueData && !hasCategoryData}
          >
            <FiDollarSign className="w-4 h-4" />
            <span className="text-sm font-medium">Xuất Báo Cáo</span>
          </button>
          <button
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
              hasRevenueData
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!hasRevenueData}
          >
            <FiTrendingUp className="w-4 h-4" />
            <span className="text-sm font-medium">Phân Tích Xu Hướng</span>
          </button>
          <button
            className={`flex items-center justify-center space-x-2 px-4 py-3 rounded-lg transition-colors duration-200 ${
              hasRevenueData
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
            disabled={!hasRevenueData}
          >
            <FiPieChart className="w-4 h-4" />
            <span className="text-sm font-medium">So Sánh Kỳ</span>
          </button>
          <button className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors duration-200">
            <FiCalendar className="w-4 h-4" />
            <span className="text-sm font-medium">Lên Kế Hoạch</span>
          </button>
        </div>
      </div>

      {/* Overall Empty State - when both charts have no data */}
      {!hasRevenueData && !hasCategoryData && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
          <EmptyState
            title="Chưa có dữ liệu thống kê"
            description="Hiện tại hệ thống chưa có dữ liệu doanh thu nào. Điều này có thể do chưa có giao dịch nào được thực hiện hoặc dữ liệu đang được xử lý. Hãy thử lại sau hoặc liên hệ với quản trị viên nếu vấn đề vẫn tiếp tục."
            icon={<FiAlertCircle className="w-12 h-12 text-gray-400" />}
            actionText="Làm mới dữ liệu"
            onAction={handleRefresh}
          />
        </div>
      )}
    </div>
  );
};

export default RevenueDashboard;
