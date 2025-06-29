import DynamicDrawer from "common/components/Drawer/Drawer";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import AdvancedOrgSearchForm from "../AdvancedOrgSearchForm";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import { Typography } from "common";
import { colors } from "utils/colors";
import Pagination from "common/components/Table/Pagination";
import { advancedSearchOrg } from "../../api";
import { useEffect } from "react";
import { clearSearchUsersForOrg } from "../../slice";
import OrgMiniCard from "./OrgMiniCard";

export default function AdvancedOrgSearchDrawer({
  isOpen,
  onClose = () => {}
}) {
  const dispatch = useDispatch(),
    { advancedSearchOrgRes, advancedSearchOrgLoading } = useSelector(
      (state) => state.org
    ),
    [searchMode, setSearchMode] = useState("minimal"),
    [page, setPage] = useState(1),
    [formData, setFormData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSearchMode("minimal");
      setFormData(null);
      setPage(1);
      dispatch(clearSearchUsersForOrg());
    }

    return () => {
      setSearchMode("minimal");
      setFormData(null);
      setPage(1);
      dispatch(clearSearchUsersForOrg());
    };
  }, [isOpen]);

  const handleSubmit = (data) => {
    setFormData(data);
    setPage(1);
    dispatch(
      advancedSearchOrg({
        data: { ...data },
        query: `?page=1&pageSize=12`
      })
    );
  };

  const onPageClick = (pg) => {
    setPage(pg);
    dispatch(
      advancedSearchOrg({
        data: { ...formData },
        query: `?page=${pg}&pageSize=12`
      })
    );
  };

  return (
    <DynamicDrawer
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      size="lg"
      title="Search Orgs"
      searchMode={searchMode}
      setSearchMode={setSearchMode}
    >
      <AdvancedOrgSearchForm
        searchMode={searchMode}
        searchOrgs={handleSubmit}
        loading={advancedSearchOrgLoading}
      />

      <div className="mt-4">
        {advancedSearchOrgLoading ? (
          <FullscreenLoader height="180px" />
        ) : (
          <section>
            {advancedSearchOrgRes?.data?.organizationDetails?.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <Typography
                  text="No organizations found"
                  type="p"
                  size="sm"
                  color={colors.gray}
                />
              </div>
            ) : (
              <div className="grid  grid-cols-[repeat(auto-fit,minmax(18rem,_1fr))] md:grid-cols-[repeat(auto-fit,minmax(18rem,_0.25fr))] gap-4">
                {advancedSearchOrgRes?.data?.organizationDetails.map((org) => (
                  <OrgMiniCard
                    key={org?.id}
                    id={org?.id}
                    item={org}
                    searchMode
                    type="org"
                  />
                ))}
              </div>
            )}
            <Pagination
              className="pagination-bar"
              currentPage={Number(page)}
              totalCount={advancedSearchOrgRes?.data?.totalCount}
              pageSize={12}
              onPageChange={onPageClick}
              numberOfElements={advancedSearchOrgRes?.data?.count}
            />
            {advancedSearchOrgRes?.data?.totalCount <= 12 &&
              advancedSearchOrgRes?.data?.length > 0 && (
                <div className="flex justify-center items-center h-full">
                  <Typography
                    text="------------------ You reached end of list ------------------"
                    type="p"
                    size="sm"
                    color={colors.dark}
                  />
                </div>
              )}
          </section>
        )}
      </div>
    </DynamicDrawer>
  );
}
