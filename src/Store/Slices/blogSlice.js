import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { uploadImage, createBlogPost } from "../../Api/blog.service";

export const createBlog = createAsyncThunk(
  "blog/createBlog",
  async (blogData, { rejectWithValue }) => {
    try {
      let imageUrl = null;

      // Upload image if exists
      if (blogData.imageFile) {
        imageUrl = await uploadImage(
          blogData.imageFile,
          blogData.onUploadProgress
        );
      }

      // Create blog post
      const response = await createBlogPost({
        title: blogData.title,
        content: blogData.content,
        image: imageUrl,
        author: {
          id: blogData.authorId,
          role: blogData.authorRole,
        },
      });

      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {
    resetBlogState: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBlog.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetBlogState } = blogSlice.actions;
export default blogSlice.reducer;
