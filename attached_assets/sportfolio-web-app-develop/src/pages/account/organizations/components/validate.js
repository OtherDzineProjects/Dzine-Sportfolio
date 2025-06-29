import { MOBILE } from "common/regex";
import { validationMsgs } from "utils/validations";
import * as yup from "yup";

export const orgBasicValidate = yup
  .object()
  .shape({
    organizationName: yup
      .string()
      .required(validationMsgs.organizationNameRequired),
    organizationEmail: yup.string().required(validationMsgs.emailRequired),
    organizationTypeID: yup
      .string()
      .required(validationMsgs.organizationTypeRequired),
    registrationValidFrom: yup.string(),
    registrationValidTo: yup.string(),
    country: yup.string().required(validationMsgs.countryRequired),
    state: yup.string().required(validationMsgs.stateRequired),
    district: yup.string().required(validationMsgs.districtRequired),
    localBodyType: yup.string().required(validationMsgs.localBodyTypeRequired),
    localBodyName: yup.string().required(validationMsgs.localBodyNameRequired),
    wardName: yup.string().required(validationMsgs.wardNameRequired),
    postOffice: yup.string().required(validationMsgs.postOfficeRequired),
    pinCode: yup.string().required(validationMsgs.pinCodeRequired),
    inchargePhone: yup
      .string()
      .nullable()
      .notRequired()
      .test(
        "is-valid-phone-number",
        validationMsgs.invalidPhoneNumber,
        (value) => (!value ? true : MOBILE.test(value))
      ),

    phoneNumber: yup
      .string()
      .required(validationMsgs.phoneNumberRequired)
      .matches(MOBILE, validationMsgs.invalidPhoneNumber, {
        type: "Mobile Number"
      })
  })
  .required();

export const activityValidate = yup
  .object()
  .shape({
    activityType: yup.string().required(validationMsgs.activityTypeRequired),
    activity: yup.lazy((value) =>
      Array.isArray(value)
        ? yup
            .array()
            .required(validationMsgs.activityRequired)
            .typeError(validationMsgs.activityRequired)
            .test("is-empty-array", validationMsgs.activityRequired, (value) =>
              !Array.isArray(value) ? true : value.length !== 0
            )
        : yup.string().required(validationMsgs.activityRequired)
    )
  })
  .required();
