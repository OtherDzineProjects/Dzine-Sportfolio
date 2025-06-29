import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Typography,
  useDisclosure
} from "common";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { colors } from "utils/colors";
import NotificationCard from "./NotificationCard";
import { setPreviewNotification } from "pages/account/notifications/slice";
import { useEffect } from "react";

export default function NotificationPreview() {
  const { isOpen, onOpen, onClose } = useDisclosure(),
    { previewNotification } = useSelector((state) => state.notify),
    dispatch = useDispatch();

  const onCloseModal = () => {
    dispatch(setPreviewNotification(null));
    onClose();
  };

  useEffect(() => {
    previewNotification ? onOpen() : onClose();
  }, [previewNotification]);

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="xl"
      onCloseComplete={onCloseModal}
      onEsc={onCloseModal}
    >
      <ModalOverlay bg="rgba(38, 50, 56, 0.6)" />
      <ModalContent>
        <ModalHeader
          bg={`${colors.white} !important`}
          fontSize="1.125rem"
          borderBlockEnd="1px solid rgba(241, 245, 249, 1)"
          fontWeight={400}
          flex
          alignItems="center"
        >
          <Typography text="Preview" type="p" size="sm" />

          <ModalCloseButton />
        </ModalHeader>
        <ModalBody>
          <section className="mb-4">
            <NotificationCard data={previewNotification} preview />
          </section>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
