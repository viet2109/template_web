import routers from "../config/router";
import DefaultLayout from "../layouts/DefaultLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import ProductDetails from "../pages/ProductDetails.tsx";
import { Route } from "../types";
import CategoriesProducts from "../pages/CategriesProducts.tsx";

const publicRoutes: Route[] = [
  { path: routers.login, page: Login },
  { path: routers.register, page: SignUp },
  { path: routers.detail, page: ProductDetails },
  { path: routers.categories, page: CategoriesProducts },
];

const privateRoutes: Route[] = [
  { path: routers.home, page: Home, layout: DefaultLayout },
];

export { privateRoutes, publicRoutes };
