import React, { useEffect } from "react";
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
  fetchDoctorPatients,
  setSearchTerm,
  clearErrors,
} from "../../Store/Slices/DoctorPatients";
import SearchBar from "../../Components/Admin/Patients/SearchBar";
import PatientTable from "../../Components/Doctor/Patients/PatientTable";
import Pagination from "../../Components/Admin/Patients/Pagination";
import TableSkeleton from "../../Components/Admin/Patients/TableSkeleton";
import { toast } from "react-toastify";

const DoctorPatients = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    patients,
    loading,
    error,
    searchTerm,
  } = useSelector((state) => state.doctorPatients);

  const currentPage = patients.pagination.currentPage;
  const itemsPerPage = patients.pagination.itemsPerPage;
  const totalItems = patients.pagination.totalItems;
  const totalPages = patients.pagination.totalPages;

  useEffect(() => {
    dispatch(
      fetchDoctorPatients({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, itemsPerPage, searchTerm]);

  useEffect(() => {
    if (error.patients) {
      toast.error(error.patients);
    }
  }, [error.patients]);

  const handleSearch = (value) => {
    dispatch(setSearchTerm(value));
    dispatch(
      fetchDoctorPatients({
        page: 1,
        limit: itemsPerPage,
        search: value,
      })
    );
  };

  const handlePageChange = (page) => {
    dispatch(
      fetchDoctorPatients({
        page,
        limit: itemsPerPage,
        search: searchTerm,
      })
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetry = () => {
    dispatch(clearErrors());
    dispatch(
      fetchDoctorPatients({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      })
    );
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
          : "You don't have any patients yet. Patients will appear here once they book appointments with you."}
      </Typography>
      {searchTerm && (
        <Button
          onClick={() => {
            dispatch(setSearchTerm(""));
            dispatch(
              fetchDoctorPatients({ page: 1, limit: itemsPerPage, search: "" })
            );
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
                  My Patients
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Manage your patients and their medical records
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
                    {loading.patients ? "..." : totalItems}
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
                    {loading.patients ? "..." : patients.data.length}
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
            <SearchBar onSearch={handleSearch} loading={loading.patients} />

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
        {error.patients && (
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
              {error.patients}
            </Typography>
          </Alert>
        )}

        {/* Table */}
        {loading.patients ? (
          <TableSkeleton rows={10} />
        ) : patients.data.length === 0 ? (
          <EmptyState />
        ) : (
          <PatientTable
            patients={patients.data}
            loading={loading.patients}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
          />
        )}

        {/* Pagination */}
        {!loading.patients && patients.data.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            loading={loading.patients}
          />
        )}
      </Paper>
    </Box>
  );
};

export default DoctorPatients;