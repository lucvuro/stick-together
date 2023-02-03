import useMusicBox from '@/hooks/useMusicBox';
import { Box, List, ListItem, Pagination, Typography } from '@mui/material';
import React, { useState } from 'react';
import { MusicItem } from './MusicItem';

export interface PlaylistProps {}

export default function PlayList(props: PlaylistProps) {
  const { playlist } = useMusicBox();
  const [page, setPage] = useState<number>(1);
  const PER_PAGE = 5;
  const count = Math.ceil(playlist.length / PER_PAGE);
  const begin = (page - 1) * PER_PAGE;
  const end = begin + PER_PAGE;

  const handleChangePage = (e: React.ChangeEvent<unknown>, p: number) => {
    setPage(p);
  };
  return (
    <>
      <Box
        sx={{
          width: '300px',
          bgcolor: 'rgba(0,0,0,0.6)',
          borderRadius: '.5rem',
          color: '#f6f6f6',
          padding: '.5rem',
          paddingLeft: '1rem',
        }}
      >
        <Typography variant="h5">Playlist</Typography>
      </Box>
      {playlist.length > 0 && (
        <>
          <List
            sx={{
              width: '300px',
            }}
          >
            {playlist.slice(begin, end).map((song) => {
              return (
                <ListItem
                  key={song.id + `${Math.floor(Math.random() * 9000) + 1000}`}
                >
                  <MusicItem song={song} />
                </ListItem>
              );
            })}
          </List>
          <Pagination
            count={count}
            page={page}
            onChange={(e, p) => {
              handleChangePage(e, p);
            }}
          />
        </>
      )}
      {playlist.length <= 0 && (
        <>
          <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', mt: '2rem'}}>
            <Typography variant='body1'>Empty list</Typography>
          </Box>
        </>
      )}
    </>
  );
}
