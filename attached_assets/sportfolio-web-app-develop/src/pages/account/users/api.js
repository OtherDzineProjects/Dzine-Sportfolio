import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "common/url";
import { http } from "../../../utils/http";

const saveUser = createAsyncThunk("users/saveUser", async (data) => {
  const response = await http.post(API_URL.USERS.CREATE, data);
  return response?.data;
});

const searchUser = createAsyncThunk(
  "users/searchUser",
  async ({ data, query }) => {
    const response = await http.post(
      API_URL.USERS.FETCH.replace("?query", query),
      data
    );
    return response?.data;
  }
);

const advancedSearchUser = createAsyncThunk(
  "users/advancedSearchUser",
  async ({ data, query }) => {
    const response = await http.post(
      API_URL.USERS.ADVANCED_FETCH.replace("?query", query),
      data
    );
    return response?.data;
  }
);

const getUserByID = createAsyncThunk("users/getUserByID", async (data) => {
  const response = await http.get(
    API_URL.USERS.FETCH_BY_ID.replace(":id", data)
  );
  return response?.data;
});

const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, data }) => {
    const response = await http.put(
      API_URL.USERS.UPDATE.replace(":id", id),
      data
    );
    return response?.data;
  }
);

const deleteUser = createAsyncThunk("users/deleteUser", async (data) => {
  const response = await http.delete(API_URL.USERS.DELETE.replace(":id", data));
  return response?.data;
});

const saveUserAvatar = createAsyncThunk(
  "users/saveUserAvatar",
  async (data) => {
    const response = await http.post(API_URL.USERS.AVATAR, data, "");
    return response?.data;
  }
);

const getUserBasicDetails = createAsyncThunk(
  "users/getUserBasicDetails",
  async (data) => {
    const response = await http.get(
      API_URL.USERS.FETCH_BASIC.replace(":userId", data)
    );
    return response?.data;
  }
);

const searchUserBasicDetails = createAsyncThunk(
  "users/searchUserBasicDetails",
  async (data) => {
    const response = await http.post(API_URL.USERS.SEARCH_BASIC, data);
    return response?.data;
  }
);

const saveUserBasicDetails = createAsyncThunk(
  "users/saveUserBasicDetails",
  async (data) => {
    const response = await http.post(API_URL.USERS.SAVE_BASIC, data);
    return response?.data;
  }
);

const updateUserBasicDetails = createAsyncThunk(
  "users/updateUserBasicDetails",
  async (data) => {
    const response = await http.put(API_URL.USERS.SAVE_BASIC, data);
    return response?.data;
  }
);

const deleteUserBasicDetails = createAsyncThunk(
  "users/deleteUserBasicDetails",
  async (data) => {
    const response = await http.delete(
      API_URL.USERS.DELETE_BASIC.replace(":userBasicID", data)
    );
    return response?.data;
  }
);

const getUserContactDetails = createAsyncThunk(
  "users/getUserContactDetails",
  async (data) => {
    const response = await http.get(
      API_URL.USERS.FETCH_CONTACT.replace(":userId", data)
    );
    return response?.data;
  }
);

const searchUserContactDetails = createAsyncThunk(
  "users/searchUserContactDetails",
  async (data) => {
    const response = await http.post(API_URL.USERS.SEARCH_CONTACT, data);
    return response?.data;
  }
);

const saveUserContactDetails = createAsyncThunk(
  "users/saveUserContactDetails",
  async (data) => {
    const response = await http.post(API_URL.USERS.SAVE_CONTACT, data);
    return response?.data;
  }
);

const updateUserContactDetails = createAsyncThunk(
  "users/updateUserContactDetails",
  async (data) => {
    const response = await http.put(API_URL.USERS.SAVE_CONTACT, data);
    return response?.data;
  }
);

const deleteUserContactDetails = createAsyncThunk(
  "users/deleteUserContactDetails",
  async (data) => {
    const response = await http.delete(
      API_URL.USERS.DELETE_CONTACT.replace(":userContactID", data)
    );
    return response?.data;
  }
);

const getUserQualifications = createAsyncThunk(
  "users/getUserQualifications",
  async (data) => {
    const response = await http.get(
      API_URL.USERS.FETCH_QUALIFICATIONS.replace(":userId", data)
    );
    return response?.data;
  }
);

const searchUserQualifications = createAsyncThunk(
  "users/searchUserQualifications",
  async (data) => {
    const response = await http.post(API_URL.USERS.SEARCH_QUALIFICATIONS, data);
    return response?.data;
  }
);

const saveUserQualifications = createAsyncThunk(
  "users/saveUserQualifications",
  async (data) => {
    const response = await http.post(
      API_URL.USERS.SAVE_QUALIFICATIONS,
      data,
      ""
    );
    return response?.data;
  }
);

const updateUserQualifications = createAsyncThunk(
  "users/updateUserQualifications",
  async (data) => {
    const response = await http.put(
      API_URL.USERS.SAVE_QUALIFICATIONS,
      data,
      ""
    );
    return response?.data;
  }
);

const deleteUserQualifications = createAsyncThunk(
  "users/deleteUserQualifications",
  async (data) => {
    const response = await http.delete(
      API_URL.USERS.DELETE_QUALIFICATION.replace(":userQualificationID", data)
    );
    return response?.data;
  }
);

const getUserPermissions = createAsyncThunk(
  "users/getUserPermissions",
  async (orgID) => {
    const response = await http.get(
      API_URL.USERS.PERMISSIONS.replace(":id", orgID)
    );
    return response?.data;
  }
);

export {
  saveUser,
  searchUser,
  advancedSearchUser,
  getUserByID,
  updateUser,
  deleteUser,
  saveUserAvatar,
  getUserBasicDetails,
  searchUserBasicDetails,
  saveUserBasicDetails,
  updateUserBasicDetails,
  deleteUserBasicDetails,
  getUserContactDetails,
  searchUserContactDetails,
  saveUserContactDetails,
  updateUserContactDetails,
  deleteUserContactDetails,
  getUserQualifications,
  searchUserQualifications,
  saveUserQualifications,
  updateUserQualifications,
  deleteUserQualifications,
  getUserPermissions
};
