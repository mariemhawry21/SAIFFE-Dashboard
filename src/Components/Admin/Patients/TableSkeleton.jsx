import React, { useMemo } from 'react';
import {
  Skeleton,
  TableRow,
  TableCell,
  Box,
  Table,
  TableHead,
  TableBody,
  TableContainer,
  useTheme
} from '@mui/material';

const TableSkeleton = React.memo(({ rows = 10 }) => {
  const theme = useTheme();

  // Fixed headers that match your actual table structure
  const headers = useMemo(() => ['#', 'Patient', 'Email', 'Phone', 'Joined'], []);

  // Memoize skeleton rows to prevent re-creation
  const skeletonRows = useMemo(() => {
    return [...Array(rows)].map((_, index) => (
      <TableRow key={index} hover>
        {/* Row Number */}
        <TableCell>
          <Skeleton variant="text" width={20} height={20} />
        </TableCell>
        
        {/* Patient Info with Avatar */}
        <TableCell>
          <Box display="flex" alignItems="center" gap={2}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box>
              <Skeleton variant="text" width={120} height={16} />
              <Skeleton variant="text" width={80} height={14} />
            </Box>
          </Box>
        </TableCell>
        
        {/* Email */}
        <TableCell>
          <Skeleton variant="text" width={160} height={16} />
        </TableCell>
        
        {/* Phone */}
        <TableCell>
          <Skeleton variant="text" width={120} height={16} />
        </TableCell>
        
        {/* Joined Date */}
        <TableCell>
          <Box>
            <Skeleton variant="text" width={100} height={16} />
            <Skeleton variant="text" width={80} height={14} />
          </Box>
        </TableCell>
      </TableRow>
    ));
  }, [rows]);

  // Memoize header skeleton
  const headerSkeleton = useMemo(() => (
    <TableHead>
      <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
        {headers.map((header, index) => (
          <TableCell key={index}>
            <Skeleton variant="text" width={60} height={20} />
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  ), [theme.palette.grey, headers]);

  return (
    <TableContainer>
      <Table>
        {headerSkeleton}
        <TableBody>
          {skeletonRows}
        </TableBody>
      </Table>
    </TableContainer>
  );
});

TableSkeleton.displayName = 'TableSkeleton';

export default TableSkeleton;