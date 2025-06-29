import { CheckedBox, UnCheckedBox } from "assets/InputIcons";
import { Button, Typography } from "common";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { colors } from "utils/colors";
import { setNotifyAll, setNotifyOrganizationIds } from "../../slice";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function InviteOptionCheckbox({
  last = false,
  name = "",
  isNotifyAllButton = false,
  id = null,
  items = []
}) {
  const [checked, setChecked] = useState(false),
    dispatch = useDispatch(),
    { notifyAll, notifyOrganizationIds } = useSelector((state) => state.notify);

  useEffect(() => {
    if (isNotifyAllButton) {
      setChecked(notifyAll);
    } else {
      setChecked(notifyOrganizationIds?.includes(id));
    }
  }, [notifyOrganizationIds, notifyAll, isNotifyAllButton]);

  const handleToggle = (value) => {
    if (isNotifyAllButton) {
      dispatch(setNotifyAll(value));
      if (value) {
        dispatch(
          setNotifyOrganizationIds(
            Array.from(new Set(items.map((item) => item.id)))
          )
        );
      } else {
        dispatch(setNotifyOrganizationIds([]));
      }

      return;
    }

    if (value) {
      dispatch(setNotifyOrganizationIds([...notifyOrganizationIds, id]));
    } else {
      dispatch(
        setNotifyOrganizationIds(
          [...notifyOrganizationIds].filter((i) => i !== id)
        )
      );
    }
  };
  return (
    <Button
      variant="ghost"
      onClick={() => handleToggle(!checked)}
      rightIcon={checked ? <CheckedBox /> : <UnCheckedBox />}
      className="w-full !justify-between bg-white min-h-max"
      mb={last ? "0rem" : "0.325rem"}
      borderBottom={last ? "none" : `1px solid ${colors.light}`}
    >
      <section className="w-full flex justify-between items-center">
        <Typography text={name} type="p" size="xs" color={colors.black} />
      </section>
    </Button>
  );
}
