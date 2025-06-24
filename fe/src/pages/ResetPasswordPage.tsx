import {
    AlertCircle,
    CheckCircle,
    Eye,
    EyeOff,
    Lock,
    Shield,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "react-toastify";
import { api } from "../api/api";
import routers from "../config/router";

export default function ResetPasswordPage() {
  const [passwords, setPasswords] = useState({
    password: "",
    confirmPassword: "",
  });
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  interface Errors {
    password?: string;
    confirmPassword?: string;
  }
  const [errors, setErrors] = useState<Errors>({});

  const validateForm = () => {
    const newErrors: Errors = {};

    if (!passwords.password) {
      newErrors.password = "Vui lòng nhập mật khẩu mới";
    } else if (passwords.password.length <= 6) {
      newErrors.password = "Mật khẩu phải có nhiều hơn 6 ký tự";
    }

    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (passwords.password !== passwords.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  interface HandleSubmitEvent
    extends React.MouseEvent<HTMLButtonElement, MouseEvent> {}

  const handleSubmit = async (e: HandleSubmitEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await api.post<void>(`/auth/reset-password`, passwords.password, {
        headers: {
          "Content-Type": "text/plain",
        },
        params: {
          token: searchParams.get("token"),
        },
      });

      toast.success(
        "Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập ngay bây giờ."
      );
    } catch (error: any) {
      toast.error("Đã xảy ra lỗi khi đặt lại mật khẩu. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
      setIsSubmitted(true);
    }
  };

  interface PasswordFields {
    password: string;
    confirmPassword: string;
  }

  type PasswordField = keyof PasswordFields;

  const handleInputChange = (field: PasswordField, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  interface TogglePasswordVisibilityField {
    password: boolean;
    confirmPassword: boolean;
  }
  const togglePasswordVisibility = (
    field: keyof TogglePasswordVisibilityField
  ) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Đặt lại mật khẩu thành công!
            </h1>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Mật khẩu của bạn đã được cập nhật thành công. Bạn có thể đăng nhập
              với mật khẩu mới.
            </p>

            <Link
              to={routers.login}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200"
            >
              Đăng nhập ngay
            </Link>
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
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Đặt lại mật khẩu
            </h1>
            <p className="text-gray-600">
              Tạo mật khẩu mới an toàn cho tài khoản của bạn
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            {/* New Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showPassword.password ? "text" : "password"}
                  id="password"
                  value={passwords.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                  className={`w-full px-4 py-3 pl-11 pr-11 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.password
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập mật khẩu mới (nhiều hơn 6 ký tự)"
                  disabled={isLoading}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("password")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.password ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={(e) =>
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  className={`w-full px-4 py-3 pl-11 pr-11 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 ${
                    errors.confirmPassword
                      ? "border-red-300 bg-red-50"
                      : passwords.confirmPassword &&
                        passwords.password === passwords.confirmPassword
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300"
                  }`}
                  placeholder="Nhập lại mật khẩu mới"
                  disabled={isLoading}
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword.confirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {errors.confirmPassword}
                </div>
              )}
              {passwords.confirmPassword &&
                passwords.password === passwords.confirmPassword && (
                  <div className="mt-2 flex items-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    Mật khẩu khớp
                  </div>
                )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang cập nhật...
                </>
              ) : (
                "Cập nhật mật khẩu"
              )}
            </button>
          </div>
        </div>

        {/* Security Tips */}
        <div className="mt-6 bg-white rounded-xl p-4 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-2">
            💡 Mẹo bảo mật:
          </h3>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• Không sử dụng mật khẩu đã dùng trước đây</li>
            <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
            <li>• Sử dụng mật khẩu khác nhau cho các tài khoản khác nhau</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
