import { STORAGE_KEYS } from "common/constants";
import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

const Public = () => {
  const location = useLocation();
  const isUserLoggedIn = useMemo(
    () =>
      localStorage.getItem(STORAGE_KEYS.USER) &&
      localStorage.getItem(STORAGE_KEYS.TOKEN),
    [
      localStorage.getItem(STORAGE_KEYS.USER),
      localStorage.getItem(STORAGE_KEYS.TOKEN)
    ]
  );

  return isUserLoggedIn ? (
    <Navigate to="/account/dashboard" replace state={{ from: location }} />
  ) : (
    <Outlet />
  );
};

export default Public;
