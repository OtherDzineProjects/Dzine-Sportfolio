import { formatDisplayDate } from "pages/common/helpers";

export const formatProfile = (data) => {
  return [
    {
      title: "Org Name",
      value: data.organizationName || (data?.id ? "_" : null)
    },
    {
      title: "Org Official Email",
      value: data.organizationEmail || (data?.id ? "_" : null)
    },
    {
      title: "Org Official Phone",
      value: data.phoneNumber || (data?.id ? "_" : null)
    },
    {
      title: "Registration Number",
      value: data.registrationNumber || (data?.id ? "_" : null)
    },
    {
      title: "RegistrationValidFrom",
      value: data.registrationValidFrom
        ? formatDisplayDate(data.registrationValidFrom)
        : data?.id
        ? "_"
        : null
    },
    {
      title: "RegistrationValidTo",
      value: data.registrationValidTo
        ? formatDisplayDate(data.registrationValidTo)
        : data?.id
        ? "_"
        : null
    },
    {
      title: "Incharge Name",
      value: data.inchargeName || (data?.id ? "_" : null)
    },
    {
      title: "Incharge Phone",
      value: data.inchargePhone || (data?.id ? "_" : null)
    },
    {
      title: "Incharge Email",
      value: data.inchargeEmail || (data?.id ? "_" : null)
    },
    {
      title: "Website",
      value: data.website || (data?.id ? "_" : null)
    },
    {
      title: "Country",
      value: data.country || (data?.id ? "_" : null)
    },
    {
      title: "State",
      value: data.state || (data?.id ? "_" : null)
    },
    {
      title: "District",
      value: data.district || (data?.id ? "_" : null)
    },
    {
      title: "Local Body Type",
      value: data.localBodyType || (data?.id ? "_" : null)
    },
    {
      title: "Local Body Name",
      value: data.localBodyName || (data?.id ? "_" : null)
    },
    {
      title: "Ward Name",
      value: data.wardName || (data?.id ? "_" : null)
    },
    {
      title: "Post Office",
      value: data.postOffice || (data?.id ? "_" : null)
    },
    {
      title: "Pin Code",
      value: data.pinCode || (data?.id ? "_" : null)
    },
    {
      title: "Organization Type",
      value: data.organizationType || (data?.id ? "_" : null)
    }
  ].filter((item) => item?.value);
};
