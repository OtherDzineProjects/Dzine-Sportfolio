import { Typography } from "common";
import { colors } from "utils/colors";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import { useLocation } from "react-router-dom";
import HeaderActions from "./Actions";
import { setHeaderInfo, setUserInfo } from "pages/common/slice";
import { useEffect } from "react";
import SearchBar from "./SearchBar";
import { STORAGE_KEYS } from "common/constants";
import OrgHeader from "./OrgHeader";
import UserHeader from "./UserHeader";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";

const Header = () => {
  const userDataLocalStorage = localStorage.getItem(STORAGE_KEYS.USER);

  const headerInfo = useSelector((state) => state.common.headerInfo);
  const searchBar = useSelector((state) => state.common.searchBar);
  const location = useLocation();
  const dispatch = useDispatch(),
    [searchParams] = useSearchParams();

  useEffect(() => {
    if (userDataLocalStorage) {
      dispatch(setUserInfo(JSON.parse(userDataLocalStorage)));
    }
  }, [userDataLocalStorage]);

  const checkNavigation = useMemo(() => {
    if (location.pathname.includes("/dashboard")) {
      return "dashboard";
    } else if (
      location.pathname.includes("/users") &&
      !location.pathname.includes("/users/new")
    ) {
      return "users";
    } else if (
      location.pathname.includes("/organizations") &&
      !location.pathname.includes("/organizations/new")
    ) {
      let tab = "";
      switch (searchParams.get("tab")) {
        case "member":
          tab = "member-org-search";
          break;
        case "my_organization":
          tab = "my-org-search";
          break;
        case "recent_organization":
          tab = "recent-org-search";
          break;
      }
      return tab;
    } else if (location.pathname.includes("/notifications")) {
      let tab = "";
      switch (searchParams.get("tab")) {
        case "inbox":
          tab = "inbox-notify-search";
          break;
        case "sent":
          tab = "sent-notify-search";
          break;
        case "awaiting":
          tab = "await-notify-search";
          break;
      }
      return tab;
    }
    return "dashboard";
  }, [location, searchParams]);

  useEffect(() => {
    if (location?.pathname?.includes("/dashboard")) {
      dispatch(
        setHeaderInfo({
          title: "Dashboard",
          subTitle: "Welcome to the Sportfolio"
        })
      );
    } else if (
      location?.pathname?.includes("/users") &&
      !location?.pathname?.includes("/users/new")
    ) {
      dispatch(
        setHeaderInfo({ title: "Users", subTitle: "Users listing here.." })
      );
    } else if (location?.pathname?.includes("/organizations")) {
      dispatch(
        setHeaderInfo({
          title: "Organizations",
          subTitle: "Orgs Listing here.."
        })
      );
    } else if (location?.pathname?.includes("/notifications")) {
      dispatch(
        setHeaderInfo({
          title: "Notifications",
          subTitle: "Notifications Listing here.."
        })
      );
    } else if (location?.pathname?.includes("/settings")) {
      dispatch(
        setHeaderInfo({
          title: "Settings",
          subTitle: "Settings Listing here.."
        })
      );
    } else {
      dispatch(setHeaderInfo({ title: "Sportfolio", subTitle: "Welcome" }));
    }
  }, [location.pathname]);

  const renderHeaders = () => {
    if (
      location?.pathname?.includes("/organizations/") &&
      (location.pathname?.includes("/profile") ||
        location.pathname?.includes("/members") ||
        location.pathname?.includes("/settings"))
    ) {
      return <OrgHeader />;
    } else if (
      location?.pathname?.includes("/user") &&
      location.pathname?.includes("/profile")
    ) {
      return <UserHeader />;
    }
    return (
      <div className="header flex gap-4 p-5 items-center relative">
        <div>
          <Typography
            text={headerInfo?.title}
            type="h4"
            size="md"
            color={colors.dark}
          />
          <Typography
            text={headerInfo?.subTitle}
            type="paragraph"
            size="sm"
            color={colors.gray}
          />
        </div>
        <div className="flex-grow" />
        <div>
          <HeaderActions from={checkNavigation} />
        </div>
        {searchBar && <SearchBar from={checkNavigation} />}
      </div>
    );
  };

  return renderHeaders();
};

export default Header;
