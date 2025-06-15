import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  Alert,
  LinearProgress,
  Snackbar,
} from "@mui/material";
import { CloudUpload, Close } from "@mui/icons-material";
import { createBlog } from "../../Store/Slices/blogSlice";
import { toast } from "react-toastify";
const Blog = () => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.blog);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    imageFile: null,
    previewImage: "",
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({
    title: false,
    content: false,
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setSnackbarOpen(true);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imageFile: file,
          previewImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, imageFile: null, previewImage: "" }));
  };

  const validateForm = () => {
    const newErrors = {
      title: !formData.title.trim(),
      content: !formData.content.trim(),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(
        createBlog({
          title: formData.title,
          content: formData.content,
          imageFile: formData.imageFile,
          authorId: user._id,
          authorRole: user.role.toLowerCase(),
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          },
        })
      ).unwrap();
      toast.success("Blog posted successfully");
      setFormData({
        title: "",
        content: "",
        imageFile: null,
        previewImage: "",
      });
    } catch (err) {
      console.error("Blog creation error:", err);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <motion.div
      key="blog-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box sx={{ maxWidth: "100%", p: 0 }}>
        <Paper elevation={0} sx={{ p: 0 ,mt:2}}>
          <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
            Create New Blog Post
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              error={errors.title}
              helperText={errors.title && "Title is required"}
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              label="Content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              error={errors.content}
              helperText={errors.content && "Content is required"}
              multiline
              rows={6}
              sx={{ mb: 3 }}
            />

            <Box sx={{ mb: 3 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="blog-image-upload"
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="blog-image-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<CloudUpload />}
                  fullWidth
                  disabled={status === "loading"}
                >
                  Upload Featured Image
                </Button>
              </label>

              {formData.previewImage && (
                <Box sx={{ mt: 2, position: "relative" }}>
                  <img
                    src={formData.previewImage}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      borderRadius: "4px",
                    }}
                  />
                  <IconButton
                    onClick={removeImage}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "rgba(0,0,0,0.7)",
                      },
                    }}
                    disabled={status === "loading"}
                  >
                    <Close />
                  </IconButton>
                </Box>
              )}

              {status === "loading" && formData.imageFile && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" display="block" gutterBottom>
                    Uploading: {uploadProgress}%
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              disabled={status === "loading"}
              sx={{ py: 1.5 }}
            >
              {status === "loading" ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Publish Blog"
              )}
            </Button>
          </form>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message="Image must be smaller than 5MB"
      />
    </motion.div>
  );
};

export default Blog;
