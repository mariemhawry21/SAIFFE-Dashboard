import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Divider,
  IconButton,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import {
  X,
  FileText,
  Plus,
  Trash2,
  Calendar,
  Pill,
  Clock,
  AlertCircle,
} from "lucide-react";
import { createPrescriptionAsync, clearErrors } from "../../../Store/Slices/DoctorPatients";
import { toast } from "react-toastify";

const CreatePrescriptionDialog = ({ open, onClose, patientId, patientName }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.doctorPatients);

  const [formData, setFormData] = useState({
    patient_id: patientId,
    diagnosis: "",
    notes: "",
    medications: [
      {
        name: "",
        dosage: "",
        frequency: "",
        duration: "",
        instructions: "",
      },
    ],
    follow_up_date: "",
    priority: "normal",
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setFormData(prev => ({
      ...prev,
      medications: updatedMedications,
    }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
    }));
  };

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      const updatedMedications = formData.medications.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        medications: updatedMedications,
      }));
    }
  };

  const validateForm = () => {
    if (!formData.diagnosis.trim()) {
      toast.error("Diagnosis is required");
      return false;
    }

    const hasValidMedication = formData.medications.some(med =>
      med.name.trim() && med.dosage.trim() && med.frequency.trim()
    );

    if (!hasValidMedication) {
      toast.error("At least one medication with name, dosage, and frequency is required");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const prescriptionData = {
        ...formData,
        medications: formData.medications.filter(med =>
          med.name.trim() && med.dosage.trim() && med.frequency.trim()
        ),
      };

      const result = await dispatch(createPrescriptionAsync(prescriptionData));

      if (result.type === 'doctorPatients/createPrescription/fulfilled') {
        toast.success("Prescription created successfully");
        onClose();
        resetForm();
      }
    } catch (error) {
      toast.error("Failed to create prescription");
    }
  };

  const resetForm = () => {
    setFormData({
      patient_id: patientId,
      diagnosis: "",
      notes: "",
      medications: [
        {
          name: "",
          dosage: "",
          frequency: "",
          duration: "",
          instructions: "",
        },
      ],
      follow_up_date: "",
      priority: "normal",
    });
  };

  const handleClose = () => {
    dispatch(clearErrors());
    resetForm();
    onClose();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'error';
      case 'high': return 'warning';
      case 'normal': return 'primary';
      case 'low': return 'info';
      default: return 'primary';
    }
  };

  const frequencyOptions = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Before meals",
    "After meals",
    "At bedtime",
  ];

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <FileText size={24} />
            <Box>
              <Typography variant="h6">Create New Prescription</Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Patient: {patientName}
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <X size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error.createPrescription && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.createPrescription}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Prescription Details
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="Diagnosis"
              value={formData.diagnosis}
              onChange={(e) => handleInputChange('diagnosis', e.target.value)}
              required
              multiline
              rows={2}
              placeholder="Enter patient diagnosis..."
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                label="Priority"
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="normal">Normal</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="urgent">Urgent</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Follow-up Date"
              type="date"
              value={formData.follow_up_date}
              onChange={(e) => handleInputChange('follow_up_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="body2">Priority:</Typography>
              <Chip
                label={formData.priority.toUpperCase()}
                color={getPriorityColor(formData.priority)}
                size="small"
                icon={<AlertCircle size={14} />}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="h6">
                Medications
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Plus size={18} />}
                onClick={addMedication}
                size="small"
              >
                Add Medication
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          {formData.medications.map((medication, index) => (
            <Grid item xs={12} key={index}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Pill size={20} />
                      <Typography variant="subtitle1" fontWeight="bold">
                        Medication {index + 1}
                      </Typography>
                    </Box>
                    {formData.medications.length > 1 && (
                      <IconButton
                        onClick={() => removeMedication(index)}
                        size="small"
                        color="error"
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    )}
                  </Box>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Medication Name"
                        value={medication.name}
                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        required
                        placeholder="e.g., Paracetamol"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Dosage"
                        value={medication.dosage}
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        required
                        placeholder="e.g., 500mg"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth required>
                        <InputLabel>Frequency</InputLabel>
                        <Select
                          value={medication.frequency}
                          onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                          label="Frequency"
                        >
                          {frequencyOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Duration"
                        value={medication.duration}
                        onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                        placeholder="e.g., 7 days, 2 weeks"
                      />
                    </Grid>

                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Special Instructions"
                        value={medication.instructions}
                        onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                        multiline
                        rows={2}
                        placeholder="e.g., Take with food, avoid alcohol..."
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Notes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              fullWidth
              label="Notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              multiline
              rows={3}
              placeholder="Any additional notes or recommendations..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading.createPrescription}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading.createPrescription}
          startIcon={loading.createPrescription ? <CircularProgress size={20} /> : <FileText size={18} />}
        >
          {loading.createPrescription ? "Creating..." : "Create Prescription"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreatePrescriptionDialog;
