import { CircleBulletinIcon } from "assets/InputIcons";
import { List, Typography } from "common";
import { URL_TYPE } from "common/constants";
import { sidebarMenuSettings } from "common/menu";
import React from "react";
import { useParams } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ScrollSpy from "react-scrollspy-navigation";
import { colors } from "utils/colors";

export default function SettingsSidebar() {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const handleSideMenu = (data) => {
    if (data.urlType === URL_TYPE.INTERNAL) {
      if (data?.url.includes(":userId")) {
        navigate(`/${data.url.replace(":userId", params?.userId)}`);
      } else {
        navigate(`/${data.url}`);
      }
    }
  };

  const handleClick = (e, key) => {
    e.preventDefault();
    document.getElementById(`${key}`)?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return (
    <aside className="menu-container footer flex-none">
      {sidebarMenuSettings?.map((item) => (
        <React.Fragment key={item.key}>
          <div
            className={
              searchParams.get("menu") === item.key
                ? "menu-item flex gap-4 active-menu items-center !pe-4"
                : "menu-item gap-4 flex items-center !pe-4"
            }
            role="button"
            onClick={() => handleSideMenu(item)}
          >
            <div className="flex-none icon">{item.icon}</div>
            <div className="flex-grow">{item.name}</div>
          </div>

          {item?.steps?.length > 0 && (
            <ScrollSpy activeClass="nav-active">
              <List spacing={2} className="my-4 ms-8">
                {item.steps?.map((step) => (
                  <a
                    href={`#${step.key}`}
                    className="flex items-center gap-3 cursor-pointer"
                    key={step.key}
                    onClick={(e) => handleClick(e, step?.key)}
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
        </React.Fragment>
      ))}
    </aside>
  );
}
