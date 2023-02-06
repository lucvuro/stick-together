import { Avatar, Box, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import styles from '@/styles/Chat.module.css';
import { Message } from '@/Contexts/roomContext';
import { converUTCStringToDateTime } from '@/utils/convertTime';
export interface MessageProps {
  message: Message | undefined;
}

export default function MessageComponent(props: MessageProps) {
  const { message } = props;
  return (
    <Box className={styles.message}>
      {message?.sender.photoUrl ? (
        <Avatar src={message?.sender.photoUrl} alt="message-avatar">V</Avatar>
      ) : (
        <Avatar alt="message-avatar"/>
      )}
      <Box className={styles.messageContent}>
        <div className={styles.messageNickname}>
          <p>{message?.sender.nickname ? message?.sender.nickname : message?.sender.email}</p>
          {message?.createdAt && <Typography className={styles.messageTime} variant='caption'>{converUTCStringToDateTime(message.createdAt, 'DD/MM/YYYY hh:mm A')}</Typography>}
        </div>
        <p className={styles.messageText}>{message?.content}</p>
      </Box>
    </Box>
  );
}
