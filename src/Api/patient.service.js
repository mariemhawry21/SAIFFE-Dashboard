import API from "./api";

// Get all patients for admin
export const getAllPatients = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await API.get("/admin/patients", {
      params: {
        page,
        limit,
        search,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch patients");
  }
};

// Get all patients for the logged-in doctor
export const getDoctorPatients = async (page = 1, limit = 10, search = "") => {
  try {
    const response = await API.get("/doctor/my-patients", {
      params: {
        page,
        limit,
        search,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch patients");
  }
};

// Get specific patient details with appointments and prescriptions
export const getPatientDetails = async (patientId) => {
  try {
    const response = await API.get(`/doctor/my-patients/${patientId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch patient details");
  }
};

// Update patient profile
export const updatePatientProfile = async (patientId, updateData) => {
  try {
    const response = await API.put(`/doctor/my-patients/${patientId}/profile`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update patient profile");
  }
};

// Create prescription for a patient
export const createPrescription = async (prescriptionData) => {
  try {
    const response = await API.post("/doctor/prescriptions", prescriptionData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create prescription");
  }
};

// Get doctor's prescriptions
export const getDoctorPrescriptions = async (patientId = null) => {
  try {
    const params = patientId ? { patientId } : {};
    const response = await API.get("/doctor/prescriptions", { params });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch prescriptions");
  }
};

// Update prescription
export const updatePrescription = async (prescriptionId, updateData) => {
  try {
    const response = await API.patch(`/doctor/prescriptions/${prescriptionId}`, updateData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update prescription");
  }
};

// Delete prescription
export const deletePrescription = async (prescriptionId) => {
  try {
    const response = await API.delete(`/doctor/prescriptions/${prescriptionId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete prescription");
  }
};
