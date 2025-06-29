import { useState, useEffect } from "react";
import TextInput from "../Text";
import "./style.css";
import { CloseIcon, DownArrow, RadioBox } from "assets/InputIcons";
import { IconButton } from "@chakra-ui/react";
import { useRef } from "react";
import { forwardRef } from "react";

const Select = forwardRef(function Select(props, ref) {
  const {
    label = "select",
    required = false,
    isDisabled = false,
    name,
    options = [],
    optionKey = "id",
    onChange = () => {},
    value,
    error,
    disabled = false,
    ...rest
  } = props;

  const divRef = useRef(null);
  const [filter, setFilter] = useState("");
  const [showDrop, setShowDrop] = useState(false);
  const [selected, setSelected] = useState({});
  const [textValue, setTextValue] = useState("");

  const handleMouseUp = (e) => {
    const container = document.getElementById(`drop-single-${name}`);
    if (!container?.contains(e.target)) setShowDrop(false);
  };

  document.addEventListener("mouseup", handleMouseUp);

  useEffect(() => {
    return () => {
      setFilter("");
      setSelected(null);
      setTextValue("");
      setShowDrop(false);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  useEffect(() => {
    if (value) {
      let findIndex = options.findIndex((item) => item[optionKey] === value);
      if (findIndex > -1) {
        setSelected(options[findIndex]);
        setTextValue(options[findIndex]["name"]);
      }
    } else {
      setSelected(null);
      setTextValue("");
      setFilter("");
    }
  }, [value, options]);

  const handleSelect = (data) => {
    setTextValue(data?.name);
    setSelected(data);
    onChange(data);
    setShowDrop(false);
  };

  const handleChange = (data) => {
    if (data) {
      setFilter(data);
      setShowDrop(true);
    } else {
      setFilter("");
      setSelected(null);
      setTextValue("");
      onChange(null);
    }
  };

  const handleClear = () => {
    setFilter("");
    setSelected(null);
    setTextValue("");
    onChange(null);
  };

  const adjustPosition = () => {
    if (divRef.current) {
      const div = divRef.current;
      const rect = div.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      // Check if the div exceeds the screen height
      if (rect.bottom > windowHeight) {
        div.style.top = "auto";
        div.style.bottom = 0;
      }
    }
  };

  useEffect(() => {
    if (showDrop) {
      adjustPosition();
    }
  }, [showDrop]);

  return (
    <div className="dropdown-container" id={`drop-single-${name}`} ref={ref}>
      <div onClick={isDisabled || disabled ? null : () => setShowDrop(true)}>
        <TextInput
          label={label}
          name={name}
          isDisabled={isDisabled}
          placeHolder={`${selected?.length} items selected`}
          value={textValue}
          onChange={(data) => {
            handleChange(data);
          }}
          required={required}
          right={
            <div className="flex gap-1">
              {textValue && (
                <IconButton
                  size={"xs"}
                  variant={"unstyled"}
                  onClick={handleClear}
                  icon={
                    <CloseIcon
                      width="18px"
                      height="18px"
                      color={"rgb(148 163 184)"}
                    />
                  }
                />
              )}
              <div
                className={`dropdown-arrow dropdown-arrow-${
                  showDrop ? "up" : "down"
                }`}
              >
                <DownArrow />
              </div>
            </div>
          }
          placeholder="Select an option"
          error={error}
          {...rest}
        />
      </div>
      {showDrop && (
        <ul className="multi-drop-ul" ref={divRef}>
          {options?.filter((item) =>
            item?.name?.toLowerCase().includes(filter?.toLowerCase())
          )?.length === 0 && <li className="inactive">No Options Available</li>}
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
                <div className="options-cover single-select">
                  <div className="options-data">{item?.name}</div>
                  <div className="options-icon">
                    {item?.[optionKey] === selected?.[optionKey] && (
                      <RadioBox />
                    )}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
});

export default Select;
