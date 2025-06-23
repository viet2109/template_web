import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { fetchCart } from "../api/user";
import routers from "../config/router";
import { CartItemDto } from "../types";

function Cart() {
  const [checkedCartItems, setCheckedCartItems] = useState<CartItemDto[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const navigate = useNavigate();

  // Infinite query for cart items
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["cart"],
    queryFn: ({ pageParam = 0 }) =>
      fetchCart({
        page: pageParam,
        size: 10,
      }),
    getNextPageParam: (lastPage) => {
      const { page } = lastPage;
      return page.number < page.totalPages - 1 ? page.number + 1 : undefined;
    },
    initialPageParam: 0,
  });

  // Flatten all cart items from all pages
  const cartItems = data?.pages.flatMap((page) => page.content) || [];
  const totalItems = data?.pages[0]?.page.totalElements || 0;

  const handleCheck = useCallback((cartItem: any) => {
    setCheckedCartItems((prev) => {
      const isChecked = prev.some((item) => item.id === cartItem.id);
      if (isChecked) {
        return prev.filter((item) => item.id !== cartItem.id);
      } else {
        return [...prev, cartItem];
      }
    });
  }, []);

  const handleClick = () => {
    navigate(routers.checkout, { state: { selectedItems: checkedCartItems } });
  };

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setCheckedCartItems([]);
    } else {
      setCheckedCartItems(cartItems);
    }
    setSelectAll(!selectAll);
  }, [selectAll, cartItems]);

  const calculateTotal = useCallback(() => {
    return checkedCartItems.reduce((sum, cartItem) => {
      const template = cartItem.template;
      const price =
        template.discountPrice > 0 ? template.discountPrice : template.price;
      return sum + price;
    }, 0);
  }, [checkedCartItems]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const isTemplateChecked = (cartItemId: number) => {
    return checkedCartItems.some((cartItem) => cartItem.id === cartItemId);
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Có lỗi xảy ra
          </h3>
          <p className="text-gray-600 mb-4">
            Không thể tải giỏ hàng. Vui lòng thử lại.
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 sm:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Giỏ hàng</h1>
                <p className="text-blue-100 mt-2">
                  {totalItems} sản phẩm trong giỏ hàng
                </p>
              </div>
              <div className="hidden sm:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-white text-sm">Tổng đã chọn</div>
                  <div className="text-white text-xl font-bold">
                    {checkedCartItems.length} sản phẩm
                  </div>
                </div>
              </div>
            </div>
          </div>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg
                  className="mx-auto h-24 w-24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L7 13m0 0L4.4 9M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Giỏ hàng trống
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn chưa có sản phẩm nào trong giỏ hàng
              </p>
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 p-6 sm:p-8">
              {/* Cart Items */}
              <div className="lg:col-span-3 space-y-4">
                {/* Select All */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium text-gray-900">
                    Chọn tất cả ({cartItems.length})
                  </span>
                </div>

                {/* Cart Items List */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex gap-4">
                        <input
                          type="checkbox"
                          checked={isTemplateChecked(item.id)}
                          onChange={() => handleCheck(item)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-2"
                        />

                        <div className="flex-shrink-0">
                          <img
                            src={
                              item.template.thumbnailFile?.path ||
                              "/placeholder-image.jpg"
                            }
                            alt={item.template.name}
                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shadow-md"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 truncate">
                                {item.template.name}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {item.template.description}
                              </p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {item.template.category}
                                </span>
                                {item.template.isFree && (
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Miễn phí
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mt-2">
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 text-yellow-400 fill-current"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                  </svg>
                                  <span className="text-sm text-gray-600 ml-1">
                                    {item.template.rating} (
                                    {item.template.totalReviews})
                                  </span>
                                </div>
                                <span className="text-sm text-gray-500">
                                  {item.template.totalSales} lượt mua
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-col items-end">
                              <div className="text-right">
                                {item.template.discountPrice > 0 ? (
                                  <>
                                    <div className="text-lg font-bold text-gray-900">
                                      {formatPrice(item.template.discountPrice)}
                                    </div>
                                    <div className="text-sm text-gray-500 line-through">
                                      {formatPrice(item.template.price)}
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-lg font-bold text-gray-900">
                                    {item.template.isFree
                                      ? "Miễn phí"
                                      : formatPrice(item.template.price)}
                                  </div>
                                )}
                              </div>
                              <button className="mt-2 text-sm text-red-600 hover:text-red-800 transition-colors">
                                Xóa
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {hasNextPage && (
                  <div className="text-center pt-6">
                    <button
                      onClick={handleLoadMore}
                      disabled={isFetchingNextPage}
                      className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                    >
                      {isFetchingNextPage ? "Đang tải..." : "Tải thêm"}
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="sticky top-6">
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">
                      Tóm tắt đơn hàng
                    </h3>

                    <div className="space-y-4 mb-6">
                      <div className="flex justify-between text-gray-600">
                        <span>Sản phẩm đã chọn:</span>
                        <span>{checkedCartItems.length}</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Tạm tính:</span>
                        <span>{formatPrice(calculateTotal())}</span>
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex justify-between text-lg font-bold text-gray-900">
                          <span>Tổng cộng:</span>
                          <span className="text-blue-600">
                            {formatPrice(calculateTotal())}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={handleClick}
                      disabled={checkedCartItems.length === 0}
                      className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      Tiến hành thanh toán
                    </button>

                    <div className="mt-4 text-center">
                      <button className="text-sm text-gray-600 hover:text-gray-800 transition-colors">
                        Tiếp tục mua sắm
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cart;
