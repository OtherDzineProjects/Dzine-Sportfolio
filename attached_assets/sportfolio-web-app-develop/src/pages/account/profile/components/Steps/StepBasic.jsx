import { useForm } from "react-hook-form";
import { Button, FormController, Typography } from "common";
import { yupResolver } from "@hookform/resolvers/yup";
import { userStepBasic } from "../validate";
import genderJSON from "common/json/gender.json";
import bloodGroupJSON from "common/json/bloodGroup.json";
import stateIndia from "common/json/state_india.json";
import districtKerala from "common/json/district_kerala.json";
import LocalBodyTypeJSON from "common/json/local_body_type.json";
import { useDispatch } from "react-redux";
import { getUserByID, saveUserBasicDetails } from "pages/account/users/api";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { PATH_USER_PROFILE } from "common/constants";

const StepBasic = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    mode: "all",
    defaultValues: {
      firstName: null,
      lastName: null,
      emailID: null,
      phoneNumber: null,
      gender: null,
      dateOfBirth: null,
      bloodGroup: null,
      state: null,
      district: null,
      city: null,
      locationID: 1,
      representingDistricts: null,
      houseName: null,
      streetName: null,
      place: null,
      localBodyType: null,
      localBodyName: null,
      wardName: null,
      postOffice: null,
      pinCode: null
    },
    resolver: yupResolver(userStepBasic)
  });

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const { getUserByIDRes, saveUserBasicDetailLoading } = useSelector(
    (state) => state.users
  );

  useEffect(() => {
    dispatch(getUserByID(params?.userId));
  }, [params?.userId]);

  useEffect(() => {
    if (getUserByIDRes?.data?.length > 0) {
      let data = getUserByIDRes?.data[0];
      reset({
        firstName: data?.firstName,
        lastName: data?.lastName,
        emailID: data?.email,
        phoneNumber: data?.phoneNumber
      });
    }
  }, [getUserByIDRes]);

  const handleChange = (data, field) => {
    if (data) {
      switch (field) {
        case "gender":
          setValue("gender", data?.name);
          break;
        default:
          break;
      }
    }
  };

  const onSubmit = (data) => {
    data.userID = params?.userId;
    data.dateOfBirth = data?.dateOfBirth?.replaceAll("-", "/");
    data.locationID = 1;
    dispatch(saveUserBasicDetails(data));
  };

  const handleCancel = () => {
    navigate(PATH_USER_PROFILE.replace(":id", params?.userId));
  };

  return (
    <div className="p-10">
      <div className="bg-slate-100 py-3 px-5 rounded-lg mb-5">
        <Typography text="Basic Information" />
      </div>
      <form id="user_basic_details_form" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5">
          <FormController
            control={control}
            errors={errors}
            type="text"
            name="firstName"
            label="First Name"
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
          />

          <FormController
            control={control}
            errors={errors}
            type="text"
            name="emailID"
            label="Email Address"
            placeholder="Enter your email"
            shrink
            isReadOnly
          />

          <FormController
            control={control}
            errors={errors}
            type="text"
            name="phoneNumber"
            label="Phone Number"
            placeholder="Enter your phone number"
            shrink
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="gender"
            label="Gender"
            placeholder="Enter your email"
            handleChange={(data) => handleChange(data, "gender")}
            shrink
            options={genderJSON || []}
          />

          <FormController
            control={control}
            errors={errors}
            type="date"
            name="dateOfBirth"
            label="Date of Birth"
            shrink
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="bloodGroup"
            label="Blood Group"
            shrink
            options={bloodGroupJSON || []}
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="state"
            label="State"
            shrink
            options={stateIndia || []}
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="district"
            label="District"
            shrink
            options={districtKerala || []}
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="city"
            label="city"
            shrink
            options={districtKerala || []}
          />

          {/* <FormController
            control={control}
            errors={errors}
            type='select'
            name='locationID'
            label="locationID"
            shrink
            options={districtKerala || []}
          /> */}

          <FormController
            control={control}
            errors={errors}
            type="multi-select"
            name="representingDistricts"
            label="Representing Districts"
            shrink
            options={districtKerala || []}
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
            label="Local Body Type"
            shrink
            options={LocalBodyTypeJSON || []}
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="localBodyName"
            label="Local Body Name"
            shrink
            options={
              [
                { id: 1, name: "options 1" },
                { id: 2, name: "options 3" }
              ] || []
            }
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="wardName"
            label="Ward Name"
            shrink
            options={
              [
                { id: 1, name: "options 1" },
                { id: 2, name: "options 3" }
              ] || []
            }
          />

          <FormController
            control={control}
            errors={errors}
            type="select"
            name="postOffice"
            label="Post Office"
            shrink
            options={
              [
                { id: 1, name: "options 1" },
                { id: 2, name: "options 3" }
              ] || []
            }
          />

          <FormController
            control={control}
            errors={errors}
            type="text"
            name="pincode"
            label="Pincode"
            placeholder="Enter your name"
            shrink
          />
        </div>
      </form>
      <div className="flex gap-3 justify-end bg-slate-100 py-5 px-[20px] mt-10">
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
          form="user_basic_details_form"
          isLoading={saveUserBasicDetailLoading}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default StepBasic;
