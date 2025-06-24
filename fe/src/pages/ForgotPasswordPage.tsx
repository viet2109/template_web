import { AlertCircle, ArrowLeft, CheckCircle, Mail } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { api } from "../api/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  interface ForgotPasswordFormEvent
    extends React.FormEvent<HTMLButtonElement | HTMLFormElement> {}

  const handleSubmit = async (e: ForgotPasswordFormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Vui lòng nhập địa chỉ email");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Địa chỉ email không hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      await api.post<void>(`/auth/forgot-password`, email, {
        headers: {
          "Content-Type": "text/plain",
        },
      });
      toast.success(
        "Yêu cầu đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn."
      );
    } catch (error: any) {
      toast.error("Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      setIsSubmitted(true);
    }
  };

  const handleBackToLogin = () => {
    // Reset form
    setEmail("");
    setIsSubmitted(false);
    setError("");
    // In real app, navigate to login page
    console.log("Navigate to login page");
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email đã được gửi!
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email{" "}
              <span className="font-semibold text-gray-900">{email}</span>
            </p>

            <p className="text-sm text-gray-500 mb-8">
              Kiểm tra hộp thư đến và thư mục spam. Nếu không nhận được email,
              bạn có thể thử lại sau 5 phút.
            </p>

            <button
              onClick={handleBackToLogin}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Quên mật khẩu?
            </h1>
            <p className="text-gray-600">
              Nhập email của bạn và chúng tôi sẽ gửi hướng dẫn đặt lại mật khẩu
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Địa chỉ email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full px-4 py-3 pl-11 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    error ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder="example@email.com"
                  disabled={isLoading}
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
              {error && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmit}
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang gửi...
                </>
              ) : (
                "Gửi hướng dẫn đặt lại"
              )}
            </button>
          </div>

          {/* Back to Login */}
          <div className="mt-6 text-center">
            <button
              onClick={handleBackToLogin}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center justify-center gap-1 mx-auto transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Gặp khó khăn? Liên hệ{" "}
            <a
              href="#"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              hỗ trợ khách hàng
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
