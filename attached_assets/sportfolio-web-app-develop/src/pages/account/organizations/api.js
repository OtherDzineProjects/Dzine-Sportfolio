import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "common/url";
import { http } from "utils/http";

const saveOrg = createAsyncThunk("org/saveOrg", async (data) => {
  const response = await http.post(API_URL.ORGANIZATIONS.CREATE, data);
  return response?.data;
});

const searchOrg = createAsyncThunk("org/searchOrg", async ({ data, query }) => {
  const response = await http.post(
    API_URL.ORGANIZATIONS.FETCH.replace("?query", query),
    data
  );
  return response?.data;
});

const advancedSearchOrg = createAsyncThunk(
  "org/advancedSearchOrg",
  async ({ data, query }) => {
    const response = await http.post(
      API_URL.ORGANIZATIONS.ADVANCED_FETCH.replace("?query", query),
      data
    );
    return response?.data;
  }
);

const getOrgByID = createAsyncThunk("org/getOrgByID", async (data) => {
  const response = await http.get(
    API_URL.ORGANIZATIONS.FETCH_BY_ID.replace(":id", data)
  );
  return response?.data;
});

const updateOrg = createAsyncThunk("org/updateOrg", async ({ id, data }) => {
  const response = await http.put(
    API_URL.ORGANIZATIONS.UPDATE.replace(":id", id),
    data
  );
  return response?.data;
});

const deleteOrg = createAsyncThunk("org/deleteOrg", async (data) => {
  const response = await http.delete(
    API_URL.ORGANIZATIONS.DELETE.replace(":id", data)
  );
  return response?.data;
});

const saveOrgAvatar = createAsyncThunk("org/saveOrgAvatar", async (data) => {
  const response = await http.post(API_URL.ORGANIZATIONS.AVATAR, data, "");
  return response?.data;
});

const searchOrganizationActivity = createAsyncThunk(
  "org/searchOrganizationActivity",
  async (data) => {
    const response = await http.post(
      API_URL.ORGANIZATIONS.SEARCH_ACTIVITY,
      data
    );
    return response?.data;
  }
);

const saveOrganizationActivity = createAsyncThunk(
  "org/saveOrganizationActivity",
  async (data) => {
    const response = await http.post(API_URL.ORGANIZATIONS.SAVE_ACTIVITY, data);
    return response?.data;
  }
);

const deleteOrganizationActivity = createAsyncThunk(
  "org/deleteOrganizationActivity",
  async (data) => {
    const response = await http.delete(
      API_URL.ORGANIZATIONS.DELETE_ACTIVITY.replace(":id", data)
    );
    return response?.data;
  }
);

const fetchActivityList = createAsyncThunk(
  "org/fetchActivityList",
  async () => {
    const response = await http.post(
      API_URL.ORGANIZATIONS.FETCH_ACTIVITYLIST,
      {}
    );
    return response?.data;
  }
);

const fetchActivityChildList = createAsyncThunk(
  "org/fetchActivityChildList",
  async (data) => {
    const response = await http.post(API_URL.ORGANIZATIONS.FETCH_ACTIVITYLIST, {
      parentID: data
    });
    return response?.data;
  }
);

const searchOrgMembers = createAsyncThunk(
  "org/searchOrgMembers",
  async (query) => {
    const response = await http.post(
      API_URL.ORGANIZATIONS.SEARCH_MEMBERS.replace("?query", query),
      {}
    );
    return response?.data;
  }
);

const getOrgMemberCount = createAsyncThunk(
  "org/getOrgMemberCount",
  async (id) => {
    const response = await http.get(
      API_URL.ORGANIZATIONS.GET_MEMBERS_COUNT.replace(":orgID", id)
    );
    return response?.data;
  }
);

const advancedSearchOrgMembers = createAsyncThunk(
  "org/advancedSearchOrgMembers",
  async ({ data, query }) => {
    const response = await http.post(
      API_URL.ORGANIZATIONS.SEARCH_MEMBERS.replace("?query", query),
      data
    );
    return response?.data;
  }
);

