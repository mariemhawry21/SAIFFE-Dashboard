// src/slices/doctorDashboardSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../Api/api"; // Make sure this path is correct

export const fetchDoctorDashboard = createAsyncThunk(
  "doctorDashboard/fetchDashboard",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get token from auth state
      const token = getState().auth.token;

      if (!token) {
        throw new Error("Authentication required");
      }

      // Make API call to your doctor dashboard endpoint
      const response = await API.get("/dashboard/doctor", {
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

      console.error("[Dashboard Error]", error.response?.data || error);
      return rejectWithValue(errorMessage);
    }
  }
);

const initialState = {
  data: null,
  loading: false,
  error: null,
};

const doctorDashboardSlice = createSlice({
  name: "doctorDashboard",
  initialState,
  reducers: {
    // Optional: Add reset action if needed
    resetDashboard: (state) => {
      state.data = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctorDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDoctorDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchDoctorDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetDashboard } = doctorDashboardSlice.actions;
export default doctorDashboardSlice.reducer;
