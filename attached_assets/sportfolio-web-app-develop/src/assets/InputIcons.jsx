const CheckedBox = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 20 21"
      fill="none"
    >
      <rect y="0.5" width="20" height="20" rx="2" fill="#E42E78" />
      <path
        d="M4 10.5862L8.26667 15L16 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const UnCheckedBox = () => {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="18"
        height="18"
        rx="2.5"
        fill="white"
        stroke="#E42E78"
      />
    </svg>
  );
};

const RadioBox = ({ width = "24", height = "24", color = "#E42E78" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill={color}
      className="icon icon-tabler icons-tabler-filled icon-tabler-circle-check"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" />
    </svg>
  );
};

const UnRadioBox = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#E42E78"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="icon icon-tabler icons-tabler-outline icon-tabler-circle"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    </svg>
  );
};

const DownArrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 9l6 6l6 -6" />
    </svg>
  );
};

const RightArrow = ({ color = "#000", ...rest }) => {
  return (
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
      className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-right"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 6l6 6l-6 6" />
    </svg>
  );
};

const Email = ({ color = "#000", ...rest }) => (
  <svg
    {...rest}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-mail"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z" />
    <path d="M3 7l9 6l9 -6" />
  </svg>
);

const Lock = ({ color = "#000", ...rest }) => (
  <svg
    {...rest}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="icon icon-tabler icons-tabler-outline icon-tabler-lock"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-6z" />
    <path d="M11 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" />
    <path d="M8 11v-4a4 4 0 1 1 8 0v4" />
  </svg>
);

const Done = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-circle-check"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M9 12l2 2l4 -4" />
  </svg>
);

const PaperClip = ({ color = "#000", ...rest }) => (
  <svg
    width="15"
    height="16"
    viewBox="0 0 15 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M9.50794 4.19225L4.64154 9.08299C4.34369 9.38232 4.17637 9.7883 4.17637 10.2116C4.17637 10.6349 4.34369 11.0409 4.64154 11.3403C4.93938 11.6396 5.34334 11.8077 5.76455 11.8077C6.18576 11.8077 6.58973 11.6396 6.88757 11.3403L11.754 6.44952C12.3497 5.85085 12.6843 5.03889 12.6843 4.19225C12.6843 3.34561 12.3497 2.53365 11.754 1.93499C11.1583 1.33633 10.3504 1 9.50794 1C8.66551 1 7.85759 1.33633 7.26191 1.93499L2.3955 6.82573C1.50198 7.72372 1 8.94166 1 10.2116C1 11.4816 1.50198 12.6995 2.3955 13.5975C3.28903 14.4955 4.50091 15 5.76455 15C7.02819 15 8.24007 14.4955 9.1336 13.5975L14 8.70678"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const DoneFilled = ({ color = "#00CC8F", ...rest }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M8.91675 0.948352C9.79657 1.45635 10.5285 2.18533 11.04 3.06311C11.5515 3.9409 11.8249 4.93705 11.8331 5.95297C11.8413 6.96888 11.584 7.96932 11.0868 8.85526C10.5895 9.74119 9.86947 10.4819 8.99797 11.004C8.12647 11.5262 7.13371 11.8117 6.11797 11.8322C5.10223 11.8528 4.09874 11.6077 3.20682 11.1212C2.31491 10.6348 1.56551 9.92382 1.0328 9.05874C0.500101 8.19365 0.20257 7.20443 0.169665 6.18902L0.166748 6.00002L0.169665 5.81102C0.202333 4.8036 0.495484 3.82183 1.02054 2.96143C1.54559 2.10103 2.28463 1.39137 3.1656 0.901617C4.04657 0.411868 5.03942 0.15875 6.04733 0.166941C7.05525 0.175131 8.04385 0.444351 8.91675 0.948352ZM8.1625 4.42094C8.06205 4.3205 7.92841 4.26016 7.78664 4.25125C7.64488 4.24234 7.50473 4.28546 7.3925 4.37252L7.33766 4.42094L5.41675 6.34127L4.6625 5.5876L4.60766 5.53919C4.49542 5.45218 4.3553 5.40912 4.21357 5.41806C4.07184 5.427 3.93824 5.48734 3.83782 5.58775C3.7374 5.68817 3.67706 5.82177 3.66812 5.9635C3.65918 6.10524 3.70225 6.24536 3.78925 6.3576L3.83766 6.41244L5.00433 7.5791L5.05916 7.62752C5.16147 7.70689 5.28727 7.74997 5.41675 7.74997C5.54623 7.74997 5.67203 7.70689 5.77433 7.62752L5.82916 7.5791L8.1625 5.24577L8.21091 5.19094C8.29798 5.0787 8.3411 4.93855 8.33218 4.79679C8.32327 4.65502 8.26293 4.52138 8.1625 4.42094Z"
      fill={color}
    />
  </svg>
);

const Close = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-circle-x"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
    <path d="M10 10l4 4m0 -4l-4 4" />
  </svg>
);

