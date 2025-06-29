import { setAlertDialog } from "pages/common/slice";
import { useDispatch } from "react-redux";
import createStatusAlert, { ALERT_TYPE } from "utils/alert";

const useConfirmAlert = () => {
  const dispatch = useDispatch();
  const showConfirmAlert = (
    title = "Confirmation",
    message = "Are you sure want to proceed?",
    action = () => dispatch(setAlertDialog(null))
  ) =>
    dispatch(
      setAlertDialog(
        createStatusAlert(ALERT_TYPE.CONFIRM, title, message, action)
      )
    );

  return showConfirmAlert;
};

export default useConfirmAlert;
