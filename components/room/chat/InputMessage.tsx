import { Box, TextField } from '@mui/material';
import React, {
  ChangeEvent,
  KeyboardEvent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styles from '@/styles/Chat.module.css';
import { CurrentRoom, Member, Message, RoomContext } from '@/Contexts/roomContext';
import useAuth from '@/hooks/useAuth';
import useDatabase from '@/hooks/useDatabase';
import useRoom from '@/hooks/useRoom';
import useUser from '@/hooks/useUser';
export interface InputMessageProps {}

export function InputMessage(props: InputMessageProps) {
  const {currentUserApp} = useUser()
  const {currentRoom, listMember} = useRoom()
  const { addChatToRoom, loadingAdd } = useDatabase();
  const [message, setMessage] = useState<string>('');
  const handleOnChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setMessage(e.target.value);
  };
  const inputRef = useRef<any>(null);
  const handleOnPressKey = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    if (e.key === 'Enter') {
      if (message && currentRoom && currentUserApp) {
        let nickname = ''
        listMember.forEach((member: Member) => {
          if (member.uid === currentUserApp.uid && member.nickname){
            nickname = member.nickname
          }
        })
        const messageToSend: Message = {
          content: message,
          sender: {
            uid: currentUserApp.uid,
            email: currentUserApp.email,
            photoUrl: currentUserApp.photoUrl,
            isOnline: true,
            nickname: nickname,
          },
          mid: '',
          createdAt: new Date().toUTCString()
        };
        addChatToRoom(currentRoom, messageToSend);
        setMessage('');
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }
    }
  };
  return (
    <Box className={styles.inputMessage}>
      <TextField
        inputProps={{ onKeyUpCapture: (e) => handleOnPressKey(e) }}
        value={message}
        onChange={(e) => {
          handleOnChange(e);
        }}
        placeholder="Message"
        fullWidth
        inputRef={inputRef}
      />
    </Box>
  );
}
