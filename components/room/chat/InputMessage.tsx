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
import { CurrentRoom, Message, RoomContext } from '@/Contexts/roomContext';
import useAuth from '@/hooks/useAuth';
import useDatabase from '@/hooks/useDatabase';
export interface InputMessageProps {}

export function InputMessage(props: InputMessageProps) {
  const { authContext } = useAuth();
  const { currentUser } = authContext;
  const roomContext = useContext(RoomContext);
  const { currentRoom } = roomContext;
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
      if (message && currentRoom && currentUser) {
        const messageToSend: Message = {
          content: message,
          sender: {
            uid: currentUser.uid,
            email: currentUser.email,
            photoUrl: currentUser.photoURL,
          },
          mid: '',
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
