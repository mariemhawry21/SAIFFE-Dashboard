import API from "./api";

export const uploadImage = async (imageFile, onUploadProgress) => {
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await API.post("api/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
    return response.data.data.imageUrl;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Image upload failed");
  }
};

export const createBlogPost = async (blogData) => {
  try {
    const response = await API.post("/blog", blogData);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Blog creation failed");
  }
};
