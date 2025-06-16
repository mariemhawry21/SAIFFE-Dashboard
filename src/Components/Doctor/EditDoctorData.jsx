import React, { useRef, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";
const EditDoctorData = () => {
  const [formData, setFormData] = useState({
    institution: "",
    licenseNumber: "",
    experience: "",
    consultationFee: "",
    biography: "",
  });
  const [avatarPreview, setAvatarPreview] = useState(formData.avatar);
  const fileInputRef = useRef(null);
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Update form data (you might want to handle file upload here)
      setFormData({
        ...formData,
        avatar: file, // Store the file object or upload to server
      });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid
          item
          size={12}
          display="flex"
          justifyContent="flex-start"
          sx={{ position: "relative" }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              cursor: "pointer",
            }}
            src={avatarPreview}
            onClick={triggerFileInput}
          />

          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Institution"
            name="institution"
            type="text"
            value={formData.institution}
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="License Number"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Experience (years)"
            name="experience"
            type="number"
            value={formData.experience}
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Consultation Fee"
            name="consultationFee"
            type="number"
            value={formData.consultationFee}
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Biography"
            name="biography"
            multiline
            rows={4}
            value={formData.biography}
            onChange={handleChange}
          />
        </Grid>
        <Grid item size={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            Save Changes
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default EditDoctorData;
