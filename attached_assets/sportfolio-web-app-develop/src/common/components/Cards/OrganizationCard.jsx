import { Button, Typography } from "common";
import "./style.css";
import { PATH_ORGANIZATION_PROFILE } from "common/constants";
import { VerifiedSolidIcon } from "assets/DashboardIcons";
import { colors } from "utils/colors";
import { useNavigate } from "react-router-dom";
import BallIcon from "assets/BallIcon";
import _ from "lodash";
import StarRating from "../Rating";

const OrganizationCard = ({ data, id }) => {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg bg-white mb-3 border hover:shadow-lg transition">
      <div className="org-card flex gap-4 p-5 items-center relative rounded-lg bg-slate-100">
        <div className="absolute org-card-container flex gap-5 items-center max-w-full">
          <div className="h-[100px] w-[100px] min-w-[100px] rounded-full shadow-lg relative profile-circle bg-white grid place-items-center">
            {data?.avatar && !_.isEmpty(data?.avatar) ? (
              <img
                src={data?.avatar?.path}
                height={70}
                width={70}
                alt="profile-picture"
                className="rounded-full object-cover h-[4.375rem] w-[4.375rem]"
              />
            ) : (
              <BallIcon />
            )}
            <VerifiedSolidIcon
              color={colors.verifiedColor}
              className="verified"
            />
          </div>

          <div className="pb-3">
            <Typography
              text={data?.organizationName || ""}
              type="h4"
              size="md"
              color={colors.dark}
              className="max-w-[16ch] 1.5xl:max-w-[18ch] truncate !leading-snug"
            />
            <Typography
              text={data?.district || ""}
              type="paragraph"
              size="sm"
              color={colors.gray}
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
      </section>

      <div className="flex px-8  py-5 gap-2 justify-between items-center">
        <div className="flex flex-col">
          <Typography
            text="Membership"
            type="paragraph"
            size="sm"
            color={colors.subtitleColor}
          />
          <Typography
            text={data?.category || "Under 19"}
            type="paragraph"
            size="sm"
            color={colors.black}
          />
        </div>
        <Button
          variant="outline"
          borderColor={colors.confirmationColor}
          onClick={() => navigate(PATH_ORGANIZATION_PROFILE.replace(":id", id))}
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
    </div>
  );
};

export default OrganizationCard;
