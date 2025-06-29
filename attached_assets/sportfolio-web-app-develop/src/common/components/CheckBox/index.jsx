import { Button } from "common";
import PropTypes from "prop-types";
import { CheckedBox, UnCheckedBox } from "assets/InputIcons";
import "./style.css";
import { forwardRef } from "react";

const CheckBox = forwardRef(function Checkbox(
  {
    isGroup = false,
    value = false,
    onChange = () => {},
    isDisabled = false,
    label = "Check Box"
  },
  ref
) {
  return (
    <>
      {!isGroup && (
        <div className="checkbox-container" ref={ref}>
          <Button
            isDisabled={isDisabled}
            variant={"ghost"}
            onClick={() => onChange(!value)}
            leftIcon={value ? <CheckedBox /> : <UnCheckedBox />}
            style={{ display: "inline-block" }}
          >
            {label}
          </Button>
        </div>
      )}
    </>
  );
});

CheckBox.propTypes = {
  isGroup: PropTypes.bool,
  value: PropTypes.bool,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
  label: PropTypes.string
};

CheckBox.defaultProps = {
  isReadOnly: false
};

export default CheckBox;
