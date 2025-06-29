import { Button, Image, Typography, IconButton, CustomAlert } from "common";
import { useNavigate } from "react-router-dom";
import {
  PATH_NOTIFICATION,
  PATH_PROBLEM_SIGNIN,
  PATH_SIGNUP,
  STORAGE_KEYS
} from "common/constants";
import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { signIn, validateOTP } from "../api";
import { API_STATUS } from "pages/common/constants";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailLogin, emailOTPLogin } from "../validate";
import { colors } from "utils/colors";
import LoginImage from "assets/login-bg.svg";
import SportfolioLogo from "assets/sportfolio-logo.svg";
import FormController from "common/components/FormController";
import { Email, Eye, Lock, NoEye } from "assets/InputIcons";
import { emailCheck } from "pages/common/helpers";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { resetPasswordStates } from "../slice";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: {
      email: null,
      password: null
    },
    resolver: yupResolver(
      searchParams.get("type") === "otp" ? emailOTPLogin : emailLogin
    )
  });

  const [showPassword, setShowPassword] = useState(false);
  const [openAlert, setOpenAlert] = useState({
    open: false,
    title: "",
    message: "",
    status: "success"
  });

  const {
    signInRes,
    signInLoading,
    signInStatus,
    validateOTPRes,
    validateOTPLoading,
    validateOTPStatus
  } = useSelector((state) => state.auth);

  const handleNavigateSignUp = () => {
    navigate(PATH_SIGNUP);
  };

  const handleNavigateProblemSignIn = () => {
    navigate(PATH_PROBLEM_SIGNIN);
  };

  useEffect(() => {
    if (signInStatus === API_STATUS.SUCCESS && signInRes?.data) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, signInRes?.data?.token);
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify({
          id: signInRes?.data?.id,
          firstName: signInRes?.data?.firstName,
          lastName: signInRes?.data?.lastName,
          email: signInRes?.data?.email,
          role: signInRes?.data?.roleID,
          avatar: signInRes?.data?.avatar,
          isAdmin: !!signInRes?.data?.isAdmin
        })
      );
      navigate(PATH_NOTIFICATION, { replace: true });
    }
    if (signInStatus === API_STATUS.FAILED) {
      setOpenAlert({
        open: true,
        title: "Error While trying to signin",
        message: signInRes,
        status: "error"
      });
    }
  }, [signInRes, signInStatus]);

  useEffect(() => {
    if (validateOTPStatus === API_STATUS.SUCCESS && validateOTPRes?.data) {
      localStorage.setItem(STORAGE_KEYS.TOKEN, validateOTPRes?.data?.token);
      localStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify({
          id: validateOTPRes?.data?.id,
          firstName: validateOTPRes?.data?.firstName,
          lastName: validateOTPRes?.data?.lastName,
          email: validateOTPRes?.data?.email,
          role: validateOTPRes?.data?.roleID,
          avatar: validateOTPRes?.data?.avatar,
          isAdmin: !!validateOTPRes?.data?.isAdmin
        })
      );
      localStorage.setItem(
        STORAGE_KEYS.CHANGE_PASSWORD,
        `${!!validateOTPRes?.data?.isPasswordMatch}`
      );
      dispatch(resetPasswordStates());
      navigate(PATH_NOTIFICATION, { replace: true });
    }
    if (validateOTPStatus === API_STATUS.FAILED) {
      setOpenAlert({
        open: true,
        title: "Error while trying to signin",
        message: validateOTPRes,
        status: "error"
      });
      dispatch(resetPasswordStates());
    }
  }, [validateOTPRes, validateOTPStatus]);

  const handleSignin = (data) => {
    if (searchParams.get("type") === "otp") {
      dispatch(validateOTP({ email: data?.email, otp: data?.password }));
    } else {
      dispatch(signIn({ email: data?.email, password: data?.password }));
    }
  };

  useEffect(() => {
    setOpenAlert({ open: false });
  }, [watch("email"), watch("password")]);

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

  return (
    <div className="grid grid-cols-2 h-screen">
      <div className="h-screen p-10" style={{ background: colors.dark }}>
        <div className="w-[500px] m-auto">
          <div className="w-full">
            <Image src={SportfolioLogo} alt="Sportfolio" />
          </div>
          <div className="w-full">
            <Typography
              type="h2"
              text="Start your"
              size="2xl"
              color={colors.white}
            />
            <div className="mb-4" />
            <Typography
              type="h2"
              text="Journey with Us"
              size="2xl"
              color={colors.white}
            />
            <div className="mb-5" />
            <Typography
              type="paragraph"
              text="Discover the world’s best sports based crm
application with great options"
              color={colors.textLight}
            />
          </div>
          <div className="w-full text-center mt-10">
            <Image
              src={LoginImage}
              className="m-auto"
              alt="ok"
              boxSize="400px"
            />
          </div>
        </div>
      </div>
      <div className="h-screen flex p-10 items-center">
        <div className="w-[400px] m-auto">
          <div className="w-full">
            <Typography type="h3" text="Sign In" size="lg" />

            <div className="mb-10" />
            <CustomAlert
              status={openAlert?.status}
              open={openAlert?.open}
              title={openAlert?.title}
              message={openAlert?.message}
            />
            <form onSubmit={handleSubmit(handleSignin)}>
              <div className="grid grid-flow-row gap-5">
                <FormController
                  control={control}
                  errors={errors}
                  type="text"
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  left={<Email color={colors.dark} className="pt-3" />}
                  right={emailCheck(watch("email"))}
                />
                <FormController
                  control={control}
                  errors={errors}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  label={
                    searchParams.get("type") === "otp" ? "OTP" : "Password"
                  }
                  placeholder={
                    searchParams.get("type") === "otp"
                      ? "Enter your OTP"
                      : "Enter your Password"
                  }
                  left={<Lock color={colors.dark} />}
                  right={passwordIndicator}
                />
                <Button
                  type="button"
                  size="md"
                  variant="link"
                  colorScheme={colors.textDark}
                  onClick={() => handleNavigateProblemSignIn()}
                >
                  <div className="w-full text-left">Problem Sign In?</div>
                </Button>

                <Button
                  type="submit"
                  size="lg"
                  variant="solid"
                  className="mt-5"
                  colorScheme="primary"
                  isLoading={signInLoading || validateOTPLoading}
                >
                  Sign In
                </Button>

                <Button
                  type="button"
                  size="md"
                  variant="link"
                  className="mt-5"
                  colorScheme={colors.dark}
                  onClick={() => handleNavigateSignUp()}
                >
                  Dont have an account yet ?{" "}
                  <span className="pl-2" style={{ color: colors.primary }}>
                    Create One
                  </span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
