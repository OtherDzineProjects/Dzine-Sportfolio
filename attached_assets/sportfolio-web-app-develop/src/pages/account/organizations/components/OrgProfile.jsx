import { useEffect, useState, Fragment, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  deleteOrganizationActivity,
  getOrgByID,
  getOrgPermissions,
  searchOrganizationActivity
} from "../api";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import { API_STATUS } from "pages/common/constants";
import "./style.css";
import { Button, Typography, useDisclosure } from "common";
import { colors } from "utils/colors";
import { Delete, DownArrow, Edit } from "assets/InputIcons";
import CardWithHeader from "common/components/Cards/CardWithHeader";
import { formatProfile } from "./helper";
import { CardWithHeaderWrapper } from "common/components/Cards/CardWithHeaderWrapper";
import SpecialLabelValues from "common/components/Cards/SpecialLabelValues";
import { FormModalWrapper } from "common/components/Modal/FormModalWrapper";
import OrganizationBasicForm from "./profile/OrganizationBasicForm";
import OrganizationAboutForm from "./profile/OrganizationAboutForm";
import OrganizationActivitiesForm from "./profile/OrganizationActivitiesForm";
import { RichTextViewer } from "common/components/rich-text/RichTextViewer";
import { setAlertDialog } from "pages/common/slice";
import {
  resetOrganizationDetails,
  resetOrganizationFormActions
} from "../slice";
import useSuccessAlert from "hooks/useSuccessAlert";
import useErrorAlert from "hooks/useErrorAlert";
import useConfirmAlert from "hooks/useConfirmAlert";
import OrgWrapper from "./layout/OrgWrapper";

