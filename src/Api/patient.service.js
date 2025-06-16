import API from "./api";

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