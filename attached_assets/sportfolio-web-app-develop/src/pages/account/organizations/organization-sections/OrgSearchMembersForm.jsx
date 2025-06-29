import { SearchIcon } from "assets/DashboardIcons";
import { FormController, IconButton } from "common";
import {
  getCountries,
  getDistricts,
  getLocalBodyNames,
  getLocalBodyTypes,
  getPostOffices,
  getStates,
  getWards
} from "pages/common/api";
import { Fragment } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { colors } from "utils/colors";

export default function OrgSearchMembersForm({
  searchMode,
  searchMembers,
  loading = false
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
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
      country: "",
      state: "",
      district: "",
      localBodyType: "",
      localBodyName: "",
      wardName: "",
      postOffice: "",
      pinCode: ""
    }
  });

  const dispatch = useDispatch(),
    {
      getCountriesRes,
      getStatesRes,
      getDistrictsRes,
      getLocalBodyNamesRes,
      getWardsRes,
      getPostOfficesRes,
      getLocalBodyTypesRes
    } = useSelector((state) => state.common);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getLocalBodyTypes());
  }, []);

  const handleChange = (data, field) => {
    switch (field) {
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
    searchMembers(submitData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`grid ${
        searchMode === "advanced"
          ? "xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1"
          : "grid-cols-[repeat(3,1fr)]"
      } gap-x-2 gap-y-6 mt-2`}
      style={{ scrollbarGutter: "stable" }}
      autoComplete="one-time-code"
    >
      <FormController
        control={control}
        errors={errors}
        type="text"
        name="firstName"
        label="First Name"
        placeholder="Enter First name"
        shrink
      />

      <FormController
        control={control}
        errors={errors}
        type="text"
        name="lastName"
        label="Last Name"
        placeholder="Enter Last name"
        shrink
      />

      <FormController
        control={control}
        errors={errors}
        type="select"
        name="country"
        label="Country"
        shrink
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
        options={getDistrictsRes?.data || []}
        handleChange={(value) => handleChange(value, "district")}
        disabled={!getValues("state") && !getValues("district")}
        onClick={() =>
          handleClick("district", !getValues("state") && !getValues("district"))
        }
      />

      {searchMode === "advanced" && (
        <Fragment>
          <FormController
            control={control}
            errors={errors}
            type="select"
            name="localBodyType"
            label="Local Body Type"
            optionKey="RegionTypeID"
            shrink
            options={getLocalBodyTypesRes?.data || []}
            handleChange={(value) => handleChange(value, "localBodyType")}
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="localBodyName"
            label="Local Body"
            shrink
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
            type="select"
            name="wardName"
            label="Ward Name"
            options={getWardsRes?.data || []}
            shrink
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
          />
        </Fragment>
      )}

      <div className="flex items-center">
        <IconButton
          type="submit"
          bg={colors.errorColor}
          isLoading={loading}
          paddingInline="1rem"
          icon={<SearchIcon color={colors.white} />}
        />
      </div>
    </form>
  );
}
