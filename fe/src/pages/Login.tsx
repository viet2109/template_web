import { CodeResponse, useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser, loginWithGoogle } from "../api/auth.ts";
import Header from "../components/Header.tsx";
import routers from "../config/router.ts";
import { loginSuccess } from "../store/authSlice.ts";
import { AuthenticationResponse } from "../types/index.ts";

type Props = {};
const loginUserWithGoogle = async (
  tokenResponse: CodeResponse
): Promise<any> => {
  return await loginWithGoogle(tokenResponse, window.location.origin);
};
function Login(_props: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Regular login mutation
  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      toast.success("Đăng nhập thành công!", {
        position: "top-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Store login data if needed
      if (data.accessToken || data.user) {
        dispatch(loginSuccess(data));
      }

      // navigate(
      //   data.user.roles.includes(Role.ADMIN)
      //     ? routers.adminDashboard
      //     : routers.home
      // );
      navigate(routers.home);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Đăng nhập thất bại. Vui lòng thử lại.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  // Google login mutation
  const googleLoginMutation = useMutation({
    mutationFn: loginUserWithGoogle,
    onSuccess: (data: AuthenticationResponse) => {
      dispatch(loginSuccess(data));
      toast.success("Đăng nhập Google thành công!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      // navigate(
      //   data.user.roles.includes(Role.ADMIN)
      //     ? routers.adminDashboard
      //     : routers.home
      // );
      navigate(routers.home);
    },
    onError: (_error: Error) => {
      toast.error("Đăng nhập Google thất bại. Vui lòng thử lại.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.warn("Vui lòng nhập đầy đủ email và mật khẩu!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    loginMutation.mutate({ email: email.trim(), password });
  };

  const googleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (tokenResponse: CodeResponse) => {
      console.log(tokenResponse);
      googleLoginMutation.mutate(tokenResponse);
    },
    onError: () => {
      toast.error("Đăng nhập Google thất bại!", {
        position: "top-right",
        autoClose: 5000,
      });
    },
  });

  const isLoading = loginMutation.isPending;
  const isGoogleLoading = googleLoginMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />

      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Card Container with modern styling */}
          <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white/20">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Chào mừng trở lại
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Chưa có tài khoản?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>

            {/* Google Login Button */}
            <div className="mt-8">
              <button
                onClick={() => googleLogin()}
                disabled={isGoogleLoading || isLoading}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-200 rounded-xl shadow-sm bg-white hover:bg-gray-50 transition-all duration-200 group disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                ) : (
                  <>
                    <FcGoogle className="w-5 h-5 mr-3" />
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                      Tiếp tục với Google
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">
                    Hoặc đăng nhập bằng email
                  </span>
                </div>
              </div>
            </div>

            {/* Login Form */}
            <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
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
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                    />
                  </div>
                </div>

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
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading || isGoogleLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 transition-colors"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading || isGoogleLoading}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-gray-700 font-medium"
                  >
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgot-password"
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading || isGoogleLoading}
                  className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${
                    isLoading || isGoogleLoading
                      ? "opacity-75 cursor-not-allowed hover:transform-none"
                      : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Đang đăng nhập...
                    </>
                  ) : (
                    "Đăng nhập"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer text */}
          <p className="text-center text-xs text-gray-500">
            Bằng việc đăng nhập, bạn đồng ý với{" "}
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

export default Login;
