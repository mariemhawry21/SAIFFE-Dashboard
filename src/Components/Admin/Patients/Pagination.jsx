import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  useTheme,
  Skeleton
} from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange, loading, totalItems, itemsPerPage }) => {
  const theme = useTheme();

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const getDisplayRange = () => {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return { start, end };
  };

  const { start, end } = getDisplayRange();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}
      >
        <Skeleton variant="text" width={200} height={24} />
        <Box display="flex" alignItems="center" gap={1}>
          <Skeleton variant="circular" width={32} height={32} />
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" width={32} height={32} sx={{ borderRadius: 1 }} />
          ))}
          <Skeleton variant="circular" width={32} height={32} />
        </Box>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}
    >
      <Typography variant="body2" color="textSecondary">
        Showing {start} to {end} of {totalItems} patients
      </Typography>

      <Box display="flex" alignItems="center" gap={0.5}>
        <IconButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || loading}
          size="small"
          sx={{ 
            borderRadius: 1,
            '&:hover': { bgcolor: theme.palette.primary.main + '10' }
          }}
        >
          <ChevronLeft size={18} />
        </IconButton>

        {getPageNumbers().map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? 'contained' : 'outlined'}
            color={page === currentPage ? 'primary' : 'inherit'}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={loading || page === '...'}
            size="small"
            sx={{
              minWidth: 32,
              height: 32,
              borderRadius: 1,
              pointerEvents: page === '...' ? 'none' : 'auto',
              color: page === '...' ? 'text.disabled' : undefined,
              '&:hover': page !== '...' && page !== currentPage ? { 
                bgcolor: theme.palette.primary.main + '10',
                borderColor: theme.palette.primary.main 
              } : {}
            }}
          >
            {page}
          </Button>
        ))}

        <IconButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || loading}
          size="small"
          sx={{ 
            borderRadius: 1,
            '&:hover': { bgcolor: theme.palette.primary.main + '10' }
          }}
        >
          <ChevronRight size={18} />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Pagination;