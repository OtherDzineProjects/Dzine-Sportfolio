import { Button } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography, IconButton, FormController, Table } from "common";
import "./style.css";
import { Delete, Edit } from "assets/InputIcons";
import { colors } from "utils/colors";
import {
  contactCommunicationEmail,
  contactCommunicationPhone
} from "../../validate";
import { serialNumber } from "utils/serialNumber";
import { useState, Fragment, useEffect } from "react";

const ContactCommunication = ({
  communicationDetails,
  setCommunicationDetails,
  communicationTypes
}) => {
  const [mode, setMode] = useState(""),
    [selectedItemIndex, setSelectedItemIndex] = useState(null),
    [type, setType] = useState("email");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    resetField,
    getValues
  } = useForm({
    mode: "all",
    defaultValues: {
      communicationTypeId: "",
      value: ""
    },
    resolver: yupResolver(
      type === "email" ? contactCommunicationEmail : contactCommunicationPhone
    )
  });

  useEffect(() => {
    const selectedItemIndex = communicationTypes.findIndex(
      (item) => item?.LookupDetailID === +getValues("communicationTypeId")
    );

    if (selectedItemIndex > -1) {
      setType(
        communicationTypes[selectedItemIndex]?.name
          ?.toLowerCase()
          ?.includes("phone")
          ? "number"
          : "email"
      );
    } else setType("email");
  }, [getValues("communicationTypeId")]);

  useEffect(() => {
    return () => {
      setType("email");
      setMode("");
      setSelectedItemIndex(null);
    };
  }, []);

  useEffect(() => {}, [getValues("communicationTypeId")]);

  const resetForm = () => {
    reset({
      communicationTypeId: "",
      value: ""
    });
    setMode("");
    setSelectedItemIndex(null);
  };

  const onSubmit = (data) => {
    switch (mode) {
      case "Add":
        setCommunicationDetails([...communicationDetails, data]);
        resetForm();
        break;
      case "Edit":
        if (selectedItemIndex >= 0) {
          const array = communicationDetails;
          array[selectedItemIndex] = data;
          setCommunicationDetails([...array]);
          resetForm();
        }
        break;
    }
  };

  const handleChange = (data) => {
    setValue(
      "communicationTypeId",
      data?.LookupDetailID ? +data?.LookupDetailID : "",
      {
        shouldValidate: true
      }
    );
    resetField("value", { defaultValue: "" });
  };

  const handleDelete = (index) => {
    let newArray = communicationDetails.filter((item, ind) => index !== ind);
    setCommunicationDetails(newArray);
  };

  const handleEdit = (item, index) => {
    setSelectedItemIndex(index);
    reset({
      communicationTypeId: item?.communicationTypeId
        ? +item?.communicationTypeId
        : "",
      value: item?.value ?? ""
    });
    setMode("Edit");
  };

  const handleTableActions = (row) => {
    return (
      <Fragment>
        <IconButton
          onClick={() => handleEdit(row?.row, row?.rowIndex)}
          variant="ghost"
          icon={<Edit />}
        />
        <IconButton
          onClick={() => handleDelete(row?.rowIndex)}
          variant="ghost"
          icon={<Delete color={colors.secondary} />}
        />
      </Fragment>
    );
  };

  const handleType = (row) => {
    let find = communicationTypes.findIndex(
      (item) => +item?.LookupDetailID === +row?.row?.communicationTypeId
    );
    if (find > -1) {
      return communicationTypes[find].name;
    }
    return "error";
  };

  const columns = [
    {
      header: "Sl No",
      field: "slNo",
      alignment: "left",
      cell: (field) => serialNumber(field, 0)
    },
    {
      header: "Communication Type",
      field: "communicationTypeId",
      alignment: "left",
      cell: (field) => handleType(field)
    },
    {
      header: "Value",
      field: "value",
      alignment: "left"
    },
    {
      header: "Actions",
      alignment: "left",
      cell: (field) => handleTableActions(field)
    }
  ];

  return (
    <div className="px-[20px]">
      <div className="w-full mb-5">
        <div className="flex items-center justify-between">
          <Typography text="Contact Communication Details" />
          {mode === "" && (
            <Button
              variant="outline"
              colorScheme="primary"
              onClick={() => setMode("Add")}
            >
              Add New
            </Button>
          )}
        </div>
        {(mode === "Add" || mode === "Edit") && (
          <form
            id="user_contatc_communication_form"
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="one-time-code"
            noValidate
          >
            <div className="grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-5 py-[20px]">
              <FormController
                control={control}
                errors={errors}
                type="select"
                name="communicationTypeId"
                label="Communication Type"
                handleChange={handleChange}
                optionKey="LookupDetailID"
                shrink
                required
                options={communicationTypes}
              />

              <FormController
                control={control}
                errors={errors}
                type={type}
                name="value"
                label="Value"
                shrink
                required
              />
              <div className="flex gap-3 items-center">
                {mode === "Edit" ? (
                  <Button
                    type="submit"
                    size="md"
                    variant="solid"
                    colorScheme="secondary"
                    form="user_contatc_communication_form"
                  >
                    Update Contact
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="md"
                    variant="solid"
                    colorScheme="secondary"
                    form="user_contatc_communication_form"
                  >
                    Add Contact
                  </Button>
                )}
                <Button size="md" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        )}
        <Table columns={columns} tableData={communicationDetails} />
      </div>
    </div>
  );
};

export default ContactCommunication;
