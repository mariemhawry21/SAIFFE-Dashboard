import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Grid,
  Chip,
  Divider,
  Alert,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  Tooltip,
  Paper,
} from "@mui/material";
import {
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  FileText,
  Calendar,
  Clock,
  Pill,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  updatePrescriptionAsync,
  deletePrescriptionAsync,
} from "../../../Store/Slices/DoctorPatients";

const PrescriptionCard = ({ prescription, onEdit, onDelete }) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    onEdit(prescription);
    handleMenuClose();
  };

  const handleDelete = () => {
    onDelete(prescription._id);
    handleMenuClose();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "success";
      case "completed":
        return "info";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2, position: "relative" }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <FileText size={20} color={theme.palette.primary.main} />
            <Typography variant="h6" fontWeight="bold">
              Prescription #{prescription._id?.slice(-6)}
            </Typography>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={prescription.status || "Active"}
              color={getStatusColor(prescription.status)}
              size="small"
            />
            <IconButton size="small" onClick={handleMenuOpen}>
              <MoreVertical size={16} />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2} mb={2}>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Calendar size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="textSecondary">
                Date: {formatDate(prescription.createdAt)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Clock size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="textSecondary">
                Duration: {prescription.duration || "As needed"}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {prescription.diagnosis && (
          <Box mb={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Diagnosis:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {prescription.diagnosis}
            </Typography>
          </Box>
        )}

        <Box mb={2}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Medications:
          </Typography>
          {prescription.medications && prescription.medications.length > 0 ? (
            <Box display="flex" flexDirection="column" gap={1}>
              {prescription.medications.map((med, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{ p: 2, bgcolor: theme.palette.grey[50] }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Pill size={16} color={theme.palette.primary.main} />
                    <Typography variant="body2" fontWeight="bold">
                      {med.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="textSecondary">
                    Dosage: {med.dosage} | Frequency: {med.frequency}
                  </Typography>
                  {med.instructions && (
                    <Typography variant="body2" color="textSecondary" mt={0.5}>
                      Instructions: {med.instructions}
                    </Typography>
                  )}
                </Paper>
              ))}
            </Box>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No medications specified
            </Typography>
          )}
        </Box>

        {prescription.notes && (
          <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Notes:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {prescription.notes}
            </Typography>
          </Box>
        )}
      </CardContent>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>
          <Edit size={16} style={{ marginRight: 8 }} />
          Edit Prescription
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <Trash2 size={16} style={{ marginRight: 8 }} />
          Delete Prescription
        </MenuItem>
      </Menu>
    </Card>
  );
};

const EditPrescriptionDialog = ({ open, onClose, prescription, onUpdate }) => {
  const [formData, setFormData] = useState({
    diagnosis: "",
    medications: [{ name: "", dosage: "", frequency: "", instructions: "" }],
    notes: "",
    status: "active",
    duration: "",
  });

  React.useEffect(() => {
    if (prescription) {
      setFormData({
        diagnosis: prescription.diagnosis || "",
        medications: prescription.medications || [{ name: "", dosage: "", frequency: "", instructions: "" }],
        notes: prescription.notes || "",
        status: prescription.status || "active",
        duration: prescription.duration || "",
      });
    }
  }, [prescription]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMeds = [...formData.medications];
    updatedMeds[index][field] = value;
    setFormData(prev => ({ ...prev, medications: updatedMeds }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, { name: "", dosage: "", frequency: "", instructions: "" }]
    }));
  };

  const removeMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    onUpdate(prescription._id, formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Prescription</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={3} mt={1}>
          <TextField
            fullWidth
            label="Diagnosis"
            multiline
            rows={2}
            value={formData.diagnosis}
            onChange={(e) => handleInputChange("diagnosis", e.target.value)}
          />

          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle1" fontWeight="bold">
                Medications
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Plus size={16} />}
                onClick={addMedication}
              >
                Add Medication
              </Button>
            </Box>
            
            {formData.medications.map((med, index) => (
              <Card key={index} variant="outlined" sx={{ mb: 2, p: 2 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Medication Name"
                      value={med.name}
                      onChange={(e) => handleMedicationChange(index, "name", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Dosage"
                      value={med.dosage}
                      onChange={(e) => handleMedicationChange(index, "dosage", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Frequency"
                      value={med.frequency}
                      onChange={(e) => handleMedicationChange(index, "frequency", e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <TextField
                        fullWidth
                        label="Instructions"
                        value={med.instructions}
                        onChange={(e) => handleMedicationChange(index, "instructions", e.target.value)}
                      />
                      {formData.medications.length > 1 && (
                        <IconButton
                          color="error"
                          onClick={() => removeMedication(index)}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            ))}
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration"
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
                placeholder="e.g., 7 days, 2 weeks"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Status"
                value={formData.status}
                onChange={(e) => handleInputChange("status", e.target.value)}
                SelectProps={{ native: true }}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </TextField>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Additional Notes"
            multiline
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Update Prescription
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const PatientPrescriptions = ({ prescriptions, patientId, onCreateNew }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.doctorPatients);
  
  const [editDialog, setEditDialog] = useState({ open: false, prescription: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, prescriptionId: null });

  const handleEditPrescription = (prescription) => {
    setEditDialog({ open: true, prescription });
  };

  const handleUpdatePrescription = async (prescriptionId, updateData) => {
    try {
      await dispatch(updatePrescriptionAsync({ prescriptionId, updateData })).unwrap();
      toast.success("Prescription updated successfully");
      setEditDialog({ open: false, prescription: null });
    } catch (error) {
      toast.error(error || "Failed to update prescription");
    }
  };

  const handleDeletePrescription = (prescriptionId) => {
    setDeleteDialog({ open: true, prescriptionId });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deletePrescriptionAsync(deleteDialog.prescriptionId)).unwrap();
      toast.success("Prescription deleted successfully");
      setDeleteDialog({ open: false, prescriptionId: null });
    } catch (error) {
      toast.error(error || "Failed to delete prescription");
    }
  };

  if (!prescriptions || prescriptions.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <FileText size={64} color={theme.palette.text.secondary} style={{ opacity: 0.5 }} />
        <Typography variant="h6" color="textSecondary" mt={2} mb={1}>
          No Prescriptions Found
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          This patient doesn't have any prescriptions yet.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={onCreateNew}
        >
          Create First Prescription
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Prescriptions ({prescriptions.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={onCreateNew}
        >
          New Prescription
        </Button>
      </Box>

      {prescriptions.map((prescription) => (
        <PrescriptionCard
          key={prescription._id}
          prescription={prescription}
          onEdit={handleEditPrescription}
          onDelete={handleDeletePrescription}
        />
      ))}

      <EditPrescriptionDialog
        open={editDialog.open}
        onClose={() => setEditDialog({ open: false, prescription: null })}
        prescription={editDialog.prescription}
        onUpdate={handleUpdatePrescription}
      />

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, prescriptionId: null })}
      >
        <DialogTitle>Delete Prescription</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this prescription? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, prescriptionId: null })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
            disabled={loading.deletePrescription}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientPrescriptions;