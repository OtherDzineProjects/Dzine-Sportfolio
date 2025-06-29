import { DoneFilled } from "assets/InputIcons";
import { Typography } from "common";
import { colors } from "utils/colors";

const SpecialLabelValues = ({
  displayKey = "value",
  separateValueKey = "title",
  data = null,
  includeTypeLabel = false,
  conditionForSuccess = false,
  includeLabel = true,
  icon = null
}) => {
  return (
    <div className="flex flex-col gap-1">
      {includeLabel && (
        <Typography
          text={
            includeTypeLabel
              ? `Type: ${data?.[separateValueKey]}`
              : data?.[separateValueKey]
          }
          type="paragraph"
          size="xs"
          color={colors.textDark}
        />
      )}
      <div
        className="px-2 py-1 rounded-md w-fit flex items-center gap-2"
        style={{
          backgroundColor: conditionForSuccess
            ? colors.badgeColorGreen
            : colors.badgeColorYellow
        }}
      >
        <Typography
          text={data[displayKey]}
          type="h4"
          size="sm"
          weight="600"
          color={colors.dark}
        />

        {conditionForSuccess && <DoneFilled color="#00CC8F" />}
        {icon && icon}
      </div>
    </div>
  );
};

export default SpecialLabelValues;
