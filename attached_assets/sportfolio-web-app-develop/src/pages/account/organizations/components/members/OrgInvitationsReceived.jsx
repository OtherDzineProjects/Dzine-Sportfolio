import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import { Fragment } from "react";
import OrgMemberListItem from "../../organization-sections/ui/OrgMemberListItem";
import NoData from "common/components/NoData/NoData";
import Pagination from "common/components/Table/Pagination";
import ActionModal from "../../organization-sections/ActionModal";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useDisclosure } from "common";
import useSuccessAlert from "hooks/useSuccessAlert";
import useErrorAlert from "hooks/useErrorAlert";
import { clearSearchUsersForOrg } from "../../slice";
import { useEffect } from "react";
import {
  changeMemberStatus,
  fetchOrgInvitationsReceived,
  getOrgMemberCount
} from "../../api";
import { API_STATUS } from "pages/common/constants";
import { setAlertDialog } from "pages/common/slice";

export default function OrgInvitationsReceived({ orgID, currentTab = false }) {
  const dispatch = useDispatch(),
    {
      fetchOrgInvitationsReceivedRes,
      fetchOrgInvitationsReceivedLoading,
      changeMemberStatusRes,
      changeMemberStatusLoading,
      changeMemberStatusStatus,
      inviteMemberStatus
    } = useSelector((state) => state.org),
    [searchParams] = useSearchParams(),
    navigate = useNavigate(),
    [selectedMember, setSelectedMember] = useState(null),
    [actionType, setActionType] = useState(""),
    { isOpen, onOpen, onClose } = useDisclosure();

  const showSuccessAlert = useSuccessAlert(),
    showErrorAlert = useErrorAlert();

  const onPageClick = (data) => {
    navigate(
      `?tab=invitations&page=${data}&pageSize=${searchParams.get("pageSize")}`
    );
  };

  useEffect(() => {
    if (!currentTab) return;
    dispatch(
      fetchOrgInvitationsReceived({
        query: `?page=${searchParams.get("page")}&pageSize=${searchParams.get(
          "pageSize"
        )}`,
        data: { organizationID: orgID }
      })
    );

    return () => {
      setSelectedMember(null);
      setActionType("");
      onClose();
      dispatch(clearSearchUsersForOrg());
    };
  }, [searchParams, currentTab, inviteMemberStatus]);

  useEffect(() => {
    if (changeMemberStatusStatus === API_STATUS.SUCCESS && currentTab) {
      onClose();
      showSuccessAlert(
        "",
        `Member invitation ${
          actionType === "accept" ? "accepted" : "rejected"
        } successfully`,
        () => {
          dispatch(setAlertDialog(null));
          dispatch(clearSearchUsersForOrg());
          dispatch(getOrgMemberCount(orgID));
          dispatch(
            fetchOrgInvitationsReceived({
              query: `?page=${searchParams.get(
                "page"
              )}&pageSize=${searchParams.get("pageSize")}`,
              data: { organizationID: orgID }
            })
          );
        }
      );
    } else if (changeMemberStatusStatus === API_STATUS.FAILED && currentTab) {
      showErrorAlert(
        "",
        changeMemberStatusRes || `Failed to ${actionType} member invitation`,
        () => {
          dispatch(setAlertDialog(null));
          dispatch(clearSearchUsersForOrg());
        }
      );
    }
  }, [changeMemberStatusStatus]);

  const onActionClick = (member, type) => {
    setSelectedMember(member);
    setActionType(type);
    onOpen();
  };

  return (
    <Fragment>
      {fetchOrgInvitationsReceivedLoading ? (
        <FullscreenLoader />
      ) : (
        <Fragment>
          {fetchOrgInvitationsReceivedRes?.data?.organizationMemberDetails
            ?.length > 0 ? (
            <section className="flex flex-col gap-4">
              {fetchOrgInvitationsReceivedRes?.data?.organizationMemberDetails.map(
                (member) => (
                  <OrgMemberListItem
                    key={member?.organizationmemberID}
                    member={member}
                    id={member?.userId}
                    tab="pending"
                    showAcceptRejectButtons={member?.showCancelInvite}
                    onRejectClick={() => onActionClick(member, "reject")}
                    onAcceptClick={() => onActionClick(member, "accept")}
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
            totalCount={fetchOrgInvitationsReceivedRes?.data?.totalCount}
            pageSize={Number(searchParams.get("pageSize"))}
            onPageChange={onPageClick}
            numberOfElements={fetchOrgInvitationsReceivedRes?.data?.count}
          />
        </Fragment>
      )}

      <ActionModal
        isOpen={isOpen}
        onClose={onClose}
        hideAction
        label="Reason"
        organizationMemberID={selectedMember?.organizationmemberID}
        title={`${selectedMember?.firstName || ""} ${
          selectedMember?.lastName || ""
        }`}
        onSubmitForm={(data) => {
          delete data.statusID;
          data.status = actionType === "reject" ? "Cancel" : "Active";
          dispatch(changeMemberStatus(data));
        }}
        orgID={orgID}
        loading={changeMemberStatusLoading}
      />
    </Fragment>
  );
}
