import { yupResolver } from "@hookform/resolvers/yup";
import {
  getCountries,
  getDistricts,
  getMemberOrganizationList,
  getNotificationTypes,
  getOrganizationList,
  getStates
} from "pages/common/api";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { notificationValidate } from "../validate";
import { useSelector } from "react-redux";
import { STORAGE_KEYS } from "common/constants";
import { FormController, Typography } from "common";
import { useMemo } from "react";
import { DragNDropFile } from "common/components/DragNDropFile";
import { useState } from "react";
import NotificationInviteList from "./NotificationInviteList";
import "./styles.css";
import { createNotification, updateNotification } from "../api";
import { formatInputDate } from "pages/common/helpers";
import _ from "lodash";
import {
  clearNotificationFormState,
  setNotifyAll,
  setNotifyOrganizationIds
} from "../slice";

export default function NewNotificationForm({
  isOpen = false,
  formType = "create",
  selectedItem = undefined,
  innerRef,
  loading = false
}) {
  const dispatch = useDispatch(),
    userDetails = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)),
    {
      getCountriesRes,
      getStatesRes,
      getDistrictsRes,
      getNotificationTypesRes,
      getMemberOrganizationListRes
    } = useSelector((state) => state.common),
    { notifyAll, notifyOrganizationIds } = useSelector((state) => state.notify);

  const [files, setFiles] = useState([]),
    [additionalFiles, setAdditionalFiles] = useState([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    getValues,
    setError,
    clearErrors
  } = useForm({
    mode: "all",
    defaultValues: {
      notificationType: "",
      subject: "",
      body: "",
      date: "",
      country: "",
      state: "",
      district: "",
      address: "",
      organizationId: ""
    },
    resolver: yupResolver(notificationValidate)
  });

  useEffect(() => {
    dispatch(getCountries());
    dispatch(getNotificationTypes());
    dispatch(getOrganizationList());
    dispatch(getMemberOrganizationList());

    return () => {
      setFiles([]);
      setAdditionalFiles([]);
    };
  }, []);

  useEffect(() => {
    switch (formType) {
      case "create": {
        reset({
          notificationType: "",
          subject: "",
          body: "",
          date: "",
          country: "",
          state: "",
          district: "",
          address: "",
          organizationId: ""
        });
        setFiles([]);
        setAdditionalFiles([]);
        dispatch(clearNotificationFormState());
        break;
      }
      case "edit": {
        reset({
          notificationType: !_.isNil(selectedItem?.notificationTypeID)
            ? +selectedItem?.notificationTypeID
            : "",
          subject: selectedItem?.subject || "",
          body: selectedItem?.body || "",
          date: selectedItem?.eventDate
            ? formatInputDate(selectedItem?.eventDate)
            : "",
          country: !_.isNil(selectedItem?.country)
            ? +selectedItem?.country
            : "",
          state: !_.isNil(selectedItem?.stateID) ? +selectedItem?.stateID : "",
          district: !_.isNil(selectedItem?.districtID)
            ? +selectedItem?.districtID
            : "",
          address: selectedItem?.address || "",
          organizationId: !_.isNil(selectedItem?.organizationID)
            ? +selectedItem?.organizationID
            : ""
        });

        if (!_.isNil(selectedItem?.country))
          dispatch(getStates(+selectedItem.country));
        if (!_.isNil(selectedItem?.stateID))
          dispatch(getDistricts(+selectedItem.stateID));

        if (
          Array.isArray(selectedItem?.invitedOrganizations) &&
          selectedItem.invitedOrganizations.length > 0
        ) {
          dispatch(
            setNotifyOrganizationIds(
              selectedItem.invitedOrganizations.map(
                (item) => item.organizationID
              )
            )
          );
        }

        dispatch(setNotifyAll(!!selectedItem?.notifyAll));
        setAdditionalFiles(
          selectedItem?.image?.length > 0 ? selectedItem?.image : []
        );

        break;
      }
    }
  }, [isOpen]);

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
        setValue("district", data?.id ?? "", { shouldValidate: true });
        break;
      case "organizationId":
        setValue("organizationId", data?.id ?? "", {
          shouldValidate: true
        });
        break;
      case "notificationType":
        setValue("notificationType", data?.LookupDetailID ?? "", {
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

  const onSubmit = (formSubmitData) => {
    if (loading) return;
    const formData = new FormData();
    formData.append("notificationCreated", userDetails?.id || "");
    formData.append("notificationType", formSubmitData?.notificationType);
    formData.append("subject", formSubmitData?.subject);
    formData.append("body", formSubmitData?.body);
    formData.append("date", formSubmitData?.date?.replaceAll("-", "/"));
    formData.append("country", formSubmitData?.country);
    formData.append("state", formSubmitData?.state);
    formData.append("district", formSubmitData?.district);
    formData.append("address", formSubmitData?.address);
    formData.append("organizationID", formSubmitData?.organizationId);
    formData.append("notifyAll", notifyAll ? "1" : "0");
    formData.append("notifyOrganizationIDs", notifyOrganizationIds.toString());
    files.map((file) => formData.append("uploads", file));

    switch (formType) {
      case "create":
        dispatch(createNotification(formData));
        break;
      case "edit": {
        const set = new Set(additionalFiles.map((obj) => JSON.stringify(obj)));

        const removedFiles = (
          selectedItem &&
          Array.isArray(selectedItem?.image) &&
          selectedItem?.image?.length > 0
            ? selectedItem.image
            : []
        ).filter((obj) => !set.has(JSON.stringify(obj)));

        const removedFilesIDs =
          removedFiles?.length > 0
            ? removedFiles?.map((item) => item?.documentID)
            : [];

        formData.append("removedFiles", JSON.stringify(removedFilesIDs));
        formData.append("notificationID", selectedItem?.id);
        dispatch(updateNotification(formData));
        break;
      }
    }
  };

  const minDate = useMemo(() => {
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
      <div className="flex flex-col gap-6">
        <FormController
          control={control}
          errors={errors}
          type="select"
          name="organizationId"
          label="Select your organization"
          shrink
          required
          options={getMemberOrganizationListRes?.data || []}
          handleChange={(data) => handleChange(data, "organizationId")}
        />
        <FormController
          control={control}
          errors={errors}
          type="select"
          name="notificationType"
          label="Select notification type"
          optionKey="LookupDetailID"
          shrink
          required
          options={getNotificationTypesRes?.data || []}
          handleChange={(data) => handleChange(data, "notificationType")}
        />
        <FormController
          control={control}
          errors={errors}
          type="date"
          name="date"
          label="Date"
          placeholder="Select Date"
          shrink
          required
          minDate={minDate}
        />
        <FormController
          control={control}
          errors={errors}
          type="text"
          name="subject"
          label="Subject"
          placeholder="Enter notification subject..."
          shrink
          required
        />

        <article>
          <DragNDropFile
            type="image"
            label="Featured Image"
            singleton
            files={files}
            setFiles={setFiles}
            additionalFiles={additionalFiles}
            setAdditionalFiles={setAdditionalFiles}
          />
        </article>

        <FormController
          control={control}
          errors={errors}
          type="rich"
          name="body"
          label="Message"
          toolBarPosition="bottom"
          shrink
          required
        />

        <section className="whom-to-invite-container !bg-white flex flex-col gap-6">
          <div className="m-0 ps-4">
            <Typography text="Venue details" />
          </div>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          </section>

          <FormController
            control={control}
            errors={errors}
            type="text"
            name="address"
            label="Address/Venue"
            placeholder="Enter address..."
            shrink
          />
        </section>

        <NotificationInviteList />
      </div>

      <button type="submit" ref={innerRef} style={{ display: "none" }}>
        Submit Trigger
      </button>
    </form>
  );
}
