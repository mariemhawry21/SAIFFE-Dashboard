import React, { useRef, useEffect, useState } from 'react';
import { TextField, InputAdornment, CircularProgress, useTheme } from '@mui/material';
import { Search } from 'lucide-react';

const SearchBar = ({ onSearch, loading }) => {
  const theme = useTheme();
  const searchTimeout = useRef(null);
  const [localSearch, setLocalSearch] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value); // خلي الكتابة محليًا بس

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (value.trim() === '') {
      onSearch('');
    } else {
      searchTimeout.current = setTimeout(() => {
        onSearch(value);
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
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
};

export default SearchBar;
