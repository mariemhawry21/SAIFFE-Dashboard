import React, { useState } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton
} from '@mui/material';
import { User, Mail, Phone, Calendar, X } from 'lucide-react';

const PatientRow = ({ patient, index, currentPage, itemsPerPage, onClick }) => {
  const theme = useTheme();

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

  return (
    <TableRow
      hover
      sx={{
        cursor: 'pointer',
        '&:hover': {
          bgcolor: theme.palette.action.hover
        }
      }}
      onClick={() => onClick(patient)}
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
              width: 40,
              height: 40,
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
            <Box display="flex" alignItems="center" color="text.secondary">
              <User size={12} style={{ marginRight: 4 }} />
              <Typography variant="caption">
                ID: {patient._id?.slice(-6)}
              </Typography>
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
          {formatDate(patient.createdAt)}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          <Calendar size={12} color={theme.palette.text.secondary} />
          <Typography variant="caption" color="textSecondary">
            Registered
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  );
};

const PatientTable = ({ patients, loading, currentPage, itemsPerPage }) => {
  const theme = useTheme();
  const actualPatients = patients?.data?.data || patients || [];

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handlePatientClick = (patient) => {
    setSelectedPatient(patient);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedPatient(null);
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
              <TableCell sx={{ fontWeight: 'bold' }}>#</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Patient</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Joined</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {actualPatients.length > 0 ? (
              actualPatients.map((patient, index) => (
                <PatientRow
                  key={patient._id}
                  patient={patient}
                  index={index}
                  currentPage={currentPage}
                  itemsPerPage={itemsPerPage}
                  onClick={handlePatientClick}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="textSecondary">
                    No patients have been registered yet
                  </Typography>
                  <Typography variant="body2" mt={1}>
                    New patients will appear here once they sign up
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog for Patient Details */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Patient Details
          <IconButton
            aria-label="close"
            onClick={handleCloseDialog}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedPatient && (
            <Box display="flex" flexDirection="column" gap={2}>
              <Box display="flex" gap={2} alignItems="center">
                <Avatar
                  src={selectedPatient.avatar}
                  sx={{ width: 56, height: 56 }}
                >
                  {selectedPatient.first_name[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedPatient.first_name} {selectedPatient.last_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    ID: {selectedPatient._id}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle2">Email</Typography>
                <Typography variant="body2">{selectedPatient.email}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">Phone</Typography>
                <Typography variant="body2">{selectedPatient.phone || 'N/A'}</Typography>
              </Box>

              <Box>
                <Typography variant="subtitle2">Registered At</Typography>
                <Typography variant="body2">
                  {new Date(selectedPatient.createdAt).toLocaleDateString()}
                </Typography>
              </Box>

              {/* عرض معلومات إضافية لو عايزة */}
              {selectedPatient.patient_profile && (
                <>
                  <Box>
                    <Typography variant="subtitle2">Chronic Diseases</Typography>
                    <Typography variant="body2">
                      {selectedPatient.patient_profile.chronic_diseases?.join(', ') || 'None'}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2">Allergies</Typography>
                    <Typography variant="body2">
                      {selectedPatient.patient_profile.allergies?.join(', ') || 'None'}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PatientTable;
