import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  useTheme,
  Paper,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Calendar,
  Clock,
  MapPin,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  Eye,
  Edit,
} from "lucide-react";

const AppointmentCard = ({ appointment }) => {
  const theme = useTheme();

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    try {
      // Handle different time formats
      if (time.includes(':')) {
        const [hours, minutes] = time.split(':');
        const date = new Date();
        date.setHours(parseInt(hours), parseInt(minutes));
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      } else {
        return new Date(`2000-01-01 ${time}`).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
      }
    } catch (error) {
      return time; // Return original if parsing fails
    }
  };

  const isPastAppointment = (date, time) => {
    if (!date || !time) return false;
    try {
      const appointmentDateTime = new Date(`${date}T${time}`);
      return appointmentDateTime < new Date();
    } catch (error) {
      return false;
    }
  };

  const isUpcoming = (date, time) => {
    if (!date || !time) return false;
    try {
      const appointmentDateTime = new Date(`${date}T${time}`);
      const now = new Date();
      const diffInHours = (appointmentDateTime - now) / (1000 * 60 * 60);
      return diffInHours > 0 && diffInHours <= 24;
    } catch (error) {
      return false;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      case "rescheduled":
        return "info";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
      case "completed":
        return <CheckCircle size={16} />;
      case "pending":
        return <AlertCircle size={16} />;
      case "cancelled":
        return <XCircle size={16} />;
      default:
        return <Calendar size={16} />;
    }
  };

  return (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 2,
        border: isUpcoming(appointment.date, appointment.time) 
          ? `2px solid ${theme.palette.warning.main}` 
          : undefined,
        bgcolor: isPastAppointment(appointment.date, appointment.time)
          ? theme.palette.grey[50]
          : "background.paper"
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 40,
                height: 40,
              }}
            >
              <Calendar size={20} />
            </Avatar>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Appointment #{appointment._id?.slice(-6)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {appointment.type || "General Consultation"}
              </Typography>
            </Box>
          </Box>
          
          <Box display="flex" alignItems="center" gap={1}>
            {isUpcoming(appointment.date, appointment.time) && (
              <Chip
                label="Upcoming"
                color="warning"
                size="small"
                variant="outlined"
              />
            )}
            <Chip
              label={appointment.status || "Pending"}
              color={getStatusColor(appointment.status)}
              size="small"
              icon={getStatusIcon(appointment.status)}
            />
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Calendar size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="textSecondary">
                Date
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {formatDate(appointment.date)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Clock size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="textSecondary">
                Time
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {formatTime(appointment.time)}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <MapPin size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="textSecondary">
                Location
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {appointment.location || "Clinic"}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Box display="flex" alignItems="center" gap={1} mb={1}>
              <Phone size={16} color={theme.palette.text.secondary} />
              <Typography variant="body2" color="textSecondary">
                Duration
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">
              {appointment.duration || "30 min"}
            </Typography>
          </Grid>
        </Grid>

        {appointment.reason && (
          <Box mt={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Reason for Visit:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {appointment.reason}
            </Typography>
          </Box>
        )}

        {appointment.notes && (
          <Box mt={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Notes:
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {appointment.notes}
            </Typography>
          </Box>
        )}

        {appointment.symptoms && appointment.symptoms.length > 0 && (
          <Box mt={2}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Reported Symptoms:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              {appointment.symptoms.map((symptom, index) => (
                <Chip
                  key={index}
                  label={symptom}
                  size="small"
                  variant="outlined"
                  color="info"
                />
              ))}
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="caption" color="textSecondary">
            Created: {new Date(appointment.createdAt).toLocaleDateString()}
          </Typography>
          
          <Box display="flex" gap={1}>
            <Tooltip title="View Details">
              <IconButton size="small" color="primary">
                <Eye size={16} />
              </IconButton>
            </Tooltip>
            {!isPastAppointment(appointment.date, appointment.time) && (
              <Tooltip title="Edit Appointment">
                <IconButton size="small" color="primary">
                  <Edit size={16} />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const AppointmentStats = ({ appointments }) => {
  const theme = useTheme();

  const getStats = () => {
    const total = appointments.length;
    const completed = appointments.filter(app => app.status === "completed").length;
    const upcoming = appointments.filter(app => {
      const appointmentDate = new Date(`${app.date} ${app.time}`);
      return appointmentDate > new Date() && app.status !== "cancelled";
    }).length;
    const cancelled = appointments.filter(app => app.status === "cancelled").length;

    return { total, completed, upcoming, cancelled };
  };

  const stats = getStats();

  return (
    <Grid container spacing={2} mb={3}>
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: "center", bgcolor: theme.palette.primary.main, color: "white" }}>
          <Typography variant="h4" fontWeight="bold">
            {stats.total}
          </Typography>
          <Typography variant="body2">
            Total Appointments
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: "center", bgcolor: theme.palette.success.main, color: "white" }}>
          <Typography variant="h4" fontWeight="bold">
            {stats.completed}
          </Typography>
          <Typography variant="body2">
            Completed
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: "center", bgcolor: theme.palette.warning.main, color: "white" }}>
          <Typography variant="h4" fontWeight="bold">
            {stats.upcoming}
          </Typography>
          <Typography variant="body2">
            Upcoming
          </Typography>
        </Paper>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Paper sx={{ p: 2, textAlign: "center", bgcolor: theme.palette.error.main, color: "white" }}>
          <Typography variant="h4" fontWeight="bold">
            {stats.cancelled}
          </Typography>
          <Typography variant="body2">
            Cancelled
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

const PatientAppointments = ({ appointments, patientId }) => {
  const theme = useTheme();
  const [filter, setFilter] = useState("all");

  const getFilteredAppointments = () => {
    if (!appointments) return [];
    
    switch (filter) {
      case "upcoming":
        return appointments.filter(app => {
          const appointmentDate = new Date(`${app.date} ${app.time}`);
          return appointmentDate > new Date() && app.status !== "cancelled";
        });
      case "completed":
        return appointments.filter(app => app.status === "completed");
      case "cancelled":
        return appointments.filter(app => app.status === "cancelled");
      default:
        return appointments;
    }
  };

  const filteredAppointments = getFilteredAppointments();

  if (!appointments || appointments.length === 0) {
    return (
      <Box textAlign="center" py={6}>
        <Calendar size={64} color={theme.palette.text.secondary} style={{ opacity: 0.5 }} />
        <Typography variant="h6" color="textSecondary" mt={2} mb={1}>
          No Appointments Found
        </Typography>
        <Typography variant="body2" color="textSecondary" mb={3}>
          This patient doesn't have any appointments yet.
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          // onClick={() => navigate("/doctor/appointments/new")}
        >
          Schedule Appointment
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <AppointmentStats appointments={appointments} />

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6" fontWeight="bold">
          Appointment History ({filteredAppointments.length})
        </Typography>
        
        <Box display="flex" gap={1}>
          {["all", "upcoming", "completed", "cancelled"].map((filterType) => (
            <Button
              key={filterType}
              variant={filter === filterType ? "contained" : "outlined"}
              size="small"
              onClick={() => setFilter(filterType)}
              sx={{ textTransform: "capitalize" }}
            >
              {filterType === "all" ? "All" : filterType}
            </Button>
          ))}
        </Box>
      </Box>

      {filteredAppointments.length === 0 ? (
        <Alert severity="info">
          No appointments found for the selected filter.
        </Alert>
      ) : (
        <Box>
          {[...filteredAppointments]
  .sort((a, b) => new Date(`${b.date} ${b.time}`) - new Date(`${a.date} ${a.time}`))
  .map((appointment) => (
    <AppointmentCard
      key={appointment._id}
      appointment={appointment}
    />
  ))}

        </Box>
      )}
    </Box>
  );
};

export default PatientAppointments;