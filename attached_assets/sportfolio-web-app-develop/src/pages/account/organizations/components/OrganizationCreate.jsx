import { useForm } from "react-hook-form";
import { Button, FormController } from "common";
import { yupResolver } from "@hookform/resolvers/yup";
import { saveOrgSchema } from "../validate";
import { useDispatch, useSelector } from "react-redux";
import countryJSON from "common/json/country.json";
import stateIndia from "common/json/state_india.json";
import districtKerala from "common/json/district_kerala.json";
import { saveOrg } from "../api";
import { useEffect } from "react";
import { API_STATUS } from "pages/common/constants";
import { setAlertDialog } from "pages/common/slice";
import { PATH_ORGANIZATION } from "common/constants";
import { reRoute } from "utils/reRoutes";
import useSuccessAlert from "hooks/useSuccessAlert";
import useErrorAlert from "hooks/useErrorAlert";

const OrganizationCreate = () => {
  const dispatch = useDispatch(),
    showSuccessAlert = useSuccessAlert(),
    showErrorAlert = useErrorAlert();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm({
    mode: "all",
    defaultValues: {
      orgName: null,
      orgCountry: null,
      orgState: null,
      orgDistrict: null,
      orgMainPlace: null,
      orgLocalPlace: null,
      orgInCharge: null,
      orgInChargeDesignation: null,
      orgInChargePhone: null,
      orgInChargeEmail: null,
      orgPhone: null,
      orgWebsite: null,
      orgRegistrationNumber: null,
      orgEmail: null,
      orgRegistrationDate: null,
      hasLocations: null,
      pincode: null,
      about: null
    },
    resolver: yupResolver(saveOrgSchema)
  });

  const { createOrgRes, createOrgLoading, createOrgStatus } = useSelector(
    (state) => state.org
  );

  useEffect(() => {
    if (createOrgRes && createOrgStatus === API_STATUS.SUCCESS) {
      showSuccessAlert("", "Organization successfully created", () => {
        setAlertDialog({ open: false });
        reRoute(PATH_ORGANIZATION);
      });
    } else if (createOrgRes && createOrgStatus === API_STATUS.FAILED) {
      showErrorAlert("", "Failed to Create Organization");
    }
  }, [createOrgRes]);

  const handleChange = (field, data) => {
    if (data) {
      switch (field) {
        case "orgCountry":
          setValue("orgCountry", data?.id);
          break;
        case "orgState":
          setValue("orgState", data?.id);
          break;
        case "orgDistrict":
          setValue("orgDistrict", data?.id);
          break;
        default:
          break;
      }
    }
  };

  const onSubmit = (data) => {
    dispatch(saveOrg({ data }));
  };

  const handleCancel = () => {
    reRoute(PATH_ORGANIZATION);
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <>
      <form id="user_basic_details_form" onSubmit={handleSubmit(onSubmit)}>
        <div
          className="overflow-y-auto "
          style={{ height: "calc(100vh - 178px)" }}
        >
          <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5 p-[40px]">
            <FormController
              control={control}
              errors={errors}
              type="text"
              name="orgName"
              label="Organization Name"
              placeholder="Enter your name"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="select"
              name="orgCountry"
              label="Country"
              optionKey="id"
              shrink
              options={countryJSON || []}
              handleChange={(data) => handleChange("orgCountry", data)}
            />

            <FormController
              control={control}
              errors={errors}
              type="select"
              name="orgState"
              label="State"
              optionKey="id"
              shrink
              options={stateIndia || []}
              handleChange={(data) => handleChange("orgState", data)}
            />

            <FormController
              control={control}
              errors={errors}
              type="select"
              name="orgDistrict"
              label="District"
              optionKey="id"
              shrink
              options={districtKerala || []}
              handleChange={(data) => handleChange("orgDistrict", data)}
            />

            <FormController
              control={control}
              errors={errors}
              type="text"
              name="orgMainPlace"
              label="Main Place"
              placeholder="Enter Main Name"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="text"
              name="localPlace"
              label="Local Place"
              placeholder="Enter Local Name"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="text"
              name="orgInCharge"
              label="Incharge Name"
              placeholder="Enter InCharge Name"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="text"
              name="orgInChargeDesignation"
              label="InCharge Designation"
              placeholder="Enter InCharge Designation"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="text"
              name="orgInChargePhone"
              label="InCharge Phone Number"
              placeholder="Enter InCharge Phone"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="text"
              name="orgInChargeEmail"
              label="InCharge Email"
              placeholder="Enter InCharge Email"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="text"
              name="orgPhone"
              label="Organization Phone Number"
              placeholder="Enter Organization Phone"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="text"
              name="orgEmail"
              label="Organization Email"
              placeholder="Enter Organization Email"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="text"
              name="orgWebsite"
              label="Organization Website"
              placeholder="Enter Organization Website"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="text"
              name="orgRegistrationNumber"
              label="Organization Registration Number"
              placeholder="Enter Organization Registration Number"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="date"
              name="orgRegistrationDate"
              label="Organization Registration Date"
              placeholder="Enter Organization Registration Date"
              shrink
            />

            <FormController
              control={control}
              errors={errors}
              type="text"
              name="about"
              label="About Organization"
              placeholder="Enter About Organization"
              shrink
            />
          </div>
        </div>
        <div className="flex gap-3 justify-end bg-slate-100 py-5 px-[20px]">
          <Button
            type="submit"
            size="lg"
            variant="ghost"
            colorScheme="primary"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            size="lg"
            variant="solid"
            colorScheme="primary"
            isLoading={createOrgLoading}
          >
            Create Organization
          </Button>
        </div>
      </form>
    </>
  );
};

export default OrganizationCreate;
