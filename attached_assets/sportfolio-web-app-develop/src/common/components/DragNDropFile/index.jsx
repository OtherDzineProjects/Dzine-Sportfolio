import { Close, PaperClip } from "assets/InputIcons";
import { Typography } from "common";
import { useMemo, useEffect, Fragment } from "react";
import { useDropzone } from "react-dropzone";
import { colors } from "utils/colors";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderWidth: 2,
  borderRadius: "0.375rem",
  borderColor: "#E0E0E0",
  borderStyle: "dashed",
  backgroundColor: colors.white,
  color: colors.dark,
  outline: "none",
  transition: "border .35s ease-in-out",
  height: "6.875rem",
  position: "relative"
};

const legendStyle = {
  fontSize: "0.875rem",
  position: "absolute",
  top: "-0.75rem",
  left: "1rem",
  backgroundColor: colors.white,
  paddingInline: "0.125rem"
};

const focusedStyle = {
  borderColor: "#2196f3"
};

const acceptStyle = {
  borderColor: "#00e676"
};

const rejectStyle = {
  borderColor: "#ff1744"
};

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16,
  rowGap: "0.5rem",
  columnGap: "0.75rem"
};

const close = {
  backgroundColor: "rgba(255, 255, 255)",
  borderRadius: "50%"
};

export const DragNDropFile = ({
  type = "image&docs",
  singleton = false,
  label,
  files,
  setFiles,
  additionalFiles,
  setAdditionalFiles
}) => {
  const acceptTypes = useMemo(() => {
      switch (type) {
        case "image":
          return {
            "image/jpeg": [],
            "image/png": []
          };
        case "docs":
          return {
            "application/pdf": [".pdf"]
          };
        default:
          return {
            "image/jpeg": [],
            "image/png": [],
            "application/pdf": [".pdf"]
          };
      }
    }, [type]),
    disabled = useMemo(() => {
      if (singleton) {
        return files?.length === 1 || additionalFiles?.length === 1;
      } else return false;
    }, [singleton, files, additionalFiles]);

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } =
    useDropzone({
      disabled: disabled,
      accept: acceptTypes,
      onDrop: (acceptedFiles) => {
        let accepted = acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        );
        setFiles([...files, ...accepted]);
      }
    });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleRemove = (index) =>
    setFiles(files.filter((item, ind) => index !== ind));

  const handleRemoveAdditional = (index) => {
    setAdditionalFiles(additionalFiles.filter((item, ind) => index !== ind));
  };

  const thumbs = () => {
    return (
      <div style={thumbsContainer}>
        {additionalFiles.map((file, index) => (
          <div
            key={`${file.fileName}-${index}`}
            className="px-3 py-1 rounded-md w-fit flex items-center gap-2"
            style={{
              backgroundColor: colors.badgeColorYellow
            }}
          >
            <PaperClip />
            <Typography
              text={file.fileName}
              type="p"
              size="s"
              weight="600"
              color={colors.dark}
            />
            <Close
              color={colors.secondary}
              style={close}
              role="button"
              onClick={() => handleRemoveAdditional(index)}
            />
          </div>
        ))}
        {files.map((file, index) => (
          <div
            key={`${file.name}-${index}`}
            className="px-3 py-1 rounded-md w-fit flex items-center gap-2"
            style={{
              backgroundColor: colors.badgeColorYellow
            }}
          >
            <PaperClip />
            <Typography
              text={file.path}
              type="p"
              size="s"
              weight="600"
              color={colors.dark}
            />
            <Close
              color={colors.secondary}
              style={close}
              role="button"
              onClick={() => handleRemove(index)}
            />
          </div>
        ))}
      </div>
    );
  };

  useEffect(() => {
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <Fragment>
      <div className="container">
        <div {...getRootProps({ style })}>
          <legend style={legendStyle}>{label}</legend>
          <input
            {...getInputProps()}
            disabled={disabled}
            multiple={!singleton}
          />
          <p className="m-auto select-none">
            Click or Drag and Drop here for Attachments
          </p>
        </div>
      </div>
      {thumbs()}
    </Fragment>
  );
};
