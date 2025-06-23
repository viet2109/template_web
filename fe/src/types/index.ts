import { FC } from "react";

export interface Route {
  path: string;
  page: FC<any>;
  layout?: FC<any>;
}

export interface User {
  name: string;
  email: string;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  VNPAY = "VNPAY",
  PAYPAL = "PAYPAL",
  STRIPE = "STRIPE",
  COD = "COD",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export enum Category {
  LANDING_PAGE = "LANDING_PAGE",
  E_COMMERCE = "E_COMMERCE",
  PORTFOLIO = "PORTFOLIO",
  BLOG = "BLOG",
  BUSINESS = "BUSINESS",
  ADMIN_DASHBOARD = "ADMIN_DASHBOARD",
  CRM = "CRM",
  CMS = "CMS",
  OTHER = "OTHER",
}

export enum Color {
  RED = "RED",
  BLUE = "BLUE",
  GREEN = "GREEN",
  YELLOW = "YELLOW",
  // ... etc.
}

export enum LicenseType {
  SINGLE = "SINGLE",
  MULTIPLE = "MULTIPLE",
  EXTENDED = "EXTENDED",
}

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export interface FileDto {
  id: number;
  name: string;
  path: string;
  type: string;
  size: number;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
}

export interface UserAdminBasicDto {
  id: number;
  firstName: string;
  lastName: string;
  avatar: FileDto | null;
  email: string;
}

export interface AdminOrderItemDto {
  id: number;
  template: TemplateCardDto;
  price: number; // BigDecimal → number
  licenseType: LicenseType;
  commissionRate: number; // Double → number
  createdAt: string; // ISO datetime
}

export interface CouponUsageDto {
  id: number;
  coupon: AdminCouponDto;
  user: UserBasicDto;
  orderId: number;
  discountAmount: number; // Double → number
  usedAt: string; // ISO datetime
}

export interface AdminCouponDto {
  id: number;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  minimumAmount: number;
  maximumDiscount: number;
  usageLimit: number;
  usedCount: number;
  userLimit: number;
  startDate: string; // ISO datetime
  endDate: string; // ISO datetime
  isActive: boolean;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  couponUsagesPage: Page<CouponUsageDto>;
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface Page<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface UserBasicDto {
  id: number;
  firstName: string;
  lastName: string;
  avatar: FileDto | null;
}

export interface SellerBasicDto {
  id: number;
  name: string;
  description: string;
  rating: number;
  totalReviews: number;
  totalSales: number;
  portfolioUrl: string;
  website: string;
}

export interface TemplateCardDto {
  id: number;
  name: string;
  description: string;
  category: Category;
  colors: Color[];
  isFree: boolean;
  price: number; // BigDecimal → number
  discountPrice: number; // BigDecimal → number
  totalSales: number;
  rating: number;
  totalReviews: number;
  thumbnailFile: FileDto | null;
  demoUrl: string;
  seller: SellerBasicDto;
  isInWishlist: boolean;
  isPurchased: boolean;
  licenseType: LicenseType;
  createdAt: string; // ISO datetime
}

export interface AdminOrderAnalyticsDto {
  totalOrders: number;
  totalCompletedOrders: number;
  totalPendingOrders: number;
  revenue: number; // BigDecimal → number
}

export interface AdminOrderDto {
  id: number;
  user: UserAdminBasicDto;
  taxAmount: number; // Double → number
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentTransactionId: string;
  billingInfo: string; // raw JSON/text
  notes: string;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  completedAt: string | null;
  orderItems: AdminOrderItemDto[];
  couponUsages: CouponUsageDto[];
}

// enums.ts (nếu chưa có)
export enum GroupBy {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export interface RevenueByPeriodParams {
  start: string;
  end: string;
  groupBy?: GroupBy;
}

export interface RevenueByCategoryParams {
  year: number;
  month: number;
}

export interface RevenueByPeriodDto {
  period: string;
  revenue: number;
}

export interface RevenueByCategoryDto {
  category: string;
  revenue: number;
}

export interface AdminUserDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: FileDto | null;
  provider: AuthProvider;
  createdAt: string; // ISO datetime
  updatedAt: string; // ISO datetime
  status: UserStatus;
  roles: Role[];
  totalOrders: number;
  totalSpent: number; // Double → number
}

export enum AuthProvider {
  LOCAL = "LOCAL",
  GOOGLE = "GOOGLE",
  FACEBOOK = "FACEBOOK",
}

export enum UserStatus {
  PENDING = "PENDING", // chờ kích hoạt
  ACTIVE = "ACTIVE", // đang hoạt động
  SUSPENDED = "SUSPENDED", // tạm khoá
  DISABLED = "DISABLED", // vô hiệu hoá
  DELETED = "DELETED", // đã xoá (soft delete)
}

export enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
  SELLER = "SELLER",
}

export interface AdminTemplateDto {
  id: number;
  name: string;
  description: string;
  category: Category;
  colors: Color[];
  isFree: boolean;
  price: number;
  discountPrice: number;
  techStack: string;
  features: string;
  compatibility: string;
  totalSales: number;
  totalDownloads: number;
  rating: number;
  totalReviews: number;
  totalComments: number;
  maxPurchases: number;
  createdAt: string; // hoặc Date nếu bạn xử lý bằng đối tượng Date
  updatedAt: string;
  approvedAt: string | null;
  demoUrl: string;
  downloadFile: FileDto;
  thumbnailFile: FileDto;
  status: TemplateStatus;
  rejectionReason: string | null;
  licenseType: LicenseType;
  seller: SellerBasicDto;
}

export enum TemplateStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  SUSPENDED = "SUSPENDED",
}

export interface CategorySalesDto {
  category: Category;
  totalSales: number;
  totalRevenue: number;
}

export interface AdminDashboardDto {
  totalUsers: number;
  totalSellers: number;
  totalTemplates: number;
  totalOrders: number;
  totalRevenue: number;
  totalCommissions: number;
  newUsersThisMonth: number;
  newSellersThisMonth: number;
  newTemplatesThisMonth: number;
  newOrdersThisMonth: number;
  categorySales: CategorySalesDto[];
  monthlySales: MonthlySalesDto[];
  topSellers: TopSellerDto[];
  topTemplates: TopTemplateDto[];
}

export interface MonthlySalesDto {
  monthDto: string; // e.g. "2025-06"
  totalSales: number; // Long → number
  totalRevenue: string; // BigDecimal → string
}

export interface TopSellerDto {
  id: number;
  name: string;
  totalSales: number; // Double → number
  totalTemplates: number;
  rating: number;
}

export interface TopTemplateDto {
  id: number;
  name: string;
  sellerName: string;
  totalSales: number;
  totalRevenue: number; // Double → number
  rating: number;
}

export interface UserProfileDto {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  avatar: FileDto; // tương ứng với FileDto bên Java
  status: UserStatus; // enum UserStatus
  provider: AuthProvider; // enum AuthProvider
  roles: Role[]; // Set<Role> → mảng Role[]
  createdAt: string; // LocalDateTime → chuỗi ISO
  updatedAt: string;
}

export interface AuthenticationResponse {
  accessToken: string;
  user: UserProfileDto;
}

// Interface cho CartItemDto
export interface CartItemDto {
  id: number;
  template: TemplateCardDto;
  createdAt: string;
}

export interface CreateOrderDto {
  paymentMethod: PaymentMethod;
  billingInfo: string;
  notes?: string;
  couponCode?: string;
  cartItemIds: number[];
}

export interface CouponBasicDto {
  id: number;
  code: string;
  usageLimit: number;
  usedCount: number;
}

// Interface for CouponUsageBasicDto
export interface CouponUsageBasicDto {
  id: number;
  coupon: CouponBasicDto;
  discountAmount: number;
  usedAt: string;
}

// Interface for OrderItemDto
export interface OrderItemDto {
  id: number;
  template: TemplateCardDto;
  price: number;
  licenseType: LicenseType;
  createdAt: string;
  isReviewed: boolean;
}

// Interface for OrderDto
export interface OrderDto {
  id: number;
  taxAmount: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentTransactionId?: string;
  billingInfo: string;
  notes?: string;
  createdAt: string;
  completedAt?: string;
  orderItems: OrderItemDto[];
  couponUsages: CouponUsageBasicDto[];
}

export interface PaymentRequestDto {
  orderId: number;
  amount: number;
}