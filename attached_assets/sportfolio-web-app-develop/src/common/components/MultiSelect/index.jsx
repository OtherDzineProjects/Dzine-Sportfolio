import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { DownArrow, CheckedBox, UnCheckedBox } from "assets/InputIcons";
import TextInput from "../Text";
import TagsInput from "../TagInput";
import "./style.css";
import { forwardRef } from "react";

const MultiSelect = forwardRef(function MultiSelect(props, ref) {
  const {
    label = "",
    required = false,
    isDisabled = false,
    disabled = false,
    name,
    options = [],
    optionKey = "id",
    onChange = () => {},
    value = [],
    ...rest
  } = props;

  const [filter, setFilter] = useState(""),
    [showDrop, setShowDrop] = useState(false);

  const handleMouseUp = (e) => {
    const container = document.getElementById(`drop-multi-${name}`);
    if (!container?.contains(e.target)) setShowDrop(false);
  };

  document.addEventListener("mouseup", handleMouseUp);

  useEffect(() => {
    return () => {
      setFilter("");
      setShowDrop(false);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleSelect = (data) => {
    if (data[optionKey]) {
      const copyArray = JSON.parse(JSON.stringify(value)) || [];
      if (Array.isArray(value)) {
        const find = value?.findIndex((item) => item === data[optionKey]);
        if (find === -1) {
          copyArray.push(data[optionKey]);
        } else {
          copyArray.splice(find, 1);
        }
      } else {
        copyArray.push(data[optionKey]);
      }
      onChange(copyArray);
    }
  };

  function selectAll() {
    return value?.length > 0 && value.length === options?.length ? (
      <CheckedBox />
    ) : (
      <UnCheckedBox />
    );
  }

  function checkBoxCheck(data) {
    if (Array.isArray(value)) {
      return value.includes(data) ? <CheckedBox /> : <UnCheckedBox />;
    } else {
      return <UnCheckedBox />;
    }
  }

  const handleSelectAll = () => {
    if (value.length === options?.length) {
      onChange([]);
    } else {
      onChange(options.map((item) => item[optionKey]));
    }
  };

  return (
    <div className="dropdown-container" id={`drop-multi-${name}`} ref={ref}>
      <div onClick={isDisabled || disabled ? null : () => setShowDrop(true)}>
        {value?.length > 0 ? (
          <TagsInput
            {...rest}
            label={label}
            name={name}
            required={required}
            optionKey={optionKey}
            options={options}
            right={
              <div
                className={`dropdown-arrow dropdown-arrow-${
                  showDrop ? "up" : "down"
                }`}
              >
                <DownArrow />
              </div>
            }
            value={value}
          />
        ) : (
          <TextInput
            label={label}
            name={name}
            isDisabled={isDisabled}
            placeHolder={`${value?.length} items selected`}
            value={filter}
            onChange={(data) => {
              setFilter(data);
              setShowDrop(true);
            }}
            required={required}
            right={
              <div
                className={`dropdown-arrow dropdown-arrow-${
                  showDrop ? "up" : "down"
                }`}
              >
                <DownArrow />
              </div>
            }
            {...rest}
          />
        )}
      </div>
      {showDrop && (
        <ul className="multi-drop-ul">
          {options?.filter((item) =>
            item?.name?.toLowerCase().includes(filter?.toLowerCase())
          )?.length === 0 ? (
            <li className="inactive">No Options Available</li>
          ) : (
            <li
              role="button"
              aria-hidden="true"
              onClick={() => handleSelectAll()}
            >
              <div className="options-cover">
                <div className="options-icon check-icon">{selectAll()}</div>
                <div className="options-data">Select All</div>
              </div>
            </li>
          )}

          {options
            ?.filter((item) =>
              item?.name?.toLowerCase().includes(filter?.toLowerCase())
            )
            ?.map((item) => (
              <li
                key={item?.[optionKey]}
                role="button"
                aria-hidden="true"
                onClick={() => handleSelect(item)}
              >
                <div className="options-cover">
                  <div className="options-icon check-icon">
                    {checkBoxCheck(item[optionKey])}
                  </div>
                  <div className="options-data">{item?.name}</div>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
});
MultiSelect.propTypes = {
  label: PropTypes.string,
  required: PropTypes.bool,
  isDisabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  optionKey: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default MultiSelect;
