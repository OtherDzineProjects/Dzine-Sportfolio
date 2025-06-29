import { Delete, Edit } from "assets/InputIcons";
import { Button, LabelValues, Typography } from "common";
import { EmptyFallback } from "./EmptyFallback";
import { colors } from "utils/colors";
import SpecialLabelValues from "./SpecialLabelValues";
import { QualificationCard } from "./QualificationCard";
import FullscreenLoader from "../loaders/FullscreenLoader";
import { useMemo } from "react";
import { RichTextViewer } from "../rich-text/RichTextViewer";
import { CardWithHeaderWrapper } from "./CardWithHeaderWrapper";
import { Fragment } from "react";

const CardWithHeader = ({
  separateValueKey = "title",
  buttonTitle = "",
  data = [],
  isEditable = false,
  isDeletable = false,
  isCustomView = false,
  isCreatable = false,
  loader = false,
  title = null,
  id = null,
  hasCrudPermission = false,
  handleEdit = () => {},
  handleCreate = () => {},
  handleDelete = () => {},
  handleItemEdit = () => {},
  handleItemDelete = () => {}
}) => {
  const separatedData = useMemo(
    () => data.find((item) => item?.separate) || null,
    [data]
  );

  return (
    <CardWithHeaderWrapper
      id={id}
      title={title}
      headerSection={
        <div className="flex gap-4 items-center">
          {isEditable && data.length > 0 && (
            <Button
              onClick={handleEdit}
              leftIcon={<Edit width="16px" height="16px" />}
              size={"xs"}
            >
              Edit
            </Button>
          )}

          {isDeletable && data.length > 0 && (
            <Button
              onClick={handleDelete}
              leftIcon={
                <Delete width="16px" height="16px" color={colors.white} />
              }
              size="xs"
              colorScheme="red"
            >
              Delete
            </Button>
          )}
          {isCustomView && isCreatable && data.length > 0 && (
            <Button
              onClick={handleCreate}
              size="s"
              fontSize={12}
              className="px-4 py-2"
              type="button"
            >
              Add new
            </Button>
          )}
        </div>
      }
    >
      {loader && <FullscreenLoader height="180px" />}

      {!isCustomView && data.length > 0 && !loader && (
        <div className="flex gap-3 max-w-full">
          <div className="flex-grow grid  grid-cols-[repeat(auto-fit,minmax(250px,_1fr))] flex-wrap gap-5">
            {data
              ?.filter((item) => !item?.separate)
              ?.map((item, index) => (
                <LabelValues key={`${item?.title}-${index}`} data={item} />
              ))}

            {separatedData && (
              <section className="col-span-full mt-2">
                {separatedData?.richText ? (
                  <div className="mt-2 flex flex-col gap-1">
                    <Typography
                      text={separatedData?.title}
                      type="paragraph"
                      size="xs"
                      color={colors.textDark}
                    />
                    <RichTextViewer content={separatedData?.value} />
                  </div>
                ) : (
                  <Fragment>
                    <Typography
                      text={separatedData?.title}
                      type="p"
                      size="s"
                      weight="400"
                      color={colors.black}
                    />
                    <div className="w-full flex flex-wrap gap-4 mt-2">
                      {separatedData?.value?.map((types) => (
                        <SpecialLabelValues
                          key={types[separateValueKey]}
                          data={types}
                          includeTypeLabel
                          separateValueKey={separateValueKey}
                        />
                      ))}
                    </div>
                  </Fragment>
                )}
              </section>
            )}
          </div>
        </div>
      )}

      {isCustomView && data.length > 0 && !loader && (
        <div className="grid gap-3">
          {data?.map((item, index) => (
            <QualificationCard
              key={`${item?.title}-${index}`}
              item={item}
              onEdit={() => handleItemEdit(index)}
              onDelete={() => handleItemDelete(index)}
              hasCrudPermission={hasCrudPermission}
            />
          ))}
        </div>
      )}

      {data.length === 0 && !loader && (
        <EmptyFallback
          buttonTitle={buttonTitle}
          handleCreate={handleCreate}
          showCreateButton={hasCrudPermission}
        />
      )}
    </CardWithHeaderWrapper>
  );
};

export default CardWithHeader;
