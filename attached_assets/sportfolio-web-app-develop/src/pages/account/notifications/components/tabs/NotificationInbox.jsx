import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { searchNotifications } from "../../api";
import { Fragment } from "react";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import Pagination from "common/components/Table/Pagination";
import NotificationCard from "common/components/Notification/NotificationCard";
import NoData from "common/components/NoData/NoData";
import { API_STATUS } from "pages/common/constants";

export default function NotificationInbox({ currentTab = false }) {
  const dispatch = useDispatch(),
    navigate = useNavigate(),
    [searchParams] = useSearchParams(),
    {
      searchNotificationsRes,
      searchNotificationsLoading,
      updateNotificationStatus,
      createNotificationStatus,
      deleteNotificationStatus
    } = useSelector((state) => state.notify);

  useEffect(() => {
    if (!currentTab) return;
    dispatch(
      searchNotifications({
        data: { type: "I" },
        query: `?page=${searchParams.get("page") || 1}&pageSize=${
          searchParams.get("pageSize") || 12
        }`
      })
    );
  }, [searchParams, currentTab]);

  useEffect(() => {
    if (
      (updateNotificationStatus === API_STATUS.SUCCESS ||
        createNotificationStatus === API_STATUS.SUCCESS ||
        deleteNotificationStatus === API_STATUS.SUCCESS) &&
      currentTab
    ) {
      dispatch(
        searchNotifications({
          data: { type: "I" },
          query: `?page=${searchParams.get("page") || 1}&pageSize=${
            searchParams.get("pageSize") || 12
          }`
        })
      );
    }
  }, [
    updateNotificationStatus,
    createNotificationStatus,
    deleteNotificationStatus
  ]);

  const onPageClick = (data) => {
    navigate(
      `?tab=inbox&page=${data}&pageSize=${searchParams.get("pageSize") || 12}`
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
              <section className="flex flex-col gap-4">
                {searchNotificationsRes?.data?.notificationDetails?.map(
                  (notification) => (
                    <NotificationCard
                      key={notification?.id}
                      data={notification}
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
    </Fragment>
  );
}
