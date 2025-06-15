import React from 'react';
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

const TableSkeleton = ({ rows = 10 }) => {
  const theme = useTheme();

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
            {['#', 'Patient', 'Email', 'Phone', 'Gender', 'Birth Date', 'Address', 'Joined'].map((header, index) => (
              <TableCell key={index}>
                <Skeleton variant="text" width={60} height={20} />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {[...Array(rows)].map((_, index) => (
            <TableRow key={index} hover>
              <TableCell>
                <Skeleton variant="text" width={20} height={20} />
              </TableCell>
              <TableCell>
                <Box display="flex" alignItems="center" gap={2}>
                  <Skeleton variant="circular" width={40} height={40} />
                  <Box>
                    <Skeleton variant="text" width={120} height={16} />
                    <Skeleton variant="text" width={80} height={14} />
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={160} height={16} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={120} height={16} />
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={60} height={16} />
              </TableCell>
              <TableCell>
                <Box>
                  <Skeleton variant="text" width={100} height={16} />
                  <Skeleton variant="text" width={60} height={14} />
                </Box>
              </TableCell>
              <TableCell>
                <Skeleton variant="text" width={140} height={16} />
              </TableCell>
              <TableCell>
                <Box>
                  <Skeleton variant="text" width={100} height={16} />
                  <Skeleton variant="text" width={80} height={14} />
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableSkeleton;