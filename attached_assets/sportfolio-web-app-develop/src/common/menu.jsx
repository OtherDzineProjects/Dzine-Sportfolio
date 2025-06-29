import {
  DashboardIcon,
  EventIcon,
  LogoutIcon,
  NotificationIcon,
  OrganizationsIcon,
  SettingsIcon,
  TeamIcon,
  UsersIcon,
  VerifiedIcon
} from "assets/DashboardIcons";
import { PATH_SIGNIN } from "./constants";

export const sidebarMenu = [
  {
    id: 1,
    name: "Dashboard",
    icon: <DashboardIcon />,
    url: "dashboard",
    key: "dashboard",
    urlType: "internal"
  },
  {
    id: 2,
    name: "Users",
    icon: <UsersIcon />,
    url: "users?page=1&pageSize=12",
    key: "account/users",
    urlType: "internal"
  },
  {
    id: 3,
    name: "Organizations",
    icon: <OrganizationsIcon />,
    key: "account/organizations",
    url: "organizations?tab=:selectedTab&page=1&pageSize=12",
    urlType: "internal"
  },
  {
    id: 4,
    name: "Verification Panel",
    icon: <VerifiedIcon />,
    url: "verification",
    urlType: "internal"
  },
  {
    id: 5,
    name: "Notifications",
    icon: <NotificationIcon />,
    key: "account/notifications",
    url: "notifications?tab=:selectedTab&page=1&pageSize=12",
    urlType: "internal"
  }
];

export const sidebarMenuFooter = [
  {
    id: 1,
    name: "Settings",
    icon: <SettingsIcon />,
    url: "settings?menu=:selectedMenu",
    key: "account/settings",
    urlType: "internal"
  },
  {
    id: 2,
    name: "Logout",
    icon: <LogoutIcon />,
    url: PATH_SIGNIN,
    key: "logout",
    urlType: "external"
  }
];

export const sidebarMenuOrganization = [
  {
    id: 1,
    name: "Org Profile",
    icon: <OrganizationsIcon />,
    key: "profile",
    url: "account/organizations/:id/profile",
    urlType: "internal",
    steps: [
      { title: "About", key: "about" },
      { title: "Activities", key: "activities" },
      { title: "Basic Info", key: "basic" }
    ]
  },
  {
    id: 2,
    name: "Members",
    icon: <UsersIcon />,
    url: "account/organizations/:id/members?tab=:selectedTab&page=1&pageSize=12",
    key: "members",
    urlType: "internal"
  },
  {
    id: 3,
    name: "Teams",
    icon: <TeamIcon />,
    url: "account/organizations/teams",
    key: "teams",
    urlType: "internal"
  },
  {
    id: 4,
    name: "Events",
    icon: <EventIcon />,
    key: "events",
    url: "account/organizations/events",
    urlType: "internal"
  },
  {
    id: 5,
    name: "Settings",
    icon: <SettingsIcon />,
    key: "settings",
    url: "account/organizations/:id/settings?page=1&pageSize=12",
    urlType: "internal"
  }
];

export const sidebarMenuUsers = [
  {
    id: 1,
    name: "Profile",
    icon: <UsersIcon />,
    key: "profile",
    url: "account/users/:userId/profile",
    urlType: "internal",
    steps: [
      { title: "Basic Info", key: "basic" },
      { title: "Contact Info", key: "contact" },
      { title: "Qualifications", key: "qualifications" }
    ]
  },
  {
    id: 2,
    name: "Organizations",
    icon: <OrganizationsIcon />,
    url: "account/users/:userId/organizations",
    key: "organizations",
    urlType: "internal"
  },
  {
    id: 3,
    name: "Teams",
    icon: <TeamIcon />,
    url: "account/users/:userId/teams",
    key: "teams",
    urlType: "internal"
  },
  {
    id: 4,
    name: "Events",
    icon: <EventIcon />,
    key: "account/organizations/events",
    url: "events",
    urlType: "internal"
  }
];

export const sidebarMenuSettings = [
  {
    id: 1,
    name: "Profile Settings",
    icon: <UsersIcon />,
    key: "profile",
    url: "settings/password",
    urlType: "internal",
    steps: [
      { title: "Change Password", key: "password" },
      { title: "Notification", key: "notification" }
    ]
  }
];
