import DynamicTabs from "common/components/Tabs";
import {
  MemberOrganizationIcon,
  MyOrganizationIcon
} from "assets/DashboardIcons";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import OrgExistingMembers from "./members/OrgExistingMembers";
import OrgPendingMembers from "./members/OrgPendingMembers";
import OrgAppliedMembers from "./members/OrgAppliedMembers";
import OrgAddMembersDrawer from "../organization-sections/ui/OrgAddMembersDrawer";
import { useDisclosure } from "common";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleShowAddMemberDialog } from "../slice";
import { useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";
import { getOrgMemberCount } from "../api";
import OrgInvitationsReceived from "./members/OrgInvitationsReceived";
import { Fragment } from "react";
import OrgWrapper from "./layout/OrgWrapper";

const OrgMembers = () => {
  const { showAddMemberDialog, getOrgMemberCountRes } = useSelector(
      (state) => state.org
    ),
    { isOpen, onOpen, onClose } = useDisclosure(),
    dispatch = useDispatch(),
    [searchParams] = useSearchParams(),
    params = useParams();

  useEffect(() => {
    dispatch(getOrgMemberCount(params.orgId));
  }, []);

  const currentTabIndex = useMemo(() => {
    switch (searchParams.get("tab")) {
      case "existing":
        return 0;
      case "pending":
        return 1;
      case "applied":
        return 2;
      case "invitations":
        return 1;
      default:
        return 0;
    }
  }, [searchParams]);

  const tabs = useMemo(() => {
    if (
      Boolean(getOrgMemberCountRes?.data?.isOwner) ||
      Boolean(getOrgMemberCountRes?.data?.isAdmin) ||
      Boolean(getOrgMemberCountRes?.data?.isSuperAdmin)
    ) {
      return [
        {
          title: "Members",
          content: (
            <OrgExistingMembers
              orgID={params.orgId}
              currentTab={currentTabIndex === 0}
            />
          ),
          icon: <MemberOrganizationIcon />,
          count: getOrgMemberCountRes?.data?.existingMembers || 0,
          url: "?tab=existing&page=1&pageSize=12"
        },
        {
          title: "Pending Invites",
          content: (
            <OrgPendingMembers
              orgID={params.orgId}
              currentTab={currentTabIndex === 1}
            />
          ),
          icon: <MyOrganizationIcon />,
          count: getOrgMemberCountRes?.data?.pendingInviteSend || 0,
          url: "?tab=pending&page=1&pageSize=12"
        },
        {
          title: "Applications Recieved",
          content: (
            <OrgAppliedMembers
              orgID={params.orgId}
              currentTab={currentTabIndex === 2}
            />
          ),
          icon: <MyOrganizationIcon />,
          count: getOrgMemberCountRes?.data?.applicationsReceived || 0,
          url: "?tab=applied&page=1&pageSize=12"
        }
      ];
    } else {
      return [
        {
          title: "Members",
          content: (
            <OrgExistingMembers
              orgID={params.orgId}
              currentTab={currentTabIndex === 0}
            />
          ),
          icon: <MemberOrganizationIcon />,
          count: getOrgMemberCountRes?.data?.existingMembers || 0,
          url: "?tab=existing&page=1&pageSize=12"
        },
        {
          title: "Invitations Recieved",
          content: (
            <OrgInvitationsReceived
              orgID={params.orgId}
              currentTab={currentTabIndex === 1}
            />
          ),
          icon: <MyOrganizationIcon />,
          count: getOrgMemberCountRes?.data?.invitationsReceived || 0,
          url: "?tab=invitations&page=1&pageSize=12"
        }
      ];
    }
  }, [currentTabIndex, getOrgMemberCountRes]);

  const handleDrawerClose = () => {
    dispatch(handleShowAddMemberDialog(false));
    onClose();
  };

  useEffect(() => {
    if (showAddMemberDialog) onOpen();
  }, [showAddMemberDialog]);

  return (
    <Fragment>
      <OrgWrapper>
        <div className="py-10 px-5 w-full overflow-y-auto">
          <DynamicTabs data={tabs} selectedIndex={currentTabIndex} />
        </div>
      </OrgWrapper>
      <OrgAddMembersDrawer
        isOpen={isOpen}
        onClose={handleDrawerClose}
        orgID={params.orgId}
      />
    </Fragment>
  );
};

export default OrgMembers;
