import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getNotificationCounts,
  searchNotifications,
  updateNotificationStatus
} from "../../api";
import { Fragment } from "react";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import Pagination from "common/components/Table/Pagination";
import NotificationListItem from "../ui/NotificationListItem";
import ActionModal from "pages/account/organizations/organization-sections/ActionModal";
import { useDisclosure } from "common";
import { useState } from "react";
import NoData from "common/components/NoData/NoData";
import { API_STATUS } from "pages/common/constants";
import useSuccessAlert from "hooks/useSuccessAlert";
import useErrorAlert from "hooks/useErrorAlert";
import { clearNotificationFormState } from "../../slice";

export default function NotificationAwaiting({ currentTab = false }) {
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    [searchParams] = useSearchParams(),
    [selectedItem, setSelectedItem] = useState(undefined),
    { isOpen, onOpen, onClose } = useDisclosure(),
    successAlert = useSuccessAlert(),
    errorAlert = useErrorAlert(),
    {
      searchNotificationsRes,
      searchNotificationsLoading,
      updateNotificationStatusRes,
      updateNotificationStatusLoading,
      updateNotificationStatusStatus
    } = useSelector((state) => state.notify);

  useEffect(() => {
    if (!currentTab) return;
    dispatch(
      searchNotifications({
        data: { type: "A" },
        query: `?page=${searchParams.get("page") || 1}&pageSize=${
          searchParams.get("pageSize") || 12
        }`
      })
    );
  }, [searchParams, currentTab]);

  useEffect(() => {
    if (updateNotificationStatusStatus === API_STATUS.SUCCESS) {
      if (updateNotificationStatusRes?.data?.isApproved) {
        dispatch(getNotificationCounts());
      }
      successAlert("", "Notification updated successfully");
      dispatch(clearNotificationFormState());

      onClose();

      if (!currentTab) return;
      dispatch(
        searchNotifications({
          data: { type: "A" },
          query: `?page=${searchParams.get("page") || 1}&pageSize=${
            searchParams.get("pageSize") || 12
          }`
        })
      );
    } else if (updateNotificationStatusStatus === API_STATUS.FAILED) {
      errorAlert(
        "",
        updateNotificationStatusRes || "Error in updating notification"
      );
    }
  }, [updateNotificationStatusStatus]);

  const onPageClick = (data) => {
    navigate(
      `?tab=awaiting&page=${data}&pageSize=${
        searchParams.get("pageSize") || 12
      }`
    );
  };

  const onActionClick = (item) => {
    setSelectedItem(item);
    onOpen();
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
                      includeActionButton
                      onActionClick={() => onActionClick(item)}
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
            <NoData />
          )}
        </Fragment>
      )}

      <ActionModal
        isOpen={isOpen}
        type="notification"
        onClose={onClose}
        selectedStatus={selectedItem?.statusID}
        organizationMemberID={selectedItem?.organizationmemberID}
        title={`${selectedItem?.subject || ""}`}
        onSubmitForm={(data) =>
          dispatch(
            updateNotificationStatus({
              statusID: data?.statusID,
              notificationID: selectedItem?.id,
              notes: data?.notes
            })
          )
        }
        loading={updateNotificationStatusLoading}
      />
    </Fragment>
  );
}
