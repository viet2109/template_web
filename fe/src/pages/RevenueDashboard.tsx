import { FC, useEffect, useState } from "react";
import { BsArrowUpRight } from "react-icons/bs";
import {
  FiBarChart2,
  FiCalendar,
  FiDollarSign,
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

type BarChartPeriod = "day" | "month" | "quarter" | "year";

interface RevenueItem {
  name: string;
  revenue: number;
  orders: number;
}

interface PieItem {
  name: string;
  value: number;
  color: string;
}

const generateBarChartData = (
  period: BarChartPeriod,
  startDate: string,
  endDate: string
): RevenueItem[] => {
  const data: RevenueItem[] = [];
  const baseRevenue = 50000;

  if (period === "day") {
    for (let i = 0; i < 30; i++) {
      data.push({
        name: `${i + 1}/12`,
        revenue: baseRevenue + Math.random() * 30000,
        orders: Math.floor(Math.random() * 100) + 50,
      });
    }
  } else if (period === "month") {
    const months = [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ];
    months.forEach((month) => {
      data.push({
        name: month,
        revenue: baseRevenue + Math.random() * 50000,
        orders: Math.floor(Math.random() * 200) + 100,
      });
    });
  } else if (period === "quarter") {
    const quarters: string[] = ["Q1", "Q2", "Q3", "Q4"];
    quarters.forEach((quarter) => {
      data.push({
        name: quarter,
        revenue: baseRevenue * 3 + Math.random() * 100000,
        orders: Math.floor(Math.random() * 500) + 300,
      });
    });
  } else if (period === "year") {
    for (let i = 2020; i <= 2024; i++) {
      data.push({
        name: i.toString(),
        revenue: baseRevenue * 12 + Math.random() * 200000,
        orders: Math.floor(Math.random() * 2000) + 1000,
      });
    }
  }

  return data;
};

const generatePieChartData = (month: string): PieItem[] => {
  return [
    { name: "Template Business", value: 45, color: "#3B82F6" },
    { name: "Template Portfolio", value: 25, color: "#10B981" },
    { name: "Template E-commerce", value: 15, color: "#F59E0B" },
    { name: "Template Blog", value: 10, color: "#EF4444" },
    { name: "Template Landing Page", value: 5, color: "#8B5CF6" },
  ];
};

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
          <p className="text-green-600">
            <span className="font-medium">Số đơn hàng:</span>{" "}
            {formatNumber(data.orders)} đơn
          </p>
          <p className="text-purple-600">
            <span className="font-medium">Giá trị TB/đơn:</span>{" "}
            {formatCurrency(data.revenue / data.orders)}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const RevenueDashboard: FC = () => {
  const [barChartPeriod, setBarChartPeriod] = useState<BarChartPeriod>("month");
  const [barChartStartDate, setBarChartStartDate] =
    useState<string>("2024-01-01");
  const [barChartEndDate, setBarChartEndDate] = useState<string>("2024-12-31");
  const [pieChartMonth, setPieChartMonth] = useState<string>("2024-12");

  const [barChartData, setBarChartData] = useState<RevenueItem[]>([]);
  const [pieChartData, setPieChartData] = useState<PieItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = () => {
    setIsLoading(true);
    setTimeout(() => {
      setBarChartData(
        generateBarChartData(barChartPeriod, barChartStartDate, barChartEndDate)
      );
      setPieChartData(generatePieChartData(pieChartMonth));
      setIsLoading(false);
    }, 500);
  };

  useEffect(() => {
    fetchData();
  }, [barChartPeriod, barChartStartDate, barChartEndDate, pieChartMonth]);

  const totalRevenue: number = barChartData.reduce(
    (sum, item) => sum + item.revenue,
    0
  );
  const totalOrders: number = barChartData.reduce(
    (sum, item) => sum + item.orders,
    0
  );
  const avgOrderValue: number =
    totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Threshold-based grouping for Pie Chart
  const thresholdPercent = 10; // categories under 10% are "Other"
  const transformPieData = (): PieItem[] => {
    const filtered = pieChartData.filter(
      (item) => item.value >= thresholdPercent
    );
    const othersValue = pieChartData
      .filter((item) => item.value < thresholdPercent)
      .reduce((sum, item) => sum + item.value, 0);

    if (othersValue > 0) {
      filtered.push({ name: "Other", value: othersValue, color: "#CCCCCC" });
    }
    return filtered;
  };

  const displayedPieData = transformPieData();

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
              onClick={fetchData}
              className={`flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all duration-200 ${
                isLoading ? "animate-pulse" : ""
              }`}
            >
              <FiRefreshCw
                className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
              />
              <span className="text-sm font-medium">Làm mới</span>
            </button>
            <div className="flex items-center space-x-2 text-green-600">
              <BsArrowUpRight className="w-6 h-6" />
              <span className="text-sm font-medium">
                +12.5% so với tháng trước
              </span>
            </div>
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
                {formatCurrency(totalRevenue)}
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
                Tổng Đơn Hàng
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatNumber(totalOrders)}
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
                Giá Trị Trung Bình
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(avgOrderValue)}
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
                value={barChartPeriod}
                onChange={(e) =>
                  setBarChartPeriod(e.target.value as BarChartPeriod)
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              >
                <option value="day">Theo Ngày</option>
                <option value="month">Theo Tháng</option>
                <option value="quarter">Theo Quý</option>
                <option value="year">Theo Năm</option>
              </select>
            </div>

            <div className="flex w-fit md:items-center items-start flex-col md:flex-row space-x-2">
              <input
                type="date"
                value={barChartStartDate}
                onChange={(e) => setBarChartStartDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
              <span className="text-center w-full text-gray-500">-</span>
              <input
                type="date"
                value={barChartEndDate}
                onChange={(e) => setBarChartEndDate(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200"
              />
            </div>
          </div>
        </div>

        <div className="h-80 w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="h-80">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayedPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {displayedPieData.map((entry, index) => (
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
            {displayedPieData.map((item, index) => (
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
                    {formatCurrency(totalRevenue * (item.value / 100))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer - Additional Management Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiTrendingUp className="w-5 h-5 text-indigo-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Thông Tin Quản Lý Bổ Sung
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Revenue Growth */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-blue-800">
                Tăng Trưởng Doanh Thu
              </h3>
              <BsArrowUpRight className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-900">+18.5%</p>
            <p className="text-xs text-blue-600 mt-1">
              So với cùng kỳ năm trước
            </p>
          </div>

          {/* Best Selling Day */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-green-800">
                Ngày Bán Chạy Nhất
              </h3>
              <FiCalendar className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-lg font-bold text-green-900">Thứ 6</p>
            <p className="text-xs text-green-600 mt-1">
              {formatCurrency(125000)} trung bình
            </p>
          </div>

          {/* Customer Acquisition */}
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-purple-800">
                Khách Hàng Mới
              </h3>
              <FiTrendingUp className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-900">+247</p>
            <p className="text-xs text-purple-600 mt-1">Trong tháng này</p>
          </div>

          {/* Return Rate */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-orange-800">
                Tỷ Lệ Trả Hàng
              </h3>
              <FiBarChart2 className="w-4 h-4 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-900">2.3%</p>
            <p className="text-xs text-orange-600 mt-1">
              Giảm 0.5% so với tháng trước
            </p>
          </div>
        </div>

        {/* Key Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              📊 Thông Tin Chi Tiết
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Doanh thu cao nhất trong ngày:
                </span>
                <span className="font-semibold text-gray-900">
                  {formatCurrency(180000)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Số đơn hàng nhiều nhất/ngày:
                </span>
                <span className="font-semibold text-gray-900">156 đơn</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Thời gian peak:</span>
                <span className="font-semibold text-gray-900">
                  14:00 - 16:00
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tỷ lệ chuyển đổi:</span>
                <span className="font-semibold text-green-600">3.2%</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              🎯 Mục Tiêu & Hiệu Suất
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Mục tiêu tháng:</span>
                  <span className="text-sm font-semibold text-gray-900">
                    85%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">
                    Khách hàng quay lại:
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    68%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">
                    Hiệu suất nhân viên:
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    92%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{ width: "92%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            🚀 Hành Động Nhanh
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors duration-200">
              <FiDollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">Xuất Báo Cáo</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors duration-200">
              <FiTrendingUp className="w-4 h-4" />
              <span className="text-sm font-medium">Phân Tích Xu Hướng</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors duration-200">
              <FiPieChart className="w-4 h-4" />
              <span className="text-sm font-medium">So Sánh Kỳ</span>
            </button>
            <button className="flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-lg transition-colors duration-200">
              <FiCalendar className="w-4 h-4" />
              <span className="text-sm font-medium">Lên Kế Hoạch</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="border-t border-gray-200 pt-4 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>
                Cập nhật lần cuối: {new Date().toLocaleString("vi-VN")}
              </span>
              <span>•</span>
              <span>Dữ liệu đồng bộ: Thời gian thực</span>
            </div>
            <div className="flex items-center space-x-4 mt-2 md:mt-0">
              <span>Phiên bản: 2.1.0</span>
              <span>•</span>
              <span>© 2024 Revenue Management System</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueDashboard;
