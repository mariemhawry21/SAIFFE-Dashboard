import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { 
  getDoctorPatients, 
  getPatientDetails, 
  updatePatientProfile,
  createPrescription,
  getDoctorPrescriptions,
  updatePrescription,
  deletePrescription
} from "../../Api/patient.service.js";

// Fetch doctor's patients
export const fetchDoctorPatients = createAsyncThunk(
  "doctorPatients/fetchPatients",
  async ({ page = 1, limit = 10, search = "" }, { rejectWithValue }) => {
    try {
      const response = await getDoctorPatients(page, limit, search);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch patient details
export const fetchPatientDetails = createAsyncThunk(
  "doctorPatients/fetchPatientDetails",
  async (patientId, { rejectWithValue }) => {
    try {
      console.log('Fetching patient details for ID:', patientId);
      const response = await getPatientDetails(patientId);
      console.log('API Response received:', response);
      return response;
    } catch (error) {
      console.error('Error fetching patient details:', error);
      return rejectWithValue(error.message || 'Failed to fetch patient details');
    }
  }
);

// Update patient profile
export const updatePatientProfileAsync = createAsyncThunk(
  "doctorPatients/updatePatientProfile",
  async ({ patientId, updateData }, { rejectWithValue }) => {
    try {
      const response = await updatePatientProfile(patientId, updateData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create prescription
export const createPrescriptionAsync = createAsyncThunk(
  "doctorPatients/createPrescription",
  async (prescriptionData, { rejectWithValue }) => {
    try {
      const response = await createPrescription(prescriptionData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch prescriptions
export const fetchPrescriptions = createAsyncThunk(
  "doctorPatients/fetchPrescriptions",
  async (patientId = null, { rejectWithValue }) => {
    try {
      const response = await getDoctorPrescriptions(patientId);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update prescription
export const updatePrescriptionAsync = createAsyncThunk(
  "doctorPatients/updatePrescription",
  async ({ prescriptionId, updateData }, { rejectWithValue }) => {
    try {
      const response = await updatePrescription(prescriptionId, updateData);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete prescription
export const deletePrescriptionAsync = createAsyncThunk(
  "doctorPatients/deletePrescription",
  async (prescriptionId, { rejectWithValue }) => {
    try {
      const response = await deletePrescription(prescriptionId);
      return { prescriptionId, ...response };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const doctorPatientSlice = createSlice({
  name: "doctorPatients",
  initialState: {
    patients: {
      data: [],
      pagination: {
        currentPage: 1,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 10,
      },
    },
    selectedPatient: {
      patient: null,
      appointments: [],
      prescriptions: [],
    },
    prescriptions: [],
    loading: {
      patients: false,
      patientDetails: false,
      updateProfile: false,
      prescriptions: false,
      createPrescription: false,
      updatePrescription: false,
      deletePrescription: false,
    },
    error: {
      patients: null,
      patientDetails: null,
      updateProfile: null,
      prescriptions: null,
      createPrescription: null,
      updatePrescription: null,
      deletePrescription: null,
    },
    searchTerm: "",
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    clearErrors: (state) => {
      state.error = {
        patients: null,
        patientDetails: null,
        updateProfile: null,
        prescriptions: null,
        createPrescription: null,
        updatePrescription: null,
        deletePrescription: null,
      };
    },
    clearSelectedPatient: (state) => {
      state.selectedPatient = {
        patient: null,
        appointments: [],
        prescriptions: [],
      };
    },
    resetDoctorPatients: (state) => {
      return {
        ...state.initialState,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch doctor patients
      .addCase(fetchDoctorPatients.pending, (state) => {
        state.loading.patients = true;
        state.error.patients = null;
      })
      .addCase(fetchDoctorPatients.fulfilled, (state, action) => {
        state.loading.patients = false;
        state.patients = {
          data: Array.isArray(action.payload.patients) ? action.payload.patients : [],
          pagination: {
            currentPage: action.payload.currentPage || 1,
            totalPages: action.payload.totalPages || 0,
            totalItems: action.payload.count || 0,
            itemsPerPage: 10,
          },
        };
      })
      .addCase(fetchDoctorPatients.rejected, (state, action) => {
        state.loading.patients = false;
        state.error.patients = action.payload || "Failed to fetch patients";
      })

      // Fetch patient details - FIXED
      .addCase(fetchPatientDetails.pending, (state) => {
        state.loading.patientDetails = true;
        state.error.patientDetails = null;
        console.log('Redux: fetchPatientDetails pending');
      })
      .addCase(fetchPatientDetails.fulfilled, (state, action) => {
        state.loading.patientDetails = false;
        console.log('Redux: fetchPatientDetails fulfilled with payload:', action.payload);
        
        // Handle the response structure properly
        const responseData = action.payload;
        
        // Check if the response has the expected structure
        if (responseData && typeof responseData === 'object') {
          state.selectedPatient = {
            patient: responseData.patient || null,
            appointments: Array.isArray(responseData.appointments) ? responseData.appointments : [],
            prescriptions: Array.isArray(responseData.prescriptions) ? responseData.prescriptions : [],
          };
          
          console.log('Redux: selectedPatient updated:', state.selectedPatient);
        } else {
          console.error('Redux: Invalid response structure:', responseData);
          state.error.patientDetails = 'Invalid response structure';
        }
      })
      .addCase(fetchPatientDetails.rejected, (state, action) => {
        state.loading.patientDetails = false;
        state.error.patientDetails = action.payload || "Failed to fetch patient details";
        console.error('Redux: fetchPatientDetails rejected:', action.payload);
      })

      // Update patient profile
      .addCase(updatePatientProfileAsync.pending, (state) => {
        state.loading.updateProfile = true;
        state.error.updateProfile = null;
      })
      .addCase(updatePatientProfileAsync.fulfilled, (state, action) => {
        state.loading.updateProfile = false;
        if (state.selectedPatient.patient) {
          state.selectedPatient.patient = action.payload.patient;
        }
        // Update in patients list if present
        const patientIndex = state.patients.data.findIndex(
          p => p._id === action.payload.patient._id
        );
        if (patientIndex !== -1) {
          state.patients.data[patientIndex] = action.payload.patient;
        }
      })
      .addCase(updatePatientProfileAsync.rejected, (state, action) => {
        state.loading.updateProfile = false;
        state.error.updateProfile = action.payload || "Failed to update patient profile";
      })

      // Create prescription
      .addCase(createPrescriptionAsync.pending, (state) => {
        state.loading.createPrescription = true;
        state.error.createPrescription = null;
      })
      .addCase(createPrescriptionAsync.fulfilled, (state, action) => {
        state.loading.createPrescription = false;
        state.prescriptions.unshift(action.payload.prescription);
        if (state.selectedPatient.patient) {
          state.selectedPatient.prescriptions.unshift(action.payload.prescription);
        }
      })
      .addCase(createPrescriptionAsync.rejected, (state, action) => {
        state.loading.createPrescription = false;
        state.error.createPrescription = action.payload || "Failed to create prescription";
      })

      // Fetch prescriptions
      .addCase(fetchPrescriptions.pending, (state) => {
        state.loading.prescriptions = true;
        state.error.prescriptions = null;
      })
      .addCase(fetchPrescriptions.fulfilled, (state, action) => {
        state.loading.prescriptions = false;
        state.prescriptions = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPrescriptions.rejected, (state, action) => {
        state.loading.prescriptions = false;
        state.error.prescriptions = action.payload || "Failed to fetch prescriptions";
      })

      // Update prescription
      .addCase(updatePrescriptionAsync.pending, (state) => {
        state.loading.updatePrescription = true;
        state.error.updatePrescription = null;
      })
      .addCase(updatePrescriptionAsync.fulfilled, (state, action) => {
        state.loading.updatePrescription = false;
        const updatedPrescription = action.payload.prescription;
        
        // Update in prescriptions list
        const prescriptionIndex = state.prescriptions.findIndex(
          p => p._id === updatedPrescription._id
        );
        if (prescriptionIndex !== -1) {
          state.prescriptions[prescriptionIndex] = updatedPrescription;
        }
        
        // Update in selected patient prescriptions
        const selectedPatientPrescriptionIndex = state.selectedPatient.prescriptions.findIndex(
          p => p._id === updatedPrescription._id
        );
        if (selectedPatientPrescriptionIndex !== -1) {
          state.selectedPatient.prescriptions[selectedPatientPrescriptionIndex] = updatedPrescription;
        }
      })
      .addCase(updatePrescriptionAsync.rejected, (state, action) => {
        state.loading.updatePrescription = false;
        state.error.updatePrescription = action.payload || "Failed to update prescription";
      })

      // Delete prescription
      .addCase(deletePrescriptionAsync.pending, (state) => {
        state.loading.deletePrescription = true;
        state.error.deletePrescription = null;
      })
      .addCase(deletePrescriptionAsync.fulfilled, (state, action) => {
        state.loading.deletePrescription = false;
        const prescriptionId = action.payload.prescriptionId;
        
        // Remove from prescriptions list
        state.prescriptions = state.prescriptions.filter(
          p => p._id !== prescriptionId
        );
        
        // Remove from selected patient prescriptions
        state.selectedPatient.prescriptions = state.selectedPatient.prescriptions.filter(
          p => p._id !== prescriptionId
        );
      })
      .addCase(deletePrescriptionAsync.rejected, (state, action) => {
        state.loading.deletePrescription = false;
        state.error.deletePrescription = action.payload || "Failed to delete prescription";
      });
  },
});

export const { 
  setSearchTerm, 
  clearErrors, 
  clearSelectedPatient, 
  resetDoctorPatients
} = doctorPatientSlice.actions;

export default doctorPatientSlice.reducer;