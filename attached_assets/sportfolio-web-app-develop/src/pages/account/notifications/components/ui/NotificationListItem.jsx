import { formatDisplayDate } from "pages/common/helpers";
import { useMemo, Fragment } from "react";
import { colors } from "utils/colors";
import _ from "lodash";
import BallIcon from "assets/BallIcon";
import { Button, IconButton, Typography } from "common";
import { Delete, EditIcon, Eye } from "assets/InputIcons";
import { useDispatch } from "react-redux";
import { setPreviewNotification } from "../../slice";

export default function NotificationListItem({
  item,
  includeActionButton = false,
  shouldShowCrudButtons = false,
  onActionClick = () => {},
  onEditButtonClick = () => {},
  onDeleteButtonClick = () => {}
}) {
  const dispatch = useDispatch();

  const statusColor = useMemo(
    () => (item?.isEditable ? colors.verifiedColor : colors.errorColor),
    [item?.status]
  );

  return (
    <main className="rounded-lg bg-white border hover:shadow-lg transition flex items-center justify-between">
      <section className="flex items-center gap-[calc(2svw-0.25rem)]">
        <div className="flex items-center gap-6 flex-none">
          <article className="min-h-[80px] w-[50px] h-[100%] flex gap-4 m-x-5 m-y-auto items-center relative rounded-lg bg-slate-100">
            <div className="absolute flex gap-5 items-center left-[35%]">
              <div className="h-[50px] w-[50px] min-w-[50px] rounded-full shadow-lg relative profile-circle grid place-items-center bg-white">
                {item?.organizationAvatar &&
                !_.isEmpty(item?.organizationAvatar) ? (
                  <img
                    src={item?.organizationAvatar?.path}
                    height={40}
                    width={40}
                    alt="profile-picture"
                    className="rounded-full object-cover h-[2.5rem] w-[2.5rem]"
                  />
                ) : (
                  <BallIcon className="rounded-full object-cover h-[2.5rem] w-[2.5rem]" />
                )}
              </div>
            </div>
          </article>
          <article className="flex flex-col gap-1 w-[20ch]">
            <Typography
              text={item?.organizationName || ""}
              type="h4"
              size="sm"
              color={colors.dark}
              className="truncate"
            />

            <Typography
              text={item?.organizationDistrict || ""}
              type="p"
              size="xs"
              color={colors.subtitleColor}
            />
          </article>
        </div>
        <article className="flex flex-col gap-1 flex-none">
          <Typography
            text="Created Date"
            type="p"
            size="xs"
            color={colors.subtitleColor}
          />
          <Typography
            text={item?.createdDate ? formatDisplayDate(item.createdDate) : "_"}
            type="p"
            size="xs"
            color={colors.black}
          />
        </article>
        {item?.status && (
          <article className="flex flex-col gap-1 flex-none">
            <Typography
              text="Status"
              type="p"
              size="xs"
              color={colors.subtitleColor}
            />
            <Typography
              text={item?.status}
              type="p"
              size="xs"
              color={statusColor}
            />
          </article>
        )}

        <article className="flex flex-col gap-1 flex-none">
          <Typography
            text="Created By"
            type="p"
            size="xs"
            color={colors.subtitleColor}
          />
          <Typography
            text={item?.createdByName || "_"}
            type="p"
            size="xs"
            color={colors.black}
            className="max-w-[18ch] truncate"
          />
        </article>

        <article className="flex flex-col gap-1 flex-none">
          <Typography
            text="Approver"
            type="p"
            size="xs"
            color={colors.subtitleColor}
          />
          <Typography
            text={item?.approverName || "_"}
            type="p"
            size="xs"
            color={colors.black}
            className="max-w-[18ch] truncate"
          />
        </article>
        {item?.approvedDate && (
          <article className="flex flex-col gap-1 flex-none">
            <Typography
              text="Approved on"
              type="p"
              size="xs"
              color={colors.subtitleColor}
            />
            <Typography
              text={
                item?.approvedDate ? formatDisplayDate(item.approvedDate) : "_"
              }
              type="p"
              size="xs"
              color={colors.black}
            />
          </article>
        )}
      </section>

      <section className="flex-grow"></section>

      <section className="flex gap-2 items-center me-4">
        <IconButton
          border={`1px solid ${colors.verifiedColor}`}
          bg={colors.white}
          onClick={() => dispatch(setPreviewNotification(item))}
          className="!px-3"
          icon={<Eye width="18px" height="18px" color={colors.verifiedColor} />}
          title="Preview"
        />

        {includeActionButton && (
          <Button
            variant="outline"
            borderColor={colors.errorColor}
            className="view-profile-btn px-4"
            onClick={onActionClick}
          >
            <Typography text="Action" type="p" size="sm" color={colors.black} />
          </Button>
        )}

        {shouldShowCrudButtons && (
          <Fragment>
            <IconButton
              border={`1px solid ${colors.dark}`}
              bg={colors.white}
              onClick={onEditButtonClick}
              className="!px-3"
              icon={<EditIcon width="18px" height="18px" color={colors.dark} />}
              title="Edit"
            />

            <IconButton
              border={`1px solid ${colors.errorColor}`}
              bg={colors.white}
              onClick={onDeleteButtonClick}
              className="!px-3"
              icon={
                <Delete width="18px" height="18px" color={colors.errorColor} />
              }
              title="Delete"
            />
          </Fragment>
        )}
      </section>
    </main>
  );
}
