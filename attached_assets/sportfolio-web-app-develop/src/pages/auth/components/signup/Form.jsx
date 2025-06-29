import { Button, IconButton, CustomAlert, Typography } from "common";
import { useNavigate } from "react-router-dom";
import { PATH_SIGNIN } from "common/constants";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { signUp } from "../../api";
import { API_STATUS } from "pages/common/constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailSignUpSchema } from "../../validate";
import { colors } from "utils/colors";
import FormController from "common/components/FormController";
import { Email, Eye, Lock, NoEye, Phone, User } from "assets/InputIcons";
import { emailCheck } from "pages/common/helpers";
import { useMemo } from "react";

const Form = () => {
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: {
      firstName: null,
      lastName: null,
      phoneNumber: null,
      email: null,
      password: null,
      terms: false
    },
    resolver: yupResolver(emailSignUpSchema)
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [openAlert, setOpenAlert] = useState({
    open: false,
    title: "",
    message: ""
  });

  const { signUpLoading, signUpRes, signUpStatus } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (signUpStatus === API_STATUS.FAILED) {
      setOpenAlert({
        open: true,
        title: "Error While trying to signup",
        message: signUpRes
      });
    }
  }, [signUpRes, signUpStatus]);

  const handleNavigateSignIn = () => {
    navigate(PATH_SIGNIN);
  };

  const handleEmail = (data) => {
    const sendData = {
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber
    };
    dispatch(signUp(sendData));
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
    if (field === "terms") {
      setValue("terms", data);
    } else if (field === "email") {
      setValue("email", data);
    }
  };

  return (
    <>
      <CustomAlert
        status="error"
        open={openAlert?.open}
        title={openAlert?.title}
        message={openAlert?.message}
      />

      <form onSubmit={handleSubmit(handleEmail)}>
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
          />
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

            <Typography
              fontSize="0.75rem"
              type="p"
              text="Password should contain uppercase, lowercase, number and special
              characters"
              color={colors.dark}
              className="mt-5"
            />
          </div>

          <FormController
            control={control}
            errors={errors}
            type={"check"}
            name="terms"
            label="Accept Terms and Conditions"
            placeholder="Enter your password"
            handleChange={(data) => handleChange("terms", data)}
          />

          <Button
            type="submit"
            size="lg"
            variant="solid"
            className="mt-5"
            colorScheme="primary"
            isLoading={signUpLoading}
            isDisabled={!getValues("terms")}
          >
            Sign Up
          </Button>

          <Button
            size="md"
            variant="link"
            className="mt-5"
            colorScheme={colors.dark}
            onClick={() => handleNavigateSignIn()}
          >
            Already have an account ?{" "}
            <span className="pl-2" style={{ color: colors.primary }}>
              Sign In
            </span>
          </Button>
        </div>
      </form>
    </>
  );
};

export default Form;