const OrgProfile = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const {
    getOrgByIDLoading,
    getOrgByIDRes,
    getOrgByIDStatus,
    searchOrganizationActivityRes,
    updateOrgStatus,
    updateOrgRes,
    updateOrgLoading,
    saveOrganizationActivityRes,
    saveOrganizationActivityStatus,
    saveOrganizationActivityLoading,
    deleteOrganizationActivityRes,
    deleteOrganizationActivityStatus,
    getOrgPermissionsRes
  } = useSelector((state) => state.org);

  const [modalType, setModalType] = useState(""),
    [formType, setFormType] = useState("create"),
    [selectedItem, setSelectedItem] = useState(null),
    submitRef = useRef(),
    { isOpen, onOpen, onClose } = useDisclosure();

  const showSuccessAlert = useSuccessAlert(),
    showErrorAlert = useErrorAlert(),
    showConfirmAlert = useConfirmAlert();

  useEffect(() => {
    return () => {
      dispatch(resetOrganizationDetails());
      dispatch(resetOrganizationFormActions());
    };
  }, []);

  useEffect(() => {
    if (params?.orgId) {
      dispatch(getOrgByID(params.orgId));
      dispatch(
        searchOrganizationActivity({
          organizationID: params.orgId
        })
      );
      dispatch(getOrgPermissions(params.orgId));
    }
  }, [params?.orgId]);

  const hasCrudPermission = useMemo(
    () => (getOrgPermissionsRes?.data?.[0]?.canEdit ? true : false),
    [getOrgPermissionsRes]
  );

  useEffect(() => {
    if (updateOrgStatus === API_STATUS.SUCCESS) {
      dispatch(getOrgByID(params.orgId));
      onClose();
      showSuccessAlert(
        "",
        `Organization ${
          modalType === "basic" ? "basic" : "about"
        } data updated successfully`
      );
    } else if (updateOrgStatus === API_STATUS.FAILED) {
      showErrorAlert("", updateOrgRes || "Something went wrong");
    }
  }, [updateOrgStatus]);

  useEffect(() => {
    if (saveOrganizationActivityStatus === API_STATUS.SUCCESS) {
      dispatch(
        searchOrganizationActivity({
          organizationID: params.orgId
        })
      );
      onClose();
      showSuccessAlert("", "Organization activites updated successfully");
    } else if (saveOrganizationActivityStatus === API_STATUS.FAILED) {
      showErrorAlert("", saveOrganizationActivityRes || "Something went wrong");
    }
  }, [saveOrganizationActivityStatus]);

  useEffect(() => {
    if (deleteOrganizationActivityStatus === API_STATUS.SUCCESS) {
      dispatch(
        searchOrganizationActivity({
          organizationID: params.orgId
        })
      );
      onClose();
      showSuccessAlert("", "Organization activites deleted successfully");
    } else if (deleteOrganizationActivityStatus === API_STATUS.FAILED) {
      showErrorAlert(
        "",
        deleteOrganizationActivityRes || "Something went wrong"
      );
    }
  }, [deleteOrganizationActivityStatus]);

  useEffect(() => {
    return () => {
      setModalType("");
      setFormType("");
      dispatch(setAlertDialog(null));
      onClose();
    };
  }, []);

  const handleDelete = () => {
    dispatch(deleteOrganizationActivity(params.orgId));
    dispatch(setAlertDialog({ open: false }));
  };

  const handleModalEvent = (type, formType, body = null) => {
    setFormType(formType);
    setModalType(type);
    setSelectedItem(body);
    if (formType === "delete") {
      showConfirmAlert("", "Are you sure want to delete activities?", () =>
        handleDelete()
      );
      return;
    }
    onOpen();
  };

  const AboutHeaderSection = useMemo(
    () =>
      hasCrudPermission && (
        <div className="flex gap-4 items-center">
          {getOrgByIDRes?.data?.[0]?.about ? (
            <Button
              onClick={() => handleModalEvent("about", "edit")}
              leftIcon={<Edit width="16px" height="16px" />}
              size="xs"
            >
              Edit
            </Button>
          ) : (
            <Button
              onClick={() => handleModalEvent("about", "create")}
              size="s"
              fontSize={12}
              className="px-4 py-2"
            >
              Add new
            </Button>
          )}
        </div>
      ),
    [getOrgByIDRes]
  );

  const organizationBasicDetails = useMemo(
    () =>
      getOrgByIDRes?.data?.length > 0
        ? formatProfile(getOrgByIDRes.data[0])
        : [],
    [getOrgByIDRes]
  );

  const selectedIDs = useMemo(
    () =>
      searchOrganizationActivityRes?.data?.organizationDetails?.length > 0
        ? [...searchOrganizationActivityRes.data.organizationDetails].map(
            (item) => item.activityID
          )
        : [],
    [searchOrganizationActivityRes]
  );

  const formTitle = useMemo(() => {
    switch (modalType) {
      case "basic":
        return "Basic Information";
      case "activities":
        return "Activities";
      case "about":
        return "About Organization";
    }
  }, [modalType]);

  const formLoading = useMemo(() => {
    switch (modalType) {
      case "basic":
        return updateOrgLoading;
      case "activities":
        return saveOrganizationActivityLoading;
      case "about":
        return updateOrgLoading;
    }
  }, [modalType, updateOrgLoading, saveOrganizationActivityLoading]);

  return (
    <Fragment>
      <OrgWrapper>
        {getOrgByIDLoading ? (
          <FullscreenLoader />
        ) : (
          <Fragment>
            {getOrgByIDStatus === API_STATUS.SUCCESS && (
              <div className="py-10 px-5 w-full overflow-y-auto">
                <CardWithHeaderWrapper
                  id="about"
                  title="About Organization"
                  headerSection={AboutHeaderSection}
                >
                  {getOrgByIDRes?.data?.[0].about ? (
                    <RichTextViewer
                      content={getOrgByIDRes?.data?.[0].about || ""}
                    />
                  ) : (
                    <Typography
                      type="p"
                      text="No Organization Info Added"
                      size="sm"
                      className="text-center mx-auto"
                    />
                  )}
                </CardWithHeaderWrapper>

                <CardWithHeaderWrapper
                  id="activities"
                  title="Activities"
                  headerSection={
                    hasCrudPermission && (
                      <header className="flex items-center flex-wrap gap-4">
                        {searchOrganizationActivityRes?.data
                          ?.organizationDetails?.length > 0 && (
                          <Button
                            onClick={() =>
                              handleModalEvent("activities", "delete")
                            }
                            leftIcon={
                              <Delete
                                width="16px"
                                height="16px"
                                color={colors.white}
                              />
                            }
                            size="xs"
                            colorScheme="red"
                          >
                            Delete
                          </Button>
                        )}
                        <Button
                          onClick={() =>
                            handleModalEvent("activities", "create")
                          }
                          size="s"
                          fontSize={12}
                          className="px-4 py-2"
                        >
                          Add new
                        </Button>
                      </header>
                    )
                  }
                >
                  <div className="w-full flex flex-wrap gap-6 mt-2">
                    {Array.isArray(
                      searchOrganizationActivityRes?.data?.organizationDetails
                    ) &&
                    searchOrganizationActivityRes.data.organizationDetails
                      ?.length > 0 ? (
                      searchOrganizationActivityRes.data.organizationDetails?.map(
                        (item, index) => (
                          <div
                            key={`${item?.id}-${index}`}
                            className="flex flex-col items-center gap-y-2"
                          >
                            {item.parentActivities?.map((activity, i) => (
                              <Fragment key={`${activity?.ActivityId}-${i}`}>
                                <SpecialLabelValues
                                  data={activity}
                                  displayKey="ActivityName"
                                  includeLabel={false}
                                  icon={
                                    i === 1 && (
                                      <div
                                        onClick={() =>
                                          handleModalEvent(
                                            "activities",
                                            "edit",
                                            {
                                              parentID:
                                                item?.parentActivities[0]
                                                  ?.ActivityId,
                                              activityID: activity?.ActivityId
                                            }
                                          )
                                        }
                                        className="cursor-pointer"
                                        title="Edit"
                                      >
                                        <Edit width="16px" height="16px" />
                                      </div>
                                    )
                                  }
                                />
                                {i !== item.parentActivities.length - 1 && (
                                  <DownArrow />
                                )}
                              </Fragment>
                            ))}

                            <DownArrow />
                            <SpecialLabelValues
                              data={item}
                              displayKey="activityName"
                              includeLabel={false}
                              icon={
                                item?.parentActivities?.length === 1 && (
                                  <div
                                    onClick={() =>
                                      handleModalEvent("activities", "edit", {
                                        parentID:
                                          item?.parentActivities[0]?.ActivityId,
                                        activityID: item?.activityID
                                      })
                                    }
                                    className="cursor-pointer"
                                    title="Edit"
                                  >
                                    <Edit width="16px" height="16px" />
                                  </div>
                                )
                              }
                            />
                          </div>
                        )
                      )
                    ) : (
                      <Typography
                        type="p"
                        text="No Activites Added"
                        size="sm"
                        className="text-center mx-auto"
                      />
                    )}
                  </div>
                </CardWithHeaderWrapper>

                <CardWithHeader
                  id="basic"
                  data={organizationBasicDetails}
                  title="Basic Information"
                  isEditable={
                    hasCrudPermission && organizationBasicDetails.length > 0
                  }
                  handleEdit={() => handleModalEvent("basic", "edit")}
                  handleCreate={() => handleModalEvent("basic", "create")}
                  buttonTitle="Add Basic Details"
                />
              </div>
            )}
          </Fragment>
        )}
      </OrgWrapper>

      <FormModalWrapper
        title={formTitle}
        onClose={onClose}
        isOpen={isOpen}
        innerRef={submitRef}
        formType={formType}
        loading={formLoading}
      >
        {modalType === "about" && (
          <OrganizationAboutForm
            isOpen={isOpen}
            innerRef={submitRef}
            formType={formType}
            organizationId={params?.orgId}
            formData={{ ...getOrgByIDRes?.data?.[0] }}
            loading={updateOrgLoading}
          />
        )}
        {modalType === "activities" && (
          <OrganizationActivitiesForm
            isOpen={isOpen}
            organizationID={params?.orgId}
            innerRef={submitRef}
            formType={formType}
            formData={selectedItem}
            selectedIDs={selectedIDs}
          />
        )}
        {modalType === "basic" && (
          <OrganizationBasicForm
            isOpen={isOpen}
            innerRef={submitRef}
            formType={formType}
            organizationId={params?.orgId}
            formData={{ ...getOrgByIDRes?.data?.[0] }}
            loading={updateOrgLoading}
          />
        )}
      </FormModalWrapper>
    </Fragment>
  );
};

export default OrgProfile;
