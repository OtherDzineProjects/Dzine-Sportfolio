import {
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure
} from "common";
import useErrorAlert from "hooks/useErrorAlert";
import useSuccessAlert from "hooks/useSuccessAlert";
import { changePassword } from "pages/account/settings/api";
import ChangePassword from "pages/account/settings/components/ChangePassword";
import { resetChangePasswordStates } from "pages/account/settings/slice";
import { API_STATUS } from "pages/common/constants";
import { setAlertDialog, setShowChangePasswordModal } from "pages/common/slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function ChangePasswordModal() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const dispatch = useDispatch();
  const { showChangePasswordModal } = useSelector((state) => state.common);
  const { changePasswordRes, changePasswordLoading, changePasswordStatus } =
    useSelector((state) => state.setting);
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();

  useEffect(() => {
    showChangePasswordModal ? onOpen() : onClose();
    return () => onClose();
  }, [showChangePasswordModal]);

  useEffect(() => {
    if (changePasswordStatus === API_STATUS.SUCCESS) {
      dispatch(setShowChangePasswordModal(false));
      successAlert("", "Password changed successfully", () => {
        dispatch(setAlertDialog(null));
        localStorage.clear();
        window.location.href = "/auth/signin";
      });
      dispatch(resetChangePasswordStates());
    } else if (changePasswordStatus === API_STATUS.FAILED) {
      errorAlert("", changePasswordRes || "Error in changing password");
      dispatch(resetChangePasswordStates());
    }
  }, [changePasswordStatus]);

  const handleSubmit = (data) => {
    dispatch(
      changePassword({
        existingPassword: null,
        newPassword: data.password || ""
      })
    );
  };

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="3xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay bg="rgba(38, 50, 56, 0.6)" />
      <ModalContent>
        <ModalBody m={0} p={0}>
          <ChangePassword
            showCurrentPasswordField={false}
            className="mt-0"
            changePasswordCallback={handleSubmit}
            isOpen={showChangePasswordModal}
            loading={changePasswordLoading}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
