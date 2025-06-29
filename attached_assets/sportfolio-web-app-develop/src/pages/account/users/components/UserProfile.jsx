import React, { useState, useRef, useEffect } from "react";
import CardWithHeader from "common/components/Cards/CardWithHeader";
import { formatProfile } from "../helper";
import { useSelector } from "react-redux";
import { useDisclosure } from "common";
import { UserBasicForm } from "../user-sections/UserBasicForm";
import { UserContactForm } from "../user-sections/UserContactForm";
import { UserSections } from "./userSectionTypes";
import { useParams } from "react-router-dom";
import {
  deleteUserBasicDetails,
  deleteUserContactDetails,
  deleteUserQualifications,
  getUserByID,
  getUserPermissions,
  searchUserBasicDetails,
  searchUserContactDetails,
  searchUserQualifications
} from "../api";
import { useDispatch } from "react-redux";
import {
  resetUserDetails,
  resetUserFormActions,
  resetUsersList
} from "../slice";
import { UserQualificationsForm } from "../user-sections/UserQualificationsForm";
import { FormModalWrapper } from "common/components/Modal/FormModalWrapper";
import { API_STATUS } from "pages/common/constants";
import UserSideBar from "./UserSideBar";
import {
  setAlertDialog,
  setDocumentList,
  setShowDocumentModal
} from "pages/common/slice";
import { useMemo } from "react";
import AttachementPreview from "common/components/Attachment/AttachementPreview";
import createStatusAlert, { ALERT_TYPE } from "utils/alert";
import useSuccessAlert from "hooks/useSuccessAlert";
import useErrorAlert from "hooks/useErrorAlert";
import { useSearchParams } from "react-router-dom";
import { STORAGE_KEYS } from "common/constants";

