import { Modal, Box, TextField, Button } from '@mui/material';
import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import styles from '@/styles/Home.module.css';
import { STYLE_MODAL } from '@/constants/modal';
import { LoadingButton } from '@mui/lab';
import { Controller, useForm } from 'react-hook-form';
import useAuth from '@/hooks/useAuth';
import ModalComponent from '../common/Modal/ModalComponent';
export interface ModalJoinProps {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}
interface FormData {
  room: string;
}
export function ModalJoin(props: ModalJoinProps) {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { room: '' } });
  const handleClose = () => {
    props.setOpen(false);
  };
  const [loading, setLoading] = useState<boolean>(false);
  const { router } = useAuth();
  const onSubmit = (formData: FormData) => {
    setLoading(true);
    router.push(`/room/${formData.room}`);
  };
  return (
    <ModalComponent
      loading={loading}
      open={props.open}
      onClose={handleClose}
      title="JOIN ROOM"
      footer
      onApply={handleSubmit(onSubmit)}
      okText='JOIN'
    >
      <Box className={styles.homeModalJoin} sx={{ color: 'text.primary' }}>
        <Controller
          name="room"
          control={control}
          rules={{ required: '*Room ID is required' }}
          render={({ field: { onChange, value } }) => {
            return (
              <TextField
                placeholder="Room ID"
                autoFocus={true}
                fullWidth
                value={value}
                onChange={onChange}
                disabled={isSubmitting}
                error={!!errors['room']}
                helperText={
                  !!errors['room'] ? errors['room'].message?.toString() : ''
                }
              />
            );
          }}
        />{' '}
        {/* <Box className={styles.homeModalJoinActions}>
            <LoadingButton loading={loading} onClick={handleSubmit(onSubmit)} variant="contained" size="large">
              Join
            </LoadingButton>
            <Button onClick={handleClose} variant="outlined" size="large">
              Cancel
            </Button>
          </Box> */}
      </Box>
    </ModalComponent>
  );
}
