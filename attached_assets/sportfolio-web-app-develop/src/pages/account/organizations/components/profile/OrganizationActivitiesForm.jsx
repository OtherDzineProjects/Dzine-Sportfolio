import { yupResolver } from "@hookform/resolvers/yup";
import { Button, FormController, Typography } from "common";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import { activityValidate } from "../validate";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  fetchActivityChildList,
  fetchActivityList,
  saveOrganizationActivity
} from "../../api";
import { useSelector } from "react-redux";
import { useState } from "react";
import _ from "lodash";
import HierarchyAccordion from "../../organization-sections/ui/HierarchyAccordion";
import { colors } from "utils/colors";
import {
  handleNewlySelectedActivities,
  handleSelectedActivitiesArray,
  handleSelectedActivityIDsArray
} from "../../slice";
import ActivityCheckBox from "../../organization-sections/ui/ActivityCheckBox";
import useErrorAlert from "hooks/useErrorAlert";

const AddActivityForm = ({
  formType,
  formData,
  selectedActivities,
  setSelectedActivities,
  selectedActivityType,
  setSelectedActivityType
}) => {
  const {
    control,
    getValues,
    handleSubmit,
    setValue,
    resetField,
    setError,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: {
      activity: [],
      activityType: ""
    },
    resolver: yupResolver(activityValidate)
  });

  const dispatch = useDispatch(),
    {
      fetchActivityListRes,
      fetchActivityChildListRes,
      selectedActivitiesArray = []
    } = useSelector((state) => state.org);

  useEffect(() => {
    setSelectedActivities(
      fetchActivityListRes?.data?.activityDetails.find(
        (item) => item?.activityID === getValues("activityType")
      )
    );
  }, [watch("activityType")]);

  useEffect(() => {
    switch (formType) {
      case "create":
        reset({
          activity: [],
          activityType: ""
        });
        break;
      case "edit":
        reset({
          activity: [formData.activityID],
          activityType: formData.parentID
        });
        setSelectedActivities([formData.activityID]);
        setSelectedActivityType(
          fetchActivityListRes?.data?.activityDetails?.find(
            (item) => item.activityID === formData.parentID
          ) || null
        );
        dispatch(fetchActivityChildList(formData.parentID));
        dispatch(
          handleSelectedActivitiesArray(
            _.unionBy(
              fetchActivityChildListRes?.data?.activityDetails.filter((item) =>
                [formData.activityID].includes(item.activityID)
              ),
              "activityID"
            )
          )
        );
        break;
    }
  }, [formType]);

  useEffect(() => {
    if (formType === "edit" && formData?.parentID) {
      setSelectedActivityType(
        fetchActivityListRes?.data?.activityDetails?.find(
          (item) => item.activityID === formData.parentID
        ) || null
      );
    }
  }, [fetchActivityListRes]);

  useEffect(() => {
    if (formType === "edit" && formData?.activityID) {
      setSelectedActivities([formData.activityID]);
      dispatch(
        handleSelectedActivitiesArray(
          _.unionBy(
            fetchActivityChildListRes?.data?.activityDetails.filter((item) =>
              [formData.activityID].includes(item.activityID)
            ),
            "activityID"
          )
        )
      );
    }
  }, [fetchActivityChildListRes]);

  const handleChange = (data, field) => {
    switch (field) {
      case "activityType":
        setSelectedActivityType(data);
        setValue("activityType", data?.activityID || "", {
          shouldValidate: true
        });
        dispatch(fetchActivityChildList(data?.activityID));
        resetField("activity", { defaultValue: [] });
        break;
      case "activity":
        setValue("activity", data, {
          shouldValidate: true
        });
        setSelectedActivities(data);
        break;
    }
  };

  const handleClick = (invalid) => {
    if (invalid)
      setError("activity", {
        type: "custom",
        message: "Please select activity type"
      });
  };

  const onSubmit = () => {
    const selectedArray =
      fetchActivityChildListRes?.data?.activityDetails.filter((item) =>
        selectedActivities.includes(item.activityID)
      );

    dispatch(
      handleSelectedActivitiesArray(
        _.unionBy([...selectedArray, ...selectedActivitiesArray], "activityID")
      )
    );
    reset({
      activity: [],
      activityType: ""
    });
    setSelectedActivities([]);
    setSelectedActivityType(null);
  };

  return (
    <form
      className="m-4"
      onSubmit={handleSubmit(onSubmit)}
      style={{ scrollbarGutter: "stable" }}
      autoComplete="one-time-code"
    >
      <div className="w-full grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5 items-center">
        <FormController
          control={control}
          errors={errors}
          type="select"
          name="activityType"
          label="Activity Type"
          optionKey="activityID"
          required
          shrink
          options={fetchActivityListRes?.data?.activityDetails || []}
          handleChange={(data) => handleChange(data, "activityType")}
        />

        <FormController
          control={control}
          errors={errors}
          type="multi-select"
          name="activity"
          label={selectedActivityType?.name || ""}
          optionKey="activityID"
          required
          shrink
          options={fetchActivityChildListRes?.data?.activityDetails || []}
          handleChange={(data) => handleChange(data, "activity")}
          disabled={
            !getValues("activity")?.length > 0 && !getValues("activityType")
          }
          onClick={() =>
            handleClick(
              !getValues("activity")?.length > 0 && !getValues("activityType")
            )
          }
        />

        <Button
          type="submit"
          size="md"
          variant="solid"
          colorScheme="primary"
          disabled={
            !(getValues("activityType") || getValues("activity")?.length > 0)
          }
          maxW="50%"
        >
          Add Activity
        </Button>
      </div>
    </form>
  );
};
export default function OrganizationActivitiesForm({
  innerRef,
  organizationID,
  formType,
  selectedIDs,
  isOpen,
  formData
}) {
  const dispatch = useDispatch(),
    {
      selectedActivitiesArray = [],
      selectedActivityIDsArray = [],
      newlySelectedActivities = []
    } = useSelector((state) => state.org);

  const showErrorAlert = useErrorAlert();

  const [selectedActivities, setSelectedActivities] = useState([]),
    [selectedActivityType, setSelectedActivityType] = useState(null);

  useEffect(() => {
    dispatch(fetchActivityList());

    return () => {
      dispatch(handleSelectedActivitiesArray([]));
      dispatch(handleSelectedActivityIDsArray([]));
      dispatch(handleNewlySelectedActivities([]));
      setSelectedActivities([]);
      setSelectedActivityType(null);
    };
  }, []);

  useEffect(() => {
    dispatch(handleSelectedActivityIDsArray(selectedIDs));
    switch (formType) {
      case "create":
        dispatch(handleSelectedActivitiesArray([]));
        dispatch(handleNewlySelectedActivities([]));
        setSelectedActivities([]);
        setSelectedActivityType(null);
        break;
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const submitData = {
      activityID: [...new Set(selectedActivityIDsArray)].join(),
      organizationID: organizationID
    };

    if (
      (formType === "edit" && selectedActivityIDsArray.length > 0) ||
      (formType === "create" &&
        selectedActivitiesArray.length > 0 &&
        newlySelectedActivities.length > 0)
    ) {
      dispatch(saveOrganizationActivity(submitData));
    } else {
      showErrorAlert("", "Please select at least one activity");
    }
  };

  return (
    <Fragment>
      <AddActivityForm
        formType={formType}
        formData={formData}
        selectedActivities={selectedActivities}
        setSelectedActivities={setSelectedActivities}
        selectedActivityType={selectedActivityType}
        setSelectedActivityType={setSelectedActivityType}
      />
      <form
        className="m-4"
        style={{ scrollbarGutter: "stable" }}
        autoComplete="one-time-code"
        onSubmit={(e) => handleSubmit(e)}
      >
        <section className="w-full p-4 flex flex-col gap-2 min-h-[20svh]">
          <Typography
            text="Selected Activities"
            type="p"
            size="sm"
            color={colors.black}
          />
          {selectedActivitiesArray?.length > 0 ? (
            selectedActivitiesArray.map((item, index) =>
              item.hasChild === 0 ? (
                <ActivityCheckBox
                  key={item?.activityID}
                  activity={item}
                  last={index === selectedActivitiesArray.length - 1}
                  isDeleteable
                />
              ) : (
                <HierarchyAccordion
                  key={item?.activityID}
                  activity={item}
                  topMostLevel
                />
              )
            )
          ) : (
            <Typography
              text="No Activities Selected"
              type="p"
              size="sm"
              color={colors.black}
              className="text-center m-auto"
            />
          )}
        </section>
        <button type="submit" ref={innerRef} style={{ display: "none" }}>
          Submit Trigger
        </button>
      </form>
    </Fragment>
  );
}
