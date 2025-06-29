import PropTypes from "prop-types";
import "./style.css";
import { colors } from "utils/colors";
import { Typography } from "common";
import { getRandomLightColor } from "utils/common";
import { useState } from "react";
import { useEffect } from "react";
import { forwardRef } from "react";

const TagsInput = forwardRef(function TagsInput(props, ref) {
  const {
    value = [],
    label = "Text Input",
    required = false,
    error = "",
    left = "",
    right = "",
    shrink = false,
    options = [],
    optionKey = "id"
  } = props;

  const fieldClass = () => {
    if (!error) {
      return "input-container";
    } else if (error) {
      return "error input-container";
    }
  };

  const [tags, setTags] = useState([]);

  useEffect(() => {
    if (value && Array.isArray(value) && value.length > 0) {
      setTags((prevObjectArray) =>
        value.map((str, index) => {
          if (prevObjectArray[index] && prevObjectArray[index].title === str) {
            return prevObjectArray[index];
          }

          const element = options.find((elem) => elem[optionKey] === str);

          return {
            title: element?.name ?? element,
            color: getRandomLightColor()
          };
        })
      );
    }

    return () => {
      setTags([]);
    };
  }, [value, options]);

  return (
    <div style={{ width: "100%" }} ref={ref}>
      {!shrink && (
        <label className="no-shrink">
          {label}
          {required && <span className="star">*</span>}
        </label>
      )}
      <fieldset className={fieldClass()}>
        {label && shrink && (
          <legend>
            {label}
            {required && <span className="star">*</span>}
          </legend>
        )}
        <div className="input-flex">
          {left && <div className="left">{left}</div>}
          <div className="tag-container flex items-center flex-wrap gap-2">
            {tags?.map((tag, index) => (
              <div
                className={"px-2 py-1 rounded-md w-fit flex items-center gap-2"}
                key={index}
                style={{ backgroundColor: tag.color }}
              >
                <Typography
                  text={tag.title}
                  type="p"
                  size="sm"
                  weight="400"
                  color={colors.dark}
                />
              </div>
            ))}
          </div>
          {right && <div className="right">{right}</div>}
        </div>
        {error && <div className="error">{error}</div>}
      </fieldset>
    </div>
  );
});

TagsInput.propTypes = {
  right: PropTypes.func,
  left: PropTypes.func,
  value: PropTypes.array,
  label: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  name: PropTypes.string,
  id: PropTypes.string,
  shrink: PropTypes.bool,
  placeholder: PropTypes.string
};

export default TagsInput;
