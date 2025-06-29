import ContactCommunication from "pages/account/profile/components/Steps/components/ContactCommunication";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormController } from "common";
import { userContactValidate } from "../components/validate";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { saveUserContactDetails, updateUserContactDetails } from "../api";
import {
  getAddressTypes,
  getCommunicationTypes,
  getCountries,
  getDistricts,
  getLocalBodyNames,
  getLocalBodyTypes,
  getPostOffices,
  getStates,
  getWards
} from "pages/common/api";
import { Fragment, useState, useEffect } from "react";
import _ from "lodash";

export const UserContactForm = ({
  formData,
  isOpen,
  innerRef,
  formType,
  userId,
  additionalFormData
}) => {
  const {
    control,
    handleSubmit,
    setValue,
    setError,
    getValues,
    reset,
    clearErrors,
    resetField,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: {
      sameAsBasicDetail: false,
      addressType: "",
      country: "",
      state: "",
      district: "",
      city: "",
      houseName: "",
      streetName: "",
      place: "",
      localBodyType: "",
      localBodyTypeName: "",
      wardName: "",
      postOffice: "",
      pinCode: ""
    },
    resolver: yupResolver(userContactValidate)
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
      getCommunicationTypesRes,
      getAddressTypesRes
    } = useSelector((state) => state.common),
    { saveUserContactDetailLoading, updateUserContactDetailLoading } =
      useSelector((state) => state.users);

  const [communicationDetails, setCommunicationDetails] = useState([]);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getLocalBodyTypes());
    dispatch(getAddressTypes());
    dispatch(getCommunicationTypes());
  }, []);

  useEffect(() => {
    switch (formType) {
      case "create": {
        const body = {
          sameAsBasicDetail: false,
          addressType: "",
          country: "",
          state: "",
          district: "",
          city: "",
          houseName: "",
          streetName: "",
          place: "",
          localBodyType: "",
          localBodyTypeName: "",
          wardName: "",
          postOffice: "",
          pinCode: ""
        };
        reset(body, false);
        setCommunicationDetails([]);
        break;
      }
      case "edit": {
        reset({
          sameAsBasicDetail:
            formData?.sameAsBasicDetail &&
            !(_.isEmpty(additionalFormData) || _.isNil(additionalFormData)),
          addressType: !_.isNil(formData?.addressTypeID)
            ? +formData?.addressTypeID
            : "",
          country: !_.isNil(formData?.countryID) ? +formData?.countryID : "",
          state: !_.isNil(formData?.stateID) ? +formData?.stateID : "",
          district: !_.isNil(formData?.districtID) ? +formData?.districtID : "",
          city: formData?.city ?? "",
          houseName: formData?.houseName ?? "",
          streetName: formData?.streetName ?? "",
          place: formData?.place ?? "",
          localBodyType: !_.isNil(formData?.localBodyTypeID)
            ? +formData?.localBodyTypeID
            : "",
          localBodyName: !_.isNil(formData?.localBodyNameID)
            ? +formData?.localBodyNameID
            : "",
          wardName: !_.isNil(formData?.wardID) ? +formData?.wardID : "",
          postOffice: !_.isNil(formData?.postOfficeID)
            ? +formData?.postOfficeID
            : "",
          pinCode: formData?.pinCode ?? ""
        });

        if (!_.isNil(formData?.countryID))
          dispatch(getStates(formData.countryID));
        if (!_.isNil(formData?.stateID))
          dispatch(getDistricts(formData.stateID));
        if (!_.isNil(formData?.districtID)) {
          dispatch(getWards(formData?.districtID));
          dispatch(getPostOffices(formData?.districtID));

          if (!_.isNil(formData.localBodyTypeID)) {
            const reqBody = {
              parentID: formData?.districtID,
              regionType: formData.localBodyTypeID
            };
            dispatch(getLocalBodyNames(reqBody));
          }
        }

        setCommunicationDetails(
          formData.communicationDetails?.map(
            // eslint-disable-next-line no-unused-vars
            ({ communicationTypeName, ...item }) => item
          ) ?? []
        );
        break;
      }
    }

    return () => setCommunicationDetails([]);
  }, [isOpen]);

  const handleTextChange = () => {
    if (getValues("sameAsBasicDetail"))
      resetField("sameAsBasicDetail", { defaultValue: false });
  };

  const handleChange = (value, field) => {
    switch (field) {
      case "addressType":
        setValue("addressType", value?.LookupDetailID ?? "", {
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
        if (value?.id === getValues("district"))
          resetField("localBodyName", { defaultValue: "" });

        setValue("district", value?.id ?? "", { shouldValidate: true });

        if (value?.id && getValues("localBodyType")) {
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

        resetField("localBodyName", { defaultValue: "" });
        break;
      }
      case "localBodyName":
        setValue("localBodyName", value?.id ?? "", { shouldValidate: true });
        dispatch(getWards(getValues("district")));
        break;
      case "wardName":
        setValue("wardName", value?.id ?? "", {
          shouldValidate: true
        });
        dispatch(getPostOffices(getValues("district")));

        break;
      default:
        setValue(field, value?.id ?? "", { shouldValidate: true });
        break;
    }

    clearErrors();
    if (field !== "addressType") handleTextChange();
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

  const toggleSameAsBasicAddress = (value) => {
    if (value) {
      reset({
        sameAsBasicDetail: value,
        addressType: getValues("addressType") ?? "",
        country: !_.isNil(additionalFormData?.countryID)
          ? +additionalFormData?.countryID
          : "",
        state: !_.isNil(additionalFormData?.stateID)
          ? +additionalFormData?.stateID
          : "",
        district: !_.isNil(additionalFormData?.districtID)
          ? +additionalFormData?.districtID
          : "",
        city: additionalFormData?.city ?? "",
        houseName: additionalFormData?.houseName ?? "",
        streetName: additionalFormData?.streetName ?? "",
        place: additionalFormData?.place ?? "",
        localBodyType: !_.isNil(additionalFormData?.localBodyTypeId)
          ? +additionalFormData?.localBodyTypeId
          : "",
        localBodyName: !_.isNil(additionalFormData?.localBodyNameId)
          ? +additionalFormData?.localBodyNameId
          : "",
        wardName: !_.isNil(additionalFormData?.wardId)
          ? +additionalFormData?.wardId
          : "",
        postOffice: !_.isNil(additionalFormData?.postOfficeId)
          ? +additionalFormData?.postOfficeId
          : "",
        pinCode: additionalFormData?.pinCode ?? ""
      });

      if (!_.isNil(additionalFormData?.countryID))
        dispatch(getStates(+additionalFormData.countryID));
      if (!_.isNil(additionalFormData?.stateID))
        dispatch(getDistricts(additionalFormData.stateID));
      if (!_.isNil(additionalFormData?.districtID)) {
        dispatch(getWards(additionalFormData?.districtID));
        dispatch(getPostOffices(additionalFormData?.districtID));

        if (!_.isNil(additionalFormData?.localBodyTypeId)) {
          const reqBody = {
            parentID: additionalFormData.districtID,
            regionType: additionalFormData.localBodyTypeId
          };
          dispatch(getLocalBodyNames(reqBody));
        }
      }
    } else {
      reset({
        sameAsBasicDetail: value,
        addressType: getValues("addressType") ?? "",
        country: "",
        state: "",
        district: "",
        city: "",
        houseName: "",
        streetName: "",
        place: "",
        localBodyType: "",
        localBodyTypeName: "",
        wardName: "",
        postOffice: "",
        pinCode: ""
      });
    }
  };

  const onSubmit = (requestFormData) => {
    if (saveUserContactDetailLoading || updateUserContactDetailLoading) return;
    requestFormData["userID"] = userId;
    requestFormData["communicationDetails"] = communicationDetails;

    switch (formType) {
      case "create":
        dispatch(saveUserContactDetails(requestFormData));
        break;
      case "edit":
        requestFormData["userContactDetailID"] =
          formData["userContactDetailID"].toString();
        dispatch(updateUserContactDetails(requestFormData));
        break;
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
            name="addressType"
            label="Address Type"
            shrink
            required
            options={getAddressTypesRes?.data || []}
            optionKey="LookupDetailID"
            handleChange={(value) => handleChange(value, "addressType")}
          />

          <div className="col-span-2">
            <FormController
              control={control}
              errors={errors}
              type="check"
              name="sameAsBasicDetail"
              label="Same as Basic Details Address"
              isDisabled={
                _.isEmpty(additionalFormData) || _.isNil(additionalFormData)
              }
              handleChange={(value) => toggleSameAsBasicAddress(value)}
            />
          </div>

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
            handleChange={handleTextChange}
            shrink
          />

          <FormController
            control={control}
            errors={errors}
            type="text"
            name="houseName"
            label="House Name"
            placeholder="Enter House Name"
            handleChange={handleTextChange}
            shrink
          />

          <FormController
            control={control}
            errors={errors}
            type="text"
            name="streetName"
            label="Street Name"
            placeholder="Enter Street Name"
            handleChange={handleTextChange}
            shrink
          />

          <FormController
            control={control}
            errors={errors}
            type="text"
            name="place"
            label="Place"
            placeholder="Enter Local Name"
            handleChange={handleTextChange}
            shrink
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
            shrink
            required
            options={getWardsRes?.data || []}
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
            placeholder="Enter Pin Code"
            handleChange={handleTextChange}
            shrink
            required
          />
        </div>
        <button type="submit" ref={innerRef} style={{ display: "none" }}>
          Submit Trigger
        </button>
      </form>
      <ContactCommunication
        communicationDetails={communicationDetails}
        setCommunicationDetails={setCommunicationDetails}
        communicationTypes={getCommunicationTypesRes?.data || []}
      />
    </Fragment>
  );
};
