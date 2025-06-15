import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Box, 
  Paper, 
  Typography, 
  Alert, 
  Button, 
  Card,
  CardContent,
  Chip,
  useTheme
} from '@mui/material';
import { Users, AlertCircle } from 'lucide-react';
import { fetchPatients, setSearchTerm, clearError } from '../../Store/Slices/patientSlice';
import SearchBar from '../../Components/Admin/Patients/SearchBar';
import PatientTable from '../../Components/Admin/Patients/PatientTable';
import Pagination from '../../Components/Admin/Patients/Pagination';
import TableSkeleton from '../../Components/Admin/Patients/TableSkeleton';

const Patients = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { 
    data: patients, 
    pagination, 
    loading, 
    error, 
    searchTerm 
  } = useSelector((state) => state.patients);

  useEffect(() => {
    dispatch(fetchPatients({ 
      page: pagination.currentPage, 
      limit: pagination.itemsPerPage, 
      search: searchTerm 
    }));
  }, [dispatch, pagination.currentPage, searchTerm]);

  const handleSearch = () => {
    dispatch(fetchPatients({ 
      page: 1, 
      limit: pagination.itemsPerPage, 
      search: searchTerm 
    }));
  };

  const handlePageChange = (page) => {
    dispatch(fetchPatients({ 
      page, 
      limit: pagination.itemsPerPage, 
      search: searchTerm 
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchTermChange = (term) => {
    dispatch(setSearchTerm(term));
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchPatients({ 
      page: pagination.currentPage, 
      limit: pagination.itemsPerPage, 
      search: searchTerm 
    }));
  };

  const EmptyState = () => (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center"
      py={8}
      px={4}
    >
      <Users size={64} color={theme.palette.grey[400]} style={{ marginBottom: 16 }} />
      <Typography variant="h6" color="textPrimary" gutterBottom>
        No patients found
      </Typography>
      <Typography variant="body2" color="textSecondary" textAlign="center" maxWidth={400}>
        {searchTerm 
          ? `No patients match your search "${searchTerm}". Try adjusting your search criteria.`
          : 'No patients have been registered yet. New patients will appear here once they sign up.'
        }
      </Typography>
      {searchTerm && (
        <Button
          onClick={() => {
            dispatch(setSearchTerm(''));
            dispatch(fetchPatients({ page: 1, limit: pagination.itemsPerPage, search: '' }));
          }}
          sx={{ mt: 2 }}
          color="primary"
        >
          Clear search
        </Button>
      )}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', p: 3 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box 
                sx={{ 
                  p: 1.5, 
                  bgcolor: 'primary.main', 
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Users size={24} color="white" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  Patient Management
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  View and manage patient information
                </Typography>
              </Box>
            </Box>
            
            {/* Stats */}
            <Box display="flex" gap={4}>
              <Card variant="outlined" sx={{ minWidth: 120, textAlign: 'center' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h5" fontWeight="bold" color="primary.main">
                    {loading ? '...' : pagination.totalItems}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Total Patients
                  </Typography>
                </CardContent>
              </Card>
              <Card variant="outlined" sx={{ minWidth: 120, textAlign: 'center' }}>
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h5" fontWeight="bold" color="secondary.main">
                    {loading ? '...' : patients.length}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Showing
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </CardContent>
      </Paper>

      {/* Main Content */}
      <Paper elevation={1}>
        {/* Search and Actions */}
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={handleSearchTermChange}
              onSearch={handleSearch}
              loading={loading}
            />
            
            <Box display="flex" alignItems="center" gap={1}>
              <Box 
                sx={{ 
                  width: 8, 
                  height: 8, 
                  bgcolor: 'success.main', 
                  borderRadius: '50%' 
                }} 
              />
              <Typography variant="body2" color="textSecondary">
                Active Patients: {pagination.totalItems}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ m: 3, mb: 0 }}
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                Retry
              </Button>
            }
            icon={<AlertCircle size={20} />}
          >
            <Typography variant="body2" fontWeight="medium">
              {error}
            </Typography>
          </Alert>
        )}

        {/* Table */}
        {loading ? (
          <TableSkeleton rows={10} />
        ) : patients.length === 0 ? (
          <EmptyState />
        ) : (
          <PatientTable
            patients={patients}
            loading={loading}
            currentPage={pagination.currentPage}
            itemsPerPage={pagination.itemsPerPage}
          />
        )}

        {/* Pagination */}
        {!loading && patients.length > 0 && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </Paper>
    </Box>
  );
};

export default Patients;