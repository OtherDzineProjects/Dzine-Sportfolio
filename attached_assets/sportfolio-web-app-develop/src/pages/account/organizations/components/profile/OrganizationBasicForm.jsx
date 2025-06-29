import { yupResolver } from "@hookform/resolvers/yup";
import { FormController } from "common";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateOrg } from "../../api";
import { useEffect } from "react";
import _ from "lodash";
import { orgBasicValidate } from "../validate";
import { useMemo } from "react";
import {
  getCountries,
  getDistricts,
  getInstitutionTypes,
  getLocalBodyNames,
  getLocalBodyTypes,
  getPostOffices,
  getStates,
  getWards
} from "pages/common/api";
import { formatInputDate } from "pages/common/helpers";

export default function OrganizationBasicForm({
  isOpen,
  innerRef,
  formType,
  organizationId,
  formData,
  loading
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    setError,
    clearErrors,
    resetField,
    watch
  } = useForm({
    mode: "all",
    defaultValues: {
      organizationName: "",
      organizationEmail: "",
      organizationTypeID: "",
      phoneNumber: "",
      registrationNumber: "",
      registrationValidFrom: "",
      registrationValidTo: "",
      inchargeName: "",
      inchargeEmail: "",
      inchargePhone: "",
      country: "",
      state: "",
      district: "",
      city: "",
      localBodyType: "",
      localBodyName: "",
      wardName: "",
      postOffice: "",
      pinCode: "",
      website: ""
    },
    resolver: yupResolver(orgBasicValidate)
  });
  const dispatch = useDispatch(),
    {
      getCountriesRes,
      getStatesRes,
      getDistrictsRes,
      getLocalBodyNamesRes,
      getWardsRes,
      getPostOfficesRes,
      getLocalBodyTypesRes,
      getInstitutionTypesRes
    } = useSelector((state) => state.common);

  useEffect(() => {
    switch (formType) {
      case "create":
        reset({
          organizationName: "",
          organizationEmail: "",
          organizationTypeID: "",
          phoneNumber: "",
          registrationNumber: "",
          registrationValidFrom: "",
          registrationValidTo: "",
          inchargeName: "",
          inchargeEmail: "",
          inchargePhone: "",
          country: "",
          state: "",
          district: "",
          city: "",
          localBodyType: "",
          localBodyName: "",
          wardName: "",
          postOffice: "",
          pinCode: "",
          website: ""
        });
        break;
      case "edit": {
        reset({
          organizationName: formData?.organizationName || "",
          organizationEmail: formData?.organizationEmail || "",
          organizationTypeID: !_.isNil(formData?.organizationTypeID)
            ? +formData.organizationTypeID
            : "",
          phoneNumber: formData?.phoneNumber || "",
          registrationNumber: formData?.registrationNumber || "",
          registrationValidFrom: formData?.registrationValidFrom
            ? formatInputDate(formData.registrationValidFrom)
            : "",
          registrationValidTo: formData?.registrationValidTo
            ? formatInputDate(formData.registrationValidTo)
            : "",
          inchargeName: formData?.inchargeName || "",
          inchargeEmail: formData?.inchargeEmail || "",
          inchargePhone: formData?.inchargePhone || "",
          country: !_.isNil(formData?.countryID) ? +formData.countryID : "",
          state: !_.isNil(formData?.stateID) ? +formData.stateID : "",
          district: !_.isNil(formData?.districtID) ? +formData.districtID : "",
          city: formData?.city || "",
          localBodyType: !_.isNil(formData?.localBodyTypeID)
            ? +formData.localBodyTypeID
            : "",
          localBodyName: !_.isNil(formData?.localBodyNameID)
            ? +formData.localBodyNameID
            : "",
          wardName: !_.isNil(formData?.wardID) ? +formData.wardID : "",
          postOffice: !_.isNil(formData?.postOfficeID)
            ? +formData.postOfficeID
            : "",
          pinCode: !_.isNil(formData?.pinCode) ? +formData.pinCode : "",
          website: formData?.website || ""
        });

        if (!_.isNil(formData?.countryID))
          dispatch(getStates(+formData.countryID));
        if (!_.isNil(formData?.stateID))
          dispatch(getDistricts(+formData.stateID));
        if (!_.isNil(formData?.districtID)) {
          dispatch(getWards(+formData?.districtID));
          dispatch(getPostOffices(+formData?.districtID));

          if (!_.isNil(formData?.localBodyTypeID)) {
            const reqBody = {
              parentID: +formData.districtID,
              regionType: +formData.localBodyTypeID
            };
            dispatch(getLocalBodyNames(reqBody));
          }
        }

        break;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getLocalBodyTypes());
    dispatch(getInstitutionTypes());
  }, []);

  const handleChange = (data, field) => {
    switch (field) {
      case "organizationTypeID":
        setValue("organizationTypeID", data?.LookupDetailID ?? "", {
          shouldValidate: true
        });
        break;
      case "country":
        setValue("country", data?.id ?? "", { shouldValidate: true });
        dispatch(getStates(data?.id));
        break;
      case "state":
        setValue("state", data?.id ?? "", { shouldValidate: true });
        dispatch(getDistricts(data?.id));
        break;
      case "district":
        if (data?.id === getValues("district")) {
          resetField("localBodyName", { defaultValue: "" });
          resetField("wardName", { defaultValue: "" });
          resetField("postOffice", { defaultValue: "" });
        }
        setValue("district", data?.id ?? "", { shouldValidate: true });

        if (data?.id && getValues("localBodyType")) {
          const requestData = {
            parentID: data?.id,
            regionType: getValues("localBodyType")
          };
          dispatch(getLocalBodyNames(requestData));
        }

        break;
      case "localBodyType": {
        setValue("localBodyType", data?.RegionTypeID ?? "", {
          shouldValidate: false
        });

        if (getValues("district") && data?.RegionTypeID) {
          const requestData = {
            parentID: getValues("district"),
            regionType: data?.RegionTypeID
          };
          dispatch(getLocalBodyNames(requestData));
        }

        resetField("localBodyName", { defaultValue: "" });
        break;
      }
      case "localBodyName":
        setValue("localBodyName", data?.id ?? "", {
          shouldValidate: true
        });
        dispatch(getWards(getValues("district")));
        break;
      case "wardName":
        setValue("wardName", data?.id ?? "", {
          shouldValidate: true
        });

        dispatch(getPostOffices(getValues("district")));
        break;
      default:
        setValue(field, data?.id ?? "", { shouldValidate: true });
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
      case "representingDistricts":
        message = "Please select a state";
        break;
      case "localBodyName":
        message = !getValues("district")
          ? "Please select a district"
          : "Please select a local body type";
        break;
      case "wardName":
        message = !getValues("district")
          ? "Please select a district"
          : "Please select a local body name";
        break;
      case "postOffice":
        message = !getValues("district")
          ? "Please select a district"
          : "Please select a ward name";
        break;
    }
    if (invalid) setError(field, { type: "custom", message: message });
  };

  const onSubmit = (submitData) => {
    if (loading) return;

    if (submitData.registrationValidFrom)
      submitData.registrationValidFrom =
        submitData?.registrationValidFrom?.replaceAll("-", "/");

    if (submitData.registrationValidTo)
      submitData.registrationValidTo =
        submitData?.registrationValidTo?.replaceAll("-", "/");

    submitData["about"] = formData?.about || "";
    submitData["organizationId"] = organizationId;

    dispatch(updateOrg({ id: organizationId, data: submitData }));
  };

  const dateRestriction = useMemo(() => {
    const dtToday = new Date(),
      year = dtToday.getFullYear();
    let month = dtToday.getMonth() + 1,
      day = dtToday.getDate();

    if (month < 10) month = "0" + month.toString();
    if (day < 10) day = "0" + day.toString();

    return `${year}-${month}-${day}`;
  }, []);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-4"
      style={{ scrollbarGutter: "stable" }}
      autoComplete="one-time-code"
    >
      <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5 ">
        <FormController
          control={control}
          errors={errors}
          type="text"
          name="organizationName"
          label="Org Name"
          placeholder="Enter organization name"
          shrink
          required
        />

        <FormController
          control={control}
          errors={errors}
          type="select"
          name="organizationTypeID"
          label="Organization Type"
          optionKey="LookupDetailID"
          shrink
          required
          options={getInstitutionTypesRes?.data || []}
          handleChange={(data) => handleChange(data, "organizationTypeID")}
        />

        <FormController
          control={control}
          errors={errors}
          type="email"
          name="organizationEmail"
          label="Org Official Email"
          placeholder="Enter official email"
          shrink
          required
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="phoneNumber"
          label="Org Official Phone"
          placeholder="Enter official phone number"
          shrink
          required
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="registrationNumber"
          label="Registration Number"
          placeholder="Enter registration number"
          shrink
        />

        <FormController
          control={control}
          errors={errors}
          type="date"
          name="registrationValidFrom"
          label="Registration Valid From"
          placeholder="Select valid from date"
          maxDate={dateRestriction}
          handleChange={() =>
            resetField("registrationValidTo", { defaultValue: dateRestriction })
          }
          shrink
        />

        <FormController
          control={control}
          errors={errors}
          type="date"
          name="registrationValidTo"
          label="Registration Valid To"
          placeholder="Select valid from to"
          shrink
          minDate={
            watch("registrationValidFrom") && getValues("registrationValidFrom")
              ? getValues("registrationValidFrom")
              : dateRestriction
          }
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="inchargeName"
          label="Incharge Name"
          placeholder="Enter incharge name"
          shrink
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="inchargePhone"
          label="Incharge Phone"
          placeholder="Enter incharge phone"
          shrink
        />

        <FormController
          control={control}
          errors={errors}
          type="email"
          name="inchargeEmail"
          label="Incharge Email"
          placeholder="Enter incharge email"
          shrink
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="website"
          label="Website"
          placeholder="Enter website"
          shrink
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
          handleChange={(data) => handleChange(data, "country")}
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
          handleChange={(data) => handleChange(data, "state")}
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
          handleChange={(data) => handleChange(data, "district")}
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
          type="text"
          name="city"
          label="City"
          placeholder="Enter City Name"
          shrink
        />

        <FormController
          control={control}
          errors={errors}
          type="select"
          name="localBodyType"
          optionKey="RegionTypeID"
          label="Local Body Type"
          shrink
          required
          options={getLocalBodyTypesRes?.data || []}
          handleChange={(data) => handleChange(data, "localBodyType")}
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
          disabled={
            !getValues("localBodyName") &&
            (!getValues("district") || !getValues("localBodyType"))
          }
          onClick={() =>
            handleClick(
              "localBodyName",
              !getValues("localBodyName") &&
                (!getValues("district") || !getValues("localBodyType"))
            )
          }
        />

        <FormController
          control={control}
          errors={errors}
          type="select"
          name="wardName"
          label="Ward Name"
          options={getWardsRes?.data || []}
          shrink
          required
          handleChange={(data) => handleChange(data, "wardName")}
          disabled={
            (!getValues("district") || !getValues("localBodyName")) &&
            !getValues("wardName")
          }
          onClick={() =>
            handleClick(
              "wardName",
              (!getValues("district") || !getValues("localBodyName")) &&
                !getValues("wardName")
            )
          }
        />

        <FormController
          control={control}
          errors={errors}
          type="select"
          name="postOffice"
          label="Post Office"
          shrink
          required
          options={getPostOfficesRes?.data || []}
          handleChange={(data) => handleChange(data, "postOffice")}
          disabled={
            (!getValues("district") || !getValues("wardName")) &&
            !getValues("postOffice")
          }
          onClick={() =>
            handleClick(
              "postOffice",
              (!getValues("district") || !getValues("wardName")) &&
                !getValues("postOffice")
            )
          }
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="pinCode"
          label="Pincode"
          placeholder="Enter your Pin Code"
          shrink
          required
        />
      </div>

      <button type="submit" ref={innerRef} style={{ display: "none" }}>
        Submit Trigger
      </button>
    </form>
  );
}
