import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import OrganizationCard from "common/components/Cards/OrganizationCard";
import NoData from "common/components/NoData/NoData";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import { searchOrg } from "../api";
import Pagination from "common/components/Table/Pagination";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getRandomColor } from "utils/common";
import { Fragment } from "react";
const MemberOrganizationView = ({ currentTab = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { searchOrgRes, searchOrgLoading } = useSelector((state) => state.org);

  useEffect(() => {
    if (!currentTab) return;
    dispatch(
      searchOrg({
        data: { type: "M" },
        query: `?page=${searchParams.get("page") || 1}&pageSize=${
          searchParams.get("pageSize") || 12
        }`
      })
    );
  }, [searchParams, currentTab]);

  const onPageClick = (data) => {
    navigate(`?page=${data}&pageSize=${searchParams.get("pageSize") || 12}`);
  };

  return (
    <Fragment>
      {searchOrgLoading ? (
        <FullscreenLoader />
      ) : (
        <Fragment>
          {!searchOrgRes?.data?.organizationDetails?.length ? (
            <NoData />
          ) : (
            <Fragment>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(20rem,_1fr))] md:grid-cols-[repeat(auto-fit,minmax(20rem,_0.25fr))] gap-4">
                {searchOrgRes?.data?.organizationDetails?.map((item) => (
                  <div key={item?.id}>
                    <OrganizationCard
                      data={item}
                      id={item?.id}
                      color={getRandomColor()}
                    />
                  </div>
                ))}
              </div>
              <Pagination
                className="pagination-bar"
                currentPage={Number(searchParams.get("page")) || 1}
                totalCount={searchOrgRes?.data?.totalCount}
                pageSize={Number(searchParams.get("pageSize")) || 12}
                onPageChange={onPageClick}
                numberOfElements={searchOrgRes?.data?.count}
              />
            </Fragment>
          )}
        </Fragment>
      )}
    </Fragment>
  );
};

export default MemberOrganizationView;
