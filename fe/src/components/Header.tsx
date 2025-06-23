import { useState } from "react";
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  User,
  X,
} from "react-feather";
import { FiLogIn, FiLogOut, FiUserPlus } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import routers from "../config/router";
import { logOutSuccess } from "../store/authSlice";
import { RootState } from "../store/store";
import { UserProfileDto } from "../types";

interface Props {
  cartItemCount?: number;
}

interface NavItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface NavLinkProps {
  item: NavItem;
  className?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

// Navigation items config
const NAV_ITEMS: NavItem[] = [
  { label: "Trang chủ", href: routers.home },
  { label: "Sản phẩm", href: routers.home },
  { label: "Danh mục", href: routers.categories },
  { label: "Giới thiệu", href: routers.home },
  { label: "Liên hệ", href: routers.home },
];

// Reusable NavLink Component
const NavLink: React.FC<NavLinkProps> = ({
  item,
  className = "",
  onClick,
  children,
}) => {
  const baseClasses = "font-medium transition-all duration-200 ease-in-out";
  const combinedClasses = `${baseClasses} ${className}`;

  return (
    <Link to={item.href} className={combinedClasses} onClick={onClick}>
      {children || item.label}
    </Link>
  );
};

// Desktop Navigation Component
const DesktopNavigation: React.FC = () => {
  const desktopNavClasses =
    "text-gray-700 hover:bg-[#2973B2] hover:text-white hover:shadow-sm rounded-lg py-2 px-4 relative after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-[#2973B2] after:transition-all after:duration-300 hover:after:w-full hover:after:left-0";

  return (
    <nav className="hidden lg:flex items-center space-x-2">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.label} item={item} className={desktopNavClasses} />
      ))}
    </nav>
  );
};

// Mobile Navigation Component
const MobileNavigation: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const mobileNavClasses =
    "text-gray-700 hover:bg-[#2973B2] hover:text-white hover:shadow-sm rounded-lg py-3 px-4 transition-all duration-200 flex items-center justify-between group";

  return (
    <nav className="flex flex-col space-y-2">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.label}
          item={item}
          className={mobileNavClasses}
          onClick={onClose}
        />
      ))}
    </nav>
  );
};

// Search Form Component
const SearchForm: React.FC<{
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isMobile?: boolean;
}> = ({ searchQuery, onSearchChange, onSubmit, isMobile = false }) => {
  const containerClasses = isMobile
    ? "flex items-center mb-6 w-full"
    : "hidden lg:flex items-center max-w-sm";

  const inputClasses = isMobile
    ? "flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#2973B2] focus:border-transparent text-sm placeholder-gray-500"
    : "w-full px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#2973B2] focus:border-transparent text-sm placeholder-gray-500";

  const buttonClasses = isMobile
    ? "bg-[#2973B2] text-white px-4 py-3 rounded-r-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center min-w-[48px]"
    : "bg-[#2973B2] text-white px-3 py-2 rounded-r-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center min-w-[44px]";

  return (
    <form onSubmit={onSubmit} className={containerClasses}>
      <input
        type="text"
        placeholder="Tìm kiếm sản phẩm..."
        className={inputClasses}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button type="submit" className={buttonClasses} aria-label="Tìm kiếm">
        <Search size={isMobile ? 18 : 16} />
      </button>
    </form>
  );
};

// User Avatar Component
const UserAvatar: React.FC<{ user: UserProfileDto; size?: "sm" | "md" }> = ({
  user,
  size = "sm",
}) => {
  const sizeClasses = size === "sm" ? "w-8 h-8 text-xs" : "w-10 h-10 text-sm";
  const initials = user?.firstName
    ? user.firstName.charAt(0).toUpperCase()
    : user?.email?.charAt(0).toUpperCase() || "U";

  return (
    <div
      className={`${sizeClasses} bg-[#2973B2] text-white rounded-full flex items-center justify-center font-semibold shadow-sm`}
    >
      {initials}
    </div>
  );
};

// User Actions for Desktop
const DesktopUserActions: React.FC<{
  isLoggedIn: boolean;
  user: UserProfileDto;
  cartItemCount: number;
  onLogout: () => void;
}> = ({ isLoggedIn, user, cartItemCount, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (isLoggedIn) {
    return (
      <>
        {/* User Profile Dropdown */}
        <div className="hidden lg:flex items-center relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 text-gray-700 hover:bg-gray-50 rounded-lg py-2 px-3 transition-all duration-200 group"
            onBlur={() => setTimeout(() => setShowUserMenu(false), 150)}
          >
            <UserAvatar user={user} />
            <span className="text-sm font-medium max-w-[120px] truncate">
              {user?.firstName || user?.email}
            </span>
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                showUserMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
              <Link
                to={routers.home}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setShowUserMenu(false)}
              >
                <User size={16} className="mr-3" />
                Thông tin tài khoản
              </Link>
              <hr className="my-1 border-gray-100" />
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  onLogout();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <FiLogOut size={16} className="mr-3" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>

        {/* Cart */}
        <Link
          to={routers.cart}
          className="relative text-gray-700 hover:bg-gray-50 rounded-lg p-2.5 transition-all duration-200 group"
          title="Giỏ hàng"
        >
          <ShoppingCart
            size={20}
            className="group-hover:scale-110 transition-transform"
          />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-medium animate-pulse">
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
          )}
        </Link>
      </>
    );
  }

  return (
    <div className="hidden lg:flex items-center space-x-3">
      {/* Login Button */}
      <Link
        to={routers.login}
        className="flex items-center space-x-2 text-[#2973B2] border border-[#2973B2] px-4 py-2 rounded-lg hover:bg-[#2973B2] hover:text-white transition-all duration-200 font-medium"
      >
        <FiLogIn size={16} />
        <span>Đăng nhập</span>
      </Link>

      {/* Register Button */}
      <Link
        to={routers.register}
        className="flex items-center space-x-2 bg-[#2973B2] text-white px-4 py-2 rounded-lg hover:bg-blue-700 hover:shadow-md transition-all duration-200 font-medium"
      >
        <FiUserPlus size={16} />
        <span>Đăng ký</span>
      </Link>
    </div>
  );
};

