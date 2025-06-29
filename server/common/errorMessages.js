//ERROR MESSAGES

module.exports = {
  ERROR_LOGINFAIL: "Login failed", // src/routes/systemAccess.js
  ERROR_UNABLETOLOGIN: "Unable to login user", // src/services/systemAccess.js
  ERROR_MISSINGFIELDS: "All fields are required", // src/routes/systemAccess.js , // src/routes/user.js
  ERROR_FETCHING_DETAILS: "Error fetching details: ", //src/services/user.js, //src/services/userQualificationDetail.js

  ERROR_FETCHING_USERDETAILS: "Error fetching user details: ", // src/routes/user.js , //src/services/systemAccess.js , //src/services/user.js, // src/routes/basicuserdetail.js
  ERROR_LOGINFIELDMISSING: "Login credentials missing", // src/routes/systemAccess.js
  ERROR_SAVINGUSER: "Error Saving user:", // src/routes/systemAccess.js , // src/routes/user.js, //src/services/user.js
  ERROR_FINDINGUSERBYID: `User with the ID not found`, //src/services/user.js, // src/routes/basicuserdetail.js

  ERROR_NOUSER_FOUND: "No matching users found", // src/routes/user.js , //src/services/user.js
  ERROR_NOUSER: "Error finding users:", // src/routes/user.js, src/routes/organizationMember.js, src/services/organizationMember.js
  ERROR_UPDATEFAILED: "Unable to update data", //src/services/user.js , //src/services/userQualificationDetail.js
  ERROR_NOUSERID: "User ID is missing or empty", // src/routes/user.js

  ERROR_MISSINGSEARCHFIELD: "At least one search criteria is required", // src/routes/user.js //SRC/SQL/USER.JS
  ERROR_DELETINGUSER: "Error deleting user:",
  ERROR_ALLFIELDMISSING: "All required fields are missing.", // src/routes/user.js
  ERROR_UPDATINGUSERS: "Error updating users:", // src/routes/user.js

  ERROR_USERIDMISSING: "user ID not found", // src/routes/user.js
  ERROR_ACTIONCODEMISSING: "Action code not found", // src/routes/user.js
  ERROR_NOUSERFOUND: "User not found", //src/services/user.js
  ERROR_NOUSERMATCHSEARCHCRITERIA: "No users found matching the search criteria.", //src/services/user.js
  ERROR_NOPASSWORD_KEY: "Password key is not defined in code", //src/sql/user.js
  ERROR_USER_EXISTS: "EMAIL ALREADY REGISTERED", //src/services/systemAccess.js
  ERROR_USER_EMAIL_EXISTS: "EMAIL OR USER ALREADY EXISTS", //src/services/basicUserDetails.js

  ERROR_ORGANIZATION_NAME_EXISTS: "Organization name already exists", //src/services/organization.js
  ERROR_ORGANIZATION_EMAIL_EXISTS: "Organization email already exists", //src/services/organization.js
  ERROR_ORGANIZATION_NOTFOUND: "Organization not found", //src/services/organization.js
  ERROR_NO_ORGANIZATIONFOUND: "Error finding Organization ", //src/services/organization.js
  ERROR_DELETING_ORGANIZATION: "Unable to delete requested data", //src/services/organization.js
  ERROR_SAVINGORGANIZATION: "Error saving organization", //src/services/organization.js
  ERROR_FETCHING_ORGANIZATIONDETAILS: "ERROR FETCHING ORGANIZATION DETAILS", //src/services/organization.js
  ERROR_FINDINGORGANIZATION_BYID: "Error finding organization by ID", //src/services/organization.js
  ERROR_NOORGANIZATION_ID: "Organization ID is missing ", //src/services/organization.js, src/routes/organizationMember.js

  ERROR_NOORGANIZATION_MEMBER_ID: "Organization member ID is missing ", // src/routes/organizationMember.js
  ERROR_STOP_EXECUTION: "STOP execution ", //src/services/organization.js
  ERROR_TOKEN_NOTPROVIDED: "Token not provided",  //src/common/authMiddleware
  ERROR_TOKEN_FORMATINVALID: "Token format is invalid",   //src/common/authMiddleware
  ERROR_TOKEN_AUTHENTICATIONFAILED: "Failed to authenticate token.",   //src/common/authMiddleware
  ERROR_EMAILEXISTS: "ENTERED EMAIL ALREADY TAKEN" , //src/services/user.js,  src/services/user.js
  ERROR_INVALID_TOKEN: "Invalid token",   //src/common/authMiddleware
  ERROR_INVALID_EMAIL: "Entered Email format is incorrect/invalid Email" , //src/routes/organization.js
  ERROR_SAVING_BASIC_USERDETAILS: "Error saving user basic details",  //src/routes/basicUserDetails.js
  ERROR_NOUSER_BASICDETAILID: "User basic detail ID is missing or empty", // src/routes/basicuserdetail.js
  ERROR_OCCURRED: "An error occurred in the process",   //src/routes/records.js
  ERROR_NOREGIONID: "The regionID or regionType is missing", // src/routes/regionMasters.js , // src/routes/regionMasters.js
  ERROR_FETCHING_REGIONDETAILS:"An error occured while fetching region details", // src/routes/regionMasters.js , // src/routes/regionMasters.js

  ERROR_NOUSER_QUALIFCATIONDETAILID: "User qualificationDetailID not recieved", // src/routes/userQualificationDetail.js, src/sql/userQualificationDetail.js
  ERROR_DUPLICATE_QUALIFICATION: "Enrollment number or qualificationType is  already Registered", //src/services/userQualificationDetail.js
  ERROR_NOUSERQUALIFICATION_FOUND: "User qualification details not found", // src/routes/userQualificationDetail.js 
  ERROR_NOUSERQUALIFICATIONS_FOUND: "No matching user qualifications found", // src/routes/userQualificationDetail.js , //src/services/userQualificationDetail.js
  ERROR_SAVING_BASIC_QUALIFICATIONDETAILS: "Error saving user Qualification details",  //src/routes/userQualificationDetail.js
  ERROR_UPDATINGQUALIFICATION: "Error updating user Qualification:", // src/routes/userQualificationDetail.js
  ERROR_DELETINGQUALIFICATION: "Error deleting user qualification:", //src/services/userQualificationDetail.js
  ERROR_FAILED_DELETING_IMAGE: "Failed to delete image:", // src/routes/userQualificationDetail.js
  ERROR_FAILED_FILEUPLOAD: "File upload failed", // src/routes/userQualificationDetail.js
  ERROR_FAILED_CONFIGURE_CLOUDINARY: "Failed to configure Cloudinary storage", // src/routes/userQualificationDetail.js

  ERROR_NOREGIONFOUND: "Region not found", //src/services/commonFunctions.js

  ERROR_SAVING_USER_CONTACTDETAILS: "Error saving user contact details",  //src/routes/userContactDetail.js
  ERROR_NOUSER_CONTACTDETAILID: "User contact detail ID is missing", // src/routes/userContactDetail.js
  ERROR_UPDATINGUSERCONTACT: "Error updating user contact details:", // src/routes/userContactDetail.js
  ERROR_NOLOOKUP_DETAILS: "Lookup details are missing", // src\routes\commonFunctions.js, src\services\commonFunctions.js
  ERROR_FETCHING_LOOKUPDETAILS: "An error occured while fetching lookup details", //src\routes\commonFunctions.js
  ERROR_DELETING_USER_CONTACTDETAILS: "Error deleting user contact details",  //src/routes/userContactDetail.js
  ERROR_NOUSER_CONTACTDETAILS_FOUND: "User contact details not found", // src/routes/userContactDetail.js , //src/services/userContactDetail.js
  ERROR_USER_CONTACTDETAILEXISTS: "User contact detail Already exists OR Email Already taken", // src/routes/userContactDetail.js

  ERROR_SAVINGACTIVITY: "Error saving activity", //src/services/activity.js
  ERROR_SAVINGORGANIZATIONACTIVITY: "Error saving organization Activity", //src/services/activity.js
  ERROR_ACTIVITYEXISTS: "Activity already exists", //src/routes/activity.js
  ERROR_UPDATINGACTIVITY: "Error updating activity:", // src/routes/activity.js  src/services/activity.js
  ERROR_NOACTIVITY_FOUND: "No matching activity found", // src/routes/activity.js , //src/services/activity.js
  ERROR_NOACTIVITY_ID: "activity ID is missing ", //src/routes/activity.js  src/services/activity.js   src/sql/activity.js
  ERROR_FETCHING_ACTIVITYDETAILS: "Error fetching organization activity details", //src/routes/activity.js,  src/services/activity.js
  ERROR_DELETING_ACTIVITY: "Unable to delete requested data", //src/services/activity.js

  ERROR_FINDINGORGANIZATION_ACTIVITYBYID: "Error finding organization by id", //src/services/organizationActivity.js
  ERROR_NO_ORGANIZATIONACTIVITYFOUND: "Error finding Organization Activities", //src/services/organizationActivity.js
  ERROR_NOORGANIZATIONACTIVITY_ID: "Organization activity ID is missing ", //src/services/organizationactivity.js  
  ERROR_FETCHING_ORGANIZATIONACTIVITYDETAILS: "ERROR FETCHING ORGANIZATION ACTIVITY DETAILS", //src/services/organizationActivity.js
  ERROR_SAVINGORGANIZATIONACTIVITY: "Error saving organization activity", //src/services/organizationActivity.js

  ERROR_SAVING_AVATAR: "Error saving user Profile photo",  //src/routes/user.js
  ERROR_UPDATING_AVATAR: "Error updating user Profile photo", // src/routes/user.js
  ERROR_AVATAR_NOTFOUND: "No matching user Profile photo found", // src/routes/user.js

  ERROR_NO_MEMBER_ID: "Member Id is missing", // src/routes/organizationMember.js
  ERROR_ORGANIZATION_ID_NOT_EXISTS: "Organization Id not exists in organization table", // src/services/organizationMember.js
  ERROR_MEMBER_ID_NOT_EXISTS: "Member Id not exists in user table",

  ERROR_SAVINGORGANIZATIONMEMBER: "Error saving organization member", // src/routes/organizationMember.js
  ERROR_NO_ORGANIZATIONMEMBERFOUND: "Error finding Organization member", // src/services/organizationMember.js
  ERROR_UPDATING_ORGANIZATION_MEMBER: "Error updating organization member: ", // src/routes/organizationMember.js
  ERROR_UPDATING_ORGANIZATION_MEMBER_STATUS: "Error updating organization member status: ", // src/routes/organizationMember.js
  ERROR_NO_ORGANIZATION_MEMBER_FOUND: "No matching organization member found", // src/routes/organizationMember.js
  ERROR_FETCHING_ORGANIZATION_MEMBER_DETAILS: "Error fetching organization member details", //src/services/organizationMember.js
  ERROR_FETCHING_ORGANIZATION_MEMBERS_STATUS_DETAILS: "Error fetching organization members status details", //src/services/organizationMember.js, // src/routes/organizationMember.js
  ERROR_FINDING_ORGANIZATION_MEMBER_BYID: "Error finding organization member by id", //src/services/organizationMember.js
  ERROR_NO_ORGANIZATION_MEMBER_ID: "Organization member ID is missing or empty", // src/routes/organizationMember.js
  ERROR_DELETING_ORGANIZATION_MEMBER_DETAILS: "Error deleting organization member details", // src/routes/organizationMember.js
  ERROR_DELETING_ORGANIZATION_MEMBER: "Unable to delete organization member", // src/service/organizationMember.js
  ERROR_ORGANIZATION_MEMBER_EXISTS: "Organization member already exists", // src/services/organizationMember.js
  ERROR_UPDATE_ORGANIZATION_MEMBER_OWNERSHIP: "Error updating organization ownership details", // src/routes/organizationMember.js
  ERROR_CHANGE_OWNER_REQUIRED_FIELDS: "organizationID, userIDs, isOwner fileds are required", // src/routes/organizationMember.js

  ERROR_SAVINGORGANIZATIONDEPARTMENT: "Error saving organization department", // src/routes/organizationDepartment.js, src/service/organizationDepartment.js
  ERROR_ORGANIZATION_DEPARTMENT_EXISTS: "Organization department already exists", // src/service/organizationDepartment.js
  ERROR_FETCHING_ORGANIZATION_DEPARTMENT_DETAILS: "Error fetching organization department details", //src/services/organizationDepartment.js
  ERROR_NOORGANIZATION_DEPARTMENT_ID: "Organization department ID is missing ", // src/routes/organizationDepartment.js
  ERROR_FINDING_ORGANIZATION_DEPARTMENT_BYID: "Error finding organization department by ID", //src/services/organizationDepartment.js
  ERROR_ORGANIZATION_DEPARTMENT_MEMBER_EXISTS: "Organization department member already exists", // src/service/organizationDepartmentmember.js
  ERROR_SAVING_ORGANIZATIONDEPARTMENTMEMBER: "Error saving organization department member", // src/routes/organizationDepartmentmember.js, src/service/organizationDepartmentmember.js
  ERROR_FETCHING_ORGANIZATION_DEPARTMENT_MEMBER_DETAILS: "Error fetching organization department member details", //src/services/organizationDepartmentmember.js
  ERROR_NO_ORGANIZATION_DEPARTMENT_MEMBER_ID: "Error finding organization department member by ID", //src/services/organizationDepartmentmember.js
  ERROR_FINDING_ORGANIZATION_DEPARTMENT_MEMBER_BYID: "Error finding organization department member by ID", //src/services/organizationDepartmentmember.js
  ERROR_DELETING_ORGANIZATION_DEPARTMENT_MEMBER: "Error deleting organization department member by ID",//src/routes/organizationDepartmentmember.js
  ERROR_DELETING_ORGANIZATION_DEPARTMENT: "Error deleting organization department by ID",//src/routes/organizationDepartment.js
  ERROR_UPDATING_ORGANIZATION_DEPARTMENT: "Error updating organization department:", //src/routes/organizationDepartment.js

  ERROR_DELETING_ORGANIZATION_ACTIVITY: "Error deleting organization activity by ID",//src/routes/organizationActivity.js

  ERROR_SAVINGORGANIZATION_TEAM: "Error saving organization team", // src/routes/organizationTeam.js, src/service/organizationTeam.js
  ERROR_ORGANIZATION_TEAM_EXISTS: "Organization team already exists", // src/service/organizationTeam.js
  ERROR_ORGANIZATION_TEAMID_MISSING: "Organization team ID not found", // src/routes/organizationTeam.js
  ERROR_UPDATING_ORGANIZATION_TEAM: "Error updating Organization team :", //src/routes/organizationTeam.js
  ERROR_FETCHING_ORGANIZATION_TEAM_DETAILS: "Error fetching organization team details", //src/routes/organizationTeam.js
  ERROR_DELETING_ORGANIZATION_TEAM: "Error deleting organization team by ID",//src/routes/organizationTeam.js,   src/service/organizationTeam.js

  ERROR_SAVINGORGANIZATION_DEPARTMENT_TEAM: "Error saving organization department team", //src/routes/organizationdepartmentTeam.js,   src/service/organizationdepartmentTeam.js
  ERROR_ORGANIZATION_DEPARTMENT_TEAM_EXISTS: "Organization department team already exists", // src/service/organizationdepartmentTeam.js
  ERROR_FETCHING_ORGANIZATION_DEPARTMENT_TEAM_DETAILS: "Error fetching organization department team details", // src/service/organizationdepartmentTeam.js, src/routes/organizationdepartmentTeam.js
  ERROR_ORGANIZATION_DEPARTMENT_TEAMID_MISSING: "Organization department team ID not found", // src/routes/organizationDepartmentTeam.js
  ERROR_DELETING_ORGANIZATION_DEPARTMENT_TEAM: "Error deleting organization department team by ID",//src/routes/organizationDepartmentTeam.js,   src/service/organizationDepartmentTeam.js
  ERROR_NOORGANIZATION_DEPARTMENT_TEAM_ID: "Organization department team ID is missing ", // src/routes/organizationDepartmentTeam.js
  ERROR_UPDATING_ORGANIZATION_DEPARTMENT_TEAM: "Error updating organization department team:", //src/routes/organizationdepartmentTeam.js

  ERROR_SAVINGORGANIZATION_TEAMDETAIL: "Error saving organization teamDetail", // src/routes/organizationTeamDetail.js, src/service/organizationTeamDetail.js
  ERROR_ORGANIZATION_TEAMDETAIL_EXISTS: "OrganizationTeamDetail already exists", // src/service/organizationTeamDetail.js
  ERROR_ORGANIZATION_TEAMDETAILID_MISSING: "Organization teamDetailID not found", // src/routes/organizationTeamDetail.js
  ERROR_UPDATING_ORGANIZATION_TEAMDETAIL: "Error updating Organization teamDetail :", //src/routes/organizationTeamDetail.js
  ERROR_FETCHING_ORGANIZATION_TEAMDETAIL: "Error fetching organization teamDetail details", //src/routes/organizationTeamDetail.js
  ERROR_DELETING_ORGANIZATION_TEAMDETAIL: "Error deleting organization teamDetail by ID",//src/routes/organizationTeamDetail.js,   src/service/organizationTeamDetail.js
  ERROR_NO_ORGANIZATION_TEAM_DETAIL_FOUND: "Error finding Organization team detail", //src/routes/organizationTeamDetail.js
  
  ERROR_SAVINGACTIVITY_DETAIL: "Error saving activityDetail",  //src/routes/ActivityDetail.js, //src/services/ActivityDetail.js
  ERROR_ACTIVITYDETAIL_EXISTS: "ActivityDetail already exists", //src/routes/ActivityDetail.js, //src/services/ActivityDetail.js
  ERROR_ACTIVITYDETAILID_MISSING: "ActivityDetailID not found", // src/routes/ActivityDetail.js
  ERROR_UPDATING_ACTIVITYDETAIL: "Error updating ActivityDetail :", //src/routes/ActivityDetail.js
  ERROR_FETCHING_ACTIVITYDETAIL: "Error fetching ActivityDetail details", //src/routes/ActivityDetail.js
  ERROR_DELETING_ACTIVITYDETAIL: "Error deleting ActivityDetail by ID",//src/routes/ActivityDetail.js,   src/service/ActivityDetail.js
  
  ERROR_SAVINGORGANIZATION_FACILITY: "Error saving organization facility", // src/routes/organizationFacility.js, src/service/organizationFacility.js
  ERROR_ORGANIZATION_FACILITY_EXISTS: "Organization facility already exists", // src/service/organizationFacility.js
  ERROR_ORGANIZATION_FACILITYID_MISSING: "Organization facilityID not found", // src/routes/organizationFacility.js
  ERROR_UPDATING_ORGANIZATION_FACILITY: "Error updating Organization facility :", //src/routes/organizationFacility.js
  ERROR_FETCHING_ORGANIZATION_FACILITY: "Error fetching organization facility details", //src/routes/organizationFacility.js
  ERROR_DELETING_ORGANIZATION_FACILITY: "Error deleting organization facility by ID",//src/routes/organizationFacility.js,   src/service/organizationFacility.js
  ERROR_NO_ORGANIZATION_FACILITY_FOUND: "Error finding Organization facility", //src/routes/organizationFacility.js
  ERROR_ORGANIZATION_MEMBERSTATUS: "Error finding organization member's status", //src/routes/commonFunctions.js

  ERROR_SAVING_ORGANIZATION_ROLE: "Error saving organization role", // src/routes/organizationRole.js, src/service/organizationRole.js
  ERROR_ORGANIZATION_ROLE_EXISTS: "Organization role already exists", // src/service/organizationRole.js
  ERROR_ORGANIZATION_ROLEID_MISSING: "Organization role ID not found", // src/routes/organizationRole.js
  ERROR_UPDATING_ORGANIZATION_ROLE: "Error updating organization role", // src/routes/organizationRole.js
  ERROR_FETCHING_ORGANIZATION_ROLE_DETAILS: "Error fetching organization role details", // src/routes/organizationRole.js
  ERROR_DELETING_ORGANIZATION_ROLE: "Error deleting organization role by ID", // src/routes/organizationRole.js, src/service/organizationRole.js

  ERROR_SAVING_ORGANIZATION_USER_ROLE: "Error saving organization user role", // src/routes/organizationUserRole.js, src/service/organizationUserRole.js
  ERROR_ORGANIZATION_USER_ROLE_EXISTS: "Organization user role already exists", // src/service/organizationUserRole.js
  ERROR_ORGANIZATION_USER_ROLEID_MISSING: "Organization user role ID not found", // src/routes/organizationUserRole.js
  ERROR_UPDATING_ORGANIZATION_USER_ROLE: "Error updating organization user role", // src/routes/organizationUserRole.js
  ERROR_FETCHING_ORGANIZATION_USER_ROLE_DETAILS: "Error fetching organization user role details", // src/routes/organizationUserRole.js
  ERROR_DELETING_ORGANIZATION_USER_ROLE: "Error deleting organization user role by ID", // src/routes/organizationUserRole.js, src/service/organizationUserRole.js

  ERROR_SAVING_NOTIFICATION: "Error saving notification details", // src/routes/notification.js, src/service/notification.js
  ERROR_NOTIFICATION_EXISTS: "Notification already exists", // src/service/notification.js
  ERROR_NOTIFICATION_ID_MISSING: "Notification ID not found", // src/routes/notification.js
  ERROR_UPDATING_NOTIFICATION: "Error updating notification details", // src/routes/notification.js
  ERROR_UPDATING_NOTIFICATION_STATUS: "Error updating notification status details", // src/routes/notification.js
  ERROR_FETCHING_NOTIFICATION_DETAILS: "Error fetching notification details", // src/routes/notification.js
  ERROR_DELETING_NOTIFICATION: "Error deleting notification by ID", // src/routes/notification.js, src/service/notification.js

  ERROR_FETCHING_NOTIFICATION_STATUS_DETAILS: "Error fetching notification status details", // src/routes/notification.js

  ERROR_GENERATING_AND_STORING_OTP: "Error generating and/or storing OTP",// src/service/user.js
  INVALID_TEMPLATE_ACTION: "Invalid template action OR user with that email does not exists",// src/service/user.js
  ERROR_UPDATING_PASSWORD: "Error updating password", // src/service/user.js

  ERROR_NO_ACCESSFOUND: "An error occured while checking access",// src\routes\commonFunctions.js, src\services\commonFunctions.js
};
