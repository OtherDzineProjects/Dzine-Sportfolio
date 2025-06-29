import { Image, Typography } from "common";
import { useSelector } from "react-redux";
import { colors } from "utils/colors";
import LoginImage from "assets/login-bg.svg";
import SportfolioLogo from "assets/sportfolio-logo.svg";
import Form from "./Form";
import Success from "./Success";
import { useState, useEffect } from "react";
import { API_STATUS } from "pages/common/constants";

const SignUp = () => {
  const { signUpRes, signUpStatus } = useSelector((state) => state.auth);

  const [signedUpStatus, setSignedUpStatus] = useState(false);

  useEffect(() => {
    if (signUpStatus === API_STATUS.SUCCESS) {
      setSignedUpStatus(true);
    }
    if (signUpStatus === API_STATUS.FAILED) {
      setSignedUpStatus(false);
    }
  }, [signUpRes, signUpStatus]);

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
            <Typography type="h3" text="Sign Up" size="lg" />
            <div className="mb-10" />
            {signedUpStatus ? <Success /> : <Form />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
