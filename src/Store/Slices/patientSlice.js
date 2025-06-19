import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAllPatients } from "../../Api/patient.service";

// Simplified async thunk without duplicate prevention logic
export const fetchPatients = createAsyncThunk(
  "patients/fetchPatients",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      console.log('Fetching patients with params:', { page, limit, search });
      const response = await getAllPatients(page, limit, search);
      console.log('API Response:', response);
      return response;
    } catch (error) {
      console.error('Fetch patients error:', error);
      return rejectWithValue(error.message || "Failed to fetch patients");
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
    initialized: false, // Track if initial load happened
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
      state.initialized = false;
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
        state.initialized = true;
        
        // Handle different response structures
        let responseData = action.payload;
        
        // If the response has a nested structure
        if (responseData?.data?.data) {
          responseData = responseData.data;
        }
        
        console.log('Processing response data:', responseData);
        
        state.data = {
          data: Array.isArray(responseData?.data) ? responseData.data : 
                Array.isArray(responseData) ? responseData : [],
          pagination: responseData?.pagination ? {
            currentPage: responseData.pagination.currentPage || 1,
            totalPages: responseData.pagination.totalPages || 0,
            totalItems: responseData.pagination.totalItems || 0,
            itemsPerPage: responseData.pagination.itemsPerPage || 10,
          } : {
            currentPage: 1,
            totalPages: 1,
            totalItems: Array.isArray(responseData?.data) ? responseData.data.length : 
                       Array.isArray(responseData) ? responseData.length : 0,
            itemsPerPage: 10,
          },
        };
      })
      .addCase(fetchPatients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch patients";
        state.initialized = true;
      });
  },
});

export const {
  setSearchTerm,
  clearError,
  resetPatients,
} = patientSlice.actions;

export default patientSlice.reducer;