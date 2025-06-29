import { createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "pages/common/constants";
import {
  deleteOrg,
  getOrgByID,
  saveOrg,
  updateOrg,
  searchOrganizationActivity,
  saveOrganizationActivity,
  deleteOrganizationActivity,
  fetchActivityChildList,
  fetchActivityList,
  saveOrgAvatar,
  searchOrgMembers,
  advancedSearchOrgMembers,
  fetchExistingOrgMembers,
  fetchPendingOrgMembers,
  fetchOrgApplicationsMembers,
  searchUsersForOrg,
  getOrgMemberCount,
  inviteMember,
  changeMemberStatus,
  applyOrgMembership,
  checkOrgMembership,
  advancedSearchOrg,
  searchOrg,
  fetchOrgInvitationsReceived,
  getOrgPermissions,
  searchExistingOrgMembers,
  setMemberAsAdmin
} from "./api";

export const orgSlice = createSlice({
  name: "org",
  initialState: {
    newOrgDialog: false,
    selectedActivitiesArray: [],
    selectedActivityIDsArray: [],
    newlySelectedActivities: [],
    showAddMemberDialog: false,
    showMemberRoleModal: false,
    selectedMembersForAdminArray: []
  },
  reducers: {
    setNewOrgDialog(state, action) {
      state.newOrgDialog = action.payload;
    },
    clearSearchUsersForOrg(state) {
      state.searchUsersForOrgRes = null;
      state.searchUsersForOrgLoading = false;
      state.searchUsersForOrgStatus = null;
      state.inviteMemberRes = null;
      state.inviteMemberLoading = false;
      state.inviteMemberStatus = null;
      state.applyOrgMembershipRes = null;
      state.applyOrgMembershipLoading = false;
      state.applyOrgMembershipStatus = null;
      state.changeMemberStatusRes = null;
      state.changeMemberStatusLoading = false;
      state.changeMemberStatusStatus = null;
      state.advancedSearchOrgRes = null;
      state.advancedSearchOrgLoading = false;
      state.advancedSearchOrgStatus = null;
    },
    resetOrganizationDetails(state) {
      state.getOrgByIDRes = null;
      state.getOrgByIDStatus = null;
      state.getOrgByIDLoading = false;
      state.saveOrgAvatarRes = null;
      state.saveOrgAvatarStatus = null;
      state.saveOrgAvatarLoading = false;
      state.getOrgPermissionsRes = null;
      state.getOrgPermissionsLoading = false;
      state.getOrgPermissionsStatus = null;
    },
    resetOrganizationFormActions(state) {
      state.updateOrgRes = null;
      state.updateOrgStatus = null;
      state.updateOrgLoading = false;
      state.searchOrganizationActivityRes = null;
      state.searchOrganizationActivityStatus = null;
      state.searchOrganizationActivityLoading = false;
      state.saveOrganizationActivityRes = null;
      state.saveOrganizationActivityStatus = null;
      state.saveOrganizationActivityLoading = false;
      state.deleteOrganizationActivityRes = null;
      state.deleteOrganizationActivityStatus = null;
      state.deleteOrganizationActivityLoading = false;
    },
    resetSearchAndTabDetails(state) {
      state.searchOrgRes = null;
      state.searchOrgStatus = null;
      state.searchOrgLoading = false;
    },
    handleSelectedActivitiesArray(state, action) {
      state.selectedActivitiesArray = action.payload;
    },
    handleSelectedActivityIDsArray(state, action) {
      state.selectedActivityIDsArray = action.payload;
    },
    handleShowAddMemberDialog(state, action) {
      state.showAddMemberDialog = action.payload;
    },
    handleNewlySelectedActivities(state, action) {
      state.newlySelectedActivities = action.payload;
    },
    setShowMemberRoleModal(state, action) {
      state.showMemberRoleModal = action.payload;
    },
    resetSetAsAdmin(state) {
      state.setMemberAsAdminRes = null;
      state.setMemberAsAdminLoading = false;
      state.setMemberAsAdminStatus = null;
    },
    handleSelectedMembersForAdminArray(state, action) {
      state.selectedMembersForAdminArray = action.payload;
    }
  },
  extraReducers: (builder) => {
    // saveOrg form
    builder.addCase(saveOrg.fulfilled, (state, action) => {
      (state.saveOrgRes = action.payload),
        (state.saveOrgLoading = false),
        (state.saveOrgStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(saveOrg.pending, (state) => {
      (state.saveOrgLoading = true), (state.saveOrgStatus = API_STATUS.PENDING);
    });
    builder.addCase(saveOrg.rejected, (state, action) => {
      (state.saveOrgRes = action.error.message),
        (state.saveOrgLoading = false),
        (state.saveOrgStatus = API_STATUS.FAILED);
    });
    // searchOrg form
    builder.addCase(searchOrg.fulfilled, (state, action) => {
      (state.searchOrgRes = action.payload),
        (state.searchOrgLoading = false),
        (state.searchOrgStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(searchOrg.pending, (state) => {
      (state.searchOrgLoading = true),
        (state.searchOrgStatus = API_STATUS.PENDING);
    });
    builder.addCase(searchOrg.rejected, (state, action) => {
      (state.searchOrgRes = action.error.message),
        (state.searchOrgLoading = false),
        (state.searchOrgStatus = API_STATUS.FAILED);
    });
    // advancedSearchOrg form
    builder.addCase(advancedSearchOrg.fulfilled, (state, action) => {
      (state.advancedSearchOrgRes = action.payload),
        (state.advancedSearchOrgLoading = false),
        (state.advancedSearchOrgStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(advancedSearchOrg.pending, (state) => {
      (state.advancedSearchOrgLoading = true),
        (state.advancedSearchOrgStatus = API_STATUS.PENDING);
    });
    builder.addCase(advancedSearchOrg.rejected, (state, action) => {
      (state.advancedSearchOrgRes = action.error.message),
        (state.advancedSearchOrgLoading = false),
        (state.advancedSearchOrgStatus = API_STATUS.FAILED);
    });
    // getOrgByID form
    builder.addCase(getOrgByID.fulfilled, (state, action) => {
      (state.getOrgByIDRes = action.payload),
        (state.getOrgByIDLoading = false),
        (state.getOrgByIDStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getOrgByID.pending, (state) => {
      (state.getOrgByIDLoading = true),
        (state.getOrgByIDStatus = API_STATUS.PENDING);
    });
    builder.addCase(getOrgByID.rejected, (state, action) => {
      (state.getOrgByIDRes = action.error.message),
        (state.getOrgByIDLoading = false),
        (state.getOrgByIDStatus = API_STATUS.FAILED);
    });
    // updateOrg form
    builder.addCase(updateOrg.fulfilled, (state, action) => {
      (state.updateOrgRes = action.payload),
        (state.updateOrgLoading = false),
        (state.updateOrgStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(updateOrg.pending, (state) => {
      (state.updateOrgLoading = true),
        (state.updateOrgStatus = API_STATUS.PENDING);
    });
    builder.addCase(updateOrg.rejected, (state, action) => {
      (state.updateOrgRes = action.error.message),
        (state.updateOrgLoading = false),
        (state.updateOrgStatus = API_STATUS.FAILED);
    });
    // deleteOrg form
    builder.addCase(deleteOrg.fulfilled, (state, action) => {
      (state.deleteOrgRes = action.payload),
        (state.deleteOrgLoading = false),
        (state.deleteOrgStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(deleteOrg.pending, (state) => {
      (state.deleteOrgLoading = true),
        (state.deleteOrgStatus = API_STATUS.PENDING);
    });
    builder.addCase(deleteOrg.rejected, (state, action) => {
      (state.deleteOrgRes = action.error.message),
        (state.deleteOrgLoading = false),
        (state.deleteOrgStatus = API_STATUS.FAILED);
    });

    // Save Org Avatar
    builder.addCase(saveOrgAvatar.fulfilled, (state, action) => {
      (state.saveOrgAvatarRes = action.payload),
        (state.saveOrgAvatarLoading = false),
        (state.saveOrgAvatarStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(saveOrgAvatar.pending, (state) => {
      (state.saveOrgAvatarLoading = true),
        (state.saveOrgAvatarStatus = API_STATUS.PENDING);
    });
    builder.addCase(saveOrgAvatar.rejected, (state, action) => {
      (state.saveOrgAvatarRes = action.error.message),
        (state.saveOrgAvatarLoading = false),
        (state.saveOrgAvatarStatus = API_STATUS.FAILED);
    });

    // Search Activity
    builder.addCase(searchOrganizationActivity.fulfilled, (state, action) => {
      (state.searchOrganizationActivityRes = action.payload),
        (state.searchOrganizationActivityLoading = false),
        (state.searchOrganizationActivityStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(searchOrganizationActivity.pending, (state) => {
      (state.searchOrganizationActivityLoading = true),
        (state.searchOrganizationActivityStatus = API_STATUS.PENDING);
    });
    builder.addCase(searchOrganizationActivity.rejected, (state, action) => {
      (state.searchOrganizationActivityRes = action.error.message),
        (state.searchOrganizationActivityLoading = false),
        (state.searchOrganizationActivityStatus = API_STATUS.FAILED);
    });

    // Save Activity
    builder.addCase(saveOrganizationActivity.fulfilled, (state, action) => {
      (state.saveOrganizationActivityRes = action.payload),
        (state.saveOrganizationActivityLoading = false),
        (state.saveOrganizationActivityStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(saveOrganizationActivity.pending, (state) => {
      (state.saveOrganizationActivityLoading = true),
        (state.saveOrganizationActivityStatus = API_STATUS.PENDING);
    });
    builder.addCase(saveOrganizationActivity.rejected, (state, action) => {
      (state.saveOrganizationActivityRes = action.error.message),
        (state.saveOrganizationActivityLoading = false),
        (state.saveOrganizationActivityStatus = API_STATUS.FAILED);
    });

    // Delete Activity
    builder.addCase(deleteOrganizationActivity.fulfilled, (state, action) => {
      (state.deleteOrganizationActivityRes = action.payload),
        (state.deleteOrganizationActivityLoading = false),
        (state.deleteOrganizationActivityStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(deleteOrganizationActivity.pending, (state) => {
      (state.deleteOrganizationActivityLoading = true),
        (state.deleteOrganizationActivityStatus = API_STATUS.PENDING);
    });
    builder.addCase(deleteOrganizationActivity.rejected, (state, action) => {
      (state.deleteOrganizationActivityRes = action.error.message),
        (state.deleteOrganizationActivityLoading = false),
        (state.deleteOrganizationActivityStatus = API_STATUS.FAILED);
    });

    // Fetch Activity List
    builder.addCase(fetchActivityList.fulfilled, (state, action) => {
      (state.fetchActivityListRes = action.payload),
        (state.fetchActivityListLoading = false),
        (state.fetchActivityListStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(fetchActivityList.pending, (state) => {
      (state.fetchActivityListLoading = true),
        (state.fetchActivityListStatus = API_STATUS.PENDING);
    });
    builder.addCase(fetchActivityList.rejected, (state, action) => {
      (state.fetchActivityListRes = action.error.message),
        (state.fetchActivityListLoading = false),
        (state.fetchActivityListStatus = API_STATUS.FAILED);
    });

    // Fetch Child Activity List
    builder.addCase(fetchActivityChildList.fulfilled, (state, action) => {
      (state.fetchActivityChildListRes = action.payload),
        (state.fetchActivityChildListLoading = false),
        (state.fetchActivityChildListStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(fetchActivityChildList.pending, (state) => {
      (state.fetchActivityChildListLoading = true),
        (state.fetchActivityChildListStatus = API_STATUS.PENDING);
    });
    builder.addCase(fetchActivityChildList.rejected, (state, action) => {
      (state.fetchActivityChildListRes = action.error.message),
        (state.fetchActivityChildListLoading = false),
        (state.fetchActivityChildListStatus = API_STATUS.FAILED);
    });

    // Search (GET) Org Members List
    builder.addCase(searchOrgMembers.fulfilled, (state, action) => {
      (state.searchOrgMembersRes = action.payload),
        (state.searchOrgMembersLoading = false),
        (state.searchOrgMembersStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(searchOrgMembers.pending, (state) => {
      (state.searchOrgMembersLoading = true),
        (state.searchOrgMembersStatus = API_STATUS.PENDING);
    });
    builder.addCase(searchOrgMembers.rejected, (state, action) => {
      (state.searchOrgMembersRes = action.error.message),
        (state.searchOrgMembersLoading = false),
        (state.searchOrgMembersStatus = API_STATUS.FAILED);
    });

    // Search Org Members List ADVANCED
    builder.addCase(advancedSearchOrgMembers.fulfilled, (state, action) => {
      (state.advancedSearchOrgMembersRes = action.payload),
        (state.advancedSearchOrgMembersLoading = false),
        (state.advancedSearchOrgMembersStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(advancedSearchOrgMembers.pending, (state) => {
      (state.advancedSearchOrgMembersLoading = true),
        (state.advancedSearchOrgMembersStatus = API_STATUS.PENDING);
    });
    builder.addCase(advancedSearchOrgMembers.rejected, (state, action) => {
      (state.advancedSearchOrgMembersRes = action.error.message),
        (state.advancedSearchOrgMembersLoading = false),
        (state.advancedSearchOrgMembersStatus = API_STATUS.FAILED);
    });
    // Existing Org Members List
    builder.addCase(fetchExistingOrgMembers.fulfilled, (state, action) => {
      (state.fetchExistingOrgMembersRes = action.payload),
        (state.fetchExistingOrgMembersLoading = false),
        (state.fetchExistingOrgMembersStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(fetchExistingOrgMembers.pending, (state) => {
      (state.fetchExistingOrgMembersLoading = true),
        (state.fetchExistingOrgMembersStatus = API_STATUS.PENDING);
    });
    builder.addCase(fetchExistingOrgMembers.rejected, (state, action) => {
      (state.fetchExistingOrgMembersRes = action.error.message),
        (state.fetchExistingOrgMembersLoading = false),
        (state.fetchExistingOrgMembersStatus = API_STATUS.FAILED);
    });

    // Search Existing Org Members List
    builder.addCase(searchExistingOrgMembers.fulfilled, (state, action) => {
      (state.searchExistingOrgMembersRes = action.payload),
        (state.searchExistingOrgMembersLoading = false),
        (state.searchExistingOrgMembersStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(searchExistingOrgMembers.pending, (state) => {
      (state.searchExistingOrgMembersLoading = true),
        (state.searchExistingOrgMembersStatus = API_STATUS.PENDING);
    });
    builder.addCase(searchExistingOrgMembers.rejected, (state, action) => {
      (state.searchExistingOrgMembersRes = action.error.message),
        (state.searchExistingOrgMembersLoading = false),
        (state.searchExistingOrgMembersStatus = API_STATUS.FAILED);
    });

    // Pending Org Members List
    builder.addCase(fetchPendingOrgMembers.fulfilled, (state, action) => {
      (state.fetchPendingOrgMembersRes = action.payload),
        (state.fetchPendingOrgMembersLoading = false),
        (state.fetchPendingOrgMembersStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(fetchPendingOrgMembers.pending, (state) => {
      (state.fetchPendingOrgMembersLoading = true),
        (state.fetchPendingOrgMembersStatus = API_STATUS.PENDING);
    });
    builder.addCase(fetchPendingOrgMembers.rejected, (state, action) => {
      (state.fetchPendingOrgMembersRes = action.error.message),
        (state.fetchPendingOrgMembersLoading = false),
        (state.fetchPendingOrgMembersStatus = API_STATUS.FAILED);
    });

    // Applications Org Members List
    builder.addCase(fetchOrgApplicationsMembers.fulfilled, (state, action) => {
      (state.fetchOrgApplicationsMembersRes = action.payload),
        (state.fetchOrgApplicationsMembersLoading = false),
        (state.fetchOrgApplicationsMembersStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(fetchOrgApplicationsMembers.pending, (state) => {
      (state.fetchOrgApplicationsMembersLoading = true),
        (state.fetchOrgApplicationsMembersStatus = API_STATUS.PENDING);
    });
    builder.addCase(fetchOrgApplicationsMembers.rejected, (state, action) => {
      (state.fetchOrgApplicationsMembersRes = action.error.message),
        (state.fetchOrgApplicationsMembersLoading = false),
        (state.fetchOrgApplicationsMembersStatus = API_STATUS.FAILED);
    });

    // Org Invitations List
    builder
      .addCase(fetchOrgInvitationsReceived.fulfilled, (state, action) => {
        (state.fetchOrgInvitationsReceivedRes = action.payload),
          (state.fetchOrgInvitationsReceivedLoading = false),
          (state.fetchOrgInvitationsReceivedStatus = API_STATUS.SUCCESS);
      })
      .addCase(fetchOrgInvitationsReceived.pending, (state) => {
        (state.fetchOrgInvitationsReceivedLoading = true),
          (state.fetchOrgInvitationsReceivedStatus = API_STATUS.PENDING);
      })
      .addCase(fetchOrgInvitationsReceived.rejected, (state, action) => {
        (state.fetchOrgInvitationsReceivedRes = action.error.message),
          (state.fetchOrgInvitationsReceivedLoading = false),
          (state.fetchOrgInvitationsReceivedStatus = API_STATUS.FAILED);
      });

    // Search Users for Org
    builder.addCase(searchUsersForOrg.fulfilled, (state, action) => {
      (state.searchUsersForOrgRes = action.payload),
        (state.searchUsersForOrgLoading = false),
        (state.searchUsersForOrgStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(searchUsersForOrg.pending, (state) => {
      (state.searchUsersForOrgLoading = true),
        (state.searchUsersForOrgStatus = API_STATUS.PENDING);
    });
    builder.addCase(searchUsersForOrg.rejected, (state, action) => {
      (state.searchUsersForOrgRes = action.error.message),
        (state.searchUsersForOrgLoading = false),
        (state.searchUsersForOrgStatus = API_STATUS.FAILED);
    });

    // Get members count in Org
    builder.addCase(getOrgMemberCount.fulfilled, (state, action) => {
      (state.getOrgMemberCountRes = action.payload),
        (state.getOrgMemberCountLoading = false),
        (state.getOrgMemberCountStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getOrgMemberCount.pending, (state) => {
      (state.getOrgMemberCountLoading = true),
        (state.getOrgMemberCountStatus = API_STATUS.PENDING);
    });
    builder.addCase(getOrgMemberCount.rejected, (state, action) => {
      (state.getOrgMemberCountRes = action.error.message),
        (state.getOrgMemberCountLoading = false),
        (state.getOrgMemberCountStatus = API_STATUS.FAILED);
    });

    // Invite members unto Org
    builder.addCase(inviteMember.fulfilled, (state, action) => {
      (state.inviteMemberRes = action.payload),
        (state.inviteMemberLoading = false),
        (state.inviteMemberStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(inviteMember.pending, (state) => {
      (state.inviteMemberLoading = true),
        (state.inviteMemberStatus = API_STATUS.PENDING);
    });
    builder.addCase(inviteMember.rejected, (state, action) => {
      (state.inviteMemberRes = action.error.message),
        (state.inviteMemberLoading = false),
        (state.inviteMemberStatus = API_STATUS.FAILED);
    });

    // Apply Membership to Org
    builder.addCase(applyOrgMembership.fulfilled, (state, action) => {
      (state.applyOrgMembershipRes = action.payload),
        (state.applyOrgMembershipLoading = false),
        (state.applyOrgMembershipStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(applyOrgMembership.pending, (state) => {
      (state.applyOrgMembershipLoading = true),
        (state.applyOrgMembershipStatus = API_STATUS.PENDING);
    });
    builder.addCase(applyOrgMembership.rejected, (state, action) => {
      (state.applyOrgMembershipRes = action.error.message),
        (state.applyOrgMembershipLoading = false),
        (state.applyOrgMembershipStatus = API_STATUS.FAILED);
    });

    // Change member status
    builder.addCase(changeMemberStatus.fulfilled, (state, action) => {
      (state.changeMemberStatusRes = action.payload),
        (state.changeMemberStatusLoading = false),
        (state.changeMemberStatusStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(changeMemberStatus.pending, (state) => {
      (state.changeMemberStatusLoading = true),
        (state.changeMemberStatusStatus = API_STATUS.PENDING);
    });
    builder.addCase(changeMemberStatus.rejected, (state, action) => {
      (state.changeMemberStatusRes = action.error.message),
        (state.changeMemberStatusLoading = false),
        (state.changeMemberStatusStatus = API_STATUS.FAILED);
    });

    // Check org membership status
    builder.addCase(checkOrgMembership.fulfilled, (state, action) => {
      (state.checkOrgMembershipRes = action.payload),
        (state.checkOrgMembershipLoading = false),
        (state.checkOrgMembershipStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(checkOrgMembership.pending, (state) => {
      (state.checkOrgMembershipLoading = true),
        (state.checkOrgMembershipStatus = API_STATUS.PENDING);
    });
    builder.addCase(checkOrgMembership.rejected, (state, action) => {
      (state.checkOrgMembershipRes = action.error.message),
        (state.checkOrgMembershipLoading = false),
        (state.checkOrgMembershipStatus = API_STATUS.FAILED);
    });

    // Get Org CRUD permissions
    builder
      .addCase(getOrgPermissions.fulfilled, (state, action) => {
        (state.getOrgPermissionsRes = action.payload),
          (state.getOrgPermissionsLoading = false),
          (state.getOrgPermissionsStatus = API_STATUS.SUCCESS);
      })
      .addCase(getOrgPermissions.pending, (state) => {
        (state.getOrgPermissionsLoading = true),
          (state.getOrgPermissionsStatus = API_STATUS.PENDING);
      })
      .addCase(getOrgPermissions.rejected, (state, action) => {
        (state.getOrgPermissionsRes = action.error.message),
          (state.getOrgPermissionsLoading = false),
          (state.getOrgPermissionsStatus = API_STATUS.FAILED);
      });

    // Set member as admin
    builder
      .addCase(setMemberAsAdmin.fulfilled, (state, action) => {
        (state.setMemberAsAdminRes = action.payload),
          (state.setMemberAsAdminLoading = false),
          (state.setMemberAsAdminStatus = API_STATUS.SUCCESS);
      })
      .addCase(setMemberAsAdmin.pending, (state) => {
        (state.setMemberAsAdminLoading = true),
          (state.setMemberAsAdminStatus = API_STATUS.PENDING);
      })
      .addCase(setMemberAsAdmin.rejected, (state, action) => {
        (state.setMemberAsAdminRes = action.error.message),
          (state.setMemberAsAdminLoading = false),
          (state.setMemberAsAdminStatus = API_STATUS.FAILED);
      });
  }
});

export const {
  setNewOrgDialog,
  resetOrganizationFormActions,
  resetOrganizationDetails,
  handleSelectedActivitiesArray,
  handleSelectedActivityIDsArray,
  handleNewlySelectedActivities,
  handleShowAddMemberDialog,
  clearSearchUsersForOrg,
  setShowMemberRoleModal,
  resetSetAsAdmin,
  handleSelectedMembersForAdminArray
} = orgSlice.actions;

export default orgSlice.reducer;
