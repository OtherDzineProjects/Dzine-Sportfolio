import { Badge } from "common";
import { validateEmail } from "./validations";
import { Close, Done } from "assets/InputIcons";
import { colors } from "utils/colors";

export const status = (data) => {
  if (data?.status === "verified") {
    return <Badge text="Verified" variant="success" />;
  }
  if (data?.status === "progress") {
    return <Badge text="Progress" variant="progress" />;
  }
  if (data?.status === "pending") {
    return <Badge text="Pending" variant="pending" />;
  }
  return <Badge text="Pending" variant="pending" />;
};

export const emailCheck = (email) => {
  if (email) {
    if (!validateEmail(email)) {
      return <Close color={colors.secondary} />;
    } else return <Done color={colors.primary} />;
  }
  return "";
};

export const formatDisplayDate = (date, separator = "-") => {
  return `${new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(
    new Date(date)
  )}${separator}${new Intl.DateTimeFormat("en-US", { month: "2-digit" }).format(
    new Date(date)
  )}${separator}${new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(
    new Date(date)
  )}`;
};

export const formatInputDate = (date) => {
  return `${new Intl.DateTimeFormat("en-US", { year: "numeric" }).format(
    new Date(date)
  )}-${new Intl.DateTimeFormat("en-US", { month: "2-digit" }).format(
    new Date(date)
  )}-${new Intl.DateTimeFormat("en-US", { day: "2-digit" }).format(
    new Date(date)
  )}`;
};
