import { CheckedBox, Delete, UnCheckedBox } from "assets/InputIcons";
import { Button, Typography } from "common";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { colors } from "utils/colors";
import { useEffect } from "react";
import {
  handleNewlySelectedActivities,
  handleSelectedActivitiesArray,
  handleSelectedActivityIDsArray
} from "../../slice";
import { useMemo } from "react";

export default function ActivityCheckBox({
  activity,
  last,
  isDeleteable = false
}) {
  const dispatch = useDispatch(),
    {
      selectedActivitiesArray = [],
      searchOrganizationActivityRes,
      selectedActivityIDsArray = [],
      newlySelectedActivities = []
    } = useSelector((state) => state.org);

  useEffect(() => {
    setValue(selectedActivityIDsArray.includes(activity.activityID));
  }, [selectedActivityIDsArray]);

  const [value, setValue] = useState(false);

  const handleToggle = (value) => {
    if (value) {
      dispatch(
        handleNewlySelectedActivities([
          ...newlySelectedActivities,
          activity.activityID
        ])
      );
      dispatch(
        handleSelectedActivityIDsArray([
          ...selectedActivityIDsArray,
          activity.activityID
        ])
      );
    } else {
      dispatch(
        handleNewlySelectedActivities(
          [...newlySelectedActivities].filter(
            (id) => id !== activity.activityID
          )
        )
      );
      dispatch(
        handleSelectedActivityIDsArray(
          [...selectedActivityIDsArray].filter(
            (id) => id !== activity.activityID
          )
        )
      );
    }
  };

  const isRemovable = useMemo(() => {
    return !selectedActivityIDsArray.includes(activity.activityID);
  }, [selectedActivityIDsArray, activity]);

  const onRemove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    searchOrganizationActivityRes?.data?.organizationDetails.map((itm) => {
      const parentActivities = itm.parentActivities.map((x) => x.ActivityId);
      if (parentActivities.includes(activity.activityID)) {
        dispatch(
          handleSelectedActivityIDsArray(
            [...selectedActivityIDsArray].filter(
              (item) => item !== itm.activityID
            )
          )
        );
      }
    });
    dispatch(
      handleSelectedActivitiesArray(
        [...selectedActivitiesArray].filter(
          (item) => item.activityID !== activity.activityID
        )
      )
    );
  };

  return (
    <Button
      variant="ghost"
      onClick={() => handleToggle(!value)}
      rightIcon={value ? <CheckedBox /> : <UnCheckedBox />}
      className="w-full !justify-between"
      borderBottom={last ? "none" : `1px solid ${colors.light}`}
    >
      <section className="w-full flex justify-between items-center">
        <Typography
          text={activity.name}
          type="p"
          size="xs"
          color={colors.black}
        />

        {isDeleteable && isRemovable && (
          <article onClick={(e) => onRemove(e)} title="Remove" className="me-4">
            <Delete width="22px" height="22px" color={colors.errorColor} />
          </article>
        )}
      </section>
    </Button>
  );
}
