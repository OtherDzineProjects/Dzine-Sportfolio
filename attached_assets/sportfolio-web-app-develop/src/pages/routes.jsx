import { lazy } from "react";
import { routes as authRoutes } from "./auth/routes";
import { routes as accountRoutes } from "./account/routes";
import PageNotFound from "common/components/404/PageNotFound";

const App = lazy(() => import("App"));
const Public = lazy(() => import("layout/public"));
const Private = lazy(() => import("layout/private"));

const teamLoader = () => {
  return "Loader";
};

export const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <PageNotFound />,
    loader: teamLoader
  },
  {
    path: "/auth",
    element: <Public />,
    errorElement: <PageNotFound />,
    loader: teamLoader,
    children: [...authRoutes]
  },
  {
    path: "/account",
    element: <Private />,
    errorElement: <PageNotFound />,
    loader: teamLoader,
    children: [...accountRoutes]
  },
  {
    path: "*",
    element: <PageNotFound />
  }
];
