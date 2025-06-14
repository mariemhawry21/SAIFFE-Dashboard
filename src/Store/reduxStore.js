import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slices/authSlice";
import blogReducer from "./Slices/blogSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
  },
});
