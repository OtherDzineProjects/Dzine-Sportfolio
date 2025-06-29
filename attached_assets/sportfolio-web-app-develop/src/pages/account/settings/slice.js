import { createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "pages/common/constants";
import { changePassword } from "./api";

export const settingSlice = createSlice({
  name: "setting",
  initialState: {},
  reducers: {
    resetChangePasswordStates(state) {
      state.changePasswordRes = null;
      state.changePasswordLoading = false;
      state.changePasswordStatus = null;
    }
  },
  extraReducers: (builder) => {
    // Change Password
    builder.addCase(changePassword.fulfilled, (state, action) => {
      (state.changePasswordRes = action.payload),
        (state.changePasswordLoading = false),
        (state.changePasswordStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(changePassword.pending, (state) => {
      (state.changePasswordLoading = true),
        (state.changePasswordStatus = API_STATUS.PENDING);
    });
    builder.addCase(changePassword.rejected, (state, action) => {
      (state.changePasswordRes = action.error.message),
        (state.changePasswordLoading = false),
        (state.changePasswordStatus = API_STATUS.FAILED);
    });
  }
});

export const { resetChangePasswordStates } = settingSlice.actions;

export default settingSlice.reducer;
