import { Fragment, useEffect, useState } from "react";
import { FormController } from "common";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DragNDropFile } from "common/components/DragNDropFile";
import { userQualificationValidate } from "../components/validate";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { saveUserQualifications, updateUserQualifications } from "../api";
import {
  getCountries,
  getDistricts,
  getInstitutions,
  getInstitutionTypes,
  getLocalBodyNames,
  getLocalBodyTypes,
  getQualificationTypes,
  getStates
} from "pages/common/api";
import _ from "lodash";
import { formatInputDate } from "pages/common/helpers";

export const UserQualificationsForm = ({
  data,
  isOpen,
  innerRef,
  formType,
  userId,
  reservedQualificationTypes = []
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    reset,
    getValues,
    clearErrors,
    resetField,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: {
      qualificationType: "",
      certificateNumber: "",
      certificateDate: "",
      country: "",
      state: "",
      district: "",
      localBodyType: "",
      localBodyTypeName: "",
      enrollmentNumber: "",
      institutionType: "",
      institution: "",
      notes: ""
    },
    resolver: yupResolver(userQualificationValidate)
  });

  const dispatch = useDispatch(),
    {
      getQualificationTypesRes,
      getInstitutionTypesRes,
      getCountriesRes,
      getStatesRes,
      getDistrictsRes,
      getLocalBodyTypesRes,
      getLocalBodyNamesRes,
      getInstitutionsRes
    } = useSelector((state) => state.common),
    { saveUserQualificationLoading, updateUserQualificationLoading } =
      useSelector((state) => state.users);

  const [files, setFiles] = useState([]),
    [additionalFiles, setAdditionalFiles] = useState([]);

  useEffect(() => {
    switch (formType) {
      case "create": {
        reset({
          qualificationType: "",
          certificateNumber: "",
          certificateDate: "",
          country: "",
          state: "",
          district: "",
          localBodyType: "",
          localBodyTypeName: "",
          enrollmentNumber: "",
          institutionType: "",
          institution: "",
          notes: ""
        });
        break;
      }
      case "edit": {
        reset({
          qualificationType: !_.isNil(data?.qualificationTypeID)
            ? +data?.qualificationTypeID
            : "",
          certificateNumber: data?.certificateNumber ?? "",
          certificateDate: data?.certificateDate
            ? formatInputDate(data?.certificateDate) ?? ""
            : "",
          country: !_.isNil(data?.countryID) ? +data?.countryID : "",
          state: !_.isNil(data?.stateID) ? +data?.stateID : "",
          district: !_.isNil(data?.districtID) ? +data?.districtID : "",
          localBodyType: !_.isNil(data?.localBodyTypeID)
            ? +data?.localBodyTypeID
            : "",
          localBodyName: !_.isNil(data?.localBodyNameID)
            ? +data?.localBodyNameID
            : "",
          enrollmentNumber: data?.enrollmentNumber ?? "",
          institutionType: !_.isNil(data?.institutionTypeID)
            ? +data?.institutionTypeID
            : "",
          institution: !_.isNil(data?.institutionID)
            ? +data?.institutionID
            : "",
          notes: data?.notes ?? ""
        });

        setAdditionalFiles(Array.isArray(data?.uploads) ? data?.uploads : []);

        if (!_.isNil(data?.countryID)) dispatch(getStates(data.countryID));
        if (!_.isNil(data?.stateID)) dispatch(getDistricts(data.stateID));
        if (!_.isNil(data?.districtID) && !_.isNil(data?.localBodyTypeID)) {
          const reqBody = {
            parentID: +data?.districtID,
            regionType: +data?.localBodyTypeID
          };
          dispatch(getLocalBodyNames(reqBody));
        }

        if (
          !_.isNil(data?.institutionTypeID) &&
          !_.isNil(data?.localBodyNameID)
        ) {
          const formData = new FormData();
          formData.append("lookupTypeName", "Organization");
          formData.append("lookupType", "T");
          formData.append(
            "searchCriteria",
            JSON.stringify({
              organizationTypeID: +data?.institutionTypeID,
              localBodyName: +data?.localBodyNameID
            })
          );

          dispatch(getInstitutions(formData));
        }
        break;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getLocalBodyTypes());
    dispatch(getQualificationTypes());
    dispatch(getInstitutionTypes());

    return () => {
      setFiles([]);
      setAdditionalFiles([]);
    };
  }, []);

  const handleChange = (value, field) => {
    switch (field) {
      case "qualificationType":
        setValue("qualificationType", value?.LookupDetailID ?? "", {
          shouldValidate: true
        });
        break;
      case "country":
        setValue("country", value?.id ?? "", { shouldValidate: true });
        dispatch(getStates(value?.id));
        break;
      case "state":
        setValue("state", value?.id ?? "", { shouldValidate: true });
        dispatch(getDistricts(value?.id));
        break;
      case "district":
        setValue("district", value?.id ?? "", { shouldValidate: true });

        if (value?.id !== getValues("district")) {
          resetField("localBodyName", { defaultValue: "" });
        }

        if (getValues("localBodyType") && value?.id) {
          const requestData = {
            parentID: value?.id,
            regionType: getValues("localBodyType")
          };
          dispatch(getLocalBodyNames(requestData));
        }
        break;
      case "localBodyType": {
        setValue("localBodyType", value?.RegionTypeID ?? "", {
          shouldValidate: true
        });

        if (getValues("district") && value?.RegionTypeID) {
          const requestData = {
            parentID: getValues("district"),
            regionType: value?.RegionTypeID
          };
          dispatch(getLocalBodyNames(requestData));
        }

        if (value?.RegionTypeID !== getValues("localBodyType")) {
          resetField("localBodyName", { defaultValue: "" });
        }

        break;
      }
      case "localBodyName": {
        if (value?.id !== getValues("localBodyName")) {
          resetField("institutionType", { defaultValue: "" });
          resetField("institution", { defaultValue: "" });
        }

        setValue("localBodyName", value?.id ?? "", { shouldValidate: true });

        if (value?.id && getValues("institutionType")) {
          const formData = new FormData();
          formData.append("lookupTypeName", "Organization");
          formData.append("lookupType", "T");
          formData.append(
            "searchCriteria",
            JSON.stringify({
              organizationTypeID: getValues("institutionType"),
              localBodyName: value?.id
            })
          );

          dispatch(getInstitutions(formData));
        }
        break;
      }

      case "institutionType": {
        setValue("institutionType", value?.LookupDetailID ?? "", {
          shouldValidate: true
        });

        if (value?.LookupDetailID !== getValues("institutionType")) {
          resetField("institution", { defaultValue: "" });
        }

        if (value?.LookupDetailID && getValues("localBodyName")) {
          const formData = new FormData();
          formData.append("lookupTypeName", "Organization");
          formData.append("lookupType", "T");
          formData.append(
            "searchCriteria",
            JSON.stringify({
              organizationTypeID: value?.LookupDetailID,
              localBodyName: getValues("localBodyName")
            })
          );

          dispatch(getInstitutions(formData));
        }
        break;
      }

      case "institution":
        setValue("institution", value?.OrganizationID ?? "", {
          shouldValidate: true
        });
        break;
      default:
        setValue(field, value?.id ?? "", { shouldValidate: true });
        break;
    }

    clearErrors();
  };

  const handleClick = (field, invalid) => {
    let message = "";

    switch (field) {
      case "state":
        message = "Please select a country";
        break;
      case "district":
        message = "Please select a state";
        break;
      case "localBodyName":
        message = !getValues("district")
          ? "Please select a district"
          : "Please select a local body type";
        break;
      case "institution":
        message = !getValues("institutionType")
          ? "Please select an institution type"
          : "Please select a local body name";
        break;
    }
    if (invalid) setError(field, { type: "custom", message: message });
  };

  const onSubmit = (formSubmitData) => {
    if (saveUserQualificationLoading || updateUserQualificationLoading) return;
    const formData = new FormData();

    formData.append("userID", userId);
    formData.append("qualificationTypeID", formSubmitData?.qualificationType);
    formData.append("certificateNumber", formSubmitData?.certificateNumber);
    formData.append("country", formSubmitData?.country);
    formData.append("state", formSubmitData?.state);
    formData.append("district", formSubmitData?.district);
    formData.append("localBodyType", formSubmitData?.localBodyType);
    formData.append("localBodyName", formSubmitData?.localBodyName);
    formData.append("enrollmentNumber", formSubmitData?.enrollmentNumber);
    formData.append("institutionType", formSubmitData?.institutionType);
    formData.append("organizationID", formSubmitData?.institution);
    formData.append("notes", formSubmitData?.notes);
    formData.append(
      "certificateDate",
      formSubmitData?.certificateDate?.replaceAll("-", "/")
    );
    files.map((file) => {
      formData.append("uploads", file);
    });

    switch (formType) {
      case "create":
        dispatch(saveUserQualifications(formData));
        break;
      case "edit": {
        const set = new Set(additionalFiles.map((obj) => JSON.stringify(obj)));

        const removedFiles = (
          Array.isArray(data?.uploads) ? data.uploads : []
        ).filter((obj) => !set.has(JSON.stringify(obj)));

        const removedFilesIDs =
          removedFiles?.length > 0
            ? removedFiles?.map((item) => item?.documentID)
            : [];

        formData.append("removedFiles", JSON.stringify(removedFilesIDs));
        formData.append(
          "userQualificationDetailID",
          data?.userQualificationDetailID
        );

        dispatch(updateUserQualifications(formData));
        break;
      }
    }
  };

  return (
    <Fragment>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="m-4"
        style={{ scrollbarGutter: "stable" }}
        autoComplete="one-time-code"
      >
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5">
          <FormController
            control={control}
            errors={errors}
            type="select"
            name="qualificationType"
            label="Qualification Type"
            optionKey="LookupDetailID"
            shrink
            required
            options={
              formType === "create"
                ? getQualificationTypesRes?.data.filter(
                    (item) =>
                      !reservedQualificationTypes.includes(item.LookupDetailID)
                  ) || []
                : getQualificationTypesRes?.data.filter(
                    (item) =>
                      !reservedQualificationTypes.includes(
                        item.LookupDetailID
                      ) || item.LookupDetailID === data?.qualificationTypeID
                  ) || []
            }
            handleChange={(value) => handleChange(value, "qualificationType")}
          />

          <FormController
            control={control}
            errors={errors}
            type="text"
            name="certificateNumber"
            label="Certificate Number"
            placeholder="Enter Certificate Number"
            shrink
            required
          />

          <FormController
            control={control}
            errors={errors}
            type="date"
            name="certificateDate"
            label="Certificate Date"
            placeholder="Select Certificate date"
            shrink
            required
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="country"
            label="Country"
            shrink
            required
            options={getCountriesRes?.data || []}
            handleChange={(value) => handleChange(value, "country")}
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="state"
            label="State"
            shrink
            required
            options={getStatesRes?.data || []}
            handleChange={(value) => handleChange(value, "state")}
            disabled={!getValues("country") && !getValues("state")}
            onClick={() =>
              handleClick("state", !getValues("country") && !getValues("state"))
            }
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="district"
            label="District"
            shrink
            required
            options={getDistrictsRes?.data || []}
            handleChange={(value) => handleChange(value, "district")}
            disabled={!getValues("state") && !getValues("district")}
            onClick={() =>
              handleClick(
                "district",
                !getValues("state") && !getValues("district")
              )
            }
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="localBodyType"
            label="Local Body Type"
            optionKey="RegionTypeID"
            shrink
            required
            options={getLocalBodyTypesRes?.data || []}
            handleChange={(value) => handleChange(value, "localBodyType")}
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="localBodyName"
            label="Local Body Name"
            shrink
            required
            options={getLocalBodyNamesRes?.data || []}
            handleChange={(data) => handleChange(data, "localBodyName")}
            disabled={!getValues("localBodyName") && !getValues("district")}
            onClick={() =>
              handleClick(
                "localBodyName",
                !getValues("localBodyName") && !getValues("district")
              )
            }
          />

          <FormController
            control={control}
            errors={errors}
            type="text"
            name="enrollmentNumber"
            label="Admission Number"
            placeholder="Enter Admission Number"
            shrink
            required
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="institutionType"
            label="Institution Type"
            shrink
            required
            options={getInstitutionTypesRes?.data || []}
            optionKey="LookupDetailID"
            handleChange={(value) => handleChange(value, "institutionType")}
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="institution"
            label="Institution"
            optionKey="OrganizationID"
            shrink
            required
            options={getInstitutionsRes?.data || []}
            handleChange={(value) => handleChange(value, "institution")}
            disabled={
              (!getValues("institutionType") || !getValues("localBodyName")) &&
              !getValues("institution")
            }
            onClick={() =>
              handleClick(
                "institution",
                (!getValues("institutionType") ||
                  !getValues("localBodyName")) &&
                  !getValues("institution")
              )
            }
          />
        </div>

        <div className="mt-5">
          <FormController
            control={control}
            errors={errors}
            type="text-area"
            name="notes"
            label="Remarks"
            rows="4"
            shrink
          />
        </div>

        <div className="mt-5">
          <DragNDropFile
            label="Attachments"
            files={files}
            setFiles={setFiles}
            additionalFiles={additionalFiles}
            setAdditionalFiles={setAdditionalFiles}
          />
        </div>

        <button type="submit" ref={innerRef} style={{ display: "none" }}>
          Submit Trigger
        </button>
      </form>
    </Fragment>
  );
};
