import { setAlertDialog } from "pages/common/slice";
import { useDispatch } from "react-redux";
import createStatusAlert, { ALERT_TYPE } from "utils/alert";

const useWarningAlert = () => {
  const dispatch = useDispatch();
  const showWarningAlert = (
    title = "Attention",
    message = "Are you sure?",
    action = () => dispatch(setAlertDialog(null))
  ) =>
    dispatch(
      setAlertDialog(
        createStatusAlert(ALERT_TYPE.WARNING, title, message, action)
      )
    );

  return showWarningAlert;
};

export default useWarningAlert;
