import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./rootReducer";
// import logger from "redux-logger";

export const store = configureStore({
  reducer: reducers,
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
});
