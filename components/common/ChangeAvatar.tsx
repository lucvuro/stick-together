import { STYLE_MODAL } from '@/constants/modal';
import {
  CircularProgress,
  IconButton,
  Modal,
  Slider,
  Stack,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import React, { SetStateAction, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from '@/components/common/ChangeAvatar.module.css';
import { LoadingButton } from '@mui/lab';
import CloseIcon from '@mui/icons-material/Close';
import ModalComponent from './Modal/ModalComponent';
import useStorage from '@/hooks/useStorage';
import useUser from '@/hooks/useUser';
import useRoom from '@/hooks/useRoom';
const Avatar = dynamic(() => import('react-avatar-edit'), { ssr: false });
export interface IChangeAvatarModal {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}

export default function ChangeAvatarModal(props: IChangeAvatarModal) {
  const [source, setSource] = useState<string>('');
  const [typeImage, setTypeImage] = useState<string>();
  const { uploadAvatar, loadingUpload, processUpload } = useStorage();
  const { currentUserApp } = useUser();
  const onClose = () => {
    props.setOpen(false);
  };
  const onApply = () => {
    if (currentUserApp && typeImage && source) {
      uploadAvatar(currentUserApp.uid, source, typeImage, onClose);
    //   onClose();
    }
  };
  const onFileLoad = (file: File | React.ChangeEvent<HTMLInputElement>) => {
    setTypeImage(file.type);
  };
  return (
    <ModalComponent
      open={props.open}
      onClose={onClose}
      onApply={onApply}
      footer
      title="Edit Image"
      loading={loadingUpload}
    >
      <>
        <Box className={styles.previewAvatar}>
          <Avatar
            width={400}
            height={295}
            exportSize={500}
            exportAsSquare
            onCrop={(data) => {
              setSource(data);
            }}
            onFileLoad={(data) => onFileLoad(data)}
            labelStyle={{ color: '#f6f6f6', fontSize: '1.3rem' }}
          />
          {loadingUpload && <div className={styles.loadingUploadAvatar}>
            <CircularProgress variant="determinate" value={processUpload}/>
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="subtitle2"
                component="div"
                color="text.primary"
              >{`${processUpload}%`}</Typography>
            </Box>
          </div>}
        </Box>
      </>
    </ModalComponent>
  );
}
