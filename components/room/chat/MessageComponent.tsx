import { Avatar, Box } from '@mui/material';
import React, { useEffect } from 'react';
import styles from '@/styles/Chat.module.css';
import { Message } from '@/Contexts/roomContext';
export interface MessageProps {
  message: Message | undefined;
}

export default function MessageComponent(props: MessageProps) {
  const {message} = props
  return (
    <Box className={styles.message}>
      <Avatar alt="message-avatar">V</Avatar>
      <Box className={styles.messageContent}>
        <p>{message?.sender.email}</p>
        <p className={styles.messageText}>{message?.content}</p>
      </Box>
    </Box>
  );
}
