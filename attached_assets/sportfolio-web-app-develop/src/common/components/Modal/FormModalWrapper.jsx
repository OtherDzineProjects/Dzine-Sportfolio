import { Edit } from "assets/InputIcons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from "common";
import { colors } from "utils/colors";

export const FormModalWrapper = ({
  title,
  onClose,
  isOpen,
  children,
  loading,
  innerRef,
  formType,
  size = "5xl"
}) => {
  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size={size}
      closeOnOverlayClick={false}
      closeOnEsc={false}
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
          {title}
          <ModalCloseButton isDisabled={loading} />
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
        <ModalFooter gap="1rem">
          <Button
            onClick={onClose}
            type="button"
            variant="outline"
            colorScheme="secondary"
            isDisabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="solid"
            colorScheme="primary"
            leftIcon={loading ? null : <Edit color={colors.white} />}
            onClick={() => (loading ? null : innerRef?.current?.click())}
            isLoading={loading}
          >
            {formType === "create" ? "Save" : "Update"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
