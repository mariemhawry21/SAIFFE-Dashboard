import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TextField, InputAdornment, CircularProgress, useTheme } from '@mui/material';
import { Search } from 'lucide-react';

const SearchBar = React.memo(({ onSearch, loading }) => {
  const theme = useTheme();
  const searchTimeout = useRef(null);
  const [localSearch, setLocalSearch] = useState('');

  // Memoized input change handler
  const handleInputChange = useCallback((e) => {
    const value = e.target.value;
    setLocalSearch(value);

    // Clear existing timeout
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    // Handle empty search immediately
    if (value.trim() === '') {
      onSearch('');
      return;
    }

    // Debounce search for non-empty values
    searchTimeout.current = setTimeout(() => {
      onSearch(value.trim());
    }, 500); // Increased debounce time for better performance
  }, [onSearch]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, []);

  return (
    <TextField
      placeholder="Search by name or email..."
      variant="outlined"
      size="small"
      value={localSearch}
      onChange={handleInputChange}
      disabled={loading}
      sx={{
        minWidth: 320,
        '& .MuiOutlinedInput-root': {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        },
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search size={18} color={theme.palette.text.secondary} />
          </InputAdornment>
        ),
        endAdornment: loading && (
          <InputAdornment position="end">
            <CircularProgress size={18} thickness={5} color="primary" />
          </InputAdornment>
        ),
      }}
    />
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;