import routers from "../config/router";
import AdminLayout from "../layouts/AdminLayout";
import DefaultLayout from "../layouts/DefaultLayout";
import AdminTemplate from "../pages/AdminTemplate";
import DashboardPage from "../pages/Dashboard";
import Home from "../pages/Home";
import Login from "../pages/Login";
import OrderManagement from "../pages/OrderManagement";
import RevenueDashboard from "../pages/RevenueDashboard";
import SellerManagement from "../pages/SellerManagement";
import SignUp from "../pages/SignUp";
import UserManagement from "../pages/UserManagement";
import ProductDetails from "../pages/ProductDetails.tsx";
import { Route } from "../types";
import CategoriesProducts from "../pages/CategriesProducts.tsx";
import Cart from "../pages/Cart.tsx";

const publicRoutes: Route[] = [
  { path: routers.login, page: Login },
  { path: routers.register, page: SignUp },
  { path: routers.adminDashboard, page: DashboardPage, layout: AdminLayout },
  { path: routers.adminTemplates, page: AdminTemplate, layout: AdminLayout },
  { path: routers.adminUsers, page: UserManagement, layout: AdminLayout },
  { path: routers.adminSellers, page: SellerManagement, layout: AdminLayout },
  { path: routers.analytics, page: RevenueDashboard, layout: AdminLayout },
  { path: routers.orders, page: OrderManagement, layout: AdminLayout },
  { path: routers.detail, page: ProductDetails },
  { path: routers.categories, page: CategoriesProducts },
  { path: routers.cart, page: Cart },
];

const privateRoutes: Route[] = [
  { path: routers.home, page: Home, layout: DefaultLayout },
];

export { privateRoutes, publicRoutes };

