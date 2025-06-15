import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, Paper, Container } from "@mui/material";
import EditDoctorData from "../../Components/global/Doctor/EditDoctorData"; // You'll create this component
import ResetPassword from "../../Components/global/Doctor/ResetPassword"; // You'll create this component
import DoctorSchedule from "../../Components/global/Doctor/DoctorSchedule ";

const Settings = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box maxWidth="100%" sx={{ mt: 2, p: 0 }}>
      <Paper elevation={0} sx={{ p: 0 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="doctor settings tabs"
          >
            <Tab label="Edit Profile" id="tab-0" aria-controls="tabpanel-0" />
            <Tab label="Edit schedule " id="tab-1" aria-controls="tabpanel-1" />
            <Tab label="Reset Password" id="tab-2" aria-controls="tabpanel-2" />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <EditDoctorData />
        </TabPanel>
        <TabPanel value={activeTab} index={1}>
          <DoctorSchedule />
        </TabPanel>
        <TabPanel value={activeTab} index={2}>
          <ResetPassword />
        </TabPanel>
      </Paper>
    </Box>
  );
};

// TabPanel component to handle tab content
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default Settings;
