import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  changeMemberStatus,
  fetchOrgApplicationsMembers,
  getOrgMemberCount
} from "../../api";
import { Fragment } from "react";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import OrgMemberListItem from "../../organization-sections/ui/OrgMemberListItem";
import Pagination from "common/components/Table/Pagination";
import { useDisclosure } from "common";
import ActionModal from "../../organization-sections/ActionModal";
import NoData from "common/components/NoData/NoData";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { clearSearchUsersForOrg } from "../../slice";
import { API_STATUS } from "pages/common/constants";
import useSuccessAlert from "hooks/useSuccessAlert";
import useErrorAlert from "hooks/useErrorAlert";
import { useMemo } from "react";
import { STORAGE_KEYS } from "common/constants";
import { setAlertDialog } from "pages/common/slice";

export default function OrgAppliedMembers({ orgID, currentTab = false }) {
  const dispatch = useDispatch(),
    {
      fetchOrgApplicationsMembersRes,
      fetchOrgApplicationsMembersLoading,
      changeMemberStatusStatus,
      changeMemberStatusLoading,
      changeMemberStatusRes
    } = useSelector((state) => state.org),
    [selectedMember, setSelectedMember] = useState(null),
    { isOpen, onOpen, onClose } = useDisclosure(),
    [searchParams] = useSearchParams(),
    navigate = useNavigate();

  const showSuccessAlert = useSuccessAlert(),
    showErrorAlert = useErrorAlert();

  const onPageClick = (data) => {
    if (!currentTab) return;
    navigate(
      `?tab=applied&page=${data}&pageSize=${searchParams.get("pageSize")}`
    );
  };

  useEffect(() => {
    if (!currentTab) return;
    dispatch(
      fetchOrgApplicationsMembers({
        query: `?page=${searchParams.get("page")}&pageSize=${searchParams.get(
          "pageSize"
        )}`,
        data: { organizationID: orgID }
      })
    );

    return () => {
      setSelectedMember(null);
      onClose();
    };
  }, [searchParams, currentTab]);

  useEffect(() => {
    if (changeMemberStatusStatus === API_STATUS.SUCCESS && currentTab) {
      onClose();
      showSuccessAlert("", "Member status changed successfully", () => {
        dispatch(setAlertDialog(null));
        dispatch(clearSearchUsersForOrg());
        dispatch(getOrgMemberCount(orgID));
        dispatch(
          fetchOrgApplicationsMembers({
            query: `?page=${searchParams.get(
              "page"
            )}&pageSize=${searchParams.get("pageSize")}`,
            data: { organizationID: orgID }
          })
        );
      });
    } else if (changeMemberStatusStatus === API_STATUS.FAILED && currentTab) {
      showErrorAlert(
        changeMemberStatusRes || "Failed to change member status",
        () => {
          dispatch(setAlertDialog(null));
          dispatch(clearSearchUsersForOrg());
        }
      );
    }
  }, [changeMemberStatusStatus]);

  const onActionClick = (member) => {
    setSelectedMember(member);
    onOpen();
  };

  const currentUser = useMemo(
    () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)) || null,
    [localStorage.getItem(STORAGE_KEYS.USER)]
  );

  return (
    <Fragment>
      {fetchOrgApplicationsMembersLoading ? (
        <FullscreenLoader />
      ) : (
        <Fragment>
          {fetchOrgApplicationsMembersRes?.data?.organizationMemberDetails
            ?.length > 0 ? (
            <section className="flex flex-col gap-4">
              {fetchOrgApplicationsMembersRes?.data?.organizationMemberDetails.map(
                (member) => (
                  <OrgMemberListItem
                    key={member?.organizationmemberID}
                    member={member}
                    id={member?.userId}
                    tab="applied"
                    includeActionButton={currentUser?.id !== member?.userId}
                    onActionClick={() => onActionClick(member)}
                  />
                )
              )}
            </section>
          ) : (
            <NoData />
          )}

          <Pagination
            className="pagination-bar"
            currentPage={Number(searchParams.get("page")) || 1}
            totalCount={fetchOrgApplicationsMembersRes?.data?.totalCount}
            pageSize={Number(searchParams.get("pageSize")) || 12}
            onPageChange={onPageClick}
            numberOfElements={fetchOrgApplicationsMembersRes?.data?.count}
          />
        </Fragment>
      )}

      <ActionModal
        isOpen={isOpen}
        onClose={onClose}
        selectedStatus={selectedMember?.statusID}
        organizationMemberID={selectedMember?.organizationmemberID}
        title={`${selectedMember?.firstName || ""} ${
          selectedMember?.lastName || ""
        }`}
        onSubmitForm={(data) => dispatch(changeMemberStatus(data))}
        orgID={orgID}
        loading={changeMemberStatusLoading}
      />
    </Fragment>
  );
}
