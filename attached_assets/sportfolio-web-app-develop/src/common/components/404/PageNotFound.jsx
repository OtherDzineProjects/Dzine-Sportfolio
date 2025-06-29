import "./styles.css";
import logoImage from "assets/sportfolio-full-logo-new.svg";
import notFoundImage from "assets/404.svg";
import { Button, Typography } from "common";
import { useNavigate } from "react-router-dom";

export default function PageNotFound({
  errorHeading = "Seems Page Not Found",
  errorDetail = "Click on button below to redirect to home page"
}) {
  const navigate = useNavigate();
  return (
    <div>
      <header className="w-full flex justify-center items-center h-[4.5rem] bg-white not-found-header">
        <img src={logoImage} alt="SportFolio" />
      </header>
      <main className="m-0 not-found-page-container">
        <section className="not-found-page-content flex flex-col items-center mb-[10%]">
          <img
            src={notFoundImage}
            alt="404"
            className="me-[12%] h-auto max-w-[70%]"
          />

          <article className="text-center flex flex-col gap-4 items-center">
            <section>
              <Typography text={errorHeading} variant="h3" size="2xl" />
              <Typography text={errorDetail} variant="p" size="lg" />
            </section>

            <Button
              colorScheme="primary"
              className="max-w-max"
              onClick={() => navigate("/")}
            >
              Home Page
            </Button>
          </article>
        </section>
      </main>
    </div>
  );
}
