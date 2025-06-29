import { createSlice } from "@reduxjs/toolkit";
import { signUp, signIn, forgetPassword, validateOTP } from "./api";
import { API_STATUS } from "pages/common/constants";

export const authSlice = createSlice({
  name: "auth",
  initialState: {},
  reducers: {
    resetPasswordStates(state) {
      state.forgetPasswordRes = null;
      state.forgetPasswordLoading = false;
      state.forgetPasswordStatus = null;
      state.validateOTPRes = null;
      state.validateOTPLoading = false;
      state.validateOTPStatus = null;
    }
  },
  extraReducers: (builder) => {
    // signup form
    builder.addCase(signUp.fulfilled, (state, action) => {
      (state.signUpRes = action.payload),
        (state.signUpLoading = false),
        (state.signUpStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(signUp.pending, (state) => {
      (state.signUpLoading = true), (state.signUpStatus = API_STATUS.PENDING);
    });
    builder.addCase(signUp.rejected, (state, action) => {
      (state.signUpRes = action.error.message),
        (state.signUpLoading = false),
        (state.signUpStatus = API_STATUS.FAILED);
    });
    // signIn form
    builder.addCase(signIn.fulfilled, (state, action) => {
      (state.signInRes = action.payload),
        (state.signInLoading = false),
        (state.signInStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(signIn.pending, (state) => {
      (state.signInLoading = true), (state.signInStatus = API_STATUS.PENDING);
    });
    builder.addCase(signIn.rejected, (state, action) => {
      (state.signInRes = action.error.message),
        (state.signInLoading = false),
        (state.signInStatus = API_STATUS.FAILED);
    });

    // forget password form
    builder.addCase(forgetPassword.fulfilled, (state, action) => {
      (state.forgetPasswordRes = action.payload),
        (state.forgetPasswordLoading = false),
        (state.forgetPasswordStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(forgetPassword.pending, (state) => {
      (state.forgetPasswordLoading = true),
        (state.forgetPasswordStatus = API_STATUS.PENDING);
    });
    builder.addCase(forgetPassword.rejected, (state, action) => {
      (state.forgetPasswordRes = action.error.message),
        (state.forgetPasswordLoading = false),
        (state.forgetPasswordStatus = API_STATUS.FAILED);
    });

    // Validate OTP form
    builder.addCase(validateOTP.fulfilled, (state, action) => {
      (state.validateOTPRes = action.payload),
        (state.validateOTPLoading = false),
        (state.validateOTPStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(validateOTP.pending, (state) => {
      (state.validateOTPLoading = true),
        (state.validateOTPStatus = API_STATUS.PENDING);
    });
    builder.addCase(validateOTP.rejected, (state, action) => {
      (state.validateOTPRes = action.error.message),
        (state.validateOTPLoading = false),
        (state.validateOTPStatus = API_STATUS.FAILED);
    });
  }
});

export const { resetPasswordStates } = authSlice.actions;

export default authSlice.reducer;
