import { VerifiedSolidIcon } from "assets/DashboardIcons";
import UserIcon from "assets/UserIcon";
import { Button, Typography } from "common";
import { colors } from "utils/colors";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { Fragment } from "react";
import { formatDisplayDate } from "pages/common/helpers";
import { useDispatch } from "react-redux";
import { inviteMember } from "../../api";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  PATH_ORGANIZATION_PROFILE,
  PATH_USER_PROFILE_VIA_ORG
} from "common/constants";

export default function OrgMiniCard({
  item,
  id,
  searchMode = false,
  orgID = null,
  showInviteButton = false,
  type = "member"
}) {
  const navigate = useNavigate(),
    dispatch = useDispatch(),
    { inviteMemberLoading } = useSelector((state) => state.org),
    [loading, setLoading] = useState(false);

  const handleView = () => {
    if (!_.isNil(id)) {
      switch (type) {
        case "member":
          navigate(
            PATH_USER_PROFILE_VIA_ORG.replace(":id", id).replace(
              ":orgID",
              orgID
            )
          );
          break;
        case "org":
          navigate(PATH_ORGANIZATION_PROFILE.replace(":id", id));
          break;
      }
    }
  };

  useEffect(() => {
    if (loading) setLoading(!!inviteMemberLoading);

    return () => setLoading(false);
  }, [inviteMemberLoading]);

  const handleInviteMember = () => {
    if (inviteMemberLoading) return;
    setLoading(true);
    dispatch(
      inviteMember({
        organizationID: orgID,
        memberID: item?.UserID
      })
    );
  };

  return (
    <article className="rounded-lg bg-white mb-3 border hover:shadow-lg transition">
      <div className="h-[70px] flex gap-4 p-5 items-center relative rounded-lg bg-slate-100">
        <div className="absolute org-card-container flex gap-5 items-center max-w-full">
          <div className="h-[70px] w-[70px] min-w-[70px] rounded-full shadow-lg relative profile-circle grid place-items-center bg-white">
            {item?.avatar && !_.isEmpty(item?.avatar) ? (
              <img
                src={item?.avatar?.path}
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
              text={
                type === "member"
                  ? `${item?.firstName || ""} ${item?.lastName || ""}`
                  : `${item?.organizationName || ""}`
              }
              type="h4"
              size="sm"
              color={colors.dark}
              className="max-w-[20ch] truncate !leading-snug"
            />

            <Typography
              text={item?.district}
              type="paragraph"
              size="xs"
              color={colors.subtitleColor}
            />
          </div>
          <div className="flex-grow" />
        </div>
      </div>
      <section className="pt-4">
        <div className="flex px-8  py-5 gap-2 justify-between items-center">
          <div className="flex flex-col">
            {searchMode && type === "member" ? (
              <Fragment>
                <Typography
                  text="Date of Birth"
                  type="paragraph"
                  size="xs"
                  color={colors.subtitleColor}
                />

                <Typography
                  text={
                    item?.DateOfBirth
                      ? formatDisplayDate(item?.DateOfBirth, "/")
                      : "_"
                  }
                  type="paragraph"
                  size="xs"
                  color={colors.black}
                />
              </Fragment>
            ) : (
              <Fragment>
                <Typography
                  text="Membership"
                  type="paragraph"
                  size="xs"
                  color={colors.subtitleColor}
                />

                <Typography
                  text={item?.membershipRole || "_"}
                  type="paragraph"
                  size="xs"
                  color={colors.black}
                />
              </Fragment>
            )}
          </div>

          {searchMode || showInviteButton ? (
            <article className="flex gap-2">
              <Button
                variant="outline"
                borderColor={colors.confirmationColor}
                onClick={handleView}
                className="view-profile-btn"
                size="sm"
              >
                <Typography
                  text="Profile"
                  type="paragraph"
                  size="sm"
                  color={colors.black}
                />
              </Button>
              {showInviteButton && (
                <Button
                  variant="solid"
                  className="view-profile-btn"
                  size="sm"
                  colorScheme="blue"
                  borderColor={colors.primaryColor}
                  color={colors.primaryColor}
                  onClick={handleInviteMember}
                  isLoading={loading}
                >
                  <Typography
                    text="Invite"
                    type="paragraph"
                    size="sm"
                    color={colors.white}
                  />
                </Button>
              )}
            </article>
          ) : (
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
          )}
        </div>
      </section>
    </article>
  );
}
