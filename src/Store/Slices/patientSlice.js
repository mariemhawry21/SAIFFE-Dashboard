import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPatients } from "../../Api/patient.service";

export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await getAllPatients(page, limit, search);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const patientSlice = createSlice({
  name: "patients",
  initialState: {
    data: {
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
      },
    },
    loading: false,
    error: null,
    searchTerm: "",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetPatients: (state) => {
      state.data = {
        data: [],
        pagination: {
          currentPage: 1,
          totalPages: 0,
          totalItems: 0,
          itemsPerPage: 10,
        },
      };
      state.error = null;
      state.searchTerm = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPatients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPatients.fulfilled, (state, action) => {
        state.loading = false;
        state.data = {
          data: Array.isArray(action.payload.data.data) ? action.payload.data.data : [],
          pagination: action.payload.data.pagination ?? {
            currentPage: 1,
            totalPages: 0,
            totalItems: 0,
            itemsPerPage: 10,
          },
        };
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch patients";
      });
  },
});

export const { setSearchTerm, clearError, resetPatients } = patientSlice.actions;
export default patientSlice.reducer;
