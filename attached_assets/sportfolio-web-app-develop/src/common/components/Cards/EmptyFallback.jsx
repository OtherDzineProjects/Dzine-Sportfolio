import FallbackImage from "assets/user-details-empy-fallback.svg";
import { Button, Typography } from "common";
import { AddIcon } from "assets/InputIcons";
import { colors } from "utils/colors";

export const EmptyFallback = ({
  buttonTitle,
  handleCreate = () => {},
  showCreateButton = true
}) => {
  return (
    <article className="w-full grid place-items-center gap-4 mb-8">
      <img src={FallbackImage} alt="fallback" />
      <Typography
        text="Your List is Clean... Lets Start Over!"
        type="h6"
        size="md"
        color={colors.black}
      />
      {showCreateButton && (
        <Button
          type="button"
          size="lg"
          variant="solid"
          colorScheme="primary"
          rightIcon={<AddIcon color={colors.white} />}
          onClick={handleCreate}
        >
          <span className="capitalize">{buttonTitle}</span>
        </Button>
      )}
    </article>
  );
};
