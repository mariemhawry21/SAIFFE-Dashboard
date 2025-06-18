import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Typography,
  Avatar,
  Box,
  useTheme,
  Chip,
  Button,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Eye,
  FileText,
  Heart,
  AlertTriangle,
  MoreVertical,
  UserCheck,
  Plus,
  Edit
} from 'lucide-react';

const PatientRow = ({ patient, index, currentPage, itemsPerPage }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const getInitials = (firstName, lastName) => {
    return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRowNumber = () => {
    return (currentPage - 1) * itemsPerPage + index + 1;
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

  const hasChronicDiseases = patient.patient_profile?.chronic_diseases?.length > 0;
  const hasAllergies = patient.patient_profile?.allergies?.length > 0;

  // Handle menu actions
  const handleMenuClick = (e) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = (e) => {
    e?.stopPropagation();
    setAnchorEl(null);
  };

  const handleViewDetails = (e) => {
    e?.stopPropagation();
    handleMenuClose();
    navigate(`/doctor/my-patients/${patient._id}`);
  };

  const handleCreatePrescription = (e) => {
    e?.stopPropagation();
    handleMenuClose();
    // Navigate to patient details with prescription tab active
    navigate(`/doctor/my-patients/${patient._id}`, { 
      state: { activeTab: 2, openPrescriptionDialog: true } 
    });
  };

  const handleEditPatient = (e) => {
    e?.stopPropagation();
    handleMenuClose();
    // Navigate to patient details with edit dialog open
    navigate(`/doctor/my-patients/${patient._id}`, { 
      state: { openEditDialog: true } 
    });
  };

  // Handle row click - navigate to patient details
  const handleRowClick = () => {
    navigate(`/doctor/my-patients/${patient._id}`);
  };

  return (
    <>
      <TableRow
        hover
        sx={{
          cursor: 'pointer',
          '&:hover': {
            bgcolor: theme.palette.action.hover
          },
          transition: 'background-color 0.2s ease-in-out'
        }}
        onClick={handleRowClick}
      >
        <TableCell>
          <Typography variant="body2" fontWeight="medium" color="textSecondary">
            {getRowNumber()}
          </Typography>
        </TableCell>

        <TableCell>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={patient.avatar}
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 45,
                height: 45,
                fontSize: '0.875rem',
                fontWeight: 'bold'
              }}
            >
              {getInitials(patient.first_name, patient.last_name)}
            </Avatar>
            <Box>
              <Typography variant="body1" fontWeight="medium">
                {patient.first_name} {patient.last_name}
              </Typography>
              <Box display="flex" alignItems="center" color="text.secondary" gap={1}>
                <User size={12} />
                <Typography variant="caption">
                  ID: {patient._id?.slice(-6)}
                </Typography>
                {(hasChronicDiseases || hasAllergies) && (
                  <Tooltip title={hasChronicDiseases ? "Has chronic diseases" : "Has allergies"}>
                    <AlertTriangle size={12} color={theme.palette.warning.main} />
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <Mail size={16} color={theme.palette.text.secondary} />
            <Typography variant="body2" noWrap title={patient.email}>
              {patient.email}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Box display="flex" alignItems="center" gap={1}>
            <Phone size={16} color={theme.palette.text.secondary} />
            <Typography variant="body2">
              {patient.phone || 'N/A'}
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Typography variant="body2" fontWeight="medium">
            {patient.gender || 'N/A'}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Age: {calculateAge(patient.birth_date)} years
          </Typography>
        </TableCell>

        <TableCell>
          <Box display="flex" flexDirection="column" gap={0.5}>
            {hasChronicDiseases && (
              <Chip
                label="Chronic"
                size="small"
                color="warning"
                variant="outlined"
                icon={<Heart size={12} />}
              />
            )}
            {hasAllergies && (
              <Chip
                label="Allergies"
                size="small"
                color="error"
                variant="outlined"
                icon={<AlertTriangle size={12} />}
              />
            )}
            {!hasChronicDiseases && !hasAllergies && (
              <Typography variant="caption" color="textSecondary">
                No conditions
              </Typography>
            )}
          </Box>
        </TableCell>

        <TableCell>
          <Typography variant="body2" fontWeight="medium">
            {formatDate(patient.createdAt)}
          </Typography>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Calendar size={12} color={theme.palette.text.secondary} />
            <Typography variant="caption" color="textSecondary">
              Patient since
            </Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Box display="flex" gap={1} alignItems="center">
            {/* Quick Actions */}
            <Tooltip title="View Patient Details">
              <IconButton
                size="small"
                onClick={handleViewDetails}
                sx={{ 
                  color: theme.palette.primary.main,
                  '&:hover': { bgcolor: theme.palette.primary.light + '20' }
                }}
              >
                <Eye size={16} />
              </IconButton>
            </Tooltip>
            
            <Tooltip title="Create Prescription">
              <IconButton
                size="small"
                onClick={handleCreatePrescription}
                sx={{ 
                  color: theme.palette.success.main,
                  '&:hover': { bgcolor: theme.palette.success.light + '20' }
                }}
              >
                <FileText size={16} />
              </IconButton>
            </Tooltip>

            {/* More Actions Menu */}
            <Tooltip title="More Actions">
              <IconButton
                size="small"
                onClick={handleMenuClick}
                sx={{ 
                  color: theme.palette.text.secondary,
                  '&:hover': { bgcolor: theme.palette.grey[100] }
                }}
              >
                <MoreVertical size={16} />
              </IconButton>
            </Tooltip>
          </Box>
        </TableCell>
      </TableRow>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            boxShadow: theme.shadows[8]
          }
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <UserCheck size={18} />
          </ListItemIcon>
          <ListItemText primary="View Details" />
        </MenuItem>
        
        <MenuItem onClick={handleCreatePrescription}>
          <ListItemIcon>
            <Plus size={18} />
          </ListItemIcon>
          <ListItemText primary="New Prescription" />
        </MenuItem>
        
        <MenuItem onClick={handleEditPatient}>
          <ListItemIcon>
            <Edit size={18} />
          </ListItemIcon>
          <ListItemText primary="Edit Patient" />
        </MenuItem>
      </Menu>
    </>
  );
};

const PatientTable = ({ patients, loading, currentPage, itemsPerPage }) => {
  const theme = useTheme();

  return (
    <TableContainer sx={{ borderRadius: 2, overflow: 'hidden' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>#</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Patient</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Gender & Age</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Health Status</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Joined</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.length > 0 ? (
            patients.map((patient, index) => (
              <PatientRow
                key={patient._id}
                patient={patient}
                index={index}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                  <User size={48} color={theme.palette.text.disabled} />
                  <Typography variant="h6" color="textSecondary">
                    No patients found
                  </Typography>
                  <Typography variant="body2" color="textSecondary" textAlign="center">
                    Patients will appear here once they book appointments with you.<br />
                    You can search for existing patients using the search bar above.
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientTable;