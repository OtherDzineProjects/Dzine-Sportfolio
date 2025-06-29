import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button
} from "common";
import "./style.css";

const CustomModal = (props) => {
  const {
    open = false,
    close = () => {},
    title = "Modal Title",
    content = null,
    isFooterContent = false,
    footerContent = null,
    footerActionPostion = "center",
    backward = null,
    // text: 'close', action: null, variant: 'outline'
    forward = null
  } = props;
  return (
    <Modal
      isOpen={open}
      onClose={close}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{content}</ModalBody>

        <ModalFooter className={footerActionPostion}>
          {isFooterContent ? (
            footerContent
          ) : (
            <>
              {backward && (
                <Button
                  variant={backward?.variant}
                  mr={3}
                  onClick={backward?.action}
                >
                  {backward?.text}
                </Button>
              )}
              {forward && (
                <Button variant={forward?.variant} onClick={forward?.action}>
                  {forward?.text}
                </Button>
              )}
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
