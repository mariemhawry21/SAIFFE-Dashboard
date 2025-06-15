import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import blogReducer from "./Slices/blogSlice";
import patientReducer from "./Slices/patientSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    patients: patientReducer,
  },
});