const searchUsersForOrg = createAsyncThunk(
  "org/searchUsersForOrg",
  async ({ data, query }) => {
    const response = await http.post(
      API_URL.ORGANIZATIONS.SEARCH_USERS.replace("?query", query),
      data
    );
    return response?.data;
  }
);

const fetchExistingOrgMembers = createAsyncThunk(
  "org/fetchExistingOrgMembers",
  async ({ data, query }) => {
    const response = await http.post(
      API_URL.ORGANIZATIONS.SEARCH_MEMBERS.replace("?query", query),
      { ...data, type: "A" }
    );
    return response?.data;
  }
);

const searchExistingOrgMembers = createAsyncThunk(
  "org/searchExistingOrgMembers",
  async ({ data, query }) => {
    const response = await http.post(
      API_URL.ORGANIZATIONS.SEARCH_MEMBERS.replace("?query", query),
      { ...data, type: "A" }
    );
    return response?.data;
  }
);

const fetchPendingOrgMembers = createAsyncThunk(
  "org/fetchPendingOrgMembers",
  async ({ data, query }) => {
    const response = await http.post(
      API_URL.ORGANIZATIONS.SEARCH_MEMBERS.replace("?query", query),
      { ...data, type: "P", isOrganizationInitiated: 1 }
    );
    return response?.data;
  }
);

const fetchOrgApplicationsMembers = createAsyncThunk(
  "org/fetchOrgApplicationsMembers",
  async ({ data, query }) => {
    const response = await http.post(
      API_URL.ORGANIZATIONS.SEARCH_MEMBERS.replace("?query", query),
      { ...data, type: "P", isOrganizationInitiated: 0 }
    );
    return response?.data;
  }
);

const fetchOrgInvitationsReceived = createAsyncThunk(
  "org/fetchOrgInvitationsReceived",
  async ({ data, query }) => {
    const response = await http.post(
      API_URL.ORGANIZATIONS.SEARCH_MEMBERS.replace("?query", query),
      { ...data, type: "I", isOrganizationInitiated: 1 }
    );
    return response?.data;
  }
);

const inviteMember = createAsyncThunk("org/inviteMember", async (data) => {
  const response = await http.post(API_URL.ORGANIZATIONS.ADD_MEMBER, {
    ...data,
    isOrganizationInitiated: 1
  });
  return response?.data;
});

const applyOrgMembership = createAsyncThunk(
  "org/applyOrgMembership",
  async (data) => {
    const response = await http.post(API_URL.ORGANIZATIONS.ADD_MEMBER, {
      ...data,
      isOrganizationInitiated: 0
    });
    return response?.data;
  }
);

const changeMemberStatus = createAsyncThunk(
  "org/changeMemberStatus",
  async (data) => {
    const response = await http.put(
      API_URL.ORGANIZATIONS.CHANGE_MEMBER_STATUS,
      data
    );
    return response?.data;
  }
);

const checkOrgMembership = createAsyncThunk(
  "org/checkOrgMembership",
  async (orgID) => {
    const response = await http.get(
      API_URL.ORGANIZATIONS.CHECK_MEMBER_STATUS.replace(":orgID", orgID)
    );
    return response?.data;
  }
);

const getOrgPermissions = createAsyncThunk(
  "org/getOrgPermissions",
  async (orgID) => {
    const response = await http.get(
      API_URL.ORGANIZATIONS.PERMISSIONS.replace(":id", orgID)
    );
    return response?.data;
  }
);

const setMemberAsAdmin = createAsyncThunk(
  "org/setMemberAsAdmin",
  async (data) => {
    const response = await http.post(API_URL.ORGANIZATIONS.MAKE_ADMIN, data);
    return response?.data;
  }
);

export {
  saveOrg,
  searchOrg,
  advancedSearchOrg,
  getOrgByID,
  updateOrg,
  deleteOrg,
  saveOrgAvatar,
  searchOrganizationActivity,
  saveOrganizationActivity,
  deleteOrganizationActivity,
  fetchActivityList,
  fetchActivityChildList,
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
  fetchOrgInvitationsReceived,
  getOrgPermissions,
  searchExistingOrgMembers,
  setMemberAsAdmin
};
