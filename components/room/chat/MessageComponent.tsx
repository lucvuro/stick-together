import { Avatar, Box } from '@mui/material';
import React, { useEffect } from 'react';
import styles from '@/styles/Chat.module.css';
import { Message } from '@/Contexts/roomContext';
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
        <p>{message?.sender.email}</p>
        <p className={styles.messageText}>{message?.content}</p>
      </Box>
    </Box>
  );
}
