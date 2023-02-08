import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import React from 'react';
import styles from '@/styles/MusicBox.module.css'
import { Song } from '@/Contexts/musicboxContext';
import defaultMusic from '@/assets/images/defaultMusic.jpeg'

export interface MusicItemProps {
  song: Song
}

export function MusicItem(props: MusicItemProps) {
  return (
    <Box className={styles.musicBoxItem}>
      <Image
        width={100}
        height={60}
        src={props.song.thumbnail || defaultMusic }
        alt="image"
      />
      <Box sx={{ml: '.5rem', width: '170px'}}>
        <Typography color='primary' noWrap>{props.song.title}</Typography>
        <Typography color='primary' variant='caption' noWrap>{props.song.author}</Typography>
      </Box>
    </Box>
  );
}
