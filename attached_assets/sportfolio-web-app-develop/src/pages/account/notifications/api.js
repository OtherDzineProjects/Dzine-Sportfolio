import { createAsyncThunk } from "@reduxjs/toolkit";
import { API_URL } from "common/url";
import { http } from "utils/http";

export const searchNotifications = createAsyncThunk(
  "notify/searchNotifications",
  async ({ data, query }) => {
    const response = await http.post(
      API_URL.NOTIFICATIONS.FETCH.replace("?query", query),
      data
    );
    return response?.data;
  }
);

export const getNotificationCounts = createAsyncThunk(
  "notify/getNotificationCounts",
  async () => {
    const response = await http.get(API_URL.NOTIFICATIONS.COUNT);
    return response?.data;
  }
);

export const createNotification = createAsyncThunk(
  "notify/createNotification",
  async (data) => {
    const response = await http.post(API_URL.NOTIFICATIONS.CREATE, data, "");
    return response?.data;
  }
);

export const deleteNotification = createAsyncThunk(
  "notify/deleteNotification",
  async (id) => {
    const response = await http.delete(
      API_URL.NOTIFICATIONS.DELETE.replace(":id", id)
    );
    return response?.data;
  }
);

export const updateNotification = createAsyncThunk(
  "notify/updateNotification",
  async (data) => {
    const response = await http.put(API_URL.NOTIFICATIONS.UPDATE, data, "");
    return response?.data;
  }
);

export const updateNotificationStatus = createAsyncThunk(
  "notify/updateNotificationStatus",
  async (data) => {
    const response = await http.put(API_URL.NOTIFICATIONS.UPDATE_STATUS, data);
    return response?.data;
  }
);
