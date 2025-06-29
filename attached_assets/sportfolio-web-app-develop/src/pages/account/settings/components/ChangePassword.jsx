import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, NoEye } from "assets/InputIcons";
import { Button, FormController, IconButton } from "common";
import { CardWithHeaderWrapper } from "common/components/Cards/CardWithHeaderWrapper";
import { useState } from "react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { colors } from "utils/colors";
import { changePasswordValidate, newPasswordValidate } from "../validate";
import { useEffect } from "react";

export default function ChangePassword({
  changePasswordCallback = () => {},
  showCurrentPasswordField = true,
  className = "",
  isOpen = false,
  loading = false
}) {
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: {
      oldPassword: "",
      password: "",
      confirmPassword: ""
    },
    resolver: yupResolver(
      showCurrentPasswordField ? changePasswordValidate : newPasswordValidate
    )
  });

  useEffect(() => {
    reset({
      oldPassword: "",
      password: "",
      confirmPassword: ""
    });
    setShowConfirmPassword(false);
    setShowPassword(false);
    setShowCurrentPassword(false);

    return () => {
      reset({
        oldPassword: "",
        password: "",
        confirmPassword: ""
      });
      setShowConfirmPassword(false);
      setShowPassword(false);
      setShowCurrentPassword(false);
    };
  }, [isOpen]);

  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordIndicator = useMemo(
    () => (
      <IconButton
        onClick={() => setShowPassword(!showPassword)}
        bg={colors.white}
        _hover={{ bg: colors.white }}
      >
        {!showPassword ? (
          <NoEye color={colors.dark} />
        ) : (
          <Eye color={colors.dark} />
        )}
      </IconButton>
    ),
    [showPassword]
  );

  const currentPasswordIndicator = useMemo(
    () => (
      <IconButton
        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
        bg={colors.white}
        _hover={{ bg: colors.white }}
      >
        {!showCurrentPassword ? (
          <NoEye color={colors.dark} />
        ) : (
          <Eye color={colors.dark} />
        )}
      </IconButton>
    ),
    [showCurrentPassword]
  );

  const confirmPasswordIndicator = useMemo(
    () => (
      <IconButton
        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
        bg={colors.white}
        _hover={{ bg: colors.white }}
      >
        {!showConfirmPassword ? (
          <NoEye color={colors.dark} />
        ) : (
          <Eye color={colors.dark} />
        )}
      </IconButton>
    ),
    [showConfirmPassword]
  );

  const onSubmit = (submitData) => {
    changePasswordCallback(submitData);
    reset({
      oldPassword: "",
      password: "",
      confirmPassword: ""
    });
  };

  return (
    <CardWithHeaderWrapper
      id="change-password"
      title="Change Password"
      containerClassName={className}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="one-time-code"
        className="flex flex-col gap-8 mx-2 my-6"
      >
        <section className="flex gap-5">
          {showCurrentPasswordField && (
            <FormController
              control={control}
              errors={errors}
              type={showCurrentPassword ? "text" : "password"}
              name="oldPassword"
              label="Current Password"
              right={currentPasswordIndicator}
              shrink
              autoComplete="one-time-code"
            />
          )}
          <FormController
            control={control}
            errors={errors}
            type={showPassword ? "text" : "password"}
            name="password"
            label="New Password"
            right={passwordIndicator}
            shrink
            autoComplete="one-time-code"
          />
          <FormController
            control={control}
            errors={errors}
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            label="Confirm Password"
            right={confirmPasswordIndicator}
            shrink
            autoComplete="one-time-code"
          />
        </section>

        <Button
          type="submit"
          variant="solid"
          colorScheme="primary"
          maxW="max-content"
          isLoading={loading}
        >
          Change Password
        </Button>
      </form>
    </CardWithHeaderWrapper>
  );
}
