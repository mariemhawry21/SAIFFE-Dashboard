import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Divider,
  IconButton,
  Tooltip,
  useTheme,
  Chip,
  Avatar,
  Grid,
} from "@mui/material";
import {
  ArrowLeft,
  User,
  FileText,
  Calendar,
  Edit,
  Plus,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  Activity,
  ClipboardList,
} from "lucide-react";
import {
  fetchPatientDetails,
  clearSelectedPatient,
  clearErrors,
} from "../../Store/Slices/DoctorPatients";
import { toast } from "react-toastify";

// Components
import PatientOverview from "../../Components/Doctor/Patients/PatientOverview";
import PatientPrescriptions from "../../Components/Doctor/Patients/PatientPrescriptions";
import PatientAppointments from "../../Components/Doctor/Patients/PatientAppointments";
import EditPatientDialog from "../../Components/Doctor/Patients/EditPatientDialog";
import CreatePrescriptionDialog from "../../Components/Doctor/Patients/CreatePrescriptionDialog";

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`patient-tabpanel-${index}`}
    aria-labelledby={`patient-tab-${index}`}
    {...other}
  >
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const PatientDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { patientId } = useParams();

  const [tabValue, setTabValue] = useState(0);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [prescriptionDialogOpen, setPrescriptionDialogOpen] = useState(false);

  const {
    selectedPatient: { patient, appointments, prescriptions },
    loading,
    error,
  } = useSelector((state) => state.doctorPatients);

  useEffect(() => {
    if (patientId) {
      dispatch(fetchPatientDetails(patientId));
    }

    return () => {
      dispatch(clearSelectedPatient());
    };
  }, [dispatch, patientId]);

  useEffect(() => {
    if (error.patientDetails) {
      toast.error(error.patientDetails);
    }
  }, [error.patientDetails]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEditPatient = () => {
    setEditDialogOpen(true);
  };

  const handleCreatePrescription = () => {
    setPrescriptionDialogOpen(true);
  };

  const handleRetry = () => {
    dispatch(clearErrors());
    dispatch(fetchPatientDetails(patientId));
  };

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (loading.patientDetails) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 3 }}>
        <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            Loading patient details...
          </Typography>
        </Paper>
      </Box>
    );
  }

  if (error.patientDetails) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 3 }}>
        <Paper elevation={1} sx={{ p: 4 }}>
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Retry
              </Button>
            }
          >
            {error.patientDetails}
          </Alert>
        </Paper>
      </Box>
    );
  }

  if (!patient) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 3 }}>
        <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            Patient not found
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/doctor/patients")}
            sx={{ mt: 2 }}
          >
            Back to Patients
          </Button>
        </Paper>
      </Box>
    );
  }

  const hasChronicDiseases = patient.patient_profile?.chronic_diseases?.length > 0;
  const hasAllergies = patient.patient_profile?.allergies?.length > 0;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 3 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                onClick={() => navigate("/doctor/patients")}
                sx={{ 
                  bgcolor: theme.palette.grey[100],
                  '&:hover': { bgcolor: theme.palette.grey[200] }
                }}
              >
                <ArrowLeft size={20} />
              </IconButton>
              <Typography variant="h4" fontWeight="bold" color="primary.main">
                Patient Details
              </Typography>
            </Box>

            <Box display="flex" gap={2}>
              <Button
                variant="outlined"
                startIcon={<Edit size={18} />}
                onClick={handleEditPatient}
              >
                Edit Patient
              </Button>
              <Button
                variant="contained"
                startIcon={<Plus size={18} />}
                onClick={handleCreatePrescription}
              >
                New Prescription
              </Button>
            </Box>
          </Box>

          {/* Patient Header Info */}
          <Card variant="outlined" sx={{ bgcolor: theme.palette.grey[50] }}>
            <CardContent>
              <Grid container spacing={3} alignItems="center">
                <Grid item>
                  <Avatar
                    src={patient.avatar}
                    sx={{
                      width: 80,
                      height: 80,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '1.5rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {getInitials(patient.first_name, patient.last_name)}
                  </Avatar>
                </Grid>

                <Grid item xs>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {patient.first_name} {patient.last_name}
                  </Typography>
                  
                  <Box display="flex" flexWrap="wrap" gap={2} mb={2}>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <User size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="textSecondary">
                        ID: {patient._id?.slice(-8)}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Calendar size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="textSecondary">
Age: {calculateAge(patient.patient_profile?.date_of_birth)} years
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Mail size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="textSecondary">
                        {patient.email}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <Phone size={16} color={theme.palette.text.secondary} />
                      <Typography variant="body2" color="textSecondary">
                        {patient.phone || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>

                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip
                      label={patient.gender || 'Not specified'}
                      variant="outlined"
                      size="small"
                    />
                    {hasChronicDiseases && (
                      <Chip
                        label="Chronic Diseases"
                        color="warning"
                        variant="outlined"
                        size="small"
                        icon={<Heart size={12} />}
                      />
                    )}
                    {hasAllergies && (
                      <Chip
                        label="Allergies"
                        color="error"
                        variant="outlined"
                        size="small"
                        icon={<AlertTriangle size={12} />}
                      />
                    )}
                  </Box>
                </Grid>

                <Grid item>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                      {prescriptions?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Prescriptions
                    </Typography>
                  </Box>
                </Grid>

                <Grid item>
                  <Box textAlign="center">
                    <Typography variant="h4" fontWeight="bold" color="secondary.main">
                      {appointments?.length || 0}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Appointments
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </CardContent>
      </Paper>

      {/* Tabs */}
      <Paper elevation={1}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="patient details tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Overview" icon={<User size={18} />} iconPosition="start" />
            <Tab label="Prescriptions" icon={<ClipboardList size={18} />} iconPosition="start" />
            <Tab label="Appointments" icon={<Calendar size={18} />} iconPosition="start" />
          </Tabs>
        </Box>

    <TabPanel value={tabValue} index={0}>
          <PatientOverview patient={patient} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <PatientPrescriptions
            prescriptions={prescriptions}
            patientId={patient._id}
            onCreateNew={handleCreatePrescription}
          />
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <PatientAppointments
            appointments={appointments}
            patientId={patient._id}
          />
        </TabPanel>
      </Paper>

      {/* Dialogs */}
      <EditPatientDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        patient={patient}
      />

      <CreatePrescriptionDialog
        open={prescriptionDialogOpen}
        onClose={() => setPrescriptionDialogOpen(false)}
        patientId={patient._id}
        patientName={`${patient.first_name} ${patient.last_name}`}
      />
    </Box>
  );
};

export default PatientDetails;
