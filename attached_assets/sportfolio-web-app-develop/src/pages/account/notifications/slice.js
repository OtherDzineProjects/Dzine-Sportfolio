import { createSlice } from "@reduxjs/toolkit";
import { API_STATUS } from "pages/common/constants";
import {
  createNotification,
  deleteNotification,
  getNotificationCounts,
  searchNotifications,
  updateNotification,
  updateNotificationStatus
} from "./api";

export const notificationSlice = createSlice({
  name: "notify",
  initialState: {
    newNotificationCreateDialog: false,
    notifyAll: false,
    notifyOrganizationIds: [],
    previewNotification: null
  },
  reducers: {
    setNewNotificationCreateDialog(state, action) {
      state.newNotificationCreateDialog = action.payload;
    },
    setNotifyOrganizationIds(state, action) {
      state.notifyOrganizationIds = action.payload;
    },
    setPreviewNotification(state, action) {
      state.previewNotification = action.payload;
    },
    setNotifyAll(state, action) {
      state.notifyAll = action.payload;
    },
    clearSearchNotifications(state) {
      state.searchNotificationsRes = null;
      state.searchNotificationsLoading = false;
      state.searchNotificationsStatus = null;
      state.notifyOrganizationIds = [];
      state.previewNotification = null;
    },
    clearNotificationFormState(state) {
      state.previewNotification = null;
      state.notifyOrganizationIds = [];
      state.notifyAll = false;
      state.createNotificationRes = null;
      state.createNotificationLoading = false;
      state.createNotificationStatus = null;
      state.updateNotificationRes = null;
      state.updateNotificationLoading = false;
      state.updateNotificationStatus = null;
      state.updateNotificationStatusRes = null;
      state.updateNotificationStatusLoading = false;
      state.updateNotificationStatusStatus = null;
      state.deleteNotificationRes = null;
      state.deleteNotificationLoading = false;
      state.deleteNotificationStatus = null;
    }
  },
  extraReducers: (builder) => {
    /**
     * key search => List notifications
     */
    builder.addCase(searchNotifications.fulfilled, (state, action) => {
      (state.searchNotificationsRes = action.payload),
        (state.searchNotificationsLoading = false),
        (state.searchNotificationsStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(searchNotifications.pending, (state) => {
      (state.searchNotificationsLoading = true),
        (state.searchNotificationsStatus = API_STATUS.PENDING);
    });
    builder.addCase(searchNotifications.rejected, (state, action) => {
      (state.searchNotificationsRes = action.error.message),
        (state.searchNotificationsLoading = false),
        (state.searchNotificationsStatus = API_STATUS.FAILED);
    });

    /**
     * Fetch notification counts
     */
    builder.addCase(getNotificationCounts.fulfilled, (state, action) => {
      (state.getNotificationCountsRes = action.payload),
        (state.getNotificationCountsLoading = false),
        (state.getNotificationCountsStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(getNotificationCounts.pending, (state) => {
      (state.getNotificationCountsLoading = true),
        (state.getNotificationCountsStatus = API_STATUS.PENDING);
    });
    builder.addCase(getNotificationCounts.rejected, (state, action) => {
      (state.getNotificationCountsRes = action.error.message),
        (state.getNotificationCountsLoading = false),
        (state.getNotificationCountsStatus = API_STATUS.FAILED);
    });

    /**
     * Create notification
     */
    builder.addCase(createNotification.fulfilled, (state, action) => {
      (state.createNotificationRes = action.payload),
        (state.createNotificationLoading = false),
        (state.createNotificationStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(createNotification.pending, (state) => {
      (state.createNotificationLoading = true),
        (state.createNotificationStatus = API_STATUS.PENDING);
    });
    builder.addCase(createNotification.rejected, (state, action) => {
      (state.createNotificationRes = action.error.message),
        (state.createNotificationLoading = false),
        (state.createNotificationStatus = API_STATUS.FAILED);
    });

    /**
     * Update notification
     */
    builder.addCase(updateNotification.fulfilled, (state, action) => {
      (state.updateNotificationRes = action.payload),
        (state.updateNotificationLoading = false),
        (state.updateNotificationStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(updateNotification.pending, (state) => {
      (state.updateNotificationLoading = true),
        (state.updateNotificationStatus = API_STATUS.PENDING);
    });
    builder.addCase(updateNotification.rejected, (state, action) => {
      (state.updateNotificationRes = action.error.message),
        (state.updateNotificationLoading = false),
        (state.updateNotificationStatus = API_STATUS.FAILED);
    });

    /**
     * Delete notification
     */
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      (state.deleteNotificationRes = action.payload),
        (state.deleteNotificationLoading = false),
        (state.deleteNotificationStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(deleteNotification.pending, (state) => {
      (state.deleteNotificationLoading = true),
        (state.deleteNotificationStatus = API_STATUS.PENDING);
    });
    builder.addCase(deleteNotification.rejected, (state, action) => {
      (state.deleteNotificationRes = action.error.message),
        (state.deleteNotificationLoading = false),
        (state.deleteNotificationStatus = API_STATUS.FAILED);
    });

    /**
     * Update notification status
     */
    builder.addCase(updateNotificationStatus.fulfilled, (state, action) => {
      (state.updateNotificationStatusRes = action.payload),
        (state.updateNotificationStatusLoading = false),
        (state.updateNotificationStatusStatus = API_STATUS.SUCCESS);
    });
    builder.addCase(updateNotificationStatus.pending, (state) => {
      (state.updateNotificationStatusLoading = true),
        (state.updateNotificationStatusStatus = API_STATUS.PENDING);
    });
    builder.addCase(updateNotificationStatus.rejected, (state, action) => {
      (state.updateNotificationStatusRes = action.error.message),
        (state.updateNotificationStatusLoading = false),
        (state.updateNotificationStatusStatus = API_STATUS.FAILED);
    });
  }
});

export const {
  clearSearchNotifications,
  setNewNotificationCreateDialog,
  setNotifyOrganizationIds,
  setNotifyAll,
  clearNotificationFormState,
  setPreviewNotification
} = notificationSlice.actions;

export default notificationSlice.reducer;