const Eye = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-eye"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
    <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
  </svg>
);

const NoEye = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-eye-off"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
    <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
    <path d="M3 3l18 18" />
  </svg>
);

const User = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-user-hexagon"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 13a3 3 0 1 0 0 -6a3 3 0 0 0 0 6z" />
    <path d="M6.201 18.744a4 4 0 0 1 3.799 -2.744h4a4 4 0 0 1 3.798 2.741" />
    <path d="M19.875 6.27c.7 .398 1.13 1.143 1.125 1.948v7.284c0 .809 -.443 1.555 -1.158 1.948l-6.75 4.27a2.269 2.269 0 0 1 -2.184 0l-6.75 -4.27a2.225 2.225 0 0 1 -1.158 -1.948v-7.285c0 -.809 .443 -1.554 1.158 -1.947l6.75 -3.98a2.33 2.33 0 0 1 2.25 0l6.75 3.98h-.033z" />
  </svg>
);

const Phone = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-device-mobile"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 5a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-14z" />
    <path d="M11 4h2" />
    <path d="M12 17v.01" />
  </svg>
);

const Edit = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-pencil"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
    <path d="M13.5 6.5l4 4" />
  </svg>
);

const Delete = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-trash-x"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M4 7h16" />
    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
    <path d="M10 12l4 4m0 -4l-4 4" />
  </svg>
);

const Open = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-notebook"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M6 4h11a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-11a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1m3 0v18" />
    <path d="M13 8l2 0" />
    <path d="M13 12l2 0" />
  </svg>
);

const AddIcon = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-plus"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 5l0 14" />
    <path d="M5 12l14 0" />
  </svg>
);

const SuccessIcon = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-rosette-discount-check"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 7.2a2.2 2.2 0 0 1 2.2 -2.2h1a2.2 2.2 0 0 0 1.55 -.64l.7 -.7a2.2 2.2 0 0 1 3.12 0l.7 .7c.412 .41 .97 .64 1.55 .64h1a2.2 2.2 0 0 1 2.2 2.2v1c0 .58 .23 1.138 .64 1.55l.7 .7a2.2 2.2 0 0 1 0 3.12l-.7 .7a2.2 2.2 0 0 0 -.64 1.55v1a2.2 2.2 0 0 1 -2.2 2.2h-1a2.2 2.2 0 0 0 -1.55 .64l-.7 .7a2.2 2.2 0 0 1 -3.12 0l-.7 -.7a2.2 2.2 0 0 0 -1.55 -.64h-1a2.2 2.2 0 0 1 -2.2 -2.2v-1a2.2 2.2 0 0 0 -.64 -1.55l-.7 -.7a2.2 2.2 0 0 1 0 -3.12l.7 -.7a2.2 2.2 0 0 0 .64 -1.55v-1" />
    <path d="M9 12l2 2l4 -4" />
  </svg>
);
const InfoIcon = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-alert-circle"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
    <path d="M12 8v4" />
    <path d="M12 16h.01" />
  </svg>
);

const AlertIcon = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 9v4" />
    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
    <path d="M12 16h.01" />
  </svg>
);

