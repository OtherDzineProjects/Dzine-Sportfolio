import { EMAIL } from "common/regex";

export const validateEmail = (email) => {
  return EMAIL.test(email);
  // const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // return re.test(email);
};
