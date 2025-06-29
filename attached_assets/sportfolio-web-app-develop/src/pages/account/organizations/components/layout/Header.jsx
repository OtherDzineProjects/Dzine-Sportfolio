import { StarSolidIcon, StartOutlineIcon } from "assets/DashboardIcons";
import { Image, Typography } from "common";
import { colors } from "utils/colors";
import { API_FILE_URL } from "common/constants";
import { getRandomColor } from "utils/common";

const Header = ({ data }) => {
  return (
    <div>
      <div
        className="rounded-lg w-full"
        style={{ borderBottom: "1px solid #eee" }}
      >
        <div className="p-2 flex gap-4">
          <div className="flex-none">
            {data?.orgLogo?.data?.attributes?.url ? (
              <Image
                src={`${API_FILE_URL}${data.orgLogo?.data?.attributes?.url}`}
                alt="pic"
                className="w-[100px] h-[100px] rounded-lg"
              />
            ) : (
              <div
                className="h-[70px] w-[70px] rounded-full text-center pt-5 uppercase"
                style={{ background: getRandomColor() }}
              >
                {data?.organizationName?.charAt(0)}
              </div>
            )}
          </div>
          <div className="flex-grow">
            <div className="capitalize text-left">
              <Typography text={data?.organizationName?.toLowerCase()} />
            </div>
            <div className="text-left flex items-center justify-start gap-2 w-[200px]">
              <Typography
                size="sm"
                text={data?.cityID}
                color={colors.textDark}
                className="text-clip"
              />
            </div>
            <div className="capitalize text-center flex items-center justify-start gap-2 py-3">
              <StarSolidIcon width="16" height="16" color={colors.secondary} />
              <StarSolidIcon width="16" height="16" color={colors.secondary} />
              <StarSolidIcon width="16" height="16" color={colors.secondary} />
              <StarSolidIcon width="16" height="16" color={colors.secondary} />
              <StartOutlineIcon
                width="16"
                height="16"
                color={colors.secondary}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
