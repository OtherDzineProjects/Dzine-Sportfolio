import { validationMsgs } from "utils/validations";
import * as yup from "yup";

export const notificationValidate = yup
  .object()
  .shape({
    subject: yup.string().required(validationMsgs.subjectRequired),
    date: yup.string().required(validationMsgs.dateRequired),
    country: yup.string().required(validationMsgs.countryRequired),
    state: yup.string().required(validationMsgs.stateRequired),
    district: yup.string().required(validationMsgs.districtRequired),
    organizationId: yup.string().required(validationMsgs.orgRequired),
    body: yup.string().required(validationMsgs.msgRequired)
  })
  .required();
