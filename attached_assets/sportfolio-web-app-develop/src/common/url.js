export const API_URL = {
  AUTH: {
    CREATE_USER: "/user/signup",
    CHECK_USER_EXIST: "/user-exist?query",
    USER_SIGNIN: "/user/login",
    FORGET_PASSWORD: "/reset/password",
    VALIDATE_OTP: "/validateTemporaryPassword"
  },
  COMMON: {
    FETCH_LOCATIONS: "/getLocation/parentID/:parentID/regionType/:regionType",
    FETCH_LOOKUPDETAILS: "/getLookupDetails/lookupTypeName"
  },
  USERS: {
    FETCH: "/key/search/user?query",
    ADVANCED_FETCH: "/search/user?query",
    FETCH_BY_ID: "/get/user/:id",
    CREATE: "/user",
    UPDATE: "/user/:id",
    DELETE: "/user/:id",
    AVATAR: "/user/avatar",
    SEARCH_BASIC: "/search/user/basicdetail",
    FETCH_BASIC: "/get/user/basicdetail/:userId",
    SAVE_BASIC: "/user/basicdetail",
    DELETE_BASIC: "/user/basicdetail/:userBasicID",
    SEARCH_CONTACT: "/search/user/contactdetail",
    FETCH_CONTACT: "/get/user/contactdetail/:userId",
    SAVE_CONTACT: "/user/contactdetail",
    DELETE_CONTACT: "/user/contactdetail/:userContactID",
    FETCH_QUALIFICATIONS: "/get/user/qualificationdetail/:userId",
    SEARCH_QUALIFICATIONS: "/search/user/qualificationdetail",
    SAVE_QUALIFICATIONS: "/user/qualificationdetail",
    DELETE_QUALIFICATION: "/user/qualificationdetail/:userQualificationID",
    PERMISSIONS: "/accessCheck/User/organization/:id"
  },
  ORGANIZATIONS: {
    LIST: "/organization/list",
    FETCH: "/key/search/organization?query",
    ADVANCED_FETCH: "/search/organization?query",
    FETCH_BY_ID: "/get/organization/:id",
    CREATE: "/organization",
    UPDATE: "/organization/:id",
    DELETE: "/organization/:id",
    AVATAR: "/organization/avatar",
    SEARCH_ACTIVITY: "/search/organizationActivity",
    SAVE_ACTIVITY: "/organizationActivity",
    DELETE_ACTIVITY: "/organizationActivity/:id",
    FETCH_ACTIVITYLIST: "/search/organization/activity",
    SEARCH_MEMBERS: "/search/organization/member?query",
    GET_MEMBERS_COUNT: "/get/organizationMembers/status/:orgID",
    SEARCH_USERS: "/organization/member/search?query",
    ADD_MEMBER: "/organization/member",
    CHANGE_MEMBER_STATUS: "/organization/member/status/update",
    CHECK_MEMBER_STATUS: "/disable/applyMembership/:orgID",
    PERMISSIONS: "/accessCheck/Organization/organization/:id",
    MAKE_ADMIN: "/user/organization/isAdmin"
  },
  NOTIFICATIONS: {
    COUNT: "/get/notification/status/count",
    FETCH: "/key/search/notification?query",
    CREATE: "/user/notification",
    UPDATE: "/update/notification",
    UPDATE_STATUS: "/notification/status/update",
    DELETE: "/notification/:id"
  },
  SETTINGS: {
    CHANGE_PASSWWORD: "/update/password"
  }
};
