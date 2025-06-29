import DynamicTabs from "common/components/Tabs";
import OrganizationView from "./components/OrganizationView";
import {
  MemberOrganizationIcon,
  MyOrganizationIcon
} from "assets/DashboardIcons";
import { useSearchParams } from "react-router-dom";
import { useMemo } from "react";
import MemberOrganizationView from "./components/MemberOrganizationView";
import NewOrganization from "./components/NewOrg";
import RecentOrganizationView from "./components/RecentOrganizationView";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { clearSearchUsersForOrg } from "./slice";
import AdvancedOrgSearchDrawer from "./organization-sections/ui/AdvancedOrgSearchDrawer";
import { useDisclosure } from "common";

const Organizations = () => {
  const [searchParams] = useSearchParams(),
    dispatch = useDispatch(),
    { isOpen, onOpen, onClose } = useDisclosure();

  const currentTabIndex = useMemo(() => {
    switch (searchParams.get("tab")) {
      case "my_organization":
        return 0;
      case "member":
        return 1;
      case "recent_organization":
        return 2;
      default:
        return 0;
    }
  }, [searchParams.get("tab")]);

  useEffect(() => {
    return () => dispatch(clearSearchUsersForOrg());
  }, [searchParams]);

  const tabs = useMemo(
    () => [
      {
        title: "My Organizations",
        content: <OrganizationView currentTab={currentTabIndex == 0} />,
        icon: <MyOrganizationIcon />,
        key: "my_organization",
        url: "?tab=my_organization&page=1&pageSize=12"
      },
      {
        title: "Member Organizations",
        content: <MemberOrganizationView currentTab={currentTabIndex == 1} />,
        icon: <MemberOrganizationIcon />,
        key: "member",
        url: "?tab=member&page=1&pageSize=12"
      },

      {
        title: "Recent Organizations",
        content: <RecentOrganizationView currentTab={currentTabIndex == 2} />,
        icon: <MyOrganizationIcon />,
        key: "recent_organization",
        url: "?tab=recent_organization&page=1&pageSize=12"
      }
    ],
    [currentTabIndex]
  );

  const showAdvancedOrgSearch = () => {
    onOpen();
  };

  return (
    <div className="p-3 overflow-y-auto h-[calc(100svh-5.625rem)]">
      <DynamicTabs
        data={tabs}
        selectedIndex={currentTabIndex}
        showButton
        buttonText="Advanced Org Search"
        onButtonClick={showAdvancedOrgSearch}
      />
      <NewOrganization />
      <AdvancedOrgSearchDrawer isOpen={isOpen} onClose={() => onClose()} />
    </div>
  );
};

export default Organizations;
