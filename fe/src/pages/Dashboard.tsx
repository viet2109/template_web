import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { FiDollarSign, FiGrid, FiShoppingBag, FiUsers, FiTrendingUp, FiUserCheck } from "react-icons/fi";
import { fetchAdminDashboard } from '../api/adminAnalytic'; // Adjust the import path as needed

const DashboardPage: React.FC = () => {
  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: fetchAdminDashboard,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 p-6 rounded-xl h-24"></div>
                ))}
              </div>
              <div className="bg-gray-200 rounded-lg h-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="text-center py-8">
              <div className="text-red-500 text-lg mb-2">⚠️ Lỗi tải dữ liệu</div>
              <p className="text-gray-600">Không thể tải dữ liệu dashboard. Vui lòng thử lại sau.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className=" mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Dashboard Overview
          </h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Tổng Template</p>
                  <p className="text-2xl font-bold">{formatNumber(dashboardData?.totalTemplates || 0)}</p>
                  <p className="text-sm text-blue-200 mt-1">
                    +{formatNumber(dashboardData?.newTemplatesThisMonth || 0)} tháng này
                  </p>
                </div>
                <FiGrid size={32} className="text-blue-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">Tổng Đơn hàng</p>
                  <p className="text-2xl font-bold">{formatNumber(dashboardData?.totalOrders || 0)}</p>
                  <p className="text-sm text-green-200 mt-1">
                    +{formatNumber(dashboardData?.newOrdersThisMonth || 0)} tháng này
                  </p>
                </div>
                <FiShoppingBag size={32} className="text-green-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Tổng Người dùng</p>
                  <p className="text-2xl font-bold">{formatNumber(dashboardData?.totalUsers || 0)}</p>
                  <p className="text-sm text-purple-200 mt-1">
                    +{formatNumber(dashboardData?.newUsersThisMonth || 0)} tháng này
                  </p>
                </div>
                <FiUsers size={32} className="text-purple-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100">Tổng Doanh thu</p>
                  <p className="text-2xl font-bold">{formatCurrency(dashboardData?.totalRevenue || 0)}</p>
                </div>
                <FiDollarSign size={32} className="text-orange-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100">Tổng Sellers</p>
                  <p className="text-2xl font-bold">{formatNumber(dashboardData?.totalSellers || 0)}</p>
                  <p className="text-sm text-indigo-200 mt-1">
                    +{formatNumber(dashboardData?.newSellersThisMonth || 0)} tháng này
                  </p>
                </div>
                <FiUserCheck size={32} className="text-indigo-200" />
              </div>
            </div>

            <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-6 rounded-xl text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100">Tổng Hoa hồng</p>
                  <p className="text-2xl font-bold">{formatCurrency(dashboardData?.totalCommissions || 0)}</p>
                </div>
                <FiTrendingUp size={32} className="text-teal-200" />
              </div>
            </div>
          </div>

          {/* Top Performers Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Sellers */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Sellers
              </h3>
              <div className="space-y-3">
                {dashboardData?.topSellers?.slice(0, 5).map((seller, index) => (
                  <div key={seller.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{seller.name}</p>
                        <p className="text-sm text-gray-500">
                          {formatNumber(seller.totalTemplates)} templates • ⭐ {seller.rating.toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatNumber(seller.totalSales)} sales</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">Chưa có dữ liệu</p>
                )}
              </div>
            </div>

            {/* Top Templates */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Templates
              </h3>
              <div className="space-y-3">
                {dashboardData?.topTemplates?.slice(0, 5).map((template, index) => (
                  <div key={template.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{template.name}</p>
                        <p className="text-sm text-gray-500">
                          by {template.sellerName} • ⭐ {template.rating.toFixed(1)}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatNumber(template.totalSales)} sales</p>
                      <p className="text-sm text-gray-500">{formatCurrency(template.totalRevenue)}</p>
                    </div>
                  </div>
                )) || (
                  <p className="text-gray-500 text-center py-4">Chưa có dữ liệu</p>
                )}
              </div>
            </div>
          </div>

          {/* Monthly Sales Chart Placeholder */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Doanh số theo tháng
            </h3>
            <div className="space-y-2">
              {dashboardData?.monthlySales?.slice(-6).map((monthData) => (
                <div key={monthData.monthDto} className="flex justify-between items-center p-2 bg-white rounded">
                  <span className="text-gray-700">{monthData.monthDto}</span>
                  <div className="text-right">
                    <span className="font-medium">{formatNumber(monthData.totalSales)} đơn</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {formatCurrency(monthData.totalRevenue)}
                    </span>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">Chưa có dữ liệu doanh số</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;