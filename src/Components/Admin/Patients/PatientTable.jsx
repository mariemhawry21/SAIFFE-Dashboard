import React from 'react';
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
  Chip,
  useTheme
} from '@mui/material';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const PatientRow = ({ patient, index, currentPage, itemsPerPage }) => {
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

  const getAgeFromBirthDate = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return `${age} years`;
  };

  const getGenderChipColor = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male': return 'primary';
      case 'female': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <TableRow 
      hover 
      sx={{ 
        '&:hover': { 
          bgcolor: theme.palette.action.hover 
        }
      }}
    >
      <TableCell>
        <Typography variant="body2" fontWeight="medium" color="textSecondary">
          {getRowNumber()}
        </Typography>
      </TableCell>

      <TableCell>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar 
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
        <Chip
          label={patient.gender || 'N/A'}
          color={getGenderChipColor(patient.gender)}
          size="small"
          variant="outlined"
        />
      </TableCell>

      <TableCell>
        <Typography variant="body2" fontWeight="medium">
          {formatDate(patient.date_of_birth)}
        </Typography>
        <Typography variant="caption" color="textSecondary">
          {getAgeFromBirthDate(patient.date_of_birth)}
        </Typography>
      </TableCell>

      <TableCell>
        <Box display="flex" alignItems="center" gap={1}>
          <MapPin size={16} color={theme.palette.text.secondary} />
          <Typography variant="body2" noWrap title={patient.address}>
            {patient.address || 'N/A'}
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

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>#</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Patient</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Gender</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Birth Date</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Address</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>Joined</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient, index) => (
            <PatientRow
              key={patient._id}
              patient={patient}
              index={index}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PatientTable;