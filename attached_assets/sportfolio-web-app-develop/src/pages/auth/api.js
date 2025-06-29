import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "common/url";
import { http } from "../../utils/http";

const signUp = createAsyncThunk("auth/SignUp", async (data) => {
  const response = await http.post(API_URL.AUTH.CREATE_USER, data);
  return response?.data;
});

const signIn = createAsyncThunk("auth/SignIn", async (data) => {
  const response = await http.post(API_URL.AUTH.USER_SIGNIN, data);
  return response?.data;
});

const forgetPassword = createAsyncThunk(
  "auth/ForgetPassword",
  async (email) => {
    const response = await http.post(API_URL.AUTH.FORGET_PASSWORD, {
      email: email,
      action: "Forgot Password",
      userSettingsType: "Password"
    });
    return response?.data;
  }
);

const validateOTP = createAsyncThunk("auth/ValidateOTP", async (data) => {
  const response = await http.post(API_URL.AUTH.VALIDATE_OTP, data);
  return response?.data;
});

export { signUp, signIn, forgetPassword, validateOTP };
