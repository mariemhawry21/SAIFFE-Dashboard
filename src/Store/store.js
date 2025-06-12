import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";

export default configureStore({
  reducer: {
    auth: authReducer,
  },
});
