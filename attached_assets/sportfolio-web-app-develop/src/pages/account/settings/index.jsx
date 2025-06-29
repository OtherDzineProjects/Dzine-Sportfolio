import React from "react";
import SettingsSidebar from "./components/SettingsSidebar";
import ChangePassword from "./components/ChangePassword";
import { useDispatch } from "react-redux";
import { changePassword } from "./api";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { API_STATUS } from "pages/common/constants";
import useSuccessAlert from "hooks/useSuccessAlert";
import useErrorAlert from "hooks/useErrorAlert";
import { resetChangePasswordStates } from "./slice";

const Settings = () => {
  const dispatch = useDispatch();
  const { changePasswordRes, changePasswordLoading, changePasswordStatus } =
    useSelector((state) => state.setting);
  const { showChangePasswordModal } = useSelector((state) => state.setting);
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();

  useEffect(() => {
    if (changePasswordStatus === API_STATUS.SUCCESS) {
      successAlert("", "Password changed successfully", () => {
        localStorage.clear();
        window.location.href = "/auth/signin";
      });
      dispatch(resetChangePasswordStates());
    } else if (changePasswordStatus === API_STATUS.FAILED) {
      errorAlert("", changePasswordRes || "Error in changing password");
      dispatch(resetChangePasswordStates());
    }
  }, [changePasswordStatus]);

  const onSubmitChangePassword = (data) => {
    dispatch(
      changePassword({
        existingPassword: data?.oldPassword || null,
        newPassword: data.password || ""
      })
    );
  };

  return (
    <React.Fragment>
      <div className="flex flex-row h-[calc(100svh-6.25rem)]">
        <SettingsSidebar />
        <div className="pt-10 px-5 w-full overflow-y-auto">
          <ChangePassword
            changePasswordCallback={onSubmitChangePassword}
            loading={changePasswordLoading}
            isOpen={showChangePasswordModal}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Settings;
