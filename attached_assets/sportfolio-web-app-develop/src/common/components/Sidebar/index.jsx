import { IconButton, Image } from "common";
import SportfolioDarkLogo from "assets/sportfolio-dark-logo.svg";
import { LeftCollapse } from "assets/DashboardIcons";
import { colors } from "utils/colors";
import "./style.css";
import { sidebarMenu, sidebarMenuFooter } from "common/menu";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RightArrow } from "assets/InputIcons";
import { ORIGIN, PATH_USER_PROFILE, URL_TYPE } from "common/constants";
import { reRoute } from "utils/reRoutes";
import UserIcon from "assets/UserIcon";
import useConfirmAlert from "hooks/useConfirmAlert";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.common),
    showConfirmAlert = useConfirmAlert();

  const handleSideMenu = (data) => {
    if (data.urlType === URL_TYPE.INTERNAL) {
      if (data.key?.includes("account/user/profile")) {
        navigate(data.url?.replace(":userId", userInfo?.id));
      } else if (data.key?.includes("account/organizations")) {
        navigate(data.url?.replace(":selectedTab", "my_organization"));
      } else if (data.key?.includes("account/notifications")) {
        navigate(data.url?.replace(":selectedTab", "inbox"));
      } else if (data.key?.includes("settings")) {
        navigate(data.url?.replace(":selectedMenu", "profile"));
      } else {
        navigate(data.url);
      }
    } else {
      if (data.name === "Logout") {
        showConfirmAlert("", "Are you sure want to logout?", () => {
          localStorage.clear();
          reRoute(`${ORIGIN}${data.url}`);
        });

        return;
      }
      reRoute(`${ORIGIN}${data.url}`);
    }
  };

  return (
    <div className="side-bar h-full flex-col">
      <div className="header flex gap-4 p-5 items-center flex-none">
        <div>
          <Image src={SportfolioDarkLogo} alt="sportfolio-logo" width={180} />
        </div>
        <div>
          <IconButton
            variant="ghost"
            color={colors.dark}
            icon={<LeftCollapse />}
          />
        </div>
      </div>
      <section className="flex flex-col items-start justify-between h-full max-h-[calc(100svh-5.625rem)]">
        <div className="menu-container flex-none overflow-y-auto pb-0">
          {sidebarMenu?.map((item) => (
            <div
              className={
                location?.pathname.includes(item.key)
                  ? "menu-item flex gap-4 active-menu"
                  : "menu-item gap-4 flex"
              }
              role="button"
              onClick={() => handleSideMenu(item)}
              key={item.id}
            >
              <div className="flex-none icon">{item.icon}</div>
              <div className="flex-grow">{item.name}</div>
              <div className="flex-none">
                <RightArrow color={colors.gray} />
              </div>
            </div>
          ))}
        </div>
        <footer className="w-full">
          <div className="menu-container footer flex-none py-0">
            {sidebarMenuFooter?.map((item) => (
              <div
                className={
                  location?.pathname.includes(item.key)
                    ? "menu-item flex gap-4 active-menu"
                    : "menu-item gap-4 flex"
                }
                role="button"
                onClick={() => handleSideMenu(item)}
                key={item.id}
              >
                <div className="flex-none icon">{item.icon}</div>
                <div className="flex-grow">{item.name}</div>
                <div className="flex-none">
                  <RightArrow color={colors.gray} />
                </div>
              </div>
            ))}
          </div>

          <div className="menu-container footer flex-none">
            <div
              className="menu-item flex gap-4 profile-menu items-center"
              role="button"
              onClick={() =>
                navigate(PATH_USER_PROFILE.replace(":id", userInfo?.id))
              }
            >
              <div className="flex-none icon">
                {userInfo?.avatar?.path ? (
                  <Image
                    src={userInfo?.avatar?.path}
                    alt="profile-logo"
                    height="40px"
                    width="40px"
                    className="h-[2.5rem] w-[2.5rem] rounded-full"
                  />
                ) : (
                  <UserIcon className="h-[2.5rem] w-[2.5rem] rounded-full border-none outline-none" />
                )}
              </div>
              <div className="flex-grow">
                <div className="w-full title truncate max-w-[12ch] !leading-snug">
                  {`${userInfo?.firstName || ""} ${userInfo?.lastName || ""}`}
                </div>
              </div>
              <div className="flex-none">
                <RightArrow color={colors.gray} />
              </div>
            </div>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Sidebar;
