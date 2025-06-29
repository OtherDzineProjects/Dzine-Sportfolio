import { IconButton } from "@chakra-ui/react";
import { Close } from "assets/InputIcons";
import { searchNotifications } from "pages/account/notifications/api";
import { searchOrg } from "pages/account/organizations/api";
import { searchUser } from "pages/account/users/api";
import { setSearchBar, setSearchKeyword } from "pages/common/slice";
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

const SearchBar = (props) => {
  const { from } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [pathName, setPathName] = useState("");
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { searchKeyword } = useSelector((state) => state.common);

  const searchInput = {
    height: "80px",
    paddingLeft: "30px",
    fontSize: "18px",
    width: "100%"
  };

  useEffect(() => {
    setPathName("");
    return () => {
      dispatch(setSearchKeyword(null));
    };
  }, []);

  useEffect(() => {
    if (pathName && location?.pathname !== pathName) {
      setPathName(location?.pathname);
      dispatch(setSearchBar(false));
      dispatch(setSearchKeyword(null));
    } else if (!pathName) {
      setPathName(location?.pathname);
      dispatch(setSearchKeyword(null));
    }
  }, [location?.pathname]);

  const handleClose = () => {
    dispatch(setSearchBar(false));
    dispatch(setSearchKeyword(null));

    let query = "";
    if (searchParams.get("tab")) {
      query = `?tab=${searchParams.get("tab")}&page=${
        searchParams.get("page") || 1
      }&pageSize=${searchParams.get("pageSize") || 12}`;
    } else {
      query = `?page=${searchParams.get("page") || 1}&pageSize=${
        searchParams.get("pageSize") || 12
      }`;
    }
    navigate(query);
    handleSubmit(null, Number(searchParams.get("page")));
  };

  const handleSubmit = (value, page = 1) => {
    switch (from) {
      case "users":
        dispatch(
          searchUser({
            data: {
              keywordSearchText: value
            },
            query: `?page=${page}&pageSize=${
              searchParams.get("pageSize") || 12
            }`
          })
        );
        break;
      case "my-org-search":
        dispatch(
          searchOrg({
            data: {
              type: "O",
              keywordSearchText: value
            },
            query: `?page=${page}&pageSize=${
              searchParams.get("pageSize") || 12
            }`
          })
        );
        break;

      case "member-org-search":
        dispatch(
          searchOrg({
            data: {
              type: "M",
              keywordSearchText: value
            },
            query: `?page=${page}&pageSize=${
              searchParams.get("pageSize") || 12
            }`
          })
        );
        break;

      case "recent-org-search":
        dispatch(
          searchOrg({
            data: {
              type: "R",
              keywordSearchText: value
            },
            query: `?page=${page}&pageSize=${
              searchParams.get("pageSize") || 12
            }`
          })
        );
        break;
      case "inbox-notify-search":
        dispatch(
          searchNotifications({
            data: { type: "I", keywordSearchText: value },
            query: `?page=${page}&pageSize=${
              searchParams.get("pageSize") || 12
            }`
          })
        );
        break;
      case "sent-notify-search":
        dispatch(
          searchNotifications({
            data: { type: "S", keywordSearchText: value },
            query: `?page=${page}&pageSize=${
              searchParams.get("pageSize") || 12
            }`
          })
        );
        break;
      case "await-notify-search":
        dispatch(
          searchNotifications({
            data: { type: "A", keywordSearchText: value },
            query: `?page=${page}&pageSize=${
              searchParams.get("pageSize") || 12
            }`
          })
        );
        break;
    }
  };

  return (
    <div
      className="w-full absolute t-0 r-0 b-0 bg-white flex gap-5 items-center pr-5"
      style={{ left: 0 }}
    >
      <div className="flex-grow">
        <input
          type="text"
          value={searchKeyword}
          placeholder="Keyword Search..."
          style={searchInput}
          className="focus:outline-none"
          autoFocus
          onChange={(event) => dispatch(setSearchKeyword(event.target.value))}
          onKeyDown={(event) => {
            if (event.code === "Enter") {
              handleSubmit(
                event?.target?.value?.trimStart() || event.target.value
              );
            }
          }}
        />
      </div>
      <IconButton icon={<Close />} onClick={handleClose} />
    </div>
  );
};

export default SearchBar;
