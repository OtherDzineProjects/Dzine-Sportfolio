import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
  fetchExistingOrgMembers,
  getOrgMemberCount,
  setMemberAsAdmin
} from "../../api";
import { Fragment } from "react";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import NoData from "common/components/NoData/NoData";
import Pagination from "common/components/Table/Pagination";
import OrgOwnerAdminCard from "../../organization-sections/ui/OrgOwnerAdminCard";
import { useMemo } from "react";
import {
  handleSelectedMembersForAdminArray,
  resetSetAsAdmin
} from "../../slice";
import { Button, Tooltip } from "common";
import useConfirmAlert from "hooks/useConfirmAlert";
import { setAlertDialog } from "pages/common/slice";
import { API_STATUS } from "pages/common/constants";
import useSuccessAlert from "hooks/useSuccessAlert";
import useErrorAlert from "hooks/useErrorAlert";

export default function OrgMemberSettings({ orgID }) {
  const dispatch = useDispatch();
  const {
    fetchExistingOrgMembersRes,
    fetchExistingOrgMembersLoading,
    getOrgMemberCountRes,
    setMemberAsAdminLoading,
    setMemberAsAdminStatus,
    setMemberAsAdminRes,
    selectedMembersForAdminArray = []
  } = useSelector((state) => state.org);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const showConfirmAlert = useConfirmAlert();
  const showSuccessAlert = useSuccessAlert();
  const showErrorAlert = useErrorAlert();

  const showCheckbox = useMemo(
    () =>
      Boolean(getOrgMemberCountRes?.data?.isOwner) ||
      Boolean(getOrgMemberCountRes?.data?.isAdmin) ||
      Boolean(getOrgMemberCountRes?.data?.isSuperAdmin),
    [getOrgMemberCountRes]
  );

  const onPageClick = (data) => {
    navigate(`?page=${data}&pageSize=${searchParams.get("pageSize") || 12}`);
  };

  useEffect(() => {
    dispatch(
      fetchExistingOrgMembers({
        query: `?page=${searchParams.get("page") || 1}&pageSize=${
          searchParams.get("pageSize") || 12
        }`,
        data: { organizationID: orgID }
      })
    );

    return () => {
      dispatch(resetSetAsAdmin());
      dispatch(handleSelectedMembersForAdminArray([]));
    };
  }, [searchParams]);

  useEffect(() => {
    const adminIDArray =
      fetchExistingOrgMembersRes?.data?.organizationMemberDetails
        .filter((member) => !!member.isAdmin)
        .map((member) => member.userId);

    dispatch(handleSelectedMembersForAdminArray(adminIDArray));
  }, [fetchExistingOrgMembersRes]);

  useEffect(() => {
    if (setMemberAsAdminStatus === API_STATUS.SUCCESS) {
      showSuccessAlert("", "You have successfully made this user an admin");
      dispatch(resetSetAsAdmin());
      dispatch(getOrgMemberCount(orgID));
      dispatch(
        fetchExistingOrgMembers({
          query: `?page=${searchParams.get("page") || 1}&pageSize=${
            searchParams.get("pageSize") || 12
          }`,
          data: { organizationID: orgID }
        })
      );
    } else if (setMemberAsAdminStatus === API_STATUS.FAILED) {
      showErrorAlert(
        "",
        setMemberAsAdminRes || "Failed to make this user an admin"
      );
      dispatch(resetSetAsAdmin());
    }
  }, [setMemberAsAdminStatus]);

  const onClickAddAdmin = () => {
    showConfirmAlert(
      "",
      "Are you sure you want to make these users as admin?",
      () => {
        dispatch(
          setMemberAsAdmin({
            organizationID: orgID,
            userID: selectedMembersForAdminArray.toString(),
            isAdmin: 1
          })
        );
        dispatch(setAlertDialog(null));
      }
    );
  };

  return (
    <Fragment>
      {fetchExistingOrgMembersLoading ? (
        <FullscreenLoader />
      ) : (
        <Fragment>
          {fetchExistingOrgMembersRes?.data?.organizationMemberDetails?.length >
          0 ? (
            <div className={showCheckbox ? "h-[65svh] overflow-y-auto" : ""}>
              <section className="grid grid-cols-[repeat(auto-fit,minmax(18rem,_1fr))] md:grid-cols-[repeat(auto-fit,minmax(18rem,_0.25fr))] gap-4 ">
                {fetchExistingOrgMembersRes?.data?.organizationMemberDetails.map(
                  (member, index) => (
                    <OrgOwnerAdminCard
                      member={member}
                      key={`${member?.userId}-${index}`}
                      userID={member?.userId}
                      orgID={orgID}
                      showCheckBox={showCheckbox}
                    />
                  )
                )}
              </section>
            </div>
          ) : (
            <NoData />
          )}

          {showCheckbox && (
            <section className="flex w-full justify-end">
              <Tooltip label="Add as Admin">
                <Button
                  variant="solid"
                  colorScheme="primary"
                  onClick={onClickAddAdmin}
                  isLoading={setMemberAsAdminLoading}
                  isDisabled={
                    selectedMembersForAdminArray.length === 0 ||
                    setMemberAsAdminLoading
                  }
                >
                  Add Admin privilege
                </Button>
              </Tooltip>
            </section>
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
