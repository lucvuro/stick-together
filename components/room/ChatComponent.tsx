import { Box, List, ListItem } from '@mui/material';
import React, { useContext, useEffect, useRef } from 'react';
import { InputMessage } from './chat/InputMessage';
import styles from '@/styles/Chat.module.css';
import useDatabase from '@/hooks/useDatabase';
import { Message, RoomContext } from '@/Contexts/roomContext';
import MessageComponent from './chat/MessageComponent';
import { DataSnapshot, onChildAdded, ref } from 'firebase/database';
import { database } from '@/firebase';
export interface ChatComponentProps {}

export default function ChatComponent(props: ChatComponentProps) {
  const spanRef = useRef<null | HTMLElement>(null);
  const roomContext = useContext(RoomContext);
  const {
    currentRoom,
    listMessage,
    setListMessage,
  } = roomContext;
  useEffect(() => {
    if (spanRef.current) {
      //This useEffect to scroll last message
      spanRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [listMessage]);
  return (
    <Box className={styles.chat}>
      <List className={styles.chatListMessage} disablePadding>
        <>
          {listMessage.map((message: Message) => {
            return (
              <ListItem key={message.mid} disablePadding>
                <MessageComponent message={message} />
              </ListItem>
            );
          })}
          <span ref={spanRef}></span>
        </>
      </List>
      <InputMessage />
    </Box>
  );
}
