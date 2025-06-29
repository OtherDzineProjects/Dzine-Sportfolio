import { Progress, Typography } from "common";
import "./styles.css";
import InviteOptionCheckbox from "./ui/InviteOptionCheckbox";
import { useEffect } from "react";
import { setNotifyOrganizationIds } from "../slice";
import { http } from "utils/http";
import { API_URL } from "common/url";
import { useState } from "react";
import _ from "lodash";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";

export default function NotificationInviteList() {
  const { notifyAll } = useSelector((state) => state.notify),
    dispatch = useDispatch();

  const [items, setItems] = useState([]),
    [page, setPage] = useState(1),
    [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadFunc();
  }, []);

  const fetchData = async (page) => {
    const response = await http.post(API_URL.ORGANIZATIONS.LIST, {
      page: page,
      pageSize: "12"
    });
    return response?.data;
  };

  const loadFunc = async () => {
    if (!hasMore || !page) return;
    const res = await fetchData(page);
    setHasMore(res?.data?.totalCount > items?.length);
    setItems((prevItems) =>
      _.unionBy([...prevItems, ...res.data.organizationListDetails], "id")
    );

    setPage(page + 1);
  };

  useEffect(() => {
    if (notifyAll)
      dispatch(setNotifyOrganizationIds([...items.map((item) => item.id)]));
  }, [notifyAll, items]);

  return (
    <article className="whom-to-invite-container">
      <Typography
        type="h6"
        text="Whom to invite?"
        size="sm"
        className="m-0 mb-2"
      />

      <section
        id="scrollableDiv"
        style={{
          width: "100%",
          height: items?.length > 0 ? "40svh" : "100%",
          overflowY: "auto",
          margin: "auto"
        }}
      >
        <InfiniteScroll
          dataLength={items?.length}
          next={loadFunc}
          hasMore={hasMore}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.325rem",
            overflowY: "auto"
          }}
          scrollableTarget="scrollableDiv"
          loader={
            <article className="flex flex-col mx-[25%] my-2">
              <Progress size="xs" isIndeterminate />
              <span className="text-center">Loading...</span>
            </article>
          }
        >
          <InviteOptionCheckbox
            name="Notify All"
            isNotifyAllButton={true}
            items={items}
          />
          {Array.isArray(items) &&
            items.map((item) => (
              <InviteOptionCheckbox
                name={item.name}
                key={item.id}
                id={item.id}
                last={items.length === items.indexOf(item) + 1}
              />
            ))}
        </InfiniteScroll>
      </section>
    </article>
  );
}
