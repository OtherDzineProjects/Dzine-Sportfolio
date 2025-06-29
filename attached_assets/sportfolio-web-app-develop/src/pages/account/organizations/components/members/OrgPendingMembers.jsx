import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  changeMemberStatus,
  fetchPendingOrgMembers,
  getOrgMemberCount
} from "../../api";
import { Fragment } from "react";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import Pagination from "common/components/Table/Pagination";
import OrgMemberListItem from "../../organization-sections/ui/OrgMemberListItem";
import NoData from "common/components/NoData/NoData";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { API_STATUS } from "pages/common/constants";
import ActionModal from "../../organization-sections/ActionModal";
import { useDisclosure } from "common";
import { useState } from "react";
import { clearSearchUsersForOrg } from "../../slice";
import useSuccessAlert from "hooks/useSuccessAlert";
import useErrorAlert from "hooks/useErrorAlert";
import { useMemo } from "react";
import { STORAGE_KEYS } from "common/constants";
import { setAlertDialog } from "pages/common/slice";

export default function OrgPendingMembers({ orgID, currentTab = false }) {
  const dispatch = useDispatch(),
    {
      fetchPendingOrgMembersRes,
      fetchPendingOrgMembersLoading,
      inviteMemberStatus,
      changeMemberStatusStatus,
      changeMemberStatusLoading,
      changeMemberStatusRes
    } = useSelector((state) => state.org),
    [searchParams] = useSearchParams(),
    navigate = useNavigate(),
    [selectedMember, setSelectedMember] = useState(null),
    { isOpen, onOpen, onClose } = useDisclosure();

  const showSuccessAlert = useSuccessAlert(),
    showErrorAlert = useErrorAlert();

  const onPageClick = (data) => {
    navigate(
      `?tab=pending&page=${data}&pageSize=${searchParams.get("pageSize")}`
    );
  };

  useEffect(() => {
    if (!currentTab) return;
    dispatch(
      fetchPendingOrgMembers({
        query: `?page=${searchParams.get("page")}&pageSize=${searchParams.get(
          "pageSize"
        )}`,
        data: { organizationID: orgID }
      })
    );

    return () => {
      setSelectedMember(null);
      onClose();
      dispatch(clearSearchUsersForOrg());
    };
  }, [searchParams, currentTab]);

  useEffect(() => {
    if (changeMemberStatusStatus === API_STATUS.SUCCESS && currentTab) {
      onClose();
      showSuccessAlert("", "Member status updated successfully", () => {
        dispatch(setAlertDialog(null));
        dispatch(clearSearchUsersForOrg());
        dispatch(getOrgMemberCount(orgID));
        dispatch(
          fetchPendingOrgMembers({
            query: `?page=${searchParams.get(
              "page"
            )}&pageSize=${searchParams.get("pageSize")}`,
            data: { organizationID: orgID }
          })
        );
      });
    } else if (changeMemberStatusStatus === API_STATUS.FAILED && currentTab) {
      showErrorAlert(
        "",
        changeMemberStatusRes || "Failed to change member status",
        () => {
          dispatch(clearSearchUsersForOrg());
          dispatch(setAlertDialog(null));
        }
      );
    }
  }, [changeMemberStatusStatus]);

  useEffect(() => {
    if (inviteMemberStatus === API_STATUS.SUCCESS && currentTab) {
      dispatch(getOrgMemberCount(orgID));
      dispatch(
        fetchPendingOrgMembers({
          query: `?page=${searchParams.get("page")}&pageSize=${searchParams.get(
            "pageSize"
          )}`,
          data: { organizationID: orgID }
        })
      );
    }
  }, [inviteMemberStatus]);

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
      {fetchPendingOrgMembersLoading ? (
        <FullscreenLoader />
      ) : (
        <Fragment>
          {fetchPendingOrgMembersRes?.data?.organizationMemberDetails?.length >
          0 ? (
            <section className="flex flex-col gap-4">
              {fetchPendingOrgMembersRes?.data?.organizationMemberDetails.map(
                (member) => (
                  <OrgMemberListItem
                    key={member?.organizationmemberID}
                    member={member}
                    id={member?.userId}
                    tab="pending"
                    includeActionButton={
                      !!member?.showCancelInvite &&
                      currentUser?.id !== member?.userId
                    }
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
            currentPage={Number(searchParams.get("page"))}
            totalCount={fetchPendingOrgMembersRes?.data?.totalCount}
            pageSize={Number(searchParams.get("pageSize"))}
            onPageChange={onPageClick}
            numberOfElements={fetchPendingOrgMembersRes?.data?.count}
          />
        </Fragment>
      )}

      <ActionModal
        isOpen={isOpen}
        onClose={onClose}
        hideAction
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
