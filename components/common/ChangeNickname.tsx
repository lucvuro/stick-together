import useDatabase from '@/hooks/useDatabase';
import useRoom from '@/hooks/useRoom';
import useUser from '@/hooks/useUser';
import { Stack, TextField } from '@mui/material';
import React, { SetStateAction, useEffect, useState } from 'react';
import ModalComponent from './Modal/ModalComponent';
const ChangeNickname = (props: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [valueNickname, setValueNickname] = useState<string>('');
  const [valueAbout, setValueAbout] = useState<string>('');
  const {currentUserApp} = useUser()
  const {currentRoom} = useRoom()
  const {updateNicknameMemberFromRoom, loadingUpdate} = useDatabase()
  const onCloseChangeNickname = () => {
    setValueAbout('')
    setValueNickname('')
    props.setOpen(false);
  };
  const onApply = async () => {
    if (currentRoom && currentUserApp){
        const info = {
            nickname: valueNickname,
            about: valueAbout
        }
        await updateNicknameMemberFromRoom(currentRoom.roomId, currentUserApp.uid, info)
        onCloseChangeNickname()
    }
    
  };
  return (
    <ModalComponent
      title="Change Nickname"
      open={props.open}
      onClose={onCloseChangeNickname}
      onApply={onApply}
      footer
      loading={loadingUpdate}
    >
      <Stack
        direction="column"
        spacing={2}
        sx={{ width: { md: '500px', xs: '100%' } }}
      >
        <TextField
          label="Nickname"
          value={valueNickname}
          onChange={(e) => setValueNickname(e.currentTarget.value)}
          disabled={loadingUpdate}
        />
        <TextField
          label="About Me"
          rows={4}
          multiline
          value={valueAbout}
          onChange={(e) => setValueAbout(e.currentTarget.value)}
          disabled={loadingUpdate}
        />
      </Stack>
    </ModalComponent>
  );
};

export default ChangeNickname;
