export const ML_SPECIAL = /^[\u0D00-\u0D7F!@#$%^&*]+$/;
export const EN_NUMERIC_SPECIAL = /^([a-zA-Z])[a-zA-Z0-9-]*$/;
export const EN = /^[A-Za-z /\s/g]*$/;
export const EN_NUMERIC = /^[A-Za-z0-9 /\s/g]*$/;
export const EN_SPECIAL = /^[a-zA-Z!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?\s]+$/;
export const EN_SPACE = /^[a-zA-Z\s]*$/;

export const NUMERIC = /^[0-9]*$/;
export const AADHAAR = /^[2-9]{1}[0-9]{3}[0-9]{4}[0-9]{4}$/;
export const PASSPORT = /^[A-Z][0-9]{8}$/;
// export const MOBILE = /^(\+\d{1,3}[- ]?)?\d{10}$/;
export const MOBILE =
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;
export const MOBILE_INTERNATIONAL = /^(\+\d{1,3}[- ]?)?\d{9}$/;
export const UDID = /^[A-Z]{2}\d{16}$/;
export const NAME = /^[A-Za-z]+$/;
export const EMAIL =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const DATE = /^\d{2}-\d{2}-\d{4}$/;
export const PASSWORD =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
