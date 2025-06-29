import {
  Button,
  IconButton,
  CustomAlert,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Typography,
  Alert,
  AlertIcon
} from "common";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { colors } from "utils/colors";
import FormController from "common/components/FormController";
import { Email, Eye, Lock, NoEye, Phone, User } from "assets/InputIcons";
import { emailCheck } from "pages/common/helpers";
import { setNewUserDialog } from "../slice";
import { saveUser, searchUser, updateUser } from "../api";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import { useSearchParams } from "react-router-dom";
import { saveUserSchema } from "../validate";
import { useMemo } from "react";

const NewUser = (props) => {
  const { userId = null, setUserId = () => {} } = props;

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: {
      firstName: null,
      lastName: null,
      phoneNumber: null,
      email: null,
      password: null,
      terms: false,
      userId: null
    },
    resolver: yupResolver(saveUserSchema)
  });

  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const toast = useToast();

  const [showPassword, setShowPassword] = useState(false);
  const [openAlert, setOpenAlert] = useState({
    open: false,
    title: "",
    message: ""
  });

  const {
    newUserDialog,
    saveUserLoading,
    getUserByIDRes,
    getUserByIDLoading,
    updateUserLoading
  } = useSelector((state) => state.users);

  useEffect(() => {
    if (userId) {
      if (getUserByIDRes?.data?.length > 0) {
        let dataRes = getUserByIDRes?.data[0];
        reset({
          firstName: dataRes?.firstName,
          lastName: dataRes?.lastName,
          phoneNumber: dataRes?.phoneNumber,
          email: dataRes?.email,
          userId: userId
        });
      }
    }
  }, [getUserByIDRes]);

  const handleUser = async (data) => {
    try {
      const isUpdate = Boolean(userId);
      const sendData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber
      };
      const response = isUpdate
        ? await dispatch(updateUser({ id: userId, data: sendData }))
        : await dispatch(saveUser(sendData));

      const successMessage = isUpdate
        ? "User is successfully Updated"
        : "User is successfully Created";

      const errorMessage = isUpdate
        ? "Error While trying to update User."
        : "Error While trying to add User.";

      if (response?.payload?.success) {
        toast({
          title: "Success",
          description: successMessage,
          status: "success",
          duration: 5000,
          isClosable: true
        });
        reset({
          organizationName: null,
          organizationEmail: null,
          website: null,
          phoneNumber: null,
          city: null,
          district: null,
          state: null
        });
        dispatch(
          searchUser({
            keywordSearchText: null,
            query: `?page=${Number(searchParams.get("page") || 1)}&pageSize=${
              searchParams.get("pageSize") || 12
            }`
          })
        );
        dispatch(setNewUserDialog(false));
      } else {
        toast({
          title: errorMessage,
          description: response?.error?.message,
          status: "error",
          duration: 5000,
          isClosable: true
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Something went wrong, please try again",
        status: "error",
        duration: 5000,
        isClosable: true
      });
    }
  };

  const passwordIndicator = useMemo(
    () => (
      <IconButton onClick={() => setShowPassword(!showPassword)}>
        {!showPassword ? (
          <NoEye color={colors.dark} />
        ) : (
          <Eye color={colors.dark} />
        )}
      </IconButton>
    ),
    [showPassword]
  );

  const handleChange = (field, data) => {
    setOpenAlert({ open: false });
    switch (field) {
      case "terms":
        setValue("terms", data);
        break;
      case "email":
        setValue("email", data);
        break;
      default:
        setValue(field, data);
        break;
    }
  };

  const handleCancel = () => {
    setUserId(null);
    dispatch(setNewUserDialog(false));
  };

  return (
    <Modal
      isOpen={newUserDialog}
      onClose={handleCancel}
      size="xl"
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{userId ? "Update User" : "New User"} </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <CustomAlert
            status="error"
            open={openAlert?.open}
            title={openAlert?.title}
            message={openAlert?.message}
          />
          {getUserByIDLoading && userId ? (
            <FullscreenLoader
              text={"Fetching user details..."}
              height={"300px"}
            />
          ) : (
            <form
              onSubmit={handleSubmit(handleUser)}
              id="new-user-save"
              className="py-3"
            >
              <div className="grid grid-flow-row gap-5">
                <FormController
                  control={control}
                  errors={errors}
                  type="text"
                  name="firstName"
                  label="First Name"
                  placeholder="Enter your first name"
                  left={<User color={colors.dark} className="pt-3" />}
                />
                <FormController
                  control={control}
                  errors={errors}
                  type="text"
                  name="lastName"
                  label="Last Name"
                  placeholder="Enter your last name"
                  left={<User color={colors.dark} className="pt-3" />}
                />
                <FormController
                  control={control}
                  errors={errors}
                  type="text"
                  name="phoneNumber"
                  label="Phone Number"
                  placeholder="Enter your phone"
                  left={<Phone color={colors.dark} className="pt-3" />}
                />
                <FormController
                  control={control}
                  errors={errors}
                  type="text"
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  handleChange={(data) => handleChange("email", data)}
                  left={<Email color={colors.dark} className="pt-3" />}
                  right={emailCheck(watch("email"))}
                  isDisabled={userId}
                />
                {!userId && (
                  <div>
                    <FormController
                      control={control}
                      errors={errors}
                      type={showPassword ? "text" : "password"}
                      name="password"
                      label="Password"
                      placeholder="Enter your password"
                      left={<Lock color={colors.dark} />}
                      right={passwordIndicator}
                    />

                    <Alert status="info" className="mt-5">
                      <AlertIcon />
                      <Typography
                        fontSize="0.75rem"
                        type="p"
                        text="Password should contain uppercase, lowercase, number and special
              characters"
                        color={colors.dark}
                      />
                    </Alert>
                  </div>
                )}
              </div>
            </form>
          )}
        </ModalBody>

        <ModalFooter className="right">
          <Button
            variant={"outline"}
            colorScheme={"primary"}
            mr={3}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            variant={"solid"}
            colorScheme={"primary"}
            type="submit"
            form="new-user-save"
            isLoading={saveUserLoading || updateUserLoading}
          >
            {userId ? "Update" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default NewUser;
