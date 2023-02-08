import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { SetStateAction, useState } from 'react';
import styles from '@/styles/UserControl.module.css';
import MicIcon from '@mui/icons-material/Mic';
import HeadsetIcon from '@mui/icons-material/Headset';
import SettingsIcon from '@mui/icons-material/Settings';
import MicOffIcon from '@mui/icons-material/MicOff';
import HeadsetOffIcon from '@mui/icons-material/HeadsetOff';
import useRoom from '@/hooks/useRoom';
import useUser from '@/hooks/useUser';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import EditIcon from '@mui/icons-material/Edit';
import ChangeAvatarModal from '../common/ChangeAvatar';
import ModalComponent from '../common/Modal/ModalComponent';
import ChangeNickname from '../common/ChangeNickname';
export interface UserControlProps {}

export function UserControl(props: UserControlProps) {
  const EditMenu = () => {
    return (
      <MenuList>
        <MenuItem onClick={() => setOpenAvatar(true)}>
          <ListItemIcon>
            <AccountBoxIcon />
          </ListItemIcon>
          Change Avatar
        </MenuItem>
        <MenuItem onClick={() => setOpenNickname(true)}>
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          Change Nickname
        </MenuItem>
      </MenuList>
    );
  };
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
  const [anchorEl, setAnchorEl] = useState<
    (EventTarget & HTMLButtonElement) | null
  >(null);
  const open = Boolean(anchorEl);
  const handleCloseEditMenu = () => {
    setAnchorEl(null);
  };
  const handleClickShowEditMenu = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  };
  const [openAvatar, setOpenAvatar] = useState<boolean>(false);
  const [openNickname, setOpenNickname] = useState<boolean>(false);
  return (
    <>
      <Box>
        <Divider />
        <Box className={styles.userControl}>
          <Box className={styles.userControlInfo}>
            <Button
              sx={{ display: 'flex', gap: '.5rem' }}
              onClick={(e) => handleClickShowEditMenu(e)}
            >
              {currentUserApp?.photoUrl ? (
                <Avatar
                  src={currentUserApp.photoUrl}
                  sx={{ width: 36, height: 36 }}
                />
              ) : (
                <Avatar sx={{ width: 36, height: 36 }} />
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
      <Popover
        id="popver-profile-card"
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseEditMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        elevation={24}
      >
        <EditMenu />
      </Popover>
      <ChangeAvatarModal open={openAvatar} setOpen={setOpenAvatar} />
      <ChangeNickname open={openNickname} setOpen={setOpenNickname} />
    </>
  );
}
