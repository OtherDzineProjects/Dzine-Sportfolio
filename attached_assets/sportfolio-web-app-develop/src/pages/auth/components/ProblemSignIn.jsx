import { colors } from "utils/colors";
import LoginImage from "assets/login-bg.svg";
import SportfolioLogo from "assets/sportfolio-logo.svg";
import { Button, FormController, Image, Typography } from "common";
import { Email } from "assets/InputIcons";
import { useForm } from "react-hook-form";
import { emailSchema } from "../validate";
import { yupResolver } from "@hookform/resolvers/yup";
import { emailCheck } from "pages/common/helpers";
import { PATH_SIGNIN, PATH_SIGNUP } from "common/constants";
import { useNavigate } from "react-router-dom";
import useSuccessAlert from "hooks/useSuccessAlert";
import { useDispatch } from "react-redux";
import { setAlertDialog } from "pages/common/slice";
import { forgetPassword } from "../api";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { API_STATUS } from "pages/common/constants";
import useErrorAlert from "hooks/useErrorAlert";
import { resetPasswordStates } from "../slice";

const ProblemSignIn = () => {
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
    resolver: yupResolver(emailSchema)
  });

  const navigate = useNavigate();
  const successAlert = useSuccessAlert();
  const errorAlert = useErrorAlert();
  const dispatch = useDispatch();
  const { forgetPasswordStatus, forgetPasswordRes, forgetPasswordLoading } =
    useSelector((state) => state.auth);

  useEffect(() => {
    if (forgetPasswordStatus === API_STATUS.SUCCESS) {
      successAlert("", "Email with OTP sent successfully", () => {
        navigate(`${PATH_SIGNIN}?type=otp`);
        dispatch(setAlertDialog(null));
      });
      dispatch(resetPasswordStates());
    } else if (forgetPasswordStatus === API_STATUS.FAILED) {
      errorAlert(
        "",
        forgetPasswordRes || "Error in requesting forget password"
      );
      dispatch(resetPasswordStates());
    }
  }, [forgetPasswordStatus]);

  const handleForgetPasswordSubmit = (submitData) => {
    dispatch(forgetPassword(submitData.email));
  };

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
            <Typography type="h3" text="Forgot Password?" size="lg" />
            <div className="mb-10" />
            <form onSubmit={handleSubmit(handleForgetPasswordSubmit)}>
              <div className="grid grid-flow-row gap-5">
                <FormController
                  control={control}
                  errors={errors}
                  type="text"
                  name="email"
                  label="Email ID"
                  placeholder="Enter your email"
                  left={<Email color={colors.dark} className="pt-3" />}
                  right={emailCheck(watch("email"))}
                />

                <Button
                  type="submit"
                  size="lg"
                  variant="solid"
                  className="mt-5"
                  colorScheme="primary"
                  isLoading={forgetPasswordLoading}
                >
                  Send Temporary Password
                </Button>

                <Button
                  type="button"
                  size="md"
                  variant="link"
                  className="mt-5"
                  colorScheme={colors.dark}
                  onClick={() => navigate(PATH_SIGNUP)}
                >
                  Dont have an account yet ?
                  <span className="pl-2" style={{ color: colors.primary }}>
                    Register Now
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

export default ProblemSignIn;
