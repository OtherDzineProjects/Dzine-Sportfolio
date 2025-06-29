const LeftCollapse = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-bar-left"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 12l10 0" />
    <path d="M4 12l4 4" />
    <path d="M4 12l4 -4" />
    <path d="M20 4l0 16" />
  </svg>
);

const DashboardIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-dashboard"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 13m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
    <path d="M13.45 11.55l2.05 -2.05" />
    <path d="M6.4 20a9 9 0 1 1 11.2 0z" />
  </svg>
);

const UsersIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-users-plus"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
    <path d="M3 21v-2a4 4 0 0 1 4 -4h4c.96 0 1.84 .338 2.53 .901" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    <path d="M16 19h6" />
    <path d="M19 16v6" />
  </svg>
);

const OrganizationsIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 21l18 0" />
    <path d="M9 8l1 0" />
    <path d="M9 12l1 0" />
    <path d="M9 16l1 0" />
    <path d="M14 8l1 0" />
    <path d="M14 12l1 0" />
    <path d="M14 16l1 0" />
    <path d="M5 21v-16a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v16" />
  </svg>
);

const VerifiedIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
    <path d="M9 12l2 2l4 -4" />
  </svg>
);

const VerifiedSolidIcon = ({ ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    {...rest}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12.01 2.011a3.2 3.2 0 0 1 2.113 .797l.154 .145l.698 .698a1.2 1.2 0 0 0 .71 .341l.135 .008h1a3.2 3.2 0 0 1 3.195 3.018l.005 .182v1c0 .27 .092 .533 .258 .743l.09 .1l.697 .698a3.2 3.2 0 0 1 .147 4.382l-.145 .154l-.698 .698a1.2 1.2 0 0 0 -.341 .71l-.008 .135v1a3.2 3.2 0 0 1 -3.018 3.195l-.182 .005h-1a1.2 1.2 0 0 0 -.743 .258l-.1 .09l-.698 .697a3.2 3.2 0 0 1 -4.382 .147l-.154 -.145l-.698 -.698a1.2 1.2 0 0 0 -.71 -.341l-.135 -.008h-1a3.2 3.2 0 0 1 -3.195 -3.018l-.005 -.182v-1a1.2 1.2 0 0 0 -.258 -.743l-.09 -.1l-.697 -.698a3.2 3.2 0 0 1 -.147 -4.382l.145 -.154l.698 -.698a1.2 1.2 0 0 0 .341 -.71l.008 -.135v-1l.005 -.182a3.2 3.2 0 0 1 3.013 -3.013l.182 -.005h1a1.2 1.2 0 0 0 .743 -.258l.1 -.09l.698 -.697a3.2 3.2 0 0 1 2.269 -.944zm3.697 7.282a1 1 0 0 0 -1.414 0l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.32 1.497l2 2l.094 .083a1 1 0 0 0 1.32 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
  </svg>
);

const NotificationIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-bell"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
    <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
  </svg>
);

const ProfileIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-user-circle"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M12 10m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855" />
  </svg>
);

const SettingsIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-settings"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z" />
    <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
  </svg>
);

const LogoutIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-power"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M7 6a7.75 7.75 0 1 0 10 0" />
    <path d="M12 4l0 8" />
  </svg>
);

const LocationIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    color={color}
    {...rest}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18.364 4.636a9 9 0 0 1 .203 12.519l-.203 .21l-4.243 4.242a3 3 0 0 1 -4.097 .135l-.144 -.135l-4.244 -4.243a9 9 0 0 1 12.728 -12.728zm-6.364 3.364a3 3 0 1 0 0 6a3 3 0 0 0 0 -6z" />
  </svg>
);

const StarSolidIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    color={color}
    {...rest}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z" />
  </svg>
);

const StartOutlineIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
  </svg>
);

const SearchIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-search"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
    <path d="M21 21l-6 -6" />
  </svg>
);

const TeamIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-brand-asana"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 7m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M17 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
    <path d="M7 16m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
  </svg>
);
const EventIcon = ({ color = "#000", ...rest }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    {...rest}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-building-stadium"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-8 0a8 2 0 1 0 16 0a8 2 0 1 0 -16 0" />
    <path d="M4 12v7c0 .94 2.51 1.785 6 2v-3h4v3c3.435 -.225 6 -1.07 6 -2v-7" />
    <path d="M15 6h4v-3h-4v7" />
    <path d="M7 6h4v-3h-4v7" />
  </svg>
);

