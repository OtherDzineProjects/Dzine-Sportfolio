import { EMAIL, MOBILE } from "common/regex";
import { validationMsgs } from "utils/validations";
import * as yup from "yup";

export const userStepBasic = yup
  .object()
  .shape({
    firstName: yup.string().required(validationMsgs.nameRequired),
    emailID: yup.string().required(validationMsgs.emailRequired),
    phoneNumber: yup
      .string()
      .required(validationMsgs.phoneNumberRequired)
      .matches(MOBILE, validationMsgs.invalidPhoneNumber, {
        type: "Mobile Number"
      })
  })
  .required();

export const userStepContact = yup.object().shape({}).required();

export const contactCommunicationEmail = yup
  .object()
  .shape({
    communicationTypeId: yup
      .string()
      .required(validationMsgs.communicationTypeRequired),
    value: yup
      .string()
      .required(validationMsgs.emailRequired)
      .matches(EMAIL, validationMsgs.invalidEmail, { type: "Email" })
  })
  .required();

export const contactCommunicationPhone = yup
  .object()
  .shape({
    communicationTypeId: yup
      .string()
      .required(validationMsgs.communicationTypeRequired),
    value: yup
      .string()
      .required(validationMsgs.phoneNumberRequired)
      .matches(MOBILE, validationMsgs.invalidPhoneNumber, {
        type: "Mobile Number"
      })
  })
  .required();

export const stepQualification = yup
  .object()
  .shape({
    certificateType: yup.number().required("Certificate Type is Required"),
    notes: yup.string().required("Notes is Required"),
    certificateNumber: yup.string().required("Certificate Number is Required"),
    certificateDate: yup.string().required("Certificate Date is Required")
  })
  .required();

export const stepFamily = yup
  .object()
  .shape({
    name: yup.string().required("Name is Required"),
    relation: yup.number().required("Relation is Required"),
    dob: yup.string().required("Dob is Required"),
    phone: yup.string().required("Phone is Required"),
    email: yup.string().required("Email is Required"),
    gender: yup.number().required("Gender is Required"),
    bloodGroup: yup.number().required("Blood Group is Required")
  })
  .required();
