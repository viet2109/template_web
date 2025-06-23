import {
  ArrowLeft,
  CheckCircle,
  CreditCard,
  Loader2,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { returnPayment } from "../api/payment";

const PaymentConfirmation = () => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const processPayment = async () => {
      try {
        // Get URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const params: any = {};

        // Extract VNPay parameters
        for (const [key, value] of urlParams.entries()) {
          params[key] = value;
        }

        // Call API
        const response = await returnPayment(params);
        setResult(response);
      } catch (err: any) {
        console.error("Payment processing error:", err);
        setError(err.message || "Có lỗi xảy ra khi xử lý thanh toán");
      } finally {
        setLoading(false);
      }
    };

    processPayment();
  }, []);

  interface PaymentResult {
    status: "success" | "failed" | string;
    message?: string;
    transactionRef?: string;
    amount?: string | number;
    responseCode?: string;
    [key: string]: any;
  }

  const getResponseCodeMessage = (code: string): string => {
    const codes: { [key: string]: string } = {
      '00': 'Giao dịch thành công',
      '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
      '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
      '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
      '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
      '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
      '13': 'Giao dịch không thành công do: Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
      '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
      '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
      '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
      '75': 'Ngân hàng thanh toán đang bảo trì.',
      '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.'
    };
    return codes[code] || 'Giao dịch không thành công';
  };

  const formatAmount = (amount: string | number | undefined): string => {
    if (!amount) return "0";
    // VNPay amount is in VND * 100
    const actualAmount = parseInt(amount as string) / 100;
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(actualAmount);
  };

  const getStatusIcon = () => {
    if (loading)
      return <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />;
    if (result?.status === "success")
      return <CheckCircle className="w-16 h-16 text-green-500" />;
    return <XCircle className="w-16 h-16 text-red-500" />;
  };

  const getStatusColor = () => {
    if (loading) return "bg-blue-50 border-blue-200";
    if (result?.status === "success") return "bg-green-50 border-green-200";
    return "bg-red-50 border-red-200";
  };

  const getStatusText = () => {
    if (loading) return "Đang xử lý thanh toán...";
    
    // If failed and has response code, show the detailed message
    if (result?.status === "failed" && result.responseCode) {
      return getResponseCodeMessage(result.responseCode);
    }
    
    return result?.message || error || "Có lỗi xảy ra";
  };

  const goToHome = () => {
    // Redirect to home page
    window.location.href = "/";
  };

  const goToOrders = () => {
    // Redirect to orders page - customize the URL as needed
    window.location.href = "/orders";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CreditCard className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Kết quả thanh toán
          </h1>
          <p className="text-gray-600">
            Vui lòng chờ trong giây lát để xử lý kết quả thanh toán
          </p>
        </div>

        {/* Status Card */}
        <div
          className={`rounded-lg border-2 p-8 text-center ${getStatusColor()}`}
        >
          <div className="flex justify-center mb-4">{getStatusIcon()}</div>

          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            {getStatusText()}
          </h2>

          {/* Success Details */}
          {result?.status === "success" && (
            <div className="space-y-3 mb-6">
              {result.transactionRef && (
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">Mã giao dịch</p>
                  <p className="font-semibold text-gray-900">
                    {result.transactionRef}
                  </p>
                </div>
              )}
              {result.amount && (
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">Số tiền</p>
                  <p className="font-semibold text-green-600 text-lg">
                    {formatAmount(result.amount)}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Error Details */}
          {result?.status === "failed" && result.responseCode && (
            <div className="mb-6 space-y-3">
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-sm text-gray-600">Mã lỗi</p>
                <p className="font-semibold text-red-600">
                  {result.responseCode}
                </p>
              </div>
              {/* Show transaction amount even for failed transactions if available */}
              {result.amount && (
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">Số tiền giao dịch</p>
                  <p className="font-semibold text-gray-900 text-lg">
                    {formatAmount(result.amount)}
                  </p>
                </div>
              )}
              {result.transactionRef && (
                <div className="bg-white rounded-lg p-3 border">
                  <p className="text-sm text-gray-600">Mã tham chiếu</p>
                  <p className="font-semibold text-gray-900">
                    {result.transactionRef}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <p className="text-gray-600 text-sm">
              Đang xác nhận thông tin thanh toán với hệ thống...
            </p>
          )}
        </div>

        {/* Action Buttons */}
        {!loading && (
          <div className="mt-6 space-y-3">
            {result?.status === "success" ? (
              <>
                <button
                  onClick={goToOrders}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Xem đơn hàng
                </button>
                <button
                  onClick={goToHome}
                  className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Quay lại trang chủ
                </button>
              </>
            ) : (
              <button
                onClick={goToHome}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Quay lại trang chủ
              </button>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Nếu bạn gặp vấn đề, vui lòng liên hệ bộ phận hỗ trợ khách hàng
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfirmation;