import routers from "../config/router";
import AdminLayout from "../layouts/AdminLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import AdminTemplate from "../pages/AdminTemplate";
import Cart from "../pages/Cart.tsx";
import CategoriesProducts from "../pages/CategriesProducts.tsx";
import CheckoutPage from "../pages/CheckoutPage.tsx";
import DashboardPage from "../pages/Dashboard";
import EmailVerificationPage from "../pages/EmailVerificationPage.tsx";
import ForgotPasswordPage from "../pages/ForgotPasswordPage.tsx";
import Home from "../pages/Home";
import Login from "../pages/Login";
import OrderManagement from "../pages/OrderManagement";
import PaymentConfirmation from "../pages/PaymentConfirmation.tsx";
import ProductDetails from "../pages/ProductDetails.tsx";
import ResetPasswordPage from "../pages/ResetPasswordPage.tsx";
import RevenueDashboard from "../pages/RevenueDashboard";
import SellerManagement from "../pages/SellerManagement";
import SignUp from "../pages/SignUp";
import UserManagement from "../pages/UserManagement";
import { Route } from "../types";

const publicRoutes: Route[] = [
  { path: routers.login, page: Login, layout: DefaultLayout },
  { path: routers.register, page: SignUp, layout: DefaultLayout },
  { path: routers.adminDashboard, page: DashboardPage, layout: AdminLayout },
  { path: routers.adminTemplates, page: AdminTemplate, layout: AdminLayout },
  { path: routers.adminUsers, page: UserManagement, layout: AdminLayout },
  { path: routers.adminSellers, page: SellerManagement, layout: AdminLayout },
  { path: routers.analytics, page: RevenueDashboard, layout: AdminLayout },
  { path: routers.orders, page: OrderManagement, layout: AdminLayout },
  { path: routers.detail, page: ProductDetails, layout: DefaultLayout },
  { path: routers.categories, page: CategoriesProducts, layout: DefaultLayout },
  { path: routers.cart, page: Cart, layout: DefaultLayout },
  { path: routers.home, page: Home, layout: DefaultLayout },
  {
    path: routers.verifyEmail,
    page: EmailVerificationPage,
    layout: DefaultLayout,
  },
   {
    path: routers.forgotPass,
    page: ForgotPasswordPage,
    layout: DefaultLayout,
  },
    {
    path: routers.resetPass,
    page: ResetPasswordPage,
    layout: DefaultLayout,
  },
];

const privateRoutes: Route[] = [
  { path: routers.home, page: Home, layout: DefaultLayout },
  { path: routers.checkout, page: CheckoutPage, layout: DefaultLayout },
  {
    path: routers.paymentVNPay,
    page: PaymentConfirmation,
    layout: DefaultLayout,
  },
];

export { privateRoutes, publicRoutes };

