import { setAlertDialog } from "pages/common/slice";
import { useDispatch } from "react-redux";
import createStatusAlert, { ALERT_TYPE } from "utils/alert";

const useErrorAlert = () => {
  const dispatch = useDispatch();
  const showErrorAlert = (
    title = "Failed",
    message = "Something went wrong",
    action = () => dispatch(setAlertDialog(null))
  ) =>
    dispatch(
      setAlertDialog(
        createStatusAlert(ALERT_TYPE.ERROR, title, message, action)
      )
    );

  return showErrorAlert;
};

export default useErrorAlert;
