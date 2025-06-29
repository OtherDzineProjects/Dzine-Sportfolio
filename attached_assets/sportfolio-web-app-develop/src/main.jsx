import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { routes } from "pages/routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { ChakraProvider } from "common";
import FullscreenLoader from "common/components/loaders/FullscreenLoader";
import { store } from "./app/store";
import { theme } from "utils/theme";
import { StatusAlert } from "common/components/Alert/StatusAlert";

const router = createBrowserRouter([...routes]);
const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <Provider store={store}>
        <Suspense fallback={<FullscreenLoader />}>
          <StatusAlert />
          <RouterProvider router={router} />
        </Suspense>
      </Provider>
    </ChakraProvider>
  </React.StrictMode>
);
