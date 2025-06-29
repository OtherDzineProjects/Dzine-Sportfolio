import BallIcon from "assets/BallIcon";
import { VerifiedSolidIcon } from "assets/DashboardIcons";
import _ from "lodash";
import { formatDisplayDate } from "pages/common/helpers";
import { useState } from "react";
import { colors } from "utils/colors";
import { RichTextViewer } from "../rich-text/RichTextViewer";
import { Tooltip } from "common";
import "./styles.css";

const NotificationCard = (props) => {
  const { data = null, preview = false } = props;

  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`rounded-xl  ${
        preview ? "" : "shadow-xl"
      } p-5 w-[525px] mx-auto flex flex-col gap-3`}
      style={{ background: colors.light }}
    >
      <div className="flex items-center gap-3">
        <div className="h-[60px] w-[60px] min-w-[60px] rounded-full shadow-lg relative profile-circle bg-white grid place-items-center">
          {data?.organizationAvatar && !_.isEmpty(data?.organizationAvatar) ? (
            <img
              src={data?.organizationAvatar?.path}
              alt="profile-picture"
              width={45}
              height={45}
              className="rounded-full object-cover h-[2.8rem] w-[2.8rem]"
            />
          ) : (
            <BallIcon width="40px" heigth="40px" />
          )}
          <VerifiedSolidIcon
            color={colors.verifiedColor}
            className="verified !bottom-0 !right-0"
          />
        </div>
        <div className="flex-grow">
          <Tooltip label={data?.organizationName}>
            <h4
              className="font-bold truncate max-w-[32ch] !leading-snug"
              style={{ color: colors.dark }}
            >
              {data?.organizationName || ""}
            </h4>
          </Tooltip>
          <p style={{ color: colors.subtitleColor }} className="truncate">
            {data?.district || ""}
          </p>
        </div>
        <div className="flex-grow text-right">
          <p className="text-xs" style={{ color: colors.subtitleColor }}>
            Posted on
          </p>
          <p className="font-medium" style={{ color: colors.subtitleColor }}>
            {data.approvedDate
              ? formatDisplayDate(data?.approvedDate, "-")
              : "_"}
          </p>
        </div>
      </div>

      {data?.image?.[0]?.path ? (
        <img
          src={data?.image?.[0]?.path}
          alt="notification-image"
          className="rounded-2xl w-full min-w-[403px] h-[203px] aspect-video"
          width={403}
          loading="lazy"
          height={203}
        />
      ) : (
        <div className="rounded-2xl w-full min-w-[403px] h-[203px] aspect-video animate-pulse bg-slate-300"></div>
      )}

      <div className="px-5 max-w-full">
        <h3 className="font-medium text-xl mb-2">{data?.subject}</h3>
        <RichTextViewer
          content={data?.body}
          className={`font-normal max-h-[12ch] !leading-snug ${
            expanded ? "overflow-y-auto" : "truncate"
          } ${data?.body?.length > 100 && !expanded ? "to-be-expanded" : ""}`}
        />
        {!expanded && data?.body?.length > 100 && (
          <a
            className="inline-block text-blue-500 text-xs cursor-pointer"
            onClick={() => setExpanded(true)}
          >
            Read More...
          </a>
        )}
      </div>
      <div className="flex justify-between ps-5">
        <div>
          <p className="text-xs" style={{ color: colors.subtitleColor }}>
            Event Date
          </p>
          <p className="font-medium" style={{ color: colors.dark }}>
            {data.eventDate ? formatDisplayDate(data?.eventDate, "-") : "_"}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: colors.subtitleColor }}>
            District
          </p>
          <p className="font-medium" style={{ color: colors.dark }}>
            {data?.district || ""}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
