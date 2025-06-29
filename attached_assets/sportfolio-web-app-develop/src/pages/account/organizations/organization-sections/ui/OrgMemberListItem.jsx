import UserIcon from "assets/UserIcon";
import { Button, Typography } from "common";
import _ from "lodash";
import { formatDisplayDate } from "pages/common/helpers";
import { Fragment } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { colors } from "utils/colors";

export default function OrgMemberListItem({
  member,
  id,
  tab = "",
  includeActionButton = false,
  showAcceptRejectButtons = false,
  onActionClick = () => {},
  onRejectClick = () => {},
  onAcceptClick = () => {}
}) {
  const navigate = useNavigate(),
    handleView = () => {
      if (!_.isNil(id)) navigate(`/account/users/${id}/profile`);
    };

  const statusColor = useMemo(
      () =>
        member?.showCancelInvite ? colors.verifiedColor : colors.errorColor,

      [member?.status]
    ),
    primaryLabel = useMemo(() => {
      switch (tab) {
        case "pending":
          return "Invited Date";
        case "applied":
          return "Received Date";
        default:
          return "";
      }
    }, [tab]),
    actionLabel = useMemo(() => {
      switch (tab) {
        case "pending":
          return "Cancel Invite";
        case "applied":
          return "Action";
        default:
          return "";
      }
    }, [tab]),
    primaryValue = useMemo(
      () =>
        member?.membershipRequestDate
          ? formatDisplayDate(member?.membershipRequestDate, "/")
          : "_",
      [member?.membershipRequestDate]
    );
  return (
    <main className="rounded-lg bg-white border hover:shadow-lg transition flex items-center justify-between">
      <section className="flex items-center gap-[calc(3svw-0.25rem)]">
        <div className="flex items-center gap-6 flex-none">
          <article className="min-h-[80px] w-[50px] h-[100%] flex gap-4 m-x-5 m-y-auto items-center relative rounded-lg bg-slate-100">
            <div className="absolute flex gap-5 items-center left-[35%]">
              <div className="h-[50px] w-[50px] min-w-[50px] rounded-full shadow-lg relative profile-circle grid place-items-center bg-white">
                {member?.avatar && !_.isEmpty(member?.avatar) ? (
                  <img
                    src={member?.avatar?.path}
                    height={40}
                    width={40}
                    alt="profile-picture"
                    className="rounded-full object-cover h-[2.5rem] w-[2.5rem]"
                  />
                ) : (
                  <UserIcon className="rounded-full object-cover h-[2.5rem] w-[2.5rem]" />
                )}
              </div>
            </div>
          </article>
          <article className="flex flex-col gap-1 w-[14ch]">
            <Typography
              text={`${member?.firstName || ""} ${member?.lastName || ""}`}
              type="h4"
              size="sm"
              color={colors.dark}
              className="truncate"
            />

            <Typography
              text={member?.district}
              type="paragraph"
              size="xs"
              color={colors.subtitleColor}
              className="truncate"
            />
          </article>
        </div>
        <article className="flex flex-col gap-1 flex-none">
          <Typography
            text={primaryLabel}
            type="paragraph"
            size="xs"
            color={colors.subtitleColor}
          />
          <Typography
            text={primaryValue}
            type="paragraph"
            size="xs"
            color={colors.black}
          />
        </article>
        {member?.status && (
          <article className="flex flex-col gap-1 flex-none">
            <Typography
              text="Status"
              type="paragraph"
              size="xs"
              color={colors.subtitleColor}
            />
            <Typography
              text={member?.status}
              type="paragraph"
              size="xs"
              color={statusColor}
            />
          </article>
        )}
      </section>

      <section className="flex-grow"></section>
      <section className="flex gap-2 items-center me-4">
        {showAcceptRejectButtons ? (
          <Fragment>
            <Button
              variant="outline"
              borderColor={colors.confirmationColor}
              onClick={onAcceptClick}
              className="view-profile-btn px-4"
            >
              <Typography
                text="Accept"
                type="paragraph"
                size="sm"
                color={colors.black}
              />
            </Button>

            <Button
              variant="outline"
              borderColor={colors.errorColor}
              className="view-profile-btn px-4"
              onClick={onRejectClick}
            >
              <Typography
                text="Reject"
                type="paragraph"
                size="sm"
                color={colors.black}
              />
            </Button>
          </Fragment>
        ) : (
          <Fragment>
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

            {includeActionButton && (
              <Button
                variant="outline"
                borderColor={colors.errorColor}
                className="view-profile-btn px-4"
                onClick={onActionClick}
              >
                <Typography
                  text={actionLabel}
                  type="paragraph"
                  size="sm"
                  color={colors.black}
                />
              </Button>
            )}
          </Fragment>
        )}
      </section>
    </main>
  );
}
