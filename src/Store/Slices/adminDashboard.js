// src/slices/adminDashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/api";

export const fetchAdminDashboard = createAsyncThunk(
  "adminDashboard/fetchDashboard",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get token from auth state
      const token = getState().auth.token;

      if (!token) {
        throw new Error("Authentication required");
      }

      // Make API call to admin dashboard endpoint
      const response = await API.get("/dashboard/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      // Handle different error formats
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to load dashboard data";

      console.error("[Admin Dashboard Error]", error.response?.data || error);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    resetAdminDashboard: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAdminDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAdminDashboard } = adminDashboardSlice.actions;
export default adminDashboardSlice.reducer;
