import { colors } from "./colors";

export const ALERT_TYPE = {
  CONFIRM: "confirm",
  ERROR: "error",
  SUCCESS: "success",
  WARNING: "warning"
};
const createStatusAlert = (type, title = "", message, action = () => {}) => {
  switch (type) {
    case ALERT_TYPE.SUCCESS:
      return {
        open: true,
        title: title || "Success",
        message: message || "Action successfully completed",
        type: ALERT_TYPE.SUCCESS,
        align: "center",
        actions: {
          backward: {
            text: "Okay",
            variant: "outline",
            color: colors.successColor,
            bg: colors.white,
            border: colors.successColor,
            action: action
          }
        }
      };
    case ALERT_TYPE.ERROR:
      return {
        open: true,
        title: title || "Failed",
        message: message || "Something went wrong",
        type: ALERT_TYPE.ERROR,
        align: "center",
        actions: {
          backward: {
            text: "Okay",
            variant: "outline",
            color: colors.errorColor,
            bg: colors.white,
            border: colors.errorColor
          }
        }
      };
    case ALERT_TYPE.CONFIRM:
      return {
        open: true,
        title: title || "Confirmation",
        message: message || "Are you sure want to proceed?",
        type: ALERT_TYPE.CONFIRM,
        align: "center",
        actions: {
          backward: {
            text: "No",
            variant: "outline",
            color: colors.confirmationColor,
            bg: colors.white,
            border: colors.confirmationColor
          },
          forward: {
            text: "Yes",
            action: action,
            variant: "solid",
            color: colors.white,
            bg: colors.confirmationColor,
            border: null
          }
        }
      };
  }
};

export default createStatusAlert;
