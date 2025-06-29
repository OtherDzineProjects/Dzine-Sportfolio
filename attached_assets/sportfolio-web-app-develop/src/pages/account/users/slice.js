import { createSlice } from "@reduxjs/toolkit";
import {
  getUserByID,
  saveUser,
  searchUser,
  advancedSearchUser,
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
} from "./api";
import { API_STATUS } from "pages/common/constants";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    newUserDialog: false
  },
  reducers: {
    resetUsersList(state) {
      state.searchUserRes = null;
      state.searchUserLoading = false;
      state.advancedSearchUserRes = null;
      state.advancedSearchUserLoading = false;
    },
    setNewUserDialog(state, action) {
      state.newUserDialog = action.payload;
    },
    resetUserDetails(state) {
      state.getUserByIDRes = null;
      state.getUserByIDLoading = false;
      state.getUserByIDStatus = null;
      state.searchUserBasicDetailRes = null;
      state.searchUserBasicDetailLoading = false;
      state.searchUserBasicDetailStatus = null;
      state.searchUserContactDetailRes = null;
      state.searchUserContactDetailLoading = false;
      state.searchUserContactDetailStatus = null;
      state.searchUserQualificationRes = null;
      state.searchUserQualificationLoading = false;
      state.searchUserQualificationStatus = null;
      state.getUserPermissionsRes = null;
      state.getUserPermissionsLoading = false;
      state.getUserPermissionsStatus = null;
    },
    resetUserFormActions(state) {
      state.saveUserAvatarStatus = null;
      state.saveUserBasicDetailStatus = null;
      state.updateUserBasicDetailStatus = null;
      state.deleteUserBasicDetailStatus = null;
      state.saveUserContactDetailStatus = null;
      state.updateUserContactDetailStatus = null;
      state.deleteUserContactDetailStatus = null;
      state.saveUserQualificationStatus = null;
      state.updateUserQualificationStatus = null;
      state.deleteUserQualificationStatus = null;
    }
  },

  extraReducers: (builder) => {
    // saveUser form
    builder.addCase(saveUser.fulfilled, (state, action) => {
      (state.saveUserRes = action.payload),
        (state.saveUserLoading = false),
        (state.saveUserStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(saveUser.pending, (state) => {
      (state.saveUserLoading = true),
        (state.saveUserStatus = API_STATUS.PENDING);
    });
    builder.addCase(saveUser.rejected, (state, action) => {
      (state.saveUserRes = action.error.message),
        (state.saveUserLoading = false),
        (state.saveUserStatus = API_STATUS.FAILED);
    });
    // Basic SearchUser [KEYWORD]
    builder.addCase(searchUser.fulfilled, (state, action) => {
      (state.searchUserRes = action.payload),
        (state.searchUserLoading = false),
        (state.searchUserStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(searchUser.pending, (state) => {
      (state.searchUserLoading = true),
        (state.searchUserStatus = API_STATUS.PENDING);
    });
    builder.addCase(searchUser.rejected, (state, action) => {
      (state.searchUserRes = action.error.message),
        (state.searchUserLoading = false),
        (state.searchUserStatus = API_STATUS.FAILED);
    });

    // Advanced SearchUser [PARAMETER-SPECIFIC]
    builder.addCase(advancedSearchUser.fulfilled, (state, action) => {
      (state.advancedSearchUserRes = action.payload),
        (state.advancedSearchUserLoading = false),
        (state.advancedSearchUserStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(advancedSearchUser.pending, (state) => {
      (state.advancedSearchUserLoading = true),
        (state.advancedSearchUserStatus = API_STATUS.PENDING);
    });
    builder.addCase(advancedSearchUser.rejected, (state, action) => {
      (state.advancedSearchUserRes = action.error.message),
        (state.advancedSearchUserLoading = false),
        (state.advancedSearchUserStatus = API_STATUS.FAILED);
    });

    // getUserByID form
    builder.addCase(getUserByID.fulfilled, (state, action) => {
      (state.getUserByIDRes = action.payload),
        (state.getUserByIDLoading = false),
        (state.getUserByIDStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getUserByID.pending, (state) => {
      (state.getUserByIDLoading = true),
        (state.getUserByIDStatus = API_STATUS.PENDING);
    });
    builder.addCase(getUserByID.rejected, (state, action) => {
      (state.getUserByIDRes = action.error.message),
        (state.getUserByIDLoading = false),
        (state.getUserByIDStatus = API_STATUS.FAILED);
    });
    // updateUser form
    builder.addCase(updateUser.fulfilled, (state, action) => {
      (state.updateUserRes = action.payload),
        (state.updateUserLoading = false),
        (state.updateUserStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(updateUser.pending, (state) => {
      (state.updateUserLoading = true),
        (state.updateUserStatus = API_STATUS.PENDING);
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      (state.updateUserRes = action.error.message),
        (state.updateUserLoading = false),
        (state.updateUserStatus = API_STATUS.FAILED);
    });
    // deleteUser form
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      (state.deleteUserRes = action.payload),
        (state.deleteUserLoading = false),
        (state.deleteUserStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(deleteUser.pending, (state) => {
      (state.deleteUserLoading = true),
        (state.deleteUserStatus = API_STATUS.PENDING);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      (state.deleteUserRes = action.error.message),
        (state.deleteUserLoading = false),
        (state.deleteUserStatus = API_STATUS.FAILED);
    });

    // Save User Avatar
    builder.addCase(saveUserAvatar.fulfilled, (state, action) => {
      (state.saveUserAvatarRes = action.payload),
        (state.saveUserAvatarLoading = false),
        (state.saveUserAvatarStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(saveUserAvatar.pending, (state) => {
      (state.saveUserAvatarLoading = true),
        (state.saveUserAvatarStatus = API_STATUS.PENDING);
    });
    builder.addCase(saveUserAvatar.rejected, (state, action) => {
      (state.saveUserAvatarRes = action.error.message),
        (state.saveUserAvatarLoading = false),
        (state.saveUserAvatarStatus = API_STATUS.FAILED);
    });

    // getUserBasicDetail form
    builder.addCase(getUserBasicDetails.fulfilled, (state, action) => {
      (state.getUserBasicDetailRes = action.payload),
        (state.getUserBasicDetailLoading = false),
        (state.getUserBasicDetailStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getUserBasicDetails.pending, (state) => {
      (state.getUserBasicDetailLoading = true),
        (state.getUserBasicDetailStatus = API_STATUS.PENDING);
    });
    builder.addCase(getUserBasicDetails.rejected, (state, action) => {
      (state.getUserBasicDetailRes = action.error.message),
        (state.getUserBasicDetailLoading = false),
        (state.getUserBasicDetailStatus = API_STATUS.FAILED);
    });

    // searchUserBasicDetail form
    builder.addCase(searchUserBasicDetails.fulfilled, (state, action) => {
      (state.searchUserBasicDetailRes = action.payload),
        (state.searchUserBasicDetailLoading = false),
        (state.searchUserBasicDetailStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(searchUserBasicDetails.pending, (state) => {
      (state.searchUserBasicDetailLoading = true),
        (state.searchUserBasicDetailStatus = API_STATUS.PENDING);
    });
    builder.addCase(searchUserBasicDetails.rejected, (state, action) => {
      (state.searchUserBasicDetailRes = action.error.message),
        (state.searchUserBasicDetailLoading = false),
        (state.searchUserBasicDetailStatus = API_STATUS.FAILED);
    });

    // saveUserBasicDetail form
    builder.addCase(saveUserBasicDetails.fulfilled, (state, action) => {
      (state.saveUserBasicDetailRes = action.payload),
        (state.saveUserBasicDetailLoading = false),
        (state.saveUserBasicDetailStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(saveUserBasicDetails.pending, (state) => {
      (state.saveUserBasicDetailLoading = true),
        (state.saveUserBasicDetailStatus = API_STATUS.PENDING);
    });
    builder.addCase(saveUserBasicDetails.rejected, (state, action) => {
      (state.saveUserBasicDetailRes = action.error.message),
        (state.saveUserBasicDetailLoading = false),
        (state.saveUserBasicDetailStatus = API_STATUS.FAILED);
    });

    // updateUserBasicDetail form
    builder.addCase(updateUserBasicDetails.fulfilled, (state, action) => {
      (state.updateUserBasicDetailRes = action.payload),
        (state.updateUserBasicDetailLoading = false),
        (state.updateUserBasicDetailStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(updateUserBasicDetails.pending, (state) => {
      (state.updateUserBasicDetailLoading = true),
        (state.updateUserBasicDetailStatus = API_STATUS.PENDING);
    });
    builder.addCase(updateUserBasicDetails.rejected, (state, action) => {
      (state.updateUserBasicDetailRes = action.error.message),
        (state.updateUserBasicDetailLoading = false),
        (state.updateUserBasicDetailStatus = API_STATUS.FAILED);
    });

    // deleteUserBasicDetail form
    builder.addCase(deleteUserBasicDetails.fulfilled, (state, action) => {
      (state.deleteUserBasicDetailRes = action.payload),
        (state.deleteUserBasicDetailLoading = false),
        (state.deleteUserBasicDetailStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(deleteUserBasicDetails.pending, (state) => {
      (state.deleteUserBasicDetailLoading = true),
        (state.deleteUserBasicDetailStatus = API_STATUS.PENDING);
    });
    builder.addCase(deleteUserBasicDetails.rejected, (state, action) => {
      (state.deleteUserBasicDetailRes = action.error.message),
        (state.deleteUserBasicDetailLoading = false),
        (state.deleteUserBasicDetailStatus = API_STATUS.FAILED);
    });

    // getUserContactDetails form
    builder.addCase(getUserContactDetails.fulfilled, (state, action) => {
      (state.getUserContactDetailRes = action.payload),
        (state.getUserContactDetailLoading = false),
        (state.getUserContactDetailStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getUserContactDetails.pending, (state) => {
      (state.getUserContactDetailLoading = true),
        (state.getUserContactDetailStatus = API_STATUS.PENDING);
    });
    builder.addCase(getUserContactDetails.rejected, (state, action) => {
      (state.getUserContactDetailRes = action.error.message),
        (state.getUserContactDetailLoading = false),
        (state.getUserContactDetailStatus = API_STATUS.FAILED);
    });

    // searchUserContactDetails form
    builder.addCase(searchUserContactDetails.fulfilled, (state, action) => {
      (state.searchUserContactDetailRes = action.payload),
        (state.searchUserContactDetailLoading = false),
        (state.searchUserContactDetailStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(searchUserContactDetails.pending, (state) => {
      (state.searchUserContactDetailLoading = true),
        (state.searchUserContactDetailStatus = API_STATUS.PENDING);
    });
    builder.addCase(searchUserContactDetails.rejected, (state, action) => {
      (state.searchUserContactDetailRes = action.error.message),
        (state.searchUserContactDetailLoading = false),
        (state.searchUserContactDetailStatus = API_STATUS.FAILED);
    });

    // saveUserContactDetails form
    builder.addCase(saveUserContactDetails.fulfilled, (state, action) => {
      (state.saveUserContactDetailRes = action.payload),
        (state.saveUserContactDetailLoading = false),
        (state.saveUserContactDetailStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(saveUserContactDetails.pending, (state) => {
      (state.saveUserContactDetailLoading = true),
        (state.saveUserContactDetailStatus = API_STATUS.PENDING);
    });
    builder.addCase(saveUserContactDetails.rejected, (state, action) => {
      (state.saveUserContactDetailRes = action.error.message),
        (state.saveUserContactDetailLoading = false),
        (state.saveUserContactDetailStatus = API_STATUS.FAILED);
    });

    // updateUserContactDetails form
    builder.addCase(updateUserContactDetails.fulfilled, (state, action) => {
      (state.updateUserContactDetailRes = action.payload),
        (state.updateUserContactDetailLoading = false),
        (state.updateUserContactDetailStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(updateUserContactDetails.pending, (state) => {
      (state.updateUserContactDetailLoading = true),
        (state.updateUserContactDetailStatus = API_STATUS.PENDING);
    });
    builder.addCase(updateUserContactDetails.rejected, (state, action) => {
      (state.updateUserContactDetailRes = action.error.message),
        (state.updateUserContactDetailLoading = false),
        (state.updateUserContactDetailStatus = API_STATUS.FAILED);
    });

    // deleteUserContactDetail form
    builder.addCase(deleteUserContactDetails.fulfilled, (state, action) => {
      (state.deleteUserContactDetailRes = action.payload),
        (state.deleteUserContactDetailLoading = false),
        (state.deleteUserContactDetailStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(deleteUserContactDetails.pending, (state) => {
      (state.deleteUserContactDetailLoading = true),
        (state.deleteUserContactDetailStatus = API_STATUS.PENDING);
    });
    builder.addCase(deleteUserContactDetails.rejected, (state, action) => {
      (state.deleteUserContactDetailRes = action.error.message),
        (state.deleteUserContactDetailLoading = false),
        (state.deleteUserContactDetailStatus = API_STATUS.FAILED);
    });

    // getUserQualifications form
    builder.addCase(getUserQualifications.fulfilled, (state, action) => {
      (state.getUserQualificationRes = action.payload),
        (state.getUserQualificationLoading = false),
        (state.getUserQualificationStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getUserQualifications.pending, (state) => {
      (state.getUserQualificationLoading = true),
        (state.getUserQualificationStatus = API_STATUS.PENDING);
    });
    builder.addCase(getUserQualifications.rejected, (state, action) => {
      (state.getUserQualificationRes = action.error.message),
        (state.getUserQualificationLoading = false),
        (state.getUserQualificationStatus = API_STATUS.FAILED);
    });

    // searchUserQualifications form
    builder.addCase(searchUserQualifications.fulfilled, (state, action) => {
      (state.searchUserQualificationRes = action.payload),
        (state.searchUserQualificationLoading = false),
        (state.searchUserQualificationStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(searchUserQualifications.pending, (state) => {
      (state.searchUserQualificationLoading = true),
        (state.searchUserQualificationStatus = API_STATUS.PENDING);
    });
    builder.addCase(searchUserQualifications.rejected, (state, action) => {
      (state.searchUserQualificationRes = action.error.message),
        (state.searchUserQualificationLoading = false),
        (state.searchUserQualificationStatus = API_STATUS.FAILED);
    });

    // saveUserQualifications form
    builder.addCase(saveUserQualifications.fulfilled, (state, action) => {
      (state.saveUserQualificationRes = action.payload),
        (state.saveUserQualificationLoading = false),
        (state.saveUserQualificationStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(saveUserQualifications.pending, (state) => {
      (state.saveUserQualificationLoading = true),
        (state.saveUserQualificationStatus = API_STATUS.PENDING);
    });
    builder.addCase(saveUserQualifications.rejected, (state, action) => {
      (state.saveUserQualificationRes = action.error.message),
        (state.saveUserQualificationLoading = false),
        (state.saveUserQualificationStatus = API_STATUS.FAILED);
    });

    // updateUserQualifications form
    builder.addCase(updateUserQualifications.fulfilled, (state, action) => {
      (state.updateUserQualificationRes = action.payload),
        (state.updateUserQualificationLoading = false),
        (state.updateUserQualificationStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(updateUserQualifications.pending, (state) => {
      (state.updateUserQualificationLoading = true),
        (state.updateUserQualificationStatus = API_STATUS.PENDING);
    });
    builder.addCase(updateUserQualifications.rejected, (state, action) => {
      (state.updateUserQualificationRes = action.error.message),
        (state.updateUserQualificationLoading = false),
        (state.updateUserQualificationStatus = API_STATUS.FAILED);
    });

    // deleteUserQualifications form
    builder.addCase(deleteUserQualifications.fulfilled, (state, action) => {
      (state.deleteUserQualificationRes = action.payload),
        (state.deleteUserQualificationLoading = false),
        (state.deleteUserQualificationStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(deleteUserQualifications.pending, (state) => {
      (state.deleteUserQualificationLoading = true),
        (state.deleteUserQualificationStatus = API_STATUS.PENDING);
    });
    builder.addCase(deleteUserQualifications.rejected, (state, action) => {
      (state.deleteUserQualificationRes = action.error.message),
        (state.deleteUserQualificationLoading = false),
        (state.deleteUserQualificationStatus = API_STATUS.FAILED);
    });

    // Get User CRUD permissions
    builder
      .addCase(getUserPermissions.fulfilled, (state, action) => {
        (state.getUserPermissionsRes = action.payload),
          (state.getUserPermissionsLoading = false),
          (state.getUserPermissionsStatus = API_STATUS.SUCCESS);
      })
      .addCase(getUserPermissions.pending, (state) => {
        (state.getUserPermissionsLoading = true),
          (state.getUserPermissionsStatus = API_STATUS.PENDING);
      })
      .addCase(getUserPermissions.rejected, (state, action) => {
        (state.getUserPermissionsRes = action.error.message),
          (state.getUserPermissionsLoading = false),
          (state.getUserPermissionsStatus = API_STATUS.FAILED);
      });
  }
});

export const {
  setNewUserDialog,
  resetUserDetails,
  resetUserFormActions,
  resetUsersList
} = usersSlice.actions;

export default usersSlice.reducer;
