import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  FormController,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Typography
} from "common";
import {
  getNotificationStatus,
  getOrganizationMemberStatuses
} from "pages/common/api";
import { useMemo } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { colors } from "utils/colors";
import { validationMsgs } from "utils/validations";
import * as yup from "yup";
import _ from "lodash";

export default function ActionModal({
  title,
  type = "org",
  label = "",
  onClose = () => {},
  isOpen = false,
  hideAction = false,
  orgID = null,
  organizationMemberID = null,
  selectedStatus = null,
  onSubmitForm = () => {},
  loading = false
}) {
  const innerRef = useRef(null),
    { getOrganizationMemberStatusesRes, getNotificationStatusRes } =
      useSelector((state) => state.common),
    dispatch = useDispatch(),
    actionValidate = yup
      .object()
      .shape({
        statusID: hideAction
          ? yup.string()
          : yup.string().required(validationMsgs.actionRequired),
        notes: yup.string().required(validationMsgs.reasonRequired)
      })
      .required();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    mode: "all",
    defaultValues: {
      statusID: "",
      notes: ""
    },
    resolver: yupResolver(actionValidate)
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        statusID: "",
        notes: ""
      });
    }
  }, [isOpen]);

  useEffect(() => {
    switch (type) {
      case "org":
        dispatch(getOrganizationMemberStatuses());
        break;
      case "notification":
        dispatch(getNotificationStatus());
        break;
    }
  }, []);

  const statusOptions = useMemo(() => {
    switch (type) {
      case "org":
        return !_.isNil(selectedStatus)
          ? getOrganizationMemberStatusesRes?.data.filter(
              (item) => item.id !== selectedStatus
            )
          : getOrganizationMemberStatusesRes?.data;
      case "notification":
        return !_.isNil(selectedStatus)
          ? getNotificationStatusRes?.data.filter(
              (item) => item.id !== selectedStatus
            )
          : getNotificationStatusRes?.data;
    }
  }, [
    selectedStatus,
    type,
    getNotificationStatusRes,
    getOrganizationMemberStatusesRes
  ]);

  const handleChange = (value) => {
    if (type === "notification") {
      setValue("statusID", value?.LookupDetailID ?? "", {
        shouldValidate: true
      });
    } else {
      setValue("statusID", value?.id ?? "", {
        shouldValidate: true
      });
    }
  };

  const onSubmit = (submitData) => {
    if (loading) return;
    if (hideAction) {
      delete submitData.statusID;
      submitData.status = "Cancel";
    }
    submitData.organizationMemberID = !_.isNil(organizationMemberID)
      ? +organizationMemberID
      : null;
    submitData.organizationID = !_.isNil(orgID) ? +orgID : null;
    onSubmitForm(submitData);
    reset({
      statusID: "",
      notes: ""
    });
  };

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      isCentered
      size="md"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay bg="rgba(38, 50, 56, 0.6)" />
      <ModalContent>
        <ModalHeader
          bg={`${colors.white} !important`}
          fontSize="1.125rem"
          borderBlockEnd="1px solid rgba(241, 245, 249, 1)"
          fontWeight={400}
          flex
          alignItems="center"
        >
          <Typography text={`${title}`} type="p" size="sm" />

          <ModalCloseButton isDisabled={loading} />
        </ModalHeader>
        <ModalBody>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className={`m-4 flex flex-col gap-7 ${
              hideAction ? "" : "min-h-64"
            }`}
            style={{ scrollbarGutter: "stable" }}
            autoComplete="one-time-code"
          >
            {!hideAction && (
              <FormController
                control={control}
                errors={errors}
                type="select"
                name="statusID"
                label="Action"
                options={statusOptions || []}
                optionKey={type === "org" ? "id" : "LookupDetailID"}
                shrink
                required
                handleChange={(value) => handleChange(value)}
              />
            )}
            <FormController
              control={control}
              errors={errors}
              type="text-area"
              name="notes"
              label={
                label ? label : hideAction ? "Reason for rejection" : "Reason"
              }
              toolBarPosition="bottom"
              shrink
              required
              rows={6}
            />

            <button type="submit" ref={innerRef} style={{ display: "none" }}>
              Submit Trigger
            </button>
          </form>
        </ModalBody>
        <ModalFooter gap="1rem">
          <Button
            onClick={onClose}
            type="button"
            variant="outline"
            colorScheme="secondary"
            isDisabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="solid"
            colorScheme="primary"
            onClick={() => (loading ? null : innerRef?.current?.click())}
            isLoading={loading}
          >
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
