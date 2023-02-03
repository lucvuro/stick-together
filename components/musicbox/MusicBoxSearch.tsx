import { Box, InputAdornment, TextField } from '@mui/material';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
export interface MusicBoxSearchProps {}

export default function MusicBoxSearch(props: MusicBoxSearchProps) {
  return (
    <Box>
      <TextField
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        placeholder="Search music..."
        fullWidth
      />
    </Box>
  );
}
