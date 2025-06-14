import { configureStore } from "@reduxjs/toolkit";
import blogReducer from "./Slices/blogSlice";
import authReducer from "./Slices/authSlice";
export default configureStore({
  reducer: {
    auth: authReducer,
    blog: blogReducer,
  },
});
