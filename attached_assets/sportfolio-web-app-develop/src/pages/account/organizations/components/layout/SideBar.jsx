import { CircleBulletinIcon } from "assets/InputIcons";
import { List, Typography } from "common";
import { URL_TYPE } from "common/constants";
import { sidebarMenuOrganization } from "common/menu";
import { Fragment } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ScrollSpy from "react-scrollspy-navigation";
import { colors } from "utils/colors";
import "./styles.css";
import { useState } from "react";

const SideBar = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [activeNav, setActiveNav] = useState("about");

  const handleSideMenu = (data) => {
    if (data.urlType === URL_TYPE.INTERNAL) {
      if (data?.url.includes(":id")) {
        switch (data.key) {
          case "members":
            navigate(
              `/${data.url
                .replace(":id", params?.orgId)
                .replace(":selectedTab", "existing")}`
            );
            break;
          default:
            navigate(`/${data.url.replace(":id", params?.orgId)}`);
            break;
        }
      } else {
        navigate(`/${data.url}`);
      }
    }
  };

  const handleClick = (key) => {
    setActiveNav(key);
    document.getElementById(`${key}`)?.scrollIntoView({
      behavior: "smooth"
    });
  };

  return (
    <div className="menu-container footer flex-none mt-5">
      {sidebarMenuOrganization?.map((item) => (
        <Fragment key={item.key}>
          <div
            className={`menu-item flex gap-4 min-w-[10.75rem] ${
              location?.pathname.includes(item.key) ? "active-menu" : ""
            }`}
            role="button"
            onClick={() => handleSideMenu(item)}
          >
            <div className="flex-none icon">{item.icon}</div>
            <div className="flex-grow">{item.name}</div>
          </div>

          {item?.steps?.length > 0 && location?.pathname.includes(item.key) && (
            <ScrollSpy
              activeClass="active"
              onChangeActiveId={(current) => setActiveNav(current)}
            >
              <List spacing={2} className="my-4 ms-8">
                {item.steps?.map((step) => (
                  <a
                    href={`#${step.key}`}
                    className={`flex items-center gap-3 cursor-pointer ${
                      activeNav === step.key ? "nav-active" : ""
                    }`}
                    key={step.key}
                    onClick={() => handleClick(step?.key)}
                  >
                    <CircleBulletinIcon />
                    <Typography
                      text={step.title}
                      type="paragraph"
                      size="s"
                      color={colors.sidebarListText}
                    />
                  </a>
                ))}
              </List>
            </ScrollSpy>
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default SideBar;
