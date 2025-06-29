import { formatDisplayDate } from "pages/common/helpers";

export const formatProfile = (data, type) => {
  switch (type) {
    case "basic":
      return [
        {
          title: "First Name",
          value: data.firstName || (data.userBasicDetailID ? "_" : null),
          verified: false
        },
        {
          title: "Middle Name",
          value: data.middleName || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Last Name",
          value: data.lastName || (data.userBasicDetailID ? "_" : null),
          verified: false
        },
        {
          title: "Nick Name",
          value: data.nickName || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Email Address",
          value: data.emailID || (data.userBasicDetailID ? "_" : null),
          verified: false
        },
        {
          title: "Mobile Number",
          value: data.phoneNumber || (data.userBasicDetailID ? "_" : null),
          verified: false
        },
        {
          title: "Alternate Mobile",
          value:
            data.alternativePhoneNumber || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Date of Birth",
          value: data.dateOfBirth
            ? formatDisplayDate(data.dateOfBirth)
            : data.userBasicDetailID
            ? "_"
            : null
        },
        {
          title: "Blood Group",
          value: data.bloodGroup || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Gender",
          value: data.gender || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Country",
          value: data.country || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "State",
          value: data.state || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "District",
          value: data.district || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "City",
          value: data.city || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "House Name",
          value: data.houseName || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Street Name",
          value: data.streetName || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Place",
          value: data.place || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Local Body Type",
          value: data.localBodyType || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Local Body Name",
          value: data.localBodyName || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Ward Name",
          value: data.wardName || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Post Office",
          value: data.postOffice || (data.userBasicDetailID ? "_" : null)
        },
        {
          title: "Pin Code",
          value: data.pinCode || (data.userBasicDetailID ? "_" : null)
        },
        {
          multi: true,
          title: "Representing Districts",
          value:
            Array.isArray(data?.representingDistricts) &&
            data?.representingDistricts?.length > 0
              ? data?.representingDistricts?.map((value) => value?.name)
              : data.userBasicDetailID
              ? "_"
              : []
        },
        {
          separate: true,
          richText: true,
          title: "Bio",
          value: data.bio || (data.userBasicDetailID ? "_" : null)
        }
      ].filter((item) => item?.value && item?.value?.length > 0);

    case "contact":
      return [
        {
          title: "Address Type",
          value: data.addressType || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "Country",
          value: data.country || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "State",
          value: data.state || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "District",
          value: data.district || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "City",
          value: data.city || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "House Name",
          value: data.houseName || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "Street Name",
          value: data.streetName || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "Place",
          value: data.place || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "Ward Name",
          value: data.wardName || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "Local Body Type",
          value: data.localBodyType || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "Local Body Name",
          value: data.localBodyName || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "Post Office",
          value: data.postOffice || (data.userContactDetailID ? "_" : null)
        },
        {
          title: "Pin Code",
          value: data.pinCode || (data.userContactDetailID ? "_" : null)
        },
        {
          separate: true,
          richText: false,
          title: "Communication Details",
          value: data.communicationDetails
        }
      ].filter((item) => item?.value);
    case "qualifications":
      return (
        Array.isArray(data) &&
        data?.map((item) => {
          return {
            title:
              item.qualificationTypeName ||
              (item?.userQualificationDetailID ? "_" : null),
            value: [
              {
                title: "Certificate Number",
                value:
                  item.certificateNumber ||
                  (item?.userQualificationDetailID ? "_" : null)
              },
              {
                title: "Admission Number",
                value:
                  item.enrollmentNumber ||
                  (item?.userQualificationDetailID ? "_" : null)
              },
              {
                title: "Certificate Date",
                value: item.certificateDate
                  ? formatDisplayDate(item.certificateDate)
                  : "_"
              },
              {
                title: "Institution",
                value:
                  item.institution ||
                  (item?.userQualificationDetailID ? "_" : null)
              }
            ],
            remarks:
              item.notes || (item?.userQualificationDetailID ? "_" : null),
            attachments:
              item.uploads || (item?.userQualificationDetailID ? "_" : null)
          };
        })
      );
  }
};
