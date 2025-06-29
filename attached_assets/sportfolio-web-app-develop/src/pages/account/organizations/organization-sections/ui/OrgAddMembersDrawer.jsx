import { Typography } from "common";
import { colors } from "utils/colors";
import OrgSearchMembersForm from "../OrgSearchMembersForm";
import { useState, useEffect } from "react";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import Pagination from "common/components/Table/Pagination";
import { useDispatch, useSelector } from "react-redux";
import { clearSearchUsersForOrg } from "../../slice";
import { searchUsersForOrg } from "../../api";
import { API_STATUS } from "pages/common/constants";
import useSuccessAlert from "hooks/useSuccessAlert";
import useErrorAlert from "hooks/useErrorAlert";
import DynamicDrawer from "common/components/Drawer/Drawer";
import OrgMiniCard from "./OrgMiniCard";

export default function OrgAddMembersDrawer({
  isOpen,
  onClose = () => {},
  orgID
}) {
  const dispatch = useDispatch(),
    {
      searchUsersForOrgRes,
      searchUsersForOrgLoading,
      inviteMemberStatus,
      inviteMemberRes
    } = useSelector((state) => state.org),
    [searchMode, setSearchMode] = useState("minimal"),
    [page, setPage] = useState(1),
    [formData, setFormData] = useState(null);

  const showSuccessAlert = useSuccessAlert(),
    showErrorAlert = useErrorAlert();

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

  useEffect(() => {
    if (inviteMemberStatus === API_STATUS.SUCCESS) {
      showSuccessAlert("", "Member invitation sent successfully");
      dispatch(clearSearchUsersForOrg());
      dispatch(
        searchUsersForOrg({
          data: { ...formData, organizationID: orgID },
          query: `?page=${page}&pageSize=12`
        })
      );
    } else if (inviteMemberStatus === API_STATUS.FAILED) {
      showErrorAlert("", inviteMemberRes || "Failed to invite member");
    }
  }, [inviteMemberStatus]);

  const handleSubmit = (data) => {
    setFormData(data);
    setPage(1);
    dispatch(
      searchUsersForOrg({
        data: { ...data, organizationID: orgID },
        query: `?page=1&pageSize=12`
      })
    );
  };

  const onPageClick = (pg) => {
    setPage(pg);
    dispatch(
      searchUsersForOrg({
        data: { ...formData, organizationID: orgID },
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
      title="Search Users"
      searchMode={searchMode}
      setSearchMode={setSearchMode}
    >
      <OrgSearchMembersForm
        searchMode={searchMode}
        searchMembers={handleSubmit}
        loading={searchUsersForOrgLoading}
      />

      <div className="mt-4">
        {searchUsersForOrgLoading ? (
          <FullscreenLoader height="180px" />
        ) : (
          <section>
            {searchUsersForOrgRes?.data?.memberDetails?.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <Typography
                  text="No users found"
                  type="p"
                  size="sm"
                  color={colors.gray}
                />
              </div>
            ) : (
              <div className="grid  grid-cols-[repeat(auto-fit,minmax(18rem,_1fr))] md:grid-cols-[repeat(auto-fit,minmax(18rem,_0.25fr))] gap-4">
                {searchUsersForOrgRes?.data?.memberDetails.map((member) => (
                  <OrgMiniCard
                    key={member?.UserID}
                    id={member?.UserID}
                    item={member}
                    searchMode
                    orgID={orgID}
                    showInviteButton
                  />
                ))}
              </div>
            )}
            <Pagination
              className="pagination-bar"
              currentPage={Number(page)}
              totalCount={searchUsersForOrgRes?.data?.totalCount}
              pageSize={12}
              onPageChange={onPageClick}
              numberOfElements={searchUsersForOrgRes?.data?.count}
            />
            {searchUsersForOrgRes?.data?.totalCount <= 12 &&
              searchUsersForOrgRes?.data?.length > 0 && (
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
