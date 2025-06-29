import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import "./style.css";
import { useMemo } from "react";
import { VerifiedInputIcon } from "assets/InputIcons";
import { forwardRef } from "react";

const Text = forwardRef(function Text(props, ref) {
  const {
    right = null,
    left = null,
    type = "text",
    onChange = () => {},
    isDisabled = false,
    isReadOnly = false,
    value = "",
    label = "Text Input",
    required = false,
    error = "",
    name = "",
    id = "",
    shrink = false,
    placeholder = "",
    onClick = () => {},
    verified = false,
    minDate = null,
    maxDate = null
  } = props;

  const [focus, setFocus] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    setText(value ? value : "");
  }, [value]);

  const fieldClass = useMemo(() => {
    let className = "input-container";

    if (error) {
      className = "error input-container";
    } else if (focus) {
      className = "focus input-container";
    }

    return className;
  }, [focus, error]);

  return (
    <div style={{ width: "100%" }} ref={ref}>
      {!shrink && (
        <label className="no-shrink">
          {label}
          {required && <span className="star">*</span>}
          {verified && <VerifiedInputIcon />}
        </label>
      )}
      <fieldset className={fieldClass}>
        {label && shrink && (
          <legend>
            {label}
            {required && <span className="star">*</span>}
            {verified && <VerifiedInputIcon />}
          </legend>
        )}
        <div className="input-flex">
          {left && <div className="left">{left}</div>}
          <input
            type={type}
            placeholder={placeholder}
            onChange={(event) => {
              onChange(
                event.target.value
                  ? event?.target?.value?.trimStart()
                  : event.target.value
              );
              setText(
                event.target.value
                  ? event?.target?.value?.trimStart()
                  : event.target.value
              );
            }}
            disabled={isDisabled}
            readOnly={isReadOnly}
            value={text}
            onFocus={() => setFocus(!isDisabled)}
            onBlur={() => setFocus(false)}
            name={name}
            id={id || name}
            onClick={onClick}
            autoComplete="one-time-code"
            max={maxDate}
            min={minDate}
          />
          {right && <div className="right">{right}</div>}
        </div>
        {error && <div className="error">{error}</div>}
      </fieldset>
    </div>
  );
});

Text.propTypes = {
  onChange: PropTypes.func.isRequired,
  right: PropTypes.element,
  left: PropTypes.element,
  type: PropTypes.string,
  isDisabled: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  value: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  shrink: PropTypes.bool,
  placeholder: PropTypes.string
};

export default Text;
