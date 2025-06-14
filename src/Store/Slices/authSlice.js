import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/api";
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await API.post("/auth/login", userData);
      const { user, token } = response.data.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      return response.data;
    } catch (error) {
      let errorMessage = "An unknown error occurred. Please try again.";
      const serverMessage = error.response?.data?.message;

      if (serverMessage) {
        errorMessage = serverMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error(
        "[Login Error]",
        error.response?.data || error.message || error
      );

      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: (() => {
      const storedUser = localStorage.getItem("user");
      if (storedUser && storedUser !== "undefined") {
        try {
          return JSON.parse(storedUser);
        } catch (e) {
          console.error("Error parsing user from localStorage:", e);
          localStorage.removeItem("user");
          return null;
        }
      }
      return null;
    })(),
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    isAuthenticated: !!localStorage.getItem("token"),
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
        state.isAuthenticated = false;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
