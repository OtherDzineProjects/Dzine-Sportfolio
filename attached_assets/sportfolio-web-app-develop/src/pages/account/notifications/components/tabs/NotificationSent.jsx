import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  deleteNotification,
  getNotificationCounts,
  searchNotifications
} from "../../api";
import { useSelector } from "react-redux";
import { Fragment } from "react";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import Pagination from "common/components/Table/Pagination";
import { FormModalWrapper } from "common/components/Modal/FormModalWrapper";
import {
  clearNotificationFormState,
  setNewNotificationCreateDialog
} from "../../slice";
import { useMemo } from "react";
import { useState } from "react";
import { useRef } from "react";
import NewNotificationForm from "../NewNotificationForm";
import { EmptyFallback } from "common/components/Cards/EmptyFallback";
import useSuccessAlert from "hooks/useSuccessAlert";
import useErrorAlert from "hooks/useErrorAlert";
import { API_STATUS } from "pages/common/constants";
import NotificationListItem from "../ui/NotificationListItem";
import useConfirmAlert from "hooks/useConfirmAlert";

export default function NotificationSent({ currentTab = false }) {
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    [searchParams] = useSearchParams(),
    submitRef = useRef(null),
    [formType, setFormType] = useState("create"),
    [selectedItem, setSelectedItem] = useState(undefined),
    {
      searchNotificationsRes,
      searchNotificationsLoading,
      newNotificationCreateDialog,
      updateNotificationRes,
      updateNotificationLoading,
      updateNotificationStatus,
      createNotificationRes,
      createNotificationLoading,
      createNotificationStatus,
      deleteNotificationRes,
      deleteNotificationStatus
    } = useSelector((state) => state.notify),
    successAlert = useSuccessAlert(),
    errorAlert = useErrorAlert(),
    confirmAlert = useConfirmAlert();

  useEffect(() => {
    if (createNotificationStatus === API_STATUS.SUCCESS) {
      successAlert("", "Notification created successfully");
      dispatch(setNewNotificationCreateDialog(false));
      dispatch(getNotificationCounts());
      if (!currentTab) return;
      dispatch(
        searchNotifications({
          data: { type: "S" },
          query: `?page=${searchParams.get("page") || 1}&pageSize=${
            searchParams.get("pageSize") || 12
          }`
        })
      );
      dispatch(clearNotificationFormState());
    } else if (createNotificationStatus === API_STATUS.FAILED) {
      errorAlert("", createNotificationRes || "Error in creating notification");
    }
  }, [createNotificationStatus]);

  useEffect(() => {
    if (updateNotificationStatus === API_STATUS.SUCCESS) {
      successAlert("", "Notification updated successfully");
      dispatch(setNewNotificationCreateDialog(false));
      dispatch(getNotificationCounts());
      if (!currentTab) return;
      dispatch(
        searchNotifications({
          data: { type: "S" },
          query: `?page=${searchParams.get("page") || 1}&pageSize=${
            searchParams.get("pageSize") || 12
          }`
        })
      );
      dispatch(clearNotificationFormState());
    } else if (updateNotificationStatus === API_STATUS.FAILED) {
      errorAlert("", updateNotificationRes || "Error in updating notification");
    }
  }, [updateNotificationStatus]);

  useEffect(() => {
    if (deleteNotificationStatus === API_STATUS.SUCCESS) {
      successAlert("", "Notification deleted successfully");
      dispatch(getNotificationCounts());
      dispatch(
        searchNotifications({
          data: { type: "S" },
          query: `?page=${searchParams.get("page") || 1}&pageSize=${
            searchParams.get("pageSize") || 12
          }`
        })
      );
      dispatch(clearNotificationFormState());
    } else if (deleteNotificationStatus === API_STATUS.FAILED) {
      errorAlert("", deleteNotificationRes || "Error in deleting notification");
    }
  }, [deleteNotificationStatus]);

  useEffect(() => {
    if (!currentTab) return;
    dispatch(
      searchNotifications({
        data: { type: "S" },
        query: `?page=${searchParams.get("page") || 1}&pageSize=${
          searchParams.get("pageSize") || 12
        }`
      })
    );

    return () => {
      setFormType("create");
    };
  }, [searchParams, currentTab]);

  useEffect(() => {
    if (!newNotificationCreateDialog) {
      setFormType("create");
      setSelectedItem(undefined);
    }
  }, [newNotificationCreateDialog]);

  const onPageClick = (data) => {
    navigate(
      `?tab=sent&page=${data}&pageSize=${searchParams.get("pageSize") || 12}`
    );
  };

  const formTitle = useMemo(
    () => (formType === "create" ? "Create Notification" : "Edit Notification"),
    [formType]
  );

  const onEditButtonClick = (item) => {
    setSelectedItem(item);
    setFormType("edit");
    dispatch(setNewNotificationCreateDialog(true));
  };
  const onDeleteButtonClick = (item) => {
    setSelectedItem(item);
    confirmAlert("", "Are you sure you want to delete?", () =>
      dispatch(deleteNotification(item?.id))
    );
  };

  return (
    <Fragment>
      {searchNotificationsLoading ? (
        <FullscreenLoader />
      ) : (
        <Fragment>
          {searchNotificationsRes?.data?.notificationDetails?.length > 0 ? (
            <Fragment>
              <section className="flex flex-col gap-2">
                {searchNotificationsRes?.data?.notificationDetails?.map(
                  (item) => (
                    <NotificationListItem
                      key={item?.id}
                      item={item}
                      shouldShowCrudButtons={!!item?.isEditable}
                      onEditButtonClick={() => onEditButtonClick(item)}
                      onDeleteButtonClick={() => onDeleteButtonClick(item)}
                    />
                  )
                )}
              </section>
              <Pagination
                className="pagination-bar"
                currentPage={Number(searchParams.get("page")) || 1}
                totalCount={searchNotificationsRes?.data?.totalCount}
                pageSize={Number(searchParams.get("pageSize")) || 12}
                onPageChange={onPageClick}
                numberOfElements={searchNotificationsRes?.data?.count}
              />
            </Fragment>
          ) : (
            <EmptyFallback
              handleCreate={() =>
                dispatch(setNewNotificationCreateDialog(true))
              }
              buttonTitle="Create"
            />
          )}
        </Fragment>
      )}

      <FormModalWrapper
        title={formTitle}
        onClose={() => dispatch(setNewNotificationCreateDialog(false))}
        isOpen={newNotificationCreateDialog}
        innerRef={submitRef}
        formType={formType}
        loading={createNotificationLoading || updateNotificationLoading}
        size="4xl"
      >
        <NewNotificationForm
          formType={formType}
          selectedItem={selectedItem}
          isOpen={newNotificationCreateDialog}
          innerRef={submitRef}
          loading={createNotificationLoading || updateNotificationLoading}
        />
      </FormModalWrapper>
    </Fragment>
  );
}
