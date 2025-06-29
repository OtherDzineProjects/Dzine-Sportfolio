import { Header, Sidebar } from "common";
import { ORIGIN, PATH_SIGNIN, STORAGE_KEYS } from "common/constants";
import { useEffect } from "react";
import { useLocation, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { reRoute } from "utils/reRoutes";
import { setShowChangePasswordModal, setUserInfo } from "pages/common/slice";
import OrgHeader from "common/components/Header/OrgHeader";
import { Fragment } from "react";
import ChangePasswordModal from "common/components/Modal/ChangePasswordModal";

const Private = () => {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const userDataFromStorage = localStorage.getItem(STORAGE_KEYS.USER);
    if (userDataFromStorage) {
      dispatch(setUserInfo(JSON.parse(userDataFromStorage)));
    }
  }, [localStorage.getItem(STORAGE_KEYS.USER)]);

  useEffect(() => {
    if (
      localStorage.getItem(STORAGE_KEYS.CHANGE_PASSWORD) &&
      localStorage.getItem(STORAGE_KEYS.CHANGE_PASSWORD) === `${true}`
    ) {
      dispatch(setShowChangePasswordModal(true));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CHANGE_PASSWORD);
      dispatch(setShowChangePasswordModal(false));
    }
  }, [localStorage.getItem(STORAGE_KEYS.CHANGE_PASSWORD)]);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEYS.TOKEN)) {
      reRoute(`${ORIGIN}${PATH_SIGNIN}`);
    }
  }, [location?.pathname]);

  return (
    <Fragment>
      <div className="flex h-screen">
        <div className="flex-none">
          <Sidebar />
        </div>
        <div className="flex-grow">
          {location?.pathname?.includes("organizations/profile/") ? (
            <OrgHeader />
          ) : (
            <Header />
          )}

          <Outlet />
        </div>
      </div>

      <ChangePasswordModal />
    </Fragment>
  );
};

export default Private;
