import React, { useState, useEffect } from "react";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import { X as Close, Heart, AlertTriangle, FileText } from "lucide-react";
import { updatePatientProfileAsync, clearErrors, fetchPatientDetails } from "../../../Store/Slices/DoctorPatients";
import { toast } from "react-toastify";

const EditPatientDialog = ({ open, onClose, patient }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.doctorPatients);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    birth_date: "",
    patient_profile: {
      address: "",
      blood_type: "",
      height: "",
      weight: "",
      national_id: "",
      insurance_provider: "",
      insurance_number: "",
      chronic_diseases: [],
      allergies: [],
      current_medications: [],
      emergency_contact: {
        name: "",
        phone: "",
        relationship: "",
      },
      notes: "",
    },
  });

  const [newChronicDisease, setNewChronicDisease] = useState("");
  const [newAllergy, setNewAllergy] = useState("");
  const [newMedication, setNewMedication] = useState("");

  // دالة مساعدة لاستخراج تاريخ الميلاد من مصادر متعددة
  const extractBirthDate = (patient) => {
    const possibleDates = [
      patient.birth_date,
      patient.patient_profile?.birth_date,
      patient.patient_profile?.date_of_birth,
      patient.date_of_birth
    ];
    
    for (let date of possibleDates) {
      if (date) {
        // تنسيق التاريخ للـ input field
        return date.includes('T') ? date.split('T')[0] : date;
      }
    }
    return "";
  };

  // دالة مساعدة لاستخراج الجنس من مصادر متعددة
  const extractGender = (patient) => {
    return patient.gender || patient.patient_profile?.gender || "";
  };

  useEffect(() => {
    if (patient) {
      const birthDate = extractBirthDate(patient);
      const gender = extractGender(patient);
      
      setFormData({
        first_name: patient.first_name || "",
        last_name: patient.last_name || "",
        email: patient.email || "",
        phone: patient.phone || "",
        gender: gender,
        birth_date: birthDate,
        patient_profile: {
          address: patient.patient_profile?.address || "",
          blood_type: patient.patient_profile?.blood_type || "",
          height: patient.patient_profile?.height || "",
          weight: patient.patient_profile?.weight || "",
          national_id: patient.patient_profile?.national_id || "",
          insurance_provider: patient.patient_profile?.insurance_provider || "",
          insurance_number: patient.patient_profile?.insurance_number || "",
          chronic_diseases: patient.patient_profile?.chronic_diseases || [],
          allergies: patient.patient_profile?.allergies || [],
          current_medications: patient.patient_profile?.current_medications || [],
          emergency_contact: {
            name: patient.patient_profile?.emergency_contact?.name || "",
            phone: patient.patient_profile?.emergency_contact?.phone || "",
            relationship: patient.patient_profile?.emergency_contact?.relationship || "",
          },
          notes: patient.patient_profile?.notes || "",
        },
      });
    }
  }, [patient]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      if (parent === 'emergency_contact') {
        setFormData(prev => ({
          ...prev,
          patient_profile: {
            ...prev.patient_profile,
            emergency_contact: {
              ...prev.patient_profile.emergency_contact,
              [child]: value,
            },
          },
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          patient_profile: {
            ...prev.patient_profile,
            [child]: value,
          },
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addChronicDisease = () => {
    if (newChronicDisease.trim() && !formData.patient_profile.chronic_diseases.includes(newChronicDisease.trim())) {
      setFormData(prev => ({
        ...prev,
        patient_profile: {
          ...prev.patient_profile,
          chronic_diseases: [...prev.patient_profile.chronic_diseases, newChronicDisease.trim()],
        },
      }));
      setNewChronicDisease("");
    }
  };

  const removeChronicDisease = (diseaseToRemove) => {
    setFormData(prev => ({
      ...prev,
      patient_profile: {
        ...prev.patient_profile,
        chronic_diseases: prev.patient_profile.chronic_diseases.filter(disease => disease !== diseaseToRemove),
      },
    }));
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.patient_profile.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        patient_profile: {
          ...prev.patient_profile,
          allergies: [...prev.patient_profile.allergies, newAllergy.trim()],
        },
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergyToRemove) => {
    setFormData(prev => ({
      ...prev,
      patient_profile: {
        ...prev.patient_profile,
        allergies: prev.patient_profile.allergies.filter(allergy => allergy !== allergyToRemove),
      },
    }));
  };

  const addMedication = () => {
    if (newMedication.trim() && !formData.patient_profile.current_medications.includes(newMedication.trim())) {
      setFormData(prev => ({
        ...prev,
        patient_profile: {
          ...prev.patient_profile,
          current_medications: [...prev.patient_profile.current_medications, newMedication.trim()],
        },
      }));
      setNewMedication("");
    }
  };

  const removeMedication = (medicationToRemove) => {
    setFormData(prev => ({
      ...prev,
      patient_profile: {
        ...prev.patient_profile,
        current_medications: prev.patient_profile.current_medications.filter(medication => medication !== medicationToRemove),
      },
    }));
  };

  const handleSubmit = async () => {
    try {
      // التأكد من وجود البيانات الأساسية
      if (!formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()) {
        toast.error("Please fill in all required fields (First Name, Last Name, Email)");
        return;
      }

      // تحضير البيانات للإرسال مع توحيد جميع الحقول
      const submitData = {
        ...formData,
        // حفظ في المستوى الأعلى للمريض
        birth_date: formData.birth_date,
        date_of_birth: formData.birth_date, // نسخة احتياطية
        gender: formData.gender,
        patient_profile: {
          ...formData.patient_profile,
          // حفظ في patient_profile أيضاً لضمان التوافق
          birth_date: formData.birth_date,
          date_of_birth: formData.birth_date,
          gender: formData.gender,
        }
      };

      console.log("Submitting data:", submitData); // للتشخيص

      const result = await dispatch(updatePatientProfileAsync({
        patientId: patient._id,
        updateData: submitData,
      }));

      if (result.type === 'doctorPatients/updatePatientProfile/fulfilled') {
        toast.success("Patient profile updated successfully");
        
        // إعادة تحميل بيانات المريض لضمان التحديث
        await dispatch(fetchPatientDetails(patient._id));
        
        onClose();
      } else if (result.type === 'doctorPatients/updatePatientProfile/rejected') {
        toast.error(result.payload || "Failed to update patient profile");
      }
    } catch (error) {
      console.error("Error updating patient:", error);
      toast.error("Failed to update patient profile");
    }
  };

  const handleClose = () => {
    dispatch(clearErrors());
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6">Edit Patient Information</Typography>
            {patient && (
              <Typography variant="body2" color="textSecondary">
                - {patient.first_name} {patient.last_name}
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleClose} size="small">
            <Close size={20} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {error.updateProfile && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.updateProfile}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.first_name}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              required
              error={!formData.first_name.trim()}
              helperText={!formData.first_name.trim() ? "First name is required" : ""}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.last_name}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              required
              error={!formData.last_name.trim()}
              helperText={!formData.last_name.trim() ? "Last name is required" : ""}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              error={!formData.email.trim()}
              helperText={!formData.email.trim() ? "Email is required" : ""}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                label="Gender"
              >
                <MenuItem value="">
                  <em>Select Gender</em>
                </MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Birth Date"
              type="date"
              value={formData.birth_date}
              onChange={(e) => handleInputChange('birth_date', e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{
                max: new Date().toISOString().split('T')[0] // منع اختيار تاريخ مستقبلي
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Patient Profile
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              value={formData.patient_profile.address}
              onChange={(e) => handleInputChange('patient_profile.address', e.target.value)}
              multiline
              rows={2}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="National ID"
              value={formData.patient_profile.national_id}
              onChange={(e) => handleInputChange('patient_profile.national_id', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Blood Type</InputLabel>
              <Select
                value={formData.patient_profile.blood_type}
                onChange={(e) => handleInputChange('patient_profile.blood_type', e.target.value)}
                label="Blood Type"
              >
                <MenuItem value="">
                  <em>Select Blood Type</em>
                </MenuItem>
                <MenuItem value="A+">A+</MenuItem>
                <MenuItem value="A-">A-</MenuItem>
                <MenuItem value="B+">B+</MenuItem>
                <MenuItem value="B-">B-</MenuItem>
                <MenuItem value="AB+">AB+</MenuItem>
                <MenuItem value="AB-">AB-</MenuItem>
                <MenuItem value="O+">O+</MenuItem>
                <MenuItem value="O-">O-</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Height (cm)"
              type="number"
              value={formData.patient_profile.height}
              onChange={(e) => handleInputChange('patient_profile.height', e.target.value)}
              inputProps={{ min: 0, max: 300 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Weight (kg)"
              type="number"
              value={formData.patient_profile.weight}
              onChange={(e) => handleInputChange('patient_profile.weight', e.target.value)}
              inputProps={{ min: 0, max: 500 }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Insurance Provider"
              value={formData.patient_profile.insurance_provider}
              onChange={(e) => handleInputChange('patient_profile.insurance_provider', e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Insurance Number"
              value={formData.patient_profile.insurance_number}
              onChange={(e) => handleInputChange('patient_profile.insurance_number', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Chronic Diseases
            </Typography>
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              {formData.patient_profile.chronic_diseases.map((disease, index) => (
                <Chip
                  key={index}
                  label={disease}
                  onDelete={() => removeChronicDisease(disease)}
                  icon={<Heart size={16} />}
                  color="warning"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                label="Add Chronic Disease"
                value={newChronicDisease}
                onChange={(e) => setNewChronicDisease(e.target.value)}
                size="small"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addChronicDisease();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={addChronicDisease}
                disabled={!newChronicDisease.trim()}
              >
                Add
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Allergies
            </Typography>
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              {formData.patient_profile.allergies.map((allergy, index) => (
                <Chip
                  key={index}
                  label={allergy}
                  onDelete={() => removeAllergy(allergy)}
                  icon={<AlertTriangle size={16} />}
                  color="error"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                label="Add Allergy"
                value={newAllergy}
                onChange={(e) => setNewAllergy(e.target.value)}
                size="small"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAllergy();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={addAllergy}
                disabled={!newAllergy.trim()}
              >
                Add
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" gutterBottom>
              Current Medications
            </Typography>
            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              {formData.patient_profile.current_medications.map((medication, index) => (
                <Chip
                  key={index}
                  label={medication}
                  onDelete={() => removeMedication(medication)}
                  icon={<FileText size={16} />}
                  color="info"
                  variant="outlined"
                />
              ))}
            </Box>
            <Box display="flex" gap={1}>
              <TextField
                fullWidth
                label="Add Medication"
                value={newMedication}
                onChange={(e) => setNewMedication(e.target.value)}
                size="small"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addMedication();
                  }
                }}
              />
              <Button
                variant="outlined"
                onClick={addMedication}
                disabled={!newMedication.trim()}
              >
                Add
              </Button>
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Emergency Contact
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Name"
              value={formData.patient_profile.emergency_contact.name}
              onChange={(e) => handleInputChange('emergency_contact.name', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Contact Phone"
              value={formData.patient_profile.emergency_contact.phone}
              onChange={(e) => handleInputChange('emergency_contact.phone', e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Relationship"
              value={formData.patient_profile.emergency_contact.relationship}
              onChange={(e) => handleInputChange('emergency_contact.relationship', e.target.value)}
            />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Additional Notes
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              fullWidth
              label="Notes"
              value={formData.patient_profile.notes}
              onChange={(e) => handleInputChange('patient_profile.notes', e.target.value)}
              multiline
              rows={4}
              placeholder="Enter any additional medical notes or observations..."
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading.updateProfile}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading.updateProfile || !formData.first_name.trim() || !formData.last_name.trim() || !formData.email.trim()}
          startIcon={loading.updateProfile ? <CircularProgress size={20} /> : null}
        >
          {loading.updateProfile ? "Updating..." : "Update Patient"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditPatientDialog;