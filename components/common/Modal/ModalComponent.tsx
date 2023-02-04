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
  onApply: () => void;
}
export default function ModalComponent({
  title = '',
  open,
  children,
  footer = false,
  onClose,
  onApply,
}: IModalComponent) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box style={STYLE_MODAL}>
        <Box sx={{ color: 'text.primary' }}>
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
          {footer && (
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
                <LoadingButton onClick={() => onApply()} variant="contained">
                  Apply
                </LoadingButton>
              </Stack>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
}
