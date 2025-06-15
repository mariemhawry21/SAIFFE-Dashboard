import React from 'react';
import { TextField, InputAdornment, CircularProgress, useTheme } from '@mui/material';
import { Search } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm, onSearch, loading }) => {
  const theme = useTheme();

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      onSearch();
    }, 500);
  };

  return (
    <TextField
      placeholder="Search by name or email..."
      variant="outlined"
      size="small"
      value={searchTerm}
      onChange={handleInputChange}
      onKeyPress={handleKeyPress}
      disabled={loading}
      sx={{ 
        minWidth: 320,
        '& .MuiOutlinedInput-root': {
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
        }
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
        )
      }}
    />
  );
};

export default SearchBar;