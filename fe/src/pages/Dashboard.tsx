import { FiDollarSign, FiGrid, FiShoppingBag, FiUsers } from "react-icons/fi";

const DashboardPage: React.FC = () => (
  <div className="flex-1 p-8 overflow-y-auto">
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Dashboard Overview
        </h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Tổng Template</p>
                <p className="text-2xl font-bold">248</p>
              </div>
              <FiGrid size={32} className="text-blue-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Đơn hàng mới</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <FiShoppingBag size={32} className="text-green-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Người dùng</p>
                <p className="text-2xl font-bold">1,248</p>
              </div>
              <FiUsers size={32} className="text-purple-200" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Doanh thu</p>
                <p className="text-2xl font-bold">$12,450</p>
              </div>
              <FiDollarSign size={32} className="text-orange-200" />
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Hoạt động gần đây
          </h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Template "Modern Landing Page" đã được phê duyệt</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Đơn hàng #TH-1234 đã được thanh toán</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Người dùng mới đăng ký: john.doe@email.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default DashboardPage;
