import { Button, Image, LabelValues, Typography } from "common";
import { colors } from "utils/colors";
import QualificationIcon from "assets/qualification-icon.svg";
import { Delete, Edit, PaperClip } from "assets/InputIcons";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import {
  setDocumentList,
  setSelectedDocument,
  setShowDocumentModal
} from "pages/common/slice";

export const QualificationCard = ({
  item,
  hasCrudPermission = false,
  onEdit = () => {},
  onDelete = () => {}
}) => {
  const dispatch = useDispatch();

  const openAttachmentPreview = (attachment) => {
    dispatch(setSelectedDocument(attachment));
    dispatch(setDocumentList(item.attachments));
    dispatch(setShowDocumentModal(true));
  };

  return (
    <div className="mt-3 shadow rounded-lg flex gap-3 p-2 bg-slate-100 items-stretch">
      <div className="p-3 flex self-stretch bg-white justify-center">
        <Image
          src={QualificationIcon}
          alt="logo"
          className="self-center"
          width="100px"
        />
      </div>
      <div className="p-3 w-full">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Typography
              text="Qualification Type"
              type="paragraph"
              size="xs"
              color={colors.textDark}
            />

            <Typography
              text={item?.title}
              type="h4"
              size="sm"
              weight="600"
              color={colors.dark}
            />
          </div>

          {hasCrudPermission && (
            <div className="flex gap-4 items-center">
              <Button
                leftIcon={<Edit width="16px" height="16px" />}
                size="xs"
                onClick={onEdit}
              >
                Edit
              </Button>

              <Button
                onClick={onDelete}
                leftIcon={
                  <Delete width="16px" height="16px" color={colors.white} />
                }
                size="xs"
                colorScheme="red"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
        <hr className="mt-2 mb-4" />
        <div className="grid gap-4">
          <div className="grid grid-flow-col grid-cols-3 gap-4">
            {item.value?.map((item) => (
              <LabelValues key={item?.title} data={item} />
            ))}
          </div>
          {item.remarks && (
            <LabelValues title="Remarks" innerHTML={item.remarks} />
          )}

          {item.attachments?.length > 0 && (
            <div className="flex flex-col gap-1">
              <Typography
                text="Attachments"
                type="paragraph"
                size="xs"
                color={colors.textDark}
              />
              <div className="flex gap-y-2 gap-x-4 flex-wrap">
                {Array.isArray(item.attachments) &&
                item.attachments?.length > 0 ? (
                  <Fragment>
                    {item.attachments.map((attachment) => (
                      <div
                        className="px-3 py-1 rounded-md w-fit flex items-center gap-2 cursor-pointer"
                        style={{
                          backgroundColor: colors.badgeColorYellow
                        }}
                        key={`${attachment?.documentID}-${attachment?.fileName}`}
                        onClick={() => openAttachmentPreview(attachment)}
                      >
                        <PaperClip />
                        <Typography
                          text={attachment?.fileName}
                          type="p"
                          size="s"
                          weight="600"
                          color={colors.dark}
                        />
                      </div>
                    ))}
                  </Fragment>
                ) : (
                  <Typography
                    text={item.attachments}
                    type="h4"
                    size="sm"
                    weight="600"
                    color={colors.dark}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