const UserProfile = () => {
  const { isOpen, onOpen, onClose } = useDisclosure(),
    { userId } = useParams(),
    [searchParams] = useSearchParams(),
    dispatch = useDispatch(),
    {
      searchUserBasicDetailRes,
      searchUserContactDetailRes,
      searchUserQualificationRes,
      searchUserBasicDetailLoading = true,
      searchUserContactDetailLoading = true,
      searchUserQualificationLoading = true,
      saveUserBasicDetailLoading,
      updateUserBasicDetailLoading,
      saveUserContactDetailLoading,
      updateUserContactDetailLoading,
      saveUserQualificationLoading,
      updateUserQualificationLoading,
      saveUserBasicDetailStatus = null,
      updateUserBasicDetailStatus = null,
      saveUserContactDetailStatus = null,
      updateUserContactDetailStatus = null,
      saveUserQualificationStatus = null,
      updateUserQualificationStatus = null,
      deleteUserContactDetailStatus = null,
      deleteUserQualificationStatus = null,
      deleteUserBasicDetailStatus = null,
      saveUserBasicDetailRes = null,
      updateUserBasicDetailRes = null,
      deleteUserBasicDetailRes = null,
      saveUserContactDetailRes = null,
      updateUserContactDetailRes = null,
      deleteUserContactDetailRes = null,
      saveUserQualificationRes = null,
      updateUserQualificationRes = null,
      deleteUserQualificationRes = null,
      getUserPermissionsRes
    } = useSelector((state) => state.users),
    alertDialog = useSelector((state) => state.common.alertDialog);

  const [modalType, setModalType] = useState(""),
    [formType, setFormType] = useState("create"),
    [selectedItem, setSelectedItem] = useState(null),
    submitRef = useRef();

  const showSuccessAlert = useSuccessAlert(),
    showErrorAlert = useErrorAlert();

  const hasCrudPermission = useMemo(() => {
    const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER));

    if (getUserPermissionsRes?.data?.[0]?.canEdit) {
      return true;
    } else if (user?.isAdmin) {
      return true;
    } else if (Number(user?.id) === Number(userId)) {
      return true;
    } else {
      return false;
    }
  }, [getUserPermissionsRes, localStorage.getItem(STORAGE_KEYS.USER)]);

  useEffect(() => {
    if (searchParams.get("orgID")) {
      dispatch(getUserPermissions(searchParams.get("orgID")));
    }
  }, [searchParams]);

  useEffect(() => {
    dispatch(resetUsersList());
    return () => {
      setModalType("");
      setFormType("");
      setSelectedItem(null);
      dispatch(resetUserDetails());
      dispatch(resetUserFormActions());
      dispatch(setAlertDialog(null));
      dispatch(setShowDocumentModal(false));
      dispatch(setDocumentList([]));
      onClose();
    };
  }, []);

  useEffect(() => {
    if (alertDialog === null) dispatch(resetUserFormActions());
  }, [alertDialog]);

  useEffect(() => {
    if (
      saveUserBasicDetailStatus === API_STATUS.SUCCESS ||
      updateUserBasicDetailStatus === API_STATUS.SUCCESS ||
      deleteUserBasicDetailStatus === API_STATUS.SUCCESS
    ) {
      dispatch(searchUserBasicDetails({ userID: userId }));
      dispatch(getUserByID(userId));
      onClose();
      let message = "";

      switch (formType) {
        case "delete":
          message = "Basic details deleted successfully";
          break;
        case "edit":
          message = "Basic details updated successfully";
          break;
        case "create":
          message = "Basic details created successfully";
          break;
        default:
          message = "Basic details action completed successfully";
          break;
      }

      showSuccessAlert("", message);
    } else if (
      saveUserBasicDetailStatus === API_STATUS.FAILED ||
      updateUserBasicDetailStatus === API_STATUS.FAILED ||
      deleteUserBasicDetailStatus === API_STATUS.FAILED
    ) {
      let message = "";

      switch (formType) {
        case "delete":
          message = deleteUserBasicDetailRes;
          break;
        case "edit":
          message = updateUserBasicDetailRes;
          break;
        case "create":
          message = saveUserBasicDetailRes;
          break;
        default:
          message = "Something went wrong";
          break;
      }
      showErrorAlert("", message);
    }
  }, [
    saveUserBasicDetailStatus,
    updateUserBasicDetailStatus,
    deleteUserBasicDetailStatus
  ]);

  useEffect(() => {
    if (
      saveUserContactDetailStatus === API_STATUS.SUCCESS ||
      updateUserContactDetailStatus === API_STATUS.SUCCESS ||
      deleteUserContactDetailStatus === API_STATUS.SUCCESS
    ) {
      dispatch(searchUserContactDetails({ userID: userId }));
      onClose();
      let message = "";

      switch (formType) {
        case "delete":
          message = "Contact details deleted successfully";
          break;
        case "edit":
          message = "Contact details updated successfully";
          break;
        case "create":
          message = "Contact details created successfully";
          break;
        default:
          message = "Contact details action completed successfully";
          break;
      }

      showSuccessAlert("", message);
    } else if (
      saveUserContactDetailStatus === API_STATUS.FAILED ||
      updateUserContactDetailStatus === API_STATUS.FAILED ||
      deleteUserContactDetailStatus === API_STATUS.FAILED
    ) {
      let message = "";

      switch (formType) {
        case "delete":
          message = deleteUserContactDetailRes;
          break;
        case "edit":
          message = updateUserContactDetailRes;
          break;
        case "create":
          message = saveUserContactDetailRes;
          break;
      }
      showErrorAlert("", message);
    }
  }, [
    saveUserContactDetailStatus,
    updateUserContactDetailStatus,
    deleteUserContactDetailStatus
  ]);

  useEffect(() => {
    if (
      saveUserQualificationStatus === API_STATUS.SUCCESS ||
      updateUserQualificationStatus === API_STATUS.SUCCESS ||
      deleteUserQualificationStatus === API_STATUS.SUCCESS
    ) {
      dispatch(searchUserQualifications({ userID: userId }));
      onClose();

      let message = "";

      switch (formType) {
        case "delete":
          message = "Qualification details deleted successfully";
          break;
        case "edit":
          message = "Qualification details updated successfully";
          break;
        case "create":
          message = "Qualification details created successfully";
          break;
        default:
          message = "Qualification details action completed successfully";
          break;
      }
      showSuccessAlert("", message);
    } else if (
      saveUserQualificationStatus === API_STATUS.FAILED ||
      updateUserQualificationStatus === API_STATUS.FAILED ||
      deleteUserQualificationStatus === API_STATUS.FAILED
    ) {
      let message = "";

      switch (formType) {
        case "delete":
          message = deleteUserQualificationRes;
          break;
        case "edit":
          message = updateUserQualificationRes;
          break;
        case "create":
          message = saveUserQualificationRes;
          break;
      }
      showErrorAlert("", message);
    }
  }, [
    saveUserQualificationStatus,
    updateUserQualificationStatus,
    deleteUserQualificationStatus
  ]);

  useEffect(() => {
    if (userId) {
      dispatch(searchUserBasicDetails({ userID: userId }));
      dispatch(searchUserContactDetails({ userID: userId }));
      dispatch(searchUserQualifications({ userID: userId }));
    }
  }, [userId]);

  const handleDelete = (type, item = null) => {
    dispatch(setAlertDialog({ open: false }));
    switch (type) {
      case "basic":
        dispatch(
          deleteUserBasicDetails(
            searchUserBasicDetailRes?.data?.userDetails[0]?.userBasicDetailID
          )
        );

        break;
      case "contact":
        dispatch(
          deleteUserContactDetails(
            searchUserContactDetailRes?.data?.userDetails[0]
              ?.userContactDetailID
          )
        );
        break;
      case "qualifications":
        dispatch(deleteUserQualifications(item?.userQualificationDetailID));
        break;
    }
  };

  const handleModalEvent = (type, formType) => {
    setFormType(formType);
    setModalType(type);
    if (formType === "delete") {
      dispatch(
        setAlertDialog(
          createStatusAlert(
            ALERT_TYPE.CONFIRM,
            "",
            `Are you sure want to delete ${
              type === "basic"
                ? "profile information"
                : type === "contact"
                ? "contact information"
                : "qualifications"
            }?`,
            () => handleDelete(type)
          )
        )
      );
      return;
    }
    onOpen();
  };

  const handleItemEdit = (index) => {
    setSelectedItem(
      searchUserQualificationRes?.data?.userDetails?.find(
        (item, i) => i === index
      )
    );
    handleModalEvent("qualifications", "edit");
  };

  const handleItemDelete = (index) => {
    const item = searchUserQualificationRes?.data?.userDetails?.find(
      (item, i) => i === index
    );
    setSelectedItem(item);

    dispatch(
      setAlertDialog(
        createStatusAlert(
          ALERT_TYPE.CONFIRM,
          "",
          "Are you sure want to delete qualification?",
          () => handleDelete("qualifications", item)
        )
      )
    );
  };

  const formTitle = useMemo(() => {
    switch (modalType) {
      case "basic":
        return "Profile Information";
      case "contact":
        return "Contact Information";
      case "qualifications":
        return `${formType === "create" ? "Add" : "Edit"} Qualifications`;
    }
  }, [modalType]);

  const formLoading = useMemo(() => {
    switch (modalType) {
      case "basic":
        return saveUserBasicDetailLoading || updateUserBasicDetailLoading;
      case "contact":
        return saveUserContactDetailLoading || updateUserContactDetailLoading;
      case "qualifications":
        return saveUserQualificationLoading || updateUserQualificationLoading;
    }
  }, [
    modalType,
    saveUserBasicDetailLoading,
    updateUserBasicDetailLoading,
    saveUserContactDetailLoading,
    updateUserContactDetailLoading,
    saveUserQualificationLoading,
    updateUserQualificationLoading
  ]);

  const showDetailValue = (value) => {
    switch (value) {
      case "basic":
        return { ...searchUserBasicDetailRes?.data?.userDetails[0] };
      case "contact":
        return { ...searchUserContactDetailRes?.data?.userDetails[0] };
      case "qualifications":
        return searchUserQualificationRes?.data?.userDetails
          ? [...searchUserQualificationRes.data.userDetails]
          : [];
    }
  };

  const showLoading = (value) => {
    switch (value) {
      case "basic":
        return searchUserBasicDetailLoading;
      case "contact":
        return searchUserContactDetailLoading;
      case "qualifications":
        return searchUserQualificationLoading;
    }
  };

  return (
    <React.Fragment>
      <div className="flex flex-row h-[calc(100svh-6.25rem)]">
        <UserSideBar />
        <div className="pt-10 px-5 w-full overflow-y-auto">
          {UserSections.map((section) => (
            <CardWithHeader
              key={section.type}
              id={section.type}
              data={
                formatProfile(showDetailValue(section.type), section.type) || []
              }
              isEditable={hasCrudPermission && !section.customView}
              isCustomView={section.customView}
              isDeletable={hasCrudPermission && !section.customView}
              isCreatable={
                hasCrudPermission &&
                section.type === "qualifications" &&
                searchUserQualificationRes?.data?.canCreateQualification
                  ? true
                  : section.type !== "qualifications"
                  ? true
                  : false
              }
              title={section.title}
              handleEdit={() => handleModalEvent(section.type, "edit")}
              handleCreate={() => handleModalEvent(section.type, "create")}
              handleDelete={() => handleModalEvent(section.type, "delete")}
              handleItemEdit={handleItemEdit}
              handleItemDelete={handleItemDelete}
              buttonTitle={section.buttonLabel}
              loader={showLoading(section.type)}
              separateValueKey="communicationTypeName"
              hasCrudPermission={hasCrudPermission}
            />
          ))}
        </div>
      </div>

      <FormModalWrapper
        title={formTitle}
        onClose={onClose}
        isOpen={isOpen}
        innerRef={submitRef}
        formType={formType}
        loading={formLoading}
      >
        {modalType === "basic" && (
          <UserBasicForm
            isOpen={isOpen}
            innerRef={submitRef}
            formType={formType}
            userId={userId}
            formData={{ ...searchUserBasicDetailRes?.data?.userDetails[0] }}
          />
        )}
        {modalType === "contact" && (
          <UserContactForm
            formData={{ ...searchUserContactDetailRes?.data?.userDetails[0] }}
            isOpen={isOpen}
            innerRef={submitRef}
            formType={formType}
            userId={userId}
            additionalFormData={{
              ...searchUserBasicDetailRes?.data?.userDetails[0]
            }}
          />
        )}
        {modalType === "qualifications" && (
          <UserQualificationsForm
            data={selectedItem}
            isOpen={isOpen}
            innerRef={submitRef}
            formType={formType}
            userId={userId}
            reservedQualificationTypes={
              searchUserQualificationRes?.data?.userDetails?.map(
                (item) => item?.qualificationTypeID
              ) || []
            }
          />
        )}
      </FormModalWrapper>

      <AttachementPreview />
    </React.Fragment>
  );
};

export default UserProfile;
