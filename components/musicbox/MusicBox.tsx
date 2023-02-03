import { Box, Button } from '@mui/material';
import * as React from 'react';
import MusicPlayer from './MusicPlayer';
import styles from '@/styles/MusicBox.module.css';
import MusicBoxSearch from './MusicBoxSearch';
import PlayList from './PlayList';
import useMusicBox from '@/hooks/useMusicBox';
export interface MusicBoxProps {
  volume: number;
  setVolumeAudio: (level: number) => void
}

export function MusicBox(props: MusicBoxProps) {
  const {currentSong, playlist} = useMusicBox()
  return (
    <Box className={styles.mainMusicBox}>
      <Box className={styles.musicBoxLeftContent}>
        <Box>
          <MusicPlayer volume={props.volume} setVolumeAudio={props.setVolumeAudio}/>
          
        </Box>
        <Box>
          <MusicBoxSearch/>
        </Box>
      </Box>
      <Box>
        <PlayList/>
      </Box>
    </Box>
  );
}
