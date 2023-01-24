import { Box, List, ListItem } from '@mui/material';
import React, { useContext, useEffect, useRef } from 'react';
import { InputMessage } from './chat/InputMessage';
import styles from '@/styles/Chat.module.css';
import { Message} from '@/Contexts/roomContext';
import MessageComponent from './chat/MessageComponent';
import useRoom from '@/hooks/useRoom';
import useDatabase from '@/hooks/useDatabase';
import { ObjectBindingOrAssignmentPattern } from 'typescript';
export interface ChatComponentProps {}

export default function ChatComponent(props: ChatComponentProps) {
  const spanRef = useRef<null | HTMLElement>(null);
  const {listMessage, setListMessage, currentRoom} = useRoom()
  const {onValueCustom} = useDatabase()
  useEffect(() => {
    if (spanRef.current) {
      //This useEffect to scroll last message
      spanRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [listMessage]);
  useEffect(() => {
    const unsub = onValueCustom(`rooms/${currentRoom?.roomId}/chats`, (messages: Object) => {
      if(messages){
        setListMessage(Object.values(messages))
      }
    })
    return () => unsub()
  },[])
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
