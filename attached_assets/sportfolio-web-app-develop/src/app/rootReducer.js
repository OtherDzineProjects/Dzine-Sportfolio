import commonReducer from "pages/common/slice";
import authReducer from "pages/auth/slice";
import usersReducer from "pages/account/users/slice";
import orgReducer from "pages/account/organizations/slice";
import notificationReducer from "pages/account/notifications/slice";
import settingReducer from "pages/account/settings/slice";

export const reducers = {
  common: commonReducer,
  auth: authReducer,
  users: usersReducer,
  org: orgReducer,
  notify: notificationReducer,
  setting: settingReducer
};
