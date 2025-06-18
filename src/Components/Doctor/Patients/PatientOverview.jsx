import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  useTheme,
  Paper,
} from '@mui/material';
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  Activity,
  FileText,
  Clock,
  Info,
  UserCheck,
  Shield,
} from 'lucide-react';

const InfoCard = ({ title, icon, children, color = 'primary' }) => {
  const theme = useTheme();

  return (
    <Card variant="outlined" sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: `${color}.main`,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        {children}
      </CardContent>
    </Card>
  );
};

const InfoItem = ({ icon, label, value, color }) => {
  const theme = useTheme();

  return (
    <Box display="flex" alignItems="center" gap={2} py={1}>
      <Box color={color || theme.palette.text.secondary}>{icon}</Box>
      <Box flex={1}>
        <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {value || 'Not specified'}
        </Typography>
      </Box>
    </Box>
  );
};

const PatientOverview = ({ patient }) => {
  const theme = useTheme();

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'Not specified';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} years old`;
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      'A+': 'success',
      'A-': 'success',
      'B+': 'info',
      'B-': 'info',
      'AB+': 'warning',
      'AB-': 'warning',
      'O+': 'error',
      'O-': 'error',
    };
    return colors[bloodType] || 'default';
  };

  const profile = patient.patient_profile || {};

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <InfoCard title="Personal Information" icon={<User size={20} />} color="primary">
            <Box display="flex" flexDirection="column" gap={1}>
              <InfoItem icon={<User size={16} />} label="Full Name" value={`${patient.first_name} ${patient.last_name}`} />
              <InfoItem icon={<Calendar size={16} />} label="Date of Birth" value={formatDate(patient.birth_date)} />
              <InfoItem icon={<Info size={16} />} label="Age" value={calculateAge(patient.birth_date)} />
              <InfoItem icon={<UserCheck size={16} />} label="Gender" value={patient.gender} />
              <InfoItem icon={<Shield size={16} />} label="National ID" value={profile.national_id} />
            </Box>
          </InfoCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoCard title="Contact Information" icon={<Phone size={20} />} color="secondary">
            <Box display="flex" flexDirection="column" gap={1}>
              <InfoItem icon={<Mail size={16} />} label="Email Address" value={patient.email} />
              <InfoItem icon={<Phone size={16} />} label="Phone Number" value={patient.phone} />
              <InfoItem icon={<MapPin size={16} />} label="Address" value={profile.address} />
              <InfoItem
                icon={<Info size={16} />}
                label="Emergency Contact"
                value={
                  profile.emergency_contact
                    ? `${profile.emergency_contact.name} (${profile.emergency_contact.relationship}) - ${profile.emergency_contact.phone}`
                    : 'Not specified'
                }
              />
              <InfoItem icon={<Phone size={16} />} label="Emergency Phone" value={profile.emergency_phone} />
            </Box>
          </InfoCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoCard title="Medical Information" icon={<Activity size={20} />} color="error">
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Blood Type
                </Typography>
                {profile.blood_type ? (
                  <Chip label={profile.blood_type} color={getBloodTypeColor(profile.blood_type)} variant="outlined" size="small" />
                ) : (
                  <Typography variant="body2" color="textSecondary">Not specified</Typography>
                )}
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Height & Weight
                </Typography>
                <Box display="flex" gap={2}>
                  <Typography variant="body1">{profile.height ? `${profile.height} cm` : 'N/A'}</Typography>
                  <Typography variant="body1">{profile.weight ? `${profile.weight} kg` : 'N/A'}</Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Insurance Information
                </Typography>
                <Typography variant="body1">{profile.insurance_provider || 'No insurance'}</Typography>
                {profile.insurance_number && (
                  <Typography variant="body2" color="textSecondary">
                    Policy: {profile.insurance_number}
                  </Typography>
                )}
              </Box>
            </Box>
          </InfoCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <InfoCard title="Health Conditions" icon={<Heart size={20} />} color="warning">
            <Box display="flex" flexDirection="column" gap={2}>
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Chronic Diseases
                </Typography>
                {profile.chronic_diseases?.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {profile.chronic_diseases.map((disease, index) => (
                      <Chip key={index} label={disease} color="warning" variant="outlined" size="small" icon={<Heart size={12} />} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">No chronic diseases recorded</Typography>
                )}
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Allergies
                </Typography>
                {profile.allergies?.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {profile.allergies.map((allergy, index) => (
                      <Chip key={index} label={allergy} color="error" variant="outlined" size="small" icon={<AlertTriangle size={12} />} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">No allergies recorded</Typography>
                )}
              </Box>

              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Current Medications
                </Typography>
                {profile.current_medications?.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {profile.current_medications.map((medication, index) => (
                      <Chip key={index} label={medication} color="info" variant="outlined" size="small" icon={<FileText size={12} />} />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="textSecondary">No current medications</Typography>
                )}
              </Box>
            </Box>
          </InfoCard>
        </Grid>

        <Grid item xs={12}>
          <InfoCard title="Account Information" icon={<Clock size={20} />} color="info">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem icon={<Calendar size={16} />} label="Patient Since" value={formatDate(patient.createdAt)} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem icon={<Clock size={16} />} label="Last Updated" value={formatDate(patient.updatedAt)} />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem icon={<User size={16} />} label="Account Status" value="Active" />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <InfoItem icon={<Info size={16} />} label="Patient ID" value={patient._id?.slice(-8)} />
              </Grid>
            </Grid>
          </InfoCard>
        </Grid>

        {profile.notes && (
          <Grid item xs={12}>
            <InfoCard title="Additional Notes" icon={<FileText size={20} />} color="secondary">
              <Paper variant="outlined" sx={{ p: 2, bgcolor: theme.palette.grey[50] }}>
                <Typography variant="body1" style={{ whiteSpace: 'pre-wrap' }}>{profile.notes}</Typography>
              </Paper>
            </InfoCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PatientOverview;