// Mobile User Actions
const MobileUserActions: React.FC<{
  isLoggedIn: boolean;
  user: UserProfileDto;
  cartItemCount: number;
  onLogout: () => void;
  onClose: () => void;
}> = ({ isLoggedIn, user, cartItemCount, onLogout, onClose }) => {
  if (isLoggedIn) {
    return (
      <div className="space-y-3">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <UserAvatar user={user} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.firstName || "Người dùng"}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <Link
          to={routers.home}
          onClick={onClose}
          className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <User size={18} />
            <span>Thông tin tài khoản</span>
          </div>
        </Link>

        <Link
          to={routers.cart}
          onClick={onClose}
          className="flex items-center justify-between p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <ShoppingCart size={18} />
            <span>Giỏ hàng</span>
          </div>
          {cartItemCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-medium">
              {cartItemCount > 99 ? "99+" : cartItemCount}
            </span>
          )}
        </Link>

        <button
          onClick={() => {
            onClose();
            onLogout();
          }}
          className="flex items-center justify-between w-full p-3 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
        >
          <div className="flex items-center space-x-3">
            <FiLogOut size={18} />
            <span>Đăng xuất</span>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Link
        to={routers.login}
        onClick={onClose}
        className="flex items-center justify-center space-x-2 bg-[#2973B2] text-white p-3 rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium"
      >
        <FiLogIn size={18} />
        <span>Đăng nhập</span>
      </Link>

      <Link
        to={routers.register}
        onClick={onClose}
        className="flex items-center justify-center space-x-2 border-2 border-[#2973B2] text-[#2973B2] p-3 rounded-lg hover:bg-[#2973B2] hover:text-white transition-all duration-200 font-medium"
      >
        <FiUserPlus size={18} />
        <span>Đăng ký</span>
      </Link>
    </div>
  );
};

function Header({ cartItemCount = 0 }: Props) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isLoggedIn = !!user;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      // Add your search logic here
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Xác nhận đăng xuất",
      text: "Bạn có chắc chắn muốn đăng xuất không?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Đăng xuất",
      cancelButtonText: "Hủy",
      reverseButtons: true,
      customClass: {
        popup: "rounded-xl",
        confirmButton: "rounded-lg",
        cancelButton: "rounded-lg",
      },
    });

    if (result.isConfirmed) {
      console.log("User logged out");
      dispatch(logOutSuccess());
      navigate(routers.login);

      Swal.fire({
        title: "Đăng xuất thành công!",
        text: "Bạn đã đăng xuất khỏi hệ thống.",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: {
          popup: "rounded-xl",
        },
      });
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to={routers.home}
              className="text-2xl lg:text-3xl font-bold text-[#2973B2] hover:text-blue-700 transition-colors duration-200"
            >
              Elysian
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="flex-1 flex justify-center px-4">
            <DesktopNavigation />
          </div>

          {/* Desktop Actions */}
          <div className="flex items-center space-x-4">
            {/* Search Form */}
            <SearchForm
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSubmit={handleSearch}
            />

            {/* User Actions */}
            <DesktopUserActions
              isLoggedIn={isLoggedIn}
              user={user ?? ({ firstName: "", email: "" } as UserProfileDto)}
              cartItemCount={cartItemCount}
              onLogout={handleLogout}
            />

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#2973B2] focus:ring-offset-2"
              onClick={toggleMobileMenu}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white">
            <div className="px-4 py-6 space-y-6">
              {/* Mobile Search */}
              <SearchForm
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSubmit={handleSearch}
                isMobile={true}
              />

              {/* Mobile Navigation */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Danh mục
                </h3>
                <MobileNavigation onClose={toggleMobileMenu} />
              </div>

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                  Tài khoản
                </h3>
                <MobileUserActions
                  isLoggedIn={isLoggedIn}
                  user={
                    user ?? ({ firstName: "", email: "" } as UserProfileDto)
                  }
                  cartItemCount={cartItemCount}
                  onLogout={handleLogout}
                  onClose={toggleMobileMenu}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
