import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import blogReducer from "./Slices/blogSlice";
import doctorDashboardReducer from "./Slices/doctorDashboard";
import adminDashboardReducer from "./Slices/adminDashboard";

import patientReducer from "./Slices/patientSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    doctorDashboard: doctorDashboardReducer,
    adminDashboard: adminDashboardReducer,
    patients: patientReducer,
  },
});
