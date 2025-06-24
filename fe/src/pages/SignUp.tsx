import { Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import routers from "../config/router";

interface Props {}

function SignUp(props: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone: phone || undefined,
          password,
        }),
      });

      const result = await response.text();

      if (response.ok) {
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
          {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            onClose: () => {
              navigate(routers.home);
            },
          }
        );
      } else {
        toast.error(result || "Đăng ký thất bại. Vui lòng thử lại.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Lỗi kết nối. Vui lòng kiểm tra mạng và thử lại.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Card Container with modern styling */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Tạo tài khoản
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  to={routers.login}
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Đăng nhập ngay
                </Link>
              </p>
            </div>

            {/* Signup Form */}
            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Tên
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="firstName"
                        type="text"
                        required
                        className="pl-10 pr-4 py-3 block w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                        placeholder="Nguyễn"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Họ
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="lastName"
                        type="text"
                        required
                        className="pl-10 pr-4 py-3 block w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                        placeholder="Văn An"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      className="pl-10 pr-4 py-3 block w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                      placeholder="nguyen@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Số điện thoại{" "}
                    <span className="text-gray-400 text-xs font-normal">
                      (Không bắt buộc)
                    </span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      type="tel"
                      className="pl-10 pr-4 py-3 block w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                      placeholder="+84 123 456 789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      className="pl-10 pr-4 py-3 block w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                      placeholder="Tối thiểu 6 ký tự"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Xác nhận mật khẩu
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      className="pl-10 pr-4 py-3 block w-full border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white focus:bg-white"
                      placeholder="Nhập lại mật khẩu"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                    isLoading
                      ? "opacity-75 cursor-not-allowed hover:transform-none"
                      : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Đang tạo tài khoản...
                    </>
                  ) : (
                    "Tạo tài khoản"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-gray-500">
            Bằng việc tạo tài khoản, bạn đồng ý với{" "}
            <Link to="/terms" className="underline hover:text-gray-700">
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link to="/privacy" className="underline hover:text-gray-700">
              Chính sách bảo mật
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
