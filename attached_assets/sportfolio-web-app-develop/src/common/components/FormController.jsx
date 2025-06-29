import { Controller } from "react-hook-form";
import _ from "lodash";
import { CheckBox, MultiSelect, Text, Select, TextArea } from "common";
import RichText from "./rich-text";

const FormController = (props) => {
  const {
    type,
    name,
    control,
    errors,
    optionKey = "id",
    content,
    verified = false,
    toolBarPosition = "top",
    ...rest
  } = props;
  const error = _.get(errors, `${name}.message`, null);

  switch (type) {
    case "multi-select": {
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <MultiSelect
              {...field}
              {...props}
              {...{ error }}
              {...rest}
              ref={field.ref}
              optionKey={optionKey}
              verified={verified}
              onChange={(data) => {
                field.onChange(data);
                props?.handleChange?.(data);
              }}
            />
          )}
        />
      );
    }

    case "select": {
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              {...props}
              {...{ error }}
              {...rest}
              ref={field.ref}
              verified={verified}
              optionKey={optionKey}
              onChange={(data) => {
                field.onChange(data);
                props?.handleChange?.(data);
              }}
            />
          )}
        />
      );
    }

    case "check": {
      return (
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <CheckBox
              {...field}
              {...props}
              {...{ error }}
              ref={field.ref}
              verified={verified}
              optionKey={optionKey}
              onChange={(data) => {
                field.onChange(data);
                props?.handleChange?.(data);
              }}
            />
          )}
        />
      );
    }

    case "text-area":
      return (
        <>
          <div id={name} className="mt-[-200px] absolute" />
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <TextArea
                {...field}
                {...props}
                {...{ error }}
                verified={verified}
                ref={field.ref}
                onChange={(data) => {
                  field.onChange(data);
                  props?.handleChange?.(data);
                }}
                content={content}
              />
            )}
          />
        </>
      );

    case "rich":
      return (
        <>
          <div id={name} className="mt-[-200px] absolute" />
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <RichText
                toolbarPosition={toolBarPosition}
                {...field}
                {...props}
                {...{ error }}
                ref={field.ref}
                onChange={(data) => {
                  field.onChange(data);
                  props?.handleChange?.(data);
                }}
              />
            )}
          />
        </>
      );

    default:
      return (
        <>
          <div id={name} className="mt-[-200px] absolute" />
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Text
                {...field}
                {...props}
                {...{ error }}
                verified={verified}
                ref={field.ref}
                onChange={(data) => {
                  field.onChange(data);
                  props?.handleChange?.(data);
                }}
                content={content}
              />
            )}
          />
        </>
      );
  }
};

export default FormController;
