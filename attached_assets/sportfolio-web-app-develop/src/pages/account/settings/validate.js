import { PASSWORD } from "common/regex";
import { validationMsgs } from "utils/validations";
import * as yup from "yup";

export const changePasswordValidate = yup
  .object()
  .shape({
    oldPassword: yup.string().required(validationMsgs.currentPasswordRequired),
    password: yup
      .string()
      .required(validationMsgs.passwordRequired)
      .min(8, validationMsgs.passwordMinLength)
      .matches(PASSWORD, validationMsgs.weakPassword),
    confirmPassword: yup
      .string()
      .required(validationMsgs.confirmPasswordRequired)
      .test(
        "passwords-match",
        validationMsgs.confirmPasswordNotMatch,
        function (value) {
          const { password } = this.parent;
          return value === password;
        }
      )
  })
  .required();

export const newPasswordValidate = yup
  .object()
  .shape({
    password: yup
      .string()
      .required(validationMsgs.passwordRequired)
      .min(8, validationMsgs.passwordMinLength)
      .matches(PASSWORD, validationMsgs.weakPassword),
    confirmPassword: yup
      .string()
      .required(validationMsgs.confirmPasswordRequired)
      .test(
        "passwords-match",
        validationMsgs.confirmPasswordNotMatch,
        function (value) {
          const { password } = this.parent;
          return value === password;
        }
      )
  })
  .required();
