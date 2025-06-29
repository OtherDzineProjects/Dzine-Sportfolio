import { SearchIcon } from "assets/DashboardIcons";
import { FormController, IconButton } from "common";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { colors } from "utils/colors";

export default function OrgMemberRoleForm({
  loading = false,
  searchMembers = () => {}
}) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    mode: "all",
    defaultValues: {
      firstName: "",
      lastName: ""
    }
  });

  useEffect(() => {
    reset({
      firstName: "",
      lastName: ""
    });

    return () => {
      reset({
        firstName: "",
        lastName: ""
      });
    };
  }, []);

  const onSubmit = (submitData) => {
    if (loading) return;
    searchMembers(submitData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`grid grid-cols-[repeat(3,auto)] gap-x-2 gap-y-6 mt-2`}
      style={{ scrollbarGutter: "stable" }}
      autoComplete="one-time-code"
    >
      <FormController
        control={control}
        errors={errors}
        type="text"
        name="firstName"
        label="First Name"
        placeholder="Enter First name"
        shrink
      />

      <FormController
        control={control}
        errors={errors}
        type="text"
        name="lastName"
        label="Last Name"
        placeholder="Enter Last name"
        shrink
      />

      <div className="flex items-center">
        <IconButton
          type="submit"
          bg={colors.errorColor}
          isLoading={loading}
          paddingInline="1rem"
          icon={<SearchIcon color={colors.white} />}
        />
      </div>
    </form>
  );
}
