import {
  Autocomplete,
  Box,
  CircularProgress,
  debounce,
  InputAdornment,
  TextField,
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import useMusicBox from '@/hooks/useMusicBox';
import { MusicItem } from './MusicItem';
export interface MusicBoxSearchProps {}

export default function MusicBoxSearch(props: MusicBoxSearchProps) {
  const {
    searchYoutube,
    loadingSearch,
    options,
    addMusicToPlaylist,
    loadingAdd,
  } = useMusicBox();
  const searchDebounce = debounce(searchYoutube, 250);
  const searchDebounceCallback = useCallback(searchDebounce, []);
  const [value, setValue] = useState<string>('');
  return (
    <Box>
      <Autocomplete
        freeSolo
        id="search-result"
        options={options.map((option) => JSON.stringify(option))}
        // getOptionLabel = {(option) => option.title }
        filterOptions={(options) => options}
        loading={loadingSearch}
        loadingText="Loading..."
        renderInput={(params) => (
          <TextField
            {...params}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  <InputAdornment position="end" sx={{ gap: '1rem' }}>
                    {/* {loadingSearch && <CircularProgress size="1rem" />} */}
                    <SearchIcon />
                  </InputAdornment>
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            placeholder="Search music..."
            fullWidth
          />
        )}
        renderOption={(props, option) => (
          <li {...props}>
            <MusicItem song={JSON.parse(option)} />
          </li>
        )}
        noOptionsText="Not found"
        onChange={(e, value, reason) => {
          if (reason === 'selectOption' && value) {
            addMusicToPlaylist(value);
          }
        }}
        onInputChange={(e, value, reason) => {
          if (reason === 'input') {
            searchDebounceCallback(value);
            setValue(value);
          } else if (reason === 'reset') {
            setValue('');
          }
        }}
        inputValue={value}
        disableClearable={true}
        disabled={loadingAdd}
      />
    </Box>
  );
}