const MemberOrganizationIcon = ({ color = "#000", ...rest }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M6.66669 5.99984C6.66669 6.35346 6.80716 6.6926 7.05721 6.94265C7.30726 7.19269 7.6464 7.33317 8.00002 7.33317C8.35364 7.33317 8.69278 7.19269 8.94283 6.94265C9.19288 6.6926 9.33335 6.35346 9.33335 5.99984C9.33335 5.64622 9.19288 5.30708 8.94283 5.05703C8.69278 4.80698 8.35364 4.6665 8.00002 4.6665C7.6464 4.6665 7.30726 4.80698 7.05721 5.05703C6.80716 5.30708 6.66669 5.64622 6.66669 5.99984Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.66669 5.33317V3.99984C2.66669 3.64622 2.80716 3.30708 3.05721 3.05703C3.30726 2.80698 3.6464 2.6665 4.00002 2.6665H5.33335"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.66669 10.6665V11.9998C2.66669 12.3535 2.80716 12.6926 3.05721 12.9426C3.30726 13.1927 3.6464 13.3332 4.00002 13.3332H5.33335"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6667 2.6665H12C12.3536 2.6665 12.6928 2.80698 12.9428 3.05703C13.1928 3.30708 13.3333 3.64622 13.3333 3.99984V5.33317"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6667 13.3332H12C12.3536 13.3332 12.6928 13.1927 12.9428 12.9426C13.1928 12.6926 13.3333 12.3535 13.3333 11.9998V10.6665"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.33331 10.6668C5.33331 10.3132 5.47379 9.97407 5.72384 9.72402C5.97389 9.47397 6.31302 9.3335 6.66665 9.3335H9.33331C9.68694 9.3335 10.0261 9.47397 10.2761 9.72402C10.5262 9.97407 10.6666 10.3132 10.6666 10.6668"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MyOrganizationIcon = ({ color = "#000", ...rest }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M5.33333 4.66667C5.33333 5.37391 5.61428 6.05219 6.11438 6.55229C6.61447 7.05238 7.29275 7.33333 7.99999 7.33333C8.70724 7.33333 9.38552 7.05238 9.88561 6.55229C10.3857 6.05219 10.6667 5.37391 10.6667 4.66667C10.6667 3.95942 10.3857 3.28115 9.88561 2.78105C9.38552 2.28095 8.70724 2 7.99999 2C7.29275 2 6.61447 2.28095 6.11438 2.78105C5.61428 3.28115 5.33333 3.95942 5.33333 4.66667Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 14V12.6667C4 11.9594 4.28095 11.2811 4.78105 10.781C5.28115 10.281 5.95942 10 6.66667 10H7"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.8667 13.878L10.4187 14.6367C10.3757 14.659 10.3273 14.669 10.279 14.6655C10.2307 14.662 10.1843 14.6451 10.1451 14.6167C10.1058 14.5884 10.0751 14.5497 10.0566 14.5049C10.038 14.4602 10.0323 14.4111 10.04 14.3633L10.3167 12.756L9.14532 11.618C9.11036 11.5842 9.08561 11.5412 9.07389 11.494C9.06216 11.4468 9.06395 11.3973 9.07903 11.3511C9.09412 11.3049 9.1219 11.2638 9.1592 11.2326C9.1965 11.2014 9.24182 11.1813 9.28999 11.1746L10.9087 10.94L11.6327 9.47798C11.6543 9.43444 11.6877 9.3978 11.729 9.37219C11.7704 9.34658 11.818 9.33301 11.8667 9.33301C11.9153 9.33301 11.963 9.34658 12.0043 9.37219C12.0456 9.3978 12.079 9.43444 12.1007 9.47798L12.8247 10.94L14.4433 11.1746C14.4914 11.1816 14.5365 11.2018 14.5736 11.233C14.6108 11.2642 14.6384 11.3052 14.6535 11.3513C14.6685 11.3975 14.6704 11.4469 14.6588 11.494C14.6472 11.5411 14.6227 11.5841 14.588 11.618L13.4167 12.756L13.6927 14.3627C13.7009 14.4106 13.6956 14.4598 13.6773 14.5049C13.659 14.5499 13.6284 14.5889 13.5891 14.6175C13.5497 14.646 13.5031 14.6629 13.4546 14.6663C13.4061 14.6697 13.3576 14.6594 13.3147 14.6367L11.8667 13.878Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export {
  LeftCollapse,
  LocationIcon,
  StarSolidIcon,
  StartOutlineIcon,
  DashboardIcon,
  UsersIcon,
  OrganizationsIcon,
  VerifiedIcon,
  NotificationIcon,
  ProfileIcon,
  SettingsIcon,
  LogoutIcon,
  SearchIcon,
  TeamIcon,
  EventIcon,
  VerifiedSolidIcon,
  MemberOrganizationIcon,
  MyOrganizationIcon
};
