import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import blogReducer from "./Slices/blogSlice";
import patientReducer from "./Slices/patientSlice";
import doctorPatientReducer from "./Slices/DoctorPatients";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
    patients: patientReducer,
    doctorPatients: doctorPatientReducer,
  },
});
