import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const DoctorSchedule = () => {
  const [schedules, setSchedules] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [currentDay, setCurrentDay] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [newSchedule, setNewSchedule] = useState({
    startTime: null,
    endTime: null,
    appointmentDuration: 30,
    isAvailable: true,
  });

  const handleOpenDialog = (day) => {
    setCurrentDay(day);
    setOpenDialog(true);
    setEditIndex(null);
    setNewSchedule({
      startTime: null,
      endTime: null,
      appointmentDuration: 30,
      isAvailable: true,
    });
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleTimeChange = (field) => (newValue) => {
    setNewSchedule({ ...newSchedule, [field]: newValue });
  };

  const handleSwitchChange = (e) => {
    setNewSchedule({ ...newSchedule, isAvailable: e.target.checked });
  };

  const handleAddSchedule = () => {
    if (!newSchedule.startTime || !newSchedule.endTime) return;

    const updatedSchedules = { ...schedules };
    if (!updatedSchedules[currentDay]) {
      updatedSchedules[currentDay] = [];
    }

    if (editIndex !== null) {
      updatedSchedules[currentDay][editIndex] = newSchedule;
    } else {
      updatedSchedules[currentDay].push(newSchedule);
    }

    setSchedules(updatedSchedules);
    handleCloseDialog();
  };

  const handleDeleteSchedule = (day, index) => {
    const updatedSchedules = { ...schedules };
    updatedSchedules[day].splice(index, 1);
    if (updatedSchedules[day].length === 0) {
      delete updatedSchedules[day];
    }
    setSchedules(updatedSchedules);
  };

  const formatTime = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Paper elevation={0} sx={{ p: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <ScheduleIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Weekly Schedule</Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          {daysOfWeek.map((day) => (
            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={day}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                    gap: 2,
                  }}
                >
                  <Typography variant="subtitle1">{day}</Typography>
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog(day)}
                  >
                    Add
                  </Button>
                </Box>
                {schedules[day]?.length > 0 ? (
                  <Box>
                    {schedules[day].map((slot, index) => (
                      <Paper
                        key={index}
                        elevation={0}
                        sx={{
                          mb: 1,
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          backgroundColor: slot.isAvailable
                            ? "background.paper"
                            : "action.disabledBackground",
                        }}
                      >
                        <Box>
                          <Typography variant="body2">
                            {formatTime(slot.startTime)} -{" "}
                            {formatTime(slot.endTime)}
                          </Typography>
                        </Box>
                        <Box>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteSchedule(day, index)}
                          >
                            <DeleteIcon
                              fontSize="small"
                              color="red"
                              sx={{ color: "red" }}
                            />
                          </IconButton>
                        </Box>
                      </Paper>
                    ))}
                  </Box>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: "italic" }}
                  >
                    No schedule set
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Schedule Edit/Add Dialog */}
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>
            {editIndex !== null ? "Edit Schedule" : "Add Schedule"} -
            {currentDay}
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="Start Time"
                  value={newSchedule.startTime}
                  onChange={handleTimeChange("startTime")}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TimePicker
                  label="End Time"
                  value={newSchedule.endTime}
                  onChange={handleTimeChange("endTime")}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={newSchedule.isAvailable}
                      onChange={handleSwitchChange}
                      name="isAvailable"
                    />
                  }
                  label={newSchedule.isAvailable ? "Available" : "Unavailable"}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button
              onClick={handleAddSchedule}
              variant="contained"
              color="primary"
            >
              {editIndex !== null ? "Update" : "Add"} Schedule
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </LocalizationProvider>
  );
};

export default DoctorSchedule;
