import { Button, Typography } from "common";
import "./style.css";
import { VerifiedSolidIcon } from "assets/DashboardIcons";
import { colors } from "utils/colors";
import UserIcon from "assets/UserIcon";
import StarRating from "../Rating";
import _ from "lodash";
import { RichTextViewer } from "../rich-text/RichTextViewer";
import { Fragment } from "react";

const UserCard = ({ data, handleView = () => {} }) => {
  return (
    <div className="rounded-lg bg-white mb-3 border hover:shadow-lg transition">
      <div className="org-card flex gap-4 p-5 items-center relative rounded-lg bg-slate-100">
        <div className="absolute org-card-container flex gap-5 items-center max-w-full">
          <div className="h-[100px] w-[100px] min-w-[100px] rounded-full shadow-lg relative profile-circle grid place-items-center bg-white">
            {data?.avatar && !_.isEmpty(data?.avatar) ? (
              <img
                src={data?.avatar?.path}
                height={70}
                width={70}
                alt="profile-picture"
                className="rounded-full object-cover h-[4.375rem] w-[4.375rem]"
              />
            ) : (
              <UserIcon />
            )}

            <VerifiedSolidIcon
              color={colors.verifiedColor}
              className="verified"
            />
          </div>

          <div className="pb-3">
            <Typography
              text={`${data?.firstName || ""} ${data?.lastName || ""}`}
              type="h4"
              size="md"
              color={colors.dark}
              className="max-w-[16ch] 1.5xl:max-w-[18ch] truncate !leading-snug"
            />

            <Typography
              text={data?.district}
              type="paragraph"
              size="sm"
              color={colors.subtitleColor}
            />
          </div>
          <div className="flex-grow" />
        </div>
      </div>
      <section className="pt-4">
        <div className="pl-[140px] flex items-center gap-2">
          <StarRating readOnly rating={data?.rating || 4.5} />
          <Typography
            text={data?.points || "0 Points"}
            type="paragraph"
            size="sm"
            color={colors.verifiedColor}
          />
        </div>

        <div className="px-8 truncate max-height-for-rich-text-container h-16 max-h-16 ">
          {data?.bio && (
            <Fragment>
              <Typography
                text="Bio"
                type="paragraph"
                size="sm"
                color={colors.subtitleColor}
              />

              <div
                className={`truncate max-h-14 ${
                  data?.bio && data?.bio?.length > 30 ? "to-be-expanded" : ""
                }`}
              >
                <RichTextViewer
                  content={data?.bio}
                  className="max-height-for-rich-text"
                />
              </div>
            </Fragment>
          )}
        </div>
        <div className="flex px-8  py-5 gap-2 justify-between items-center">
          <div className="flex flex-col">
            <>
              <Typography
                text="Age Group"
                type="paragraph"
                size="sm"
                color={colors.subtitleColor}
              />

              <Typography
                text={data?.ageCategory || "Under 19"}
                type="paragraph"
                size="sm"
                color={colors.black}
              />
            </>
          </div>

          <Button
            variant="outline"
            borderColor={colors.confirmationColor}
            onClick={() => handleView(data?.id)}
            className="view-profile-btn px-4"
          >
            <Typography
              text="View Profile"
              type="paragraph"
              size="sm"
              color={colors.black}
            />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default UserCard;
