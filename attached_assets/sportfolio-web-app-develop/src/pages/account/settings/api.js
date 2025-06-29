import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "common/url";
import { http } from "utils/http";

const changePassword = createAsyncThunk(
  "setting/changePassword",
  async (data) => {
    const response = await http.post(API_URL.SETTINGS.CHANGE_PASSWWORD, data);
    return response?.data;
  }
);

export { changePassword };
