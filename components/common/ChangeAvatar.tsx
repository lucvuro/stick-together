import { STYLE_MODAL } from '@/constants/modal';
import { IconButton, Modal, Slider, Stack, Typography } from '@mui/material';
import { Box } from '@mui/system';
import React, { SetStateAction, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/components/common/Modal/ModalComponent.module.css';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import ModalComponent from './Modal/ModalComponent';
const Avatar = dynamic(() => import('react-avatar-edit'), { ssr: false });
export interface IChangeAvatarModal {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

export default function ChangeAvatarModal(props: IChangeAvatarModal) {
  const [source, setSource] = useState<string>('');
  const onClose = () => {
    props.setOpen(false);
  };
  const onApply = () => {
    console.log(source);
  };
  return (
    <ModalComponent
      open={props.open}
      onClose={onClose}
      onApply={onApply}
      footer
      title='Edit Image'
    >
      <Avatar
        width={400}
        height={295}
        exportSize={500}
        exportAsSquare
        onCrop={(data) => {
          setSource(data);
        }}
        labelStyle={{color: '#f6f6f6', fontSize: '1.3rem'}}
      />
    </ModalComponent>
  );
}
