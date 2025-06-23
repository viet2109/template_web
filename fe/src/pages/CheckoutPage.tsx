import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import { paymentVNPay } from "../api/payment";
import { placeOrder } from "../api/user";
import routers from "../config/router";
import { RootState } from "../store/store";
import {
  AdminCouponDto,
  CartItemDto,
  CreateOrderDto,
  DiscountType,
  PaymentMethod,
  TemplateCardDto,
} from "../types";

interface CheckoutPageProps {}

const CheckoutPage: React.FC<CheckoutPageProps> = ({}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<AdminCouponDto | null>(
    null
  );
  const user = useSelector((state: RootState) => state.auth.user);

  const { state } = useLocation();
  // Nhận cart items từ state và extract templates
  const cartItems: CartItemDto[] = state?.selectedItems || [];
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [billingInfo, setBillingInfo] = useState({
    fullName: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const paymentMethods = [
    {
      id: PaymentMethod.VNPAY,
      name: "VNPay",
      description: "Thanh toán qua VNPay",
      icon: "💳",
      popular: true,
    },
    {
      id: PaymentMethod.PAYPAL,
      name: "PayPal",
      description: "Thanh toán qua PayPal",
      icon: "🅿️",
      popular: false,
    },
    {
      id: PaymentMethod.STRIPE,
      name: "Stripe",
      description: "Thanh toán qua thẻ tín dụng",
      icon: "💰",
      popular: false,
    },
    {
      id: PaymentMethod.BANK_TRANSFER,
      name: "Chuyển khoản ngân hàng",
      description: "Chuyển khoản trực tiếp",
      icon: "🏦",
      popular: false,
    },
  ];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const calculateSubtotal = useCallback(() => {
    return cartItems.reduce((sum, cartItem) => {
      const template = cartItem.template;
      const price =
        template.discountPrice > 0 ? template.discountPrice : template.price;
      // Không có quantity trong CartItemDto, mỗi item được tính là 1
      return sum + price;
    }, 0);
  }, [cartItems]);

  const calculateDiscount = useCallback(() => {
    if (!appliedCoupon) return 0;

    const subtotal = calculateSubtotal();
    if (appliedCoupon.discountType === "PERCENTAGE") {
      const discount = (subtotal * appliedCoupon.discountValue) / 100;
      return Math.min(discount, appliedCoupon.maximumDiscount);
    } else {
      return appliedCoupon.discountValue;
    }
  }, [appliedCoupon, calculateSubtotal]);

  const calculateTotal = useCallback(() => {
    const subtotal = calculateSubtotal();
    const discount = calculateDiscount();
    const tax = subtotal * 0; // 10% VAT
    return subtotal - discount + tax;
  }, [calculateSubtotal, calculateDiscount]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Vui lòng nhập mã giảm giá");
      return;
    }

    setIsApplyingCoupon(true);
    setCouponError("");

    try {
      // Mock API call - thay thế bằng API thực tế
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock response - thay thế bằng dữ liệu từ API
      if (couponCode.toUpperCase() === "SAVE20") {
        const mockCoupon: AdminCouponDto = {
          id: 1,
          code: "SAVE20",
          description: "Giảm 20% cho đơn hàng",
          discountType: DiscountType.PERCENTAGE,
          discountValue: 20,
          minimumAmount: 100000,
          maximumDiscount: 100000,
          usageLimit: 100,
          usedCount: 10,
          userLimit: 1,
          startDate: "2024-01-01T00:00:00Z",
          endDate: "2024-12-31T23:59:59Z",
          isActive: true,
          createdAt: "2024-01-01T00:00:00Z",
          updatedAt: "2024-01-01T00:00:00Z",
          couponUsagesPage: {
            content: [],
            page: {
              size: 10,
              number: 0,
              totalElements: 0,
              totalPages: 0,
            },
          },
        };

        if (calculateSubtotal() >= mockCoupon.minimumAmount) {
          setAppliedCoupon(mockCoupon);
          setCouponCode("");
        } else {
          setCouponError(
            `Đơn hàng tối thiểu ${formatPrice(
              mockCoupon.minimumAmount
            )} để sử dụng mã này`
          );
        }
      } else {
        setCouponError("Mã giảm giá không hợp lệ hoặc đã hết hạn");
      }
    } catch (error) {
      setCouponError("Có lỗi xảy ra khi áp dụng mã giảm giá");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

const handlePlaceOrder = async () => {
  if (!selectedPaymentMethod) {
    alert("Vui lòng chọn phương thức thanh toán");
    return;
  }

  if (!billingInfo.fullName || !billingInfo.email) {
    alert("Vui lòng điền đầy đủ thông tin thanh toán");
    return;
  }

  setIsProcessing(true);

  try {
    const orderData: CreateOrderDto = {
      cartItemIds: cartItems.map((cartItem) => cartItem.id),
      paymentMethod: selectedPaymentMethod,
      billingInfo: JSON.stringify(billingInfo),
      couponCode: appliedCoupon?.code,
      notes: notes.trim() || undefined,
    };

    // Tạo đơn hàng
    const data = await placeOrder(orderData);

    if (selectedPaymentMethod === PaymentMethod.VNPAY) {
      // Lấy URL thanh toán từ VNPay
      const paymentUrl = await paymentVNPay({ 
        orderId: data.id, 
        amount: calculateTotal() 
      });
      
      // Chuyển hướng đến trang thanh toán VNPay
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        throw new Error("Không thể tạo URL thanh toán VNPay");
      }
    } else if (selectedPaymentMethod === PaymentMethod.PAYPAL) {
      // Xử lý thanh toán PayPal
      // TODO: Implement PayPal payment logic
      alert("Tính năng thanh toán PayPal đang được phát triển");
    } else if (selectedPaymentMethod === PaymentMethod.STRIPE) {
      // Xử lý thanh toán Stripe
      // TODO: Implement Stripe payment logic
      alert("Tính năng thanh toán Stripe đang được phát triển");
    } else if (selectedPaymentMethod === PaymentMethod.BANK_TRANSFER) {
      // Chuyển hướng đến trang hướng dẫn chuyển khoản
      navigate(`/order-success/${data.id}`, {
        state: { 
          orderData: data,
          paymentMethod: PaymentMethod.BANK_TRANSFER
        }
      });
    }
  } catch (error) {
    console.error("Lỗi khi đặt hàng:", error);
    alert("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.");
  } finally {
    setIsProcessing(false);
  }
};

  // Hàm helper để lấy thông tin template từ cart item
  const getTemplateFromCartItem = (
    cartItem: CartItemDto | TemplateCardDto
  ): TemplateCardDto => {
    return (cartItem as CartItemDto).template || (cartItem as TemplateCardDto);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(routers.cart)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors mb-4"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Quay lại giỏ hàng
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Xác nhận đơn hàng
          </h1>
          <p className="text-gray-600 mt-2">
            Kiểm tra lại thông tin và hoàn tất đơn hàng của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Items & Billing Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Sản phẩm đã chọn ({cartItems.length})
              </h2>
              <div className="space-y-4">
                {cartItems.map((cartItem) => {
                  const template = getTemplateFromCartItem(cartItem);

                  return (
                    <div
                      key={cartItem.id || template.id}
                      className="flex gap-4 p-4 border border-gray-200 rounded-xl"
                    >
                      <img
                        src={
                          template.thumbnailFile?.path ||
                          "/placeholder-image.jpg"
                        }
                        alt={template.name}
                        className="w-20 h-20 object-cover rounded-lg shadow-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {template.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {template.category}
                          </span>
                          <span className="text-sm text-gray-500">
                            Bởi {template.seller.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        {template.discountPrice > 0 ? (
                          <>
                            <div className="font-bold text-gray-900">
                              {formatPrice(template.discountPrice)}
                            </div>
                            <div className="text-sm text-gray-500 line-through">
                              {formatPrice(template.price)}
                            </div>
                          </>
                        ) : (
                          <div className="font-bold text-gray-900">
                            {formatPrice(template.price)}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Billing Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Thông tin thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={billingInfo.fullName}
                    onChange={(e) =>
                      setBillingInfo((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={billingInfo.email}
                    onChange={(e) =>
                      setBillingInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    value={billingInfo.phone}
                    onChange={(e) =>
                      setBillingInfo((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0123456789"
                  />
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Phương thức thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                  >
                    {method.popular && (
                      <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Phổ biến
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{method.icon}</div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {method.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {method.description}
                        </div>
                      </div>
                    </div>
                    <div
                      className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 ${
                        selectedPaymentMethod === method.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedPaymentMethod === method.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Ghi chú đơn hàng
              </h2>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              {/* Coupon */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Mã giảm giá
                </h3>
                {!appliedCoupon ? (
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Nhập mã giảm giá"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isApplyingCoupon ? "Đang áp dụng..." : "Áp dụng"}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-sm text-red-600">{couponError}</p>
                    )}
                    <div className="text-xs text-gray-500">
                      💡 Thử mã "SAVE20" để được giảm 20%
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-green-800">
                          {appliedCoupon.code}
                        </div>
                        <div className="text-sm text-green-600">
                          {appliedCoupon.description}
                        </div>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-green-600 hover:text-green-800"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Tóm tắt đơn hàng
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(calculateSubtotal())}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Giảm giá ({appliedCoupon.code}):</span>
                      <span>-{formatPrice(calculateDiscount())}</span>
                    </div>
                  )}
                  {/* TAX */}
                  {/* <div className="flex justify-between text-gray-600">
                    <span>Thuế VAT (10%):</span>
                    <span>{formatPrice(calculateSubtotal() * 0.1)}</span>
                  </div> */}

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
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedPaymentMethod}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Đang xử lý...
                    </div>
                  ) : (
                    "Đặt hàng ngay"
                  )}
                </button>

                <div className="mt-4 text-center text-sm text-gray-600">
                  <p>🔒 Thanh toán an toàn và bảo mật</p>
                  <p className="mt-1">
                    Bạn sẽ nhận được email xác nhận sau khi đặt hàng
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