const CloseIcon = ({ color = "#000", ...rest }) => (
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
    className="icon icon-tabler icons-tabler-outline icon-tabler-x"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
  </svg>
);

const CircleBulletinIcon = ({ color = "#D9D9D9", ...rest }) => (
  <svg
    width="6"
    height="6"
    viewBox="0 0 6 6"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <circle cx="3" cy="3" r="3" fill={color} />
  </svg>
);

const VerifiedInputIcon = ({ color = "#00CC8F", ...rest }) => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M8.91675 0.948352C9.79657 1.45635 10.5285 2.18533 11.04 3.06311C11.5515 3.9409 11.8249 4.93705 11.8331 5.95297C11.8413 6.96888 11.584 7.96932 11.0868 8.85526C10.5895 9.74119 9.86947 10.4819 8.99797 11.004C8.12647 11.5262 7.13371 11.8117 6.11797 11.8322C5.10223 11.8528 4.09874 11.6077 3.20682 11.1212C2.31491 10.6348 1.56551 9.92382 1.0328 9.05874C0.500101 8.19365 0.20257 7.20443 0.169665 6.18902L0.166748 6.00002L0.169665 5.81102C0.202333 4.8036 0.495484 3.82183 1.02054 2.96143C1.54559 2.10103 2.28463 1.39137 3.1656 0.901617C4.04657 0.411868 5.03942 0.15875 6.04733 0.166941C7.05525 0.175131 8.04385 0.444351 8.91675 0.948352ZM8.1625 4.42094C8.06205 4.3205 7.92841 4.26016 7.78664 4.25125C7.64488 4.24234 7.50473 4.28546 7.3925 4.37252L7.33766 4.42094L5.41675 6.34127L4.6625 5.5876L4.60766 5.53919C4.49542 5.45218 4.3553 5.40912 4.21357 5.41806C4.07184 5.427 3.93824 5.48734 3.83782 5.58775C3.7374 5.68817 3.67706 5.82177 3.66812 5.9635C3.65918 6.10524 3.70225 6.24536 3.78925 6.3576L3.83766 6.41244L5.00433 7.5791L5.05916 7.62752C5.16147 7.70689 5.28727 7.74997 5.41675 7.74997C5.54623 7.74997 5.67203 7.70689 5.77433 7.62752L5.82916 7.5791L8.1625 5.24577L8.21091 5.19094C8.29798 5.0787 8.3411 4.93855 8.33218 4.79679C8.32327 4.65502 8.26293 4.52138 8.1625 4.42094Z"
      fill={color}
    />
  </svg>
);

const EditIcon = ({ color = "#263238", ...rest }) => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 13 13"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M2.6665 3.66602H1.99984C1.64622 3.66602 1.30708 3.80649 1.05703 4.05654C0.80698 4.30659 0.666504 4.64573 0.666504 4.99935V10.9993C0.666504 11.353 0.80698 11.6921 1.05703 11.9422C1.30708 12.1922 1.64622 12.3327 1.99984 12.3327H7.99984C8.35346 12.3327 8.6926 12.1922 8.94265 11.9422C9.19269 11.6921 9.33317 11.353 9.33317 10.9993V10.3327"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.59 3.39007C11.8526 3.12751 12.0001 2.77139 12.0001 2.40007C12.0001 2.02875 11.8526 1.67264 11.59 1.41007C11.3274 1.14751 10.9713 1 10.6 1C10.2287 1 9.87257 1.14751 9.61 1.41007L4 7.00007V9.00007H6L11.59 3.39007Z"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.6665 2.33398L10.6665 4.33398"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export {
  CheckedBox,
  UnCheckedBox,
  RadioBox,
  UnRadioBox,
  DownArrow,
  Email,
  Lock,
  Done,
  Close,
  Eye,
  NoEye,
  User,
  Phone,
  RightArrow,
  Edit,
  Delete,
  Open,
  AddIcon,
  SuccessIcon,
  AlertIcon,
  InfoIcon,
  CloseIcon,
  CircleBulletinIcon,
  DoneFilled,
  PaperClip,
  VerifiedInputIcon,
  EditIcon
};
