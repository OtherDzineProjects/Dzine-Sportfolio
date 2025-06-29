/* eslint-disable no-console */
import { useEffect, useCallback, useRef, useState } from "react";
import _ from "lodash";

const useInfinteScroll = ({ api = () => {}, initialData = [] }) => {
  const [items, setItems] = useState(initialData),
    [isLoading, setIsLoading] = useState(false),
    [page, setPage] = useState(2),
    [hasMore, setHasMore] = useState(true),
    loaderRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const response = await api(page);
        setHasMore(response?.data?.data?.totalCount >= items?.length);
        setItems(response.data?.data?.organizationListDetails);
      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    };

    getData();
  }, []);

  const fetchData = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);
    await api(page)
      .then((res) => {
        setItems((prevItems) =>
          _.unionBy(
            [...prevItems, ...res.data.data.organizationListDetails],
            "id"
          )
        );
        setHasMore(res?.data?.data?.totalCount > items?.length);
      })
      .catch((err) => {
        console.error(err);
      });

    setPage((prevPage) => prevPage + 1);
    setIsLoading(false);
  }, [page, isLoading]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting) fetchData();
    });

    if (loaderRef.current) observer.observe(loaderRef.current);

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [fetchData]);

  return { items, isLoading, loaderRef };
};

export default useInfinteScroll;
