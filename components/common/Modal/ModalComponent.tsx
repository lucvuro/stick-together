import { STYLE_MODAL } from '@/constants/modal';
import { IconButton, Modal, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { ReactNode, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/components/common/Modal/ModalComponent.module.css';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
export interface IModalComponent {
  title?: string;
  open: boolean;
  children: ReactNode;
  footer?: boolean;
  onClose: () => void;
  onApply?: () => void;
  loading?: boolean;
  okText?: string;
}
export default function ModalComponent({
  title = '',
  open,
  children,
  footer = false,
  loading,
  onClose,
  onApply,
  okText,
}: IModalComponent) {
  return (
    <Modal open={open} onClose={onClose} disableAutoFocus>
      <Box style={STYLE_MODAL}>
        <Box className={styles.mainModal} sx={{ color: 'text.primary' }}>
          <Stack direction="row" className={styles.headerModal}>
            <Typography variant="h5">{title}</Typography>
            <IconButton
              onClick={() => {
                onClose();
              }}
            >
              <CloseIcon />
            </IconButton>
          </Stack>
          <Box className={styles.contentModal}>{children}</Box>
          {footer && onApply && (
            <Box className={styles.footerModal}>
              <Stack className="buttonLeftModal"></Stack>
              <Stack
                spacing=".8rem"
                direction="row"
                className="buttonRightModal"
              >
                <LoadingButton onClick={() => onClose()} variant="text">
                  Cancel
                </LoadingButton>
                {loading ? (
                  <LoadingButton
                    loading={loading}
                    onClick={() => onApply()}
                    variant="contained"
                  >
                    {okText ? okText : 'Apply'}
                  </LoadingButton>
                ) : (
                  <LoadingButton onClick={() => onApply()} variant="contained">
                    {okText ? okText : 'Apply'}
                  </LoadingButton>
                )}
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
