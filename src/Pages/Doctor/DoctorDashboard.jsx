// src/components/DoctorDashboard.js
import React, { useEffect } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  Paper,
  Divider,
  useTheme,
  Alert,
  Button,
} from "@mui/material";
import {
  Event as AppointmentIcon,
  People as PatientsIcon,
  CheckCircle as CompletedIcon,
  Cancel as CancelledIcon,
  Schedule as BookedIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchDoctorDashboard } from "../../Store/Slices/doctorDashboard";

const DoctorDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Get dashboard state from Redux
  const { data, loading, error } = useSelector(
    (state) => state.doctorDashboard
  );

  // Get user from auth state
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === "Doctor") {
      dispatch(fetchDoctorDashboard());
    }
  }, [dispatch, user]);

  const getStatusColor = (status) => {
    switch (status) {
      case "booked":
        return "primary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (loading) {
    return (
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <LinearProgress sx={{ width: "50%" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(fetchDoctorDashboard())}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="textSecondary">
          No dashboard data available
        </Typography>
      </Box>
    );
  }

  const { doctor, stats, todaysAppointments } = data;
  const totalAppointments = stats.totalAppointments;
  const appointmentStatus = stats.appointmentStatus;

  return (
    <Box sx={{ p: 1, minHeight: "100vh" }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid item size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 3,
              backgroundColor: theme.palette.primary.main,
              color: "white",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  mr: 3,
                  backgroundColor: "white",
                  color: theme.palette.primary.main,
                }}
              >
                <PersonIcon sx={{ fontSize: 40 }} />
              </Avatar>
              <Box>
                <Typography variant="h5" component="h1" fontWeight="bold">
                  {doctor.name}
                </Typography>
                <Typography variant="subtitle1">
                  Welcome to your dashboard
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<AppointmentIcon fontSize="large" />}
            color={theme.palette.primary.main}
            description="All appointments you've handled"
          />
        </Grid>

        <Grid item size={{ xs: 12, md: 4 }}>
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<PatientsIcon fontSize="large" />}
            color={theme.palette.secondary.main}
            description="Unique patients you've treated"
          />
        </Grid>

        {/* Appointment Status Distribution */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                fontWeight="bold"
              >
                Appointment Overview
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item size={{ xs: 12, md: 4 }}>
                  <StatusCard
                    title="Booked"
                    value={appointmentStatus.booked}
                    total={totalAppointments}
                    icon={<BookedIcon />}
                    color={theme.palette.primary.main}
                  />
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                  <StatusCard
                    title="Completed"
                    value={appointmentStatus.completed}
                    total={totalAppointments}
                    icon={<CompletedIcon />}
                    color={theme.palette.success.main}
                  />
                </Grid>

                <Grid item size={{ xs: 12, md: 4 }}>
                  <StatusCard
                    title="Cancelled"
                    value={appointmentStatus.cancelled}
                    total={totalAppointments}
                    icon={<CancelledIcon />}
                    color={theme.palette.error.main}
                  />
                </Grid>
              </Grid>

              <Box
                sx={{
                  mt: 4,
                  height: 20,
                  display: "flex",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    width: `${
                      (appointmentStatus.booked / (totalAppointments || 1)) *
                      100
                    }%`,
                    backgroundColor: theme.palette.primary.main,
                  }}
                />
                <Box
                  sx={{
                    width: `${
                      (appointmentStatus.completed / (totalAppointments || 1)) *
                      100
                    }%`,
                    backgroundColor: theme.palette.success.main,
                  }}
                />
                <Box
                  sx={{
                    width: `${
                      (appointmentStatus.cancelled / (totalAppointments || 1)) *
                      100
                    }%`,
                    backgroundColor: theme.palette.error.main,
                  }}
                />
              </Box>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.primary.main }}
                >
                  Booked: {appointmentStatus.booked}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.success.main }}
                >
                  Completed: {appointmentStatus.completed}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.error.main }}
                >
                  Cancelled: {appointmentStatus.cancelled}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Appointments */}
        <Grid item size={{ xs: 12, md: 6 }}>
          <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                fontWeight="bold"
              >
                Today's Appointments
              </Typography>

              {todaysAppointments.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No appointments scheduled for today
                  </Typography>
                </Box>
              ) : (
                <List sx={{ maxHeight: 400, overflow: "auto" }}>
                  {todaysAppointments.map((appointment, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ py: 2 }}>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold">
                              {appointment.patient}
                            </Typography>
                          }
                          secondary={
                            <Typography variant="body2" color="textSecondary">
                              {formatTime(appointment.time)}
                            </Typography>
                          }
                        />
                        <Chip
                          label={appointment.status}
                          color={getStatusColor(appointment.status)}
                          sx={{ textTransform: "capitalize" }}
                        />
                      </ListItem>
                      {index < todaysAppointments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon, color, description }) => (
  <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
    <CardContent
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <Avatar sx={{ backgroundColor: `${color}20`, color: color, mr: 2 }}>
          {icon}
        </Avatar>
        <Typography variant="h6" component="h3" fontWeight="bold">
          {title}
        </Typography>
      </Box>

      <Box flexGrow={1} display="flex" alignItems="flex-end">
        <Typography variant="h3" component="div" fontWeight="bold">
          {value}
        </Typography>
      </Box>

      <Typography variant="body2" color="textSecondary" mt={1}>
        {description}
      </Typography>
    </CardContent>
  </Card>
);

// StatusCard Component
const StatusCard = ({ title, value, total, icon, color }) => {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;

  return (
    <Box sx={{ p: 2, backgroundColor: `${color}10`, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={1}>
        <Box sx={{ color, mr: 1 }}>{icon}</Box>
        <Typography variant="subtitle1" fontWeight="bold">
          {title}
        </Typography>
      </Box>

      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>

      <Typography variant="caption" color="textSecondary">
        {percentage}% of total
      </Typography>
    </Box>
  );
};

export default DoctorDashboard;
