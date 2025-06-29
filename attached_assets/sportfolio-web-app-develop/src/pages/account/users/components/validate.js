import { MOBILE } from "common/regex";
import { validationMsgs } from "utils/validations";
import * as yup from "yup";

export const userBasicValidate = yup
  .object()
  .shape({
    firstName: yup.string().required(validationMsgs.firstNameRequired),
    lastName: yup.string().required(validationMsgs.lastNameRequired),
    emailID: yup.string().required(validationMsgs.emailRequired),
    dateOfBirth: yup.string().required(validationMsgs.dobRequired),
    bloodGroup: yup.string().required(validationMsgs.bloodGroupRequired),
    country: yup.string().required(validationMsgs.countryRequired),
    state: yup.string().required(validationMsgs.stateRequired),
    district: yup.string().required(validationMsgs.districtRequired),
    localBodyType: yup.string().required(validationMsgs.localBodyTypeRequired),
    localBodyName: yup.string().required(validationMsgs.localBodyNameRequired),
    wardName: yup.string().required(validationMsgs.wardNameRequired),
    postOffice: yup.string().required(validationMsgs.postOfficeRequired),
    gender: yup.string().required(validationMsgs.genderRequired),
    pinCode: yup.string().required(validationMsgs.pinCodeRequired),
    alternativePhoneNumber: yup
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

export const userContactValidate = yup
  .object()
  .shape({
    addressType: yup.string().required(validationMsgs.addressTypeRequired),
    country: yup.string().required(validationMsgs.countryRequired),
    state: yup.string().required(validationMsgs.stateRequired),
    district: yup.string().required(validationMsgs.districtRequired),
    localBodyType: yup.string().required(validationMsgs.localBodyTypeRequired),
    localBodyName: yup.string().required(validationMsgs.localBodyNameRequired),
    wardName: yup.string().required(validationMsgs.wardNameRequired),
    postOffice: yup.string().required(validationMsgs.postOfficeRequired),
    pinCode: yup.string().required(validationMsgs.pinCodeRequired)
  })
  .required();

export const userQualificationValidate = yup
  .object()
  .shape({
    qualificationType: yup
      .string()
      .required(validationMsgs.qualificationTypeRequired),
    certificateNumber: yup
      .string()
      .required(validationMsgs.certificateNumberRequired),
    certificateDate: yup
      .string()
      .required(validationMsgs.certificateDateRequired),
    country: yup.string().required(validationMsgs.countryRequired),
    state: yup.string().required(validationMsgs.stateRequired),
    district: yup.string().required(validationMsgs.districtRequired),
    localBodyType: yup.string().required(validationMsgs.localBodyTypeRequired),
    localBodyName: yup.string().required(validationMsgs.localBodyNameRequired),
    enrollmentNumber: yup
      .string()
      .required(validationMsgs.admissionNumberRequired),
    institutionType: yup
      .string()
      .required(validationMsgs.institutionTypeRequired),
    institution: yup.string().required(validationMsgs.institutionRequired)
  })
  .required();
