import {
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Portal,
  Tooltip,
  Typography,
  useToast
} from "common";
import { colors } from "utils/colors";
import { useSelector, useDispatch } from "react-redux";
import "./style.css";
import { useLocation } from "react-router-dom";
import { setAlertDialog, setHeaderInfo, setUserInfo } from "pages/common/slice";
import { useEffect } from "react";
import { STORAGE_KEYS } from "common/constants";
import { useState } from "react";
import { VerifiedSolidIcon } from "assets/DashboardIcons";
import BallIcon from "assets/BallIcon";
import {
  applyOrgMembership,
  changeMemberStatus,
  checkOrgMembership,
  getOrgByID,
  saveOrgAvatar
} from "pages/account/organizations/api";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { API_STATUS } from "pages/common/constants";
import _ from "lodash";
import { AddIcon, Edit } from "assets/InputIcons";
import {
  clearSearchUsersForOrg,
  handleShowAddMemberDialog
} from "pages/account/organizations/slice";
import { PendingIcon } from "assets/StatusIcons";
import useConfirmAlert from "hooks/useConfirmAlert";
import { useMemo } from "react";
import { Fragment } from "react";

const OrgHeader = () => {
  const {
    getOrgByIDRes,
    saveOrgAvatarRes,
    saveOrgAvatarLoading,
    saveOrgAvatarStatus,
    applyOrgMembershipRes,
    checkOrgMembershipRes,
    applyOrgMembershipLoading,
    applyOrgMembershipStatus,
    changeMemberStatusRes,
    changeMemberStatusLoading,
    changeMemberStatusStatus,
    getOrgMemberCountRes,
    getOrgPermissionsRes
  } = useSelector((state) => state.org);

  const userDataLocalStorage = localStorage.getItem(STORAGE_KEYS.USER);
  const location = useLocation();
  const dispatch = useDispatch();
  const [orgData, setOrgData] = useState({});
  const params = useParams();
  const showConfirmAlert = useConfirmAlert();

  const profileImageInputRef = useRef(null),
    toast = useToast();

  const hasCrudPermission = useMemo(
    () => (getOrgPermissionsRes?.data?.[0]?.canEdit ? true : false),
    [getOrgPermissionsRes]
  );

  useEffect(() => {
    dispatch(setUserInfo(JSON.parse(userDataLocalStorage)));
  }, [userDataLocalStorage]);

  useEffect(() => {
    dispatch(getOrgByID(params.orgId));
    dispatch(checkOrgMembership(params.orgId));
  }, [params.orgId]);

  useEffect(() => {
    if (getOrgByIDRes?.data?.length > 0) {
      setOrgData(getOrgByIDRes?.data[0]);
    }
  }, [getOrgByIDRes]);

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

    return () => {
      dispatch(handleShowAddMemberDialog(false));
    };
  }, [location.pathname]);

  useEffect(() => {
    if (saveOrgAvatarStatus === API_STATUS.SUCCESS) {
      dispatch(getOrgByID(params.orgId));
      toast({
        title: "Success",
        description: "Profile picture saved successfully",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } else if (saveOrgAvatarStatus === API_STATUS.FAILED) {
      toast({
        title: "Error",
        description: saveOrgAvatarRes,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  }, [saveOrgAvatarStatus]);

  useEffect(() => {
    if (applyOrgMembershipStatus === API_STATUS.SUCCESS) {
      dispatch(clearSearchUsersForOrg());
      dispatch(checkOrgMembership(params.orgId));
      toast({
        title: "Success",
        description: "Applied for membership successfully",
        status: "success",
        duration: 5000,
        isClosable: true
      });
    } else if (applyOrgMembershipStatus === API_STATUS.FAILED) {
      dispatch(clearSearchUsersForOrg());
      toast({
        title: "Error",
        description: applyOrgMembershipRes,
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
    dispatch(setAlertDialog(null));
  }, [applyOrgMembershipStatus]);

  useEffect(() => {
    if (location?.pathname?.includes("/profile")) {
      if (changeMemberStatusStatus === API_STATUS.SUCCESS) {
        dispatch(clearSearchUsersForOrg());
        dispatch(checkOrgMembership(params.orgId));
        dispatch(setAlertDialog(null));
        toast({
          title: "Success",
          description: "Membership status updated successfully",
          status: "success",
          duration: 5000,
          isClosable: true
        });
      } else if (changeMemberStatusStatus === API_STATUS.FAILED) {
        dispatch(clearSearchUsersForOrg());
        dispatch(setAlertDialog(null));
        toast({
          title: "Error",
          description: changeMemberStatusRes || "Something went wrong",
          status: "error",
          duration: 5000,
          isClosable: true
        });
      }
    }
  }, [changeMemberStatusStatus]);

  const onImageSelected = (e) => {
    if (e?.target?.files?.length === 0 || !e?.target?.files?.[0]) return;
    const formData = new FormData();
    formData.append("uploads", e.target.files[0]);
    formData.append("organizationID", params.orgId);
    dispatch(saveOrgAvatar(formData));
  };

  const applyMembership = () => {
    const userDetails = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));

    if (!userDetails) return;
    dispatch(
      applyOrgMembership({
        organizationID: params.orgId,
        memberID: userDetails?.id
      })
    );
  };

  const revokeMembership = () => {
    if (_.isNil(checkOrgMembershipRes?.data?.[0]?.organizationMemberID)) return;

    const submitData = {
      status: "Cancel",
      organizationMemberID:
        +checkOrgMembershipRes?.data?.[0]?.organizationMemberID,
      organizationID: +params?.orgId
    };

    dispatch(changeMemberStatus(submitData));
  };

  const onMembershipButtonClick = (type) => {
    showConfirmAlert(
      "",
      type === "apply"
        ? "Are you sure want to apply for membership?"
        : "Are you sure want to revoke membership?",
      () => (type === "apply" ? applyMembership() : revokeMembership())
    );
  };

  const isHigherPrivilege = useMemo(
    () =>
      Boolean(getOrgMemberCountRes?.data?.isOwner) ||
      Boolean(getOrgMemberCountRes?.data?.isAdmin) ||
      Boolean(getOrgMemberCountRes?.data?.isSuperAdmin),
    [getOrgMemberCountRes]
  );

  return (
    <div className="org-header flex gap-4 p-5 items-center relative bg-slate-100">
      <div className="absolute org-header-container flex gap-5 items-center">
        <div
          className={`h-[100px] w-[100px] rounded-full shadow-lg relative profile-circle grid place-items-center bg-white ${
            hasCrudPermission ? "" : "!hover:opacity-100 !opacity-100"
          }`}
        >
          {orgData?.avatar && !_.isEmpty(orgData?.avatar) ? (
            <img
              src={orgData?.avatar?.path}
              height={70}
              width={70}
              alt="profile-picture"
              className={`rounded-full profile-picture object-cover h-[4.375rem] w-[4.375rem] ${
                saveOrgAvatarLoading ? "loading-state" : ""
              } ${
                hasCrudPermission
                  ? ""
                  : "!hover:opacity-100 !opacity-100 cursor-not-allowed"
              }`}
            />
          ) : (
            <BallIcon
              className={`rounded-full profile-picture object-cover h-[4.375rem] w-[4.375rem] ${
                saveOrgAvatarLoading ? "loading-state" : ""
              } ${
                hasCrudPermission
                  ? ""
                  : "!hover:opacity-100 !opacity-100 cursor-not-allowed"
              }`}
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

              {!saveOrgAvatarLoading && (
                <Tooltip label="Edit org image">
                  <div className="profile-picture__content">
                    <Edit
                      style={{ cursor: "pointer" }}
                      onClick={() => profileImageInputRef?.current?.click()}
                    />
                  </div>
                </Tooltip>
              )}

              {saveOrgAvatarLoading && <div className="loading-image"></div>}
            </Fragment>
          )}
        </div>

        <div>
          <Typography
            text={orgData?.organizationName}
            type="h4"
            size="md"
            color={colors.black}
          />
          <Typography
            text={`${orgData?.city || ""}`}
            type="paragraph"
            size="sm"
            color={colors.subtitleColor}
          />
        </div>
        <div className="flex-grow" />
      </div>

      {location?.pathname?.includes("/members") && isHigherPrivilege && (
        <section className="ms-auto flex items-center gap-4">
          <Button
            variant="solid"
            colorScheme="primary"
            rightIcon={
              <AddIcon color={colors.white} width="18px" height="18px" />
            }
            onClick={() => dispatch(handleShowAddMemberDialog(true))}
          >
            Add Member
          </Button>
        </section>
      )}

      {location?.pathname?.includes("/profile") && (
        <section className="ms-auto flex items-center gap-4">
          {checkOrgMembershipRes?.data?.[0]?.isDisableApplyMembership ? (
            <Popover trigger="hover" isLazy>
              <PopoverTrigger>
                <Button
                  isLoading={changeMemberStatusLoading}
                  variant="unstyled"
                  bg="#f9f1cc"
                  className="membership-pending-btn"
                  cursor="default"
                  padding="0.5rem 1rem"
                  height="fit-content"
                  width="max-content"
                  _hover={{
                    bg: "#f9f1cc"
                  }}
                >
                  <section className="flex flex-col">
                    <Typography
                      size="xs"
                      color={colors.black}
                      text="Membership Applied"
                      type="p"
                      className="m-0 text-left"
                      weight="500"
                    />

                    <div className="flex items-center gap-2">
                      <Typography
                        size="xs"
                        color={colors.subtitleColor}
                        text={`Status: ${
                          checkOrgMembershipRes?.data?.[0]?.status || ""
                        }`}
                        type="p"
                        className="m-0 capitalize"
                        weight="500"
                      />

                      {!checkOrgMembershipRes?.data?.[0]
                        ?.isDisableRevokeMembership && (
                        <Typography
                          size="xs"
                          color={colors.errorColor}
                          text="Revoke"
                          type="p"
                          className="m-0 cursor-pointer"
                          onClick={() => onMembershipButtonClick("revoke")}
                          weight="500"
                        />
                      )}
                    </div>
                  </section>
                  <PendingIcon />
                </Button>
              </PopoverTrigger>
              <Portal>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverHeader textAlign="center">Status note</PopoverHeader>
                  <PopoverCloseButton />
                  <PopoverBody>
                    {checkOrgMembershipRes?.data?.[0]?.notes ? (
                      <Typography
                        text={checkOrgMembershipRes?.data?.[0]?.notes}
                        type="p"
                        size="sm"
                        color={colors.black}
                      />
                    ) : (
                      <Typography
                        text="No Notes Available"
                        type="p"
                        size="sm"
                        color={colors.textDark}
                        className="text-center my-4"
                      />
                    )}
                  </PopoverBody>
                </PopoverContent>
              </Portal>
            </Popover>
          ) : (
            <Button
              variant="solid"
              colorScheme="primary"
              isLoading={applyOrgMembershipLoading}
              rightIcon={
                applyOrgMembershipLoading ? null : (
                  <AddIcon color={colors.white} width="18px" height="18px" />
                )
              }
              onClick={() => onMembershipButtonClick("apply")}
            >
              Apply Membership
            </Button>
          )}
        </section>
      )}
    </div>
  );
};

export default OrgHeader;
