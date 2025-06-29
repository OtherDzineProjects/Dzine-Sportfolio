import { AddIcon } from "assets/InputIcons";
import { Button, IconButton } from "common";
import { colors } from "utils/colors";
import { useDispatch } from "react-redux";
import { setNewUserDialog } from "pages/account/users/slice";
import { SearchIcon } from "assets/DashboardIcons";
import { setSearchBar } from "pages/common/slice";
import { setNewOrgDialog } from "pages/account/organizations/slice";
import { setNewNotificationCreateDialog } from "pages/account/notifications/slice";

const HeaderActions = ({ from }) => {
  const dispatch = useDispatch();

  if (from === "dashboard") {
    return <div className="flex gap-3 items-center"></div>;
  } else if (from === "users") {
    return (
      <div className="flex gap-3 items-center">
        <IconButton
          onClick={() => dispatch(setSearchBar(true))}
          icon={<SearchIcon width="18px" height="18px" color={colors.dark} />}
        />
        <Button
          variant="solid"
          colorScheme="primary"
          onClick={() => dispatch(setNewUserDialog(true))}
          rightIcon={
            <AddIcon width="18px" height="18px" color={colors.white} />
          }
        >
          Add New
        </Button>
      </div>
    );
  } else if (from === "my-org-search") {
    return (
      <div className="flex gap-3 items-center">
        <IconButton
          onClick={() => dispatch(setSearchBar(true))}
          icon={<SearchIcon width="18px" height="18px" color={colors.dark} />}
        />
        <Button
          variant="solid"
          colorScheme="primary"
          onClick={() => dispatch(setNewOrgDialog(true))}
          rightIcon={
            <AddIcon width="18px" height="18px" color={colors.white} />
          }
        >
          Add New
        </Button>
      </div>
    );
  } else if (from === "recent-org-search" || from === "member-org-search") {
    return (
      <div className="flex gap-3 items-center">
        <IconButton
          onClick={() => dispatch(setSearchBar(true))}
          icon={<SearchIcon width="18px" height="18px" color={colors.dark} />}
        />
      </div>
    );
  } else if (
    from === "inbox-notify-search" ||
    from === "sent-notify-search" ||
    from === "await-notify-search"
  ) {
    return (
      <div className="flex gap-3 items-center">
        <IconButton
          onClick={() => dispatch(setSearchBar(true))}
          icon={<SearchIcon width="18px" height="18px" color={colors.dark} />}
        />
        <Button
          variant="solid"
          colorScheme="primary"
          onClick={() => dispatch(setNewNotificationCreateDialog(true))}
          rightIcon={
            <AddIcon width="18px" height="18px" color={colors.white} />
          }
        >
          Create
        </Button>
      </div>
    );
  }
};

export default HeaderActions;
