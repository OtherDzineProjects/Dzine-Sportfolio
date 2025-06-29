import { yupResolver } from "@hookform/resolvers/yup";
import { FormController } from "common";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import {
  getBloodGroups,
  getCountries,
  getDistricts,
  getGenders,
  getLocalBodyNames,
  getLocalBodyTypes,
  getPostOffices,
  getStates,
  getWards
} from "pages/common/api";
import { useSelector } from "react-redux";
import { userBasicValidate } from "../components/validate";
import _ from "lodash";
import { useMemo } from "react";
import { saveUserBasicDetails, updateUserBasicDetails } from "../api";
import { formatInputDate } from "pages/common/helpers";

export const UserBasicForm = ({
  isOpen,
  innerRef,
  formType,
  userId,
  formData
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    setError,
    clearErrors,
    resetField
  } = useForm({
    mode: "all",
    defaultValues: {
      firstName: "",
      lastName: "",
      emailID: "",
      phoneNumber: "",
      gender: "",
      dateOfBirth: "",
      bloodGroup: "",
      country: "",
      state: "",
      district: "",
      city: "",
      representingDistricts: "",
      houseName: "",
      streetName: "",
      place: "",
      localBodyType: "",
      localBodyName: "",
      wardName: "",
      postOffice: "",
      pinCode: "",
      bio: ""
    },
    resolver: yupResolver(userBasicValidate)
  });

  const dispatch = useDispatch(),
    { saveUserBasicDetailLoading, updateUserBasicDetailLoading } = useSelector(
      (state) => state.users
    ),
    {
      getCountriesRes,
      getStatesRes,
      getDistrictsRes,
      getLocalBodyNamesRes,
      getWardsRes,
      getPostOfficesRes,
      getLocalBodyTypesRes,
      getBloodGroupsRes,
      getGendersRes
    } = useSelector((state) => state.common);

  useEffect(() => {
    switch (formType) {
      case "create":
        reset({
          firstName: "",
          middleName: "",
          lastName: "",
          nickName: "",
          emailID: "",
          phoneNumber: "",
          alternativePhoneNumber: "",
          gender: "",
          dateOfBirth: "",
          bloodGroup: "",
          country: "",
          state: "",
          district: "",
          city: "",
          representingDistricts: [],
          houseName: "",
          streetName: "",
          place: "",
          localBodyType: "",
          localBodyName: "",
          wardName: "",
          postOffice: "",
          pinCode: "",
          bio: ""
        });
        break;
      case "edit": {
        reset({
          firstName: formData?.firstName ?? "",
          middleName: formData?.middleName ?? "",
          lastName: formData?.lastName ?? "",
          nickName: formData?.nickName ?? "",
          emailID: formData?.emailID ?? "",
          phoneNumber: formData?.phoneNumber ?? "",
          alternativePhoneNumber: formData?.alternativePhoneNumber ?? "",
          gender: !_.isNil(formData?.genderId) >= 0 ? +formData?.genderId : "",
          dateOfBirth: formData?.dateOfBirth
            ? formatInputDate(formData?.dateOfBirth) ?? ""
            : "",
          bloodGroup: !_.isNil(formData?.bloodGroupId)
            ? +formData?.bloodGroupId
            : "",
          country: !_.isNil(formData?.countryID) ? +formData?.countryID : "",
          state: !_.isNil(formData?.stateID) ? +formData?.stateID : "",
          district: !_.isNil(formData?.districtID) ? +formData?.districtID : "",
          city: formData?.city ?? "",
          representingDistricts:
            !_.isNil(formData?.representingDistricts) &&
            Array.isArray(formData?.representingDistricts)
              ? formData?.representingDistricts?.map((value) => value?.id)
              : [],
          houseName: formData?.houseName ?? "",
          streetName: formData?.streetName ?? "",
          place: formData?.place ?? "",
          localBodyType: !_.isNil(formData?.localBodyTypeId)
            ? +formData?.localBodyTypeId
            : "",
          localBodyName: !_.isNil(formData?.localBodyNameId)
            ? +formData?.localBodyNameId
            : "",
          wardName: !_.isNil(formData?.wardId) ? +formData?.wardId : "",
          postOffice: !_.isNil(formData?.postOfficeId)
            ? +formData?.postOfficeId
            : "",
          pinCode: formData?.pinCode ?? "",
          bio: formData?.bio || ""
        });

        if (!_.isNil(formData?.countryID))
          dispatch(getStates(formData.countryID));
        if (!_.isNil(formData?.stateID))
          dispatch(getDistricts(formData.stateID));
        if (!_.isNil(formData?.districtID)) {
          dispatch(getWards(formData?.districtID));
          dispatch(getPostOffices(formData?.districtID));

          if (!_.isNil(formData?.localBodyTypeId)) {
            const reqBody = {
              parentID: formData?.districtID,
              regionType: formData.localBodyTypeId
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
    dispatch(getBloodGroups());
    dispatch(getGenders());
  }, []);

  const handleChange = (data, field) => {
    switch (field) {
      case "gender":
      case "bloodGroup":
        setValue(field, data?.LookupDetailID ?? "", { shouldValidate: true });
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

  const handleMultiSelectChange = (data, field) => setValue(field, data);

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
    if (saveUserBasicDetailLoading || updateUserBasicDetailLoading) return;

    if (submitData.dateOfBirth)
      submitData.dateOfBirth = submitData?.dateOfBirth?.replaceAll("-", "/");

    submitData["userID"] = userId;

    switch (formType) {
      case "create":
        dispatch(saveUserBasicDetails(submitData));
        break;
      case "edit":
        submitData["userBasicDetailID"] = formData["userBasicDetailID"];
        dispatch(updateUserBasicDetails(submitData));
        break;
    }
  };

  const maxDate = useMemo(() => {
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
          name="firstName"
          label="First Name"
          placeholder="Enter your name"
          shrink
          required
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="middleName"
          label="Middle Name"
          placeholder="Enter your name"
          shrink
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="lastName"
          label="Last Name"
          placeholder="Enter your name"
          shrink
          required
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="nickName"
          label="Nickname"
          placeholder="Enter your name"
          shrink
        />

        <FormController
          control={control}
          errors={errors}
          type="email"
          name="emailID"
          label="Email Address"
          placeholder="Enter your email"
          shrink
          required
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="phoneNumber"
          label="Phone Number"
          placeholder="Enter your phone number"
          shrink
          required
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="alternativePhoneNumber"
          label="Alternate Phone Number"
          placeholder="Enter your phone number"
          shrink
        />

        <FormController
          control={control}
          errors={errors}
          type="date"
          name="dateOfBirth"
          label="Date of Birth"
          placeholder="Select Date of Birth"
          shrink
          required
          maxDate={maxDate}
        />

        <FormController
          control={control}
          errors={errors}
          type="select"
          name="bloodGroup"
          label="Blood Group"
          optionKey="LookupDetailID"
          shrink
          required
          options={getBloodGroupsRes?.data || []}
          handleChange={(data) => handleChange(data, "bloodGroup")}
        />

        <FormController
          control={control}
          errors={errors}
          type="select"
          name="gender"
          label="Gender"
          optionKey="LookupDetailID"
          placeholder="Select Gender"
          shrink
          required
          options={getGendersRes?.data || []}
          handleChange={(data) => handleChange(data, "gender")}
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
          type="text"
          name="houseName"
          label="House Name"
          placeholder="Enter House Name"
          shrink
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="streetName"
          label="Street Name"
          placeholder="Enter Street Name"
          shrink
        />

        <FormController
          control={control}
          errors={errors}
          type="text"
          name="place"
          label="Place"
          placeholder="Enter Local Name"
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

        <div className="col-span-2">
          <FormController
            control={control}
            errors={errors}
            type="multi-select"
            name="representingDistricts"
            label="Representing Districts"
            shrink
            options={getDistrictsRes?.data || []}
            optionKey="id"
            handleChange={(data) =>
              handleMultiSelectChange(data, "representingDistricts")
            }
            disabled={
              !getValues("state") &&
              (!getValues("representingDistricts") ||
                getValues("representingDistricts")?.length === 0)
            }
            onClick={() =>
              handleClick("representingDistricts", !getValues("state"))
            }
          />
        </div>

        <div className="col-span-3">
          <FormController
            control={control}
            errors={errors}
            type="rich"
            name="bio"
            label="Bio"
            toolBarPosition="bottom"
            shrink
          />
        </div>
      </div>

      <button type="submit" ref={innerRef} style={{ display: "none" }}>
        Submit Trigger
      </button>
    </form>
  );
};
