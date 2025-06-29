import { EMAIL, MOBILE, PASSWORD } from "common/regex";
import { validationMsgs } from "utils/validations";
import * as yup from "yup";

export const emailLogin = yup
  .object()
  .shape({
    email: yup.string().required(validationMsgs.emailRequired),
    password: yup.string().required(validationMsgs.passwordRequired)
  })
  .required();

export const emailOTPLogin = yup
  .object()
  .shape({
    email: yup.string().required(validationMsgs.emailRequired),
    password: yup.string().required(validationMsgs.otpRequired)
  })
  .required();

export const emailSignUpSchema = yup
  .object()
  .shape({
    firstName: yup.string().required(validationMsgs.firstNameRequired),
    email: yup.string().required(validationMsgs.emailRequired),
    password: yup
      .string()
      .required(validationMsgs.passwordRequired)
      .min(8, validationMsgs.passwordMinLength)
      .matches(PASSWORD, validationMsgs.weakPassword),
    phoneNumber: yup
      .string()
      .required(validationMsgs.phoneNumberRequired)
      .matches(MOBILE, validationMsgs.invalidPhoneNumber, {
        type: "Mobile Number"
      })
  })
  .required();

export const emailSchema = yup
  .object()
  .shape({
    email: yup
      .string()
      .required(validationMsgs.emailRequired)
      .matches(EMAIL, validationMsgs.invalidEmail, {
        type: "Invalid Email"
      })
  })
  .required();
