import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import styles from '@/styles/UserControl.module.css';
import MicIcon from '@mui/icons-material/Mic';
import HeadsetIcon from '@mui/icons-material/Headset';
import SettingsIcon from '@mui/icons-material/Settings';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import useRoom from '@/hooks/useRoom';
import useUser from '@/hooks/useUser';
export interface UserControlProps {}

export function UserControl(props: UserControlProps) {
  const [mic, setMic] = useState<boolean>(false);
  const [headset, setHeadSet] = useState<boolean>(true);
  const { mediaStream, muteAllAudio } = useRoom();
  const { currentUserApp } = useUser();
  const setMuteMediaStream = (mute: boolean) => {
    if (mediaStream) {
      mediaStream.getAudioTracks()[0].enabled = mute;
    }
  };
  const handleOnClickMic = () => {
    setMic(!mic);
    setMuteMediaStream(!mic);
  };
  const handleOnClickHeadSet = () => {
    setHeadSet(!headset);
    setMic(!headset);
    setMuteMediaStream(!headset);
    muteAllAudio(headset);
    //Because headset is a boolean to render so will pass a headset will correct logic
    //Ex: If headset(UI) is off => muteAllAudio is true
  };
  return (
    <>
      <Box>
        <Divider />
        <Box className={styles.userControl}>
          <Box className={styles.userControlInfo}>
            <Button sx={{ display: 'flex', gap: '.5rem' }}>
              {currentUserApp?.photoUrl ? (
                <Avatar src={currentUserApp.photoUrl} sx={{ width: 36, height: 36 }}/>
              ) : (
                <Avatar sx={{ width: 36, height: 36 }}/>
              )}
              <Typography variant="body2" noWrap sx={{ textTransform: 'none' }}>
                {currentUserApp?.email}
              </Typography>
            </Button>
          </Box>
          <Box className={styles.userControlActions}>
            {mic ? (
              <Tooltip placement="top" arrow title="Mute">
                <IconButton onClick={handleOnClickMic}>
                  <MicIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip placement="top" arrow title="Unmute">
                <IconButton onClick={handleOnClickMic}>
                  <MicOffIcon />
                </IconButton>
              </Tooltip>
            )}
            {headset ? (
              <Tooltip placement="top" arrow title="Deaf">
                <IconButton onClick={handleOnClickHeadSet}>
                  <HeadsetIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip placement="top" arrow title="Undeaf">
                <IconButton onClick={handleOnClickHeadSet}>
                  <HeadsetOffIcon />
                </IconButton>
              </Tooltip>
            )}
            <Tooltip placement="top" arrow title="Settings">
              <span>
                <IconButton disabled>
                  <SettingsIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      </Box>
    </>
  );
}
