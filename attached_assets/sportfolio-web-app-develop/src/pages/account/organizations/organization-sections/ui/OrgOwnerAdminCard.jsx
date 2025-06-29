import { VerifiedSolidIcon } from "assets/DashboardIcons";
import UserIcon from "assets/UserIcon";
import { Button, Tooltip, Typography } from "common";
import _ from "lodash";
import { colors } from "utils/colors";
import { CheckedBox, UnCheckedBox } from "assets/InputIcons";
import { useSelector } from "react-redux";
import { useMemo } from "react";
import { handleSelectedMembersForAdminArray } from "../../slice";
import { useDispatch } from "react-redux";
import { PATH_USER_PROFILE_VIA_ORG } from "common/constants";
import { useNavigate } from "react-router-dom";

export default function OrgOwnerAdminCard({
  member,
  userID = undefined,
  orgID = undefined,
  showCheckBox = false
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedMembersForAdminArray = [] } = useSelector(
    (state) => state.org
  );
  const isAdmin = useMemo(
    () => selectedMembersForAdminArray?.includes(member?.userId),
    [selectedMembersForAdminArray, member]
  );

  const handleCheckBoxClick = () => {
    if (isAdmin) {
      dispatch(
        handleSelectedMembersForAdminArray([
          ...selectedMembersForAdminArray.filter((id) => id !== member?.userId)
        ])
      );
    } else {
      dispatch(
        handleSelectedMembersForAdminArray([
          ...selectedMembersForAdminArray,
          member?.userId
        ])
      );
    }
  };

  const handleView = () => {
    if (!_.isNil(userID) && !_.isNil(orgID)) {
      navigate(
        PATH_USER_PROFILE_VIA_ORG.replace(":id", userID).replace(
          ":orgID",
          orgID
        )
      );
    }
  };

  return (
    <article className="rounded-lg bg-white mb-3 border hover:shadow-lg transition">
      <div className="h-[70px] flex gap-4 p-5 items-center relative rounded-lg bg-slate-100">
        <div className="absolute org-card-container flex gap-5 items-center max-w-full">
          <div className="h-[70px] w-[70px] min-w-[70px] rounded-full shadow-lg relative profile-circle grid place-items-center bg-white">
            {member?.avatar && !_.isEmpty(member?.avatar) ? (
              <img
                src={member?.avatar?.path}
                height={50}
                width={50}
                alt="profile-picture"
                className="rounded-full object-cover h-[3.125rem] w-[3.125rem]"
              />
            ) : (
              <UserIcon className="rounded-full object-cover h-[3.125rem] w-[3.125rem]" />
            )}

            <VerifiedSolidIcon
              color={colors.verifiedColor}
              className="verified h-[20px] w-[20px]"
            />
          </div>

          <div className="pb-3">
            <Typography
              text={`${member?.firstName || ""} ${member?.lastName || ""}`}
              type="h4"
              size="sm"
              color={colors.dark}
              className="max-w-[20ch] truncate !leading-snug"
            />

            <Typography
              text={member?.district}
              type="paragraph"
              size="xs"
              color={colors.subtitleColor}
            />
          </div>
          <div className="flex-grow" />
        </div>

        {showCheckBox && (
          <Tooltip label="Select user for admin">
            <Button
              variant="ghost"
              onClick={handleCheckBoxClick}
              rightIcon={isAdmin ? <CheckedBox /> : <UnCheckedBox />}
              className="absolute left-[85%] top-[0%]"
            ></Button>
          </Tooltip>
        )}
      </div>
      <section className="pt-4">
        <div className="flex px-8  py-5 gap-2 justify-between items-center">
          <div className="flex flex-col">
            <Typography
              text="Membership"
              type="paragraph"
              size="xs"
              color={colors.subtitleColor}
            />

            <Typography
              text={member?.membershipRole || "_"}
              type="paragraph"
              size="xs"
              color={colors.black}
            />
          </div>

          <article className="flex gap-2">
            <Button
              variant="outline"
              borderColor={colors.confirmationColor}
              onClick={handleView}
              className="view-profile-btn px-4"
            >
              <Typography
                text="View Profile"
                type="paragraph"
                size="sm"
                color={colors.black}
              />
            </Button>
          </article>
        </div>
      </section>
    </article>
  );
}
