import {
  Box,
  Button,
  CircularProgress,
  Fab,
  Modal,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import { MusicBox } from '@/components/musicbox/MusicBox';
import useMusicBox from '@/hooks/useMusicBox';
import { STYLE_MODAL } from '@/constants/modal';
import useRoom from '@/hooks/useRoom';
import LoadingComponent from '@/components/common/LoadingComponent';

export interface MusicBoxModalProps {}

export function MusicBoxModal(props: MusicBoxModalProps) {
  const { openMusicBox, setOpenMusicBox } = useMusicBox();
  const { currentRoom } = useRoom();
  const [connected, setConnected] = useState<boolean>(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [volume, setVolume] = useState<number>(0.8);
  const setVolumeAudio = (level: number) => {
    setVolume(level);
    if (audio) {
      audio.volume = level;
    }
  };
  const connectToMusicBox = () => {
    if (!connected && currentRoom && !audio) {
      const audio = new Audio();
      audio.src = `${process.env.NEXT_PUBLIC_APILINK}/stream/${currentRoom.roomId}/view`;
      audio.volume = 0.8;
      audio.play();
      audio.addEventListener('canplay', (e) => {
        setConnected(true);
      });
      setAudio(audio);
    }
    setOpenMusicBox(true);
  };
  useEffect(() => {
    if (audio) {
      return () => {
        audio.removeEventListener('canplay', (e) => {
          setConnected(true);
        });
      };
    }
  }, [audio]);
  return (
    <>
      {!openMusicBox && (
        <Box sx={{ position: 'absolute', bottom: '16px', right: '16px' }}>
          <Fab
            color="primary"
            aria-label="music-box"
            onClick={() => {
              connectToMusicBox();
            }}
          >
            <MusicNoteIcon />
          </Fab>
        </Box>
      )}
      <Modal
        keepMounted
        onClose={() => setOpenMusicBox(false)}
        open={openMusicBox}
      >
        {connected ? (
          <Box sx={STYLE_MODAL}>
            <MusicBox setVolumeAudio={setVolumeAudio} volume={volume} />
          </Box>
        ) : (
          <Box sx={STYLE_MODAL}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: { md: '730px', xs: '250px' },
                height: { md: '300px' },
              }}
            >
              <LoadingComponent/>
              <Typography>Connecting to Music Box...</Typography>
            </Box>
          </Box>
        )}
      </Modal>
    </>
  );
}
