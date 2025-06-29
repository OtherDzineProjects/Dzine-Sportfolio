import {
  MemberOrganizationIcon,
  MyOrganizationIcon
} from "assets/DashboardIcons";
import DynamicTabs from "common/components/Tabs";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import NotificationInbox from "./components/tabs/NotificationInbox";
import NotificationSent from "./components/tabs/NotificationSent";
import NotificationAwaiting from "./components/tabs/NotificationAwaiting";
import { useEffect } from "react";
import {
  clearNotificationFormState,
  clearSearchNotifications,
  setNewNotificationCreateDialog,
  setNotifyAll,
  setNotifyOrganizationIds
} from "./slice";
import { useSelector } from "react-redux";
import NotificationPreview from "common/components/Notification/NotificationPreview";
import { getNotificationCounts } from "./api";

const Notifications = () => {
  const [searchParams] = useSearchParams(),
    dispatch = useDispatch(),
    { newNotificationCreateDialog, getNotificationCountsRes } = useSelector(
      (state) => state.notify
    );

  const currentTabIndex = useMemo(() => {
    switch (searchParams.get("tab")) {
      case "inbox":
        return 0;
      case "sent":
        return 1;
      case "awaiting":
        return 2;
      default:
        return 0;
    }
  }, [searchParams.get("tab")]);

  useEffect(() => {
    return () => {
      dispatch(setNewNotificationCreateDialog(false));
      dispatch(clearNotificationFormState());
      dispatch(clearSearchNotifications());
    };
  }, [searchParams]);

  useEffect(() => {
    if (!newNotificationCreateDialog) {
      dispatch(setNotifyAll(false));
      dispatch(setNotifyOrganizationIds([]));
    }
  }, [newNotificationCreateDialog]);

  useEffect(() => {
    dispatch(getNotificationCounts());
  }, []);

  const tabs = useMemo(() => {
    const isAdmin = !!getNotificationCountsRes?.data?.isAdmin;

    return isAdmin
      ? [
          {
            title: "Inbox",
            content: <NotificationInbox currentTab={currentTabIndex === 0} />,
            icon: <MemberOrganizationIcon />,
            key: "inbox",
            url: "?tab=inbox&page=1&pageSize=12",
            count: getNotificationCountsRes?.data?.inboxCount || 0
          },
          {
            title: "Sent Items",
            content: <NotificationSent currentTab={currentTabIndex === 1} />,
            icon: <MyOrganizationIcon />,
            key: "sent",
            url: "?tab=sent&page=1&pageSize=12",
            count: getNotificationCountsRes?.data?.sentItems || 0
          },

          {
            title: "Awaiting Approval",
            content: (
              <NotificationAwaiting currentTab={currentTabIndex === 2} />
            ),
            icon: <MyOrganizationIcon />,
            key: "awaiting",
            url: "?tab=awaiting&page=1&pageSize=12",
            count: getNotificationCountsRes?.data?.awaitingApprovalCount || 0
          }
        ]
      : [
          {
            title: "Inbox",
            content: <NotificationInbox currentTab={currentTabIndex === 0} />,
            icon: <MemberOrganizationIcon />,
            key: "inbox",
            url: "?tab=inbox&page=1&pageSize=12",
            count: getNotificationCountsRes?.data?.inboxCount || 0
          },
          {
            title: "Sent Items",
            content: <NotificationSent currentTab={currentTabIndex === 1} />,
            icon: <MyOrganizationIcon />,
            key: "sent",
            url: "?tab=sent&page=1&pageSize=12",
            count: getNotificationCountsRes?.data?.sentItems || 0
          }
        ];
  }, [currentTabIndex, getNotificationCountsRes]);

  return (
    <div className="p-3 overflow-y-auto h-[calc(100svh-5.625rem)]">
      <DynamicTabs data={tabs} selectedIndex={currentTabIndex} />
      <NotificationPreview />
    </div>
  );
};

export default Notifications;
