import { VerifiedInputIcon } from "assets/InputIcons";
import { Badge, Typography } from "common";
import DOMPurify from "dompurify";
import { colors } from "utils/colors";
import { getRandomLightColor } from "utils/common";
import "./style.css";
import { Fragment } from "react";

const LabelValues = ({ data = null, title = "", innerHTML = null }) => {
  return (
    <div className="flex flex-col gap-1">
      {(data?.title || title) && (
        <div className="flex  gap-1">
          <Typography
            text={data?.title || title}
            type="paragraph"
            size="xs"
            color={colors.textDark}
          />
          {data?.verified && <VerifiedInputIcon />}
        </div>
      )}

      {data && data?.multi ? (
        <div className="flex items-center gap-2 flex-wrap">
          {Array.isArray(data.value) && data?.value?.length > 0 ? (
            <Fragment>
              {data.value.slice(0, 2).map((string, index) => (
                <div
                  className={
                    "px-2 py-1 rounded-md w-fit flex items-center gap-2"
                  }
                  key={`${string}-${index}`}
                  style={{ backgroundColor: getRandomLightColor() }}
                >
                  <Typography
                    text={string}
                    type="p"
                    size="sm"
                    weight="400"
                    color={colors.dark}
                  />
                </div>
              ))}

              {data?.value?.length > 2 && (
                <Badge
                  variant="primary"
                  round
                  text={`+${data?.value?.length - 2}`}
                />
              )}
            </Fragment>
          ) : (
            <Typography
              text={`${data?.value}`}
              type="h4"
              size="sm"
              weight="600"
              color={colors.dark}
            />
          )}
        </div>
      ) : (
        data && (
          <Typography
            text={`${data?.value}`}
            type="h4"
            size="sm"
            weight="600"
            color={colors.dark}
          />
        )
      )}

      {innerHTML && (
        <div
          className="notes-html"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(innerHTML)
          }}
        ></div>
      )}
    </div>
  );
};

export default LabelValues;
