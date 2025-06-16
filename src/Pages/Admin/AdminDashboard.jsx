// src/components/admin/AdminDashboard.jsx
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
  ListItemAvatar,
  Chip,
  LinearProgress,
  Paper,
  Divider,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Alert,
} from "@mui/material";
import {
  People as PatientsIcon,
  LocalHospital as DoctorsIcon,
  Event as AppointmentsIcon,
  MonetizationOn as RevenueIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminDashboard } from "../../Store/Slices/adminDashboard";
import { format, parseISO } from "date-fns";

const AdminDashboard = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  // Get admin dashboard state from Redux
  const { data, loading, error } = useSelector((state) => state.adminDashboard);

  // Get user from auth state
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.role === "Admin") {
      dispatch(fetchAdminDashboard());
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
    const date = parseISO(dateString);
    return format(date, "hh:mm a");
  };

  const formatDate = (dateString) => {
    const date = parseISO(dateString);
    return format(date, "MMM d, yyyy");
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
          onClick={() => dispatch(fetchAdminDashboard())}
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
        <Button
          variant="outlined"
          sx={{ mt: 2 }}
          onClick={() => dispatch(fetchAdminDashboard())}
        >
          Load Data
        </Button>
      </Box>
    );
  }

  const { admin, stats, latestPatients, latestDoctors, todaysAppointments } =
    data;

  return (
    <Box sx={{ p: 1, minHeight: "100vh" }}>
      <Grid container spacing={3}>
        {/* Header */}
        <Grid
          item
          xs={12}
          md={4}
          size={{
            xs: 12,
            md: 3,
          }}
        >
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
                  {admin.name}
                </Typography>
                <Typography variant="subtitle1">
                  Clinic Administrator Dashboard
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid
          item
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <StatCard
            title="Total Patients"
            value={stats.totalPatients}
            icon={<PatientsIcon fontSize="large" />}
            color={theme.palette.primary.main}
            description="Registered patients"
          />
        </Grid>

        <Grid
          item
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <StatCard
            title="Total Doctors"
            value={stats.totalDoctors}
            icon={<DoctorsIcon fontSize="large" />}
            color={theme.palette.secondary.main}
            description="Active doctors"
          />
        </Grid>

        <Grid
          item
          size={{
            xs: 12,
            md: 3,
          }}
        >
          <StatCard
            title="Total Appointments"
            value={stats.totalAppointments}
            icon={<AppointmentsIcon fontSize="large" />}
            color={theme.palette.success.main}
            description="All appointments"
          />
        </Grid>

        {/* Appointment Status Distribution */}
        <Grid
          item
          size={{
            xs: 12,
            md: 6,
          }}
        >
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
                <Grid
                  item
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <StatusCard
                    title="Booked"
                    value={stats.appointmentStatus.booked}
                    total={stats.totalAppointments}
                    icon={
                      <CalendarIcon
                        sx={{ color: theme.palette.primary.main }}
                      />
                    }
                    color={theme.palette.primary.main}
                  />
                </Grid>

                <Grid
                  item
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <StatusCard
                    title="Completed"
                    value={stats.appointmentStatus.completed}
                    total={stats.totalAppointments}
                    icon={
                      <CalendarIcon
                        sx={{ color: theme.palette.success.main }}
                      />
                    }
                    color={theme.palette.success.main}
                  />
                </Grid>

                <Grid
                  item
                  size={{
                    xs: 12,
                    md: 4,
                  }}
                >
                  <StatusCard
                    title="Cancelled"
                    value={stats.appointmentStatus.cancelled}
                    total={stats.totalAppointments}
                    icon={
                      <CalendarIcon sx={{ color: theme.palette.error.main }} />
                    }
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
                      (stats.appointmentStatus.booked /
                        (stats.totalAppointments || 1)) *
                      100
                    }%`,
                    backgroundColor: theme.palette.primary.main,
                  }}
                />
                <Box
                  sx={{
                    width: `${
                      (stats.appointmentStatus.completed /
                        (stats.totalAppointments || 1)) *
                      100
                    }%`,
                    backgroundColor: theme.palette.success.main,
                  }}
                />
                <Box
                  sx={{
                    width: `${
                      (stats.appointmentStatus.cancelled /
                        (stats.totalAppointments || 1)) *
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
                  Booked: {stats.appointmentStatus.booked}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.success.main }}
                >
                  Completed: {stats.appointmentStatus.completed}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: theme.palette.error.main }}
                >
                  Cancelled: {stats.appointmentStatus.cancelled}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Latest Doctors */}
        <Grid
          item
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <DoctorsIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">
                  Recently Joined Doctors
                </Typography>
              </Box>

              {latestDoctors.length === 0 ? (
                <Typography
                  variant="body2"
                  color="textSecondary"
                  textAlign="center"
                  py={2}
                >
                  No new doctors
                </Typography>
              ) : (
                <List sx={{ maxHeight: 300, overflow: "auto" }}>
                  {latestDoctors.map((doctor, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ py: 1.5 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{ bgcolor: theme.palette.secondary.light }}
                          >
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="subtitle1" fontWeight="bold">
                              {doctor.name}
                            </Typography>
                          }
                          secondary={
                            <React.Fragment>
                              <Typography variant="body2">
                                {doctor.specialty}
                              </Typography>
                              <Typography variant="caption">
                                Joined: {formatDate(doctor.joined)}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      {index < latestDoctors.length - 1 && (
                        <Divider variant="inset" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Latest Patients */}
        <Grid
          item
          size={{
            xs: 12,
            md: 6,
          }}
        >
          <Card elevation={2} sx={{ borderRadius: 3, height: "100%" }}>
            <CardContent>
              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                fontWeight="bold"
              >
                Latest Patients
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Contact</TableCell>
                      <TableCell>Joined Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {latestPatients.map((patient, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Typography fontWeight="bold">
                            {patient.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box>
                            <Typography variant="body2">
                              {patient.email}
                            </Typography>
                            <Typography variant="body2">
                              {patient.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{formatDate(patient.joined)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Appointments */}
        <Grid
          item
          size={{
            xs: 12,
            md: 6,
          }}
        >
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
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Time</TableCell>
                        <TableCell>Patient</TableCell>
                        <TableCell>Doctor</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Fee</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {todaysAppointments.map((appointment, index) => (
                        <TableRow key={index} hover>
                          <TableCell>{formatTime(appointment.time)}</TableCell>
                          <TableCell>{appointment.patient}</TableCell>
                          <TableCell>
                            <Box>
                              <Typography>{appointment.doctor}</Typography>
                              <Typography
                                variant="caption"
                                color="textSecondary"
                              >
                                {appointment.specialty}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={appointment.status}
                              size="small"
                              color={getStatusColor(appointment.status)}
                            />
                          </TableCell>
                          <TableCell align="right">
                            ${appointment.fee.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
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
        <Box>
          <Typography variant="h6" component="h3" fontWeight="bold">
            {title}
          </Typography>
          <Typography variant="h4" component="div" fontWeight="bold">
            {value}
          </Typography>
        </Box>
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

export default AdminDashboard;
