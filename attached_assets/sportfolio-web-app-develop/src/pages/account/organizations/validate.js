import { MOBILE } from "common/regex";
import { validationMsgs } from "utils/validations";
import * as yup from "yup";

export const saveOrgSchema = yup
  .object()
  .shape({
    organizationName: yup
      .string()
      .required(validationMsgs.organizationNameRequired),
    organizationEmail: yup.string().required(validationMsgs.emailRequired),
    phoneNumber: yup
      .string()
      .required(validationMsgs.phoneNumberRequired)
      .matches(MOBILE, validationMsgs.invalidPhoneNumber, {
        type: "Mobile Number"
      }),
    organizationTypeID: yup
      .string()
      .required(validationMsgs.organizationTypeRequired),
    website: yup.string(),
    country: yup.string().required(validationMsgs.countryRequired),
    state: yup.string().required(validationMsgs.stateRequired),
    district: yup.string().required(validationMsgs.districtRequired)
  })
  .required();
