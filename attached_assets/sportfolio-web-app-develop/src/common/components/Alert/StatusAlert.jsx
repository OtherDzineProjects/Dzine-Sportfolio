import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  Typography,
  Button
} from "common";
import "./style.css";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setAlertDialog } from "pages/common/slice";
import { colors } from "utils/colors";
import {
  ConfirmationAlertIcon,
  ErrorAlertIcon,
  SuccessAlertIcon,
  WarningAlertIcon
} from "assets/StatusIcons";
import DOMPurify from "dompurify";
import StatusAlertHeader from "assets/status-alert-header-bg.svg";
import { useMemo } from "react";
import { ALERT_TYPE } from "utils/alert";

export const StatusAlert = () => {
  const cancelRef = useRef(),
    dispatch = useDispatch(),
    alertDialog = useSelector((state) => state.common.alertDialog);

  const colorScheme = useMemo(() => {
    switch (alertDialog?.type) {
      case ALERT_TYPE.SUCCESS:
        return colors.successColor;
      case ALERT_TYPE.WARNING:
        return colors.warningColor;
      case ALERT_TYPE.ERROR:
        return colors.errorColor;
      case ALERT_TYPE.CONFIRM:
        return colors.confirmationColor;
    }
  }, [alertDialog?.type]);

  const icon = useMemo(() => {
    switch (alertDialog?.type) {
      case ALERT_TYPE.SUCCESS:
        return <SuccessAlertIcon className="m-auto" />;
      case ALERT_TYPE.WARNING:
        return <WarningAlertIcon className="m-auto" />;
      case ALERT_TYPE.ERROR:
        return <ErrorAlertIcon className="m-auto" />;
      case ALERT_TYPE.CONFIRM:
        return <ConfirmationAlertIcon className="m-auto" />;
    }
  }, [alertDialog?.type]);

  const closeStatusAlert = () => dispatch(setAlertDialog(null));

  return (
    <AlertDialog
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={closeStatusAlert}
      isOpen={alertDialog?.open || false}
      allowPinchZoom
      closeOnEsc={false}
      closeOnOverlayClick={false}
      blockScrollOnMount
      isCentered
      size="md"
    >
      <AlertDialogOverlay bg="rgba(38, 50, 56, 0.6)" />

      <AlertDialogContent
        bg="transparent"
        shadow="none"
        flex
        justifyContent="center"
        alignItems="center"
        p={0}
        height="max-content"
        maxHeight="max-content"
        width="max-content"
        maxWidth="max-content"
      >
        <AlertDialogBody p={0}>
          <article className="rounded-2xl w-72 h-max overflow-y-hidden">
            <header
              className="flex gap-4 items-center relative rounded-t-2xl h-[6.25rem]"
              style={{
                background: `url(${StatusAlertHeader}) no-repeat ${colorScheme}`
              }}
            >
              <section className="absolute status-card-container flex gap-5 items-center justify-center">
                <div className="h-[75px] w-[75px] rounded-full text-center pt-[0.45rem] uppercase relative profile-circle bg-white">
                  {icon}
                </div>
              </section>
            </header>
            <footer className="py-5 text-center rounded-b-2xl bg-white flex flex-col items-center gap-2">
              <Typography
                text={alertDialog?.title}
                type="h6"
                size="md"
                color={colors.black}
                className="text-center !font-semibold"
              />

              <div
                className="text-center alert-message-text mb-2 mx-3 text-sm"
                style={{ color: "#455a64" }}
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(alertDialog?.message)
                }}
              ></div>

              <section className="flex gap-4 py-2 px-9">
                {alertDialog?.actions?.backward && (
                  <Button
                    type="button"
                    size="lg"
                    variant={alertDialog?.actions?.backward?.variant}
                    color={alertDialog?.actions?.backward?.color}
                    bg={alertDialog?.actions?.backward?.bg}
                    borderColor={alertDialog?.actions?.backward?.border}
                    _hover={{ opacity: 0.8 }}
                    onClick={
                      alertDialog?.actions?.backward?.action || closeStatusAlert
                    }
                    className="alert-button"
                  >
                    {alertDialog?.actions?.backward?.text}
                  </Button>
                )}
                {alertDialog?.actions?.forward && (
                  <Button
                    type="button"
                    size="lg"
                    variant={alertDialog?.actions?.forward?.variant}
                    color={alertDialog?.actions?.forward?.color}
                    bg={alertDialog?.actions?.forward?.bg}
                    borderColor={alertDialog?.actions?.forward?.border}
                    _hover={{ opacity: 0.8 }}
                    onClick={alertDialog?.actions?.forward?.action}
                    className="alert-button"
                  >
                    {alertDialog?.actions?.forward?.text}
                  </Button>
                )}
              </section>
            </footer>
          </article>
        </AlertDialogBody>
      </AlertDialogContent>
    </AlertDialog>
  );
};
