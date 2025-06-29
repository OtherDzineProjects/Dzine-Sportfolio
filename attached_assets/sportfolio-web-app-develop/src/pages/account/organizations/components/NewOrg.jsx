import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast
} from "common";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { colors } from "utils/colors";
import FormController from "common/components/FormController";
import { Email, Phone, User } from "assets/InputIcons";
import { emailCheck } from "pages/common/helpers";
import { setNewOrgDialog } from "../slice";
import { saveOrgSchema } from "../validate";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import { saveOrg, searchOrg, updateOrg } from "../api";
import {
  getCountries,
  getDistricts,
  getInstitutionTypes,
  getLocalBodyTypes,
  getStates
} from "pages/common/api";
import _ from "lodash";
import { useSearchParams } from "react-router-dom";

const NewOrganization = (props) => {
  const { orgId = null, setorgId = () => {} } = props,
    [searchParams] = useSearchParams();

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    clearErrors,
    getValues,
    setError,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: {
      organizationName: "",
      organizationEmail: "",
      phoneNumber: "",
      organizationTypeID: "",
      website: "",
      country: "",
      state: "",
      district: ""
    },
    resolver: yupResolver(saveOrgSchema)
  });

  const dispatch = useDispatch();
  const toast = useToast();

  const {
      newOrgDialog,
      saveOrgLoading,
      getOrgByIDRes,
      getOrgByIDLoading,
      updateOrgLoading
    } = useSelector((state) => state.org),
    { getCountriesRes, getStatesRes, getDistrictsRes, getInstitutionTypesRes } =
      useSelector((state) => state.common);

  useEffect(() => {
    if (orgId) {
      if (getOrgByIDRes?.data?.length > 0) {
        const dataRes = getOrgByIDRes?.data[0];
        reset({
          organizationName: dataRes?.organizationName || "",
          organizationEmail: dataRes?.organizationEmail || "",
          phoneNumber: dataRes?.phoneNumber || "",
          organizationTypeID: !_.isNil(dataRes?.organizationTypeID)
            ? dataRes.organizationTypeID
            : "",
          website: !_.isNil(dataRes?.countryID) ? +dataRes.countryID : "",
          country: !_.isNil(dataRes?.countryID) ? +dataRes.countryID : "",
          state: !_.isNil(dataRes?.stateID) ? +dataRes.stateID : "",
          district: !_.isNil(dataRes?.districtID) ? +dataRes.districtID : ""
        });
      }
    }
  }, [getOrgByIDRes]);

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getLocalBodyTypes());
    dispatch(getInstitutionTypes());
  }, []);

  useEffect(() => {
    reset({
      organizationName: "",
      organizationEmail: "",
      phoneNumber: "",
      organizationTypeID: "",
      website: "",
      country: "",
      state: "",
      district: ""
    });
  }, [newOrgDialog]);

  const handleOrg = async (data) => {
    try {
      const isUpdate = Boolean(orgId);
      const sendData = {
        organizationName: data.organizationName,
        organizationEmail: data.organizationEmail,
        phoneNumber: data.phoneNumber,
        organizationTypeID: data.organizationTypeID,
        website: data.website,
        country: data.country,
        state: data.state,
        district: data.district
      };

      const response = isUpdate
        ? await dispatch(updateOrg({ id: orgId, data: sendData }))
        : await dispatch(saveOrg(sendData));

      const successMessage = isUpdate
        ? "Organization is successfully Updated"
        : "Organization is successfully Created";

      const errorMessage = isUpdate
        ? "Error While trying to update Organization."
        : "Error While trying to add Organization.";

      if (response?.payload?.success) {
        toast({
          title: "Success",
          description: successMessage,
          status: "success",
          duration: 5000,
          isClosable: true
        });
        reset({
          organizationName: null,
          organizationEmail: null,
          phoneNumber: null,
          organizationTypeID: null,
          website: null,
          country: null,
          state: null,
          district: null
        });

        dispatch(
          searchOrg({
            data: { type: searchParams.get("tab") === "member" ? "M" : "O" },
            query: `?page=${searchParams.get("page") || 1}&pageSize=${
              searchParams.get("pageSize") || 12
            }`
          })
        );

        dispatch(setNewOrgDialog(false));
      } else {
        toast({
          title: errorMessage,
          description: response?.error?.message,
          status: "error",
          duration: 5000,
          isClosable: true
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

  const handleChange = (field, data) => {
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
        setValue("district", data?.id ?? "", { shouldValidate: true });
        break;
      case "organizationTypeID":
        setValue("organizationTypeID", data?.LookupDetailID ?? "", {
          shouldValidate: true
        });
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
        message = "Please select a state";
        break;
    }
    if (invalid) setError(field, { type: "custom", message: message });
  };

  const handleCancel = () => {
    setorgId(null);
    dispatch(setNewOrgDialog(false));
  };

  return (
    <Modal
      isOpen={newOrgDialog}
      onClose={handleCancel}
      size="xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {orgId ? "Update Organization" : "New Organization"}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {getOrgByIDLoading && orgId ? (
            <FullscreenLoader
              text="Fetching organization details..."
              height="300px"
            />
          ) : (
            <form
              onSubmit={handleSubmit(handleOrg)}
              id="new-org-save"
              className="py-3"
            >
              <div className="grid grid-flow-row gap-5">
                <FormController
                  control={control}
                  errors={errors}
                  type="text"
                  name="organizationName"
                  label="Organization Name"
                  placeholder="Enter organization name"
                  required
                  left={<User color={colors.dark} className="pt-3" />}
                />

                <FormController
                  control={control}
                  errors={errors}
                  type="text"
                  name="organizationEmail"
                  label="Organization Email"
                  placeholder="Enter organization email"
                  required
                  left={<Email color={colors.dark} className="pt-3" />}
                  right={emailCheck(watch("organizationEmail"))}
                  isDisabled={orgId}
                />

                <FormController
                  control={control}
                  errors={errors}
                  type="text"
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter phone number"
                  required
                  left={<Phone color={colors.dark} className="pt-3" />}
                />

                <FormController
                  control={control}
                  errors={errors}
                  type="text"
                  name="website"
                  label="Organization website"
                  placeholder="https://www.example.com"
                  left={<User color={colors.dark} className="pt-3" />}
                />

                <FormController
                  control={control}
                  errors={errors}
                  type="select"
                  name="organizationTypeID"
                  label="Organization Type"
                  optionKey="LookupDetailID"
                  required
                  options={getInstitutionTypesRes?.data || []}
                  handleChange={(data) =>
                    handleChange("organizationTypeID", data)
                  }
                />

                <FormController
                  control={control}
                  errors={errors}
                  type="select"
                  name="country"
                  label="Country"
                  required
                  options={getCountriesRes?.data || []}
                  handleChange={(data) => handleChange("country", data)}
                />

                <FormController
                  control={control}
                  errors={errors}
                  type="select"
                  name="state"
                  label="State"
                  required
                  options={getStatesRes?.data || []}
                  handleChange={(data) => handleChange("state", data)}
                  disabled={!getValues("country") && !getValues("state")}
                  onClick={() =>
                    handleClick(
                      "state",
                      !getValues("country") && !getValues("state")
                    )
                  }
                />

                <FormController
                  control={control}
                  errors={errors}
                  type="select"
                  name="district"
                  label="District"
                  required
                  options={getDistrictsRes?.data || []}
                  handleChange={(data) => handleChange("district", data)}
                  disabled={!getValues("state") && !getValues("district")}
                  onClick={() =>
                    handleClick(
                      "district",
                      !getValues("state") && !getValues("district")
                    )
                  }
                />
              </div>
            </form>
          )}
        </ModalBody>

        <ModalFooter className="right">
          <Button
            variant="outline"
            colorScheme="primary"
            mr={3}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="solid"
            colorScheme="primary"
            type="submit"
            form="new-org-save"
            isLoading={saveOrgLoading || updateOrgLoading}
          >
            {orgId ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewOrganization;
