import { FormController } from "common";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { updateOrg } from "../../api";
import _ from "lodash";
import { formatInputDate } from "pages/common/helpers";

export default function OrganizationAboutForm({
  isOpen,
  innerRef,
  formType,
  organizationId,
  formData,
  loading
}) {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    mode: "all",
    defaultValues: {
      about: ""
    }
  });

  useEffect(() => {
    switch (formType) {
      case "create":
        reset({
          about: ""
        });
        break;
      case "edit": {
        reset({
          about: formData?.about || ""
        });
        break;
      }
    }
  }, [isOpen]);

  const dispatch = useDispatch();

  const onSubmit = (submitData) => {
    if (loading) return;

    submitData["organizationId"] = organizationId;
    submitData["organizationName"] = formData?.organizationName || "";
    submitData["organizationEmail"] = formData?.organizationEmail || "";
    submitData["organizationTypeID"] = !_.isNil(formData?.organizationTypeID)
      ? formData.organizationTypeID
      : "";
    submitData["registrationNumber"] = formData?.registrationNumber || "";
    submitData["registrationValidFrom"] = formData?.registrationValidFrom
      ? formatInputDate(formData.registrationValidFrom)
      : "";
    submitData["registrationValidTo"] = formData?.registrationValidTo
      ? formatInputDate(formData.registrationValidTo)
      : "";
    submitData["inchargeName"] = formData?.inchargeName || "";
    submitData["inchargePhone"] = formData?.inchargePhone || "";
    submitData["inchargeEmail"] = formData?.inchargeEmail || "";
    submitData["phoneNumber"] = formData?.phoneNumber || "";
    submitData["country"] = !_.isNil(formData?.countryID)
      ? +formData.countryID
      : "";
    submitData["city"] = formData?.city || "";
    submitData["district"] = !_.isNil(formData?.districtID)
      ? formData.districtID
      : "";
    submitData["state"] = !_.isNil(formData?.stateID) ? +formData.stateID : "";
    submitData["localBodyType"] = !_.isNil(formData?.localBodyTypeID)
      ? +formData.localBodyTypeID
      : "";
    submitData["localBodyName"] = !_.isNil(formData?.localBodyNameID)
      ? +formData.localBodyNameID
      : "";
    submitData["wardName"] = !_.isNil(formData?.wardID) ? +formData.wardID : "";
    submitData["postOffice"] = !_.isNil(formData?.postOfficeID)
      ? +formData.postOfficeID
      : "";
    submitData["pinCode"] = !_.isNil(formData?.pinCode) ? formData.pinCode : "";
    submitData["website"] = formData?.website || "";

    dispatch(updateOrg({ id: organizationId, data: submitData }));
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="m-4"
      style={{ scrollbarGutter: "stable" }}
      autoComplete="one-time-code"
    >
      <div className="w-full">
        <FormController
          control={control}
          errors={errors}
          type="rich"
          name="about"
          label=""
          toolBarPosition="bottom"
          shrink
        />
      </div>

      <button type="submit" ref={innerRef} style={{ display: "none" }}>
        Submit Trigger
      </button>
    </form>
  );
}
