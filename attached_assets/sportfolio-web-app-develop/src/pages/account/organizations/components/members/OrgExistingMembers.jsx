import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import { useEffect } from "react";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { fetchExistingOrgMembers } from "../../api";
import Pagination from "common/components/Table/Pagination";
import NoData from "common/components/NoData/NoData";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import OrgMiniCard from "../../organization-sections/ui/OrgMiniCard";

export default function OrgExistingMembers({ orgID, currentTab = false }) {
  const dispatch = useDispatch(),
    { fetchExistingOrgMembersRes, fetchExistingOrgMembersLoading } =
      useSelector((state) => state.org),
    [searchParams] = useSearchParams(),
    navigate = useNavigate();

  const onPageClick = (data) => {
    if (!currentTab) return;
    navigate(
      `?tab=existing&page=${data}&pageSize=${searchParams.get("pageSize")}`
    );
  };

  useEffect(() => {
    if (!currentTab) return;
    dispatch(
      fetchExistingOrgMembers({
        query: `?page=${searchParams.get("page") || 1}&pageSize=${
          searchParams.get("pageSize") || 12
        }`,
        data: { organizationID: orgID }
      })
    );
  }, [searchParams, currentTab]);

  return (
    <Fragment>
      {fetchExistingOrgMembersLoading ? (
        <FullscreenLoader />
      ) : (
        <Fragment>
          {fetchExistingOrgMembersRes?.data?.organizationMemberDetails?.length >
          0 ? (
            <section className="grid grid-cols-[repeat(auto-fit,minmax(18rem,_1fr))] md:grid-cols-[repeat(auto-fit,minmax(18rem,_0.25fr))] gap-4">
              {fetchExistingOrgMembersRes?.data?.organizationMemberDetails.map(
                (member) => (
                  <OrgMiniCard
                    key={member?.organizationmemberID}
                    item={member}
                    id={member?.userId}
                    orgID={orgID}
                  />
                )
              )}
            </section>
          ) : (
            <NoData />
          )}

          <Pagination
            className="pagination-bar"
            currentPage={Number(searchParams.get("page"))}
            totalCount={fetchExistingOrgMembersRes?.data?.totalCount}
            pageSize={Number(searchParams.get("pageSize"))}
            onPageChange={onPageClick}
            numberOfElements={fetchExistingOrgMembersRes?.data?.count}
          />
        </Fragment>
      )}
    </Fragment>
  );
}
