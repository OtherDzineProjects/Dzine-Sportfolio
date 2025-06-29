import { Tooltip, Typography } from "common";
import { colors } from "utils/colors";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import { useLocation } from "react-router-dom";
import { setHeaderInfo, setUserInfo } from "pages/common/slice";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { STORAGE_KEYS } from "common/constants";
import { VerifiedSolidIcon } from "assets/DashboardIcons";
import UserIcon from "assets/UserIcon";
import { useParams } from "react-router-dom";
import { getUserByID, saveUserAvatar } from "pages/account/users/api";
import { Edit } from "assets/InputIcons";
import { API_STATUS } from "pages/common/constants";
import _ from "lodash";
import { useToast } from "common";

const UserHeader = () => {
  const {
    getUserByIDRes,
    saveUserAvatarStatus,
    saveUserAvatarRes,
    saveUserAvatarLoading,
    getUserPermissionsRes
  } = useSelector((state) => state.users);

  const userDataLocalStorage = localStorage.getItem(STORAGE_KEYS.USER);

  const location = useLocation();
  const dispatch = useDispatch();
  const params = useParams();
  const [userData, setUserData] = useState({});

  const profileImageInputRef = useRef(null),
    toast = useToast();

  useEffect(() => {
    dispatch(setUserInfo(JSON.parse(userDataLocalStorage)));
  }, [userDataLocalStorage]);

  const hasCrudPermission = useMemo(() => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));

    if (getUserPermissionsRes?.data?.[0]?.canEdit) {
      return true;
    } else if (user?.isAdmin) {
      return true;
    } else if (Number(user?.id) === Number(params?.userId)) {
      return true;
    } else {
      return false;
    }
  }, [getUserPermissionsRes, localStorage.getItem(STORAGE_KEYS.USER)]);

  useEffect(() => {
    if (saveUserAvatarStatus === API_STATUS.SUCCESS) {
      dispatch(getUserByID(params?.userId));
      toast({
        title: "Success",
        description: "Profile picture saved successfully",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } else if (saveUserAvatarStatus === API_STATUS.FAILED) {
      toast({
        title: "Error",
        description: saveUserAvatarRes,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  }, [saveUserAvatarStatus]);

  useEffect(() => {
    if (getUserByIDRes?.data?.length > 0) {
      const userFromLocalStorage = JSON.parse(userDataLocalStorage),
        userDetails = getUserByIDRes?.data[0];
      setUserData(userDetails);

      if (userDetails?.id == userFromLocalStorage?.id) {
        localStorage.setItem(
          STORAGE_KEYS.USER,
          JSON.stringify({
            ...userFromLocalStorage,
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            avatar: userDetails.avatar
          })
        );
      }
    }
  }, [getUserByIDRes]);

  useEffect(() => {
    if (params?.userId) {
      dispatch(getUserByID(params?.userId));
    }
  }, [params?.userId]);

  useEffect(() => {
    if (location?.pathname?.includes("/dashboard")) {
      dispatch(
        setHeaderInfo({
          title: "Dashboard",
          subTitle: "Welcome to the Sportfolio"
        })
      );
    } else if (
      location?.pathname?.includes("/users") &&
      !location?.pathname?.includes("/users/new")
    ) {
      dispatch(
        setHeaderInfo({ title: "Users", subTitle: "Users listing here.." })
      );
    } else if (location?.pathname?.includes("/users/new")) {
      dispatch(
        setHeaderInfo({ title: "Users", subTitle: "Update Users Data here.." })
      );
    } else {
      dispatch(setHeaderInfo({ title: "Sportfolio", subTitle: "Welcome" }));
    }
  }, [location.pathname]);

  const onImageSelected = (e) => {
    if (e?.target?.files?.length === 0 || !e?.target?.files?.[0]) return;
    const formData = new FormData();
    formData.append("uploads", e.target.files[0]);
    formData.append("userID", userData?.id);
    dispatch(saveUserAvatar(formData));
  };

  return (
    <div className="org-header flex gap-4 p-5 items-center relative bg-slate-100">
      <div className="absolute org-header-container flex gap-5 items-center">
        <div
          className={`h-[100px] w-[100px] rounded-full text-center shadow-lg relative profile-circle grid place-items-center bg-white ${
            hasCrudPermission ? "" : "!hover:opacity-100 !opacity-100"
          }`}
        >
          {userData?.avatar && !_.isEmpty(userData?.avatar) ? (
            <img
              src={userData?.avatar?.path}
              height={70}
              width={70}
              alt="profile-picture"
              className={`rounded-full profile-picture object-cover h-[4.375rem] w-[4.375rem] ${
                saveUserAvatarLoading ? "loading-state" : ""
              } ${
                hasCrudPermission
                  ? ""
                  : "!hover:opacity-100 !opacity-100 cursor-not-allowed"
              }`}
            />
          ) : (
            <UserIcon
              className={`rounded-full profile-picture object-cover h-[4.375rem] w-[4.375rem] ${
                saveUserAvatarLoading ? "loading-state" : ""
              } ${hasCrudPermission ? "" : "!hover:opacity-100 !opacity-100"}`}
            />
          )}

          <VerifiedSolidIcon
            color={colors.verifiedColor}
            className="verified"
          />

          {hasCrudPermission && (
            <Fragment>
              <input
                type="file"
                ref={profileImageInputRef}
                onChange={onImageSelected}
                className="hidden"
                accept="image/png,image/jpeg"
              />

              {!saveUserAvatarLoading && (
                <Tooltip label="Edit user image">
                  <div className="profile-picture__content">
                    <Edit
                      style={{ cursor: "pointer" }}
                      onClick={() => profileImageInputRef?.current?.click()}
                    />
                  </div>
                </Tooltip>
              )}

              {saveUserAvatarLoading && <div className="loading-image"></div>}
            </Fragment>
          )}
        </div>
        <div>
          <Typography
            text={`${userData?.firstName || ""} ${userData?.lastName || ""}`}
            type="h4"
            size="md"
            color={colors.dark}
            className="capitalize"
          />
          <Typography
            text={userData?.district || ""}
            type="paragraph"
            size="sm"
            color={colors.subtitleColor}
          />
        </div>
        <div className="flex-grow" />
      </div>
    </div>
  );
};

export default UserHeader;
