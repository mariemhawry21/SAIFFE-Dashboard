import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Avatar,
  Grid,
  Divider,
  Button,
} from "@mui/material";

const PatientDetailsDialog = ({ open, onClose, patient }) => {
  if (!patient) return null;

  const {
    first_name,
    last_name,
    email,
    phone,
    avatar,
    createdAt,
    role,
    patient_profile = {},
    doctor_profile = {},
  } = patient;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Patient Details
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <Avatar src={avatar} alt={first_name} sx={{ width: 80, height: 80 }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h6">
              {first_name} {last_name}
            </Typography>
            <Typography color="textSecondary">{email}</Typography>
            <Typography color="textSecondary">{phone}</Typography>
            <Typography color="textSecondary">Role: {role}</Typography>
            <Typography color="textSecondary">
              Joined: {new Date(createdAt).toLocaleString()}
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Allergies:
            </Typography>
            <Typography>
              {patient_profile.allergies?.join(", ") || "None"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Chronic Diseases:
            </Typography>
            <Typography>
              {patient_profile.chronic_diseases?.join(", ") || "None"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Prescriptions:
            </Typography>
            <Typography>
              {patient_profile.prescriptions?.length || 0}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" fontWeight="bold">
              Appointments:
            </Typography>
            <Typography>
              {patient_profile.appointments?.length || 0}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" fontWeight="bold">
              Notifications:
            </Typography>
            <Typography>
              {patient_profile.notifications?.length || 0}
            </Typography>
          </Grid>
        </Grid>

        {doctor_profile && (
          <>
            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Doctor Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Available:
                </Typography>
                <Typography>
                  {doctor_profile.is_available ? "Yes" : "No"}
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Qualifications:
                </Typography>
                <Typography>
                  {doctor_profile.qualifications?.join(", ") || "None"}
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="bold">
                  Schedule:
                </Typography>
                <Typography>
                  {doctor_profile.schedule?.length
                    ? `${doctor_profile.schedule.length} entries`
                    : "None"}
                </Typography>
              </Grid>
            </Grid>
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PatientDetailsDialog;
