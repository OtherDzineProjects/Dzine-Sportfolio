import { lazy } from "react";
import OrgProfile from "./components/OrgProfile";
import PageNotFound from "common/components/404/PageNotFound";

const Organizations = lazy(() => import("./index"));
const OrganizationsCreate = lazy(() =>
  import("./components/OrganizationCreate")
);
const OrganizationMembers = lazy(() => import("./components/OrgMembers"));
const OrganizationSettings = lazy(() => import("./components/OrgSettings"));

const teamLoader = () => {
  return "Loader";
};

export const routes = [
  {
    path: "",
    element: <Organizations />,
    errorElement: <PageNotFound />,
    loader: teamLoader
  },
  {
    path: ":orgId/profile",
    element: <OrgProfile />,
    errorElement: <PageNotFound />,
    loader: teamLoader
  },
  {
    path: ":orgId/members",
    element: <OrganizationMembers />,
    errorElement: <PageNotFound />,
    loader: teamLoader
  },
  {
    path: ":orgId/settings",
    element: <OrganizationSettings />,
    errorElement: <PageNotFound />,
    loader: teamLoader
  },
  {
    path: "new",
    element: <OrganizationsCreate />,
    errorElement: <PageNotFound />,
    loader: teamLoader
  }
];
