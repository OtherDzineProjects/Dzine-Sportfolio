import DynamicDrawer from "common/components/Drawer/Drawer";
import Pagination from "common/components/Table/Pagination";
import { Typography } from "common";
import { colors } from "utils/colors";
import { useState } from "react";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { searchExistingOrgMembers } from "../../api";
import { setShowMemberRoleModal } from "../../slice";
import OrgMemberRoleForm from "../OrgMemberRoleForm";
import OrgOwnerAdminCard from "./OrgOwnerAdminCard";

export default function OrgMemberRoleDrawer({ orgID }) {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState(null);
  const dispatch = useDispatch();
  const {
    searchExistingOrgMembersRes,
    searchExistingOrgMembersLoading,
    showMemberRoleModal
  } = useSelector((state) => state.org);

  const onPageClick = (pg) => {
    setPage(pg);

    dispatch(
      searchExistingOrgMembers({
        query: `?page=${pg}&pageSize=12`,
        data: { ...formData, organizationID: orgID }
      })
    );
  };

  const handleSubmit = (data) => {
    setPage(1);
    setFormData(data);
    dispatch(
      searchExistingOrgMembers({
        query: `?page=${page}&pageSize=12`,
        data: { ...data, organizationID: orgID }
      })
    );
  };

  return (
    <DynamicDrawer
      isOpen={showMemberRoleModal}
      placement="right"
      onClose={() => dispatch(setShowMemberRoleModal(false))}
      size="lg"
      title="Search Members"
      hideMinimalAdvancedButtons
    >
      <OrgMemberRoleForm
        searchMembers={handleSubmit}
        loading={searchExistingOrgMembersLoading}
      />
      <div className="mt-4">
        {searchExistingOrgMembersLoading ? (
          <FullscreenLoader height="180px" />
        ) : (
          <section>
            {searchExistingOrgMembersRes?.data?.organizationMemberDetails
              ?.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <Typography
                  text="No members found"
                  type="p"
                  size="sm"
                  color={colors.gray}
                />
              </div>
            ) : (
              <div className="grid  grid-cols-[repeat(auto-fit,minmax(18rem,_1fr))] md:grid-cols-[repeat(auto-fit,minmax(18rem,_0.25fr))] gap-4">
                {searchExistingOrgMembersRes?.data?.organizationMemberDetails.map(
                  (member, index) => (
                    <OrgOwnerAdminCard
                      member={member}
                      key={`${member?.userId}-${index}`}
                    />
                  )
                )}
              </div>
            )}
            <Pagination
              className="pagination-bar"
              currentPage={Number(page)}
              totalCount={searchExistingOrgMembersRes?.data?.totalCount}
              pageSize={12}
              onPageChange={onPageClick}
              numberOfElements={searchExistingOrgMembersRes?.data?.count}
            />
            {searchExistingOrgMembersRes?.data?.totalCount <= 12 &&
              searchExistingOrgMembersRes?.data?.length > 0 && (
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
