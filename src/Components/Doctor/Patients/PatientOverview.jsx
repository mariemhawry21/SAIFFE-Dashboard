import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Chip,
  useTheme,
  Paper,
} from "@mui/material";
import {
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  AlertTriangle,
  FileText,
  Shield,
  Activity,
  Users,
  Info,
  UserCheck,
  Clock,
} from "lucide-react";

const PatientOverview = ({ patient }) => {
  const theme = useTheme();

  // Utility functions for extracting data from multiple sources
  const getBirthDate = (patient) => {
    const possibleDates = [
      patient.birth_date,
      patient.patient_profile?.birth_date,
      patient.patient_profile?.date_of_birth,
      patient.date_of_birth
    ];
    
    return possibleDates.find(date => date) || null;
  };

  const getGender = (patient) => {
    return patient.gender || patient.patient_profile?.gender || null;
  };

  const getNationalId = (patient) => {
    return patient.patient_profile?.national_id || patient.national_id || null;
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return "Not specified";
    }
  };

  const getBloodTypeColor = (bloodType) => {
    const colors = {
      "A+": "success",
      "A-": "success", 
      "B+": "info",
      "B-": "info",
      "AB+": "warning",
      "AB-": "warning",
      "O+": "error",
      "O-": "error",
    };
    return colors[bloodType] || "default";
  };

  // Extract data using utility functions
  const birthDate = getBirthDate(patient);
  const gender = getGender(patient);
  const nationalId = getNationalId(patient);
  const age = calculateAge(birthDate);
  const formattedBirthDate = formatDate(birthDate);
  const profile = patient.patient_profile || {};

  // InfoCard component for consistent styling
  const InfoCard = ({ title, icon: Icon, children, color = "primary" }) => (
    <Card variant="outlined" sx={{ height: "100%" }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Box
            sx={{
              p: 1,
              borderRadius: 1,
              bgcolor: `${color}.main`,
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={20} />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );

  // InfoItem component for consistent data display
  const InfoItem = ({ icon: Icon, label, value, color }) => (
    <Box display="flex" alignItems="center" gap={2} py={1}>
      <Box color={color || theme.palette.text.secondary}>
        <Icon size={16} />
      </Box>
      <Box flex={1}>
        <Typography variant="body2" color="textSecondary" fontSize="0.75rem">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight="medium">
          {value || "Not specified"}
        </Typography>
      </Box>
    </Box>
  );

  // Medical conditions display component
  const MedicalConditions = ({ title, items, color, icon: Icon }) => (
    <Box mb={2}>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        {title}
      </Typography>
      {items?.length > 0 ? (
        <Box display="flex" flexWrap="wrap" gap={1}>
          {items.map((item, index) => (
            <Chip
              key={index}
              label={item}
              color={color}
              variant="outlined"
              size="small"
              icon={<Icon size={12} />}
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body2" color="textSecondary" fontStyle="italic">
          No {title.toLowerCase()} recorded
        </Typography>
      )}
    </Box>
  );

  return (
    <Box>
      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <InfoCard title="Personal Information" icon={User} color="primary">
            <Box display="flex" flexDirection="column" gap={1}>
              <InfoItem
                icon={User}
                label="Full Name"
                value={`${patient.first_name || ""} ${patient.last_name || ""}`.trim()}
              />
              <InfoItem
                icon={Calendar}
                label="Date of Birth"
                value={formattedBirthDate}
              />
              <InfoItem
                icon={Info}
                label="Age"
                value={age ? `${age} years old` : null}
              />
              <InfoItem
                icon={UserCheck}
                label="Gender"
                value={gender ? gender.charAt(0).toUpperCase() + gender.slice(1) : null}
              />
              <InfoItem
                icon={Shield}
                label="National ID"
                value={nationalId}
              />
            </Box>
          </InfoCard>
        </Grid>

        {/* Contact Information */}
        <Grid item xs={12} md={6}>
          <InfoCard title="Contact Information" icon={Phone} color="secondary">
            <Box display="flex" flexDirection="column" gap={1}>
              <InfoItem
                icon={Mail}
                label="Email Address"
                value={patient.email}
              />
              <InfoItem
                icon={Phone}
                label="Phone Number"
                value={patient.phone}
              />
              <InfoItem
                icon={MapPin}
                label="Address"
                value={profile.address}
              />
              <InfoItem
                icon={Users}
                label="Emergency Contact"
                value={
                  profile.emergency_contact
                    ? `${profile.emergency_contact.name} (${profile.emergency_contact.relationship})`
                    : null
                }
              />
              <InfoItem
                icon={Phone}
                label="Emergency Phone"
                value={profile.emergency_contact?.phone}
              />
            </Box>
          </InfoCard>
        </Grid>

        {/* Medical Information */}
        <Grid item xs={12} md={6}>
          <InfoCard title="Medical Information" icon={Activity} color="error">
            <Box display="flex" flexDirection="column" gap={2}>
              {/* Blood Type */}
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Blood Type
                </Typography>
                {profile.blood_type ? (
                  <Chip
                    label={profile.blood_type}
                    color={getBloodTypeColor(profile.blood_type)}
                    variant="outlined"
                    size="small"
                  />
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Not specified
                  </Typography>
                )}
              </Box>

              {/* Height & Weight */}
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Physical Measurements
                </Typography>
                <Box display="flex" gap={2} flexWrap="wrap">
                  {profile.height && (
                    <Chip
                      label={`Height: ${profile.height} cm`}
                      variant="outlined"
                      size="small"
                      color="info"
                    />
                  )}
                  {profile.weight && (
                    <Chip
                      label={`Weight: ${profile.weight} kg`}
                      variant="outlined"
                      size="small"
                      color="info"
                    />
                  )}
                  {!profile.height && !profile.weight && (
                    <Typography variant="body2" color="textSecondary">
                      Not specified
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Insurance Information */}
              <Box>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  Insurance Information
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {profile.insurance_provider || "No insurance"}
                </Typography>
                {profile.insurance_number && (
                  <Typography variant="body2" color="textSecondary">
                    Policy: {profile.insurance_number}
                  </Typography>
                )}
              </Box>
            </Box>
          </InfoCard>
        </Grid>

        {/* Health Conditions */}
        <Grid item xs={12} md={6}>
          <InfoCard title="Health Conditions" icon={Heart} color="warning">
            <Box display="flex" flexDirection="column" gap={2}>
              <MedicalConditions
                title="Chronic Diseases"
                items={profile.chronic_diseases}
                color="warning"
                icon={Heart}
              />
              <MedicalConditions
                title="Allergies"
                items={profile.allergies}
                color="error"
                icon={AlertTriangle}
              />
              <MedicalConditions
                title="Current Medications"
                items={profile.current_medications}
                color="info"
                icon={FileText}
              />
            </Box>
          </InfoCard>
        </Grid>
        {/* Additional Notes */}
        {profile.notes && (
          <Grid item xs={12}>
            <InfoCard title="Additional Notes" icon={FileText} color="secondary">
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: theme.palette.grey[50],
                  borderRadius: 2,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                  }}
                >
                  {profile.notes}
                </Typography>
              </Paper>
            </InfoCard>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default PatientOverview;