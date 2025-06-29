import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserData,
  getCountries,
  getStates,
  getDistricts,
  getLocalBodyNames,
  getWards,
  getPostOffices,
  getLocalBodyTypes,
  getBloodGroups,
  getGenders,
  getAddressTypes,
  getCommunicationTypes,
  getQualificationTypes,
  getInstitutionTypes,
  getInstitutions,
  getOrganizationMemberStatuses,
  getNotificationTypes,
  getOrganizationList,
  getMemberOrganizationList,
  getNotificationStatus
} from "./api";
import { API_STATUS } from "./constants";

export const signInSlice = createSlice({
  name: "common",
  initialState: {
    headerInfo: {
      title: "Dashboard",
      subTitle: "Welcome to Sportfolio"
    },
    userInfo: {},
    alertDialog: {
      open: false,
      title: "success",
      message: "Alert Message",
      type: "success",
      closeButton: false,
      align: "center",
      actions: {
        forward: {
          text: "Yes",
          action: null,
          variant: "outline"
        },
        backward: {
          text: "No",
          action: null,
          variant: "outline"
        }
      }
    },
    showDocumentModal: false,
    documentList: [],
    showChangePasswordModal: false
  },
  reducers: {
    setHeaderInfo(state, action) {
      state.headerInfo = action.payload;
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    setAlertDialog(state, action) {
      state.alertDialog = action.payload;
    },
    setSearchBar(state, action) {
      state.searchBar = action.payload;
    },
    setSearchKeyword(state, action) {
      state.searchKeyword = action.payload;
    },
    setShowDocumentModal(state, action) {
      state.showDocumentModal = action.payload;
    },
    setDocumentList(state, action) {
      state.documentList = action.payload;
    },
    setSelectedDocument(state, action) {
      state.selectedDocument = action.payload;
    },
    setShowChangePasswordModal(state, action) {
      state.showChangePasswordModal = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserData.fulfilled, (state, action) => {
      (state.data = action.payload),
        (state.loading = false),
        (state.status = "Success");
    });
    builder.addCase(fetchUserData.pending, (state) => {
      (state.loading = true),
        (state.status = "Fetching todos. Please wait a moment...");
    });
    builder.addCase(fetchUserData.rejected, (state) => {
      (state.loading = false), (state.status = "Failed to fetch data...");
    });

    /**
     * GET COUNTRIES
     */
    builder.addCase(getCountries.fulfilled, (state, action) => {
      (state.getCountriesRes = action.payload),
        (state.getCountriesLoading = false),
        (state.getCountriesStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getCountries.pending, (state) => {
      (state.getCountriesLoading = true),
        (state.getCountriesStatus = API_STATUS.PENDING);
    });
    builder.addCase(getCountries.rejected, (state, action) => {
      (state.getCountriesRes = action.error.message),
        (state.getCountriesLoading = false),
        (state.getCountriesStatus = API_STATUS.FAILED);
    });

    /**
     * GET STATES
     */
    builder.addCase(getStates.fulfilled, (state, action) => {
      (state.getStatesRes = action.payload),
        (state.getStatesLoading = false),
        (state.getStatesStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getStates.pending, (state) => {
      (state.getStatesLoading = true),
        (state.getStatesStatus = API_STATUS.PENDING);
    });
    builder.addCase(getStates.rejected, (state, action) => {
      (state.getStatesRes = action.error.message),
        (state.getStatesLoading = false),
        (state.getStatesStatus = API_STATUS.FAILED);
    });

    /**
     * GET DISTRICTS
     */
    builder.addCase(getDistricts.fulfilled, (state, action) => {
      (state.getDistrictsRes = action.payload),
        (state.getDistrictsLoading = false),
        (state.getDistrictsStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getDistricts.pending, (state) => {
      (state.getDistrictsLoading = true),
        (state.getDistrictsStatus = API_STATUS.PENDING);
    });
    builder.addCase(getDistricts.rejected, (state, action) => {
      (state.getDistrictsRes = action.error.message),
        (state.getDistrictsLoading = false),
        (state.getDistrictsStatus = API_STATUS.FAILED);
    });

    /**
     * GET LOCALBODYNAMES
     */
    builder.addCase(getLocalBodyNames.fulfilled, (state, action) => {
      (state.getLocalBodyNamesRes = action.payload),
        (state.getLocalBodyNamesLoading = false),
        (state.getLocalBodyNamesStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getLocalBodyNames.pending, (state) => {
      (state.getLocalBodyNamesLoading = true),
        (state.getLocalBodyNamesStatus = API_STATUS.PENDING);
    });
    builder.addCase(getLocalBodyNames.rejected, (state, action) => {
      (state.getLocalBodyNamesRes = action.error.message),
        (state.getLocalBodyNamesLoading = false),
        (state.getLocalBodyNamesStatus = API_STATUS.FAILED);
    });

    /**
     * GET WARDS
     */
    builder.addCase(getWards.fulfilled, (state, action) => {
      (state.getWardsRes = action.payload),
        (state.getWardsLoading = false),
        (state.getWardsStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getWards.pending, (state) => {
      (state.getWardsLoading = true),
        (state.getWardsStatus = API_STATUS.PENDING);
    });
    builder.addCase(getWards.rejected, (state, action) => {
      (state.getWardsRes = action.error.message),
        (state.getWardsLoading = false),
        (state.getWardsStatus = API_STATUS.FAILED);
    });

    /**
     * GET POSTOFFICES
     */
    builder.addCase(getPostOffices.fulfilled, (state, action) => {
      (state.getPostOfficesRes = action.payload),
        (state.getPostOfficesLoading = false),
        (state.getPostOfficesStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getPostOffices.pending, (state) => {
      (state.getPostOfficesLoading = true),
        (state.getPostOfficesStatus = API_STATUS.PENDING);
    });
    builder.addCase(getPostOffices.rejected, (state, action) => {
      (state.getPostOfficesRes = action.error.message),
        (state.getPostOfficesLoading = false),
        (state.getPostOfficesStatus = API_STATUS.FAILED);
    });

    /**
     * GET LOCALBODYTYPES
     */
    builder.addCase(getLocalBodyTypes.fulfilled, (state, action) => {
      (state.getLocalBodyTypesRes = action.payload),
        (state.getLocalBodyTypesLoading = false),
        (state.getLocalBodyTypesStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getLocalBodyTypes.pending, (state) => {
      (state.getLocalBodyTypesLoading = true),
        (state.getLocalBodyTypesStatus = API_STATUS.PENDING);
    });
    builder.addCase(getLocalBodyTypes.rejected, (state, action) => {
      (state.getLocalBodyTypesRes = action.error.message),
        (state.getLocalBodyTypesLoading = false),
        (state.getLocalBodyTypesStatus = API_STATUS.FAILED);
    });

    /**
     * GET BLOODGROUP
     */
    builder.addCase(getBloodGroups.fulfilled, (state, action) => {
      (state.getBloodGroupsRes = action.payload),
        (state.getBloodGroupsLoading = false),
        (state.getBloodGroupsStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getBloodGroups.pending, (state) => {
      (state.getBloodGroupsLoading = true),
        (state.getBloodGroupsStatus = API_STATUS.PENDING);
    });
    builder.addCase(getBloodGroups.rejected, (state, action) => {
      (state.getBloodGroupsRes = action.error.message),
        (state.getBloodGroupsLoading = false),
        (state.getBloodGroupsStatus = API_STATUS.FAILED);
    });

    /**
     * GET GENDER
     */
    builder.addCase(getGenders.fulfilled, (state, action) => {
      (state.getGendersRes = action.payload),
        (state.getGendersLoading = false),
        (state.getGendersStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getGenders.pending, (state) => {
      (state.getGendersLoading = true),
        (state.getGendersStatus = API_STATUS.PENDING);
    });
    builder.addCase(getGenders.rejected, (state, action) => {
      (state.getGendersRes = action.error.message),
        (state.getGendersLoading = false),
        (state.getGendersStatus = API_STATUS.FAILED);
    });

    /**
     * GET ADDRESSTYPES
     */
    builder.addCase(getAddressTypes.fulfilled, (state, action) => {
      (state.getAddressTypesRes = action.payload),
        (state.getAddressTypesLoading = false),
        (state.getAddressTypesStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getAddressTypes.pending, (state) => {
      (state.getAddressTypesLoading = true),
        (state.getAddressTypesStatus = API_STATUS.PENDING);
    });
    builder.addCase(getAddressTypes.rejected, (state, action) => {
      (state.getAddressTypesRes = action.error.message),
        (state.getAddressTypesLoading = false),
        (state.getAddressTypesStatus = API_STATUS.FAILED);
    });

    /**
     * GET COMMUNICATIONTYPES
     */
    builder.addCase(getCommunicationTypes.fulfilled, (state, action) => {
      (state.getCommunicationTypesRes = action.payload),
        (state.getCommunicationTypesLoading = false),
        (state.getCommunicationTypesStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getCommunicationTypes.pending, (state) => {
      (state.getCommunicationTypesLoading = true),
        (state.getCommunicationTypesStatus = API_STATUS.PENDING);
    });
    builder.addCase(getCommunicationTypes.rejected, (state, action) => {
      (state.getCommunicationTypesRes = action.error.message),
        (state.getCommunicationTypesLoading = false),
        (state.getCommunicationTypesStatus = API_STATUS.FAILED);
    });

    /**
     * GET QUALIFICATIONTYPES
     */
    builder.addCase(getQualificationTypes.fulfilled, (state, action) => {
      (state.getQualificationTypesRes = action.payload),
        (state.getQualificationTypesLoading = false),
        (state.getQualificationTypesStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getQualificationTypes.pending, (state) => {
      (state.getQualificationTypesLoading = true),
        (state.getQualificationTypesStatus = API_STATUS.PENDING);
    });
    builder.addCase(getQualificationTypes.rejected, (state, action) => {
      (state.getQualificationTypesRes = action.error.message),
        (state.getQualificationTypesLoading = false),
        (state.getQualificationTypesStatus = API_STATUS.FAILED);
    });

    /**
     * GET INSTITUTIONTYPES
     */
    builder.addCase(getInstitutionTypes.fulfilled, (state, action) => {
      (state.getInstitutionTypesRes = action.payload),
        (state.getInstitutionTypesLoading = false),
        (state.getInstitutionTypesStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getInstitutionTypes.pending, (state) => {
      (state.getInstitutionTypesLoading = true),
        (state.getInstitutionTypesStatus = API_STATUS.PENDING);
    });
    builder.addCase(getInstitutionTypes.rejected, (state, action) => {
      (state.getInstitutionTypesRes = action.error.message),
        (state.getInstitutionTypesLoading = false),
        (state.getInstitutionTypesStatus = API_STATUS.FAILED);
    });

    /**
     * GET INSTITUTIONS
     */
    builder.addCase(getInstitutions.fulfilled, (state, action) => {
      (state.getInstitutionsRes = action.payload),
        (state.getInstitutionsLoading = false),
        (state.getInstitutionsStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getInstitutions.pending, (state) => {
      (state.getInstitutionsLoading = true),
        (state.getInstitutionsStatus = API_STATUS.PENDING);
    });
    builder.addCase(getInstitutions.rejected, (state, action) => {
      (state.getInstitutionsRes = action.error.message),
        (state.getInstitutionsLoading = false),
        (state.getInstitutionsStatus = API_STATUS.FAILED);
    });

    /**
     * GET ORG MEMBER STATUS
     */
    builder.addCase(
      getOrganizationMemberStatuses.fulfilled,
      (state, action) => {
        (state.getOrganizationMemberStatusesRes = action.payload),
          (state.getOrganizationMemberStatusesLoading = false),
          (state.getOrganizationMemberStatusesStatus = API_STATUS.SUCCESS);
      }
    );
    builder.addCase(getOrganizationMemberStatuses.pending, (state) => {
      (state.getOrganizationMemberStatusesLoading = true),
        (state.getOrganizationMemberStatusesStatus = API_STATUS.PENDING);
    });
    builder.addCase(getOrganizationMemberStatuses.rejected, (state, action) => {
      (state.getOrganizationMemberStatusesRes = action.error.message),
        (state.getOrganizationMemberStatusesLoading = false),
        (state.getOrganizationMemberStatusesStatus = API_STATUS.FAILED);
    });

    /**
     * GET NOTIFICATION TYPES
     */
    builder.addCase(getNotificationTypes.fulfilled, (state, action) => {
      (state.getNotificationTypesRes = action.payload),
        (state.getNotificationTypesLoading = false),
        (state.getNotificationTypesStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getNotificationTypes.pending, (state) => {
      (state.getNotificationTypesLoading = true),
        (state.getNotificationTypesStatus = API_STATUS.PENDING);
    });
    builder.addCase(getNotificationTypes.rejected, (state, action) => {
      (state.getNotificationTypesRes = action.error.message),
        (state.getNotificationTypesLoading = false),
        (state.getNotificationTypesStatus = API_STATUS.FAILED);
    });

    /**
     * GET ORGANIZATION LIST
     */
    builder.addCase(getOrganizationList.fulfilled, (state, action) => {
      (state.getOrganizationListRes = action.payload),
        (state.getOrganizationListLoading = false),
        (state.getOrganizationListStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getOrganizationList.pending, (state) => {
      (state.getOrganizationListLoading = true),
        (state.getOrganizationListStatus = API_STATUS.PENDING);
    });
    builder.addCase(getOrganizationList.rejected, (state, action) => {
      (state.getOrganizationListRes = action.error.message),
        (state.getOrganizationListLoading = false),
        (state.getOrganizationListStatus = API_STATUS.FAILED);
    });

    /**
     * GET MEMBER ORGANIZATION LIST
     */
    builder.addCase(getMemberOrganizationList.fulfilled, (state, action) => {
      (state.getMemberOrganizationListRes = action.payload),
        (state.getMemberOrganizationListLoading = false),
        (state.getMemberOrganizationListStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getMemberOrganizationList.pending, (state) => {
      (state.getMemberOrganizationListLoading = true),
        (state.getMemberOrganizationListStatus = API_STATUS.PENDING);
    });
    builder.addCase(getMemberOrganizationList.rejected, (state, action) => {
      (state.getMemberOrganizationListRes = action.error.message),
        (state.getMemberOrganizationListLoading = false),
        (state.getMemberOrganizationListStatus = API_STATUS.FAILED);
    });

    /**
     * GET NOTIFICATION STATUSES LIST
     */
    builder.addCase(getNotificationStatus.fulfilled, (state, action) => {
      (state.getNotificationStatusRes = action.payload),
        (state.getNotificationStatusLoading = false),
        (state.getNotificationStatusStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getNotificationStatus.pending, (state) => {
      (state.getNotificationStatusLoading = true),
        (state.getNotificationStatusStatus = API_STATUS.PENDING);
    });
    builder.addCase(getNotificationStatus.rejected, (state, action) => {
      (state.getNotificationStatusRes = action.error.message),
        (state.getNotificationStatusLoading = false),
        (state.getNotificationStatusStatus = API_STATUS.FAILED);
    });
  }
});

export const {
  setHeaderInfo,
  setUserInfo,
  setAlertDialog,
  setSearchBar,
  setSearchKeyword,
  setShowDocumentModal,
  setDocumentList,
  setSelectedDocument,
  setShowChangePasswordModal
} = signInSlice.actions;

export default signInSlice.reducer;
