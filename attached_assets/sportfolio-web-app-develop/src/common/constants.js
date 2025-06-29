// NAVIGATIONS
export const API_FILE_URL = import.meta.env.VITE_FILE_URL;
export const ORIGIN = window.location.origin;
export const PATH_SIGNIN = "/auth/signin";
export const PATH_SIGNUP = "/auth/signup";
export const PATH_PROBLEM_SIGNIN = "/auth/problem/signin";
export const PATH_DASHBOARD = "/account/dashboard";
export const PATH_ORGANIZATION = "/account/organizations";
export const PATH_ORGANIZATION_PROFILE = "/account/organizations/:id/profile";
export const PATH_USER_PROFILE = "/account/users/:id/profile";
export const PATH_USER_PROFILE_VIA_ORG =
  "/account/users/:id/profile?orgID=:orgID";
export const PATH_INVOICE = "/account/invoice";
export const PATH_PROFILE = "/account/profile";
export const PATH_NOTIFICATION =
  "/account/notifications?tab=inbox&page=1&pageSize=12";

// LOCAL_STORAGES
export const STORAGE_KEYS = {
  TOKEN: "sport-token",
  USER: "sport-user",
  CHANGE_PASSWORD: "sport-change-password"
};

// API_METHODS
export const REQUEST_METHOD = {
  GET: "GET",
  PUT: "PUT",
  POST: "POST",
  PATCH: "PATCH",
  DELETE: "DELETE",
  MULTIPART: "MULTIPART"
};

// CONTENT_TYPE
export const CONTENT_TYPE = {
  APPLICATION_JSON: "application/json"
};

// HEADERS
export const HTTP_HEADERS = {
  "Content-Type": CONTENT_TYPE.APPLICATION_JSON,
  Accept: CONTENT_TYPE.APPLICATION_JSON
};

export const URL_TYPE = {
  INTERNAL: "internal",
  EXTERNAL: "external"
};
