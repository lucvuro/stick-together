import { Box, Button, Fab, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import { MusicBox } from '@/components/musicbox/MusicBox';
import useMusicBox from '@/hooks/useMusicBox';
import { STYLE_MODAL } from '@/constants/modal';
import useRoom from '@/hooks/useRoom';

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
    if (!connected && currentRoom) {
      const audio = new Audio();
      audio.src = `http://localhost:8080/stream/${currentRoom.roomId}/view`;
      audio.volume = 0.8;
      audio.play();
      setConnected(true);
      setOpenMusicBox(true)
      setAudio(audio);
    }
  };
  return (
    <>
      {!openMusicBox && connected && (
        <Box sx={{ position: 'absolute', bottom: '16px', right: '16px' }}>
          <Fab
            color="primary"
            aria-label="music-box"
            onClick={() => {
              setOpenMusicBox(true);
            }}
          >
            <MusicNoteIcon />
          </Fab>
        </Box>
      )}
      {!openMusicBox && !connected && (
        <Box sx={{ position: 'absolute', bottom: '16px', right: '16px' }}>
          <Fab
            color="primary"
            aria-label="music-box"
            onClick={() => {
              connectToMusicBox();
            }}
          >
            <MusicOffIcon />
          </Fab>
        </Box>
      )}
      <Modal
        keepMounted
        onClose={() => setOpenMusicBox(false)}
        open={openMusicBox}
      >
        <Box sx={STYLE_MODAL}>
          <MusicBox setVolumeAudio={setVolumeAudio} volume={volume} />
        </Box>
        {/* {connected ? (
          <Box sx={STYLE_MODAL}>
            <MusicBox setVolumeAudio={setVolumeAudio} volume={volume}/>
          </Box>
        ) : (
          <>
            <Box sx={STYLE_MODAL}>
              <Button
                onClick={() => {
                  if (currentRoom) {
                    const audio = new Audio();
                    audio.src = `http://localhost:8080/stream/${currentRoom.roomId}/view`;
                    audio.volume=0.8
                    audio.play();
                    setConnected(true);
                    setAudio(audio)
                  }
                }}
              >
                Connect to Musicbox
              </Button>
            </Box>
          </>
        )} */}
      </Modal>
      {/* {currentRoom && currentRoom.roomId && <audio id="music-box-player" autoPlay>
        <source
          src={url}
          type="audio/mpeg"
        />
      </audio>} */}
    </>
  );
}
