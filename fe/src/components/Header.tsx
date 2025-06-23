import { useState } from 'react';
import { ShoppingCart, Search, User, Menu, X } from 'react-feather';
import { FiLogOut } from 'react-icons/fi';

interface Props {
  cartItemCount?: number;
}

function Header({ cartItemCount = 0 }: Props) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    console.log('User logged out');
    window.location.href = '/login';
  };

  return (
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/" className="text-2xl font-bold text-[#2973B2]">
                Elysian
              </a>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:bg-[#2973B2] hover:text-amber-50 hover:bg-opacity-50 rounded-md py-2 px-4 font-medium">Home</a>
              <a href="/products" className="text-gray-700 hover:bg-[#2973B2] hover:text-amber-50 hover:bg-opacity-50 rounded-md py-2 px-4 font-medium">Products</a>
              <a href="/categories" className="text-gray-700 hover:bg-[#2973B2] hover:text-amber-50 hover:bg-opacity-50 rounded-md py-2 px-4 font-medium">Categories</a>
              <a href="/about" className="text-gray-700 hover:bg-[#2973B2] hover:text-amber-50 hover:bg-opacity-50 rounded-md py-2 px-4 font-medium">About</a>
              <a href="/contact" className="text-gray-700 hover:bg-[#2973B2] hover:text-amber-50 hover:bg-opacity-50 rounded-md py-2 px-4 font-medium">Contact</a>
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              {/* Search Form */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="px-3 py-1 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-[#2973B2] text-white px-3 py-1 rounded-r-md hover:bg-indigo-700"
                >
                  <Search size={24} />
                </button>
              </form>

              {/* Account */}
              <a href="/account" className="text-gray-700 hover:bg-[#2973B2] hover:text-amber-50 hover:bg-opacity-50 rounded-full py-2 px-4">
                <User size={20} />
              </a>

              {/* Cart */}
              <a href="/cart" className="relative text-gray-700 hover:bg-[#2973B2] hover:text-amber-50 hover:bg-opacity-50 rounded-full py-2 px-4">
                <ShoppingCart size={20} />
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
                )}
              </a>

              {/* Logout Icon */}
              <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center justify-center bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                  title="Logout"
              >
                <FiLogOut size={20} />
              </button>

              {/* Mobile Menu Button */}
              <button
                  className="md:hidden text-gray-700 focus:outline-none"
                  onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
              <div className="md:hidden mt-4 pb-4">
                <form onSubmit={handleSearch} className="flex items-center mb-4">
                  <input
                      type="text"
                      placeholder="Search products..."
                      className="flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                      type="submit"
                      className="bg-indigo-600 text-white px-3 py-2 rounded-r-md hover:bg-indigo-700"
                  >
                    <Search size={18} />
                  </button>
                </form>

                <nav className="flex flex-col space-y-3">
                  <a href="/" onClick={toggleMobileMenu} className="text-gray-700 hover:bg-[#2973B2] font-medium py-1">Home</a>
                  <a href="/products" onClick={toggleMobileMenu} className="text-gray-700 hover:bg-[#2973B2] font-medium py-1">Products</a>
                  <a href="/categories" onClick={toggleMobileMenu} className="text-gray-700 hover:bg-[#2973B2] font-medium py-1">Categories</a>
                  <a href="/about" onClick={toggleMobileMenu} className="text-gray-700 hover:bg-[#2973B2] font-medium py-1">About</a>
                  <a href="/contact" onClick={toggleMobileMenu} className="text-gray-700 hover:bg-[#2973B2] font-medium py-1">Contact</a>
                  <a href="/account" onClick={toggleMobileMenu} className="text-gray-700 hover:bg-[#2973B2] font-medium py-1">My Account</a>

                  {/* Mobile Logout */}
                  <button
                      onClick={() => {
                        toggleMobileMenu();
                        handleLogout();
                      }}
                      className="text-red-600 flex items-center py-1"
                      title="Logout"
                  >
                    <FiLogOut size={20} />
                  </button>
                </nav>
              </div>
          )}
        </div>
      </header>
  );
}

export default Header;
