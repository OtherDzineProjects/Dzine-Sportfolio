import DynamicTabs from "common/components/Tabs";
import OrgWrapper from "./layout/OrgWrapper";
import { useMemo } from "react";
import { MemberOrganizationIcon } from "assets/DashboardIcons";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getOrgMemberCount } from "../api";
import { Fragment } from "react";
import OrgMemberRoleDrawer from "../organization-sections/ui/OrgMemberRoleDrawer";
import OrgMemberSettings from "./settings/OrgMemberSettings";

export default function OrgSettings() {
  const { orgId } = useParams();
  const { getOrgMemberCountRes } = useSelector((state) => state.org);
  const currentTabIndex = 0;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getOrgMemberCount(orgId));
  }, []);

  const tabs = useMemo(
    () => [
      {
        title: "Members",
        content: <OrgMemberSettings orgID={orgId} />,
        icon: <MemberOrganizationIcon />,
        count: getOrgMemberCountRes?.data?.existingMembers || 0,
        url: "?page=1&pageSize=12"
      }
    ],
    [currentTabIndex, getOrgMemberCountRes]
  );

  return (
    <Fragment>
      <OrgWrapper>
        <section className="py-10 px-5 w-full overflow-y-auto">
          <DynamicTabs data={tabs} selectedIndex={currentTabIndex} />
        </section>
      </OrgWrapper>

      <OrgMemberRoleDrawer orgID={orgId} />
    </Fragment>
  );
}
