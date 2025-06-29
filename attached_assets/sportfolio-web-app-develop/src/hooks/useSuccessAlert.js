import { setAlertDialog } from "pages/common/slice";
import { useDispatch } from "react-redux";
import createStatusAlert, { ALERT_TYPE } from "utils/alert";

const useSuccessAlert = () => {
  const dispatch = useDispatch();
  const showSuccessAlert = (
    title = "Success",
    message = "Action successfully completed",
    action = () => dispatch(setAlertDialog(null))
  ) =>
    dispatch(
      setAlertDialog(
        createStatusAlert(ALERT_TYPE.SUCCESS, title, message, action)
      )
    );

  return showSuccessAlert;
};

export default useSuccessAlert;
