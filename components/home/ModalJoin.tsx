import { Modal, Box, TextField, Button } from '@mui/material';
import React, { SetStateAction, useEffect, useRef } from 'react';
import styles from '@/styles/Home.module.css';
import { STYLE_MODAL } from '@/constants/modal';
import { LoadingButton } from '@mui/lab';
export interface ModalJoinProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

export function ModalJoin(props: ModalJoinProps) {
  const handleClose = () => {
    props.setOpen(false);
  };
  return (
    <Modal open={props.open} onClose={handleClose}>
      <Box style={STYLE_MODAL}>
        <Box className={styles.homeModalJoin}>
          <TextField
            placeholder="Room ID"
            autoFocus={true}
            fullWidth
          />
          <Box className={styles.homeModalJoinActions}>
            <LoadingButton variant="contained" size="large">
              Join
            </LoadingButton>
            <Button onClick={handleClose} variant="outlined" size="large">
              Close
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
