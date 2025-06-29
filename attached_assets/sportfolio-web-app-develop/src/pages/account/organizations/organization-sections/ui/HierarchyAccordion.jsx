import { Delete } from "assets/InputIcons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Progress
} from "common";
import { API_URL } from "common/url";
import { useState, useMemo } from "react";
import { colors } from "utils/colors";
import { http } from "utils/http";
import ActivityCheckBox from "./ActivityCheckBox";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {
  handleSelectedActivitiesArray,
  handleSelectedActivityIDsArray
} from "../../slice";

export default function HierarchyAccordion({ activity, topMostLevel = false }) {
  const dispatch = useDispatch(),
    {
      selectedActivitiesArray = [],
      searchOrganizationActivityRes,
      selectedActivityIDsArray = []
    } = useSelector((state) => state.org);

  const [loading, setLoading] = useState(false),
    [activityList, setActivityList] = useState([]);

  const fetchChildActivities = async (data) => {
    setLoading(true);
    const response = await http.post(API_URL.ORGANIZATIONS.FETCH_ACTIVITYLIST, {
      parentID: data
    });
    setLoading(false);
    return response?.data;
  };

  const isRemovable = useMemo(() => {
    const list = activityList.map((item) => item.activityID);
    let removable = true;

    selectedActivityIDsArray.map((itm) => {
      if (list.includes(itm)) {
        removable = false;
        return;
      }
    });

    return removable;
  }, [activityList, selectedActivityIDsArray]);

  const onOpen = (index) => {
    if (index === -1 || activityList.length > 0) return;

    fetchChildActivities(activity.activityID).then((response) => {
      if (response.success) setActivityList(response.data.activityDetails);
    });
  };

  const onRemove = () => {
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
    <Accordion allowToggle onChange={onOpen}>
      <AccordionItem bg="#D1FAE5" border="none" borderRadius="5px">
        <AccordionButton>
          <Box as="span" flex="1" textAlign="left">
            {activity?.name}
          </Box>

          {topMostLevel && isRemovable && (
            <article onClick={onRemove} title="Remove" className="me-4">
              <Delete width="22px" height="22px" color={colors.errorColor} />
            </article>
          )}

          <AccordionIcon />
        </AccordionButton>
        <AccordionPanel
          pb={4}
          bg={colors.white}
          borderRadius="5px"
          border={`1px solid ${colors.light}`}
        >
          {loading ? (
            <article className="flex flex-col mx-[25%] my-6">
              <Progress size="xs" isIndeterminate />
              <span className="text-center">Loading...</span>
            </article>
          ) : (
            <div>
              {activityList.map((item, index) =>
                item.hasChild === 0 ? (
                  <ActivityCheckBox
                    key={item?.activityID}
                    activity={item}
                    last={index === activityList.length - 1}
                  />
                ) : (
                  <HierarchyAccordion key={item?.activityID} activity={item} />
                )
              )}
            </div>
          )}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
}
