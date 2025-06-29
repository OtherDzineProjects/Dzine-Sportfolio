import { MOBILE, PASSWORD } from "common/regex";
import { validationMsgs } from "utils/validations";
import * as yup from "yup";

export const saveUserSchema = yup
  .object()
  .shape({
    firstName: yup.string().required(validationMsgs.firstNameRequired),
    email: yup.string().required(validationMsgs.emailRequired),
    phoneNumber: yup
      .string()
      .required(validationMsgs.phoneNumberRequired)
      .matches(MOBILE, validationMsgs.invalidPhoneNumber, {
        type: "Mobile Number"
      }),
    password: yup
      .string()
      .required(validationMsgs.passwordRequired)
      .min(8, validationMsgs.passwordMinLength)
      .matches(PASSWORD, validationMsgs.weakPassword)
  })
  .required();
