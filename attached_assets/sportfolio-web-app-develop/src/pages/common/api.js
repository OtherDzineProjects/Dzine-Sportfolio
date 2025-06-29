import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "common/url";
import { http } from "../../utils/http";

const fetchUserData = createAsyncThunk("user/fetchUser", async () => {
  const response = await http.get(API_URL.AUTH.FETCH_BREADS);
  return response?.data;
});

/**
 * GET COUNTRIES API
 */
const getCountries = createAsyncThunk("common/getCountries", async () => {
  const response = await http.get(
    API_URL.COMMON.FETCH_LOCATIONS.replace(":parentID", null).replace(
      ":regionType",
      1
    )
  );
  return response?.data;
});

/**
 * GET STATES API
 */
const getStates = createAsyncThunk("common/getStates", async (parentID) => {
  const response = await http.get(
    API_URL.COMMON.FETCH_LOCATIONS.replace(":parentID", parentID).replace(
      ":regionType",
      2
    )
  );
  return response?.data;
});

/**
 * GET DISTRICTS API
 */
const getDistricts = createAsyncThunk(
  "common/getDistricts",
  async (parentID) => {
    const response = await http.get(
      API_URL.COMMON.FETCH_LOCATIONS.replace(":parentID", parentID).replace(
        ":regionType",
        3
      )
    );
    return response?.data;
  }
);

/**
 * GET LOCALBODYNAMES API
 */
const getLocalBodyNames = createAsyncThunk(
  "common/getLocalBodyNames",
  async (data) => {
    const response = await http.get(
      API_URL.COMMON.FETCH_LOCATIONS.replace(
        ":parentID",
        data.parentID
      ).replace(":regionType", data.regionType)
    );
    return response?.data;
  }
);

/**
 * GET WARDS API
 */
const getWards = createAsyncThunk("common/getWards", async (parentID) => {
  const response = await http.get(
    API_URL.COMMON.FETCH_LOCATIONS.replace(":parentID", parentID).replace(
      ":regionType",
      8
    )
  );
  return response?.data;
});

/**
 * GET POSTOFFICES API
 */
const getPostOffices = createAsyncThunk(
  "common/getPostOffices",
  async (parentID) => {
    const response = await http.get(
      API_URL.COMMON.FETCH_LOCATIONS.replace(":parentID", parentID).replace(
        ":regionType",
        9
      )
    );
    return response?.data;
  }
);

/**
 * GET LOCALBODYTYPES API
 */
const getLocalBodyTypes = createAsyncThunk(
  "common/getLocalBodyTypes",
  async () => {
    const response = await http.post(API_URL.COMMON.FETCH_LOOKUPDETAILS, {
      lookupTypeName: "RegionType",
      lookupType: "T"
    });
    return response?.data;
  }
);

/**
 * GET BLOODGROUPS API
 */
const getBloodGroups = createAsyncThunk("common/getBloodGroups", async () => {
  const response = await http.post(API_URL.COMMON.FETCH_LOOKUPDETAILS, {
    lookupTypeName: "BloodGroup",
    lookupType: "L"
  });
  return response?.data;
});

/**
 * GET GENDERS API
 */
const getGenders = createAsyncThunk("common/getGenders", async () => {
  const response = await http.post(API_URL.COMMON.FETCH_LOOKUPDETAILS, {
    lookupTypeName: "Gender",
    lookupType: "L"
  });
  return response?.data;
});

/**
 * GET ADDRESSTYPES API
 */
const getAddressTypes = createAsyncThunk("common/getAddressTypes", async () => {
  const response = await http.post(API_URL.COMMON.FETCH_LOOKUPDETAILS, {
    lookupTypeName: "AddressType",
    lookupType: "L"
  });
  return response?.data;
});

/**
 * GET COMMUNICATIONTYPES API
 */
const getCommunicationTypes = createAsyncThunk(
  "common/getCommunicationTypes",
  async () => {
    const response = await http.post(API_URL.COMMON.FETCH_LOOKUPDETAILS, {
      lookupTypeName: "CommunicationType",
      lookupType: "L"
    });
    return response?.data;
  }
);

/**
 * GET QUALIFICATIONTYPES API
 */
const getQualificationTypes = createAsyncThunk(
  "common/getQualificationTypes",
  async () => {
    const response = await http.post(API_URL.COMMON.FETCH_LOOKUPDETAILS, {
      lookupTypeName: "QualificationType",
      lookupType: "L"
    });
    return response?.data;
  }
);

/**
 * GET INSTITUTIONTYPES API
 */
const getInstitutionTypes = createAsyncThunk(
  "common/getInstitutionTypes",
  async () => {
    const response = await http.post(API_URL.COMMON.FETCH_LOOKUPDETAILS, {
      lookupTypeName: "InstitutionType",
      lookupType: "L"
    });
    return response?.data;
  }
);

/**
 * GET INSTITUTIONS/ORGANISATIONS API
 */
const getInstitutions = createAsyncThunk(
  "common/getInstitutions",
  async (data) => {
    const response = await http.post(
      API_URL.COMMON.FETCH_LOOKUPDETAILS,
      data,
      ""
    );
    return response?.data;
  }
);

/**
 * GET ORG MEMBER STATUS API
 */
const getOrganizationMemberStatuses = createAsyncThunk(
  "common/getOrganizationMemberStatuses",
  async () => {
    const response = await http.post(API_URL.COMMON.FETCH_LOOKUPDETAILS, {
      lookupTypeName: "OrganizationMemberStatus",
      lookupType: "L"
    });
    return response?.data;
  }
);

/**
 * GET NOTIFICATION TYPES API
 */
const getNotificationTypes = createAsyncThunk(
  "common/getNotificationTypes",
  async () => {
    const formData = new FormData();
    formData.append("lookupTypeName", "NotificationType");
    formData.append("lookupType", "L");
    const response = await http.post(
      API_URL.COMMON.FETCH_LOOKUPDETAILS,
      formData,
      ""
    );
    return response?.data;
  }
);

/**
 * GET ORGANIZATION LIST API
 */
const getOrganizationList = createAsyncThunk(
  "common/getOrganizationList",
  async () => {
    const response = await http.post(API_URL.ORGANIZATIONS.LIST, {});
    return response?.data;
  }
);

/**
 * GET MEMBER ORGANIZATION LIST API
 */
const getMemberOrganizationList = createAsyncThunk(
  "common/getMemberOrganizationList",
  async () => {
    const response = await http.post(API_URL.COMMON.FETCH_LOOKUPDETAILS, {
      lookupTypeName: "MemberOrganization",
      lookupType: "T"
    });
    return response?.data;
  }
);

/**
 * GET NOTIFICATION STATUS API
 */
const getNotificationStatus = createAsyncThunk(
  "common/getNotificationStatus",
  async () => {
    const response = await http.post(API_URL.COMMON.FETCH_LOOKUPDETAILS, {
      lookupTypeName: "NotificationStatus",
      lookupType: "L"
    });
    return response?.data;
  }
);

export {
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
};
