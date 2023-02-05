import useMusicBox from '@/hooks/useMusicBox';
import {
  Box,
  Collapse,
  List,
  ListItem,
  Pagination,
  Stack,
  Typography,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import { MusicItem } from './MusicItem';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { TransitionGroup } from 'react-transition-group';
import EmptyComponent from '../common/EmptyComponent';
export interface PlaylistProps {}

export default function PlayList(props: PlaylistProps) {
  const { playlist } = useMusicBox();
  const [page, setPage] = useState<number>(1);
  const PER_PAGE = 5;
  const count = Math.ceil(playlist.length / PER_PAGE);
  const begin = (page - 1) * PER_PAGE;
  const end = begin + PER_PAGE;
  const refList = useRef(null);
  const handleChangePage = (e: React.ChangeEvent<unknown>, p: number) => {
    setPage(p);
  };
  return (
    <>
      <Box
        sx={{
          width: {xs: '100%', md: '343px'},
          bgcolor: 'rgba(0,0,0,0.6)',
          borderRadius: '.5rem',
          color: '#f6f6f6',
          padding: '.5rem',
          paddingLeft: '1rem',
        }}
      >
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={0.5}>
          <Typography variant="h5">Playlist</Typography>
          <QueueMusicIcon />
        </Stack>
      </Box>
      {playlist.length > 0 && (
        <Box>
          <List
            sx={{
              width: '300px',
              padding: '.5rem',
            }}
            disablePadding
          >
            <TransitionGroup>
              {playlist.slice(begin, end).map((song) => {
                return (
                  <Collapse
                    timeout="auto"
                    // container={refList.current}
                    key={song.id + `${Math.floor(Math.random() * 9000) + 1000}`}
                  >
                    <ListItem disablePadding>
                      <MusicItem song={song} />
                    </ListItem>
                  </Collapse>
                );
              })}
            </TransitionGroup>
          </List>
          <Pagination
            count={count}
            page={page}
            onChange={(e, p) => {
              handleChangePage(e, p);
            }}
          />
        </Box>
      )}
      {playlist.length <= 0 && (
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: '2rem',
            }}
          >
            <EmptyComponent/>
          </Box>
        </>
      )}
    </>
  );
}
