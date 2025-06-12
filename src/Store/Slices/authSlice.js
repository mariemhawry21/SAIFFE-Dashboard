import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuthenticated: false,
  role: null,
  info: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login(state, action) {
      state.isAuthenticated = true;
      state.role = action.payload.role;
      state.info = action.payload.info;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.role = null;
      state.info = {};
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
