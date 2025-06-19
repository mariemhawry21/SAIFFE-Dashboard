import React, { useEffect, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Alert,
  Button,
  Card,
  CardContent,
  useTheme,
} from "@mui/material";
import { Users, AlertCircle } from "lucide-react";
import {
  fetchPatients,
  setSearchTerm,
  clearError,
} from "../../Store/Slices/patientSlice";
import SearchBar from "../../Components/Admin/Patients/SearchBar";
import PatientTable from "../../Components/Admin/Patients/PatientTable";
import Pagination from "../../Components/Admin/Patients/Pagination";
import TableSkeleton from "../../Components/Admin/Patients/TableSkeleton";

const Patients = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    data: patientsResponse,
    loading,
    error,
    searchTerm,
    initialized,
  } = useSelector((state) => state.patients);

  // Memoize derived values to prevent unnecessary re-renders
  const patientsData = useMemo(() => {
    return {
      patients: patientsResponse?.data || [],
      pagination: patientsResponse?.pagination || {
        currentPage: 1,
        itemsPerPage: 10,
        totalItems: 0,
        totalPages: 1,
      }
    };
  }, [patientsResponse]);

  const { patients, pagination } = patientsData;
  const { currentPage, itemsPerPage, totalItems, totalPages } = pagination;

  // Memoized fetch function to prevent unnecessary re-creations
  const fetchPatientsData = useCallback((page = 1, limit = 10, search = "") => {
    console.log('Dispatching fetchPatients with:', { page, limit, search });
    dispatch(fetchPatients({ page, limit, search }));
  }, [dispatch]);

  // Initial load with proper dependencies
  useEffect(() => {
    if (!initialized) {
      console.log('Initial load - fetching patients');
      fetchPatientsData(1, 10, "");
    }
  }, [initialized, fetchPatientsData]);

  // Optimized search handler with debouncing
  const handleSearch = useCallback((value) => {
    console.log('Search triggered with value:', value);
    dispatch(setSearchTerm(value));
    // Reset to page 1 when searching
    fetchPatientsData(1, itemsPerPage, value);
  }, [dispatch, fetchPatientsData, itemsPerPage]);

  // Optimized page change handler
  const handlePageChange = useCallback((page) => {
    console.log('Page change to:', page);
    fetchPatientsData(page, itemsPerPage, searchTerm);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [fetchPatientsData, itemsPerPage, searchTerm]);

  // Optimized retry handler
  const handleRetry = useCallback(() => {
    console.log('Retry triggered');
    dispatch(clearError());
    fetchPatientsData(currentPage, itemsPerPage, searchTerm);
  }, [dispatch, fetchPatientsData, currentPage, itemsPerPage, searchTerm]);

  // Optimized clear search handler
  const handleClearSearch = useCallback(() => {
    console.log('Clear search triggered');
    dispatch(setSearchTerm(""));
    fetchPatientsData(1, itemsPerPage, "");
  }, [dispatch, fetchPatientsData, itemsPerPage]);

  // Debug logging
  useEffect(() => {
    console.log('Component state:', {
      loading,
      error,
      initialized,
      patientsCount: patients.length,
      totalItems,
      searchTerm
    });
  }, [loading, error, initialized, patients.length, totalItems, searchTerm]);

  // Memoized empty state component
  const EmptyState = useMemo(() => (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={8}
      px={4}
    >
      <Users
        size={64}
        color={theme.palette.grey[400]}
        style={{ marginBottom: 16 }}
      />
      <Typography variant="h6" color="textPrimary" gutterBottom>
        No patients found
      </Typography>
      <Typography
        variant="body2"
        color="textSecondary"
        textAlign="center"
        maxWidth={400}
      >
        {searchTerm
          ? `No patients match your search "${searchTerm}". Try adjusting your search criteria.`
          : "No patients have been registered yet. New patients will appear here once they sign up."}
      </Typography>
      {searchTerm && (
        <Button
          onClick={handleClearSearch}
          sx={{ mt: 2 }}
          color="primary"
        >
          Clear search
        </Button>
      )}
    </Box>
  ), [theme.palette.grey, searchTerm, handleClearSearch]);

  // Show loading state during initial load
  if (!initialized && loading) {
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 3 }}>
        <Paper elevation={1}>
          <TableSkeleton rows={10} />
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", p: 3 }}>
      {/* Header */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <CardContent>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: "primary.main",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
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
              <Card
                variant="outlined"
                sx={{ minWidth: 120, textAlign: "center" }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    {loading ? "..." : totalItems}
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    Total Patients
                  </Typography>
                </CardContent>
              </Card>
              <Card
                variant="outlined"
                sx={{ minWidth: 120, textAlign: "center" }}
              >
                <CardContent sx={{ py: 2 }}>
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color="secondary.main"
                  >
                    {loading ? "..." : patients.length}
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
        <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider" }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <SearchBar onSearch={handleSearch} loading={loading} />

            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  bgcolor: "success.main",
                  borderRadius: "50%",
                }}
              />
              <Typography variant="body2" color="textSecondary">
                Active Patients: {totalItems}
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
        {loading && !initialized ? (
          <TableSkeleton rows={10} />
        ) : patients.length === 0 ? (
          EmptyState
        ) : (
          <PatientTable
            patients={patients}
            loading={loading}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        )}

        {/* Pagination */}
        {!loading && patients.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            loading={loading}
          />
        )}
      </Paper>
    </Box>
  );
};

export default React.memo(Patients);